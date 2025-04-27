// pages/api/media/index.js
import { supabase } from "../../../lib/supabaseServer";
import { getUserIdFromReq } from "../../../lib/auth";

export default async function handler(req, res) {
	const userId = getUserIdFromReq(req);
	if (!userId) return res.status(401).json({ error: "Unauthorized" });

	if (req.method === "GET") {
		const { search = "" } = req.query;
		const { data, error } = await supabase
			.from("media_items")
			.select("id, title, type, genre, author_director")
			.ilike("title", `%${search}%`)
			.limit(20);

		if (error) return res.status(500).json({ error: error.message });
		return res.status(200).json(data);
	}

	// We’re no longer creating new media—return 405
	res.setHeader("Allow", ["GET"]);
	res.status(405).end(`Method ${req.method} Not Allowed`);
}
