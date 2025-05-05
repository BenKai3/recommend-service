// pages/dashboard.js
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Navigation from "../components/Navigation";

export default function Dashboard() {
	const [userName, setUserName] = useState("");
	const [lists, setLists] = useState([]);
	const [recommendations, setRecommendations] = useState([]);
	const [following, setFollowing] = useState([]);
	const [trending, setTrending] = useState([]);
	const [selectedMedia, setSelectedMedia] = useState(null);
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(true);
	const router = useRouter();

	useEffect(() => {
		const token = localStorage.getItem("token");
		const storedName = localStorage.getItem("userName") || "";
		setUserName(storedName);

		if (!token) {
			router.push("/login");
			return;
		}

		const headers = { Authorization: `Bearer ${token}` };

		const fetchAll = async () => {
			try {
				// your lists
				const resLists = await fetch("/api/lists", { headers });
				if (!resLists.ok) throw new Error("Failed to load lists");
				const listSummaries = await resLists.json();
				const detailed = await Promise.all(
					listSummaries.map(async (list) => {
						const res = await fetch(`/api/lists/${list.id}`, {
							headers,
						});
						if (!res.ok)
							throw new Error(`Cannot load list ${list.id}`);
						return res.json();
					})
				);
				setLists(detailed);

				// recommendations
				const resRec = await fetch("/api/discover/recommendations", {
					headers,
				});
				if (!resRec.ok)
					throw new Error("Failed to load recommendations");
				setRecommendations(await resRec.json());

				// following
				const resFollow = await fetch("/api/following", { headers });
				if (!resFollow.ok) throw new Error("Failed to load following");
				setFollowing(await resFollow.json());
			} catch (err) {
				setError(err.message);
			} finally {
				setLoading(false);
			}
		};

		fetchAll();

		// trending
		fetch("/api/discover/trending", { headers })
			.then((res) => (res.ok ? res.json() : Promise.reject()))
			.then(setTrending)
			.catch(() => {});
	}, [router]);

	const viewMediaDetails = async (mediaId) => {
		setError("");
		const token = localStorage.getItem("token");
		const res = await fetch(`/api/media/${mediaId}`, {
			headers: { Authorization: `Bearer ${token}` },
		});
		if (!res.ok) {
			const { error } = await res.json();
			return setError(error);
		}
		setSelectedMedia(await res.json());
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
			<div className="max-w-6xl mx-auto mt-6 px-6">
				<h2 className="text-2xl font-semibold">Hello, {userName}!</h2>
			</div>

			<div className="max-w-6xl mx-auto mt-8 grid grid-cols-4 gap-6 p-6 bg-white rounded shadow">
				{/* Trending — spans all 4 columns */}
				<div className="col-span-4 p-4 bg-white rounded shadow">
					<h2 className="text-2xl font-semibold mb-4">
						Trending Media in Last 24 Hours...
					</h2>
					{trending.length === 0 ? (
						<p className="text-gray-500">
							No trending items right now.
						</p>
					) : (
						<ul className="space-y-2">
							{trending.map((m) => (
								<li
									key={m.id}
									className="p-2 rounded hover:bg-gray-50 cursor-pointer"
									onClick={() => viewMediaDetails(m.id)}
								>
									{m.title} <em>({m.type})</em>
								</li>
							))}
						</ul>
					)}
				</div>

				{/* Your Lists */}
				<div>
					<h1 className="text-2xl font-bold mb-4">Your Lists</h1>
					{lists.length === 0 ? (
						<p>You have no lists.</p>
					) : (
						<ul className="space-y-4">
							{lists.map((list) => (
								<li
									key={list.id}
									className="border rounded p-3"
								>
									<h2 className="font-semibold">
										{list.title}
									</h2>
									<ul className="list-inside mt-2">
										{list.list_items.map((it) => (
											<li
												key={it.id}
												className="p-2 rounded hover:bg-gray-50 cursor-pointer"
											>
												<button
													onClick={() =>
														viewMediaDetails(
															it.media_item_id
														)
													}
													className="text-black hover:underline"
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

				{/* Item Details */}
				<div className="p-4 bg-white rounded shadow">
					<h2 className="text-2xl font-semibold mb-4">
						Item Details
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

				{/* Recommendations */}
				<div className="p-4 bg-white rounded shadow">
					<h2 className="text-2xl font-semibold mb-4">
						Recommendations For You
					</h2>
					{recommendations.length === 0 ? (
						<p className="text-gray-500">No recommendations yet.</p>
					) : (
						<ul className="space-y-2">
							{recommendations.map((m) => (
								<li
									key={m.id}
									className="p-2 rounded hover:bg-gray-50 cursor-pointer"
									onClick={() => viewMediaDetails(m.id)}
								>
									{m.title} <em>({m.type})</em>
								</li>
							))}
						</ul>
					)}
				</div>

				{/* Following */}
				<div className="p-4 bg-white rounded shadow">
					<h2 className="text-2xl font-semibold mb-4">Following</h2>
					{following.length === 0 ? (
						<p className="text-gray-500">
							You’re not following anyone yet.
						</p>
					) : (
						<ul className="space-y-2">
							{following.map((u) => (
								<li
									key={u.id}
									className="p-2 rounded hover:bg-gray-50 cursor-pointer"
								>
									<Link href={`/users/${u.id}`}>
										{u.name}
									</Link>
								</li>
							))}
						</ul>
					)}
				</div>
			</div>

			{error && <p className="text-red-500 text-center mt-4">{error}</p>}
		</div>
	);
}
