// pages/api/following.js
import { supabase } from "../../lib/supabaseServer";
import { getUserIdFromReq } from "../../lib/auth";

export default async function handler(req, res) {
	const me = getUserIdFromReq(req);
	if (!me) return res.status(401).json({ error: "Unauthorized" });

	try {
		// embed the 'users' row for followed_id under the alias 'followed_user'
		const { data, error } = await supabase
			.from("follows")
			.select(
				`
        followed_id,
        followed_user:users!follows_followed_id_fkey (
          id,
          name
        )
      `
			)
			.eq("follower_id", me);

		if (error) throw error;

		// now every row has .followed_user
		const following = data.map((row) => ({
			id: row.followed_user.id,
			name: row.followed_user.name,
		}));

		return res.status(200).json(following);
	} catch (err) {
		console.error("Error fetching following:", err);
		return res.status(500).json({ error: err.message });
	}
}
