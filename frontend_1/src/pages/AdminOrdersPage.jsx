// import { useEffect, useState, useRef } from 'react'
// import { Link, useNavigate, useLocation } from 'react-router-dom'
// import { useAuth } from '../context/AuthContext'
// import { getAllOrders } from '../api/api'
// import OrderTable from '../components/OrderTable'
// import toast from 'react-hot-toast'

// const STATUS_STYLES = {
//   pending:   'bg-amber-50 text-amber-700 border-amber-100',
//   confirmed: 'bg-blue-50 text-blue-700 border-blue-100',
//   stitching: 'bg-indigo-50 text-indigo-700 border-indigo-100',
//   ready:     'bg-purple-50 text-purple-700 border-purple-100',
//   delivered: 'bg-emerald-50 text-emerald-700 border-emerald-100',
//   cancelled: 'bg-rose-50 text-rose-700 border-rose-100',
// }

// const STATUSES = ['all', 'pending', 'confirmed', 'stitching', 'ready', 'delivered', 'cancelled']

// // ─── Sidebar ──────────────────────────────────────────────────
// function Sidebar({ isSidebarOpen, setIsSidebarOpen, onLogout, loggingOut, user }) {
//   const location = useLocation()
//   const initial = (user?.name || user?.email || 'U').charAt(0).toUpperCase()
//   const [profileOpen, setProfileOpen] = useState(false)
//   const profileRef = useRef(null)
//   const railProfileRef = useRef(null)

//   useEffect(() => {
//     function handleClickOutside(e) {
//       const inMain = profileRef.current && profileRef.current.contains(e.target)
//       const inRail = railProfileRef.current && railProfileRef.current.contains(e.target)
//       if (!inMain && !inRail) setProfileOpen(false)
//     }
//     if (profileOpen) document.addEventListener('mousedown', handleClickOutside)
//     return () => document.removeEventListener('mousedown', handleClickOutside)
//   }, [profileOpen])

//   const isActive = (href) => location.pathname === href

//   const links = [
//     {
//       id: 'dashboard',
//       label: 'Dashboard',
//       href: '/dashboard',
//       icon: (
//         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
//         </svg>
//       ),
//     },
//     {
//       id: 'products',
//       label: 'Manage Products',
//       href: '/admin/products',
//       icon: (
//         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
//         </svg>
//       ),
//     },
//     {
//       id: 'orders',
//       label: 'Manage Orders',
//       href: '/admin/orders',
//       icon: (
//         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
//         </svg>
//       ),
//     },
//   ]

//   const ProfilePopover = ({ align = 'left' }) => (
//     <div className={`absolute bottom-14 ${align === 'center' ? 'left-1/2 -translate-x-1/2' : 'left-0'} w-64 bg-white rounded-2xl shadow-xl border border-slate-100 p-5 z-50`}>
//       <div className="absolute -bottom-2 left-5 w-4 h-4 bg-white border-b border-r border-slate-100 rotate-45 rounded-sm" />
//       <div className="flex items-center gap-3 mb-4">
//         <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#C5A059] to-[#E0C796] flex items-center justify-center text-white font-serif font-bold text-lg flex-shrink-0">
//           {initial}
//         </div>
//         <div className="overflow-hidden">
//           <p className="font-semibold text-slate-900 text-sm truncate">{user?.name || 'User'}</p>
//           {user?.email && <p className="text-xs text-slate-500 truncate mt-0.5">{user.email}</p>}
//         </div>
//       </div>
//       <div className="pt-3 border-t border-slate-50">
//         <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#C5A059]/10 text-[#C5A059] text-[10px] font-bold uppercase tracking-widest rounded-full border border-[#C5A059]/20">
//           <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059] animate-pulse" />
//           {user?.role || 'admin'}
//         </span>
//       </div>
//     </div>
//   )

//   return (
//     <>
//       {/* Mobile Backdrop */}
//       {isSidebarOpen && (
//         <div
//           className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 transition-opacity md:hidden"
//           onClick={() => setIsSidebarOpen(false)}
//         />
//       )}

