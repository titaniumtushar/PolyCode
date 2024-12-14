import nodemailer from "nodemailer";
import path from "path";

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

const sendMailCert = async (
  email: string,
  username: string,
  message: string,
  attachmentPath?: string 
) => {
  try {
    console.log("fkmkfmskfsmfksmfskf");

    console.log(email,username,message);
    const mailOptions: any = {
      from: {
        name: "PolyCode Arena",
        address: process.env.USER, // Ensure this is the sender's email address
      },
      to: email,
      subject: "Congratulations! You have been invited.",
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

    // Add attachment if provided
    if (attachmentPath) {
      mailOptions.attachments = [
        {
          filename: path.basename(attachmentPath), // Extract filename from path
          path: attachmentPath, // Path to the file
        },
      ];
    }

    const info = await transporter.sendMail(mailOptions);

    console.log("Email sent successfully:", info.messageId);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};


const sendMailBuyTicket = async (
  email: string,
  username: string,
  message: string,
  ownershipId: string,
  productUrl: string,
  
) => {
  try {
    console.log("Sending ownership certificate...");

    console.log(email, username, message, ownershipId, productUrl);

    const mailOptions: any = {
      from: {
        name: "PolyCode Arena",
        address: process.env.USER, // Sender's email
      },
      to: email,
      subject: "🎟️ Ownership Certificate - Your Product Details 🎟️",
      text: `Dear ${username},\n\n${message}\n\nOwnership ID: ${ownershipId}\nProduct URL: ${productUrl}`,
      html: `
      <body style="font-family: 'Arial', sans-serif; margin: 0; padding: 0; background-color: #f9f9f9;">
        <table role="presentation" style="width: 100%; border-spacing: 0;">
          <tr>
            <td style="padding: 20px 0; text-align: center; background-color: #0056b3; color: #ffffff;">
              <h1>🎟️ Ownership Certificate 🎟️</h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px; background-color: #ffffff;">
              <h2 style="text-align: center; color: #333;">Congratulations, ${username}!</h2>
              <p style="text-align: center; font-size: 16px; color: #555;">
                ${message}
              </p>
              <div style="margin: 30px auto; text-align: center; padding: 15px; border: 2px dashed #0056b3; border-radius: 8px; max-width: 500px; background-color: #f4faff;">
                <p style="font-size: 18px; margin: 0; color: #333;">📜 <strong>Ownership ID:</strong> ${ownershipId}</p>
                <p style="text-align: center; margin: 20px 0;">
  <img src=${productUrl} alt="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTIPbAPw5iG90-9SzSQnphfdPfK5J1-PdTY8g&s" 
    style="
      width: 100%; 
      max-width: 400px; 
      height: auto; 
      border: 2px solid #ddd; 
      border-radius: 8px; 
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    "
  />
</p>

              </div>
            </td>
          </tr>
          <tr>
            <td style="text-align: center; padding: 20px; background-color: #0056b3; color: #ffffff;">
              <p style="margin: 0;">Thank you for your purchase!</p>
            </td>
          </tr>
        </table>
      </body>
      `,
    };

    // Add attachment if provided
    

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", info.messageId);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};





// Export the sendMail function
export { sendMailCert,sendMailBuyTicket };
