// pages/index.js
//import Image from "next/image";
import Link from "next/link";
import Navigation from "../components/Navigation";

export default function Home() {
	return (
		<div>
			<Navigation />
			<header>Recommend</header>
			<main className="">
				<p className="text-center text-[#fff]">
					Share and discover your favorites!
					<br />
					<em>Recommend</em> is a social media platform for sharing
					your favorite books, movies, and TV shows.
				</p>
				<p className="text-center text-[#fff]">
					<br />
					<br />
					Login or Register to get started
				</p>
			</main>
			<footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center"></footer>
		</div>
	);
}
