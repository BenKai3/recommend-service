// pages/api/register.js

import { hash } from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import { createClient } from "@supabase/supabase-js";
import { supabase } from "../../lib/supabaseServer";

export default async function handler(req, res) {
	// Allow only POST requests
	if (req.method !== "POST") {
		res.setHeader("Allow", ["POST"]);
		return res
			.status(405)
			.json({ error: `Method ${req.method} Not Allowed` });
	}

	const { email, password, name } = req.body;

	// Basic validation
	if (!email || !password || !name) {
		return res.status(400).json({ error: "Missing required fields" });
	}

	try {
		// Hash the password
		const hashedPassword = await hash(password, 10);

		// Generate a unique user id (maybe just use database id instead?)
		const userId = uuidv4();

		// Insert new user record into the Supabase users table
		const { data, error } = await supabase
			.from("users")
			.insert([
				{ id: userId, email, name, password_hash: hashedPassword },
			]);

		if (error) {
			console.error("Supabase insert error:", error);
			return res
				.status(500)
				.json({ error: "Error inserting user record" });
		}

		return res
			.status(201)
			.json({ message: "User registered successfully", userId });
	} catch (error) {
		// Handle any other errors
		console.error("Registration error:", error);
		return res.status(500).json({ error: "Internal server error" });
	}
}
