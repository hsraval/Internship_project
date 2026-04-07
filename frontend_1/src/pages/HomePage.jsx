// import { useEffect, useRef, useState } from 'react'
// import { useNavigate } from 'react-router-dom'
// import { useAuth } from '../context/AuthContext'
// import { getProducts } from '../api/api'

// // ─── Product Detail Modal ─────────────────────────────────────────────────────

// function ProductModal({ product, onClose }) {
//   const [imgIdx, setImgIdx] = useState(0)

//   useEffect(() => {
//     const handler = (e) => e.key === 'Escape' && onClose()
//     window.addEventListener('keydown', handler)
//     return () => window.removeEventListener('keydown', handler)
//   }, [onClose])

//   if (!product) return null
//   const images = product.images?.length ? product.images : []

//   return (
//     <div
//       className="fixed inset-0 z-50 flex items-center justify-center p-4"
//       onClick={onClose}
//       role="dialog"
//       aria-modal="true"
//     >
//       {/* Blurred backdrop */}
//       <div className="absolute inset-0 bg-[#E8E0D0]/20 backdrop-blur-md" />

//       <div
//         className="relative z-10 w-full max-w-2xl bg-[#E8E0D0] border border-[#6B5F50] rounded-2xl overflow-hidden shadow-2xl animate-fade-up"
//         onClick={(e) => e.stopPropagation()}
//       >
//         {/* Close */}
//         <button
//           onClick={onClose}
//           className="absolute top-4 right-4 z-20 w-8 h-8 flex items-center justify-center rounded-full bg-[#6B5F50]/60 text-[#6B5F50] hover:bg-[#6B5F50] transition-colors"
//           aria-label="Close"
//         >
//           <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//           </svg>
//         </button>

//         <div className="flex flex-col md:flex-row">
//           {/* Images */}
//           <div className="md:w-1/2 bg-[#6B5F50]/10 flex flex-col">
//             <div className="relative h-64 md:h-full min-h-[240px] flex items-center justify-center overflow-hidden">
//               {images.length > 0 ? (
//                 <img
//                   src={images[imgIdx]}
//                   alt={product.name}
//                   className="w-full h-full object-cover"
//                 />
//               ) : (
//                 <div className="flex items-center justify-center w-full h-full text-[#6B5F50]/40">
//                   <svg className="w-16 h-16 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
//                   </svg>
//                 </div>
//               )}
//             </div>
//             {images.length > 1 && (
//               <div className="flex gap-2 p-3 overflow-x-auto bg-[#6B5F50]/10">
//                 {images.map((img, i) => (
//                   <button
//                     key={i}
//                     onClick={() => setImgIdx(i)}
//                     className={`flex-shrink-0 w-14 h-14 rounded-lg overflow-hidden border-2 transition-colors ${
//                       i === imgIdx ? 'border-[#6B5F50]' : 'border-transparent opacity-50 hover:opacity-80'
//                     }`}
//                   >
//                     <img src={img} alt="" className="w-full h-full object-cover" />
//                   </button>
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* Details */}
//           <div className="md:w-1/2 p-6 flex flex-col gap-4 overflow-y-auto max-h-[480px]">
//             {product.category?.name && (
//               <span className="inline-block text-[10px] font-mono uppercase tracking-widest text-[#6B5F50] border border-[#6B5F50] rounded-full px-3 py-1 w-fit">
//                 {product.category.name}
//               </span>
//             )}
//             <h2 className="font-serif text-2xl font-semibold text-[#6B5F50] leading-tight">
//               {product.name}
//             </h2>
//             <p className="text-[#6B5F50] text-2xl font-light">
//               ₹{Number(product.pricePerMeter).toLocaleString()}
//               <span className="text-sm font-normal text-[#6B5F50]/60 ml-1">/ meter</span>
//             </p>
//             {product.description && (
//               <p className="text-[#6B5F50]/70 text-sm leading-relaxed border-t border-[#6B5F50]/40 pt-4">
//                 {product.description}
//               </p>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// // ─── Product Card ─────────────────────────────────────────────────────────────

// function ProductCard({ product, onShowDetails, onOrder }) {
//   const image = product.images?.[0]?.url

//   return (
//     <div className="bg-[#E8E0D0] border border-[#6B5F50]/50 rounded-xl overflow-hidden group hover:border-[#6B5F50]/60 transition-all duration-300 hover:shadow-[0_8px_32px_rgba(107,95,80,0.12)] flex flex-col">
//       {/* Image */}
//       <div className="relative h-52 overflow-hidden bg-[#6B5F50]/10 flex items-center justify-center">
//         {image ? (
//           <img
//             src={image}
//             alt={product.name}
//             className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
//           />
//         ) : (
//           <div className="text-[#6B5F50]/40">
//             <svg className="w-12 h-12 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
//             </svg>
//           </div>
//         )}
//         {product.category?.name && (
//           <span className="absolute top-3 left-3 text-[9px] font-mono uppercase tracking-widest bg-[#6B5F50]/20 text-[#6B5F50] border border-[#6B5F50] rounded-full px-2 py-0.5 backdrop-blur-sm">
//             {product.category.name}
//           </span>
//         )}
//       </div>

