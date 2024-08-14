import nodemailer from "nodemailer";
import { NextResponse } from "next/server";
import EmailTemplateServer from "@/components/EmailTemplateServer";

export async function POST(req: Request) {
	try {
		const data = await req.json();

		// Check if the department is "HR"
		if (data.department !== "HR") {
			return NextResponse.json(
				{ message: "Email is not sent as the department is not HR" },
				{ status: 200 }
			);
		}

		const emailContent = <EmailTemplateServer data={data} />;

		// Convert the email content to an HTML string
		const htmlContent = await new Promise<string>((resolve, reject) => {
			import("react-dom/server").then(({ renderToStaticMarkup }) => {
				try {
					resolve(renderToStaticMarkup(emailContent));
				} catch (err) {
					reject(err);
				}
			});
		});

		// Create a transporter
		const transporter = nodemailer.createTransport({
			service: "gmail",
			auth: {
				user: process.env.GMAIL_USER,
				pass: process.env.GMAIL_PASS,
			},
		});

		// Define email options
		const mailOptions = {
			from: process.env.GMAIL_USER,
			to: process.env.HR_ADMIN_EMAIL,
			subject: "New Procurement Request",
			html: htmlContent,
		};

		// Send the email
		await transporter.sendMail(mailOptions);
		console.log("Email sent successfully.");
		console.log("Data to be sent in email:", data);

		return NextResponse.json(
			{ message: "Email sent successfully" },
			{ status: 200 }
		);
	} catch (error) {
		console.error("Failed to send email:", error);
		return NextResponse.json(
			{ error: "Failed to send email" },
			{ status: 500 }
		);
	}
}

export async function OPTIONS() {
	return new NextResponse(null, {
		status: 204,
		headers: {
			Allow: "POST",
			"Content-Length": "0",
		},
	});
}
