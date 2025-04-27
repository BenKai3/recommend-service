// components/DeleteListButton.js
import { useRouter } from "next/router";

export default function DeleteListButton({ listId, onDeleted }) {
	const router = useRouter();
	const handle = async () => {
		if (!confirm("Delete this list? This cannot be undone.")) return;
		const token = localStorage.getItem("token");
		const res = await fetch(`/api/lists/${listId}`, {
			method: "DELETE",
			headers: { Authorization: `Bearer ${token}` },
		});
		if (res.ok) {
			onDeleted?.();
			// if you’re on the detail page, redirect back
			if (router.pathname === "/lists/[id]") router.push("/lists");
		} else {
			const err = await res.json();
			alert(err.error);
		}
	};

	return (
		<button
			onClick={handle}
			className="bg-red-500 text-white px-3 py-1 rounded"
		>
			Delete
		</button>
	);
}
