// import { useState, useEffect, useRef } from 'react'
// import { useNavigate, Link, useLocation } from 'react-router-dom'
// import { useAuth } from '../context/AuthContext'
// import { getDashboardStats, getMonthlyRevenue, downloadRevenueReport } from '../api/api'
// import toast from 'react-hot-toast'

// // ─── Sidebar ──────────────────────────────────────────────────────────────────

// function Sidebar({ onLogout, loggingOut, user, isSidebarOpen, setIsSidebarOpen }) {
//   const isAdmin = user?.role === 'admin'
//   const initial = (user?.name || user?.email || 'U').charAt(0).toUpperCase()
//   const location = useLocation()
//   const [profileOpen, setProfileOpen] = useState(false)
//   const profileRef = useRef(null)

//   // Close popover on outside click
//   useEffect(() => {
//     function handleClickOutside(e) {
//       if (profileRef.current && !profileRef.current.contains(e.target)) {
//         setProfileOpen(false)
//       }
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
//       label: isAdmin ? 'Manage Products' : 'Browse Products',
//       href: isAdmin ? '/admin/products' : '/products',
//       icon: (
//         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
//         </svg>
//       ),
//     },
//     {
//       id: 'orders',
//       label: isAdmin ? 'Manage Orders' : 'My Orders',
//       href: isAdmin ? '/admin/orders' : '/orders',
//       icon: (
//         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
//         </svg>
//       ),
//     },
//     ...(!isAdmin ? [{
//       id: 'wishlist',
//       label: 'Wishlist',
//       href: '/wishlist',
//       icon: (
//         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
//         </svg>
//       ),
//     }] : []),
//   ]

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
//         {/* Hamburger */}
//         <button
//           onClick={() => setIsSidebarOpen(true)}
//           className="w-10 h-10 flex items-center justify-center rounded-xl text-slate-400 hover:bg-slate-50 hover:text-slate-700 transition-all mb-2"
//         >
//           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
//           </svg>
//         </button>

//         {/* Rail nav icons */}
//         <div className="flex-1 flex flex-col items-center gap-1 w-full px-2">
//           {links.map((l) => {
//             const active = isActive(l.href)
//             return (
//               <Link
//                 key={l.id}
//                 to={l.href}
//                 onClick={() => setIsSidebarOpen(false)}
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

//         {/* Rail profile avatar */}
//         <div className="relative mt-auto" ref={profileRef}>
//           <button
//             onClick={() => setProfileOpen((p) => !p)}
//             className="w-10 h-10 rounded-full bg-gradient-to-br from-[#C5A059] to-[#E0C796] flex items-center justify-center text-white font-serif font-bold text-base shadow-sm hover:shadow-md transition-all"
//           >
//             {initial}
//           </button>
//           {profileOpen && (
//             <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 p-4 z-50">
//               <div className="flex flex-col items-center gap-2 text-center">
//                 <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#C5A059] to-[#E0C796] flex items-center justify-center text-white font-serif font-bold text-lg">
//                   {initial}
//                 </div>
//                 <p className="font-semibold text-slate-900 text-sm leading-tight">{user?.name || 'User'}</p>
//                 {user?.email && <p className="text-xs text-slate-500 break-all">{user.email}</p>}
//                 <span className="mt-1 inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#C5A059]/10 text-[#C5A059] text-[10px] font-bold uppercase tracking-widest rounded-full border border-[#C5A059]/20">
//                   <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059]" />
//                   {user?.role || 'member'}
//                 </span>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Rail logout */}
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
//         md:translate-x-0 md:static md:inset-auto md:w-72 md:shadow-none
//       `}>
//         {/* Brand Header */}
//         <div className="h-20 flex items-center px-8 border-b border-slate-50">
//           <Link to="/" className="font-serif text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
//             <span className="w-2 h-8 bg-[#C5A059] rounded-full"></span>
//             Larkings<span className="text-[#C5A059]">MensWear</span>
//           </Link>
//           <button className="md:hidden ml-auto text-slate-400 hover:text-slate-600" onClick={() => setIsSidebarOpen(false)}>
//             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//             </svg>
//           </button>
//         </div>

//         {/* Navigation */}
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

//         {/* Bottom: Profile Avatar + Logout */}
//         <div className="p-4 border-t border-slate-50 flex items-center gap-3">
//           {/* Profile Avatar with Popover */}
//           <div className="relative" ref={profileRef}>
//             <button
//               onClick={() => setProfileOpen((p) => !p)}
//               className="relative w-10 h-10 rounded-full bg-gradient-to-br from-[#C5A059] to-[#E0C796] flex items-center justify-center text-white font-serif font-bold text-base shadow-sm hover:shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-[#C5A059]/40"
//               title="Profile"
//             >
//               {initial}
//               {/* Online dot */}
//               <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 border-2 border-white rounded-full" />
//             </button>

//             {/* Profile Popover */}
//             {profileOpen && (
//               <div className="absolute bottom-14 left-0 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 p-5 z-50 animate-in">
//                 {/* Arrow */}
//                 <div className="absolute -bottom-2 left-5 w-4 h-4 bg-white border-b border-r border-slate-100 rotate-45 rounded-sm" />