//       {/* Info */}
//       <div className="p-4 flex flex-col gap-3 flex-1">
//         <div>
//           <h3 className="font-serif font-semibold text-[#6B5F50] text-base leading-snug line-clamp-2">
//             {product.name}
//           </h3>
//           <p className="text-[#6B5F50] text-lg font-light mt-1">
//             ₹{Number(product.pricePerMeter).toLocaleString()}
//             <span className="text-xs font-normal text-[#6B5F50]/60 ml-1">/m</span>
//           </p>
//         </div>

//         {/* Buttons */}
//         <div className="flex gap-2 mt-auto pt-1">
//           <button
//             onClick={() => onShowDetails(product)}
//             className="flex-1 py-2 text-xs font-mono uppercase tracking-wider border border-[#6B5F50] text-[#6B5F50]/70 rounded-lg hover:border-[#6B5F50] hover:bg-[#6B5F50]/30 transition-all duration-200"
//           >
//             Details
//           </button>
//           <button
//             onClick={() => onOrder(product)}
//             className="flex-1 py-2 text-xs font-mono uppercase tracking-wider bg-[#6B5F50] text-[#E8E0D0] rounded-lg hover:bg-[#6B5F50] hover:text-[#E8E0D0] transition-all duration-200 font-medium"
//           >
//             Order
//           </button>
//         </div>
//       </div>
//     </div>
//   )
// }

// // ─── Main HomePage ────────────────────────────────────────────────────────────

// const NAV_LINKS = [
//   { label: 'Home', id: 'hero' },
//   { label: 'About Us', id: 'about' },
//   { label: 'Products', id: 'products' },
// ]

// export default function HomePage() {
//   const { isAuthenticated } = useAuth()
//   const navigate = useNavigate()

//   const heroRef    = useRef(null)
//   const aboutRef   = useRef(null)
//   const productsRef = useRef(null)
//   const sectionRefs = { hero: heroRef, about: aboutRef, products: productsRef }

//   const [products, setProducts]       = useState([])
//   const [loadingProducts, setLoadingProducts] = useState(true)
//   const [selectedProduct, setSelectedProduct] = useState(null)
//   const [scrolled, setScrolled]       = useState(false)

//   // Scroll shadow on navbar
//   useEffect(() => {
//     const handler = () => setScrolled(window.scrollY > 10)
//     window.addEventListener('scroll', handler)
//     return () => window.removeEventListener('scroll', handler)
//   }, [])

//   // Fetch products for landing
//   useEffect(() => {
//     getProducts({ limit: 8 })
//       .then(({ data }) => setProducts(data.data ?? data.products ?? data ?? []))
//       .catch(() => setProducts([]))
//       .finally(() => setLoadingProducts(false))
//   }, [])

//   const scrollTo = (id) => {
//     sectionRefs[id]?.current?.scrollIntoView({ behavior: 'smooth' })
//   }

//   const handleOrder = (product) => {
//     if (!isAuthenticated) {
//       navigate('/login')
//     } else {
//       alert('Coming soon')
//     }
//   }

//   return (
//     <div className="min-h-screen bg-[#E8E0D0] text-[#6B5F50] font-sans">

//       {/* ── Navbar ── */}
//       <header className={`fixed top-0 inset-x-0 z-40 transition-all duration-300 ${scrolled ? 'bg-[#6B5F50]/10 backdrop-blur-md shadow-[0_1px_0_rgba(107,95,80,0.15)]' : 'bg-transparent'}`}>
//         <nav className="max-w-7xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between gap-6">

//           {/* Brand */}
//           <span className="font-serif text-lg font-semibold text-[#6B5F50] tracking-tight whitespace-nowrap flex-shrink-0">
//             Larkings<span className="text-[#6B5F50]">MensWear</span>
//           </span>

//           {/* Center links */}
//           <div className="hidden md:flex items-center gap-1">
//             {NAV_LINKS.map((l) => (
//               <button
//                 key={l.id}
//                 onClick={() => scrollTo(l.id)}
//                 className="px-4 py-2 text-sm font-mono uppercase tracking-widest text-[#6B5F50]/70 hover:text-[#6B5F50] transition-colors rounded-lg hover:bg-[#6B5F50]/20"
//               >
//                 {l.label}
//               </button>
//             ))}
//           </div>

