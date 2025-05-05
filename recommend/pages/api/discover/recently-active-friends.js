// pages/api/discover/recently-active-friends.js
import { supabase } from "../../../lib/supabaseServer";
import { getUserIdFromReq } from "../../../lib/auth";

export default async function handler(req, res) {
	const userId = getUserIdFromReq(req);
	if (!userId) return res.status(401).json({ error: "Unauthorized" });

	try {
		// 1) who I follow
		let { data: follows, error } = await supabase
			.from("follows")
			.select("followed_id")
			.eq("follower_id", userId);
		if (error) throw error;
		const followedIds = follows.map((f) => f.followed_id);
		if (!followedIds.length) return res.status(200).json([]);

		// 2) get those users' lists
		let { data: lists, error: listErr } = await supabase
			.from("lists")
			.select("id, user_id, title")
			.in("user_id", followedIds);
		if (listErr) throw listErr;
		const listMap = Object.fromEntries(lists.map((l) => [l.id, l]));

		// 3) get all the items they added
		let { data: items, error: itemsErr } = await supabase
			.from("list_items")
			.select("id, list_id, media_item_id, created_at")
			.in(
				"list_id",
				lists.map((l) => l.id)
			);
		if (itemsErr) throw itemsErr;

		// 4) for each followed user, pick their single latest addition
		const latestByUser = {};
		for (let it of items) {
			const { list_id, created_at } = it;
			const owner = listMap[list_id].user_id;
			const ts = new Date(created_at).getTime();
			if (!latestByUser[owner] || ts > latestByUser[owner].ts) {
				latestByUser[owner] = { ts, item: it };
			}
		}

		// 5) sort those up to 10 by recency
		const sorted = Object.entries(latestByUser)
			.sort(([, a], [, b]) => b.ts - a.ts)
			.slice(0, 10)
			.map(([owner, { item }]) => ({
				owner,
				...item,
				last_active: new Date(item.created_at).toISOString(),
			}));

		if (!sorted.length) return res.status(200).json([]);

		// 6) fetch user names & media titles
		const userIds = sorted.map((r) => r.owner);
		const mediaIds = sorted.map((r) => r.media_item_id);

		let [{ data: users }, { data: media }] = await Promise.all([
			supabase.from("users").select("id,name").in("id", userIds),
			supabase
				.from("media_items")
				.select("id,title,type")
				.in("id", mediaIds),
		]);

		const userMap = Object.fromEntries(users.map((u) => [u.id, u.name]));
		const mediaMap = Object.fromEntries(media.map((m) => [m.id, m]));

		// 7) build final payload
		const result = sorted.map((r) => ({
			userId: r.owner,
			userName: userMap[r.owner],
			last_active: r.last_active,
			listId: r.list_id,
			listTitle: listMap[r.list_id].title,
			mediaItem: mediaMap[r.media_item_id],
		}));

		return res.status(200).json(result);
	} catch (err) {
		console.error(err);
		return res.status(500).json({ error: err.message });
	}
}
