// components/Navigation.js
import { Bebas_Neue } from "next/font/google";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

const bebas = Bebas_Neue({
	subsets: ["latin"],
	weight: "400",
});

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
		<nav className="bg-gray-800 p-4 flex flex-col sm:flex-row sm:justify-between items-center">
			{/* Site title + subtitle */}
			<div className="text-center sm:text-left mb-4 sm:mb-0">
				<h1
					className={`${bebas.className} text-white text-6xl font-bold`}
				>
					Recommend
				</h1>
				<p
					className={`${bebas.className} text-white italic text-md mt-1`}
				>
					save, share, <em>and discover</em>, your favorites!
				</p>
			</div>

			{/* Navigation links */}
			<div className="flex items-center w-full sm:w-auto">
				<ul className="flex space-x-4 flex-1">
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
							<li>
								<a
									onClick={handleLogout}
									className="text-white hover:underline"
								>
									Logout
								</a>
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
			</div>
		</nav>
	);
}
