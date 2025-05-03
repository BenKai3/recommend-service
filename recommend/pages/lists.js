// pages/lists.js
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Navigation from "../components/Navigation";
import ListForm from "../components/ListForm";

export default function ListsPage() {
	const [lists, setLists] = useState([]);
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
	}, []);

	return (
		<div className="min-h-screen bg-gray-100">
			<Navigation />
			<div className="max-w-2xl mx-auto p-4">
				<h1 className="text-2xl font-bold mb-4">
					Click a list to edit it&apos;s contents
				</h1>
				<ListForm onCreate={() => fetchLists()} />
				{error && <p className="text-red-500">{error}</p>}
				<ul>
					{lists
						.filter((l) => l != null)
						.map((l) => (
							<li
								key={l.id}
								className="p-4 mb-2 bg-white rounded shadow cursor-pointer"
								onClick={() => router.push(`/lists/${l.id}`)}
							>
								<h3 className="font-semibold">{l.title}</h3>
								<small className="text-gray-500">
									{l.is_public ? "Public" : "Private"}
								</small>
							</li>
						))}
				</ul>
			</div>
		</div>
	);
}