//                 <div className="flex items-center gap-3 mb-4">
//                   <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#C5A059] to-[#E0C796] flex items-center justify-center text-white font-serif font-bold text-lg flex-shrink-0">
//                     {initial}
//                   </div>
//                   <div className="overflow-hidden">
//                     <p className="font-semibold text-slate-900 text-sm truncate">{user?.name || 'User'}</p>
//                     {user?.email && (
//                       <p className="text-xs text-slate-500 truncate mt-0.5">{user.email}</p>
//                     )}
//                   </div>
//                 </div>

//                 <div className="pt-3 border-t border-slate-50">
//                   <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#C5A059]/10 text-[#C5A059] text-[10px] font-bold uppercase tracking-widest rounded-full border border-[#C5A059]/20">
//                     <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059] animate-pulse" />
//                     {user?.role || 'member'}
//                   </span>
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Logout */}
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

// // ─── Helpers ──────────────────────────────────────────────────────────────────

// const STATUS_COLORS = {
//   pending:   'bg-amber-50 text-amber-700 border-amber-100',
//   confirmed: 'bg-blue-50 text-blue-700 border-blue-100',
//   stitching: 'bg-indigo-50 text-indigo-700 border-indigo-100',
//   ready:     'bg-purple-50 text-purple-700 border-purple-100',
//   delivered: 'bg-emerald-50 text-emerald-700 border-emerald-100',
//   cancelled: 'bg-rose-50 text-rose-700 border-rose-100',
// }

// const MONTHS = [
//   'January','February','March','April','May','June',
//   'July','August','September','October','November','December'
// ]

// const currentYear  = new Date().getFullYear()
// const currentMonth = new Date().getMonth() + 1
// const YEARS        = [currentYear - 2, currentYear - 1, currentYear]

// // ─── Stat Card ────────────────────────────────────────────────────────────────

// function StatCard({ label, value, icon, accent }) {
//   return (
//     <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-slate-200 transition-all duration-300 group">
//       <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${accent || 'bg-slate-50'} group-hover:scale-105 transition-transform duration-300`}>
//         <span className="text-2xl">{icon}</span>
//       </div>
//       <div className="min-w-0">
//         <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">{label}</p>
//         <p className="font-serif text-2xl font-bold text-slate-800 truncate">{value ?? '—'}</p>
//       </div>
//     </div>
//   )
// }

// // ─── Revenue Card ─────────────────────────────────────────────────────────────

// function RevenueCard({ label, value, highlight }) {
//   return (
//     <div className={`rounded-2xl p-6 border shadow-sm transition-all duration-300 ${highlight
//       ? 'bg-[#C5A059] border-[#C5A059] text-white shadow-[#C5A059]/20'
//       : 'bg-white border-slate-100 text-slate-800 hover:shadow-md'}`}>
//       <p className={`text-xs font-semibold uppercase tracking-wider mb-2 ${highlight ? 'text-white/80' : 'text-slate-400'}`}>{label}</p>
//       <p className={`font-serif text-3xl font-bold ${highlight ? 'text-white' : 'text-slate-900'}`}>
//         ₹{Number(value ?? 0).toLocaleString()}
//       </p>
//     </div>
//   )
// }

// // ─── Admin Dashboard Content ──────────────────────────────────────────────────

// function AdminDashboard({ user, navigate }) {
//   const [data,        setData]        = useState(null)
//   const [loading,     setLoading]     = useState(true)
//   const [error,       setError]       = useState('')
//   const [selMonth,    setSelMonth]    = useState(currentMonth)
//   const [selYear,     setSelYear]     = useState(currentYear)
//   const [monthlyData, setMonthlyData] = useState(null)
//   const [mLoading,    setMLoading]    = useState(false)
//   const [downloading, setDownloading] = useState(false)

//   useEffect(() => {
//     setLoading(true)
//     getDashboardStats()
//       .then((r) => setData(r.data?.data || r.data))
//       .catch(() => setError('Failed to load dashboard data.'))
//       .finally(() => setLoading(false))
//   }, [])

//   useEffect(() => {
//     setMLoading(true)
//     getMonthlyRevenue(selMonth, selYear)
//       .then((r) => setMonthlyData(r.data?.data || r.data))
//       .catch(() => {})
//       .finally(() => setMLoading(false))
//   }, [selMonth, selYear])

//   const handleDownload = async () => {
//     setDownloading(true)
//     try {
//       const res = await downloadRevenueReport(selMonth, selYear)
//       const url = window.URL.createObjectURL(new Blob([res.data]))
//       const a   = document.createElement('a')
//       a.href     = url
//       a.download = `revenue-${MONTHS[selMonth - 1]}-${selYear}.pdf`
//       a.click()
//       window.URL.revokeObjectURL(url)
//       toast.success('Report downloaded')
//     } catch {
//       toast.error('Failed to download report')
//     } finally {
//       setDownloading(false)
//     }
//   }

//   const SELECT_CLS = "w-full sm:w-auto px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-600 font-medium focus:outline-none focus:ring-2 focus:ring-[#C5A059]/20 focus:border-[#C5A059] transition-all cursor-pointer appearance-none pr-10"

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center py-32">
//         <div className="relative">
//           <div className="w-12 h-12 border-4 border-slate-100 rounded-full" />
//           <div className="absolute top-0 left-0 w-12 h-12 border-4 border-[#C5A059] rounded-full border-t-transparent animate-spin" />
//         </div>
//       </div>
//     )
//   }

