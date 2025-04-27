// pages/api/follow/[userId].js

import { supabase } from "../../../lib/supabaseServer";
import { getUserIdFromReq } from "../../../lib/auth";

export default async function handler(req, res) {
	const me = getUserIdFromReq(req);
	const them = req.query.userId;
	if (!me) return res.status(401).json({ error: "Unauthorized" });
	if (me === them)
		return res.status(400).json({ error: "Cannot follow yourself" });

	if (req.method === "POST") {
		// Attempt to follow
		const { error } = await supabase
			.from("follows")
			.insert([{ follower_id: me, followed_id: them }]);
		if (error) {
			// Unique-violation => already following
			if (error.code === "23505") {
				return res
					.status(409)
					.json({ error: "Already following user" });
			}
			return res.status(400).json({ error: error.message });
		}
		return res.status(201).end();
	}

	if (req.method === "DELETE") {
		// Unfollow
		const { error } = await supabase
			.from("follows")
			.delete()
			.match({ follower_id: me, followed_id: them });
		if (error) return res.status(500).json({ error: error.message });
		return res.status(204).end();
	}

	res.setHeader("Allow", ["POST", "DELETE"]);
	res.status(405).end(`Method ${req.method} Not Allowed`);
}
