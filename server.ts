import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { handleInquirySubmission } from './src/server/inquiryHandler.js';
import { handleImageUpload } from './src/server/uploadHandler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// API routes
app.post('/api/inquiries', (req, res) => {
  handleInquirySubmission(req, res);
});

app.post('/api/upload', (req, res) => {
  handleImageUpload(req, res);
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', brand: 'Velquarath Stoneworks', timestamp: new Date().toISOString() });
});

// Static uploads directory serving
const uploadsPath = path.resolve(__dirname, 'public', 'uploads');
app.use('/uploads', express.static(uploadsPath));

// Production static file serving
const distPath = path.resolve(__dirname, 'dist');
app.use(express.static(distPath));

// Fallback to index.html for SPA routes
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
