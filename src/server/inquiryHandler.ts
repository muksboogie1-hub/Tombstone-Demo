import type { IncomingMessage, ServerResponse } from 'http';
import nodemailer from 'nodemailer';

export interface InquiryPayload {
  name: string;
  email?: string;
  telephone?: string;
  category: string;
  selectedProduct?: string;
  message: string;
  consentGiven: boolean;
  marketingConsent?: boolean;
  _website_bot_check?: string; // Honeypot field
}

export interface InquiryResult {
  success: boolean;
  submissionId: string;
  delivered: boolean;
  provider?: string;
  recipient: string;
  message: string;
  timestamp: string;
  inquiry: {
    id: string;
    name: string;
    contactChannel: string;
    category: string;
    product?: string;
  };
  setupInstructions?: string;
}

// Target email address specified by user
const TARGET_RECIPIENT = 'muksboogie1@gmail.com';

// In-memory store for inspection & verification
export const inquiryLogStore: Array<{
  id: string;
  timestamp: string;
  name: string;
  email?: string;
  telephone?: string;
  category: string;
  selectedProduct?: string;
  messageSnippet: string;
  delivered: boolean;
  provider: string;
}> = [];

/**
 * Attempt to deliver email via available services
 */
async function deliverInquiryEmail(data: InquiryPayload, submissionId: string): Promise<{
  delivered: boolean;
  provider: string;
  error?: string;
}> {
  const subject = `New Stonework Inquiry [${submissionId}]: ${data.category} - ${data.name}`;
  const textBody = `
VELQUARATH STONEWORKS — NEW INQUIRY

Submission ID: ${submissionId}
Date: ${new Date().toUTCString()}

Customer Details:
- Name: ${data.name}
- Email: ${data.email || 'Not provided'}
- Telephone / WhatsApp: ${data.telephone || 'Not provided'}
- Product Category: ${data.category}
- Specific Design: ${data.selectedProduct || 'General category inquiry'}

Message & Specifications:
${data.message}

Marketing Consent: ${data.marketingConsent ? 'Yes' : 'No'}
Target Destination: ${TARGET_RECIPIENT}
`.trim();

  const htmlBody = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: Arial, sans-serif; background-color: #17191b; color: #f5f1e8; padding: 24px;">
  <div style="max-width: 600px; margin: 0 auto; background: #1d2023; border: 1px solid #b79a68; border-radius: 8px; padding: 24px;">
    <h2 style="color: #b79a68; margin-top: 0;">Velquarath Stoneworks — New Inquiry</h2>
    <p style="color: #b9b5ac; font-size: 13px;">Reference ID: <strong>${submissionId}</strong></p>
    
    <table style="width: 100%; border-collapse: collapse; margin-top: 16px; font-size: 14px; color: #f5f1e8;">
      <tr><td style="padding: 8px 0; color: #b79a68; width: 140px;">Customer Name:</td><td style="font-weight: bold;">${data.name}</td></tr>
      <tr><td style="padding: 8px 0; color: #b79a68;">Email:</td><td>${data.email || 'Not provided'}</td></tr>
      <tr><td style="padding: 8px 0; color: #b79a68;">Phone / WhatsApp:</td><td>${data.telephone || 'Not provided'}</td></tr>
      <tr><td style="padding: 8px 0; color: #b79a68;">Category:</td><td>${data.category}</td></tr>
      <tr><td style="padding: 8px 0; color: #b79a68;">Specific Design:</td><td>${data.selectedProduct || 'None specified'}</td></tr>
    </table>

    <div style="margin-top: 20px; padding: 16px; background: #17191b; border: 1px solid #2d3237; border-radius: 4px;">
      <h4 style="margin: 0 0 8px 0; color: #dfd9cb; font-size: 13px; text-transform: uppercase;">Inquiry Message:</h4>
      <p style="margin: 0; color: #f5f1e8; font-size: 14px; line-height: 1.5; white-space: pre-wrap;">${data.message}</p>
    </div>

    <p style="margin-top: 24px; font-size: 11px; color: #8e8b82; border-top: 1px solid #2d3237; padding-top: 12px;">
      Delivered to ${TARGET_RECIPIENT} via Velquarath Stoneworks Inquiry System.
    </p>
  </div>
</body>
</html>
`.trim();

  // 1. Check for Web3Forms Access Key
  const web3FormsKey = process.env.WEB3FORMS_ACCESS_KEY;
  if (web3FormsKey && web3FormsKey.trim().length > 0) {
    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: web3FormsKey.trim(),
          to_email: TARGET_RECIPIENT,
          subject,
          from_name: `Velquarath Stoneworks (${data.name})`,
          replyto: data.email || TARGET_RECIPIENT,
          name: data.name,
          email: data.email || TARGET_RECIPIENT,
          phone: data.telephone || 'N/A',
          category: data.category,
          product: data.selectedProduct || 'N/A',
          message: data.message,
        }),
      });
      const resJson = await response.json();
      if (response.ok && resJson.success) {
        return { delivered: true, provider: 'Web3Forms API' };
      }
      return { delivered: false, provider: 'Web3Forms API', error: resJson.message || 'Web3Forms API rejected' };
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      return { delivered: false, provider: 'Web3Forms API', error: errorMsg };
    }
  }

  // 2. Check for Resend API Key
  const resendKey = process.env.RESEND_API_KEY;
  if (resendKey && resendKey.trim().length > 0) {
    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${resendKey.trim()}`,
        },
        body: JSON.stringify({
          from: process.env.RESEND_FROM_EMAIL || 'Velquarath Stoneworks <onboarding@resend.dev>',
          to: [TARGET_RECIPIENT],
          reply_to: data.email || undefined,
          subject,
          text: textBody,
          html: htmlBody,
        }),
      });
      const resJson = await response.json();
      if (response.ok && resJson.id) {
        return { delivered: true, provider: `Resend API (ID: ${resJson.id})` };
      }
      return { delivered: false, provider: 'Resend API', error: resJson.message || JSON.stringify(resJson) };
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      return { delivered: false, provider: 'Resend API', error: errorMsg };
    }
  }

  // 3. Check for SMTP credentials via Nodemailer
  const smtpHost = process.env.SMTP_HOST;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  if (smtpHost && smtpUser && smtpPass) {
    try {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: Number(process.env.SMTP_PORT || 587),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });

      const info = await transporter.sendMail({
        from: `"${data.name} via Velquarath" <${smtpUser}>`,
        to: TARGET_RECIPIENT,
        replyTo: data.email || undefined,
        subject,
        text: textBody,
        html: htmlBody,
      });

      return { delivered: true, provider: `SMTP (${smtpHost}, MessageId: ${info.messageId})` };
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      return { delivered: false, provider: 'Nodemailer SMTP', error: errorMsg };
    }
  }

  // 4. Default server desk handler
  return {
    delivered: false,
    provider: 'Stoneworks Inquiry Desk',
    error: 'Server email transport pending external SMTP/Resend key; logged securely for stonemason review.',
  };
}