//   if (error) {
//     return (
//       <div className="bg-red-50 border border-red-100 text-red-600 px-6 py-4 rounded-2xl font-medium flex items-center gap-3">
//         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//         </svg>
//         {error}
//       </div>
//     )
//   }

//   const stats          = data?.stats          || {}
//   const revenue        = data?.revenue        || {}
//   const recentOrders   = data?.recentOrders   || []
//   const monthlyRevenue = data?.monthlyRevenue || []

//   return (
//     <div className="space-y-8 pb-8">
//       {/* Role badge */}
//       <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#C5A059]/10 border border-[#C5A059]/20">
//         <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059] animate-pulse" />
//         <span className="font-mono text-xs font-semibold uppercase tracking-widest text-[#C5A059]">Administrator</span>
//       </div>

//       {/* Stat Cards */}
//       <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
//         <StatCard label="Total Orders"    value={stats.totalOrders}     icon="📦" />
//         <StatCard label="Pending"         value={stats.pendingOrders}   icon="⏳" accent="bg-amber-50" />
//         <StatCard label="Delivered"       value={stats.deliveredOrders} icon="✅" accent="bg-emerald-50" />
//         <StatCard label="Users"           value={stats.totalUsers}      icon="👤" accent="bg-blue-50" />
//         <StatCard label="Products"        value={stats.totalProducts}   icon="◈"  accent="bg-slate-100" />
//         <StatCard label="Fabrics"         value={stats.totalFabrics}    icon="🪡" accent="bg-orange-50" />
//       </div>

//       {/* Revenue Cards */}
//       <div>
//         <h2 className="font-serif text-lg font-bold text-slate-800 mb-4">Revenue Overview</h2>
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//           <RevenueCard label="Total Revenue"   value={revenue.totalRevenue}   highlight />
//           <RevenueCard label="Paid Revenue"    value={revenue.paidRevenue} />
//           <RevenueCard label="Pending Revenue" value={revenue.pendingRevenue} />
//         </div>
//       </div>

//       {/* Monthly Analytics */}
//       <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
//         <div className="p-6 border-b border-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
//           <div>
//             <h2 className="font-serif text-lg font-bold text-slate-800">Monthly Analytics</h2>
//             <p className="text-slate-500 text-sm mt-1">Track performance and generate reports.</p>
//           </div>
//           <div className="flex flex-wrap items-center gap-3">
//             <div className="relative">
//               <select value={selMonth} onChange={(e) => setSelMonth(Number(e.target.value))} className={SELECT_CLS}>
//                 {MONTHS.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
//               </select>
//               <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-slate-400">
//                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
//               </div>
//             </div>
//             <div className="relative">
//               <select value={selYear} onChange={(e) => setSelYear(Number(e.target.value))} className={SELECT_CLS}>
//                 {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
//               </select>
//               <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-slate-400">
//                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
//               </div>
//             </div>
//             <button
//               onClick={handleDownload}
//               disabled={downloading}
//               className="flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-900 text-white font-medium text-sm rounded-xl hover:bg-[#C5A059] hover:shadow-lg hover:shadow-[#C5A059]/20 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
//             >
//               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
//               </svg>
//               {downloading ? 'Downloading...' : 'Download'}
//             </button>
//           </div>
//         </div>

//         <div className="p-6 bg-slate-50/50">
//           {mLoading ? (
//             <div className="flex items-center justify-center py-12">
//               <div className="w-8 h-8 border-2 border-slate-200 border-t-[#C5A059] rounded-full animate-spin" />
//             </div>
//           ) : monthlyData ? (
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
//               <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
//                 <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Total Revenue</p>
//                 <p className="font-serif text-xl font-bold text-slate-800">₹{Number(monthlyData.totalRevenue ?? 0).toLocaleString()}</p>
//               </div>
//               <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
//                 <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Paid</p>
//                 <p className="font-serif text-xl font-bold text-emerald-600">₹{Number(monthlyData.paidRevenue ?? 0).toLocaleString()}</p>
//               </div>
//               <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
//                 <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Pending</p>
//                 <p className="font-serif text-xl font-bold text-amber-600">₹{Number(monthlyData.pendingRevenue ?? 0).toLocaleString()}</p>
//               </div>
//             </div>
//           ) : null}

//           {monthlyRevenue.length > 0 && (
//             <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
//               <div className="flex items-center justify-between mb-6">
//                 <h3 className="text-sm font-bold text-slate-700">Year at a Glance</h3>
//                 <span className="text-xs text-slate-400">Revenue (INR)</span>
//               </div>
//               <div className="flex items-end gap-2 sm:gap-4 h-40 w-full">
//                 {monthlyRevenue.map((m) => {
//                   const max = Math.max(...monthlyRevenue.map((x) => x.revenue || 0), 1)
//                   const pct = Math.max(((m.revenue || 0) / max) * 100, 1)
//                   return (
//                     <div key={m.month} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
//                       <div className="relative w-full flex items-end justify-center h-full px-1">
//                         <div
//                           className="w-full max-w-[40px] bg-slate-100 rounded-t-lg group-hover:bg-[#C5A059] transition-all duration-500 ease-out relative"
//                           style={{ height: `${pct}%` }}
//                         >
//                           <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] font-mono py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none shadow-lg">
//                             ₹{Number(m.revenue).toLocaleString()}
//                           </div>
//                         </div>
//                       </div>
//                       <span className="font-mono text-[10px] text-slate-400 uppercase font-semibold group-hover:text-[#C5A059] transition-colors">{m.month?.slice(0, 3)}</span>
//                     </div>
//                   )
//                 })}
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Recent Orders */}
//       <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
//         <div className="p-6 border-b border-slate-50 flex items-center justify-between">
//           <div>
//             <h2 className="font-serif text-lg font-bold text-slate-800">Recent Orders</h2>
//             <p className="text-slate-500 text-sm mt-1">Latest transactions across the platform.</p>
//           </div>
//           <button
//             onClick={() => navigate('/admin/orders')}
//             className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-600 bg-slate-50 rounded-lg hover:bg-slate-100 hover:text-slate-900 transition-colors"
//           >
//             View All
//             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
//             </svg>
//           </button>
//         </div>

