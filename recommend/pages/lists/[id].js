// pages/lists/[id].js
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Navigation from "../../components/Navigation";
import MediaSearch from "../../components/MediaSearch";
import DeleteListButton from "../../components/deleteListButton";

export default function ListDetail() {
	const [list, setList] = useState(null);
	const [items, setItems] = useState([]);
	const [ownLists, setOwnLists] = useState([]);
	const [selectedMedia, setSelectedMedia] = useState(null);
	const [error, setError] = useState("");
	const router = useRouter();
	const { id } = router.query;

	// Fetch list details and user's own lists
	useEffect(() => {
		const token = localStorage.getItem("token");
		if (!token) {
			router.push("/login");
			return;
		}

		if (!id) return;
		setError("");

		// List items
		(async () => {
			const res = await fetch(`/api/lists/${id}`, {
				headers: { Authorization: `Bearer ${token}` },
			});
			const data = await res.json();
			if (!res.ok) return setError(data.error);
			setList(data);
			setItems(data.list_items || []);
		})();

		// Own lists for adding
		(async () => {
			const res = await fetch("/api/lists", {
				headers: { Authorization: `Bearer ${token}` },
			});
			const data = await res.json();
			if (res.ok) setOwnLists(data);
		})();
	}, [id]);

	// View media details in side panel
	const viewMediaDetails = async (mediaId) => {
		setError("");
		const token = localStorage.getItem("token");
		const res = await fetch(`/api/media/${mediaId}`, {
			headers: { Authorization: `Bearer ${token}` },
		});
		const data = await res.json();
		if (!res.ok) return setError(data.error);
		setSelectedMedia(data);
	};

	// Add item to another list
	const addItemToList = async (mediaItemId, targetListId) => {
		setError("");
		if (!targetListId) return;
		const token = localStorage.getItem("token");
		const res = await fetch(`/api/lists/${targetListId}/items`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify({ media_item_id: mediaItemId }),
		});
		const data = await res.json();
		if (!res.ok) return setError(data.error);
		alert(`Added "${data.media_items.title}" to your list.`);
	};

	// Remove item from this list
	const removeItem = async (itemId) => {
		const token = localStorage.getItem("token");
		const res = await fetch(`/api/lists/${id}/items/${itemId}`, {
			method: "DELETE",
			headers: { Authorization: `Bearer ${token}` },
		});
		if (!res.ok) {
			const err = await res.json();
			return setError(err.error);
		}
		setItems((prev) => prev.filter((it) => it.id !== itemId));
	};

	// if we failed to load a list, show the error
	if (error && !list) {
		return (
			<div className="min-h-screen bg-gray-100">
				<Navigation />
				<div className="max-w-2xl mx-auto p-4">
					<p className="text-red-500 text-center">{error}</p>
					<button
						onClick={() => router.push("/lists")}
						className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
					>
						Back to all lists
					</button>
				</div>
			</div>
		);
	}

	// if it's still loading (rather than an error), bail out silently
	if (!list) return null;

	return (
		<div className="min-h-screen bg-gray-100">
			<Navigation />
			<div className="max-w-6xl mx-auto p-4 grid grid-cols-3 gap-4">
				{/* Main list area */}
				<div className="col-span-2 bg-white rounded shadow p-4">
					<div className="flex justify-between items-center mb-4">
						<h1 className="text-2xl font-bold text-black">
							{list.title}
						</h1>
						<DeleteListButton listId={id} />
					</div>
					<MediaSearch
						listId={id}
						onAdd={(newItem) =>
							setItems((prev) => [newItem, ...prev])
						}
					/>
					{error && <p className="text-red-500 mb-4">{error}</p>}
					<ul className="space-y-2">
						{items.map((it) => (
							<li
								key={it.id}
								className="flex justify-between items-center p-2 bg-gray-50 rounded"
							>
								<button
									onClick={() =>
										viewMediaDetails(it.media_item_id)
									}
									className="text-left flex-1"
								>
									{it.media_items.title}{" "}
									<em>({it.media_items.type})</em>
								</button>
								<div className="flex items-center space-x-2">
									<select
										defaultValue=""
										onChange={(e) =>
											addItemToList(
												it.media_item_id,
												e.target.value
											)
										}
										className="border p-1 rounded"
									>
										<option value="">Add to my list</option>
										{ownLists.map((l) => (
											<option key={l.id} value={l.id}>
												{l.title}
											</option>
										))}
									</select>
									<button
										onClick={() => removeItem(it.id)}
										className="text-red-500"
									>
										Remove
									</button>
								</div>
							</li>
						))}
					</ul>
				</div>

				{/* Side panel for media details */}
				<div className="bg-white rounded shadow p-4">
					<h2 className="text-xl font-semibold mb-2">
						Media Details
					</h2>
					{selectedMedia ? (
						<div>
							<h3 className="font-bold text-lg">
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
							Select a media item to view details
						</p>
					)}
				</div>
			</div>
		</div>
	);
}
