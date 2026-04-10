// import { useEffect, useState, useCallback } from 'react'
// import { Link, useNavigate } from 'react-router-dom'
// import { useAuth } from '../context/AuthContext'
// import { useWishlist } from '../context/WishlistContext'
// import { getProducts, getCategories } from '../api/api'
// import toast from 'react-hot-toast'
// import OrderForm from '../components/OrderForm'
// import WishlistButton from '../components/WishlistButton'

// // ─── Product Detail Modal ─────────────────────────────────────────────────────

// function ProductModal({ product, onClose, onOrder }) {
//   const [imgIdx, setImgIdx] = useState(0)

//   useEffect(() => {
//     const h = (e) => e.key === 'Escape' && onClose()
//     window.addEventListener('keydown', h)
//     return () => window.removeEventListener('keydown', h)
//   }, [onClose])

//   const images = product.images ?? []

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
//       <div className="absolute inset-0 bg-[#0F172A]/20 backdrop-blur-md" />
//       <div
//         className="relative z-10 w-full max-w-2xl bg-[#FFFFFF] border border-[#CBD5E1] rounded-2xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col"
//         onClick={(e) => e.stopPropagation()}
//       >
//         <button
//           onClick={onClose}
//           className="absolute top-4 right-4 z-20 w-8 h-8 flex items-center justify-center rounded-full bg-[#0F172A]/60 text-[#FFFFFF] hover:bg-[#333333] md:top-4 md:right-4"
//         >
//           <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//           </svg>
//         </button>
        
//         {/* Mobile: Stack vertically, Desktop: Side by side */}
//         <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
//           {/* Image Section */}
//           <div className="md:w-1/2 bg-[#F8F9FA]/10 flex flex-col min-h-0">
//             <div className="relative h-48 sm:h-56 md:h-72 flex items-center justify-center overflow-hidden">
//               {images.length > 0 ? (
//                 <img src={images[imgIdx]?.url ?? images[imgIdx]} alt={product.name} className="w-full h-full object-cover" />
//               ) : (
//                 <div className="text-[#64748B]/40">
//                   <svg className="w-12 h-12 sm:w-16 sm:h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
//                   </svg>
//                 </div>
//               )}
//             </div>
//             {images.length > 1 && (
//               <div className="flex gap-2 p-2 sm:p-3 overflow-x-auto bg-[#F8F9FA]/10">
//                 {images.map((img, i) => (
//                   <button key={i} onClick={() => setImgIdx(i)}
//                     className={`flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-lg overflow-hidden border-2 transition-colors ${i === imgIdx ? 'border-[#C5A059]' : 'border-transparent opacity-50'}`}>
//                     <img src={img?.url ?? img} alt="" className="w-full h-full object-cover" />
//                   </button>
//                 ))}
//               </div>
//             )}
//           </div>
          
//           {/* Content Section */}
//           <div className="md:w-1/2 p-4 sm:p-6 flex flex-col gap-3 sm:gap-4 overflow-y-auto flex-1">
//             {product.category?.name && (
//               <div className="inline-flex items-center">
//                 <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.15em] bg-gradient-to-r from-[#C5A059] to-[#0F172A] text-white rounded-full px-3 sm:px-4 py-1 sm:py-1.5 shadow-lg shadow-[#C5A059]/25 backdrop-blur-sm font-semibold">
//                   {product.category.name}
//                 </span>
//               </div>
//             )}
//             <h2 className="font-serif text-xl sm:text-2xl font-semibold text-[#0F172A] leading-tight">{product.name}</h2>
//             <p className="text-[#C5A059] text-xl sm:text-2xl font-light">
//               ${Number(product.pricePerMeter).toLocaleString()}
//               {/* <span className="text-xs sm:text-sm text-[#64748B]/60 ml-1">/ meter</span> */}
//             </p>
//             {product.description && (
//               <p className="text-[#64748B]/70 text-sm leading-relaxed border-t border-[#CBD5E1] pt-3 sm:pt-4">
//                 {product.description}
//               </p>
//             )}
//             <button
//               onClick={() => { onOrder(product); onClose() }}
//               className="mt-auto py-2.5 sm:py-3 bg-[#C5A059] text-[#FFFFFF] rounded-lg font-mono text-xs sm:text-sm uppercase tracking-widest hover:bg-[#0F172A] hover:text-[#FFFFFF] transition-all font-semibold"
//             >
//               Order
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// // ─── Product Card ─────────────────────────────────────────────────────────────

// function ProductCard({ product, onShowDetails, onOrder }) {
//   const image = product.images?.[0]?.url
//   const { isInWishlist } = useWishlist()
//   const wishlisted = isInWishlist(product._id)
  
