import { createTransport } from "nodemailer";

const transport = createTransport({
	host: process.env.MAIL_HOST,
	port: process.env.MAIL_PORT,
	auth: {
		user: process.env.MAIL_USER,
		pass: process.env.MAIL_PASS,
	},
});

function makeANiceEmail(text: string): string {
	return `
    <div style="border: 1px solid black; padding: 20px; font-family: sans-serif;
    line-height: 2; font-size: 20px">
    <h2>Hello There!<h2>
    <p>🥳, Ljubisa Stevanovic</p>
    </div>
    `;
}

interface MailResponse {
	message: string;
}

export async function sendPasswordResetEmail(
	resetToken: string,
	to: string
): Promise<void> {
	const info = await transport.sendMail({
		to,
		from: "support@SickFits.com",
		subject: "Your password Reset token",
		html: makeANiceEmail(`Your Password reset token is here!
        <a href="${process.env.FRONTEND_URL}/reset?=token=${resetToken}">Clikc Here to reset it</a>     
        `),
	});
}
