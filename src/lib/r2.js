import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';

// Read env variables (matching YOUR .env.local names)
const ACCOUNT_ID = process.env.CLOUDFLARE_R2_ACCOUNT_ID;
const ACCESS_KEY_ID = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID;
const SECRET_ACCESS_KEY = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY;
const BUCKET_NAME = process.env.CLOUDFLARE_R2_BUCKET_NAME;
const PUBLIC_URL = process.env.CLOUDFLARE_R2_PUBLIC_URL;

// Build endpoint from account ID
const ENDPOINT = `https://${ACCOUNT_ID}.r2.cloudflarestorage.com`;

// Log config (for debugging)
console.log('🔧 R2 Config Check:');
console.log('  ACCOUNT_ID:', ACCOUNT_ID || '❌ MISSING');
console.log('  BUCKET_NAME:', BUCKET_NAME || '❌ MISSING');
console.log('  ENDPOINT:', ENDPOINT);
console.log('  ACCESS_KEY:', ACCESS_KEY_ID ? '✅ Set' : '❌ MISSING');
console.log('  SECRET_KEY:', SECRET_ACCESS_KEY ? '✅ Set' : '❌ MISSING');
console.log('  PUBLIC_URL:', PUBLIC_URL || '❌ MISSING');

export const r2Client = new S3Client({
  region: 'auto',
  endpoint: ENDPOINT,
  credentials: {
    accessKeyId: ACCESS_KEY_ID,
    secretAccessKey: SECRET_ACCESS_KEY,
  },
});

export async function uploadToR2(file, fileName) {
  // Validate
  if (!BUCKET_NAME) {
    throw new Error('CLOUDFLARE_R2_BUCKET_NAME is missing in .env.local');
  }
  if (!ACCOUNT_ID) {
    throw new Error('CLOUDFLARE_R2_ACCOUNT_ID is missing in .env.local');
  }
  if (!ACCESS_KEY_ID || !SECRET_ACCESS_KEY) {
    throw new Error('R2 credentials are missing in .env.local');
  }
  if (!PUBLIC_URL) {
    throw new Error('CLOUDFLARE_R2_PUBLIC_URL is missing in .env.local');
  }

  try {
    console.log('📤 Uploading to R2...');
    console.log('  Bucket:', BUCKET_NAME);
    console.log('  FileName:', fileName);
    console.log('  FileSize:', file.size);

    const buffer = Buffer.from(await file.arrayBuffer());

    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: fileName,
      Body: buffer,
      ContentType: file.type,
    });

    await r2Client.send(command);
    
    const publicUrl = `${PUBLIC_URL}/${fileName}`;
    console.log('✅ Upload Success:', publicUrl);
    
    return publicUrl;
  } catch (error) {
    console.error('❌ R2 Upload Error:');
    console.error('  Name:', error.name);
    console.error('  Message:', error.message);
    console.error('  Code:', error.Code);
    throw error;
  }
}

export async function deleteFromR2(fileName) {
  if (!BUCKET_NAME) {
    throw new Error('CLOUDFLARE_R2_BUCKET_NAME is missing');
  }
  
  const command = new DeleteObjectCommand({
    Bucket: BUCKET_NAME,
    Key: fileName,
  });
  await r2Client.send(command);
}