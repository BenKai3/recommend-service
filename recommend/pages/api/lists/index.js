// pages/api/lists/index.js
import { supabase } from "../../../lib/supabaseServer";
import { getUserIdFromReq } from "../../../lib/auth";

export default async function handler(req, res) {
	const userId = getUserIdFromReq(req);
	if (!userId) return res.status(401).json({ error: "Unauthorized" });

	if (req.method === "GET") {
		const { userId: target } = req.query;
		let query = supabase
			.from("lists")
			.select("id, title, is_public, created_at");

		if (target) {
			// viewing another user’s public lists
			query = query.eq("user_id", target).eq("is_public", true);
		} else {
			// your own lists
			query = query.eq("user_id", userId);
		}

		const { data, error } = await query.order("created_at", {
			ascending: false,
		});
		if (error) return res.status(500).json({ error: error.message });
		return res.status(200).json(data);
	}

	if (req.method === "POST") {
		const { title, is_public } = req.body;
		if (!title) return res.status(400).json({ error: "Title is required" });

		const { data, error } = await supabase
			.from("lists")
			.insert([{ user_id: userId, title, is_public: !!is_public }])
			.single();

		if (error) return res.status(500).json({ error: error.message });
		return res.status(201).json(data);
	}

	res.setHeader("Allow", ["GET", "POST"]);
	res.status(405).end(`Method ${req.method} Not Allowed`);
}
