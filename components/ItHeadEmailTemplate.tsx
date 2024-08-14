// components/EmailTemplate.tsx
import React from "react";

interface ItHeadEmailTemplate {
	data: {
		id: string;
		department?: string;
		name?: string;
		contact?: string;
		aim?: string;
		desired?: string;
		specificUse?: string;
		recommendation?: string;
		product?: string;
		description?: string;
		quantity?: string;
		unitPrice?: string;
		retailPrice?: string;
		totalPrice?: string;
		justification?: string;
	};
}

const ItHeadEmailTemplate: React.FC<ItHeadEmailTemplate> = ({ data }) => {
	console.log("Email Template Data:", data);
	const recommendationLink = `${process.env.NEXT_PUBLIC_BASE_URL}/admin/approve?id=${data.id}`;

	return (
		<div
			style={{
				backgroundColor: "#f8f9fa",
				padding: "20px",
				borderRadius: "10px",
				fontFamily: "Arial, sans-serif",
				color: "#333",
			}}
		>
			<h1 style={{ color: "#007bff", textAlign: "center" }}>
				New Procurement Request
			</h1>
			<p style={{ fontSize: "18px", marginBottom: "20px" }}>
				You have received a new procurement request and it is already approve by
				the manager. Here are the details:
			</p>
			<table
				border={1}
				cellPadding="10"
				cellSpacing="0"
				style={{ width: "100%", borderCollapse: "collapse" }}
			>
				<thead>
					<tr
						style={{
							backgroundColor: "#007bff",
							color: "white",
							fontSize: "16px",
						}}
					>
						<th style={{ textAlign: "left" }}>Field</th>
						<th style={{ textAlign: "left" }}>Details</th>
					</tr>
				</thead>
				<tbody>
					<tr style={{ fontSize: "16px" }}>
						<td>
							<strong>Department</strong>
						</td>
						<td>{data.department || "N/A"}</td>
					</tr>
					<tr style={{ fontSize: "16px" }}>
						<td>
							<strong>Name</strong>
						</td>
						<td>{data.name || "N/A"}</td>
					</tr>
					<tr style={{ fontSize: "16px" }}>
						<td>
							<strong>Contact</strong>
						</td>
						<td>{data.contact || "N/A"}</td>
					</tr>
					<tr style={{ fontSize: "16px" }}>
						<td>
							<strong>Aim</strong>
						</td>
						<td>{data.aim || "N/A"}</td>
					</tr>
					<tr style={{ fontSize: "16px" }}>
						<td>
							<strong>Desired</strong>
						</td>
						<td>{data.desired || "N/A"}</td>
					</tr>
					<tr style={{ fontSize: "16px" }}>
						<td>
							<strong>Specific Use</strong>
						</td>
						<td>{data.specificUse || "N/A"}</td>
					</tr>
					{data.recommendation && (
						<tr style={{ fontSize: "16px" }}>
							<td>
								<strong>Recommendation</strong>
							</td>
							<td>{data.recommendation}</td>
						</tr>
					)}
					{data.product && (
						<tr style={{ fontSize: "16px" }}>
							<td>
								<strong>Product</strong>
							</td>
							<td>{data.product}</td>
						</tr>
					)}
					{data.description && (
						<tr style={{ fontSize: "16px" }}>
							<td>
								<strong>Description</strong>
							</td>
							<td>{data.description}</td>
						</tr>
					)}
					{data.quantity && (
						<tr style={{ fontSize: "16px" }}>
							<td>
								<strong>Quantity</strong>
							</td>
							<td>{data.quantity}</td>
						</tr>
					)}
					{data.unitPrice && (
						<tr style={{ fontSize: "16px" }}>
							<td>
								<strong>Unit Price</strong>
							</td>
							<td>{data.unitPrice}</td>
						</tr>
					)}
					{data.retailPrice && (
						<tr style={{ fontSize: "16px" }}>
							<td>
								<strong>Retail Price</strong>
							</td>
							<td>{data.retailPrice}</td>
						</tr>
					)}
					{data.totalPrice && (
						<tr style={{ fontSize: "16px" }}>
							<td>
								<strong>Total Price</strong>
							</td>
							<td>{data.totalPrice}</td>
						</tr>
					)}
					<tr style={{ fontSize: "16px" }}>
						<td>
							<strong>Justification</strong>
						</td>
						<td>{data.justification || "N/A"}</td>
					</tr>
				</tbody>
			</table>
			<p style={{ fontSize: "16px", marginTop: "20px" }}>
				Please review the request and take the necessary action.
			</p>
			<div
				style={{
					marginTop: "20px",
					display: "flex",
					justifyContent: "space-between",
				}}
			>
				<a
					href={recommendationLink}
					style={{
						backgroundColor: "#28a745",
						color: "#fff",
						padding: "10px 20px",
						borderRadius: "5px",
						textDecoration: "none",
						fontWeight: "bold",
						textAlign: "center",
						display: "inline-block",
					}}
				>
					Recommendation
				</a>
			</div>
		</div>
	);
};

export default ItHeadEmailTemplate;