//         {recentOrders.length === 0 ? (
//           <div className="py-12 text-center">
//             <p className="text-slate-400 font-medium">No recent orders found</p>
//           </div>
//         ) : (
//           <>
//             {/* Desktop Table */}
//             <div className="hidden md:block overflow-x-auto">
//               <table className="w-full text-sm">
//                 <thead>
//                   <tr className="bg-slate-50 border-b border-slate-100">
//                     {['Customer', 'Status', 'Total', 'Date'].map((h) => (
//                       <th key={h} className="px-6 py-3.5 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">{h}</th>
//                     ))}
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-slate-50">
//                   {recentOrders.slice(0, 5).map((o, i) => (
//                     <tr key={o._id || i}
//                       className="hover:bg-slate-50/80 transition-colors cursor-pointer"
//                       onClick={() => navigate(`/admin/orders/${o._id}`)}>
//                       <td className="px-6 py-4 font-medium text-slate-800">
//                         {o?.user?.name || o?.user?.email || o?.userId?.name || '—'}
//                       </td>
//                       <td className="px-6 py-4">
//                         <span className={`inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full border ${STATUS_COLORS[o.status] || 'bg-slate-50 text-slate-600 border-slate-100'}`}>
//                           {o.status}
//                         </span>
//                       </td>
//                       <td className="px-6 py-4 font-bold text-[#C5A059]">₹{Number(o.totalAmount ?? 0).toLocaleString()}</td>
//                       <td className="px-6 py-4 text-slate-500 text-xs font-mono">
//                         {o.createdAt ? new Date(o.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>

//             {/* Mobile Cards */}
//             <div className="md:hidden divide-y divide-slate-50">
//               {recentOrders.slice(0, 5).map((o, i) => (
//                 <div key={o._id || i}
//                   className="px-4 py-3 hover:bg-slate-50 transition-colors cursor-pointer"
//                   onClick={() => navigate(`/admin/orders/${o._id}`)}>
//                   <div className="flex items-center justify-between mb-1">
//                     <p className="text-slate-800 text-sm font-semibold">{o?.user?.name || o?.user?.email || '—'}</p>
//                     <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${STATUS_COLORS[o.status] || 'bg-slate-50 text-slate-600 border-slate-100'}`}>
//                       {o.status}
//                     </span>
//                   </div>
//                   <div className="flex items-center justify-between">
//                     <p className="text-[#C5A059] font-bold text-sm">₹{Number(o.totalAmount ?? 0).toLocaleString()}</p>
//                     <p className="text-slate-400 font-mono text-xs">
//                       {o.createdAt ? new Date(o.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : '—'}
//                     </p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </>
//         )}
//       </div>

//       {/* Quick Actions */}
//       <div>
//         <p className="font-serif text-lg font-bold text-slate-800 mb-4">Quick Actions</p>
//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//           <Link to="/admin/products"
//             className="block bg-white border border-slate-100 rounded-2xl p-6 hover:border-[#C5A059] hover:shadow-lg hover:shadow-[#C5A059]/10 transition-all duration-300 group">
//             <div className="text-2xl mb-3 group-hover:scale-110 transition-transform duration-200 inline-block">◈</div>
//             <h3 className="font-serif font-bold text-slate-900 text-base mb-1">Manage Products</h3>
//             <p className="text-slate-500 text-xs leading-relaxed">Add, edit, delete, and restore fabric listings.</p>
//           </Link>
//           <Link to="/admin/orders"
//             className="block bg-white border border-slate-100 rounded-2xl p-6 hover:border-[#C5A059] hover:shadow-lg hover:shadow-[#C5A059]/10 transition-all duration-300 group">
//             <div className="text-2xl mb-3 group-hover:scale-110 transition-transform duration-200 inline-block">◎</div>
//             <h3 className="font-serif font-bold text-slate-900 text-base mb-1">Manage Orders</h3>
//             <p className="text-slate-500 text-xs leading-relaxed">View all orders, update status, and download invoices.</p>
//           </Link>
//         </div>
//       </div>
//     </div>
//   )
// }

// // ─── User Dashboard Content ───────────────────────────────────────────────────

// function UserDashboard({ user }) {
//   return (
//     <div>
//       <div className="inline-flex items-center gap-2 bg-white border border-emerald-100 rounded-full px-3 sm:px-4 py-1.5 mb-6 sm:mb-8 shadow-sm">
//         <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
//         <span className="font-mono text-[9px] sm:text-[10px] uppercase tracking-widest text-slate-600 font-semibold">Active Session</span>
//       </div>

//       <p className="text-slate-500 text-sm mb-6 sm:mb-8">Explore our collection of premium fabrics.</p>