//   return (
//     <div className="bg-[#FFFFFF] border border-[#CBD5E1]/50 rounded-xl overflow-hidden group hover:border-[#C5A059] hover:shadow-[0_8px_32px_rgba(197,165,2,0.1)] transition-all duration-300 flex flex-col">
//       <div className="relative h-48 bg-[#F8F9FA]/10 flex items-center justify-center overflow-hidden">
//         {image ? (
//           <img src={image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
//         ) : (
//           <svg className="w-10 h-10 text-[#64748B]/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
//           </svg>
//         )}
//         {product.category?.name && (
//           <div className="absolute top-3 left-3 z-10">
//             <span className="inline-flex items-center text-[10px] font-mono uppercase tracking-[0.15em] bg-gradient-to-r from-[#C5A059] to-[#0F172A] text-white rounded-full px-3 py-1.5 shadow-lg shadow-[#C5A059]/25 backdrop-blur-sm font-semibold">
//               {product.category.name}
//             </span>
//           </div>
//         )}
//       </div>
//       <div className="p-4 flex flex-col gap-3 flex-1">
//         <div>
//           <h3 className="font-serif font-semibold text-[#0F172A] text-sm leading-snug line-clamp-2">{product.name}</h3>
//           <p className="text-[#C5A059] text-base font-light mt-1">
//             ₹{Number(product.pricePerMeter).toLocaleString()}
//             {/* <span className="text-xs text-[#64748B]/60 ml-1">/m</span> */}
//           </p>
//         </div>
//         <div className="flex gap-2 mt-auto">
//           <button
//             onClick={() => {
//               const wishlistBtn = document.querySelector(`[data-product-wishlist="${product._id}"] button`)
//               wishlistBtn?.click()
//             }}
//             className={`px-3 py-2 border text-[10px] font-mono uppercase tracking-wider rounded-lg transition-all flex items-center justify-center ${
//               wishlisted 
//                 ? 'border-[#C5A059] bg-[#C5A059] text-white hover:bg-[#b08d47]' 
//                 : 'border-[#C5A059] text-[#C5A059] hover:bg-[#C5A059] hover:text-[#FFFFFF]'
//             }`}
//           >
//             <svg className="w-3.5 h-3.5" fill={wishlisted ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
//             </svg>
//           </button>
//           <div data-product-wishlist={product._id} className="hidden">
//             <WishlistButton productId={product._id} />
//           </div>
//           <button onClick={() => onShowDetails(product)}
//             className="flex-1 py-2 text-[10px] font-mono uppercase tracking-wider border border-[#C5A059] text-[#C5A059] bg-[#FFFFFF] rounded-lg hover:border-[#0F172A] hover:bg-[#0F172A] hover:text-[#FFFFFF] transition-all">
//             Details
//           </button>
//           <button onClick={() => onOrder(product)}
//             className="flex-1 py-2 text-[10px] font-mono uppercase tracking-wider bg-[#C5A059] text-[#FFFFFF] rounded-lg hover:bg-[#0F172A] hover:text-[#FFFFFF] transition-all">
//             Order
//           </button>
//         </div>
//       </div>
//     </div>
//   )
// }

// // ─── Main ─────────────────────────────────────────────────────────────────────

// export default function ProductPage() {
//   const { isAuthenticated } = useAuth()
//   const navigate = useNavigate()

//   // Mobile Sidebar State
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false)

//   const [products, setProducts]     = useState([])
//   const [categories, setCategories] = useState([])
//   const [loading, setLoading]       = useState(true)
//   const [search, setSearch]         = useState('')
//   const [category, setCategory]     = useState('')
//   const [isCategoryOpen, setIsCategoryOpen] = useState(false)
//   const [page, setPage]             = useState(1)
//   const [totalPages, setTotalPages] = useState(1)
//   const [selected, setSelected]     = useState(null)
//   const [isTransitioning, setIsTransitioning] = useState(false)
//   const LIMIT = 8

//   // Load categories once
//   useEffect(() => {
//     getCategories()
//       .then(({ data }) => setCategories(data.data ?? []))
//       .catch(() => {})
//   }, [])

//   // Close dropdown when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (isCategoryOpen && !event.target.closest('.category-dropdown')) {
//         setIsCategoryOpen(false)
//       }
//     }

//     document.addEventListener('mousedown', handleClickOutside)
//     return () => document.removeEventListener('mousedown', handleClickOutside)
//   }, [isCategoryOpen])

//   const fetchProducts = useCallback(() => {
//     setLoading(true)
//     const params = { page, limit: LIMIT }
//     if (search.trim()) params.search = search.trim()
//     if (category) params.category = category

