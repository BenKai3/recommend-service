// pages/users/[id].js
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Navigation from "../../components/Navigation";
import FollowButton from "../../components/FollowButton";

export default function UserPublicLists() {
	const router = useRouter();
	const { id } = router.query;

	const [lists, setLists] = useState([]);
	const [userName, setUserName] = useState("");
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
			setLoading(true);
			setError("");

			try {
				const headers = { Authorization: `Bearer ${token}` };

				// 1) fetch the user’s name
				const resUser = await fetch(`/api/users/${id}`, { headers });
				if (!resUser.ok) throw new Error("Failed to load user");
				const { name } = await resUser.json();
				setUserName(name);

				// 2) fetch their public lists
				const resLists = await fetch(`/api/lists?userId=${id}`, {
					headers,
				});
				const listsData = await resLists.json();
				if (!resLists.ok) {
					throw new Error(listsData.error || "Failed to load lists");
				}
				setLists(listsData);
			} catch (err) {
				setError(err.message);
			} finally {
				setLoading(false);
			}
		})();
	}, [id, router]);

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
				{/* Heading + Follow button inline */}
				<div className="flex items-center justify-between mb-4">
					<h1 className="text-2xl font-bold">
						{userName
							? `${userName}’s Public Lists`
							: "Public Lists"}
					</h1>
					<FollowButton userId={id} />
				</div>

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
