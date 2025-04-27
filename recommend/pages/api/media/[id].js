// pages/api/media/[id].js
import { supabase } from "../../../lib/supabaseServer";
import { getUserIdFromReq } from "../../../lib/auth";

export default async function handler(req, res) {
	const userId = getUserIdFromReq(req);
	if (!userId) return res.status(401).json({ error: "Unauthorized" });

	const { id } = req.query;
	const { data, error } = await supabase
		.from("media_items")
		.select("id, title, type, genre, author_director")
		.eq("id", id)
		.single();

	if (error) return res.status(404).json({ error: "Media not found" });
	return res.status(200).json(data);
}