//       {/* Mobile Icon Rail */}
//       <div className="md:hidden fixed inset-y-0 left-0 z-30 w-16 bg-white border-r border-slate-100 flex flex-col items-center py-4 gap-2">
//         <button
//           onClick={() => setIsSidebarOpen(true)}
//           className="w-10 h-10 flex items-center justify-center rounded-xl text-slate-400 hover:bg-slate-50 hover:text-slate-700 transition-all mb-2"
//         >
//           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
//           </svg>
//         </button>
//         <div className="flex-1 flex flex-col items-center gap-1 w-full px-2">
//           {links.map((l) => {
//             const active = isActive(l.href)
//             return (
//               <Link
//                 key={l.id}
//                 to={l.href}
//                 className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-200 ${
//                   active ? 'bg-[#C5A059] text-white shadow-md shadow-[#C5A059]/20' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-700'
//                 }`}
//                 title={l.label}
//               >
//                 {l.icon}
//               </Link>
//             )
//           })}
//         </div>
//         <div className="relative mt-auto" ref={railProfileRef}>
//           <button
//             onClick={() => setProfileOpen((p) => !p)}
//             className="w-10 h-10 rounded-full bg-gradient-to-br from-[#C5A059] to-[#E0C796] flex items-center justify-center text-white font-serif font-bold text-base shadow-sm hover:shadow-md transition-all"
//           >
//             {initial}
//           </button>
//           {profileOpen && <ProfilePopover align="center" />}
//         </div>
//         <button
//           onClick={onLogout}
//           disabled={loggingOut}
//           className="w-10 h-10 flex items-center justify-center rounded-xl text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all mt-1 disabled:opacity-50"
//           title="Logout"
//         >
//           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
//           </svg>
//         </button>
//       </div>

//       {/* Full Sidebar */}
//       <aside className={`
//         fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-100 shadow-2xl flex flex-col
//         transform transition-transform duration-300 ease-in-out
//         ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
//         md:translate-x-0 md:static md:inset-auto md:shadow-none
//       `}>
//         <div className="h-20 flex items-center px-8 border-b border-slate-50">
//           <Link to="/" className="font-serif text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
//             <span className="w-2 h-8 bg-[#C5A059] rounded-full" />
//             Larkings<span className="text-[#C5A059]">MensWear</span>
//           </Link>
//           <button className="md:hidden ml-auto text-slate-400 hover:text-slate-600" onClick={() => setIsSidebarOpen(false)}>
//             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//             </svg>
//           </button>
//         </div>

//         <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
//           {links.map((l) => {
//             const active = isActive(l.href)
//             return (
//               <Link
//                 key={l.id}
//                 to={l.href}
//                 onClick={() => setIsSidebarOpen(false)}
//                 className={`
//                   group flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-200
//                   ${active
//                     ? 'bg-[#C5A059] text-white shadow-md shadow-[#C5A059]/20'
//                     : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
//                   }
//                 `}
//               >
//                 <span className={active ? 'text-white' : 'text-slate-400 group-hover:text-slate-600'}>{l.icon}</span>
//                 {l.label}
//                 {active && <span className="ml-auto w-1.5 h-1.5 bg-white rounded-full" />}
//               </Link>
//             )
//           })}
//         </nav>

//         <div className="p-4 border-t border-slate-50 flex items-center gap-3">
//           <div className="relative" ref={profileRef}>
//             <button
//               onClick={() => setProfileOpen((p) => !p)}
//               className="relative w-10 h-10 rounded-full bg-gradient-to-br from-[#C5A059] to-[#E0C796] flex items-center justify-center text-white font-serif font-bold text-base shadow-sm hover:shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-[#C5A059]/40"
//               title="Profile"
//             >
//               {initial}
//               <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 border-2 border-white rounded-full" />
//             </button>
//             {profileOpen && <ProfilePopover align="left" />}
//           </div>
//           <button
//             onClick={onLogout}
//             disabled={loggingOut}
//             className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-500 hover:text-red-600 hover:bg-red-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
//           >
//             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
//             </svg>
//             {loggingOut ? 'Signing out...' : 'Logout'}
//           </button>
//         </div>
//       </aside>
//     </>
//   )
// }

