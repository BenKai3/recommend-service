// pages/users.js
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Navigation from "../components/Navigation";
import FollowButton from "../components/FollowButton";

export default function UsersPage() {
	const router = useRouter();
	const [query, setQuery] = useState("");
	const [results, setResults] = useState([]);
	const [error, setError] = useState("");

	async function search() {
		const token = localStorage.getItem("token");
		if (!token) {
			router.push("/login");
			return;
		}
		const res = await fetch(
			`/api/users?search=${encodeURIComponent(query)}`,
			{
				headers: { Authorization: `Bearer ${token}` },
			}
		);
		const data = await res.json();
		if (!res.ok) {
			setError(data.error || "Search failed");
			setResults([]);
		} else {
			setError("");
			setResults(data);
		}
	}

	useEffect(() => {
		if (!localStorage.getItem("token")) {
			router.push("/login");
		}
	}, []);

	return (
		<div className="min-h-screen bg-gray-100">
			<Navigation />
			<div className="max-w-lg mx-auto p-4">
				<h1 className="text-2xl font-bold mb-4">Find Users</h1>
				<div className="flex mb-4">
					<input
						className="border p-2 flex-1"
						placeholder="Search by name"
						value={query}
						onChange={(e) => setQuery(e.target.value)}
					/>
					<button
						onClick={search}
						className="ml-2 bg-blue-500 text-white px-4 rounded"
					>
						Search
					</button>
				</div>
				{error && <p className="text-red-500 mb-2">{error}</p>}
				<ul>
					{Array.isArray(results)
						? results.map((u) => (
								<li
									key={u.id}
									className="flex justify-between p-2 bg-white mb-2 rounded shadow"
								>
									<Link
										href={`/users/${u.id}`}
										className="text-blue-600 hover:underline"
									>
										{u.name}
									</Link>
									<FollowButton userId={u.id} />
								</li>
						  ))
						: null}
				</ul>
			</div>
		</div>
	);
}
