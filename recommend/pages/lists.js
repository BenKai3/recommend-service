// pages/lists.js
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Navigation from "../components/Navigation";
import ListForm from "../components/ListForm";

export default function ListsPage() {
	const [lists, setLists] = useState([]);
	const [activeFriends, setActiveFriends] = useState([]);
	const [error, setError] = useState("");
	const router = useRouter();

	const fetchLists = async () => {
		const token = localStorage.getItem("token");
		if (!token) {
			router.push("/login");
			return;
		}
		const res = await fetch("/api/lists", {
			headers: { Authorization: `Bearer ${token}` },
		});
		const data = await res.json();
		if (!res.ok) return setError(data.error);
		setLists(data);
	};

	useEffect(() => {
		if (!localStorage.getItem("token")) {
			router.push("/login");
			return;
		}
		fetchLists();

		// fetch recently active friends
		const token = localStorage.getItem("token");
		fetch("/api/discover/recently-active-friends", {
			headers: { Authorization: `Bearer ${token}` },
		})
			.then((r) => (r.ok ? r.json() : Promise.reject()))
			.then(setActiveFriends)
			.catch(() => {});
	}, []);

	return (
		<div className="min-h-screen bg-gray-100">
			<Navigation />
			<div className="max-w-6xl mx-auto p-4 grid grid-cols-3 gap-6">
				{/* --- Recently Active Friends Sidebar --- */}
				<aside className="bg-white rounded shadow p-4">
					<h2 className="text-xl font-semibold mb-4">
						Recently Active Friends
					</h2>
					{activeFriends.length === 0 ? (
						<p className="text-gray-500">
							No friends active recently.
						</p>
					) : (
						<ul className="space-y-4">
							{activeFriends.map((f) => (
								<li
									key={f.userId}
									className="p-2 rounded hover:bg-gray-50 cursor-pointer"
								>
									<div className="flex items-center justify-between">
										<Link
											href={`/users/${f.userId}`}
											className="font-semibold hover:underline"
										>
											{f.userName}
										</Link>
										<small className="text-gray-400 text-sm">
											{new Date(
												f.last_active
											).toLocaleDateString()}
										</small>
									</div>

									<p>
										added {f.mediaItem.title} to{" "}
										<Link
											href={`/lists/${f.listId}`}
											className="font-medium font-bold hover:underline"
										>
											<strong>{f.listTitle}</strong>
										</Link>
									</p>
								</li>
							))}
						</ul>
					)}
				</aside>

				{/* --- Your Lists Main Column --- */}
				<section className="col-span-2">
					<h1 className="text-2xl font-bold mb-4">Your Lists</h1>
					<p className="mb-4">
						You can create and manage your lists here.
					</p>
					<ListForm onCreate={fetchLists} />
					{error && <p className="text-red-500 mb-4">{error}</p>}
					<ul className="space-y-4">
						{lists.map((l) => (
							<li
								key={l.id}
								className="bg-white rounded shadow p-4 cursor-pointer hover:bg-gray-50"
								onClick={() => router.push(`/lists/${l.id}`)}
							>
								<h3 className="font-semibold">{l.title}</h3>
								<small className="text-gray-500">
									{l.is_public ? "Public" : "Private"}
								</small>
							</li>
						))}
					</ul>
				</section>
			</div>
		</div>
	);
}