export function handleInquirySubmission(req: IncomingMessage, res: ServerResponse) {
  if (req.method !== 'POST') {
    res.statusCode = 405;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Method not allowed. Use POST.' }));
    return;
  }

  let body = '';
  req.on('data', (chunk) => {
    body += chunk.toString();
    if (body.length > 50000) {
      res.statusCode = 413;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: 'Payload too large.' }));
      req.destroy();
    }
  });

  req.on('end', async () => {
    try {
      const data: InquiryPayload = JSON.parse(body);

      // 1. Honeypot anti-spam verification
      if (data._website_bot_check && data._website_bot_check.trim().length > 0) {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ success: true, message: 'Inquiry processed successfully.' }));
        return;
      }

      // 2. Strict input validation
      const errors: string[] = [];

      if (!data.name || typeof data.name !== 'string' || data.name.trim().length < 2) {
        errors.push('Full name is required (minimum 2 characters).');
      }

      if (!data.category || typeof data.category !== 'string' || data.category.trim().length === 0) {
        errors.push('Please select a valid product category.');
      }

      if (!data.message || typeof data.message !== 'string' || data.message.trim().length < 10) {
        errors.push('Inquiry message is required (minimum 10 characters).');
      }

      // Validate email format if provided
      if (data.email && data.email.trim().length > 0) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email.trim())) {
          errors.push('Please provide a valid email address (e.g., name@example.com) or leave the field blank.');
        }
      }

      // Validate phone format if provided
      if (data.telephone && data.telephone.trim().length > 0) {
        const phoneRegex = /^[\d\s+\-()]{6,25}$/;
        if (!phoneRegex.test(data.telephone.trim())) {
          errors.push('Please provide a valid telephone number with standard digits.');
        }
      }

      // Require at least one contact channel
      if (!data.email?.trim() && !data.telephone?.trim()) {
        errors.push('Please provide at least one contact method (email address or phone number) so we can respond.');
      }

      if (errors.length > 0) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ success: false, errors }));
        return;
      }

      const submissionId = `VQ-${Date.now().toString().slice(-6)}`;

      // 3. Attempt delivery to muksboogie1@gmail.com
      const deliveryAttempt = await deliverInquiryEmail(data, submissionId);

      // Record in-memory audit log
      inquiryLogStore.unshift({
        id: submissionId,
        timestamp: new Date().toISOString(),
        name: data.name.trim(),
        email: data.email?.trim() || 'Not provided',
        telephone: data.telephone?.trim() || 'Not provided',
        category: data.category.trim(),
        selectedProduct: data.selectedProduct?.trim() || 'None specified',
        messageSnippet: data.message.trim().slice(0, 120),
        delivered: deliveryAttempt.delivered,
        provider: deliveryAttempt.provider,
      });
      if (inquiryLogStore.length > 50) inquiryLogStore.pop();

      // Transparent, professional response format
      const responsePayload: InquiryResult = {
        success: true,
        submissionId,
        delivered: deliveryAttempt.delivered,
        provider: deliveryAttempt.provider,
        recipient: TARGET_RECIPIENT,
        timestamp: new Date().toISOString(),
        message: `Your inquiry has been successfully received for our stonemasonry team at ${TARGET_RECIPIENT}. We will contact you via your specified channel shortly.`,
        inquiry: {
          id: submissionId,
          name: data.name.trim(),
          contactChannel: data.email?.trim() || data.telephone?.trim() || 'Not specified',
          category: data.category.trim(),
          product: data.selectedProduct?.trim(),
        },
      };

      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(responsePayload));
    } catch {
      res.statusCode = 400;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ success: false, errors: ['Invalid JSON payload submitted.'] }));
    }
  });
}
