// components/ListForm.js
import { useState } from "react";

export default function ListForm({ onCreate }) {
	const [title, setTitle] = useState("");
	const [isPublic, setIsPublic] = useState(false);
	const [error, setError] = useState("");

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");
		const token = localStorage.getItem("token");
		const res = await fetch("/api/lists", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify({ title, is_public: isPublic }),
		});
		const data = await res.json();
		if (!res.ok) return setError(data.error);
		onCreate(data);
		setTitle("");
	};

	return (
		<form
			onSubmit={handleSubmit}
			className="mb-4 p-4 bg-white rounded shadow"
		>
			<h2 className="font-bold mb-2">Create New List</h2>
			<input
				className="border p-2 mr-2"
				placeholder="List title"
				value={title}
				onChange={(e) => setTitle(e.target.value)}
				required
			/>
			<label className="mr-2">
				<input
					type="checkbox"
					checked={isPublic}
					onChange={(e) => setIsPublic(e.target.checked)}
					className="mr-1"
				/>
				Public
			</label>
			<button className="bg-blue-500 text-white px-3 py-1 rounded">
				Create
			</button>
			{error && <p className="text-red-500 mt-2">{error}</p>}
		</form>
	);
}