// // ─── Main Component ───────────────────────────────────────────
// export default function AdminOrdersPage() {
//   const { user, logout } = useAuth()
//   const navigate = useNavigate()
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false)
//   const [loggingOut, setLoggingOut] = useState(false)
//   const [orders,  setOrders]  = useState([])
//   const [loading, setLoading] = useState(true)
//   const [error,   setError]   = useState('')
//   const [filter,  setFilter]  = useState('all')
//   const [page,    setPage]    = useState(1)
//   const [totalPages, setTotalPages] = useState(1)

//   const handleLogout = async () => {
//     setLoggingOut(true)
//     try {
//       await logout()
//       toast.success('Signed out successfully')
//       navigate('/')
//     } catch {
//       toast.error('Failed to sign out')
//     } finally {
//       setLoggingOut(false)
//     }
//   }

//   useEffect(() => {
//     const params = { page, limit: 10 }
//     getAllOrders(params)
//       .then((r) => {
//         const list = r.data?.data || []
//         setOrders(list)
//         if (r.pagination?.totalPages) setTotalPages(r.pagination.totalPages)
//         else if (r.total) setTotalPages(Math.ceil(r.total / 10))
//       })
//       .catch(() => setError('Failed to load orders.'))
//       .finally(() => setLoading(false))
//   }, [page])

//   const filtered = filter === 'all' ? orders : orders.filter((o) => o.status === filter)

//   return (
//     <div className="min-h-screen bg-slate-50 text-slate-700 flex font-sans">

//       <Sidebar
//         isSidebarOpen={isSidebarOpen}
//         setIsSidebarOpen={setIsSidebarOpen}
//         onLogout={handleLogout}
//         loggingOut={loggingOut}
//         user={user}
//       />

//       {/* Main Content — pl-16 on mobile to clear the icon rail */}
//       <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden pl-16 md:pl-0">

//         {/* Header */}
//         <header className="bg-white border-b border-slate-100 px-4 sm:px-6 py-4 sm:py-5 flex items-center justify-between gap-4 sticky top-0 z-30 shadow-sm">
//           <div>
//             <p className="font-mono text-[10px] uppercase tracking-widest text-slate-400 font-semibold mb-0.5">Admin Dashboard</p>
//             <h1 className="text-lg sm:text-xl font-bold text-slate-900 font-serif">All Orders</h1>
//           </div>
//           {orders.length > 0 && (
//             <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#C5A059]/10 text-[#C5A059] text-xs font-bold rounded-full border border-[#C5A059]/20">
//               {orders.length} orders
//             </span>
//           )}
//         </header>

//         {/* Filter Tabs */}
//         <div className="px-4 sm:px-6 py-4 border-b border-slate-100 bg-white">
//           {/* Mobile Dropdown */}
//           <div className="sm:hidden">
//             <select
//               value={filter}
//               onChange={(e) => setFilter(e.target.value)}
//               className="w-full px-4 py-2.5 rounded-xl bg-slate-900 text-white font-mono text-sm font-semibold border-0 shadow appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#C5A059]/50"
//             >
//               {STATUSES.map((s) => (
//                 <option key={s} value={s} className="bg-white text-slate-900">
//                   {s === 'all' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
//                 </option>
//               ))}
//             </select>
//           </div>
//           {/* Desktop Tabs */}
//           <div className="hidden sm:flex gap-2 flex-wrap">
//             {STATUSES.map((s) => (
//               <button
//                 key={s}
//                 onClick={() => setFilter(s)}
//                 className={`text-xs font-mono px-4 py-2 rounded-xl capitalize transition-all duration-200 border whitespace-nowrap ${
//                   filter === s
//                     ? 'bg-[#C5A059] text-white border-transparent shadow-md shadow-[#C5A059]/20 font-bold'
//                     : 'bg-white border-slate-200 text-slate-500 hover:border-[#C5A059]/40 hover:text-[#C5A059] hover:bg-slate-50'
//                 }`}
//               >
//                 {s === 'all' ? 'All Orders' : s}
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Content */}
//         <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6">

//           {/* Loading */}
//           {loading && (
//             <div className="space-y-3">
//               {[...Array(5)].map((_, i) => (
//                 <div key={i} className="h-16 bg-slate-100 rounded-xl animate-pulse" />
//               ))}
//             </div>
//           )}

