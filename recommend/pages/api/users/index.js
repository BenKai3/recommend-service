// pages/api/users/index.js
import { supabase } from "../../../lib/supabaseServer";
import { getUserIdFromReq } from "../../../lib/auth";

export default async function handler(req, res) {
	const me = getUserIdFromReq(req);
	if (!me) return res.status(401).json({ error: "Unauthorized" });

	const { search = "" } = req.query;
	const { data, error } = await supabase
		.from("users")
		.select("id, name")
		.ilike("name", `%${search}%`)
		.neq("id", me)
		.limit(20);

	if (error) return res.status(500).json({ error: error.message });
	res.status(200).json(data);
}
