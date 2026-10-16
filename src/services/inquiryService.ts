import { SITE_CONFIG } from '../config/siteConfig';

export interface SendInquiryParams {
  name: string;
  email?: string;
  telephone?: string;
  category: string;
  selectedProduct?: string;
  message: string;
  consentGiven?: boolean;
  marketingConsent?: boolean;
  honeypot?: string;
}

export interface SendInquiryResult {
  status: 'success' | 'failure' | 'uncertain';
  submissionId: string;
  message: string;
  error?: string;
  recipient: string;
}

/**
 * Robust inquiry submission pipeline:
 * 1. Validates payload
 * 2. Checks honeypot (drops bots silently)
 * 3. Attempts client-side delivery via Web3Forms API
 * 4. Asynchronously logs to server endpoint without duplicate dispatch
 * 5. Handles secondary operation failures gracefully without falsely reporting failure
 * 6. Correctly reports genuine delivery failures or uncertain connection states
 */
export async function sendInquiry(params: SendInquiryParams): Promise<SendInquiryResult> {
  const recipient = SITE_CONFIG.contact.email;
  const submissionId = `VQ-${Date.now().toString().slice(-6)}`;

  // 1. Honeypot check (Silent drop for spam bots)
  if (params.honeypot && params.honeypot.trim().length > 0) {
    return {
      status: 'success',
      submissionId,
      message: 'Message sent successfully!',
      recipient,
    };
  }

  const isEmail = params.email && params.email.trim().length > 0;
  const contactEmail = isEmail ? params.email!.trim() : recipient;
  const contactPhone = params.telephone?.trim() || (isEmail ? 'Provided via email' : 'Not provided');

  let directDeliveryAccepted = false;
  let directDeliveryError: string | null = null;

  // 2. Direct client-side dispatch to Web3Forms API
  try {
    const web3Payload = {
      access_key: SITE_CONFIG.emailService.web3formsAccessKey,
      to_email: recipient,
      from_name: `Velquarath Stoneworks (${params.name.trim()})`,
      subject: `Inquiry: ${params.category} - ${params.name.trim()}`,
      name: params.name.trim(),
      email: contactEmail,
      phone: contactPhone,
      category: params.category,
      product: params.selectedProduct || 'General Stonework',
      message: params.message.trim(),
    };

    const web3Response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(web3Payload),
    });

    const contentType = web3Response.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      const web3Data = await web3Response.json();
      if (web3Response.ok && web3Data.success) {
        directDeliveryAccepted = true;
      } else {
        directDeliveryError = web3Data.message || 'Web3Forms API did not accept the inquiry.';
      }
    } else {
      directDeliveryError = 'Email provider returned unexpected response format.';
    }
  } catch (err: unknown) {
    directDeliveryError = err instanceof Error ? err.message : 'Network error communicating with email service';
  }

  // 3. Handle Confirmed Direct Delivery
  if (directDeliveryAccepted) {
    // Secondary operation: asynchronously record in local server audit log
    // Notice: emailAlreadyDelivered=true guarantees the server will NOT send a duplicate email!
    try {
      await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: params.name.trim(),
          email: params.email?.trim(),
          telephone: params.telephone?.trim(),
          category: params.category,
          selectedProduct: params.selectedProduct,
          message: params.message.trim(),
          consentGiven: params.consentGiven ?? true,
          marketingConsent: params.marketingConsent ?? false,
          emailAlreadyDelivered: true,
          deliveryProvider: 'Web3Forms Direct',
          submissionId,
        }),
      });
    } catch (secondaryErr) {
      // The email was already accepted and delivered to muksboogie1@gmail.com!
      // A secondary logging failure must NEVER falsely tell the customer the submission failed.
      console.warn('[Inquiry] Secondary logging encountered an issue, but email was successfully delivered:', secondaryErr);
    }

    return {
      status: 'success',
      submissionId,
      message: 'Message sent successfully!',
      recipient,
    };
  }

  // 4. Fallback: If direct Web3Forms delivery was not accepted, try server-side inquiry dispatch
  try {
    const serverResponse = await fetch('/api/inquiries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: params.name.trim(),
        email: params.email?.trim(),
        telephone: params.telephone?.trim(),
        category: params.category,
        selectedProduct: params.selectedProduct,
        message: params.message.trim(),
        consentGiven: params.consentGiven ?? true,
        marketingConsent: params.marketingConsent ?? false,
        emailAlreadyDelivered: false,
        submissionId,
      }),
    });

    const contentType = serverResponse.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      const serverData = await serverResponse.json();
      if (serverResponse.ok && serverData.success && serverData.delivered) {
        return {
          status: 'success',
          submissionId: serverData.submissionId || submissionId,
          message: 'Message sent successfully!',
          recipient,
        };
      } else {
        // Backend explicitly reports that delivery failed or was rejected
        const failMessage =
          (serverData.errors && serverData.errors[0]) ||
          serverData.error ||
          directDeliveryError ||
          'Email delivery could not be completed. Please try again or contact us directly on WhatsApp.';
        return {
          status: 'failure',
          submissionId,
          message: failMessage,
          error: failMessage,
          recipient,
        };
      }
    } else {
      // Non-JSON response from server (e.g. 404 or 500 HTML)
      return {
        status: 'uncertain',
        submissionId,
        message:
          'We were unable to confirm delivery of your message due to a connection issue. To ensure our stonemasons receive your inquiry promptly, please follow up with us on WhatsApp.',
        error: 'Unconfirmed delivery status',
        recipient,
      };
    }
  } catch (serverErr) {
    // Both direct delivery and server-side fallback were unreachable
    return {
      status: 'uncertain',
      submissionId,
      message:
        'We could not confirm delivery of your inquiry due to a network connection issue. Please follow up directly on WhatsApp or try again.',
      error: serverErr instanceof Error ? serverErr.message : 'Network connection failure',
      recipient,
    };
  }
}
