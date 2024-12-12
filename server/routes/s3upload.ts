import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import * as dotenv from "dotenv";

dotenv.config();

const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.accessKey || "",
        secretAccessKey: process.env.SecretAcessKey || "",
    },
});

/**
 * Function to generate a pre-signed URL for uploading to S3
 * @param bucketName - Name of the S3 bucket
 * @param key - The key (path/filename) for the object
 * @param expiresIn - URL expiration time in seconds (default: 3600 seconds / 1 hour)
 * @param contentType - type of content provided by the user
 * @returns A pre-signed URL string
 */
export const generatePresignedUrl = async (
    bucketName: string,
    key: string,
    expiresIn: number = 3600,
    contentType: string
): Promise<string> => {
    try {
        console.log(contentType + "   contenType in s3 Uplaod file ");

        const command = new PutObjectCommand({
            Bucket: bucketName,
            Key: key,
            ContentType: contentType,
            ContentDisposition: "inline",
        });

        const signedUrl = await getSignedUrl(s3, command, { expiresIn });

        return signedUrl;
    } catch (error) {
        console.error("Error generating pre-signed URL:", error);
        throw error;
    }
};

/**
 * Function to generate multiple pre-signed URLs for uploading multiple files
 * @param username - The username to be used for generating file keys
 * @param contentType
 * @returns An array of objects containing keys and their corresponding pre-signed URLs
 */
export const generateMultipleUrls = async (
    username: string,
    contentType: string
) => {
    const bucketName = process.env.AWS_BUCKET_NAME || "";
    const mimeToExtension: Record<string, string> = {
        "image/jpeg": "jpeg",
        "image/png": "png",
    };

    function getFileExtension(contentType: string): string {
        return mimeToExtension[contentType] || "unknown";
    }

    const fileExtension = getFileExtension(contentType);

    // Define the files with their respective content types and file names
    const files = [
        {
            key: `${username}/profile_pic.${fileExtension}`,
            contentType: contentType,
        },
        { key: `${username}/resume.pdf`, contentType: "application/pdf" },
        { key: `${username}/certificate.pdf`, contentType: "application/pdf" },
    ];

    try {
        // Generate a pre-signed URL for each file
        const urlPromises = files.map(async (file) => {
            return {
                key: file.key,
                url: await generatePresignedUrl(
                    bucketName,
                    file.key,
                    3600 * 10,
                    file.contentType
                ),
            };
        });

        // Wait for all URLs to be generated
        const urls = await Promise.all(urlPromises);

        return urls; // Return the generated URLs
    } catch (error) {
        console.error("Error generating pre-signed URLs:", error);
        throw new Error("Failed to generate pre-signed URLs");
    }
};
