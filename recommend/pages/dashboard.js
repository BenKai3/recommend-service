// pages/dashboard.js
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Navigation from "../components/Navigation";

export default function Dashboard() {
	const [lists, setLists] = useState([]);
	const [selectedMedia, setSelectedMedia] = useState(null);
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(true);
	const router = useRouter();

	useEffect(() => {
		const token = localStorage.getItem("token");
		if (!token) {
			router.push("/login");
			return;
		}

		const fetchLists = async () => {
			try {
				const headers = { Authorization: `Bearer ${token}` };
				// Fetch list summaries
				const resLists = await fetch("/api/lists", { headers });
				if (!resLists.ok) throw new Error("Failed to load lists");
				const listSummaries = await resLists.json();
				// Fetch detailed lists with items
				const detailed = await Promise.all(
					listSummaries.map(async (list) => {
						const res = await fetch(`/api/lists/${list.id}`, {
							headers,
						});
						if (!res.ok)
							throw new Error(`Failed to load list ${list.id}`);
						return await res.json();
					})
				);
				setLists(detailed);
			} catch (err) {
				setError(err.message);
			} finally {
				setLoading(false);
			}
		};

		fetchLists();
	}, []);

	const viewMediaDetails = async (mediaId) => {
		setError("");
		const token = localStorage.getItem("token");
		const res = await fetch(`/api/media/${mediaId}`, {
			headers: { Authorization: `Bearer ${token}` },
		});
		const data = await res.json();
		if (!res.ok) {
			setError(data.error);
		} else {
			setSelectedMedia(data);
		}
	};

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<p>Loading your dashboard...</p>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-100">
			<Navigation />
			<div className="max-w-6xl mx-auto mt-8 grid grid-cols-2 gap-6 p-6 bg-white rounded shadow">
				{/* Lists Column */}
				<div>
					<h1 className="text-3xl font-bold mb-4">Your Dashboard</h1>
					{error && <p className="text-red-500 mb-4">{error}</p>}
					{lists.length === 0 ? (
						<p>You have no lists.</p>
					) : (
						<ul className="space-y-6">
							{lists.map((list) => (
								<li
									key={list.id}
									className="border rounded p-4 bg-gray-50"
								>
									<h2 className="text-2xl font-semibold mb-2">
										{list.title}
									</h2>
									<ul className="list-disc list-inside space-y-1">
										{list.list_items.map((it) => (
											<li key={it.id}>
												<button
													onClick={() =>
														viewMediaDetails(
															it.media_item_id
														)
													}
													className="text-black font-medium hover:underline"
												>
													{it.media_items.title}{" "}
													<em>
														({it.media_items.type})
													</em>
												</button>
											</li>
										))}
									</ul>
								</li>
							))}
						</ul>
					)}
				</div>

				{/* Side Panel */}
				<div className="p-4 bg-white rounded shadow">
					<h2 className="text-2xl font-semibold mb-4">
						Media Details
					</h2>
					{selectedMedia ? (
						<div className="space-y-2">
							<h3 className="text-xl font-bold">
								{selectedMedia.title}
							</h3>
							<p>
								<strong>Type:</strong> {selectedMedia.type}
							</p>
							<p>
								<strong>Genre:</strong> {selectedMedia.genre}
							</p>
							<p>
								<strong>Author/Director:</strong>{" "}
								{selectedMedia.author_director}
							</p>
						</div>
					) : (
						<p className="text-gray-500">
							Click a media item to view details
						</p>
					)}
				</div>
			</div>
		</div>
	);
}
