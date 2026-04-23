import { useEffect, useRef, useState } from 'react'
import { createProduct, updateProduct } from '../api/api'
import toast from 'react-hot-toast'

const MAX_IMAGES = 5

function validate(values, imageFiles, existingImages, isEdit) {
  const errs = {}
  if (!values.name.trim()) errs.name = 'Name is required'
  if (!values.pricePerMeter || isNaN(values.pricePerMeter) || Number(values.pricePerMeter) <= 0)
    errs.pricePerMeter = 'Enter a valid price'
  if (!values.category) errs.category = 'Select a category'
  const totalImages = (existingImages?.length ?? 0) + imageFiles.length
  if (!isEdit && imageFiles.length === 0) errs.images = 'At least one image is required'
  if (totalImages > MAX_IMAGES) errs.images = `Maximum ${MAX_IMAGES} images allowed`
  return errs
}

export default function ProductForm({ product, categories, onClose, onSaved }) {
  const isEdit = Boolean(product)
  const fileInputRef = useRef(null)
  const categoryButtonRef = useRef(null)
  const typeButtonRef = useRef(null)

  const [values, setValues] = useState({
    name: product?.name ?? '',
    description: product?.description ?? '',
    pricePerMeter: product?.pricePerMeter ?? '',
    category: product?.category?._id ?? product?.category ?? '',
  })
  
  // Safely handle backend sending either {url: "..."} or just a string
  const [existingImages, setExistingImages] = useState(
    product?.images?.map(img => img.url || img) ?? []
  )
  
  const [productType, setProductType] = useState(product?.productType ?? 'product')
  const [errors, setErrors]         = useState({})
  const [imageFiles, setImageFiles] = useState([])     // new File objects
  const [imagePreviews, setImagePreviews] = useState([]) // new image preview URLs
  const [submitting, setSubmitting] = useState(false)
  const [isCategoryOpen, setIsCategoryOpen] = useState(false)
  const [isTypeOpen, setIsTypeOpen] = useState(false)

  // Keyboard close
  useEffect(() => {
    const h = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [onClose])

  // FIX: Clean up object URLs only when the modal completely unmounts to prevent browser cache bugs during edits
  useEffect(() => {
    return () => {
      imagePreviews.forEach((url) => {
        if (url) URL.revokeObjectURL(url)
      })
    }
  }, []) // Empty dependency array ensures this only runs on unmount

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isCategoryOpen && !event.target.closest('.category-dropdown')) {
        setIsCategoryOpen(false)
      }
      if (isTypeOpen && !event.target.closest('.type-dropdown')) {
        setIsTypeOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isCategoryOpen, isTypeOpen])

  const handleChange = (e) => {
    const { name, value } = e.target
    setValues((v) => ({ ...v, [name]: value }))
    setErrors((er) => ({ ...er, [name]: null }))
  }

  const handleCategorySelect = (categoryId) => {
    setValues((v) => ({ ...v, category: categoryId }))
    setErrors((er) => ({ ...er, category: null }))
    setIsCategoryOpen(false)
  }

  const handleTypeSelect = (type) => {
    setProductType(type)
    setIsTypeOpen(false)
  }

  const getCategoryDropdownPosition = () => {
    if (!categoryButtonRef.current) return {}
    const rect = categoryButtonRef.current.getBoundingClientRect()
    return {
      position: 'fixed',
      top: `${rect.bottom + 8}px`,
      left: `${rect.left}px`,
      width: `${rect.width}px`,
      zIndex: 50
    }
  }

  const getTypeDropdownPosition = () => {
    if (!typeButtonRef.current) return {}
    const rect = typeButtonRef.current.getBoundingClientRect()
    return {
      position: 'fixed',
      top: `${rect.bottom + 8}px`,
      left: `${rect.left}px`,
      width: `${rect.width}px`,
      zIndex: 50
    }
  }

  const handleFiles = (e) => {
    const selected = Array.from(e.target.files ?? [])
    const totalAfter = existingImages.length + imageFiles.length + selected.length

    if (totalAfter > MAX_IMAGES) {
      setErrors((er) => ({ ...er, images: `Maximum ${MAX_IMAGES} images allowed` }))
      e.target.value = ''
      return
    }

    const newFiles = [...imageFiles, ...selected]
    setImageFiles(newFiles)
    setImagePreviews(newFiles.map((f) => URL.createObjectURL(f)))
    setErrors((er) => ({ ...er, images: null }))
    e.target.value = ''
  }

  const removeNewImage = (idx) => {
    // We no longer call URL.revokeObjectURL here to prevent edit state bugs.
    // The cleanup useEffect handles it safely when the form closes.
    const files = imageFiles.filter((_, i) => i !== idx)
    const prevs = imagePreviews.filter((_, i) => i !== idx)
    setImageFiles(files)
    setImagePreviews(prevs)
  }

  const removeExistingImage = (idx) => {
    setExistingImages((imgs) => imgs.filter((_, i) => i !== idx))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate(values, imageFiles, existingImages, isEdit)
    if (Object.keys(errs).length) { setErrors(errs); return }

    const fd = new FormData()
    fd.append('name', values.name.trim())
    fd.append('description', values.description.trim())
    fd.append('pricePerMeter', values.pricePerMeter)
    fd.append('category', values.category)
    fd.append('productType', productType)

    existingImages.forEach((url) => fd.append('existingImages', url))
    imageFiles.forEach((f) => fd.append('uploadedImages', f))

    setSubmitting(true)
    try {
      if (isEdit) {
        await updateProduct(product._id, fd)
        toast.success('Product updated')
      } else {
        await createProduct(fd)
        toast.success('Product created')
      }
      onSaved()
    } catch (err) {
      toast.error(err.userMessage || 'Save failed')
    } finally {
      setSubmitting(false)
    }
  }

  const totalImages = existingImages.length + imageFiles.length
  const canAddMore = totalImages < MAX_IMAGES

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-[#0F172A]/20 backdrop-blur-md" />

      <div
        className="relative z-10 w-full max-w-lg bg-[#FFFFFF] border border-[#CBD5E1] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#CBD5E1]/30 flex-shrink-0 bg-gradient-to-r from-[#F8FAFC] via-white to-[#FAFAFA]">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#C5A059] to-[#B8944A] flex items-center justify-center shadow-lg">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-[#C5A059] font-semibold">
                {isEdit ? 'Edit' : 'New'} Item
              </p>
              <h2 className="font-serif text-xl font-bold text-[#0F172A] mt-0.5">
                {isEdit ? product.name : 'Add to Catalogue'}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-[#E2E8F0] text-[#64748B] hover:bg-[#F1F5F9] hover:border-[#C5A059] hover:text-[#C5A059] transition-all duration-200 shadow-sm hover:shadow-md"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate className="overflow-y-auto flex-1 px-6 py-5 flex flex-col gap-5">
          {/* Name */}
          <Field label="Product Name" error={errors.name}>
            <input
              type="text"
              name="name"
              value={values.name}
              onChange={handleChange}
              placeholder="e.g. Italian Wool Suiting"
              className={formInput(errors.name)}
            />
          </Field>

          {/* Description */}
          <Field label="Description" error={errors.description}>
            <textarea
              name="description"
              value={values.description}
              onChange={handleChange}
              placeholder="Fabric composition, texture, ideal use…"
              rows={3}
              className={`${formInput()} resize-none`}
            />
          </Field>

          {/* Price + Category row */}
          <div className="grid grid-cols-2 gap-4">
            <Field label="Price per Meter (₹)" error={errors.pricePerMeter}>
              <input
                type="number"
                name="pricePerMeter"
                value={values.pricePerMeter}
                onChange={handleChange}
                placeholder="e.g. 850"
                min="1"
                step="0.01"
                className={formInput(errors.pricePerMeter)}
              />
            </Field>

            <Field label="Category" error={errors.category}>
              <div className="relative category-dropdown">
                <button
                  ref={categoryButtonRef}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    setIsCategoryOpen(!isCategoryOpen)
                  }}
                  className="relative w-full pl-3 pr-8 py-2.5 text-left bg-white border border-[#E2E8F0] rounded-lg shadow-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#C5A059]/20 focus:border-[#C5A059] text-sm transition-all hover:border-[#CBD5E1]"
                >
                  <span className="block truncate text-[#334155]">
                    {values.category ? categories.find(c => c._id === values.category)?.name || 'Select category…' : 'Select category…'}
                  </span>
                  <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="h-4 w-4 text-[#64748B]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </button>

                {isCategoryOpen && (
                  <div className="rounded-lg bg-white shadow-xl border border-[#E2E8F0] max-h-60 overflow-auto" style={getCategoryDropdownPosition()}>
                    <div className="py-1">
                      {categories.map((c) => (
                        <button
                          key={c._id}
                          type="button"
                          onClick={() => handleCategorySelect(c._id)}
                          className={`w-full text-left px-3 py-2.5 text-sm transition-colors ${values.category === c._id ? 'bg-[#C5A059]/10 text-[#C5A059] font-medium' : 'text-[#334155] hover:bg-[#F8FAFC]'}`}
                        >
                          {c.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Field>
          </div>

          {/* Product Type Dropdown */}
          <Field label="Item Type" hint="Choose if this is a Fabric or a finished Product">
            <div className="relative type-dropdown">
              <button
                ref={typeButtonRef}
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  setIsTypeOpen(!isTypeOpen)
                }}
                className="relative w-full pl-3 pr-8 py-2.5 text-left bg-white border border-[#E2E8F0] rounded-lg shadow-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#C5A059]/20 focus:border-[#C5A059] text-sm transition-all hover:border-[#CBD5E1]"
              >
                <span className="block truncate text-[#334155] flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${productType === 'fabric' ? 'bg-[#C5A059]' : 'bg-[#0F172A]'}`} />
                  {productType === 'fabric' ? 'Fabric (Roll)' : 'Product (Finished)'}
                </span>
                <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="h-4 w-4 text-[#64748B]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </button>

              {isTypeOpen && (
                <div className="rounded-lg bg-white shadow-xl border border-[#E2E8F0] overflow-hidden" style={getTypeDropdownPosition()}>
                  <div className="py-1">
                    <button
                      type="button"
                      onClick={() => handleTypeSelect('product')}
                      className={`w-full text-left px-3 py-2.5 text-sm transition-colors flex items-center gap-2 ${productType === 'product' ? 'bg-[#C5A059]/10 text-[#C5A059] font-medium' : 'text-[#334155] hover:bg-[#F8FAFC]'}`}
                    >
                      <span className="w-2 h-2 rounded-full bg-[#0F172A]" />
                      Product (Finished)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleTypeSelect('fabric')}
                      className={`w-full text-left px-3 py-2.5 text-sm transition-colors flex items-center gap-2 ${productType === 'fabric' ? 'bg-[#C5A059]/10 text-[#C5A059] font-medium' : 'text-[#334155] hover:bg-[#F8FAFC]'}`}
                    >
                      <span className="w-2 h-2 rounded-full bg-[#C5A059]" />
                      Fabric (Roll)
                    </button>
                  </div>
                </div>
              )}
            </div>
          </Field>

          {/* Images */}
          <Field
            label={`Images (${totalImages}/${MAX_IMAGES})`}
            error={errors.images}
            hint={`Upload up to ${MAX_IMAGES} images. Supports JPG, PNG, WebP.`}
          >
            <div className="space-y-4">
              {/* Preview grid */}
              {(existingImages.length > 0 || imagePreviews.length > 0) && (
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
                  {/* Existing images */}
                  {existingImages.map((img, i) => (
                    <div key={`existing-${i}`} className="relative group aspect-square">
                      <div className="w-full h-full rounded-xl overflow-hidden border-2 border-[#E2E8F0] shadow-sm hover:shadow-md transition-all duration-200">
                        <img src={img} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeExistingImage(i)}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-lg hover:bg-red-600 hover:scale-110"
                        aria-label="Remove image"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}

                  {/* New images */}
                  {imagePreviews.map((url, i) => (
                    <div key={`new-${i}`} className="relative group aspect-square">
                      <div className="w-full h-full rounded-xl overflow-hidden border-2 border-[#C5A059]/30 shadow-sm hover:shadow-md transition-all duration-200">
                        <img src={url} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      </div>
                      <div className="absolute top-1 left-1">
                        <span className="text-[8px] bg-gradient-to-r from-[#C5A059] to-[#B8944A] text-white px-2 py-0.5 rounded-full font-mono font-bold shadow-sm">NEW</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeNewImage(i)}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-lg hover:bg-red-600 hover:scale-110"
                        aria-label="Remove image"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Upload button */}
              {canAddMore && (
                <>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="group relative w-full py-4 px-6 border-2 border-dashed border-[#CBD5E1] rounded-xl text-[#64748B] hover:border-[#C5A059] hover:bg-gradient-to-r hover:from-[#F8FAFC] hover:to-[#FAFAFA] hover:text-[#C5A059] transition-all duration-200 text-sm font-mono uppercase tracking-wider flex items-center justify-center gap-3 hover:shadow-md"
                  >
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#F1F5F9] to-[#E2E8F0] group-hover:from-[#C5A059]/10 group-hover:to-[#C5A059]/20 flex items-center justify-center transition-all duration-200">
                      <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="text-left">
                      <div className="font-semibold">Add Images</div>
                      <div className="text-xs opacity-75 normal-case tracking-normal">{MAX_IMAGES - totalImages} slots remaining</div>
                    </div>
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    multiple
                    onChange={handleFiles}
                    className="hidden"
                  />
                </>
              )}
            </div>
          </Field>
        </form>

        {/* Footer */}
        <div className="flex gap-3 px-6 py-5 border-t border-[#E2E8F0]/30 flex-shrink-0 bg-gradient-to-r from-[#FAFAFA] to-white">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 px-4 bg-white border-2 border-[#E2E8F0] text-[#64748B] rounded-xl font-mono text-xs uppercase tracking-wider hover:border-[#C5A059] hover:text-[#C5A059] hover:bg-[#F8FAFC] transition-all duration-200 font-semibold shadow-sm hover:shadow-md hover:-translate-y-0.5"
          >
            <span className="flex items-center justify-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Cancel
            </span>
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={submitting}
            className="flex-1 py-3 px-4 bg-gradient-to-r from-[#C5A059] to-[#B8944A] text-white rounded-xl font-mono text-xs uppercase tracking-wider hover:from-[#0F172A] hover:to-[#1E293B] transition-all duration-200 font-bold disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none disabled:translate-y-0 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
          >
            {submitting ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                {isEdit ? 'Saving…' : 'Creating…'}
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {isEdit ? 'Save Changes' : 'Create Product'}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function Field({ label, error, hint, children }) {
  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label className="font-mono text-[10px] uppercase tracking-widest text-[#475569] font-semibold flex items-center gap-2">
          {label}
          {hint && (
            <span className="text-[8px] text-[#94A3B8] font-normal normal-case tracking-normal">({hint})</span>
          )}
        </label>
      )}
      <div className="relative">
        {children}
      </div>
      {error && (
        <div className="flex items-center gap-2 px-3 py-2 bg-[#FEF2F2] border border-[#FECACA] rounded-lg">
          <svg className="w-4 h-4 text-[#EF4444] flex-shrink-0" viewBox="0 0 12 12" fill="currentColor">
            <path d="M6 1a5 5 0 100 10A5 5 0 006 1zm-.5 2.5h1v3.25h-1V3.5zm0 4.5h1v1h-1V8z" />
          </svg>
          <p className="text-[#EF4444] text-xs font-mono">{error}</p>
        </div>
      )}
    </div>
  )
}

function formInput(error) {
  return `w-full px-4 py-3 bg-gradient-to-r from-white to-[#FAFAFA] border ${error ? 'border-[#EF4444] ring-2 ring-[#EF4444]/20' : 'border-[#E2E8F0]'} rounded-xl text-[#0F172A] text-sm placeholder-[#94A3B8] focus:outline-none focus:border-[#C5A059] focus:ring-2 focus:ring-[#C5A059]/20 focus:from-white focus:to-[#F8FAFC] transition-all duration-200 font-mono shadow-sm hover:shadow-md`
}