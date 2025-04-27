// recommend-service/recommend/lib/auth.js
import jwt from "jsonwebtoken";

export function getUserIdFromReq(req) {
	const auth = req.headers.authorization || "";
	const token = auth.split(" ")[1];
	if (!token) return null;
	try {
		const payload = jwt.verify(token, process.env.JWT_SECRET);
		return payload.userId;
	} catch {
		return null;
	}
}
