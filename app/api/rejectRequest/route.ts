// /app/api/approveRequest
import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/client";

export async function POST(request: Request) {
	try {
		// Parse the request body to get the procurement ID
		const { id } = await request.json();
		console.log("Received ID:", id); // Log the received ID

		// Check if the ID is provided
		if (!id) {
			return NextResponse.json(
				{ message: "Procurement ID is required" },
				{ status: 400 }
			);
		}

		// Create a Supabase client instance
		const supabase = createClient();

		// Update the status of the procurement record to "approved"
		const { error: updateError } = await supabase
			.from("procurements")
			.update({ status: "rejected" })
			.eq("id", id);

		if (updateError) {
			console.error("Error updating status:", updateError); // Log the update error
			throw updateError;
		}

		return NextResponse.json({ message: "Request updated successfully" });
	} catch (error) {
		console.error("Error updating procurement:", error);
		return NextResponse.json(
			{ message: "Failed to update procurement" },
			{ status: 500 }
		);
	}
}
