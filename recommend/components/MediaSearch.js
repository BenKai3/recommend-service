// components/MediaSearch.js
import { useState, useEffect, useRef } from "react";

export default function MediaSearch({ listId, onAdd }) {
	const [q, setQ] = useState("");
	const [results, setResults] = useState([]);
	const [error, setError] = useState("");
	const dropdownRef = useRef();

	// Debounced search
	useEffect(() => {
		if (!q) return setResults([]);
		const t = setTimeout(async () => {
			const token = localStorage.getItem("token");
			const res = await fetch(
				`/api/media?search=${encodeURIComponent(q)}`,
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			);
			const data = await res.json();
			if (!res.ok) setError(data.error || "Search failed");
			else {
				setError("");
				setResults(data);
			}
		}, 300);
		return () => clearTimeout(t);
	}, [q]);

	const add = async (media) => {
		setError("");
		const token = localStorage.getItem("token");
		const res = await fetch(`/api/lists/${listId}/items`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify({ media_item_id: media.id }),
		});
		const data = await res.json();
		if (!res.ok) return setError(data.error || "Failed to add");
		onAdd(data);
		setQ("");
		setResults([]);
	};

	return (
		<div className="relative mb-4">
			<input
				type="text"
				value={q}
				onChange={(e) => setQ(e.target.value)}
				placeholder="Search media…"
				className="w-full border p-2 rounded"
			/>
			{error && <p className="text-red-500 text-sm mt-1">{error}</p>}
			{results.length > 0 && (
				<ul
					ref={dropdownRef}
					className="absolute z-10 bg-white border w-full max-h-48 overflow-auto mt-1"
				>
					{results.map((m) => (
						<li
							key={m.id}
							className="p-2 hover:bg-gray-100 cursor-pointer"
							onClick={() => add(m)}
						>
							<strong>{m.title}</strong> <em>({m.type})</em>
						</li>
					))}
				</ul>
			)}
		</div>
	);
}
