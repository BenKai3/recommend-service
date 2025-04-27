// pages/api/following.js
import { supabase } from "../../lib/supabaseServer";
import { getUserIdFromReq } from "../../lib/auth";

export default async function handler(req, res) {
	const me = getUserIdFromReq(req);
	if (!me) return res.status(401).json({ error: "Unauthorized" });

	try {
		const { data, error } = await supabase
			.from("follows")
			// Embed the 'users' record where users.id = follows.followed_id
			.select("followed_id, users!follows_followed_id_fkey(id, name)")
			.eq("follower_id", me);

		if (error) throw error;

		const following = data.map((f) => {
			const userRec = f["users!follows_followed_id_fkey"] || {};
			return { id: f.followed_id, name: userRec.name };
		});

		return res.status(200).json(following);
	} catch (err) {
		console.error("Error fetching following:", err);
		return res.status(500).json({ error: err.message });
	}
}