//       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
//         <Link to="/products"
//           className="block bg-[#FBF8F3] border border-[#E8DFD0] rounded-2xl p-6 hover:border-[#C5A059] hover:shadow-lg hover:shadow-[#C5A059]/10 transition-all duration-300 group">
//           <div className="text-2xl mb-3 group-hover:scale-110 transition-transform duration-200 inline-block">◎</div>
//           <h3 className="font-serif font-bold text-slate-900 text-base mb-1">Browse Products</h3>
//           <p className="text-slate-500 text-xs leading-relaxed">Explore our full catalogue of fabrics with search and category filters.</p>
//         </Link>
//         <Link to="/orders"
//           className="block bg-white border border-slate-100 rounded-2xl p-6 hover:border-[#C5A059] hover:shadow-lg hover:shadow-[#C5A059]/10 transition-all duration-300 group">
//           <div className="text-2xl mb-3 group-hover:scale-110 transition-transform duration-200 inline-block">⬡</div>
//           <h3 className="font-serif font-bold text-slate-900 text-base mb-1">My Orders</h3>
//           <p className="text-slate-500 text-xs leading-relaxed">View your order history and download invoices.</p>
//         </Link>
//       </div>

//       <div className="mt-6 sm:mt-8 bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
//         <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Account Details</h3>
//         <div className="flex flex-col gap-3 divide-y divide-slate-50">
//           {user?.name  && <Detail label="Name"  value={user.name} />}
//           {user?.email && <Detail label="Email" value={user.email} />}
//           <Detail label="Auth" value="HTTP-only cookie · Secure" mono />
//         </div>
//       </div>
//     </div>
//   )
// }

// function Detail({ label, value, mono }) {
//   return (
//     <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center pt-3 first:pt-0 gap-1 sm:gap-0">
//       <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{label}</span>
//       <span className={`text-sm break-words ${mono ? 'font-mono text-slate-600' : 'text-slate-600'}`}>{value}</span>
//     </div>
//   )
// }

// function getGreeting() {
//   const h = new Date().getHours()
//   if (h < 12) return 'Good morning'
//   if (h < 17) return 'Good afternoon'
//   return 'Good evening'
// }

// // ─── Main ─────────────────────────────────────────────────────────────────────

// export default function DashboardPage() {
//   const { user, logout } = useAuth()
//   const navigate = useNavigate()
//   const [loggingOut,    setLoggingOut]    = useState(false)
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false)
//   const isAdmin = user?.role === 'admin'

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

//   return (
//     <div className="min-h-screen bg-slate-50 text-slate-800 flex">
//       <Sidebar
//         onLogout={handleLogout}
//         loggingOut={loggingOut}
//         user={user}
//         isSidebarOpen={isSidebarOpen}
//         setIsSidebarOpen={setIsSidebarOpen}
//       />

//       {/* Main Content — pl-16 on mobile to clear the icon rail */}
//       <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden pl-16 md:pl-0">
//         {/* Header */}
//         <div className="p-4 md:p-8 flex-shrink-0 bg-slate-50 border-b border-slate-100">
//           <div className="flex items-center gap-3">
//             <div>
//               <p className="font-mono text-[10px] uppercase tracking-widest text-slate-400 font-semibold mb-1">
//                 {isAdmin ? 'Admin Panel' : getGreeting()}
//               </p>
//               <h1 className="font-serif text-2xl md:text-3xl font-bold text-slate-900">
//                 {isAdmin ? `Welcome back, ${user?.name || 'Admin'}` : (user?.name || user?.email || 'Welcome')}
//               </h1>
//             </div>
//           </div>
//         </div>

//         {/* Scrollable Content */}
//         <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6">
//           {isAdmin ? (
//             <AdminDashboard user={user} navigate={navigate} />
//           ) : (
//             <UserDashboard user={user} />
//           )}
//         </div>
//       </main>
//     </div>
//   )
// }

// ====================================

import { useState, useEffect, useRef } from 'react'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getDashboardStats, getMonthlyRevenue, downloadRevenueReport } from '../api/api'
import toast from 'react-hot-toast'

// ─── Sidebar ──────────────────────────────────────────────────────────────────