//     getProducts(params)
//       .then(({ data }) => {
//         setProducts(data.data ?? data.products ?? data ?? [])
//         if (data.pagination.totalPages) setTotalPages(data.pagination.totalPages)
//         else if (data.total) setTotalPages(Math.ceil(data.total / LIMIT))
//       })
//       .catch(() => toast.error('Failed to load products'))
//       .finally(() => setLoading(false))
//   }, [page, search, category])

//   useEffect(() => { fetchProducts() }, [fetchProducts])

//   // Reset to page 1 on filter change
//   const handleSearch = (val) => { setSearch(val); setPage(1) }
//   const handleCategory = (val) => { setCategory(val); setPage(1) }

//   // Enhanced smooth transition with fade effect
//   const handlePageChange = (newPage) => {
//     if (newPage === page) return
    
//     setIsTransitioning(true)
    
//     // Fade out current content
//     setTimeout(() => {
//       setPage(newPage)
//       window.scrollTo({ top: 0, behavior: 'smooth' })
      
//       // Fade in new content
//       setTimeout(() => {
//         setIsTransitioning(false)
//       }, 150)
//     }, 200)
//   }

//   const handleOrder = (product) => {
//     if (!isAuthenticated) { navigate('/login'); return }
//     navigate(`/order?product=${product._id}`)
//   }

//   return (
//     <div className="min-h-screen bg-[#F8F9FA] text-[#0F172A] flex">
      
//       {/* Mobile Overlay */}
//       {isSidebarOpen && (
//         <div 
//           className="fixed inset-0 bg-black/60 z-40 md:hidden"
//           onClick={() => setIsSidebarOpen(false)}
//         />
//       )}

//       {/* Sidebar */}
//       <aside className={`
//         fixed inset-y-0 left-0 z-50 w-64 bg-[#FFFFFF] border-r border-[#CBD5E1] flex flex-col 
//         transform transition-transform duration-300 ease-in-out
//         ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
//         md:translate-x-0 md:static md:inset-auto 
//       `}>
//         <div className="px-6 py-5 border-b border-[#0F172A]/40 flex justify-between items-center">
//           <Link to="/" className="font-serif text-base font-semibold text-[#0F172A]">
//             Larkings<span className="text-[#C5A059]">MensWear</span>
//           </Link>
//           <button 
//             className="md:hidden text-[#64748B]/70"
//             onClick={() => setIsSidebarOpen(false)}
//           >
//             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
//           </button>
//         </div>
//         <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
//           <Link to="/dashboard"
//             onClick={() => setIsSidebarOpen(false)}
//             className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-mono uppercase tracking-wider text-[#64748B]/70 hover:bg-[#F8F9FA]/20 hover:text-[#333333] transition-all"
//           >
//             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
//             </svg>
//             Dashboard
//           </Link>
//           <Link to="/products"
//             onClick={() => setIsSidebarOpen(false)}
//             className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-mono uppercase tracking-wider bg-[#C5A059] text-[#FFFFFF] transition-all"
//           >
//             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
//             </svg>
//             Products
//           </Link>
//         </nav>
//       </aside>

//       {/* Main Content Wrapper */}
//       <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        
//         {/* Scrollable Header Area */}
//         <div className="p-4 md:p-8 flex-shrink-0">
//           {/* Header */}
//           <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 md:mb-8 gap-4">
//             <div className="flex items-center gap-3">
//               <button 
//                 onClick={() => setIsSidebarOpen(true)}
//                 className="md:hidden p-1 text-[#6B5F50] border border-[#6B5F50] rounded"
//               >
//                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
//               </button>
              
//               <div>
//                 <p className="font-mono text-[10px] uppercase tracking-widest text-[#64748B]/70 mb-1">Collection</p>
//                 <h1 className="font-serif text-2xl md:text-3xl font-semibold text-[#333333]">Browse Fabrics</h1>
//               </div>
//             </div>
//           </div>

