import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";

// S3 Configuration
const s3Client = new S3Client({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

const BUCKET_NAME = process.env.S3_BUCKET_NAME || "morpheus-lab-reports";

// Multer configuration for memory storage
export const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'application/pdf',
      'image/jpeg',
      'image/jpg', 
      'image/png',
      'image/tiff',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, images, and Word documents are allowed.'));
    }
  },
});

// Upload file to S3
export async function uploadToS3(
  file: Express.Multer.File,
  patientId: string,
  reportName: string
): Promise<{ fileUrl: string; fileKey: string }> {
  const fileExtension = file.originalname.split('.').pop();
  const fileKey = `lab-reports/${patientId}/${uuidv4()}-${reportName.replace(/[^a-zA-Z0-9]/g, '_')}.${fileExtension}`;

  const uploadParams = {
    Bucket: BUCKET_NAME,
    Key: fileKey,
    Body: file.buffer,
    ContentType: file.mimetype,
    Metadata: {
      patientId,
      reportName,
      originalName: file.originalname,
      uploadDate: new Date().toISOString(),
    },
  };

  try {
    await s3Client.send(new PutObjectCommand(uploadParams));
    const fileUrl = `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION || "us-east-1"}.amazonaws.com/${fileKey}`;
    
    return { fileUrl, fileKey };
  } catch (error) {
    console.error("Error uploading to S3:", error);
    throw new Error("Failed to upload file to cloud storage");
  }
}

// Generate signed URL for secure file access
export async function generateSignedUrl(fileKey: string, expiresIn: number = 3600): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: fileKey,
  });

  try {
    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn });
    return signedUrl;
  } catch (error) {
    console.error("Error generating signed URL:", error);
    throw new Error("Failed to generate file access URL");
  }
}

// Fallback local storage for development (when AWS credentials are not available)
export async function uploadToLocal(
  file: Express.Multer.File,
  patientId: string,
  reportName: string
): Promise<{ fileUrl: string; fileKey: string }> {
  const fileExtension = file.originalname.split('.').pop();
  const fileName = `${uuidv4()}-${reportName.replace(/[^a-zA-Z0-9]/g, '_')}.${fileExtension}`;
  const fileKey = `lab-reports/${patientId}/${fileName}`;
  
  // For development, we'll store file metadata in the database with base64 data
  // In production, this would write to a local uploads directory
  const base64Data = file.buffer.toString('base64');
  const fileUrl = `data:${file.mimetype};base64,${base64Data}`;
  
  return { fileUrl, fileKey };
}

// Main upload function that tries S3 first, falls back to local storage
export async function uploadLabReportFile(
  file: Express.Multer.File,
  patientId: string,
  reportName: string
): Promise<{ fileUrl: string; fileKey: string; fileName: string; fileSize: number; fileType: string }> {
  let uploadResult;
  
  // Try S3 upload first if credentials are available
  if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) {
    try {
      uploadResult = await uploadToS3(file, patientId, reportName);
    } catch (error) {
      console.warn("S3 upload failed, falling back to local storage:", error);
      uploadResult = await uploadToLocal(file, patientId, reportName);
    }
  } else {
    // Use local storage for development
    uploadResult = await uploadToLocal(file, patientId, reportName);
  }

  return {
    ...uploadResult,
    fileName: file.originalname,
    fileSize: file.size,
    fileType: file.mimetype,
  };
}