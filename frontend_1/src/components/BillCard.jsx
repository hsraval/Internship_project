// src/components/BillCard.jsx
const PAY_STATUS = {
  paid:    "bg-green-500/15 text-green-600 border-green-500/30",
  unpaid:  "bg-red-500/15 text-red-600 border-red-500/30",
  pending: "bg-yellow-500/15 text-yellow-600 border-yellow-500/30",
};

export default function BillCard({ bill }) {
  if (!bill) return null;

  const payBadge = PAY_STATUS[bill?.paymentStatus] || PAY_STATUS.pending;

  return (
    <div className="bg-white border border-[#b0d3e6] rounded-xl overflow-hidden">
      {/* Invoice Header */}
      <div className="bg-[#16537e] px-6 py-4 border-b border-[#124470] flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-widest text-white/60 mb-0.5">Invoice</p>
          <p className="text-white font-mono font-bold text-lg">#{bill?.invoiceNumber || bill?._id?.slice(-8)}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-white/70">Payment status:</span>
          <span className={`text-xs font-semibold px-3 py-1 rounded-full border uppercase tracking-wide ${payBadge}`}>
            {(bill?.paymentStatus || "pending").toUpperCase()}
          </span>
        </div>
      </div>

      <div className="p-6 space-y-5">
        {/* Customer */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-[#16537e]/60 text-xs mb-1 uppercase tracking-widest">Customer</p>
            <p className="text-[#1e2a3a] font-medium">{bill?.customer?.name || bill?.user?.name || "—"}</p>
            <p className="text-[#80b3ba] text-xs mt-0.5">{bill?.customer?.email || bill?.user?.email || ""}</p>
          </div>
          <div>
            <p className="text-[#16537e]/60 text-xs mb-1 uppercase tracking-widest">Date</p>
            <p className="text-[#1e2a3a]">
              {bill?.createdAt ? new Date(bill.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—"}</p>
          </div>
        </div>

        {/* Items */}
        {Array.isArray(bill?.items) && bill.items.length > 0 && (
          <div>
            <p className="text-[#16537e]/60 text-xs mb-2 uppercase tracking-widest">Items</p>
            <div className="rounded-lg border border-[#b0d3e6] overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#16537e]">
                    <th className="px-3 py-2 text-left text-white text-xs">Item</th>
                    <th className="px-3 py-2 text-right text-white text-xs">Qty</th>
                    <th className="px-3 py-2 text-right text-white text-xs">Price</th>
                    <th className="px-3 py-2 text-right text-white text-xs">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {bill.items.map((item, i) => (
                    <tr key={i} className="border-t border-[#b0d3e6] hover:bg-[#d7e9f2]/40 transition-colors">
                      <td className="px-3 py-2.5 text-[#1e2a3a]">{item?.name || "—"}</td>
                      <td className="px-3 py-2.5 text-[#16537e]/70 text-right">{item?.quantity}</td>
                      <td className="px-3 py-2.5 text-[#16537e]/70 text-right">₹{item?.price}</td>
                      <td className="px-3 py-2.5 text-[#16537e] font-semibold text-right">
                        ₹{(item?.quantity ?? 0) * (item?.price ?? 0)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Total */}
        <div className="flex justify-between items-center pt-3 border-t border-[#b0d3e6]">
          <span className="text-[#16537e]/70 font-medium text-sm">Total Amount</span>
          <span className="text-2xl font-bold text-[#16537e]">₹{bill?.totalAmount ?? "—"}</span>
        </div>
      </div>
    </div>
  );
}