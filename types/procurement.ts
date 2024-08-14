// types/procurement.ts
export interface ProcurementData {
	department: string;
	name: string;
	contact: string;
	aim: string;
	desired: string;
	specificUse: string;
	recommendation: string;
	product: string;
	description: string;
	quantity: string;
	unitPrice: string;
	retailPrice: string;
	totalPrice: string;
	justification: string;
	status: "pending" | "approved" | "rejected";
}
