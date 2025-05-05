// pages/api/discover/suggested-users.js
import { supabase } from "../../../lib/supabaseServer";
import { getUserIdFromReq } from "../../../lib/auth";

export default async function handler(req, res) {
	const userId = getUserIdFromReq(req);
	if (!userId) return res.status(401).json({ error: "Unauthorized" });

	try {
		// get all of this user's list IDs
		const { data: myLists, error: listsErr } = await supabase
			.from("lists")
			.select("id")
			.eq("user_id", userId);
		if (listsErr) throw listsErr;

		const listIds = myLists.map((l) => l.id);
		if (!listIds.length) return res.status(200).json([]);

		// find all media_item_ids in those lists
		const { data: items, error: itemsErr } = await supabase
			.from("list_items")
			.select("media_item_id")
			.in("list_id", listIds);
		if (itemsErr) throw itemsErr;

		const mediaIds = items.map((it) => it.media_item_id);
		if (!mediaIds.length) return res.status(200).json([]);

		// look up those media to extract their genres
		const { data: media, error: mediaErr } = await supabase
			.from("media_items")
			.select("id, genre")
			.in("id", mediaIds);
		if (mediaErr) throw mediaErr;

		const genres = Array.from(
			new Set(media.map((m) => m.genre).filter(Boolean))
		);
		if (!genres.length) return res.status(200).json([]);

		// find all media IDs in those genres
		const { data: matchedMedia, error: matchErr } = await supabase
			.from("media_items")
			.select("id")
			.in("genre", genres);
		if (matchErr) throw matchErr;

		const matchedMediaIds = matchedMedia.map((m) => m.id);
		if (!matchedMediaIds.length) return res.status(200).json([]);

		// find list_items that reference those media IDs
		const { data: overlaps, error: ovErr } = await supabase
			.from("list_items")
			.select("list_id")
			.in("media_item_id", matchedMediaIds);
		if (ovErr) throw ovErr;

		const overlapListIds = Array.from(
			new Set(overlaps.map((o) => o.list_id))
		);
		if (!overlapListIds.length) return res.status(200).json([]);

		// fetch the owners of those lists
		const { data: candidateLists, error: clErr } = await supabase
			.from("lists")
			.select("user_id")
			.in("id", overlapListIds)
			.eq("is_public", true);
		if (clErr) throw clErr;

		let candidateIds = Array.from(
			new Set(candidateLists.map((l) => l.user_id))
		).filter((uid) => uid !== userId);
		if (!candidateIds.length) return res.status(200).json([]);

		// exclude anyone you already follow
		const { data: following, error: fErr } = await supabase
			.from("follows")
			.select("followed_id")
			.eq("follower_id", userId);
		if (fErr) throw fErr;

		const followedSet = new Set(following.map((f) => f.followed_id));
		const suggestions = candidateIds
			.filter((uid) => !followedSet.has(uid))
			.slice(0, 10);
		if (!suggestions.length) return res.status(200).json([]);

		// finally, fetch their names
		const { data: users, error: uErr } = await supabase
			.from("users")
			.select("id, name")
			.in("id", suggestions);
		if (uErr) throw uErr;

		return res.status(200).json(users);
	} catch (err) {
		console.error("Suggested users error:", err);
		return res.status(500).json({ error: err.message });
	}
}
