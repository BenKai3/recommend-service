// pages/users/[id].js
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Navigation from "../../components/Navigation";

export default function UserPublicLists() {
	const router = useRouter();
	const { id } = router.query;

	const [lists, setLists] = useState([]);
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (!id) return;
		const token = localStorage.getItem("token");
		if (!token) {
			router.push("/login");
			return;
		}
		(async () => {
			try {
				const res = await fetch(`/api/lists?userId=${id}`, {
					headers: { Authorization: `Bearer ${token}` },
				});
				const data = await res.json();
				if (!res.ok) {
					setError(data.error || "Failed to load public lists");
				} else {
					setLists(data);
				}
			} catch (err) {
				setError(err.message);
			} finally {
				setLoading(false);
			}
		})();
	}, [id]);

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				Loading...
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-100">
			<Navigation />
			<div className="max-w-2xl mx-auto p-4">
				<h1 className="text-2xl font-bold mb-4">
					Public Lists by User
				</h1>
				{error && <p className="text-red-500 mb-2">{error}</p>}
				{lists.length === 0 ? (
					<p className="text-gray-600">
						This user has no public lists.
					</p>
				) : (
					<ul className="space-y-4">
						{lists.map((list) => (
							<li
								key={list.id}
								className="p-4 bg-white rounded shadow cursor-pointer hover:bg-gray-50"
								onClick={() => router.push(`/lists/${list.id}`)}
							>
								<h3 className="text-lg font-semibold">
									{list.title}
								</h3>
								<small className="text-gray-500">
									{list.is_public ? "Public" : "Private"}
								</small>
							</li>
						))}
					</ul>
				)}
			</div>
		</div>
	);
}
