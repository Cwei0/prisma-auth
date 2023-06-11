import { createTransport } from "nodemailer";
import { Options } from "nodemailer/lib/mailer";
import log from "./logger";

export async function sendEmail(email: string, userOtp: string) {
  const transporter = createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    auth: {
      user: "lorine87@ethereal.email",
      pass: "gAUbEDk9gHGwH2eNvt",
    },
  });

  const resetRoute = "http://localhost:4200/reset-password";

  let mailOptions: Options = {
    from: "My Application <noreply@myapp.com>",
    to: email,
    subject: "Password Reset",
    text: `Hello,

        You have requested to reset your password.
        
        Please use the following code: ${userOtp}
        
        If you did not request this password reset, please ignore this email.
        
        To reset your password, click on the following button:
        
        <a href="${resetRoute}" style="text-decoration: none;">
          <button style="background-color: #3f51b5; color: white; padding: 10px 20px; border: none; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2), 0 4px 8px rgba(0, 0, 0, 0.1); font-size: 16px;">
            Reset Password
          </button>
        </a>
        
        Best regards,
        The Example Team`,
    html: `<p>Hello,</p>
        <p>You have requested to reset your password.</p>
        <p>Please use the following code: <strong>${userOtp}</strong></p>
        <p>If you did not request this password reset, please ignore this email.</p>
        <p>To reset your password, click on the following button:</p>
        <p>
          <a href="${resetRoute}" style="text-decoration: none;">
            <button style="background-color: #3f51b5; color: white; padding: 10px 20px; border: none; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2), 0 4px 8px rgba(0, 0, 0, 0.1); font-size: 16px;">
              Reset Password
            </button>
          </a>
        </p>
        <p>Best regards,<br>The Example Team</p>`,
  };

  try {
    let info = await transporter.sendMail(mailOptions);
    log.info(`Email Sent: ${info.messageId}`);
  } catch (error) {
    log.error(`Error sending email: ${error}`)
  }

}
