// src/components/BillCard.jsx
const PAY_STATUS = {
  paid:    "bg-green-500/15 text-green-400 border-green-500/30",
  unpaid:  "bg-red-500/15 text-red-400 border-red-500/30",
  pending: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
};

export default function BillCard({ bill }) {
  if (!bill) return null;

  const payBadge = PAY_STATUS[bill?.paymentStatus] || PAY_STATUS.pending;

  return (
    <div className="bg-zinc-900 border border-zinc-700 rounded-xl overflow-hidden">
      {/* Invoice Header */}
      <div className="bg-gradient-to-r from-amber-500/10 to-zinc-900 px-6 py-4 border-b border-zinc-700 flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-widest text-zinc-500 mb-0.5">Invoice</p>
          <p className="text-amber-400 font-mono font-bold text-lg">#{bill?.invoiceNumber || bill?._id?.slice(-8)}</p>
        </div>
        <span className={`text-xs font-semibold px-3 py-1 rounded-full border uppercase tracking-wide ${payBadge}`}>
          {bill?.paymentStatus || "pending"}
        </span>
      </div>

      <div className="p-6 space-y-5">
        {/* Customer */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-zinc-500 text-xs mb-1 uppercase tracking-widest">Customer</p>
            <p className="text-zinc-200 font-medium">{bill?.customer?.name || bill?.user?.name || "—"}</p>
            <p className="text-zinc-500 text-xs mt-0.5">{bill?.customer?.email || bill?.user?.email || ""}</p>
          </div>
          <div>
            <p className="text-zinc-500 text-xs mb-1 uppercase tracking-widest">Date</p>
            <p className="text-zinc-200">
              {bill?.createdAt ? new Date(bill.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—"}
            </p>
          </div>
        </div>

        {/* Items */}
        {Array.isArray(bill?.items) && bill.items.length > 0 && (
          <div>
            <p className="text-zinc-500 text-xs mb-2 uppercase tracking-widest">Items</p>
            <div className="rounded-lg border border-zinc-800 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-zinc-800/60">
                    <th className="px-3 py-2 text-left text-zinc-500 text-xs">Item</th>
                    <th className="px-3 py-2 text-right text-zinc-500 text-xs">Qty</th>
                    <th className="px-3 py-2 text-right text-zinc-500 text-xs">Price</th>
                    <th className="px-3 py-2 text-right text-zinc-500 text-xs">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {bill.items.map((item, i) => (
                    <tr key={i} className="border-t border-zinc-800">
                      <td className="px-3 py-2.5 text-zinc-200">{item?.name || "—"}</td>
                      <td className="px-3 py-2.5 text-zinc-300 text-right">{item?.quantity}</td>
                      <td className="px-3 py-2.5 text-zinc-300 text-right">₹{item?.price}</td>
                      <td className="px-3 py-2.5 text-amber-400 font-semibold text-right">
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
        <div className="flex justify-between items-center pt-3 border-t border-zinc-700">
          <span className="text-zinc-400 font-medium text-sm">Total Amount</span>
          <span className="text-2xl font-bold text-amber-400">₹{bill?.total ?? "—"}</span>
        </div>
      </div>
    </div>
  );
}