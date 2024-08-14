"use client";

import { useEffect, useState } from "react";

const ApproveRequest = () => {
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<string | null>(null);

	// Use state to hold procurement ID
	const [procurementId, setProcurementId] = useState<string | null>(null);

	useEffect(() => {
		// Check if running on client side
		if (typeof window !== "undefined") {
			const urlParams = new URLSearchParams(window.location.search);
			const id = urlParams.get("id");
			setProcurementId(id);

			if (id) {
				// Call the API to approve the specific procurement record
				fetch(`/api/rejectRequest`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ id }), // Include the procurement ID
				})
					.then((response) => {
						if (!response.ok) {
							throw new Error("Network response was not ok.");
						}
						return response.json();
					})
					.then((data) => {
						setSuccess("Request rejected successfully.");
					})
					.catch((error) => {
						setError("Error approving request: " + error.message);
					})
					.finally(() => {
						setLoading(false);
					});
			} else {
				setError("Procurement ID is missing.");
				setLoading(false);
			}
		}
	}, []);

	return (
		<div>
			{loading && <p>Processing request...</p>}
			{error && <p style={{ color: "red" }}>{error}</p>}
			{success && <p style={{ color: "green" }}>{success}</p>}
		</div>
	);
};

export default ApproveRequest;
