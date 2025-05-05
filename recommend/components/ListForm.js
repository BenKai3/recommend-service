// components/ListForm.js
import { useState } from "react";

export default function ListForm({ onCreate }) {
	const [title, setTitle] = useState("");
	const [isPublic, setIsPublic] = useState(false);
	const [error, setError] = useState("");

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");
		if (!title.trim()) {
			setError("Title is required");
			return;
		}
		try {
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
			if (!res.ok) throw new Error(data.error || "Failed to create list");
			onCreate(data);
			setTitle("");
			setIsPublic(false);
		} catch (err) {
			setError(err.message);
		}
	};

	return (
		<form
			onSubmit={handleSubmit}
			className="mb-4 flex items-center justify-between"
		>
			<div className="flex items-center space-x-4 flex-1">
				<input
					type="text"
					placeholder="New list title"
					value={title}
					onChange={(e) => setTitle(e.target.value)}
					className="flex-1 border p-2 rounded"
				/>
				<label className="flex items-center space-x-1">
					<input
						type="checkbox"
						checked={isPublic}
						onChange={(e) => setIsPublic(e.target.checked)}
						className="form-checkbox"
					/>
					<span>Public</span>
				</label>
			</div>
			<button
				type="submit"
				className="ml-4 bg-blue-500 text-white px-4 py-2 rounded"
			>
				Create
			</button>
			{error && <p className="text-red-500 text-sm mt-2">{error}</p>}
		</form>
	);
}