//           {/* Filters */}
//           <div className="flex flex-col sm:flex-row gap-3 mb-8">
//             <div className="relative flex-1 min-w-0 w-full">
//               <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B5F50]/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
//               </svg>
//               <input
//                 type="text"
//                 placeholder="Search fabrics…"
//                 value={search}
//                 onChange={(e) => handleSearch(e.target.value)}
//                 className="w-full pl-9 pr-4 py-2.5 bg-[#F8F9FA] border border-[#CBD5E1] rounded-lg text-[#333333] text-sm placeholder-[#94A3B8] focus:outline-none focus:border-[#C5A059] transition-colors font-mono"
//               />
//             </div>
//             <div className="relative w-full sm:w-auto">
//               {/* Custom Dropdown */}
//               <div className="relative category-dropdown">
//                 <button
//                   type="button"
//                   onClick={() => setIsCategoryOpen(!isCategoryOpen)}
//                   className="w-full px-4 pr-10 py-2.5 bg-[#F8F9FA] border border-[#CBD5E1] rounded-lg text-sm text-[#64748B]/70 focus:outline-none focus:border-[#C5A059] transition-colors font-mono appearance-none cursor-pointer text-left flex items-center justify-between"
//                 >
//                   <span className="truncate">{category ? categories.find(c => c._id === category)?.name || 'All Categories' : 'All Categories'}</span>
//                 </button>
//                 <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
//                   <svg className="w-4 h-4 text-[#6B5F50]/70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
//                 </div>
                
//                 {/* Dropdown Options */}
//                 {isCategoryOpen && (
//                   <div className="absolute z-50 w-full mt-1 bg-[#F8F9FA] border border-[#CBD5E1] rounded-lg shadow-lg max-h-60 overflow-y-auto">
//                     <div className="py-1">
//                       <button
//                         type="button"
//                         onClick={() => { handleCategory(''); setIsCategoryOpen(false) }}
//                         className={`w-full px-4 py-2 text-sm text-left font-mono hover:bg-[#F8F9FA]/20 transition-colors truncate ${!category ? 'text-[#333333]' : 'text-[#64748B]/70'}`}
//                       >
//                         All Categories
//                       </button>
//                       {categories.map((c) => (
//                         <button
//                           key={c._id}
//                           type="button"
//                           onClick={() => { handleCategory(c._id); setIsCategoryOpen(false) }}
//                           className={`w-full px-4 py-2 text-sm text-left font-mono hover:bg-[#F8F9FA]/20 transition-colors truncate ${category === c._id ? 'text-[#333333]' : 'text-[#64748B]/70'}`}
//                         >
//                           {c.name}
//                         </button>
//                       ))}
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Scrollable Content Area */}
//         <div className="flex-1 overflow-y-auto px-4 md:px-8 pb-4 relative">
          
//           {/* Transition Overlay */}
//           {isTransitioning && (
//             <div className="absolute inset-0 bg-[#F8F9FA]/80 backdrop-blur-sm z-10 flex items-center justify-center">
//               <div className="w-8 h-8 border-2 border-[#C5A059]/30 border-t-[#C5A059] rounded-full animate-spin" />
//             </div>
//           )}

//           {/* Content with fade transition */}
//           <div className={`transition-opacity duration-200 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
//             {/* Grid */}
//             {loading ? (
//               <div className="flex items-center justify-center py-24">
//                 <div className="w-8 h-8 border-2 border-[#E5E5E5] border-t-[#E5E5E5] rounded-full animate-spin" />
//               </div>
//             ) : products.length === 0 ? (
//               <div className="flex flex-col items-center justify-center py-24 text-[#333333]/50">
//                 <svg className="w-12 h-12 mb-4 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0V5a2 2 0 01-2 2H6a2 2 0 01-2 2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414-2.414A1 1 0 00-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
//                 </svg>
//                 <p className="font-mono text-sm uppercase tracking-widest text-[#333333]/70">No products found</p>
//                 <p className="font-mono text-sm uppercase tracking-widest text-[#64748B]/70">No products found</p>
//                 <p className="font-mono text-sm uppercase tracking-widest">No products found</p>
//               </div>
//             ) : (
//               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
//                 {products.map((p) => (
//                   <ProductCard key={p._id} product={p} onShowDetails={setSelected} onOrder={handleOrder} />
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* Clean Modern Pagination */}
//           {totalPages > 1 && (
//             <div className="flex items-center justify-center gap-1 mt-6 mb-4">
//               {/* Previous Button */}
//               <button
//                 onClick={() => handlePageChange(Math.max(1, page - 1))}
//                 disabled={page === 1}
//                 className={`px-4 py-2 rounded-lg font-mono text-xs uppercase tracking-wider transition-all duration-200 ${
//                   page === 1 
//                     ? 'bg-[#F8F9FA] text-[#CBD5E1]/30 cursor-not-allowed' 
//                     : 'bg-[#C5A059] text-white hover:bg-[#0F172A] active:scale-95'
//                 }`}
//               >
//                 ←
//               </button>