//           {/* Right CTAs */}
//           <div className="flex items-center gap-2 flex-shrink-0">
//             {isAuthenticated ? (
//               <button
//                 onClick={() => navigate('/dashboard')}
//                 className="px-4 py-2 text-sm font-mono uppercase tracking-wider bg-[#6B5F50] text-[#E8E0D0] rounded-lg hover:bg-[#6B5F50] hover:text-[#E8E0D0] transition-all duration-200"
//               >
//                 Dashboard
//               </button>
//             ) : (
//               <>
//                 <button
//                   onClick={() => navigate('/login')}
//                   className="px-4 py-2 text-sm font-mono uppercase tracking-wider text-[#6B5F50]/70 hover:text-[#6B5F50] transition-colors rounded-lg border border-transparent hover:border-[#6B5F50]"
//                 >
//                   Sign In
//                 </button>
//                 <button
//                   onClick={() => navigate('/register')}
//                   className="px-4 py-2 text-sm font-mono uppercase tracking-wider bg-[#6B5F50] text-[#E8E0D0] rounded-lg hover:bg-[#6B5F50] hover:text-[#E8E0D0] transition-all duration-200"
//                 >
//                   Create Account
//                 </button>
//               </>
//             )}
//           </div>
//         </nav>
//       </header>

//       {/* ── Hero ── */}
//       <section
//         ref={heroRef}
//         id="hero"
//         className="relative min-h-screen flex items-center justify-center overflow-hidden px-4"
//       >
//         {/* Background texture */}
//         <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_#6B5F5022_0%,_transparent_60%)]" />
//         <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_#6B5F500a_0%,_transparent_50%)]" />

//         {/* Decorative lines */}
//         <div className="absolute left-0 top-0 h-full w-px bg-gradient-to-b from-transparent via-[#6B5F50]/30 to-transparent ml-16 hidden xl:block" />
//         <div className="absolute right-0 top-0 h-full w-px bg-gradient-to-b from-transparent via-[#6B5F50]/30 to-transparent mr-16 hidden xl:block" />

//         <div className="relative text-center max-w-4xl mx-auto pt-16">
//           <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-[#6B5F50] mb-6 opacity-80">
//             Est. Since Excellence
//           </p>
//           <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-semibold leading-[1.02] tracking-tight text-[#6B5F50] mb-6">
//             Premium
//             <span className="block text-[#6B5F50] italic font-normal">Tailoring &</span>
//             Fabrics
//           </h1>
//           <p className="text-[#6B5F50]/70 text-base sm:text-lg max-w-xl mx-auto mb-10 leading-relaxed">
//             Handcrafted menswear using finest fabrics sourced from around world. Every stitch tells a story of tradition and precision.
//           </p>
//           <div className="flex flex-wrap items-center justify-center gap-4">
//             <button
//               onClick={() => scrollTo('products')}
//               className="px-8 py-3.5 bg-[#6B5F50] text-[#E8E0D0] font-mono text-sm uppercase tracking-widest rounded-lg hover:bg-[#6B5F50] hover:text-[#E8E0D0] transition-all duration-200 font-semibold"
//             >
//               Explore Fabrics
//             </button>
//             <button
//               onClick={() => scrollTo('about')}
//               className="px-8 py-3.5 border border-[#6B5F50] text-[#6B5F50] font-mono text-sm uppercase tracking-widest rounded-lg hover:border-[#6B5F50] hover:bg-[#6B5F50]/20 transition-all duration-200"
//             >
//               Our Story
//             </button>
//           </div>

//           {/* Scroll cue */}
//           <div className="mt-20 flex flex-col items-center gap-2 opacity-40">
//             <span className="font-mono text-[9px] uppercase tracking-widest text-[#6B5F50]">Scroll</span>
//             <div className="w-px h-10 bg-gradient-to-b from-[#6B5F50] to-transparent" />
//           </div>
//         </div>
//       </section>

//       {/* ── About Us ── */}
//       <section ref={aboutRef} id="about" className="py-28 px-4 bg-[#E8E0D0]">
//         <div className="max-w-6xl mx-auto">
//           <div className="grid md:grid-cols-2 gap-16 items-center">
//             {/* Text */}
//             <div>
//               <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-[#6B5F50] mb-4">Our Story</p>
//               <h2 className="font-serif text-4xl md:text-5xl font-semibold text-[#6B5F50] mb-6 leading-tight">
//                 Crafting Excellence<br />
//                 <span className="text-[#6B5F50] italic font-normal">Since Generations</span>
//               </h2>
//               <div className="space-y-4 text-[#6B5F50]/70 text-sm leading-relaxed">
//                 <p>
//                   Larkings MensWear has been the cornerstone of bespoke tailoring for discerning gentlemen. We combine age-old techniques with contemporary sensibilities to produce garments that stand the test of time.
//                 </p>
//                 <p>
//                   Our fabrics are sourced directly from the finest mills in Italy, England, and India — each selected for its weight, drape, and character. Whether you seek a sharp suiting cloth or a relaxed linen, our curated collection has something for every occasion.
//                 </p>
//                 <p>
//                   Every yard sold from our shop carries our promise: uncompromising quality, honest pricing, and the kind of personal service that only a family-run establishment can provide.
//                 </p>
//               </div>
//             </div>