//           {/* Error */}
//           {error && (
//             <div className="bg-rose-50 border border-rose-100 text-rose-600 px-6 py-4 rounded-2xl font-medium flex items-center gap-3">
//               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//               </svg>
//               {error}
//             </div>
//           )}

//           {/* Empty state */}
//           {!loading && !error && filtered.length === 0 && (
//             <div className="flex flex-col items-center justify-center py-24 bg-white rounded-2xl border border-dashed border-slate-200">
//               <div className="p-4 bg-slate-50 rounded-full mb-4">
//                 <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
//                 </svg>
//               </div>
//               <p className="font-semibold text-slate-500">No orders found{filter !== 'all' ? ` for "${filter}"` : ''}</p>
//             </div>
//           )}

//           {/* Mobile Card View */}
//           {!loading && !error && filtered.length > 0 && (
//             <div className="block sm:hidden space-y-4">
//               {filtered.map((order) => {
//                 const status = order?.status || 'pending'
//                 const badgeClass = STATUS_STYLES[status] || STATUS_STYLES.pending
//                 const firstItem = order?.items?.[0]
//                 const itemCount = order?.items?.length ?? 0
//                 const total = order?.totalAmount ?? '—'
//                 const stitching = order?.stitching?.type ? 'Yes' : 'No'

//                 return (
//                   <div
//                     key={order._id}
//                     onClick={() => navigate(`/admin/orders/${order._id}`)}
//                     className="bg-white border border-slate-100 rounded-2xl p-5 hover:border-[#C5A059]/40 hover:shadow-lg hover:shadow-[#C5A059]/10 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer shadow-sm"
//                   >
//                     <div className="flex items-start justify-between gap-3 mb-4">
//                       <div>
//                         <p className="text-[10px] font-mono uppercase tracking-widest text-slate-400 mb-1">Order ID</p>
//                         <p className="text-slate-900 font-mono text-sm font-semibold">#{order._id?.slice(-8)}</p>
//                       </div>
//                       <span className={`text-[10px] font-mono font-semibold px-3 py-1.5 rounded-full border uppercase tracking-wide ${badgeClass} whitespace-nowrap`}>
//                         {status}
//                       </span>
//                     </div>

//                     <div className="h-px bg-slate-50 mb-4" />

//                     <div className="grid grid-cols-2 gap-3 text-sm">
//                       <div className="col-span-2">
//                         <p className="text-[10px] font-mono uppercase tracking-widest text-slate-400 mb-1">Product</p>
//                         <p className="font-semibold text-slate-800">
//                           {firstItem?.name || '—'}
//                           {itemCount > 1 && (
//                             <span className="inline-flex items-center px-2 py-0.5 bg-[#C5A059]/10 text-[#C5A059] text-xs rounded-full ml-2">+{itemCount - 1}</span>
//                           )}
//                         </p>
//                       </div>
//                       <div>
//                         <p className="text-[10px] font-mono uppercase tracking-widest text-slate-400 mb-1">Total</p>
//                         <p className="font-bold text-[#C5A059] text-base">₹{total}</p>
//                       </div>
//                       <div>
//                         <p className="text-[10px] font-mono uppercase tracking-widest text-slate-400 mb-1">Stitching</p>
//                         <p className={`font-semibold text-xs px-2 py-1 rounded-lg inline-block ${stitching === 'Yes' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-500'}`}>{stitching}</p>
//                       </div>
//                       <div className="col-span-2">
//                         <p className="text-[10px] font-mono uppercase tracking-widest text-slate-400 mb-1">Date</p>
//                         <p className="font-semibold text-slate-700">
//                           {order?.createdAt
//                             ? new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
//                             : '—'}
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                 )
//               })}
//             </div>
//           )}

//           {/* Desktop Table View */}
//           {!loading && !error && filtered.length > 0 && (
//             <div className="hidden sm:block">
//               <OrderTable orders={filtered} />
//             </div>
//           )}