//               {/* Page Numbers */}
//               <div className="flex items-center gap-1">
//                 {Array.from({ length: totalPages }, (_, i) => (
//                   <button
//                     key={i}
//                     onClick={() => handlePageChange(i + 1)}
//                     className={`w-10 h-10 rounded-lg font-mono text-sm transition-all duration-200 ${
//                       page === i + 1
//                         ? 'bg-[#0F172A] text-white font-semibold'
//                         : 'bg-[#FFFFFF] text-[#64748B] hover:bg-[#C5A059] hover:text-white'
//                     }`}
//                   >
//                     {i + 1}
//                   </button>
//                 ))}
//               </div>

//               {/* Next Button */}
//               <button
//                 onClick={() => handlePageChange(Math.min(totalPages, page + 1))}
//                 disabled={page === totalPages}
//                 className={`px-4 py-2 rounded-lg font-mono text-xs uppercase tracking-wider transition-all duration-200 ${
//                   page === totalPages 
//                     ? 'bg-[#F8F9FA] text-[#CBD5E1]/30 cursor-not-allowed' 
//                     : 'bg-[#C5A059] text-white hover:bg-[#0F172A] active:scale-95'
//                 }`}
//               >
//                 →
//               </button>
//             </div>
//           )}
//         </div>
//       </main>

//       {selected && (
//         <ProductModal product={selected} onClose={() => setSelected(null)} onOrder={handleOrder} />
//       )}
//     </div>
//   )
// }

// ===========================================


import { useEffect, useState, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useWishlist } from '../context/WishlistContext'
import { getProducts, getCategories } from '../api/api'
import toast from 'react-hot-toast'
import OrderForm from '../components/OrderForm'
import WishlistButton from '../components/WishlistButton'

// ─── Product Detail Modal ─────────────────────────────────────────────────────