//             {/* Reviews */}
//             <div className="flex flex-col gap-4">
//               <p className="font-mono text-[10px] uppercase tracking-widest text-[#6B5F50] mb-2">What Our Clients Say</p>
//               {[
//                 { name: 'Rohan M.', review: 'The fabric quality is unlike anything I\'ve found in the city. My tailor was amazed too — worth every rupee.', stars: 5 },
//                 { name: 'Arjun S.', review: 'Ordered 6 meters of their premium wool suiting. Arrived perfectly packaged. The color was exactly as shown.', stars: 5 },
//                 { name: 'Vikram P.', review: 'Knowledgeable staff, honest advice, and a huge variety. Larkings is my go-to for every occasion.', stars: 5 },
//               ].map((r) => (
//                 <div key={r.name} className="bg-[#E8E0D0] border border-[#6B5F50]/50 rounded-xl p-5">
//                   <div className="flex items-center gap-0.5 mb-3">
//                     {Array.from({ length: r.stars }).map((_, i) => (
//                       <svg key={i} className="w-3.5 h-3.5 text-[#6B5F50]" fill="currentColor" viewBox="0 0 20 20">
//                         <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
//                       </svg>
//                     ))}
//                   </div>
//                   <p className="text-[#6B5F50]/70 text-sm leading-relaxed mb-3 italic">"{r.review}"</p>
//                   <p className="font-mono text-[10px] uppercase tracking-widest text-[#6B5F50]">{r.name}</p>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* ── Products ── */}
//       <section ref={productsRef} id="products" className="py-28 px-4 bg-[#E8E0D0]">
//         <div className="max-w-7xl mx-auto">
//           <div className="text-center mb-14">
//             <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-[#6B5F50] mb-4">Our Collection</p>
//             <h2 className="font-serif text-4xl md:text-5xl font-semibold text-[#6B5F50] leading-tight">
//               Finest Fabrics
//             </h2>
//             <p className="text-[#6B5F50]/70 text-sm mt-3 max-w-md mx-auto">
//               Select from our premium range of handpicked fabrics, priced per meter.
//             </p>
//           </div>

//           {loadingProducts ? (
//             <div className="flex items-center justify-center py-20">
//               <div className="w-8 h-8 border-2 border-[#6B5F50] border-t-[#6B5F50] rounded-full animate-spin" />
//             </div>
//           ) : products.length === 0 ? (
//             <div className="text-center py-20 text-[#6B5F50]/40">
//               <p className="font-mono text-sm uppercase tracking-widest">No products available</p>
//             </div>
//           ) : (
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//               {products.map((p) => (
//                 <ProductCard
//                   key={p._id}
//                   product={p}
//                   onShowDetails={setSelectedProduct}
//                   onOrder={handleOrder}
//                 />
//               ))}
//             </div>
//           )}

//           {/* View all */}
//           {!isAuthenticated && products.length > 0 && (
//             <div className="text-center mt-12">
//               <button
//                 onClick={() => navigate('/login')}
//                 className="px-8 py-3 border border-[#6B5F50] text-[#6B5F50] font-mono text-xs uppercase tracking-widest rounded-lg hover:border-[#6B5F50] hover:bg-[#6B5F50]/20 transition-all"
//               >
//                 Sign in to browse all products
//               </button>
//             </div>
//           )}
//           {isAuthenticated && (
//             <div className="text-center mt-12">
//               <button
//                 onClick={() => navigate('/products')}
//                 className="px-8 py-3 border border-[#6B5F50] text-[#6B5F50] font-mono text-xs uppercase tracking-widest rounded-lg hover:border-[#6B5F50] hover:bg-[#6B5F50]/20 transition-all"
//               >
//                 View Full Catalogue →
//               </button>
//             </div>
//           )}
//         </div>
//       </section>

//       {/* ── Footer ── */}
//       <footer className="py-10 px-4 border-t border-[#6B5F50]/40 bg-[#E8E0D0]">
//         <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
//           <span className="font-serif text-base text-[#6B5F50]">
//             Larkings<span className="text-[#6B5F50]">MensWear</span>
//           </span>
//           <p className="font-mono text-[10px] uppercase tracking-widest text-[#6B5F50]">
//             Premium Tailoring · Est. Since Excellence
//           </p>
//         </div>
//       </footer>

//       {/* ── Product Detail Modal ── */}
//       {selectedProduct && (
//         <ProductModal
//           product={selectedProduct}
//           onClose={() => setSelectedProduct(null)}
//         />
//       )}
//     </div>
//   )
// }

// ===================================================3

import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getProducts } from '../api/api'

// ─── Styles for Custom Animations ─────────────────────────────────────────────
const styleSheet = document.createElement("style");
styleSheet.innerText = `
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fade-up {
    animation: fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }
  
  .delay-100 { animation-delay: 100ms; }
  .delay-200 { animation-delay: 200ms; }
  .delay-300 { animation-delay: 300ms; }

  /* Custom Scrollbar */
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: #E8E0D0; }
  ::-webkit-scrollbar-thumb { background: #6B5F50; border-radius: 3px; }
  ::-webkit-scrollbar-thumb:hover { background: #6B5F50; }
`;
document.head.appendChild(styleSheet);

