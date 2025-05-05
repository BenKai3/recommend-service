// pages/api/discover/recommendations.js
import { supabase } from "../../../lib/supabaseServer";
import { getUserIdFromReq } from "../../../lib/auth";

export default async function handler(req, res) {
	const userId = getUserIdFromReq(req);
	if (!userId) return res.status(401).json({ error: "Unauthorized" });

	try {
		// get all of this user’s lists
		const { data: lists, error: listErr } = await supabase
			.from("lists")
			.select("id")
			.eq("user_id", userId);
		if (listErr) throw listErr;
		const listIds = lists.map((l) => l.id);

		// get all media items in those lists
		const { data: savedItems, error: itemsErr } = await supabase
			.from("list_items")
			.select("media_items!inner(id, genre)")
			.in("list_id", listIds);
		if (itemsErr) throw itemsErr;

		// pick the top genre
		const genreCounts = {};
		savedItems.forEach(({ media_items }) => {
			const g = media_items.genre;
			if (g) genreCounts[g] = (genreCounts[g] || 0) + 1;
		});
		const topGenre = Object.entries(genreCounts)
			.sort((a, b) => b[1] - a[1])
			.map((e) => e[0])[0];

		let recommendations = [];
		if (topGenre) {
			// list of already‐seen media IDs
			const seenIds = savedItems.map((si) => si.media_items.id);

			// build the base query
			let query = supabase
				.from("media_items")
				.select("id, title, type, genre")
				.eq("genre", topGenre);

			// if we’ve already got some, exclude them
			// if (seenIds.length) {
			// 	query = query.not("id", "in", seenIds);
			// }
			if (seenIds.length) {
				query = query.not("id", "in", `(${seenIds.join(",")})`);
			}

			// finally limit and fetch
			const { data, error } = await query.limit(10);
			if (error) throw error;
			recommendations = data;
		}

		return res.status(200).json(recommendations);
	} catch (err) {
		console.error("Recommendation error:", err);
		return res.status(500).json({ error: err.message });
	}
}
