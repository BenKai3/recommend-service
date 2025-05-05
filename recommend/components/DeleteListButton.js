// components/DeleteListButton.js
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function DeleteListButton({ listId }) {
	const router = useRouter();

	const handleDelete = async () => {
		if (!confirm("Delete this list?")) return;
		const token = localStorage.getItem("token");
		const res = await fetch(`/api/lists/${listId}`, {
			method: "DELETE",
			headers: { Authorization: `Bearer ${token}` },
		});
		if (res.ok) {
			router.push("/lists");
		} else {
			const err = await res.json();
			alert(err.error);
		}
	};

	return (
		<button
			onClick={handleDelete}
			className="bg-red-500 text-white px-3 py-1 rounded hover:underline"
		>
			Delete
		</button>
	);
}
