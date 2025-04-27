// pages/api/followers.js
import { supabase } from "../../lib/supabaseServer";
import { getUserIdFromReq } from "../../lib/auth";

export default async function handler(req, res) {
	const me = getUserIdFromReq(req);
	if (!me) return res.status(401).json({ error: "Unauthorized" });

	try {
		// Embed 'users' via the follower_id foreign key
		const { data, error } = await supabase
			.from("follows")
			.select("follower_id, users!follows_follower_id_fkey(id, name)")
			.eq("followed_id", me);

		if (error) throw error;

		const followers = data.map((f) => ({
			id: f.follower_id,
			name: f["users!follows_follower_id_fkey"].name,
		}));

		return res.status(200).json(followers);
	} catch (err) {
		console.error("Error fetching followers:", err);
		return res.status(500).json({ error: err.message });
	}
}
