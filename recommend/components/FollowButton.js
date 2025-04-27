// components/FollowButton.js
import { useState, useEffect } from "react";

export default function FollowButton({ userId }) {
	const [following, setFollowing] = useState(false);
	const [error, setError] = useState("");

	const fetchFollowing = async () => {
		const token = localStorage.getItem("token");
		if (!token) {
			setFollowing(false);
			return;
		}
		try {
			const res = await fetch("/api/following", {
				headers: { Authorization: `Bearer ${token}` },
			});
			if (!res.ok) {
				setFollowing(false);
				return;
			}
			const data = await res.json();
			if (Array.isArray(data)) {
				setFollowing(data.some((u) => u.id === userId));
			} else {
				setFollowing(false);
			}
		} catch {
			setFollowing(false);
		}
	};

	useEffect(() => {
		fetchFollowing();
	}, []);

	const toggle = async () => {
		const token = localStorage.getItem("token");
		if (!token) {
			return;
		}
		const method = following ? "DELETE" : "POST";
		try {
			const res = await fetch(`/api/follow/${userId}`, {
				method,
				headers: { Authorization: `Bearer ${token}` },
			});
			if (!res.ok) {
				const err = await res.json();
				setError(err.error || "Request failed");
				return;
			}
			// Re-fetch following after toggle
			fetchFollowing();
		} catch {
			setError("Network error");
		}
	};

	return (
		<>
			<button
				onClick={toggle}
				className={`px-3 py-1 rounded ${
					following ? "bg-red-500" : "bg-green-500"
				} text-white`}
			>
				{following ? "Unfollow" : "Follow"}
			</button>
			{error && <p className="text-red-500 text-sm mt-1">{error}</p>}
		</>
	);
}
