import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Copy, Check, ExternalLink, Upload, FileCheck, AlertCircle, ShieldAlert, ArrowRight } from 'lucide-react';
import { PAYMENT_CONFIG } from '../../lib/paymentConfig';
import { QRCodeSVG } from 'qrcode.react';

interface UpiQrSectionProps {
  total: number;
  customerName: string;
  phone: string;
  email: string;
  isSubmitting: boolean;
  onSubmitPaymentDetails: (utr: string, screenshotUrl?: string) => void;
}

export const UpiQrSection: React.FC<UpiQrSectionProps> = ({
  total,
  customerName,
  phone,
  email,
  isSubmitting,
  onSubmitPaymentDetails,
}) => {
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [utr, setUtr] = useState('');
  const [screenshotData, setScreenshotData] = useState<string | null>(null);
  const [screenshotName, setScreenshotName] = useState<string | null>(null);
  const [utrError, setUtrError] = useState<string | null>(null);
  const [showVerificationForm, setShowVerificationForm] = useState(true);

  const upiId = PAYMENT_CONFIG.UPI_ID;
  const businessName = PAYMENT_CONFIG.BUSINESS_NAME;

  // Standard UPI URI format
  const upiUri = useMemo(() => {
    const params = new URLSearchParams({
      pa: upiId,
      pn: businessName,
      am: total.toString(),
      cu: 'INR',
      tn: `SHIV DHARA Sacred Order for ${customerName || 'Seeker'}`,
    });

    return `upi://pay?${params.toString()}`;
  }, [upiId, businessName, total, customerName]);

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(upiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2500);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('File size exceeds 5MB limit');
      return;
    }

    setScreenshotName(file.name);

    const reader = new FileReader();

    reader.onload = () => {
      setScreenshotData(reader.result as string);
    };

    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const cleanUtr = utr.trim();

    if (!cleanUtr) {
      setUtrError('Please enter your 12-digit UPI UTR or Transaction Ref ID');
      return;
    }

    if (cleanUtr.length < 6) {
      setUtrError('Transaction ID / UTR must be at least 6 characters');
      return;
    }

    setUtrError(null);
    onSubmitPaymentDetails(cleanUtr, screenshotData || undefined);
  };

  return (
    <div className="space-y-6" id="upi-qr-payment-container">

      {/* Top Banner */}
      <div className="bg-[#163A36] text-[#F7F1E6] rounded-2xl p-6 border border-[#315C52] shadow-sm">

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#315C52]/70">
          <div>
            <div className="flex items-center gap-2">
              <span className="type-label text-[10px] text-[#C56A45] tracking-widest">
                DIRECT UPI QR PAYMENT
              </span>
            </div>

            <h3 className="text-xl font-serif text-[#F7F1E6] mt-0.5">
              SHIV DHARA
            </h3>

            <p className="type-body-sm text-xs text-[#E6D5B8]/80">
              Scan with any UPI app to transfer exact amount directly to SHIV DHARA account.
            </p>
          </div>

          <div className="text-right sm:border-l sm:border-[#315C52] sm:pl-6">
            <span className="type-label text-[10px] text-[#E6D5B8]/70 block">
              Amount to Pay
            </span>

            <span className="text-2xl font-serif text-[#F7F1E6] font-normal block">
              ₹{total.toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        {/* QR Code Presentation Box */}
        <div className="pt-6 flex flex-col md:flex-row items-center justify-center gap-8">

          <div className="bg-white p-5 rounded-2xl shadow-xl border-4 border-[#E6D5B8] flex flex-col items-center justify-center shrink-0">

            <div className="text-center pb-2 border-b border-gray-100 w-full mb-3">
              <span className="text-[11px] font-mono font-bold text-[#163A36] uppercase tracking-wider block">
                SCAN TO PAY
              </span>

              <span className="text-[10px] text-gray-500 font-sans">
                ₹{total.toLocaleString('en-IN')}
              </span>
            </div>

            {/* QR Rendering */}
            <QRCodeSVG
              value={upiUri}
              size={208}
              bgColor="#FFFFFF"
              fgColor="#163A36"
              level="M"
              includeMargin={true}
            />

            <div className="text-center pt-2.5 border-t border-gray-100 w-full mt-2">
              <span className="text-[10px] font-sans text-gray-500 block">
                SHIV DHARA • UPI PAYMENT
              </span>
            </div>
          </div>

          {/* UPI Information and Instructions */}
          <div className="space-y-4 max-w-sm text-left">

            <div>
              <span className="type-label text-[10px] text-[#E6D5B8]/80 block mb-1">
                SHIV DHARA UPI ID
              </span>

              <div className="flex items-center gap-2 bg-[#0E2623] px-3.5 py-2 rounded-xl border border-[#315C52]">

                <span className="font-mono text-sm text-[#F7F1E6] select-all flex-1 truncate">
                  {upiId}
                </span>

                <button
                  type="button"
                  onClick={handleCopyUpi}
                  className="p-1.5 rounded-lg hover:bg-white/10 text-[#C56A45] hover:text-[#F7F1E6] transition-colors cursor-pointer"
                  title="Copy UPI ID"
                  aria-label="Copy UPI ID"
                >
                  {copiedUpi ? (
                    <Check className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>

              {copiedUpi && (
                <span className="text-[11px] text-emerald-400 mt-1 block font-sans">
                  ✓ UPI ID copied to clipboard
                </span>
              )}
            </div>

            <div>
              <span className="type-label text-[10px] text-[#E6D5B8]/80 block mb-1">
                Accepted Apps
              </span>

              <div className="flex flex-wrap gap-2 text-xs font-sans text-[#F7F1E6]">
                <span className="px-2.5 py-1 rounded-lg bg-[#0E2623] border border-[#315C52]">
                  Google Pay
                </span>

                <span className="px-2.5 py-1 rounded-lg bg-[#0E2623] border border-[#315C52]">
                  PhonePe
                </span>

                <span className="px-2.5 py-1 rounded-lg bg-[#0E2623] border border-[#315C52]">
                  Paytm
                </span>

                <span className="px-2.5 py-1 rounded-lg bg-[#0E2623] border border-[#315C52]">
                  BHIM
                </span>

                <span className="px-2.5 py-1 rounded-lg bg-[#0E2623] border border-[#315C52]">
                  Any UPI App
                </span>
              </div>
            </div>

            {/* Mobile UPI Deep Link */}
            <div className="pt-2">
              <a
                href={upiUri}
                className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-[#0E2623] border border-[#C56A45] text-[#F7F1E6] hover:bg-[#C56A45] hover:text-[#F7F1E6] transition-colors text-xs font-medium cursor-pointer"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Open in Mobile UPI App</span>
              </a>

              <span className="type-label text-[9px] text-[#E6D5B8]/60 text-center block mt-1.5">
                (Tap to launch your installed UPI payment app directly)
              </span>
            </div>

          </div>
        </div>
      </div>

      {/* Manual Verification Form: "PAYMENT COMPLETED?" */}
      <div className="bg-[#FAF4EA] rounded-2xl p-6 sm:p-7 border border-[#E6D5B8] space-y-5">

        <div className="border-b border-[#E6D5B8] pb-3">
          <span className="type-label text-[10px] text-[#C56A45] block uppercase">
            Step 2: Submit Verification
          </span>

          <h4 className="text-lg font-serif text-[#163A36]">
            Payment Completed? Enter Your UTR / Transaction ID
          </h4>

          <p className="type-body-sm text-xs text-[#2B211E]/75 mt-1">
            After completing the transfer in your UPI app, provide your 12-digit UPI reference number (UTR) below so our team can verify and dispatch your order.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            <div>
              <label className="type-label text-[10px] text-[#163A36] block mb-1">
                Customer Name
              </label>

              <input
                type="text"
                disabled
                value={customerName}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E6D5B8] text-sm text-[#163A36] font-medium opacity-80 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="type-label text-[10px] text-[#163A36] block mb-1">
                Phone Number
              </label>

              <input
                type="text"
                disabled
                value={phone}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E6D5B8] text-sm text-[#163A36] font-medium opacity-80 cursor-not-allowed"
              />
            </div>

          </div>

          <div>
            <label className="type-label text-[10px] text-[#163A36] block mb-1">
              UPI Reference ID / UTR / Transaction ID *
            </label>

            <input
              type="text"
              required
              placeholder="e.g. 423987123456 or T260819..."
              value={utr}
              onChange={e => {
                setUtr(e.target.value);
                if (utrError) setUtrError(null);
              }}
              className={`w-full px-4 py-3 rounded-xl bg-white border text-sm font-mono text-[#163A36] placeholder:font-sans placeholder:text-gray-400 focus:outline-none ${
                utrError
                  ? 'border-red-400 ring-2 ring-red-100'
                  : 'border-[#E6D5B8] focus:border-[#C56A45]'
              }`}
            />

            {utrError && (
              <span className="text-xs text-red-600 flex items-center gap-1 mt-1 font-sans">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{utrError}</span>
              </span>
            )}

            <span className="text-[11px] text-[#2B211E]/60 block mt-1">
              Found in your UPI app receipt under "UPI Ref No", "UTR", or "Transaction ID".
            </span>
          </div>

          {/* Optional Screenshot Upload */}
          <div>
            <label className="type-label text-[10px] text-[#163A36] block mb-1">
              Payment Screenshot (Optional, helps faster verification)
            </label>

            <div className="border-2 border-dashed border-[#E6D5B8] hover:border-[#C56A45] transition-colors rounded-xl p-4 bg-white text-center relative cursor-pointer group">

              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />

              {screenshotData ? (
                <div className="flex items-center justify-center gap-3">

                  <img
                    src={screenshotData}
                    alt="Receipt Preview"
                    className="w-12 h-12 object-cover rounded-lg border border-[#E6D5B8]"
                  />

                  <div className="text-left">
                    <span className="text-xs font-semibold text-[#163A36] block truncate max-w-xs">
                      {screenshotName || 'Payment receipt attached'}
                    </span>

                    <span className="text-[10px] text-emerald-700 font-sans flex items-center gap-1">
                      <FileCheck className="w-3 h-3" />
                      <span>Ready to upload</span>
                    </span>
                  </div>

                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-2 text-[#2B211E]/70 group-hover:text-[#163A36]">

                  <Upload className="w-6 h-6 text-[#C56A45] mb-1 group-hover:scale-110 transition-transform" />

                  <span className="text-xs font-medium">
                    Click or drag & drop payment screenshot
                  </span>

                  <span className="text-[10px] text-gray-400 mt-0.5">
                    PNG, JPG, WEBP up to 5MB
                  </span>

                </div>
              )}

            </div>
          </div>

          {/* Honest Verification Notice */}
          <div className="p-3.5 rounded-xl bg-[#E6D5B8]/30 border border-[#E6D5B8] flex items-start gap-2.5 text-xs text-[#2B211E]/80">

            <ShieldAlert className="w-4 h-4 text-[#C56A45] shrink-0 mt-0.5" />

            <div className="space-y-0.5">
              <span className="font-semibold text-[#163A36] block">
                Honest Verification Process:
              </span>

              <p className="text-[11px] leading-relaxed">
                Once submitted, your order status will be set to <strong>PAYMENT VERIFICATION PENDING</strong>. Our team will verify the transfer in our bank statement and confirm your order promptly.
              </p>
            </div>

          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full btn-primary-terracotta flex items-center justify-center gap-2 text-xs py-3.5 shadow-md disabled:opacity-50"
          >
            {isSubmitting ? (
              <span>Recording Payment Submission...</span>
            ) : (
              <>
                <span>Submit Payment Details</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

        </form>
      </div>
    </div>
  );
};