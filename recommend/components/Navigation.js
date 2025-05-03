// components/Navigation.js
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function Navigation() {
	const [loggedIn, setLoggedIn] = useState(false);
	const router = useRouter();

	useEffect(() => {
		setLoggedIn(!!localStorage.getItem("token"));
	}, []);

	const handleLogout = () => {
		localStorage.removeItem("token");
		router.push("/login");
	};

	return (
		<nav className="bg-gray-800 p-4 flex justify-between items-center">
			<ul className="flex space-x-4">
				{loggedIn ? (
					<>
						<li>
							<Link
								href="/dashboard"
								className="text-white hover:underline"
							>
								Dashboard
							</Link>
						</li>
						<li>
							<Link
								href="/lists"
								className="text-white hover:underline"
							>
								My Lists
							</Link>
						</li>
						<li>
							<Link
								href="/users"
								className="text-white hover:underline"
							>
								Follow Users
							</Link>
						</li>
					</>
				) : (
					<>
						<li>
							<Link
								href="/register"
								className="text-white hover:underline"
							>
								Register
							</Link>
						</li>
						<li>
							<Link
								href="/login"
								className="text-white hover:underline"
							>
								Login
							</Link>
						</li>
					</>
				)}
			</ul>
			{loggedIn && (
				<button
					onClick={handleLogout}
					className="text-white hover:underline"
				>
					Logout
				</button>
			)}
		</nav>
	);
}
