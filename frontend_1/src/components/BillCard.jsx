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
    <div className="bg-[#FFFFFF] border border-[#CBD5E1] rounded-xl overflow-hidden">
      {/* Invoice Header */}
      <div className="bg-gradient-to-r from-[#C5A059]/10 to-[#F8F9FA] px-6 py-4 border-b border-[#CBD5E1] flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-widest text-[#64748B] mb-0.5">Invoice</p>
          <p className="text-[#C5A059] font-mono font-bold text-lg">#{bill?.invoiceNumber || bill?._id?.slice(-8)}</p>
        </div>
        <span className={`text-xs font-semibold px-3 py-1 rounded-full border uppercase tracking-wide ${payBadge}`}>
          {bill?.paymentStatus || "pending"}
        </span>
      </div>

      <div className="p-6 space-y-5">
        {/* Customer */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-[#64748B] text-xs mb-1 uppercase tracking-widest">Customer</p>
            <p className="text-[#333333] font-medium">{bill?.customer?.name || bill?.user?.name || "—"}</p>
            <p className="text-[#64748B] text-xs mt-0.5">{bill?.customer?.email || bill?.user?.email || ""}</p>
          </div>
          <div>
            <p className="text-[#64748B] text-xs mb-1 uppercase tracking-widest">Date</p>
            <p className="text-[#333333]">
              {bill?.createdAt ? new Date(bill.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—"}</p>
          </div>
        </div>

        {/* Items */}
        {Array.isArray(bill?.items) && bill.items.length > 0 && (
          <div>
            <p className="text-[#64748B] text-xs mb-2 uppercase tracking-widest">Items</p>
            <div className="rounded-lg border border-[#CBD5E1] overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#F8F9FA]/60">
                    <th className="px-3 py-2 text-left text-[#64748B] text-xs">Item</th>
                    <th className="px-3 py-2 text-right text-[#64748B] text-xs">Qty</th>
                    <th className="px-3 py-2 text-right text-[#64748B] text-xs">Price</th>
                    <th className="px-3 py-2 text-right text-[#64748B] text-xs">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {bill.items.map((item, i) => (
                    <tr key={i} className="border-t border-[#CBD5E1]">
                      <td className="px-3 py-2.5 text-[#333333]">{item?.name || "—"}</td>
                      <td className="px-3 py-2.5 text-[#64748B] text-right">{item?.quantity}</td>
                      <td className="px-3 py-2.5 text-[#64748B] text-right">₹{item?.price}</td>
                      <td className="px-3 py-2.5 text-[#C5A059] font-semibold text-right">
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
        <div className="flex justify-between items-center pt-3 border-t border-[#CBD5E1]">
          <span className="text-[#64748B] font-medium text-sm">Total Amount</span>
          <span className="text-2xl font-bold text-[#C5A059]">₹{bill?.total ?? "—"}</span>
        </div>
      </div>
    </div>
  );
}