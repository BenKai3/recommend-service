// pages/api/discover/trending.js
import { supabase } from "../../../lib/supabaseServer";
import { getUserIdFromReq } from "../../../lib/auth";

export default async function handler(req, res) {
	const userId = getUserIdFromReq(req);
	if (!userId) return res.status(401).json({ error: "Unauthorized" });

	try {
		// fetch all list_items in the past 24h
		const oneDayAgo = new Date(
			Date.now() - 24 * 60 * 60 * 1000
		).toISOString();
		const { data: recent, error: recentErr } = await supabase
			.from("list_items")
			.select("media_item_id")
			.gte("created_at", oneDayAgo);
		if (recentErr) throw recentErr;

		// tally counts in JS
		const counts = {};
		recent.forEach(({ media_item_id }) => {
			counts[media_item_id] = (counts[media_item_id] || 0) + 1;
		});

		// pick top 10 IDs
		const topIds = Object.entries(counts)
			.sort(([, aCount], [, bCount]) => bCount - aCount)
			.slice(0, 10)
			.map(([id]) => id);

		if (!topIds.length) {
			return res.status(200).json([]);
		}

		// fetch their media_items records
		const { data: items, error: itemsErr } = await supabase
			.from("media_items")
			.select("id, title, type, genre")
			.in("id", topIds);
		if (itemsErr) throw itemsErr;

		res.status(200).json(items);
	} catch (err) {
		console.error("Trending error:", err);
		res.status(500).json({ error: err.message });
	}
}