//           {/* Pagination */}
//           {totalPages > 1 && (
//             <div className="flex items-center justify-center gap-2 mt-8 pb-4">
//               <button
//                 onClick={() => setPage((p) => Math.max(1, p - 1))}
//                 disabled={page === 1}
//                 className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border border-slate-200 bg-white text-slate-500 hover:border-[#C5A059] hover:text-[#C5A059] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
//               >
//                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
//                 </svg>
//                 Previous
//               </button>
//               <div className="flex items-center gap-1">
//                 {Array.from({ length: totalPages }, (_, i) => (
//                   <button
//                     key={i}
//                     onClick={() => setPage(i + 1)}
//                     className={`w-10 h-10 rounded-xl text-sm font-medium transition-all ${
//                       page === i + 1
//                         ? 'bg-slate-900 text-white shadow-md'
//                         : 'bg-white text-slate-500 hover:bg-slate-50 border border-slate-200'
//                     }`}
//                   >
//                     {i + 1}
//                   </button>
//                 ))}
//               </div>
//               <button
//                 onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
//                 disabled={page === totalPages}
//                 className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border border-slate-200 bg-white text-slate-500 hover:border-[#C5A059] hover:text-[#C5A059] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
//               >
//                 Next
//                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//                 </svg>
//               </button>
//             </div>
//           )}
//         </div>
//       </main>
//     </div>
//   )
// }

// ===================================

import { useEffect, useState, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getAllOrders } from '../api/api'
import OrderTable from '../components/OrderTable'
import toast from 'react-hot-toast'

const STATUS_STYLES = {
  pending:   'bg-amber-50 text-amber-700 border-amber-100',
  confirmed: 'bg-blue-50 text-blue-700 border-blue-100',
  stitching: 'bg-indigo-50 text-indigo-700 border-indigo-100',
  ready:     'bg-purple-50 text-purple-700 border-purple-100',
  delivered: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  cancelled: 'bg-rose-50 text-rose-700 border-rose-100',
}

const STATUSES = ['all', 'pending', 'confirmed', 'stitching', 'ready', 'delivered', 'cancelled']

