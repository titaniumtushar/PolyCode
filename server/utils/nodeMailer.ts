import nodemailer from "nodemailer";

// Log environment variables for debugging
console.log("APP_USER:", process.env.USER);
console.log("Entering Mail Function");

// Nodemailer Transporter Configuration
const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 465, // Use 465 for SSL
  secure: true, // Use true for SSL
  auth: {
    user: process.env.USER, // Ensure this matches the sender's email
    pass: process.env.PASSWORD, // Use app password for Gmail if 2FA is enabled
  },
});


const sendMail = async (email:string,username:string,message:string) => {
  try {

    
    const mailOptions = {
      from: {
        name: "BrainFlow",
        address: process.env.USER, // Ensure this is the sender's email address
      },
      to: email,
      subject: "Congratulations!,You have been invited.",
      text: `Dear ${username},\n\n${message}`, // Fallback plain text version
      html: `
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; padding: 20px; max-width: 600px; margin: auto; background-color: #f4f4f4;">
        <div style="background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
          <p>Dear ${username},</p>
          <pre>${message}</pre>
        </div>
      </body>
      `,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log("Email sent successfully:", info.messageId);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

export { sendMail };
