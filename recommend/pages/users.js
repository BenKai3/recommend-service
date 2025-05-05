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
	const [suggested, setSuggested] = useState([]);
	const [error, setError] = useState("");

	// Fetch suggestions once on mount
	useEffect(() => {
		const token = localStorage.getItem("token");
		if (!token) {
			router.push("/login");
			return;
		}
		fetch("/api/discover/suggested-users", {
			headers: { Authorization: `Bearer ${token}` },
		})
			.then((res) => (res.ok ? res.json() : Promise.reject()))
			.then(setSuggested)
			.catch(() => {});
	}, [router]);

	async function search() {
		setError("");
		const token = localStorage.getItem("token");
		if (!token) {
			router.push("/login");
			return;
		}
		const res = await fetch(
			`/api/users?search=${encodeURIComponent(query)}`,
			{ headers: { Authorization: `Bearer ${token}` } }
		);
		const data = await res.json();
		if (!res.ok) {
			setError(data.error || "Search failed");
			setResults([]);
		} else {
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
			<div className="max-w-6xl mx-auto mt-8 grid grid-cols-3 gap-6 p-4">
				{/* Left pane: Search & Results */}
				<div className="col-span-2">
					<h1 className="text-2xl font-bold mb-4">
						Find users to follow
					</h1>
					<p className="mb-4">
						Search for users by name to follow them.
						<br />
						<em>Or</em>, see what they are reading and watching.
					</p>
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
					<ul className="space-y-2">
						{results.map((u) => (
							<li
								key={u.id}
								className="flex justify-between bg-white p-2 rounded shadow"
							>
								<Link
									href={`/users/${u.id}`}
									className="text-blue-600 hover:underline"
								>
									{u.name}
								</Link>
								<FollowButton userId={u.id} />
							</li>
						))}
					</ul>
				</div>

				{/* Right pane: Suggested Users */}
				<div className="bg-white rounded shadow p-4">
					<h2 className="text-2xl font-semibold mb-4">
						Suggested Users
					</h2>
					{suggested.length === 0 ? (
						<p className="text-gray-500">
							No suggestions right now.
						</p>
					) : (
						<ul className="space-y-2">
							{suggested.map((u) => (
								<li
									key={u.id}
									className="flex justify-between items-center p-2 border rounded hover:bg-gray-50"
								>
									<Link
										href={`/users/${u.id}`}
										className="text-black hover:underline"
									>
										{u.name}
									</Link>
									<FollowButton userId={u.id} />
								</li>
							))}
						</ul>
					)}
				</div>
			</div>
		</div>
	);
}
