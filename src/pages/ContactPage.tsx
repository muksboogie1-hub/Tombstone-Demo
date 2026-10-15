import { useState } from 'react';
import { Phone, Mail, MapPin, MessageCircle, Clock, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import { SEOHead } from '../components/common/SEOHead';
import { PageHeader } from '../components/common/PageHeader';
import { useContent } from '../context/ContentContext';
import { SITE_CONFIG, getWhatsAppUrl } from '../config/siteConfig';

export function ContactPage() {
  const { content } = useContent();
  const contact = content.contact;
  const [name, setName] = useState('');
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!name.trim() || name.trim().length < 2) {
      setErrorMsg('Please enter your full name (minimum 2 characters).');
      return;
    }
    if (!emailOrPhone.trim()) {
      setErrorMsg('Please provide your phone number or email address.');
      return;
    }
    if (!message.trim() || message.trim().length < 10) {
      setErrorMsg('Please write a message of at least 10 characters.');
      return;
    }

    setIsSubmitting(true);
    const isEmail = emailOrPhone.includes('@');

    try {
      // 1. Direct client-side delivery via Web3Forms (accepted by Web3Forms free tier from browsers)
      let deliveredDirectly = false;
      try {
        const web3Response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({
            access_key: SITE_CONFIG.emailService.web3formsAccessKey,
            to_email: SITE_CONFIG.contact.email,
            from_name: `Velquarath Stoneworks (${name.trim()})`,
            subject: `Contact Inquiry: General Stonework - ${name.trim()}`,
            name: name.trim(),
            email: isEmail ? emailOrPhone.trim() : SITE_CONFIG.contact.email,
            phone: !isEmail ? emailOrPhone.trim() : 'Provided via email',
            category: 'General Stonework',
            message: message.trim(),
          }),
        });
        const web3Data = await web3Response.json();
        if (web3Response.ok && web3Data.success) {
          deliveredDirectly = true;
        }
      } catch {
        // Fallback to server endpoint
      }

      // 2. Also log and process on the server endpoint
      const serverResponse = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: isEmail ? emailOrPhone.trim() : undefined,
          telephone: !isEmail ? emailOrPhone.trim() : undefined,
          category: 'General Stonework',
          message: message.trim(),
          consentGiven: true,
        }),
      });
      const serverData = await serverResponse.json();

      if (deliveredDirectly || (serverResponse.ok && serverData.success)) {
        setSuccessMsg(
          `Thank you, ${name.trim()}! Your message has been sent directly to our stonemason team at ${SITE_CONFIG.contact.email}. We will respond shortly.`
        );
        setName('');
        setEmailOrPhone('');
        setMessage('');
      } else {
        setErrorMsg((serverData.errors && serverData.errors[0]) || 'Failed to submit inquiry. Please try again or use WhatsApp.');
      }
    } catch {
      setErrorMsg('Connection error. Please try again or reach us immediately on WhatsApp (+263 78 696 7793).');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-16 pb-20">
      <SEOHead
        title="Contact Velquarath Stoneworks — Harare & Bulawayo | Zimbabwe"
        description="Contact Velquarath Stoneworks for memorial headstones, granite countertops, and stonemasonry inquiries in Zimbabwe. WhatsApp and email consultation."
      />

      <PageHeader
        title="Contact & Consultation"
        subtitle="Connect with our stonemasonry specialists. We offer respectful, obligation-free guidance on memorial headstones, cemetery permits, and architectural granite stonework across Zimbabwe."
        category="Showroom & Inquiries"
        breadcrumbs={[{ label: 'Contact' }]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Contact Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: WhatsApp */}
          <div className="bg-[#1D2023] border border-[#25D366]/40 p-6 rounded-lg space-y-3 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-full bg-[#25D366]/15 text-[#25D366] flex items-center justify-center mb-4">
                <MessageCircle className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-lg text-[#F5F1E8] font-bold">
                WhatsApp Chat
              </h3>
              <p className="text-xs text-[#B9B5AC] mt-1">
                Direct instant messaging for photos, design queries, and pricing.
              </p>
              <div className="text-xs text-[#25D366] font-semibold mt-2">
                {contact?.whatsappDisplay || SITE_CONFIG.contact.whatsAppDisplayNumber}
              </div>
            </div>
            <div className="pt-4">
              <a
                href={contact?.whatsappDigits ? `https://wa.me/${contact.whatsappDigits.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(contact.whatsappGreeting || 'Hello, I would like to enquire about your stonework and memorial services in Zimbabwe.')}` : getWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#25D366] hover:underline"
              >
                <span>Start WhatsApp Chat</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Card 2: Voice Phone */}
          <div className="bg-[#1D2023] border border-[#2D3237] p-6 rounded-lg space-y-3 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-full bg-[#B79A68]/15 text-[#B79A68] flex items-center justify-center mb-4">
                <Phone className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-lg text-[#F5F1E8] font-bold">
                Phone Consultation
              </h3>
              <p className="text-xs text-[#B9B5AC] mt-1">
                Speak directly with an experienced memorial stonemason.
              </p>
              <div className="text-xs text-[#DFD9CB] font-semibold mt-2">
                {contact?.telephoneDisplay || SITE_CONFIG.contact.telephoneDisplay}
              </div>
            </div>
            <div className="pt-4 text-[11px] text-[#8E8B82]">
              Direct consultation line
            </div>
          </div>

          {/* Card 3: Email */}
          <div className="bg-[#1D2023] border border-[#2D3237] p-6 rounded-lg space-y-3 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-full bg-[#B79A68]/15 text-[#B79A68] flex items-center justify-center mb-4">
                <Mail className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-lg text-[#F5F1E8] font-bold">
                Direct Email
              </h3>
              <p className="text-xs text-[#B9B5AC] mt-1">
                Send architectural floorplans or memorial inscription drafts.
              </p>
              <div className="text-xs text-[#DFD9CB] font-semibold mt-2 truncate">
                {contact?.email || SITE_CONFIG.contact.email}
              </div>
            </div>
            <div className="pt-4 text-[11px] text-[#8E8B82]">
              Monitored during business hours
            </div>
          </div>

          {/* Card 4: Hours & Service */}
          <div className="bg-[#1D2023] border border-[#2D3237] p-6 rounded-lg space-y-3 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-full bg-[#B79A68]/15 text-[#B79A68] flex items-center justify-center mb-4">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-lg text-[#F5F1E8] font-bold">
                Consultation Hours
              </h3>
              <p className="text-xs text-[#B9B5AC] mt-1">
                {contact?.operatingHours || SITE_CONFIG.contact.operatingHours}
              </p>
              <div className="text-[11px] text-[#DFD9CB] mt-2">
                Sunday: By appointment only for unveilings
              </div>
            </div>
            <div className="pt-4 text-[11px] text-[#8E8B82]">
              {contact?.serviceArea || "Nationwide Zimbabwe delivery"}
            </div>
          </div>
        </div>

        {/* Showroom & Inquiry Form Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Location Details */}
          <div className="space-y-6 bg-[#1D2023] border border-[#2D3237] p-8 rounded-lg">
            <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-[#B79A68] font-semibold">
              <MapPin className="w-4 h-4" />
              <span>Showroom & Yard Presence</span>
            </div>

            <h3 className="font-serif text-2xl text-[#F5F1E8] font-bold">
              Harare Showroom & Stoneworks Desk
            </h3>

            <p className="text-xs sm:text-sm text-[#B9B5AC] leading-relaxed">
              {contact ? `${contact.physicalAddress}, ${contact.city}, ${contact.country}.` : `${SITE_CONFIG.contact.physicalAddress}, ${SITE_CONFIG.contact.city}, ${SITE_CONFIG.contact.country}.`}
            </p>

            <div className="bg-[#17191B] p-4 rounded border border-[#252A2E] space-y-2 text-xs text-[#DFD9CB]">
              <div className="font-semibold text-[#B79A68]">Service Coverage Across Zimbabwe:</div>
              <p className="text-[#8E8B82] leading-relaxed">
                Direct installation teams dispatched to Warren Hills, Granville, Glen Forest, Greendale, Zororo Memorial Park, Luveve Cemetery, Athlone Cemetery, and regional rural family homelands upon consultation.
              </p>
            </div>

            <div className="p-4 bg-[#17191B] border border-[#2D3237] rounded text-xs text-[#DFD9CB]">
              <strong className="text-[#B79A68] block mb-1">Direct Inquiries & Cemetery Site Visits:</strong>
              Reach our stonemasonry team directly via WhatsApp (<span className="text-[#F5F1E8] font-semibold">+263 78 696 7793</span>) or email (<span className="text-[#F5F1E8] font-semibold">{SITE_CONFIG.contact.email}</span>). Showroom consultations and cemetery site visits are arranged Monday through Saturday.
            </div>
          </div>

          {/* Quick Message Form */}
          <div className="bg-[#1D2023] border border-[#2D3237] p-8 rounded-lg space-y-6">
            <h3 className="font-serif text-2xl text-[#F5F1E8] font-bold">
              Send an Instant Message
            </h3>

            {successMsg && (
              <div className="bg-emerald-950/40 border border-emerald-600/40 p-4 rounded text-xs text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>{successMsg}</span>
              </div>
            )}

            {errorMsg && (
              <div className="bg-rose-950/40 border border-rose-600/40 p-4 rounded text-xs text-rose-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <div>
                <label htmlFor="contact-name" className="block text-xs uppercase tracking-wider text-[#B9B5AC] mb-1 font-semibold">
                  Full Name *
                </label>
                <input
                  id="contact-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                  required
                  className="w-full bg-[#17191B] border border-[#2D3237] focus:border-[#B79A68] rounded px-3 py-2 text-sm text-[#F5F1E8] focus:outline-hidden"
                />
              </div>

              <div>
                <label htmlFor="contact-channel" className="block text-xs uppercase tracking-wider text-[#B9B5AC] mb-1 font-semibold">
                  Phone Number or Email Address *
                </label>
                <input
                  id="contact-channel"
                  type="text"
                  value={emailOrPhone}
                  onChange={(e) => setEmailOrPhone(e.target.value)}
                  placeholder="+263 77... or name@example.com"
                  required
                  className="w-full bg-[#17191B] border border-[#2D3237] focus:border-[#B79A68] rounded px-3 py-2 text-sm text-[#F5F1E8] focus:outline-hidden"
                />
              </div>

              <div>
                <label htmlFor="contact-message" className="block text-xs uppercase tracking-wider text-[#B9B5AC] mb-1 font-semibold">
                  Message or Inscription Request *
                </label>
                <textarea
                  id="contact-message"
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us about the memorial style, countertop measurements, or installation location..."
                  required
                  className="w-full bg-[#17191B] border border-[#2D3237] focus:border-[#B79A68] rounded px-3 py-2 text-sm text-[#F5F1E8] focus:outline-hidden resize-y"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 text-xs font-semibold uppercase tracking-widest bg-[#B79A68] hover:bg-[#CBB17F] disabled:opacity-50 text-[#17191B] rounded transition-colors shadow-xs cursor-pointer"
              >
                {isSubmitting ? 'Sending Message...' : 'Send Message to Stonemasons'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