function Sidebar({ onLogout, loggingOut, user, collapsed, setCollapsed }) {
  const isAdmin = user?.role === 'admin'
  const initial = (user?.name || user?.email || 'U').charAt(0).toUpperCase()
  const location = useLocation()

  const [profileOpen, setProfileOpen] = useState(false)
  const profileRef = useRef(null)

  // Mobile drawer open state
  const [mobileOpen, setMobileOpen] = useState(false)

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
      label: isAdmin ? 'Manage Products' : 'Browse Products',
      href: isAdmin ? '/admin/products' : '/products',
      icon: (
        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
    },
    {
      id: 'orders',
      label: isAdmin ? 'Manage Orders' : 'My Orders',
      href: isAdmin ? '/admin/orders' : '/orders',
      icon: (
        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
    },
    ...(!isAdmin ? [{
      id: 'wishlist',
      label: 'Wishlist',
      href: '/wishlist',
      icon: (
        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
    }] : []),
  ]

  const LogoutIcon = (
    <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
  )

  // Profile Popup Component used by both Desktop and Mobile
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
          {user?.role || 'member'}
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

        {/* Bottom Section: User Info / Profile + Logout */}
        <div className={`border-t border-slate-50 py-4 flex flex-col gap-2 ${collapsed ? 'px-2 items-center' : 'px-4'}`}>
          
          {/* Expanded: Show Name & Email directly */}
          {!collapsed && (
            <div className="px-2 mb-2">
              <p className="font-semibold text-slate-900 text-sm truncate">{user?.name || 'User'}</p>
              {user?.email && <p className="text-xs text-slate-500 truncate mt-0.5">{user.email}</p>}
            </div>
          )}

          {/* Collapsed: Profile Icon with Popup */}
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

          {/* Logout Button */}
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
        {/* Brand + Close */}
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

        {/* Nav */}
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

        {/* Bottom: Profile Icon + Logout stacked */}
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

// ─── Helpers ──────────────────────────────────────────────────────────────────

const STATUS_COLORS = {
  pending:   'bg-amber-50 text-amber-700 border-amber-100',
  confirmed: 'bg-blue-50 text-blue-700 border-blue-100',
  stitching: 'bg-indigo-50 text-indigo-700 border-indigo-100',
  ready:     'bg-purple-50 text-purple-700 border-purple-100',
  delivered: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  cancelled: 'bg-rose-50 text-rose-700 border-rose-100',
}

const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December'
]

const currentYear  = new Date().getFullYear()
const currentMonth = new Date().getMonth() + 1
const YEARS        = [currentYear - 2, currentYear - 1, currentYear]

// ─── Stat Card ────────────────────────────────────────────────────────────────

function StatCard({ label, value, icon, accent }) {
  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-slate-200 transition-all duration-300 group">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${accent || 'bg-slate-50'} group-hover:scale-105 transition-transform duration-300`}>
        <span className="text-2xl">{icon}</span>
      </div>
      <div className="min-w-0">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">{label}</p>
        <p className="font-serif text-2xl font-bold text-slate-800 truncate">{value ?? '—'}</p>
      </div>
    </div>
  )
}

// ─── Revenue Card ─────────────────────────────────────────────────────────────

function RevenueCard({ label, value, highlight }) {
  return (
    <div className={`rounded-2xl p-6 border shadow-sm transition-all duration-300 ${highlight
      ? 'bg-[#C5A059] border-[#C5A059] text-white shadow-[#C5A059]/20'
      : 'bg-white border-slate-100 text-slate-800 hover:shadow-md'}`}>
      <p className={`text-xs font-semibold uppercase tracking-wider mb-2 ${highlight ? 'text-white/80' : 'text-slate-400'}`}>{label}</p>
      <p className={`font-serif text-3xl font-bold ${highlight ? 'text-white' : 'text-slate-900'}`}>
        ₹{Number(value ?? 0).toLocaleString()}
      </p>
    </div>
  )
}

// ─── Admin Dashboard Content ──────────────────────────────────────────────────

