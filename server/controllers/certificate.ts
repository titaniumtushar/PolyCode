import { createCanvas, loadImage } from "canvas";
import * as fs from "fs";
import * as path from "path";
import { UserModel } from "../models/user";
import { sendMailCert } from "./mailerCert";

// Define the Participant type
interface Participant {
  user_id: string;
}

// Function to generate a certificate
async function createCertificate(
  templatePath: string,
  outputPath: string,
  name: string,
  coordinates: [number, number],
  fontSize: number
): Promise<void> {
  try {
    // Load the certificate template image
    const template = await loadImage(templatePath);

    // Create a canvas with the template image dimensions
    const canvas = createCanvas(template.width, template.height);
    const ctx = canvas.getContext("2d");

    // Draw the template image on the canvas
    ctx.drawImage(template, 0, 0);

    // Set the font properties and add the name to the certificate
    ctx.font = `${fontSize}px Arial`;
    ctx.fillStyle = "black";
    ctx.fillText(name, coordinates[0], coordinates[1]);

    // Save the certificate image
    const buffer = canvas.toBuffer("image/png");
    fs.writeFileSync(outputPath, buffer);
    console.log(`Certificate created for ${name}: ${outputPath}`);
  } catch (error) {
    console.error(`Error generating certificate for ${name}:`, error);
  }
}

// Function to generate certificates for an array of participants
async function generateCertificates(participants: Participant[], contestId: string): Promise<void> {
  const folderName = `certificates_${contestId}`;

  // Create the directory if it doesn't exist
  if (!fs.existsSync(folderName)) {
    fs.mkdirSync(folderName);
  }

  const templatePath = path.join(__dirname, "image.png");
  const coordinates: [number, number] = [1000,800]
  const fontSize = 40 // Font size

  // Generate certificates for each participant
  for (const participant of participants) {

      const user:any = await UserModel.findOne({_id:participant.user_id});

    
    console.log(user);
    try {
      const outputPath = path.join(folderName, `${participant.user_id}.png`);
    await createCertificate(templatePath, outputPath, user.name ,coordinates,fontSize);
    console.log(outputPath);
      sendMailCert(user.email,user.name,"this is your message",outputPath);
      
    } catch (error) {
      console.log(error);
      
    }
    
  }
  console.log(`All certificates saved in folder: ${folderName}`);
}








// Export the functions
export { generateCertificates, createCertificate };
