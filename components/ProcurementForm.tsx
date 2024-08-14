"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ProcurementData } from "@/types/procurement";

export default function ProcurementForm() {
	const [desired, setDesired] = useState("");
	const [specificUse, setSpecificUse] = useState("");
	const [showCustomInputs, setShowCustomInputs] = useState(false);
	const [showRecommendations, setShowRecommendations] = useState(false);
	const [isCustomizing, setIsCustomizing] = useState(false);
	const [selectedRecommendation, setSelectedRecommendation] = useState<
		number | null
	>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [selectedAim, setSelectedAim] = useState("");

	const supabase = createClient();

	const handleAimChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const value = e.target.value;
		setSelectedAim(value);
		// Optionally reset desired and other fields if needed
		setDesired("");
	};

	const handleDesiredChange = (e: any) => {
		const value = e.target.value;
		setDesired(value);
		setShowCustomInputs(value === "Others");
		setShowRecommendations(false); // Reset recommendations visibility
		setSpecificUse(""); // Reset specific use selection
	};

	const handleSpecificUseChange = (e: any) => {
		const value = e.target.value;
		setSpecificUse(value);
		setShowRecommendations(value !== "" || desired === "Camera");
	};

	const handleRecommendationClick = (index: number) => {
		if (!isCustomizing) {
			setSelectedRecommendation(index);
		}
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setLoading(true);
		// the recommendation will return empty if the user change his mind and go to the customize specs
		const formData = new FormData(e.currentTarget);
		//this is temporary for now
		const department = formData.get("department") as string;
		// Define emails for departments that have admin emails
		const departmentEmails: { [key: string]: string } = {
			HR: "gioedrianlyap7@gmail.com",
			// Add more departments with their corresponding admin emails here
		};
		// Check if the selected department has an associated email
		if (!departmentEmails[department]) {
			toast.error("Selected department does not have an associated email.");
			setLoading(false);
			return;
		}

		const recommendationsForSpecificUse = recommendations[specificUse] || [];
		const recommendationData = isCustomizing
			? (formData.get("customSpecs") as string)
			: selectedRecommendation !== null &&
			  selectedRecommendation < recommendationsForSpecificUse.length
			? recommendationsForSpecificUse[selectedRecommendation].specs // Access the `specs` property
			: "";

		const data: ProcurementData = {
			department: formData.get("department") as string,
			name: formData.get("name") as string,
			contact: formData.get("contact") as string,
			aim: formData.get("aim") as string,
			desired: formData.get("desired") as string,
			specificUse: formData.get("specificUse") as string,
			recommendation: recommendationData,
			product: formData.get("product") as string,
			description: formData.get("description") as string,
			quantity: formData.get("quantity") as string,
			unitPrice: formData.get("unitPrice") as string,
			retailPrice: formData.get("retailPrice") as string,
			totalPrice: formData.get("totalPrice") as string,
			justification: formData.get("justify") as string,
			status: "pending",
		};
		try {
			// Insert data into Supabase
			const { data: insertedData, error: insertError } = await supabase
				.from("procurements")
				.insert([data])
				.select("id")
				.single();
			if (insertError) throw insertError;
			const insertedId = insertedData.id;
			// Prepare email payload
			const emailPayload = {
				...data,
				id: insertedId,
			};
			// Send email with the inserted data
			const emailResponse = await fetch("/api/sendEmail", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(emailPayload),
			});

			if (!emailResponse.ok) {
				throw new Error("Failed to send email");
			}

			toast.success(
				"Procurement request submitted and email sent successfully!"
			);
		} catch (err: any) {
			console.error(err);
			setError("Failed to submit the procurement request. Please try again.");
		} finally {
			setLoading(false);
		}
	};
	const formatPrice = (price: number) => {
		return `₱${price.toLocaleString()}`;
	};
	const recommendations: any = {
		Photoshop: [
			{ title: "High-end PC", specs: "i9, 32GB RAM, RTX 3090", price: 30000 },
			{ title: "Mid-range PC", specs: "i7, 16GB RAM, GTX 1660", price: 20000 },
			{ title: "Budget PC", specs: "i5, 8GB RAM, GTX 1050", price: 15000 },
		],
		"Video Editing": [
			{ title: "High-end PC", specs: "i9, 64GB RAM, RTX 3090", price: 28000 },
			{ title: "Mid-range PC", specs: "i7, 32GB RAM, RTX 2070", price: 18000 },
			{ title: "Budget PC", specs: "i5, 16GB RAM, GTX 1660", price: 10000 },
		],
		Programming: [
			{ title: "High-end PC", specs: "i7, 32GB RAM, RTX 3080", price: 35000 },
			{ title: "Mid-range PC", specs: "i5, 16GB RAM, GTX 1650", price: 25000 },
			{
				title: "Budget PC",
				specs: "i3, 8GB RAM, Integrated Graphics",
				price: 18000,
			},
		],
		Camera: [
			{
				title: "Canon EOS R5",
				specs: "45MP, 8K Video, Dual Pixel AF",
				price: 200000,
			},
			{
				title: "Sony A7S III",
				specs: "12MP, 4K Video, Fast Hybrid AF",
				price: 250000,
			},
			{
				title: "Nikon Z6 II",
				specs: "24MP, 4K Video, Dual Expeed 6",
				price: 180000,
			},
		],
	};

	return (
		<>
			<form className="flex flex-col gap-4" onSubmit={handleSubmit}>
				{/* Department Dropdown */}
				<div>
					<label htmlFor="department" className="block font-medium">
						Department <span className="text-red-600">*</span>
					</label>
					<select
						id="department"
						name="department"
						required
						className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
					>
						<option value="">Select Department</option>
						<option value="HR">HR</option>
						<option value="Finance">Finance</option>
						<option value="Operations">Operations</option>
						<option value="Marketing">Marketing</option>
						<option value="IT">IT</option>
						{/* Add other departments as needed */}
					</select>
				</div>

				{/* Name Input */}
				<div>
					<label htmlFor="name" className="block font-medium">
						Name <span className="text-red-600">*</span>
					</label>
					<input
						type="text"
						id="name"
						name="name"
						className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
						placeholder="Enter your name"
						required
					/>
				</div>

				{/* Contact/Email Input */}
				<div>
					<label htmlFor="contact" className="block font-medium">
						Contact
					</label>
					<input
						type="contact"
						id="contact"
						name="contact"
						className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
						placeholder="you@example.com"
					/>
				</div>

				{/* Aim Dropdown */}
				<div>
					<label htmlFor="aim" className="block font-medium">
						Aim <span className="text-red-600">*</span>
					</label>
					<select
						id="aim"
						name="aim"
						value={selectedAim}
						onChange={handleAimChange}
						required
						className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
					>
						<option value="">Select Aim</option>
						<option value="MIS-IT">MIS-IT Department</option>
						<option value="Operations">Operations Department</option>
						<option value="HR">HR Department</option>
						<option value="Finance">Finance Department</option>
						{/* Add other aims as needed */}
					</select>
				</div>

				{/* Desired Dropdown */}
				{selectedAim === "MIS-IT" && (
					<div>
						<label htmlFor="desired" className="block font-medium">
							Desired <span className="text-red-600">*</span>
						</label>
						<select
							id="desired"
							name="desired"
							required
							className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
							value={desired}
							onChange={handleDesiredChange}
						>
							<option value="">Select Desired</option>
							<option value="PC">Personal Computer</option>
							<option value="Laptop">Laptop</option>
							<option value="Camera">Camera</option>
							<option value="Others">Others</option>
						</select>
					</div>
				)}

				{/* Specific Use Dropdown */}
				{desired && desired !== "Others" && (
					<div>
						<label htmlFor="specificUse" className="block font-medium">
							Specific Use
						</label>
						<select
							id="specificUse"
							name="specificUse"
							value={specificUse}
							onChange={handleSpecificUseChange}
							className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
						>
							<option value="">Select Specific Use</option>
							{(desired === "Camera"
								? ["Camera"]
								: Object.keys(recommendations).filter(
										(key) =>
											(desired !== "PC" && desired !== "Laptop") ||
											key !== "Camera"
								  )
							).map((key) => (
								<option key={key} value={key}>
									{key}
								</option>
							))}
						</select>
					</div>
				)}

				{/* Recommendations */}
				{showRecommendations &&
					specificUse &&
					!isCustomizing &&
					recommendations[specificUse] && (
						<div className="flex flex-row gap-4 mt-4">
							{recommendations[specificUse].map((rec: any, index: number) => (
								<div
									key={index}
									onClick={() => handleRecommendationClick(index)}
									className={`p-4 border rounded-md shadow-sm w-1/3 cursor-pointer ${
										selectedRecommendation === index
											? "bg-blue-500 text-white"
											: "bg-white"
									}`}
								>
									<h3 className="font-bold">{rec.title}</h3>
									<p>{rec.specs}</p>
									<p>Price: {formatPrice(rec.price)}</p>
								</div>
							))}
						</div>
					)}

				{/* Custom Inputs (Shown when "Others" is selected) */}
				{showCustomInputs && (
					<>
						<div>
							<label htmlFor="product" className="block font-medium">
								Product <span className="text-red-600">*</span>
							</label>
							<input
								type="text"
								id="product"
								name="product"
								className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
								placeholder="Enter product name"
								required
							/>
						</div>

						<div>
							<label htmlFor="description" className="block font-medium">
								Description <span className="text-red-600">*</span>
							</label>
							<textarea
								id="description"
								name="description"
								className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
								placeholder="Enter product description"
								required
							></textarea>
						</div>

						<div>
							<label htmlFor="quantity" className="block font-medium">
								Quantity <span className="text-red-600">*</span>
							</label>
							<input
								type="number"
								id="quantity"
								name="quantity"
								className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
								placeholder="Enter quantity"
								required
							/>
						</div>

						<div>
							<label htmlFor="unitPrice" className="block font-medium">
								Unit Price <span className="text-red-600">*</span>
							</label>
							<input
								type="number"
								step="0.01"
								id="unitPrice"
								name="unitPrice"
								className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
								placeholder="Enter unit price"
								required
							/>
						</div>

						<div>
							<label htmlFor="retailPrice" className="block font-medium">
								Retail Price <span className="text-red-600">*</span>
							</label>
							<input
								type="number"
								step="0.01"
								id="retailPrice"
								name="retailPrice"
								className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
								placeholder="Enter retail price"
								required
							/>
						</div>

						<div>
							<label htmlFor="totalPrice" className="block font-medium">
								Total Price <span className="text-red-600">*</span>
							</label>
							<input
								type="number"
								step="0.01"
								id="totalPrice"
								name="totalPrice"
								className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
								placeholder="Enter total price"
								required
							/>
						</div>
					</>
				)}

				{/* justification */}
				<div>
					<label htmlFor="justification" className="block font-medium">
						Justification <span className="text-red-600">*</span>
					</label>
					<textarea
						id="justify"
						name="justify"
						className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
						placeholder="Please justify your request"
					></textarea>
				</div>

				{/* Submit Button */}
				<div>
					<button
						type="submit"
						className="mt-4 w-full py-2 px-4 bg-purple-600 text-white font-semibold rounded-md shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
						disabled={loading}
					>
						{loading ? "Submitting..." : "Submit Request"}
					</button>
					{error && <p className="text-red-500 mt-2">{error}</p>}
				</div>
			</form>
			<ToastContainer autoClose={5000} />
		</>
	);
}
