// pages/api/lists/[id]/items/[itemId].js
import { supabase } from "../../../../../lib/supabaseServer";
import { getUserIdFromReq } from "../../../../../lib/auth";

export default async function handler(req, res) {
	const userId = getUserIdFromReq(req);
	if (!userId) return res.status(401).json({ error: "Unauthorized" });

	const { id, itemId } = req.query;

	// Verify that the list belongs to the current user
	const { data: list, error: listErr } = await supabase
		.from("lists")
		.select("user_id")
		.eq("id", id)
		.single();
	if (listErr || list.user_id !== userId) {
		return res.status(403).json({ error: "Forbidden" });
	}

	if (req.method === "DELETE") {
		const { error } = await supabase
			.from("list_items")
			.delete()
			.eq("id", itemId);
		if (error) return res.status(500).json({ error: error.message });
		return res.status(204).end();
	}

	res.setHeader("Allow", ["DELETE", "PATCH"]);
	res.status(405).end(`Method ${req.method} Not Allowed`);
}