// ─── Product Detail Modal ─────────────────────────────────────────────────────

function ProductModal({ product, onClose }) {
  const [imgIdx, setImgIdx] = useState(0)

  useEffect(() => {
    const handler = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  if (!product) return null
  const images = product.images?.length ? product.images : []

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div className="absolute inset-0 bg-[#6B5F50]/20 backdrop-blur-sm" />

      <div
        className="relative z-10 w-full max-w-4xl bg-[#E8E0D0] border border-[#6B5F50]/60 rounded-2xl overflow-hidden shadow-2xl animate-fade-up flex flex-col md:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-10 h-10 flex items-center justify-center rounded-full bg-[#6B5F50]/20 text-[#6B5F50] hover:bg-[#6B5F50] transition-colors"
          aria-label="Close"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Images Section */}
        <div className="md:w-3/5 bg-[#6B5F50]/10 flex flex-col relative group">
          <div className="relative h-80 md:h-[500px] overflow-hidden">
            {images.length > 0 ? (
              <img
                src={images[imgIdx]?.url}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
            ) : (
              <div className="flex items-center justify-center w-full h-full text-[#6B5F50]/40">
                <svg className="w-20 h-20 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}
          </div>
          {images.length > 1 && (
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#6B5F50]/10 to-transparent flex gap-3 overflow-x-auto">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setImgIdx(i)}
                  className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                    i === imgIdx ? 'border-[#6B5F50]' : 'border-transparent opacity-50 hover:opacity-80'
                  }`}
                >
                  <img src={img.url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details Section */}
        <div className="md:w-2/5 p-8 flex flex-col justify-center bg-[#E8E0D0]">
          {product.category?.name && (
            <span className="inline-block text-[10px] font-mono uppercase tracking-[0.2em] text-[#6B5F50] border border-[#6B5F50] rounded-full px-3 py-1 w-fit mb-6">
              {product.category.name}
            </span>
          )}
          <h2 className="font-serif text-3xl md:text-4xl font-semibold text-[#6B5F50] leading-tight mb-2">
            {product.name}
          </h2>
          <div className="w-12 h-1 bg-[#6B5F50]/30 mb-6 rounded-full" />
          
          <p className="text-[#6B5F50] text-3xl font-light mb-8">
            ₹{Number(product.pricePerMeter).toLocaleString()}
            <span className="text-sm font-normal text-[#6B5F50]/60 ml-2">/ meter</span>
          </p>
          
          {product.description && (
            <div className="prose prose-invert prose-sm">
              <p className="text-[#6B5F50]/70 leading-relaxed">
                {product.description}
              </p>
            </div>
          )}

          <div className="mt-auto pt-8">
            <button 
              className="w-full py-4 bg-[#6B5F50] text-[#E8E0D0] font-mono text-xs uppercase tracking-widest rounded-lg hover:bg-[#6B5F50] hover:text-[#E8E0D0] transition-all duration-300 shadow-lg shadow-[#6B5F50]/20"
              onClick={() => onClose()} 
            >
              Close Details
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

  return (
    <div className="group relative bg-[#E8E0D0] border border-[#6B5F50]/30 rounded-2xl overflow-hidden flex flex-col transition-all duration-500 hover:shadow-[0_20px_40px_-15px_rgba(107,95,80,0.12)] hover:-translate-y-1">
      
      <div className="relative h-64 overflow-hidden bg-[#6B5F50]/10">
        {image ? (
          <img
            src={image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full text-[#6B5F50]/40">
            <svg className="w-16 h-16 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        
        {product.category?.name && (
          <span className="absolute top-4 left-4 text-[9px] font-mono uppercase tracking-[0.2em] bg-[#6B5F50]/20 text-[#6B5F50] border border-[#6B5F50] rounded-full px-3 py-1.5 transition-opacity duration-300 opacity-80 group-hover:opacity-100">
            {product.category.name}
          </span>
        )}

        <div className="absolute inset-0 bg-[#6B5F50]/60 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
          <button
            onClick={() => onShowDetails(product)}
            className="px-6 py-2.5 bg-[#E8E0D0] text-[#6B5F50] text-xs font-mono uppercase tracking-widest rounded-lg hover:bg-[#6B5F50] hover:text-[#E8E0D0] transition-colors transform translate-y-4 group-hover:translate-y-0 duration-300 delay-75"
          >
            View
          </button>
          <button
            onClick={() => onOrder(product)}
            className="px-6 py-2.5 border border-[#6B5F50] text-[#6B5F50] text-xs font-mono uppercase tracking-widest rounded-lg hover:bg-[#6B5F50] hover:text-[#E8E0D0] transition-colors transform translate-y-4 group-hover:translate-y-0 duration-300 delay-100"
          >
            Order
          </button>
        </div>
      </div>

      <div className="p-5 flex flex-col flex-1 relative bg-[#E8E0D0] z-10">
        <div className="mb-auto">
          <h3 className="font-serif font-semibold text-[#6B5F50] text-lg leading-tight mb-2 line-clamp-2 group-hover:text-[#6B5F50] transition-colors">
            {product.name}
          </h3>
          <div className="flex items-baseline gap-2">
            <p className="text-[#6B5F50] text-xl font-light">
              ₹{Number(product.pricePerMeter).toLocaleString()}
            </p>
            <span className="text-[10px] text-[#6B5F50] font-mono uppercase">/ meter</span>
          </div>
        </div>
        <div className="mt-4 h-[1px] w-full bg-gradient-to-r from-[#6B5F50]/30 to-transparent group-hover:from-[#6B5F50]/50 transition-colors duration-300" />
      </div>
    </div>
  )
}

// ─── Dropdown Menu Component ───────────────────────────────────────────────────

function UserMenu({ isAuthenticated, navigate }) {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-4 py-2 text-sm font-mono uppercase tracking-widest text-[#6B5F50]/70 hover:text-[#6B5F50] border border-[#6B5F50]/30 rounded-lg hover:border-[#6B5F50]/50 hover:bg-[#6B5F50]/10 transition-all duration-300"
      >
        <span>Client Area</span>
        <svg 
          className={`w-3 h-3 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-56 bg-[#E8E0D0] border border-[#6B5F50] rounded-xl shadow-2xl overflow-hidden animate-fade-up z-50">
          {isAuthenticated ? (
            <div className="py-1">
              <button
                onClick={() => { navigate('/dashboard'); setIsOpen(false) }}
                className="block w-full text-left px-5 py-3 text-sm font-mono text-[#6B5F50] hover:bg-[#6B5F50]/10 hover:text-[#6B5F50] transition-colors border-b border-[#6B5F50]/20"
              >
                Dashboard
              </button>
              <button
                onClick={() => { navigate('/profile'); setIsOpen(false) }}
                className="block w-full text-left px-5 py-3 text-sm font-mono text-[#6B5F50]/70 hover:bg-[#6B5F50]/10 hover:text-[#6B5F50] transition-colors"
              >
                My Profile
              </button>
              <button
                onClick={() => { navigate('/logout'); setIsOpen(false) }}
                className="block w-full text-left px-5 py-3 text-sm font-mono text-red-400/80 hover:bg-[#6B5F50]/10 hover:text-red-400 transition-colors"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="py-1">
              <button
                onClick={() => { navigate('/login'); setIsOpen(false) }}
                className="block w-full text-left px-5 py-3 text-sm font-mono text-[#6B5F50] hover:bg-[#6B5F50]/10 hover:text-[#6B5F50] transition-colors border-b border-[#6B5F50]/20"
              >
                Sign In
              </button>
              <button
                onClick={() => { navigate('/register'); setIsOpen(false) }}
                className="block w-full text-left px-5 py-3 text-sm font-mono text-[#6B5F50] hover:bg-[#6B5F50]/10 hover:text-[#6B5F50] transition-colors font-semibold"
              >
                Create Account
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Main HomePage ────────────────────────────────────────────────────────────

const NAV_LINKS = [
  { label: 'Home', id: 'hero' },
  { label: 'Story', id: 'about' },
  { label: 'Fabrics', id: 'products' },
]

export default function HomePage() {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const heroRef    = useRef(null)
  const aboutRef   = useRef(null)
  const productsRef = useRef(null)
  const sectionRefs = { hero: heroRef, about: aboutRef, products: productsRef }

  const [products, setProducts]       = useState([])
  const [loadingProducts, setLoadingProducts] = useState(true)
  const [selectedProduct, setSelectedProduct] = useState(null)
  // const [scrolled, setScrolled]       = useState(false)

  // Fetch products
  useEffect(() => {
    getProducts({ limit: 8 })
      .then(({ data }) => setProducts(data.data ?? data.products ?? data ?? []))
      .catch(() => setProducts([]))
      .finally(() => setLoadingProducts(false))
  }, [])

  const scrollTo = (id) => {
    sectionRefs[id]?.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleOrder = (product) => {
    if (!isAuthenticated) {
      navigate('/login')
    } else {
      alert('Order system coming soon.')
    }
  }

  return (
    <div className="min-h-screen bg-[#E8E0D0] text-[#6B5F50] font-sans selection:bg-[#6B5F50] selection:text-[#E8E0D0]">

      {/* ── Navbar (Fixed Width Fixed) ── */}
      <header className="fixed top-0 inset-x-0 z-40 bg-[#6B5F50]/10 backdrop-blur-md">
        <nav className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between min-h-[64px]">
          
          {/* Brand */}
          <button 
            onClick={() => scrollTo('hero')}
            className="group flex items-center gap-1"
          >
            <span className="font-serif text-xl md:text-2xl font-bold text-[#6B5F50] tracking-tight group-hover:text-[#6B5F50] transition-colors">
              Larkings
            </span>
            <span className="font-serif text-sm md:text-base font-normal text-[#6B5F50] group-hover:text-[#6B5F50] transition-colors">
              MensWear
            </span>
          </button>

          {/* Center Links (Desktop) */}
          <div className="hidden lg:flex items-center gap-8">
            {NAV_LINKS.map((l) => (
              <button
                key={l.id}
                onClick={() => scrollTo(l.id)}
                className="relative px-2 py-2 text-xs font-mono uppercase tracking-[0.2em] text-[#6B5F50]/70 hover:text-[#6B5F50] transition-colors group"
              >
                {l.label}
                {/* Animated Underline */}
                <span className="absolute bottom-1 left-0 w-0 h-[1px] bg-[#6B5F50] transition-all duration-300 ease-out group-hover:w-full"></span>
              </button>
            ))}
          </div>

          {/* Right Menu */}
          <div className="flex items-center">
            <UserMenu isAuthenticated={isAuthenticated} navigate={navigate} />
          </div>
        </nav>
      </header>

      {/* ── Hero ── */}
      <section
        ref={heroRef}
        id="hero"
        className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20" // pt-20 to avoid navbar overlap
      >
        <div className="absolute inset-0 bg-[#E8E0D0]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,_#6B5F5022_0%,_transparent_50%)] opacity-40" />
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#6B5F50] rounded-full mix-blend-overlay filter blur-[120px] opacity-[0.03]" />
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#6B5F50] rounded-full mix-blend-overlay filter blur-[100px] opacity-[0.05]" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <p className="font-mono text-[10px] md:text-xs uppercase tracking-[0.4em] text-[#6B5F50] mb-6 animate-fade-up opacity-0" style={{animationDelay: '100ms', animationFillMode: 'forwards'}}>
            Est. 2024 — Excellence in Threads
          </p>
          
          {/* Adjusted Font Sizes */}
          <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-semibold leading-[1.1] tracking-tight text-[#6B5F50] mb-8 animate-fade-up opacity-0" style={{animationDelay: '200ms', animationFillMode: 'forwards'}}>
            The Art of <br />
            <span className="text-[#6B5F50] italic font-normal">Tailoring</span>
          </h1>
          
          <p className="text-[#6B5F50]/70 text-base md:text-lg max-w-xl mx-auto mb-12 leading-relaxed font-light animate-fade-up opacity-0" style={{animationDelay: '300ms', animationFillMode: 'forwards'}}>
            Curating world's finest fabrics for modern gentleman. 
            Experience the intersection of tradition and contemporary style.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-5 animate-fade-up opacity-0" style={{animationDelay: '400ms', animationFillMode: 'forwards'}}>
            <button
              onClick={() => scrollTo('products')}
              className="px-10 py-4 bg-[#6B5F50] text-[#E8E0D0] font-mono text-xs uppercase tracking-[0.2em] rounded-sm hover:bg-[#6B5F50] hover:text-[#E8E0D0] transition-all duration-300 shadow-[0_0_20px_rgba(107,95,80,0.2)]"
            >
              Explore Collection
            </button>
            <button
              onClick={() => scrollTo('about')}
              className="px-10 py-4 border border-[#6B5F50]/50 text-[#6B5F50] font-mono text-xs uppercase tracking-[0.2em] rounded-sm hover:border-[#6B5F50] hover:text-[#6B5F50] transition-all duration-300 backdrop-blur-sm"
            >
              Our Heritage
            </button>
          </div>
        </div>

        {/* Scroll Indicator */}
        {/* <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 opacity-40 animate-fade-up" style={{animationDelay: '1000ms', animationFillMode: 'forwards'}}>
          <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-[#6B5F50]">Scroll</span>
          <div className="w-[1px] h-12 bg-gradient-to-b from-[#6B5F50] to-transparent" />
        </div> */}
      </section>

      {/* ── About Us ── */}
      <section ref={aboutRef} id="about" className="py-24 px-6 bg-[#E8E0D0] border-t border-[#6B5F50]/10 -mt-20 relative z-20">
          <div className="space-y-8">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-[#6B5F50] mb-4">The Story</p>
              <h2 className="font-serif text-3xl md:text-4xl font-semibold text-[#6B5F50] leading-tight">
                Crafting Excellence<br />
                <span className="text-[#6B5F50] italic font-normal text-2xl md:text-3xl">Since Generations</span>
              </h2>
            </div>
            
            <div className="space-y-6 text-[#6B5F50]/70 text-sm leading-relaxed font-light border-l-2 border-[#6B5F50]/30 pl-6">
              <p>
                Larkings MensWear stands as a testament to the timeless art of bespoke tailoring. We don't just sell fabric; we provide a canvas for your personal expression.
              </p>
              <p>
                Our curated selection ranges from the lush mills of Biella, Italy to the historic weavers of Yorkshire. Each meter is inspected for weight, drape, and character.
              </p>
              <p>
                We believe that true luxury lies in the details—the touch of fine wool, the sheen of silk, and the perfect fit that only comes from quality materials.
              </p>
            </div>
          </div>

          <div className="grid gap-5">
            <p className="font-mono text-[10px] uppercase tracking-widest text-[#6B5F50] mb-2">Client Testimonials</p>
            
            {[
              { name: 'Aditya K.', review: 'The texture of the Italian wool is unmatched. Larkings is the only place I trust for my suits.', stars: 5 },
              { name: 'Rahul M.', review: 'Professional, exquisite taste, and fabrics that speak for themselves. Highly recommended.', stars: 5 },
              { name: 'Vikram P.', review: 'From ordering to delivery, the experience was seamless. The linen collection is a must-see.', stars: 5 },
            ].map((r, i) => (
              <div key={i} className="bg-[#E8E0D0] p-6 rounded-xl border border-[#6B5F50]/20 hover:border-[#6B5F50]/30 transition-colors duration-300">
                <div className="flex items-center gap-1 mb-3 text-[#6B5F50]">
                  {Array.from({ length: r.stars }).map((_, i) => (
                    <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-[#6B5F50] text-sm leading-relaxed mb-4 font-serif italic">"{r.review}"</p>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-[#6B5F50]/50" />
                  <p className="font-mono text-[10px] uppercase tracking-widest text-[#6B5F50]">{r.name}</p>
                </div>
              </div>
            ))}
          </div>

        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-[#6B5F50] mb-4">Curated Fabrics</p>
              <h2 className="font-serif text-3xl md:text-4xl font-semibold text-[#6B5F50] leading-tight">
                The Collection
              </h2>
            </div>
            <div className="hidden md:block w-32 h-[1px] bg-[#6B5F50] mb-2" />
          </div>

          {loadingProducts ? (
            <div className="flex items-center justify-center py-32">
              <div className="relative w-12 h-12">
                <div className="absolute inset-0 border-2 border-[#6B5F50]/20 rounded-full" />
                <div className="absolute inset-0 border-2 border-t-[#6B5F50] border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin" />
              </div>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-32 border border-dashed border-[#6B5F50]/30 rounded-2xl">
              <p className="font-mono text-sm uppercase tracking-widest text-[#6B5F50]">Collection coming soon</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {products.map((p, i) => (
                <div 
                  key={p._id} 
                  className="animate-fade-up opacity-0" 
                  style={{animationDelay: `${i * 100}ms`, animationFillMode: 'forwards'}}
                >
                  <ProductCard
                    product={p}
                    onShowDetails={setSelectedProduct}
                    onOrder={handleOrder}
                  />
                </div>
              ))}
            </div>
          )}

          <div className="mt-16 text-center">
            {!isAuthenticated && products.length > 0 && (
              <div className="p-8 bg-[#E8E0D0] rounded-2xl border border-[#6B5F50]/20 inline-block">
                <p className="text-[#6B5F50]/70 mb-4 font-mono text-xs uppercase tracking-widest">Want to see more?</p>
                <button
                  onClick={() => navigate('/login')}
                  className="px-8 py-3 bg-[#6B5F50] text-[#E8E0D0] font-mono text-xs uppercase tracking-widest rounded-lg hover:bg-[#6B5F50] hover:text-[#E8E0D0] transition-all duration-300"
                >
                  Sign In to View Catalogue
                </button>
              </div>
            )}
            {isAuthenticated && (
              <button
                onClick={() => navigate('/products')}
                className="group inline-flex items-center gap-3 px-8 py-4 border border-[#6B5F50] text-[#6B5F50] font-mono text-xs uppercase tracking-widest rounded-full hover:border-[#6B5F50] hover:bg-[#6B5F50]/5 transition-all duration-300"
              >
                View Full Catalogue
                <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ── Footer (Compact) ── */}
      <footer className="py-10 px-6 border-t border-[#6B5F50]/20 bg-[#E8E0D0]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <span className="block font-serif text-lg text-[#6B5F50] mb-1">
              Larkings<span className="text-[#6B5F50]">MensWear</span>
            </span>
            <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-[#6B5F50]">
              Premium Fabrics & Bespoke Tailoring
            </p>
          </div>
          
          <div className="flex gap-6">
            {['Instagram', 'Facebook', 'Twitter'].map(social => (
              <a key={social} href="#" className="text-[10px] font-mono uppercase tracking-widest text-[#6B5F50] hover:text-[#6B5F50] transition-colors">
                {social}
              </a>
            ))}
          </div>
        </div>
        <div className="mt-8 text-center border-t border-[#6B5F50]/10 pt-6">
           <p className="text-[10px] text-[#6B5F50]/50 font-mono"> 2024 Larkings MensWear. All rights reserved.</p>
        </div>
      </footer>

      {/* ── Product Detail Modal ── */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  )
}