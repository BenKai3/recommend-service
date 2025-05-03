// pages/api/lists/[id].js
import { supabase } from "../../../lib/supabaseServer";
import { getUserIdFromReq } from "../../../lib/auth";

export default async function handler(req, res) {
	const userId = getUserIdFromReq(req);
	if (!userId) return res.status(401).json({ error: "Unauthorized" });

	const { id } = req.query;

	if (req.method === "GET") {
		const { data, error } = await supabase
			.from("lists")
			.select(
				`id, title, is_public, list_items (id, media_item_id, media_items!inner (id, title, type, genre))`
			)
			.eq("id", id)
			.single();
		if (error) return res.status(404).json({ error: "List not found" });
		if (!data.is_public && data.user_id !== userId)
			return res.status(403).json({ error: "Forbidden" });
		return res.status(200).json(data);
	}

	if (req.method === "PUT") {
		const { title, is_public } = req.body;
		const { data, error } = await supabase
			.from("lists")
			.update({ title, is_public })
			.eq("id", id)
			.single();
		if (error) return res.status(500).json({ error: error.message });
		return res.status(200).json(data);
	}

	if (req.method === "DELETE") {
		// delete dependent list_items first
		const { error: itemsErr } = await supabase
			.from("list_items")
			.delete()
			.eq("list_id", id);
		if (itemsErr) {
			return res.status(500).json({ error: itemsErr.message });
		}

		// delete the list
		const { error } = await supabase.from("lists").delete().eq("id", id);
		if (error) {
			return res.status(500).json({ error: error.message });
		}

		return res.status(204).end();
	}

	res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
	res.status(405).end(`Method ${req.method} Not Allowed`);
}
