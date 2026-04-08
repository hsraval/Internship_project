const PAYMENT_STYLES = {
  paid: "bg-green-100 text-green-700 border-green-200",
  unpaid: "bg-red-100 text-red-700 border-red-200",
  pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
};

export default function BillCard({ bill }) {
  if (!bill) return null;

  const paymentStatus = bill?.paymentStatus?.toLowerCase() || "pending";

  return (
    <div className="bg-[#E8E0D0] rounded-2xl border border-[#6B5F50]/20 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#6B5F50] to-[#6B5F50]/70 px-6 py-5 text-[#E8E0D0]">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-[#6B5F50]/70 uppercase tracking-widest font-medium mb-1">
              Invoice
            </p>
            <p className="text-lg font-bold font-mono tracking-wide text-[#E8E0D0]">
              #{bill?.invoiceNumber || bill?._id?.slice(-8).toUpperCase()}
            </p>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold border ${
              PAYMENT_STYLES[paymentStatus] || PAYMENT_STYLES.pending
            }`}
          >
            {paymentStatus.charAt(0).toUpperCase() + paymentStatus.slice(1)}
          </span>
        </div>
      </div>

      {/* Customer */}
      <div className="px-6 py-4 border-b border-[#6B5F50]/20">
        <p className="text-xs text-[#6B5F50]/70 uppercase tracking-widest font-medium mb-1">
          Bill To
        </p>
        <p className="text-[#6B5F50] font-semibold text-sm">
          {bill?.customer?.name || bill?.user?.name || "—"}
        </p>
        {(bill?.customer?.email || bill?.user?.email) && (
          <p className="text-[#6B5F50]/70 text-xs mt-0.5">
            {bill?.customer?.email || bill?.user?.email}
          </p>
        )}
      </div>

      {/* Items */}
      <div className="px-6 py-4 border-b border-[#6B5F50]/20">
        <p className="text-xs text-[#6B5F50]/70 uppercase tracking-widest font-medium mb-3">
          Items
        </p>
        <div className="space-y-2">
          {(bill?.items || []).map((item, i) => (
            <div key={i} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 bg-[#6B5F50]/20 rounded-full flex items-center justify-center text-xs text-[#E8E0D0] font-semibold">
                  {item?.quantity ?? 1}
                </span>
                <span className="text-[#6B5F50]">{item?.name || "Item"}</span>
              </div>
              <span className="text-[#6B5F50] font-medium">
                ₹{(item?.price * (item?.quantity || 1)).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Total */}
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <span className="text-[#6B5F50]/70 text-sm font-medium">Total Amount</span>
          <span className="text-[#6B5F50] text-xl font-bold">
            ₹{bill?.total?.toLocaleString() ?? "—"}
          </span>
        </div>
        {bill?.createdAt && (
          <p className="text-xs text-[#6B5F50]/70 mt-2 text-right">
            Issued:{" "}
            {new Date(bill.createdAt).toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </p>
        )}
      </div>
    </div>
  );
}
