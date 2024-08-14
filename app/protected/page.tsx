// app/protected/page.tsx
import AuthButton from "@/components/AuthButton";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import ProcurementForm from "@/components/ProcurementForm";
import Link from "next/link";

export default async function ProtectedPage() {
	const supabase = createClient();

	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		return redirect("/login");
	}

	return (
		<div className="flex-1 w-full flex flex-col gap-16 items-center">
			<div className="w-full">
				<div className="py-6 font-semibold bg-purple-950 text-center text-white">
					This is a protected page that you can only see as an authenticated
					user
				</div>
				<nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
					<div className="w-full max-w-4xl flex justify-between items-center p-3 text-sm">
						<Link
							href="/"
							className="text-foreground bg-btn-background hover:bg-btn-background-hover flex items-center group text-sm rounded-md p-2 px-4"
						>
							Landing Page
						</Link>
						<AuthButton />
					</div>
				</nav>
			</div>

			<div className="flex-1 flex flex-col mb-10 max-w-4xl px-3">
				<main className="flex-1 flex flex-col gap-6">
					<h2 className="font-bold text-4xl mb-4">Procurement Form</h2>
					<ProcurementForm />
				</main>
			</div>
		</div>
	);
}
