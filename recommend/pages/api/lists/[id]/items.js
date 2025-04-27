//pages/api/lists/[id]/items.js
import { supabase } from "../../../../lib/supabaseServer";
import { getUserIdFromReq } from "../../../../lib/auth";

export default async function handler(req, res) {
	const userId = getUserIdFromReq(req);
	if (!userId) {
		return res.status(401).json({ error: "Unauthorized" });
	}

	const { id } = req.query; // list ID

	if (req.method === "POST") {
		const { media_item_id } = req.body;
		if (!media_item_id) {
			return res.status(400).json({ error: "Missing media_item_id" });
		}

		// Verify that the list belongs to the current user
		const { data: list, error: listErr } = await supabase
			.from("lists")
			.select("user_id")
			.eq("id", id)
			.single();
		if (listErr || list.user_id !== userId) {
			return res.status(403).json({ error: "Forbidden" });
		}

		// Insert the new list item and fetch the associated media data
		const { data: newItem, error: insertErr } = await supabase
			.from("list_items")
			.insert([{ list_id: id, media_item_id }])
			.select("id, media_item_id, media_items(id, title, type, genre)")
			.single();
		if (insertErr) {
			return res.status(500).json({ error: insertErr.message });
		}

		// Return the newly created item with its media data
		return res.status(201).json(newItem);
	}

	res.setHeader("Allow", ["POST"]);
	res.status(405).end(`Method ${req.method} Not Allowed`);
}
