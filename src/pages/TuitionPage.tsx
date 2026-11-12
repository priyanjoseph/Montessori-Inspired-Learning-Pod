import React, { useState } from 'react';
import { useSettings } from '../context/SettingsContext';
import { PaymentItem } from '../data/dashboardData';
import {
  CreditCard,
  Download,
  CheckCircle2,
  Clock,
  AlertCircle,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  X,
  Printer,
  DollarSign,
  Building,
  Check,
  Receipt
} from 'lucide-react';

export const TuitionPage: React.FC = () => {
  const {
    tuitionSummary,
    paymentHistory,
    processSimulatedPayment,
    childProfile,
    user
  } = useSettings();

  // Payment modal state
  const [payModalOpen, setPayModalOpen] = useState(false);
  const [payAmount, setPayAmount] = useState<number>(tuitionSummary.outstandingBalance);
  const [payMethod, setPayMethod] = useState<'card' | 'ach' | 'applepay'>('card');
  const [cardHolder, setCardHolder] = useState(user?.name || 'Sarah Jenkins');
  const [cardNumber, setCardNumber] = useState('•••• •••• •••• 4921');
  const [cardExpiry, setCardExpiry] = useState('08/28');
  const [cardCvc, setCardCvc] = useState('382');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState<{ receipt: string; amount: number } | null>(null);

  // Receipt modal state
  const [activeReceipt, setActiveReceipt] = useState<PaymentItem | null>(null);

  const handleStartPayment = (amountToPay: number) => {
    setPayAmount(amountToPay);
    setPaymentSuccess(null);
    setPayModalOpen(true);
  };

  const handleSubmitPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (payAmount <= 0) return;

    setIsProcessing(true);
    const methodLabel =
      payMethod === 'card'
        ? `Visa Card (${cardNumber.slice(-4)})`
        : payMethod === 'ach'
        ? 'Bank ACH Transfer'
        : 'Apple Pay';

    const result = await processSimulatedPayment({
      amount: payAmount,
      description: `Primary Program Tuition Installment ($${payAmount.toLocaleString()})`,
      method: methodLabel
    });

    setIsProcessing(false);
    if (result.success) {
      setPaymentSuccess({ receipt: result.receiptNumber, amount: payAmount });
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* 1. Header Banner */}
      <div className="rounded-4xl bg-white border border-beige-300 shadow-soft p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-wider text-forest-700 bg-sage-100 px-3 py-1 rounded-full border border-sage-200 inline-block mb-2">
              Tuition & Billing
            </span>
            <h1 className="font-serif text-2xl sm:text-4xl font-bold text-forest-900">
              Tuition and Payments
            </h1>
            <p className="text-forest-700 text-xs sm:text-sm mt-1.5 leading-relaxed">
              Manage student tuition, review verified payment statements, download official tax receipts, or submit an installment via our simulated parent checkout.
            </p>
          </div>

          {tuitionSummary.outstandingBalance > 0 && (
            <button
              onClick={() => handleStartPayment(tuitionSummary.outstandingBalance)}
              className="px-6 py-3 rounded-full bg-forest-600 hover:bg-forest-700 text-cream text-xs sm:text-sm font-semibold shadow-soft hover:shadow-soft-lg transition-all flex items-center justify-center gap-2 flex-shrink-0"
            >
              <CreditCard className="w-4 h-4" />
              <span>Pay Outstanding (${tuitionSummary.outstandingBalance.toLocaleString()})</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. Top Summary Cards: 4 Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        {/* Total Tuition Fee */}
        <div className="p-6 rounded-3xl bg-white border border-beige-300 shadow-soft">
          <span className="text-[11px] font-bold uppercase tracking-wider text-forest-600 block mb-1">
            Total Annual Tuition
          </span>
          <p className="font-serif text-3xl font-bold text-forest-900">
            ${tuitionSummary.totalTuitionFee.toLocaleString()}.00
          </p>
          <p className="text-[11px] text-forest-600 mt-1">
            Academic Year 2026–2027 (10 Mos)
          </p>
        </div>

        {/* Amount Paid */}
        <div className="p-6 rounded-3xl bg-sage-50 border border-sage-200 shadow-soft">
          <span className="text-[11px] font-bold uppercase tracking-wider text-forest-700 block mb-1">
            Amount Paid to Date
          </span>
          <p className="font-serif text-3xl font-bold text-forest-800">
            ${tuitionSummary.amountPaid.toLocaleString()}.00
          </p>
          <div className="flex items-center gap-1.5 text-[11px] text-sage-600 font-semibold mt-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{(tuitionSummary.amountPaid / tuitionSummary.totalTuitionFee * 100).toFixed(0)}% of annual plan cleared</span>
          </div>
        </div>

        {/* Outstanding Balance */}
        <div className="p-6 rounded-3xl bg-white border border-beige-300 shadow-soft">
          <span className="text-[11px] font-bold uppercase tracking-wider text-forest-600 block mb-1">
            Outstanding Balance
          </span>
          <p className={`font-serif text-3xl font-bold ${
            tuitionSummary.outstandingBalance > 0 ? 'text-terracotta' : 'text-forest-800'
          }`}>
            ${tuitionSummary.outstandingBalance.toLocaleString()}.00
          </p>
          <p className="text-[11px] text-forest-600 mt-1">
            {tuitionSummary.outstandingBalance > 0 ? 'Due for upcoming term' : 'All installments current'}
          </p>
        </div>

        {/* Next Due Date */}
        <div className="p-6 rounded-3xl bg-white border border-beige-300 shadow-soft">
          <span className="text-[11px] font-bold uppercase tracking-wider text-forest-600 block mb-1">
            Next Payment Due Date
          </span>
          <p className="font-serif text-2xl font-bold text-forest-900">
            {tuitionSummary.nextPaymentDueDate}
          </p>
          <p className="text-[11px] text-forest-600 mt-1">
            Auto-debit notification sent 5 days prior
          </p>
        </div>

      </div>

      {/* 3. Payment History Table */}
      <div className="bg-white rounded-4xl p-6 sm:p-8 border border-beige-300 shadow-soft space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-forest-700 bg-beige-100 px-3 py-1 rounded-full border border-beige-200 inline-block mb-1">
              Transaction Ledger
            </span>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-forest-900">
              Payment & Billing History
            </h2>
          </div>

          <div className="text-xs text-forest-600">
            Showing {paymentHistory.length} verified records
          </div>
        </div>

        {/* Responsive Table */}
        <div className="overflow-x-auto rounded-2xl border border-beige-200">
          <table className="w-full text-left rtl:text-right border-collapse min-w-[650px] text-xs sm:text-sm">
            <thead>
              <tr className="bg-beige-100/70 border-b border-beige-300 font-serif font-bold text-forest-900">
                <th className="py-3.5 px-4">Payment ID</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Description</th>
                <th className="py-3.5 px-4">Amount</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-center">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-beige-200">
              {paymentHistory.map((item) => (
                <tr key={item.id} className="hover:bg-cream/50 transition-colors">
                  <td className="py-3.5 px-4 font-mono text-xs font-semibold text-forest-800">
                    {item.id}
                  </td>
                  <td className="py-3.5 px-4 text-forest-700 font-medium">
                    {item.date}
                  </td>
                  <td className="py-3.5 px-4 text-forest-900 font-medium">
                    {item.description}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-forest-900">
                    ${item.amount.toLocaleString()}.00
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                        item.status === 'Paid'
                          ? 'bg-sage-100 text-forest-800 border border-sage-200'
                          : item.status === 'Pending'
                          ? 'bg-beige-200 text-forest-900 border border-beige-300'
                          : 'bg-red-100 text-red-800 border border-red-200'
                      }`}
                    >
                      {item.status === 'Paid' && <Check className="w-3 h-3 text-forest-600" />}
                      {item.status === 'Pending' && <Clock className="w-3 h-3 text-softbrown-400" />}
                      <span>{item.status}</span>
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    {item.status === 'Paid' ? (
                      <button
                        onClick={() => setActiveReceipt(item)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-beige-100 border border-beige-300 text-forest-800 text-xs font-semibold shadow-sm transition-colors"
                      >
                        <Download className="w-3.5 h-3.5 text-terracotta" />
                        <span>Receipt</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => handleStartPayment(item.amount)}
                        className="px-3 py-1.5 rounded-xl bg-forest-600 hover:bg-forest-700 text-cream text-xs font-semibold shadow-sm transition-colors"
                      >
                        Pay Now
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Demo Disclaimer */}
        <div className="p-4 rounded-2xl bg-beige-100/60 border border-beige-200 flex items-start gap-2.5 text-xs text-forest-700">
          <ShieldCheck className="w-4 h-4 text-forest-600 flex-shrink-0 mt-0.5" />
          <span>
            <strong>Demonstration Notice:</strong> This is a secure frontend educational demonstration. Simulated payments update the dashboard state and generate printable receipts without collecting actual banking credentials.
          </span>
        </div>
      </div>

      {/* ========================================================
          4. SIMULATED PAYMENT MODAL FLOW
         ======================================================== */}
      {payModalOpen && (
        <div
          onClick={() => !isProcessing && setPayModalOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-forest-950/75 backdrop-blur-md animate-fadeIn"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-lg w-full bg-cream rounded-4xl p-6 sm:p-8 shadow-soft-xl border border-beige-300 text-left rtl:text-right"
          >
            {/* Close Button */}
            {!isProcessing && (
              <button
                onClick={() => setPayModalOpen(false)}
                className="absolute top-4 right-4 rtl:right-auto rtl:left-4 p-2 rounded-full bg-white hover:bg-beige-100 text-forest-800 shadow-sm"
              >
                <X className="w-5 h-5" />
              </button>
            )}

            {paymentSuccess ? (
              /* Success Confirmation */
              <div className="text-center py-6">
                <div className="w-16 h-16 rounded-full bg-sage-100 text-forest-600 flex items-center justify-center mx-auto mb-4 border border-sage-200">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-forest-900 mb-2">
                  Payment Processed!
                </h3>
                <p className="text-xs sm:text-sm text-forest-700 mb-6 leading-relaxed">
                  Your simulated tuition payment of <strong className="text-forest-900">${paymentSuccess.amount.toLocaleString()}.00</strong> has been confirmed.
                </p>

                <div className="p-4 rounded-2xl bg-white border border-beige-200 text-xs text-forest-800 space-y-1.5 mb-6 text-left rtl:text-right">
                  <p><strong>Student:</strong> {childProfile.name}</p>
                  <p><strong>Receipt Number:</strong> <span className="font-mono">{paymentSuccess.receipt}</span></p>
                  <p><strong>Status:</strong> Cleared & Added to Payment Ledger</p>
                </div>

                <div className="flex items-center justify-center gap-3">
                  <button
                    onClick={() => {
                      setPayModalOpen(false);
                      setPaymentSuccess(null);
                    }}
                    className="px-6 py-2.5 rounded-full bg-forest-600 text-cream text-xs font-semibold hover:bg-forest-700"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              /* Payment Checkout Form */
              <>
                <div className="mb-6">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-forest-700 bg-sage-100 px-3 py-1 rounded-full border border-sage-200 inline-block mb-1">
                    Simulated Parent Checkout
                  </span>
                  <h2 className="font-serif text-2xl font-bold text-forest-900">
                    Tuition Installment
                  </h2>
                  <p className="text-xs text-forest-600 mt-0.5">
                    For: {childProfile.name} ({childProfile.program})
                  </p>
                </div>

                <form onSubmit={handleSubmitPayment} className="space-y-4">
                  {/* Amount Selection */}
                  <div>
                    <label className="block text-xs font-bold text-forest-800 mb-1">
                      Payment Amount ($) *
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 rtl:left-auto rtl:right-3 top-3 w-4 h-4 text-forest-400" />
                      <input
                        required
                        type="number"
                        min="10"
                        max="20000"
                        value={payAmount}
                        onChange={(e) => setPayAmount(Number(e.target.value))}
                        className="w-full pl-9 pr-3 rtl:pl-3 rtl:pr-9 py-2.5 text-sm rounded-xl bg-white border border-beige-300 font-bold text-forest-900 focus:outline-none focus:ring-2 focus:ring-forest-500"
                      />
                    </div>
                  </div>

                  {/* Payment Method Selector */}
                  <div>
                    <label className="block text-xs font-bold text-forest-800 mb-1">
                      Payment Method
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'card', label: 'Credit Card', icon: CreditCard },
                        { id: 'ach', label: 'Bank ACH', icon: Building },
                        { id: 'applepay', label: 'Apple Pay', icon: Sparkles },
                      ].map((m) => (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => setPayMethod(m.id as any)}
                          className={`p-2.5 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1 transition-all ${
                            payMethod === m.id
                              ? 'bg-forest-600 text-cream border-forest-600 shadow-sm'
                              : 'bg-white text-forest-800 border-beige-300 hover:bg-beige-100'
                          }`}
                        >
                          <m.icon className="w-4 h-4" />
                          <span>{m.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Simulated Card Fields */}
                  <div className="space-y-3 p-4 rounded-2xl bg-white border border-beige-200 text-xs">
                    <div>
                      <label className="block font-bold text-forest-800 mb-1">Cardholder Name</label>
                      <input
                        type="text"
                        value={cardHolder}
                        onChange={(e) => setCardHolder(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-cream border border-beige-300 text-forest-900"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-forest-800 mb-1">Card Number (Simulated)</label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-cream border border-beige-300 font-mono text-forest-900"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold text-forest-800 mb-1">Expires</label>
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg bg-cream border border-beige-300 text-forest-900"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-forest-800 mb-1">CVC</label>
                        <input
                          type="text"
                          value={cardCvc}
                          onChange={(e) => setCardCvc(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg bg-cream border border-beige-300 text-forest-900"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-end gap-3">
                    <button
                      type="button"
                      disabled={isProcessing}
                      onClick={() => setPayModalOpen(false)}
                      className="px-4 py-2 text-xs font-semibold text-forest-700"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isProcessing}
                      className="px-6 py-2.5 rounded-full bg-forest-600 hover:bg-forest-700 text-cream text-xs font-bold shadow-soft transition-all flex items-center gap-2"
                    >
                      {isProcessing ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-cream/30 border-t-cream rounded-full animate-spin" />
                          <span>Processing ${payAmount.toLocaleString()}...</span>
                        </>
                      ) : (
                        <span>Confirm Payment (${payAmount.toLocaleString()})</span>
                      )}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}

      {/* ========================================================
          5. PRINTABLE RECEIPT MODAL
         ======================================================== */}
      {activeReceipt && (
        <div
          onClick={() => setActiveReceipt(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-forest-950/75 backdrop-blur-md animate-fadeIn"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-md w-full bg-white rounded-3xl p-6 sm:p-8 shadow-soft-xl border border-beige-300 text-left rtl:text-right"
          >
            {/* Top Close */}
            <button
              onClick={() => setActiveReceipt(null)}
              className="absolute top-4 right-4 rtl:right-auto rtl:left-4 p-2 rounded-full bg-beige-100 hover:bg-beige-200 text-forest-800"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Receipt Content */}
            <div className="text-center pb-4 border-b border-beige-200">
              <div className="w-12 h-12 rounded-2xl bg-forest-600 text-cream flex items-center justify-center mx-auto mb-2 shadow-sm">
                <Receipt className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-bold text-forest-900">
                Official Tuition Receipt
              </h3>
              <p className="text-xs text-forest-600">Montessori Pod</p>
              <p className="font-mono text-xs text-terracotta mt-1">{activeReceipt.receiptNumber}</p>
            </div>

            <div className="py-4 space-y-2.5 text-xs text-forest-800 border-b border-beige-200">
              <div className="flex justify-between">
                <span className="text-forest-600">Payment ID:</span>
                <span className="font-mono font-semibold">{activeReceipt.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-forest-600">Date Paid:</span>
                <span className="font-medium">{activeReceipt.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-forest-600">Student:</span>
                <span className="font-semibold">{childProfile.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-forest-600">Description:</span>
                <span className="font-medium text-right rtl:text-left">{activeReceipt.description}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-forest-600">Payment Method:</span>
                <span>{activeReceipt.paymentMethod || 'Electronic Transfer'}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-dashed border-beige-200 text-sm font-bold text-forest-900">
                <span>Total Amount Paid:</span>
                <span>${activeReceipt.amount.toLocaleString()}.00</span>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between">
              <span className="text-[10px] text-softbrown-400">
                Status: Verified & Cleared
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 rounded-full bg-forest-600 text-cream text-xs font-semibold hover:bg-forest-700 flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Receipt</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

