// pages/login.js
import { useState } from "react";
import { useRouter } from "next/router";
import Navigation from "../components/Navigation";
import Link from "next/link";

export default function Login() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const router = useRouter();

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");

		const res = await fetch("/api/login", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ email, password }),
		});
		const data = await res.json();

		if (!res.ok) {
			setError(data.error || "Login failed");
		} else {
			localStorage.setItem("token", data.token);
			localStorage.setItem("userName", data.user.name);
			// Redirect to dashboard on successful login
			router.push("/dashboard");
		}
	};

	return (
		<div className="min-h-screen bg-gray-100">
			<Navigation />
			<div className="max-w-md mx-auto mt-8 p-6 bg-white rounded shadow">
				<h1 className="text-2xl font-bold mb-4">Login</h1>
				<form onSubmit={handleSubmit}>
					<div className="mb-4">
						<label className="block text-gray-700">Email:</label>
						<input
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
							className="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
						/>
					</div>
					<div className="mb-4">
						<label className="block text-gray-700">Password:</label>
						<input
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
							className="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
						/>
					</div>
					{error && <p className="text-red-500">{error}</p>}
					<button
						type="submit"
						className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
					>
						Login
					</button>
				</form>
				<p className="mt-4 text-center">
					Don’t have an account?{" "}
					<Link
						href="/register"
						className="text-blue-500 hover:underline"
					>
						Register here
					</Link>
					.
				</p>
			</div>
		</div>
	);
}
