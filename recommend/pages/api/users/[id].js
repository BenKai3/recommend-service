// pages/api/users/[id].js
import { supabase } from "../../../lib/supabaseServer";
import { getUserIdFromReq } from "../../../lib/auth";

export default async function handler(req, res) {
	const me = getUserIdFromReq(req);
	if (!me) return res.status(401).json({ error: "Unauthorized" });

	const { id } = req.query;

	// only GET is needed
	if (req.method !== "GET") {
		res.setHeader("Allow", ["GET"]);
		return res.status(405).end(`Method ${req.method} Not Allowed`);
	}

	const { data, error } = await supabase
		.from("users")
		.select("id, name")
		.eq("id", id)
		.single();

	if (error) return res.status(404).json({ error: "User not found" });
	res.status(200).json({ id: data.id, name: data.name });
}