function ProductModal({ product, onClose, onOrder }) {
  const [imgIdx, setImgIdx] = useState(0)

  useEffect(() => {
    const h = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [onClose])

  const images = product.images ?? []

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-[#0F172A]/20 backdrop-blur-md" />
      <div
        className="relative z-10 w-full max-w-2xl bg-[#FFFFFF] border border-[#CBD5E1] rounded-2xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 flex items-center justify-center rounded-full bg-[#0F172A]/60 text-[#FFFFFF] hover:bg-[#333333] md:top-4 md:right-4"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
          {/* Image Section */}
          <div className="md:w-1/2 bg-[#F8F9FA]/10 flex flex-col min-h-0">
            <div className="relative h-48 sm:h-56 md:h-72 flex items-center justify-center overflow-hidden">
              {images.length > 0 ? (
                <img src={images[imgIdx]?.url ?? images[imgIdx]} alt={product.name} className="w-full h-full object-cover" />
              ) : (
                <div className="text-[#64748B]/40">
                  <svg className="w-12 h-12 sm:w-16 sm:h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
            </div>
            {images.length > 1 && (
              <div className="flex gap-2 p-2 sm:p-3 overflow-x-auto bg-[#F8F9FA]/10">
                {images.map((img, i) => (
                  <button key={i} onClick={() => setImgIdx(i)}
                    className={`flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-lg overflow-hidden border-2 transition-colors ${i === imgIdx ? 'border-[#C5A059]' : 'border-transparent opacity-50'}`}>
                    <img src={img?.url ?? img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {/* Content Section */}
          <div className="md:w-1/2 p-4 sm:p-6 flex flex-col gap-3 sm:gap-4 overflow-y-auto flex-1">
            {product.category?.name && (
              <div className="inline-flex items-center">
                <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.15em] bg-gradient-to-r from-[#C5A059] to-[#0F172A] text-white rounded-full px-3 sm:px-4 py-1 sm:py-1.5 shadow-lg shadow-[#C5A059]/25 backdrop-blur-sm font-semibold">
                  {product.category.name}
                </span>
              </div>
            )}
            <h2 className="font-serif text-xl sm:text-2xl font-semibold text-[#0F172A] leading-tight">{product.name}</h2>
            <p className="text-[#C5A059] text-xl sm:text-2xl font-light">
              ₹{Number(product.pricePerMeter).toLocaleString()}
            </p>
            {product.description && (
              <p className="text-[#64748B]/70 text-sm leading-relaxed border-t border-[#CBD5E1] pt-3 sm:pt-4">
                {product.description}
              </p>
            )}
            <button
              onClick={() => { onOrder(product); onClose() }}
              className="mt-auto py-2.5 sm:py-3 bg-[#C5A059] text-[#FFFFFF] rounded-lg font-mono text-xs sm:text-sm uppercase tracking-widest hover:bg-[#0F172A] hover:text-[#FFFFFF] transition-all font-semibold"
            >
              Order
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Product Card ─────────────────────────────────────────────────────────────

function ProductCard({ product, onShowDetails, onOrder }) {
  const image = product.images?.[0]?.url
  const { isInWishlist } = useWishlist()
  const wishlisted = isInWishlist(product._id)
  
  return (
    <div className="bg-[#FFFFFF] border border-[#CBD5E1]/50 rounded-xl overflow-hidden group hover:border-[#C5A059] hover:shadow-[0_8px_32px_rgba(197,165,2,0.1)] transition-all duration-300 flex flex-col">
      <div className="relative h-48 bg-[#F8F9FA]/10 flex items-center justify-center overflow-hidden">
        {image ? (
          <img src={image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <svg className="w-10 h-10 text-[#64748B]/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        )}
        {product.category?.name && (
          <div className="absolute top-3 left-3 z-10">
            <span className="inline-flex items-center text-[10px] font-mono uppercase tracking-[0.15em] bg-gradient-to-r from-[#C5A059] to-[#0F172A] text-white rounded-full px-3 py-1.5 shadow-lg shadow-[#C5A059]/25 backdrop-blur-sm font-semibold">
              {product.category.name}
            </span>
          </div>
        )}
        {/* productType badge — shows "Fabric" tag if type is fabric */}
        {product.productType === 'fabric' && (
          <div className="absolute top-3 right-3 z-10">
            <span className="text-[9px] font-mono uppercase tracking-widest bg-[#0F172A]/70 text-[#C5A059] rounded-full px-2 py-1">
              Fabric
            </span>
          </div>
        )}
      </div>
      <div className="p-4 flex flex-col gap-3 flex-1">
        <div>
          <h3 className="font-serif font-semibold text-[#0F172A] text-sm leading-snug line-clamp-2">{product.name}</h3>
          <p className="text-[#C5A059] text-base font-light mt-1">
            ₹{Number(product.pricePerMeter).toLocaleString()}
          </p>
        </div>
        <div className="flex gap-2 mt-auto">
          <button
            onClick={() => {
              const wishlistBtn = document.querySelector(`[data-product-wishlist="${product._id}"] button`)
              wishlistBtn?.click()
            }}
            className={`px-3 py-2 border text-[10px] font-mono uppercase tracking-wider rounded-lg transition-all flex items-center justify-center ${
              wishlisted 
                ? 'border-[#C5A059] bg-[#C5A059] text-white hover:bg-[#b08d47]' 
                : 'border-[#C5A059] text-[#C5A059] hover:bg-[#C5A059] hover:text-[#FFFFFF]'
            }`}
          >
            <svg className="w-3.5 h-3.5" fill={wishlisted ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
          <div data-product-wishlist={product._id} className="hidden">
            <WishlistButton productId={product._id} />
          </div>
          <button onClick={() => onShowDetails(product)}
            className="flex-1 py-2 text-[10px] font-mono uppercase tracking-wider border border-[#C5A059] text-[#C5A059] bg-[#FFFFFF] rounded-lg hover:border-[#0F172A] hover:bg-[#0F172A] hover:text-[#FFFFFF] transition-all">
            Details
          </button>
          <button onClick={() => onOrder(product)}
            className="flex-1 py-2 text-[10px] font-mono uppercase tracking-wider bg-[#C5A059] text-[#FFFFFF] rounded-lg hover:bg-[#0F172A] hover:text-[#FFFFFF] transition-all">
            Order
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function ProductPage() {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const [products, setProducts]     = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading]       = useState(true)
  const [search, setSearch]         = useState('')
  const [category, setCategory]     = useState('')
  const [productType, setProductType] = useState('')          // ← NEW
  const [isCategoryOpen, setIsCategoryOpen] = useState(false)
  const [isProductTypeOpen, setIsProductTypeOpen] = useState(false)  // ← NEW
  const [page, setPage]             = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [selected, setSelected]     = useState(null)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const LIMIT = 8

  useEffect(() => {
    getCategories()
      .then(({ data }) => setCategories(data.data ?? []))
      .catch(() => {})
  }, [])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isCategoryOpen && !event.target.closest('.category-dropdown')) {
        setIsCategoryOpen(false)
      }
      if (isProductTypeOpen && !event.target.closest('.product-type-dropdown')) {
        setIsProductTypeOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isCategoryOpen, isProductTypeOpen])

  const fetchProducts = useCallback(() => {
    setLoading(true)
    const params = { page, limit: LIMIT }
    if (search.trim()) params.search = search.trim()
    if (category) params.category = category
    if (productType) params.productType = productType        // ← NEW

    getProducts(params)
      .then(({ data }) => {
        setProducts(data.data ?? data.products ?? data ?? [])
        if (data.pagination?.totalPages) setTotalPages(data.pagination.totalPages)
        else if (data.total) setTotalPages(Math.ceil(data.total / LIMIT))
      })
      .catch(() => toast.error('Failed to load products'))
      .finally(() => setLoading(false))
  }, [page, search, category, productType])               // ← productType in deps

  useEffect(() => { fetchProducts() }, [fetchProducts])

  const handleSearch      = (val) => { setSearch(val);      setPage(1) }
  const handleCategory    = (val) => { setCategory(val);    setPage(1) }
  const handleProductType = (val) => { setProductType(val); setPage(1) } // ← NEW

  const handlePageChange = (newPage) => {
    if (newPage === page) return
    setIsTransitioning(true)
    setTimeout(() => {
      setPage(newPage)
      window.scrollTo({ top: 0, behavior: 'smooth' })
      setTimeout(() => setIsTransitioning(false), 150)
    }, 200)
  }

  const handleOrder = (product) => {
    if (!isAuthenticated) { navigate('/login'); return }
    navigate(`/order?product=${product._id}`)
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#0F172A] flex">
      
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/60 z-40 md:hidden" onClick={() => setIsSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-[#FFFFFF] border-r border-[#CBD5E1] flex flex-col 
        transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 md:static md:inset-auto 
      `}>
        <div className="px-6 py-5 border-b border-[#0F172A]/40 flex justify-between items-center">
          <Link to="/" className="font-serif text-base font-semibold text-[#0F172A]">
            Larkings<span className="text-[#C5A059]">MensWear</span>
          </Link>
          <button className="md:hidden text-[#64748B]/70" onClick={() => setIsSidebarOpen(false)}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
          <Link to="/dashboard" onClick={() => setIsSidebarOpen(false)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-mono uppercase tracking-wider text-[#64748B]/70 hover:bg-[#F8F9FA]/20 hover:text-[#333333] transition-all"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Dashboard
          </Link>
          <Link to="/products" onClick={() => setIsSidebarOpen(false)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-mono uppercase tracking-wider bg-[#C5A059] text-[#FFFFFF] transition-all"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            Products
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        
        <div className="p-4 md:p-8 flex-shrink-0">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 md:mb-8 gap-4">
            <div className="flex items-center gap-3">
              <button onClick={() => setIsSidebarOpen(true)} className="md:hidden p-1 text-[#6B5F50] border border-[#6B5F50] rounded">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
              </button>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-[#64748B]/70 mb-1">Collection</p>
                <h1 className="font-serif text-2xl md:text-3xl font-semibold text-[#333333]">Browse Fabrics</h1>
              </div>
            </div>
          </div>

          {/* Filters — search + category + productType */}
          <div className="flex flex-col sm:flex-row gap-3 mb-8">

            {/* Search */}
            <div className="relative flex-1 min-w-0 w-full">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B5F50]/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search fabrics…"
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-[#F8F9FA] border border-[#CBD5E1] rounded-lg text-[#333333] text-sm placeholder-[#94A3B8] focus:outline-none focus:border-[#C5A059] transition-colors font-mono"
              />
            </div>

            {/* Category Dropdown */}
            <div className="relative w-full sm:w-auto">
              <div className="relative category-dropdown">
                <button
                  type="button"
                  onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                  className="w-full px-4 pr-10 py-2.5 bg-[#F8F9FA] border border-[#CBD5E1] rounded-lg text-sm text-[#64748B]/70 focus:outline-none focus:border-[#C5A059] transition-colors font-mono appearance-none cursor-pointer text-left flex items-center justify-between"
                >
                  <span className="truncate">{category ? categories.find(c => c._id === category)?.name || 'All Categories' : 'All Categories'}</span>
                </button>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg className="w-4 h-4 text-[#6B5F50]/70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </div>
                {isCategoryOpen && (
                  <div className="absolute z-50 w-full mt-1 bg-[#F8F9FA] border border-[#CBD5E1] rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    <div className="py-1">
                      <button type="button" onClick={() => { handleCategory(''); setIsCategoryOpen(false) }}
                        className={`w-full px-4 py-2 text-sm text-left font-mono hover:bg-[#F8F9FA]/20 transition-colors truncate ${!category ? 'text-[#333333]' : 'text-[#64748B]/70'}`}>
                        All Categories
                      </button>
                      {categories.map((c) => (
                        <button key={c._id} type="button" onClick={() => { handleCategory(c._id); setIsCategoryOpen(false) }}
                          className={`w-full px-4 py-2 text-sm text-left font-mono hover:bg-[#F8F9FA]/20 transition-colors truncate ${category === c._id ? 'text-[#333333]' : 'text-[#64748B]/70'}`}>
                          {c.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* ── NEW: Product Type Filter ── */}
            <div className="relative w-full sm:w-auto">
              <div className="relative product-type-dropdown">
                <button
                  type="button"
                  onClick={() => setIsProductTypeOpen(!isProductTypeOpen)}
                  className="w-full px-4 pr-10 py-2.5 bg-[#F8F9FA] border border-[#CBD5E1] rounded-lg text-sm text-[#64748B]/70 focus:outline-none focus:border-[#C5A059] transition-colors font-mono appearance-none cursor-pointer text-left flex items-center justify-between"
                >
                  <span className="truncate">{productType === 'product' ? 'Products' : productType === 'fabric' ? 'Fabrics' : 'All Types'}</span>
                </button>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg className="w-4 h-4 text-[#6B5F50]/70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </div>
                
                {/* Dropdown Options */}
                {isProductTypeOpen && (
                  <div className="absolute z-50 w-full mt-1 bg-[#F8F9FA] border border-[#CBD5E1] rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    <div className="py-1">
                      <button
                        type="button"
                        onClick={() => { handleProductType(''); setIsProductTypeOpen(false) }}
                        className={`w-full px-4 py-2 text-sm text-left font-mono hover:bg-[#F8F9FA]/20 transition-colors truncate ${!productType ? 'text-[#333333]' : 'text-[#64748B]/70'}`}
                      >
                        All Types
                      </button>
                      <button
                        type="button"
                        onClick={() => { handleProductType('product'); setIsProductTypeOpen(false) }}
                        className={`w-full px-4 py-2 text-sm text-left font-mono hover:bg-[#F8F9FA]/20 transition-colors truncate ${productType === 'product' ? 'text-[#333333]' : 'text-[#64748B]/70'}`}
                      >
                        Products
                      </button>
                      <button
                        type="button"
                        onClick={() => { handleProductType('fabric'); setIsProductTypeOpen(false) }}
                        className={`w-full px-4 py-2 text-sm text-left font-mono hover:bg-[#F8F9FA]/20 transition-colors truncate ${productType === 'fabric' ? 'text-[#333333]' : 'text-[#64748B]/70'}`}
                      >
                        Fabrics
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-4 md:px-8 pb-4 relative">
          
          {isTransitioning && (
            <div className="absolute inset-0 bg-[#F8F9FA]/80 backdrop-blur-sm z-10 flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-[#C5A059]/30 border-t-[#C5A059] rounded-full animate-spin" />
            </div>
          )}

          <div className={`transition-opacity duration-200 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
            {loading ? (
              <div className="flex items-center justify-center py-24">
                <div className="w-8 h-8 border-2 border-[#E5E5E5] border-t-[#C5A059] rounded-full animate-spin" />
              </div>
            ) : products.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-[#333333]/50">
                <svg className="w-12 h-12 mb-4 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 002 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
                <p className="font-mono text-sm uppercase tracking-widest text-[#64748B]/70">No products found</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {products.map((p) => (
                  <ProductCard key={p._id} product={p} onShowDetails={setSelected} onOrder={handleOrder} />
                ))}
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-1 mt-6 mb-4">
              <button
                onClick={() => handlePageChange(Math.max(1, page - 1))}
                disabled={page === 1}
                className={`px-4 py-2 rounded-lg font-mono text-xs uppercase tracking-wider transition-all duration-200 ${
                  page === 1 ? 'bg-[#F8F9FA] text-[#CBD5E1]/30 cursor-not-allowed' : 'bg-[#C5A059] text-white hover:bg-[#0F172A] active:scale-95'
                }`}
              >←</button>
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => (
                  <button key={i} onClick={() => handlePageChange(i + 1)}
                    className={`w-10 h-10 rounded-lg font-mono text-sm transition-all duration-200 ${
                      page === i + 1 ? 'bg-[#0F172A] text-white font-semibold' : 'bg-[#FFFFFF] text-[#64748B] hover:bg-[#C5A059] hover:text-white'
                    }`}>
                    {i + 1}
                  </button>
                ))}
              </div>
              <button
                onClick={() => handlePageChange(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className={`px-4 py-2 rounded-lg font-mono text-xs uppercase tracking-wider transition-all duration-200 ${
                  page === totalPages ? 'bg-[#F8F9FA] text-[#CBD5E1]/30 cursor-not-allowed' : 'bg-[#C5A059] text-white hover:bg-[#0F172A] active:scale-95'
                }`}
              >→</button>
            </div>
          )}
        </div>
      </main>

      {selected && (
        <ProductModal product={selected} onClose={() => setSelected(null)} onOrder={handleOrder} />
      )}
    </div>
  )
}