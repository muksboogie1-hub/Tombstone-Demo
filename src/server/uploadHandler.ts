import type { IncomingMessage, ServerResponse } from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Root directory of the applet project
const projectRoot = path.resolve(__dirname, '../..');
const publicUploadsDir = path.resolve(projectRoot, 'public', 'uploads');
const distUploadsDir = path.resolve(projectRoot, 'dist', 'uploads');

export interface UploadPayload {
  filename?: string;
  dataUrl: string;
  folder?: string;
}

export function handleImageUpload(req: IncomingMessage, res: ServerResponse): void {
  if (req.method !== 'POST') {
    res.statusCode = 405;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ success: false, error: 'Method not allowed. Use POST.' }));
    return;
  }

  let body = '';
  // Max payload 15MB for base64 encoded images
  const MAX_PAYLOAD_BYTES = 15 * 1024 * 1024;

  req.on('data', (chunk) => {
    body += chunk.toString();
    if (body.length > MAX_PAYLOAD_BYTES) {
      res.statusCode = 413;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ success: false, error: 'Image file exceeds maximum allowable size (10 MB).' }));
      req.destroy();
    }
  });

  req.on('end', async () => {
    try {
      const data: UploadPayload = JSON.parse(body);

      if (!data.dataUrl || typeof data.dataUrl !== 'string') {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ success: false, error: 'Missing or invalid dataUrl.' }));
        return;
      }

      // Parse data URL format: data:<mime>;base64,<data>
      const matches = data.dataUrl.match(/^data:([a-zA-Z0-9/+-]+);base64,(.+)$/);
      if (!matches) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ success: false, error: 'Invalid dataUrl format. Expected Base64 data URI.' }));
        return;
      }

      const mimeType = matches[1].toLowerCase();
      const base64Data = matches[2];

      // Validate allowed mime types
      const allowedMimes: Record<string, string> = {
        'image/jpeg': 'jpg',
        'image/jpg': 'jpg',
        'image/png': 'png',
        'image/webp': 'webp',
        'image/gif': 'gif',
      };

      if (!allowedMimes[mimeType]) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        res.end(
          JSON.stringify({
            success: false,
            error: 'Unsupported image format. Allowed formats: JPEG, PNG, WebP, GIF.',
          })
        );
        return;
      }

      const ext = allowedMimes[mimeType];
      const folder = (data.folder || 'categories').replace(/[^a-zA-Z0-9_-]/g, '');
      const uniqueSuffix = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      const safeFileName = `${folder}-${uniqueSuffix}.${ext}`;

      // Destination directory inside public/uploads/<folder>
      const targetDir = path.join(publicUploadsDir, folder);
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }

      const filePath = path.join(targetDir, safeFileName);
      const buffer = Buffer.from(base64Data, 'base64');
      fs.writeFileSync(filePath, buffer);

      // If dist folder exists (production build), also mirror there so Express can serve immediately
      if (fs.existsSync(path.resolve(projectRoot, 'dist'))) {
        const distTargetDir = path.join(distUploadsDir, folder);
        if (!fs.existsSync(distTargetDir)) {
          fs.mkdirSync(distTargetDir, { recursive: true });
        }
        fs.writeFileSync(path.join(distTargetDir, safeFileName), buffer);
      }

      const publicUrl = `/uploads/${folder}/${safeFileName}`;

      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(
        JSON.stringify({
          success: true,
          url: publicUrl,
          filename: safeFileName,
          bytes: buffer.length,
          mimeType,
        })
      );
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ success: false, error: `Upload processing failed: ${errorMsg}` }));
    }
  });
}