// ─── Sidebar ──────────────────────────────────────────────────
function Sidebar({ onLogout, loggingOut, user, collapsed, setCollapsed }) {
  const location = useLocation()
  const initial = (user?.name || user?.email || 'U').charAt(0).toUpperCase()
  const [profileOpen, setProfileOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const profileRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(e) {
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const isActive = (href) => location.pathname === href

  const links = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      href: '/dashboard',
      icon: (
        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
    {
      id: 'products',
      label: 'Manage Products',
      href: '/admin/products',
      icon: (
        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
    },
    {
      id: 'orders',
      label: 'Manage Orders',
      href: '/admin/orders',
      icon: (
        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
    },
  ]

  const LogoutIcon = (
    <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
  )

  const ProfilePopup = ({ positionClasses, arrowClasses }) => (
    <div className={`absolute ${positionClasses} w-64 bg-white rounded-2xl shadow-xl border border-slate-100 p-5 z-50`}>
      <div className={`absolute w-4 h-4 bg-white border-slate-100 rotate-45 rounded-sm ${arrowClasses}`} />
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#C5A059] to-[#E0C796] flex items-center justify-center text-white font-serif font-bold text-lg flex-shrink-0">
          {initial}
        </div>
        <div className="overflow-hidden">
          <p className="font-semibold text-slate-900 text-sm truncate">{user?.name || 'User'}</p>
          {user?.email && <p className="text-xs text-slate-500 truncate mt-0.5">{user.email}</p>}
        </div>
      </div>
      <div className="pt-3 border-t border-slate-50">
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#C5A059]/10 text-[#C5A059] text-[10px] font-bold uppercase tracking-widest rounded-full border border-[#C5A059]/20">
          <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059] animate-pulse" />
          {user?.role || 'admin'}
        </span>
      </div>
    </div>
  )

  return (
    <>
      {/* ── MOBILE: Backdrop ── */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ── MOBILE: Floating hamburger trigger ── */}
      <button
        onClick={() => setMobileOpen(true)}
        className="md:hidden fixed top-4 left-4 z-30 w-9 h-9 flex items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-500 shadow-sm hover:bg-slate-50 transition-all"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* ══════════════════════════════════════════════════════
          DESKTOP SIDEBAR
      ══════════════════════════════════════════════════════ */}
      <aside
        className={`
          hidden md:flex flex-col h-screen bg-white border-r border-slate-100
          transition-all duration-300 ease-in-out flex-shrink-0
          ${collapsed ? 'w-[68px]' : 'w-72'}
        `}
      >
        {/* Brand + Collapse Button */}
        <div className={`h-20 flex items-center border-b border-slate-50 flex-shrink-0 ${collapsed ? 'justify-center px-0' : 'px-4'}`}>
          {collapsed ? (
            <button onClick={() => setCollapsed(false)} className="w-10 h-10 flex items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-all" title="Expand sidebar">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          ) : (
            <div className="flex items-center justify-between w-full">
              <Link to="/" className="font-serif text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <span className="w-2 h-8 bg-[#C5A059] rounded-full flex-shrink-0" />
                Larkings<span className="text-[#C5A059]">MensWear</span>
              </Link>
              <button 
                onClick={() => setCollapsed(true)} 
                className="w-9 h-9 flex items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-all flex-shrink-0"
                title="Collapse sidebar"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                </svg>
              </button>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className={`flex-1 py-4 space-y-1 overflow-y-auto overflow-x-hidden ${collapsed ? 'px-2' : 'px-4'}`}>
          {links.map((l) => {
            const active = isActive(l.href)
            return (
              <Link
                key={l.id}
                to={l.href}
                title={collapsed ? l.label : undefined}
                className={`
                  group flex items-center rounded-xl text-sm font-medium transition-all duration-200
                  ${collapsed ? 'justify-center w-10 h-10 mx-auto' : 'gap-3 px-4 py-3.5'}
                  ${active
                    ? 'bg-[#C5A059] text-white shadow-md shadow-[#C5A059]/20'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }
                `}
              >
                <span className={active ? 'text-white' : 'text-slate-400 group-hover:text-slate-600'}>
                  {l.icon}
                </span>
                {!collapsed && (
                  <>
                    {l.label}
                    {active && <span className="ml-auto w-1.5 h-1.5 bg-white rounded-full" />}
                  </>
                )}
              </Link>
            )
          })}
        </nav>

        {/* Bottom Section */}
        <div className={`border-t border-slate-50 py-4 flex flex-col gap-2 ${collapsed ? 'px-2 items-center' : 'px-4'}`}>
          {!collapsed && (
            <div className="px-2 mb-2">
              <p className="font-semibold text-slate-900 text-sm truncate">{user?.name || 'User'}</p>
              {user?.email && <p className="text-xs text-slate-500 truncate mt-0.5">{user.email}</p>}
            </div>
          )}

          {collapsed && (
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setProfileOpen((p) => !p)}
                title="Profile"
                className="relative w-10 h-10 rounded-full bg-gradient-to-br from-[#C5A059] to-[#E0C796] flex items-center justify-center text-white font-serif font-bold text-base shadow-sm hover:shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-[#C5A059]/40"
              >
                {initial}
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 border-2 border-white rounded-full" />
              </button>

              {profileOpen && (
                <ProfilePopup 
                  positionClasses="left-12 bottom-0" 
                  arrowClasses="top-3 -left-2 border-l border-b border-slate-100"
                />
              )}
            </div>
          )}

          <button
            onClick={onLogout}
            disabled={loggingOut}
            title="Logout"
            className={`
              flex items-center justify-center rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50
              transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
              ${collapsed ? 'w-10 h-10' : 'gap-2 px-4 py-2.5 w-full text-sm font-medium text-slate-500'}
            `}
          >
            {LogoutIcon}
            {!collapsed && (loggingOut ? 'Signing out...' : 'Logout')}
          </button>
        </div>
      </aside>

      {/* ══════════════════════════════════════════════════════
          MOBILE DRAWER
      ══════════════════════════════════════════════════════ */}
      <aside className={`
        md:hidden fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-100 shadow-2xl flex flex-col
        transform transition-transform duration-300 ease-in-out
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="h-20 flex items-center px-4 border-b border-slate-50 flex-shrink-0">
          <Link to="/" className="font-serif text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span className="w-2 h-8 bg-[#C5A059] rounded-full" />
            Larkings<span className="text-[#C5A059]">MensWear</span>
          </Link>
          <button className="ml-auto text-slate-400 hover:text-slate-600" onClick={() => setMobileOpen(false)}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          {links.map((l) => {
            const active = isActive(l.href)
            return (
              <Link
                key={l.id}
                to={l.href}
                onClick={() => setMobileOpen(false)}
                className={`
                  group flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-200
                  ${active
                    ? 'bg-[#C5A059] text-white shadow-md shadow-[#C5A059]/20'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }
                `}
              >
                <span className={active ? 'text-white' : 'text-slate-400 group-hover:text-slate-600'}>{l.icon}</span>
                {l.label}
                {active && <span className="ml-auto w-1.5 h-1.5 bg-white rounded-full" />}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-slate-50 flex flex-col gap-2">
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setProfileOpen((p) => !p)}
              className="relative w-10 h-10 rounded-full bg-gradient-to-br from-[#C5A059] to-[#E0C796] flex items-center justify-center text-white font-serif font-bold text-base shadow-sm hover:shadow-md transition-all"
              title="Profile"
            >
              {initial}
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 border-2 border-white rounded-full" />
            </button>
            {profileOpen && (
              <ProfilePopup 
                positionClasses="bottom-14 left-0" 
                arrowClasses="-bottom-2 left-5 border-b border-r border-slate-100"
              />
            )}
          </div>
          <button
            onClick={onLogout}
            disabled={loggingOut}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-500 hover:text-red-600 hover:bg-red-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {LogoutIcon}
            {loggingOut ? 'Signing out...' : 'Logout'}
          </button>
        </div>
      </aside>
    </>
  )
}

// ─── Main Component ───────────────────────────────────────────
export default function AdminOrdersPage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  
  // Replaced isSidebarOpen with collapsed state to match Dashboard
  const [collapsed, setCollapsed] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)
  
  const [orders,  setOrders]  = useState([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState('')
  const [filter,  setFilter]  = useState('all')
  const [page,    setPage]    = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const handleLogout = async () => {
    setLoggingOut(true)
    try {
      await logout()
      toast.success('Signed out successfully')
      navigate('/')
    } catch {
      toast.error('Failed to sign out')
    } finally {
      setLoggingOut(false)
    }
  }

  useEffect(() => {
    const params = { page, limit: 10 }
    getAllOrders(params)
      .then((r) => {
        const list = r.data?.data || []
        setOrders(list)
        if (r.pagination?.totalPages) setTotalPages(r.pagination.totalPages)
        else if (r.total) setTotalPages(Math.ceil(r.total / 10))
      })
      .catch(() => setError('Failed to load orders.'))
      .finally(() => setLoading(false))
  }, [page])

  const filtered = filter === 'all' ? orders : orders.filter((o) => o.status === filter)

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex overflow-hidden">

      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        onLogout={handleLogout}
        loggingOut={loggingOut}
        user={user}
      />

      {/* Main Content - Adjusted padding to match Dashboard structure */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        
        {/* Header */}
        <header className="px-4 md:px-8 py-4 md:py-6 flex-shrink-0 bg-slate-50 border-b border-slate-100">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {/* Mobile spacer so title clears the floating hamburger */}
              <div className="md:hidden w-9 flex-shrink-0" />
              
              <div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-slate-400 font-semibold mb-1">Admin Dashboard</p>
                <h1 className="font-serif text-2xl md:text-3xl font-bold text-slate-900">All Orders</h1>
              </div>
            </div>
            {orders.length > 0 && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#C5A059]/10 text-[#C5A059] text-xs font-bold rounded-full border border-[#C5A059]/20 whitespace-nowrap">
                {orders.length} orders
              </span>
            )}
          </div>
        </header>

        {/* Filter Tabs */}
        <div className="px-4 sm:px-6 md:px-8 py-4 border-b border-slate-100 bg-white">
          {/* Mobile Dropdown */}
          <div className="sm:hidden">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 text-white font-mono text-sm font-semibold border-0 shadow appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#C5A059]/50"
            >
              {STATUSES.map((s) => (
                <option key={s} value={s} className="bg-white text-slate-900">
                  {s === 'all' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
                </option>
              ))}
            </select>
          </div>
          {/* Desktop Tabs */}
          <div className="hidden sm:flex gap-2 flex-wrap">
            {STATUSES.map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`text-xs font-mono px-4 py-2 rounded-xl capitalize transition-all duration-200 border whitespace-nowrap ${
                  filter === s
                    ? 'bg-[#C5A059] text-white border-transparent shadow-md shadow-[#C5A059]/20 font-bold'
                    : 'bg-white border-slate-200 text-slate-500 hover:border-[#C5A059]/40 hover:text-[#C5A059] hover:bg-slate-50'
                }`}
              >
                {s === 'all' ? 'All Orders' : s}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 md:px-8 py-6">

          {/* Loading */}
          {loading && (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 bg-slate-100 rounded-xl animate-pulse" />
              ))}
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="bg-rose-50 border border-rose-100 text-rose-600 px-6 py-4 rounded-2xl font-medium flex items-center gap-3">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          )}

          {/* Empty state */}
          {!loading && !error && filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 bg-white rounded-2xl border border-dashed border-slate-200">
              <div className="p-4 bg-slate-50 rounded-full mb-4">
                <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              <p className="font-semibold text-slate-500">No orders found{filter !== 'all' ? ` for "${filter}"` : ''}</p>
            </div>
          )}

          {/* Mobile Card View */}
          {!loading && !error && filtered.length > 0 && (
            <div className="block sm:hidden space-y-4">
              {filtered.map((order) => {
                const status = order?.status || 'pending'
                const badgeClass = STATUS_STYLES[status] || STATUS_STYLES.pending
                const firstItem = order?.items?.[0]
                const itemCount = order?.items?.length ?? 0
                const total = order?.totalAmount ?? '—'
                const stitching = order?.stitching?.type ? 'Yes' : 'No'

                return (
                  <div
                    key={order._id}
                    onClick={() => navigate(`/admin/orders/${order._id}`)}
                    className="bg-white border border-slate-100 rounded-2xl p-5 hover:border-[#C5A059]/40 hover:shadow-lg hover:shadow-[#C5A059]/10 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div>
                        <p className="text-[10px] font-mono uppercase tracking-widest text-slate-400 mb-1">Order ID</p>
                        <p className="text-slate-900 font-mono text-sm font-semibold">#{order._id?.slice(-8)}</p>
                      </div>
                      <span className={`text-[10px] font-mono font-semibold px-3 py-1.5 rounded-full border uppercase tracking-wide ${badgeClass} whitespace-nowrap`}>
                        {status}
                      </span>
                    </div>

                    <div className="h-px bg-slate-50 mb-4" />

                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="col-span-2">
                        <p className="text-[10px] font-mono uppercase tracking-widest text-slate-400 mb-1">Product</p>
                        <p className="font-semibold text-slate-800">
                          {firstItem?.name || '—'}
                          {itemCount > 1 && (
                            <span className="inline-flex items-center px-2 py-0.5 bg-[#C5A059]/10 text-[#C5A059] text-xs rounded-full ml-2">+{itemCount - 1}</span>
                          )}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] font-mono uppercase tracking-widest text-slate-400 mb-1">Total</p>
                        <p className="font-bold text-[#C5A059] text-base">₹{total}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-mono uppercase tracking-widest text-slate-400 mb-1">Stitching</p>
                        <p className={`font-semibold text-xs px-2 py-1 rounded-lg inline-block ${stitching === 'Yes' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-500'}`}>{stitching}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-[10px] font-mono uppercase tracking-widest text-slate-400 mb-1">Date</p>
                        <p className="font-semibold text-slate-700">
                          {order?.createdAt
                            ? new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
                            : '—'}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* Desktop Table View */}
          {!loading && !error && filtered.length > 0 && (
            <div className="hidden sm:block">
              <OrderTable orders={filtered} />
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8 pb-4">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border border-slate-200 bg-white text-slate-500 hover:border-[#C5A059] hover:text-[#C5A059] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Previous
              </button>
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i + 1)}
                    className={`w-10 h-10 rounded-xl text-sm font-medium transition-all ${
                      page === i + 1
                        ? 'bg-slate-900 text-white shadow-md'
                        : 'bg-white text-slate-500 hover:bg-slate-50 border border-slate-200'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border border-slate-200 bg-white text-slate-500 hover:border-[#C5A059] hover:text-[#C5A059] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                Next
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}