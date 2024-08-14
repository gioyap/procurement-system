import Link from "next/link";
import AuthButton from "../components/AuthButton";
export default async function Index() {
	return (
		<div className="flex-1 w-full flex flex-col gap-20 items-center">
			<nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
				<div className="w-full max-w-4xl flex justify-between items-center p-3 text-sm">
					<Link
						href="/protected"
						className="text-foreground bg-btn-background hover:bg-btn-background-hover flex items-center group text-sm rounded-md p-2 px-4"
					>
						Home
					</Link>
					<AuthButton />
				</div>
			</nav>

			<div className="flex-1 flex flex-col gap-20 max-w-4xl px-3">
				<main className="flex-1 flex flex-col gap-6"></main>
			</div>

			<footer className="w-full border-t border-t-foreground/10 p-8 flex justify-center text-center text-xs">
				<p>
					Powered by{" "}
					<a
						href="https://supabase.com/?utm_source=create-next-app&utm_medium=template&utm_term=nextjs"
						target="_blank"
						className="font-bold text-pink-500 hover:underline"
						rel="noreferrer"
					>
						Flawless
					</a>
				</p>
			</footer>
		</div>
	);
}