function AdminDashboard({ user, navigate }) {
  const [data,        setData]        = useState(null)
  const [loading,     setLoading]     = useState(true)
  const [error,       setError]       = useState('')
  const [selMonth,    setSelMonth]    = useState(currentMonth)
  const [selYear,     setSelYear]     = useState(currentYear)
  const [monthlyData, setMonthlyData] = useState(null)
  const [mLoading,    setMLoading]    = useState(false)
  const [downloading, setDownloading] = useState(false)

  useEffect(() => {
    setLoading(true)
    getDashboardStats()
      .then((r) => setData(r.data?.data || r.data))
      .catch(() => setError('Failed to load dashboard data.'))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    setMLoading(true)
    getMonthlyRevenue(selMonth, selYear)
      .then((r) => setMonthlyData(r.data?.data || r.data))
      .catch(() => {})
      .finally(() => setMLoading(false))
  }, [selMonth, selYear])

  const handleDownload = async () => {
    setDownloading(true)
    try {
      const res = await downloadRevenueReport(selMonth, selYear)
      const url = window.URL.createObjectURL(new Blob([res.data]))
      const a   = document.createElement('a')
      a.href     = url
      a.download = `revenue-${MONTHS[selMonth - 1]}-${selYear}.pdf`
      a.click()
      window.URL.revokeObjectURL(url)
      toast.success('Report downloaded')
    } catch {
      toast.error('Failed to download report')
    } finally {
      setDownloading(false)
    }
  }

  const SELECT_CLS = "w-full sm:w-auto px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-600 font-medium focus:outline-none focus:ring-2 focus:ring-[#C5A059]/20 focus:border-[#C5A059] transition-all cursor-pointer appearance-none pr-10"

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="relative">
          <div className="w-12 h-12 border-4 border-slate-100 rounded-full" />
          <div className="absolute top-0 left-0 w-12 h-12 border-4 border-[#C5A059] rounded-full border-t-transparent animate-spin" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-100 text-red-600 px-6 py-4 rounded-2xl font-medium flex items-center gap-3">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        {error}
      </div>
    )
  }

  const stats          = data?.stats          || {}
  const revenue        = data?.revenue        || {}
  const recentOrders   = data?.recentOrders   || []
  const monthlyRevenue = data?.monthlyRevenue || []

  return (
    <div className="space-y-8 pb-8">
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#C5A059]/10 border border-[#C5A059]/20">
        <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059] animate-pulse" />
        <span className="font-mono text-xs font-semibold uppercase tracking-widest text-[#C5A059]">Administrator</span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard label="Total Orders"    value={stats.totalOrders}     icon="📦" />
        <StatCard label="Pending"         value={stats.pendingOrders}   icon="⏳" accent="bg-amber-50" />
        <StatCard label="Delivered"       value={stats.deliveredOrders} icon="✅" accent="bg-emerald-50" />
        <StatCard label="Users"           value={stats.totalUsers}      icon="👤" accent="bg-blue-50" />
        <StatCard label="Products"        value={stats.totalProducts}   icon="◈"  accent="bg-slate-100" />
        <StatCard label="Fabrics"         value={stats.totalFabrics}    icon="🪡" accent="bg-orange-50" />
      </div>

      <div>
        <h2 className="font-serif text-lg font-bold text-slate-800 mb-4">Revenue Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <RevenueCard label="Total Revenue"   value={revenue.totalRevenue}   highlight />
          <RevenueCard label="Paid Revenue"    value={revenue.paidRevenue} />
          <RevenueCard label="Pending Revenue" value={revenue.pendingRevenue} />
        </div>
      </div>

      <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-serif text-lg font-bold text-slate-800">Monthly Analytics</h2>
            <p className="text-slate-500 text-sm mt-1">Track performance and generate reports.</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <select value={selMonth} onChange={(e) => setSelMonth(Number(e.target.value))} className={SELECT_CLS}>
                {MONTHS.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-slate-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </div>
            </div>
            <div className="relative">
              <select value={selYear} onChange={(e) => setSelYear(Number(e.target.value))} className={SELECT_CLS}>
                {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-slate-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </div>
            </div>
            <button
              onClick={handleDownload}
              disabled={downloading}
              className="flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-900 text-white font-medium text-sm rounded-xl hover:bg-[#C5A059] hover:shadow-lg hover:shadow-[#C5A059]/20 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              {downloading ? 'Downloading...' : 'Download'}
            </button>
          </div>
        </div>

        <div className="p-6 bg-slate-50/50">
          {mLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-2 border-slate-200 border-t-[#C5A059] rounded-full animate-spin" />
            </div>
          ) : monthlyData ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Total Revenue</p>
                <p className="font-serif text-xl font-bold text-slate-800">₹{Number(monthlyData.totalRevenue ?? 0).toLocaleString()}</p>
              </div>
              <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Paid</p>
                <p className="font-serif text-xl font-bold text-emerald-600">₹{Number(monthlyData.paidRevenue ?? 0).toLocaleString()}</p>
              </div>
              <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Pending</p>
                <p className="font-serif text-xl font-bold text-amber-600">₹{Number(monthlyData.pendingRevenue ?? 0).toLocaleString()}</p>
              </div>
            </div>
          ) : null}

          {monthlyRevenue.length > 0 && (
            <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-bold text-slate-700">Year at a Glance</h3>
                <span className="text-xs text-slate-400">Revenue (INR)</span>
              </div>
              <div className="flex items-end gap-2 sm:gap-4 h-40 w-full">
                {monthlyRevenue.map((m) => {
                  const max = Math.max(...monthlyRevenue.map((x) => x.revenue || 0), 1)
                  const pct = Math.max(((m.revenue || 0) / max) * 100, 1)
                  return (
                    <div key={m.month} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                      <div className="relative w-full flex items-end justify-center h-full px-1">
                        <div
                          className="w-full max-w-[40px] bg-slate-100 rounded-t-lg group-hover:bg-[#C5A059] transition-all duration-500 ease-out relative"
                          style={{ height: `${pct}%` }}
                        >
                          <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] font-mono py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none shadow-lg">
                            ₹{Number(m.revenue).toLocaleString()}
                          </div>
                        </div>
                      </div>
                      <span className="font-mono text-[10px] text-slate-400 uppercase font-semibold group-hover:text-[#C5A059] transition-colors">{m.month?.slice(0, 3)}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex items-center justify-between">
          <div>
            <h2 className="font-serif text-lg font-bold text-slate-800">Recent Orders</h2>
            <p className="text-slate-500 text-sm mt-1">Latest transactions across the platform.</p>
          </div>
          <button
            onClick={() => navigate('/admin/orders')}
            className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-600 bg-slate-50 rounded-lg hover:bg-slate-100 hover:text-slate-900 transition-colors"
          >
            View All
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </div>

        {recentOrders.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-slate-400 font-medium">No recent orders found</p>
          </div>
        ) : (
          <>
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    {['Customer', 'Status', 'Total', 'Date'].map((h) => (
                      <th key={h} className="px-6 py-3.5 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {recentOrders.slice(0, 5).map((o, i) => (
                    <tr key={o._id || i}
                      className="hover:bg-slate-50/80 transition-colors cursor-pointer"
                      onClick={() => navigate(`/admin/orders/${o._id}`)}>
                      <td className="px-6 py-4 font-medium text-slate-800">{o?.user?.name || o?.user?.email || o?.userId?.name || '—'}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full border ${STATUS_COLORS[o.status] || 'bg-slate-50 text-slate-600 border-slate-100'}`}>
                          {o.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-bold text-[#C5A059]">₹{Number(o.totalAmount ?? 0).toLocaleString()}</td>
                      <td className="px-6 py-4 text-slate-500 text-xs font-mono">
                        {o.createdAt ? new Date(o.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="md:hidden divide-y divide-slate-50">
              {recentOrders.slice(0, 5).map((o, i) => (
                <div key={o._id || i}
                  className="px-4 py-3 hover:bg-slate-50 transition-colors cursor-pointer"
                  onClick={() => navigate(`/admin/orders/${o._id}`)}>
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-slate-800 text-sm font-semibold">{o?.user?.name || o?.user?.email || '—'}</p>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${STATUS_COLORS[o.status] || 'bg-slate-50 text-slate-600 border-slate-100'}`}>{o.status}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-[#C5A059] font-bold text-sm">₹{Number(o.totalAmount ?? 0).toLocaleString()}</p>
                    <p className="text-slate-400 font-mono text-xs">
                      {o.createdAt ? new Date(o.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : '—'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <div>
        <p className="font-serif text-lg font-bold text-slate-800 mb-4">Quick Actions</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link to="/admin/products"
            className="block bg-white border border-slate-100 rounded-2xl p-6 hover:border-[#C5A059] hover:shadow-lg hover:shadow-[#C5A059]/10 transition-all duration-300 group">
            <div className="text-2xl mb-3 group-hover:scale-110 transition-transform duration-200 inline-block">◈</div>
            <h3 className="font-serif font-bold text-slate-900 text-base mb-1">Manage Products</h3>
            <p className="text-slate-500 text-xs leading-relaxed">Add, edit, delete, and restore fabric listings.</p>
          </Link>
          <Link to="/admin/orders"
            className="block bg-white border border-slate-100 rounded-2xl p-6 hover:border-[#C5A059] hover:shadow-lg hover:shadow-[#C5A059]/10 transition-all duration-300 group">
            <div className="text-2xl mb-3 group-hover:scale-110 transition-transform duration-200 inline-block">◎</div>
            <h3 className="font-serif font-bold text-slate-900 text-base mb-1">Manage Orders</h3>
            <p className="text-slate-500 text-xs leading-relaxed">View all orders, update status, and download invoices.</p>
          </Link>
        </div>
      </div>
    </div>
  )
}

// ─── User Dashboard Content ───────────────────────────────────────────────────

function UserDashboard({ user }) {
  return (
    <div>
      <div className="inline-flex items-center gap-2 bg-white border border-emerald-100 rounded-full px-3 sm:px-4 py-1.5 mb-6 sm:mb-8 shadow-sm">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        <span className="font-mono text-[9px] sm:text-[10px] uppercase tracking-widest text-slate-600 font-semibold">Active Session</span>
      </div>

      <p className="text-slate-500 text-sm mb-6 sm:mb-8">Explore our collection of premium fabrics.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <Link to="/products"
          className="block bg-[#FBF8F3] border border-[#E8DFD0] rounded-2xl p-6 hover:border-[#C5A059] hover:shadow-lg hover:shadow-[#C5A059]/10 transition-all duration-300 group">
          <div className="text-2xl mb-3 group-hover:scale-110 transition-transform duration-200 inline-block">◎</div>
          <h3 className="font-serif font-bold text-slate-900 text-base mb-1">Browse Products</h3>
          <p className="text-slate-500 text-xs leading-relaxed">Explore our full catalogue of fabrics with search and category filters.</p>
        </Link>
        <Link to="/orders"
          className="block bg-white border border-slate-100 rounded-2xl p-6 hover:border-[#C5A059] hover:shadow-lg hover:shadow-[#C5A059]/10 transition-all duration-300 group">
          <div className="text-2xl mb-3 group-hover:scale-110 transition-transform duration-200 inline-block">⬡</div>
          <h3 className="font-serif font-bold text-slate-900 text-base mb-1">My Orders</h3>
          <p className="text-slate-500 text-xs leading-relaxed">View your order history and download invoices.</p>
        </Link>
      </div>

      <div className="mt-6 sm:mt-8 bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Account Details</h3>
        <div className="flex flex-col gap-3 divide-y divide-slate-50">
          {user?.name  && <Detail label="Name"  value={user.name} />}
          {user?.email && <Detail label="Email" value={user.email} />}
          <Detail label="Auth" value="HTTP-only cookie · Secure" mono />
        </div>
      </div>
    </div>
  )
}

function Detail({ label, value, mono }) {
  return (
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center pt-3 first:pt-0 gap-1 sm:gap-0">
      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{label}</span>
      <span className={`text-sm break-words ${mono ? 'font-mono text-slate-600' : 'text-slate-600'}`}>{value}</span>
    </div>
  )
}

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [loggingOut, setLoggingOut] = useState(false)
  const [collapsed,  setCollapsed]  = useState(false)
  const isAdmin = user?.role === 'admin'

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

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex overflow-hidden">
      <Sidebar
        onLogout={handleLogout}
        loggingOut={loggingOut}
        user={user}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />

      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Header */}
        <div className="px-4 md:px-8 py-4 md:py-6 flex-shrink-0 bg-slate-50 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-slate-400 font-semibold mb-1">
                {isAdmin ? 'Admin Panel' : getGreeting()}
              </p>
              <h1 className="font-serif text-2xl md:text-3xl font-bold text-slate-900">
                {isAdmin ? `Welcome back, ${user?.name || 'Admin'}` : (user?.name || user?.email || 'Welcome')}
              </h1>
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6">
          {isAdmin ? (
            <AdminDashboard user={user} navigate={navigate} />
          ) : (
            <UserDashboard user={user} />
          )}
        </div>
      </main>
    </div>
  )
}