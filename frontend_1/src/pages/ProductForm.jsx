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

  const [values, setValues] = useState({
    name: product?.name ?? '',
    description: product?.description ?? '',
    pricePerMeter: product?.pricePerMeter ?? '',
    category: product?.category?._id ?? product?.category ?? '',
  })
  const [errors, setErrors]         = useState({})
  const [imageFiles, setImageFiles] = useState([])     // new File objects
  const [imagePreviews, setImagePreviews] = useState([]) // new image preview URLs
  const [existingImages, setExistingImages] = useState(product?.images ?? []) // existing URLs
  const [submitting, setSubmitting] = useState(false)

  // Keyboard close
  useEffect(() => {
    const h = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [onClose])

  const handleChange = (e) => {
    const { name, value } = e.target
    setValues((v) => ({ ...v, [name]: value }))
    setErrors((er) => ({ ...er, [name]: null }))
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
    URL.revokeObjectURL(imagePreviews[idx])
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

    // Existing images to keep (tell backend which to preserve)
    existingImages.forEach((url) => fd.append('existingImages', url))

    // New files
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
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#CBD5E1]/50 flex-shrink-0">
          <div>
            <p className="font-mono text-[9px] uppercase tracking-widest text-[#64748B]">
              {isEdit ? 'Edit' : 'New'} Product
            </p>
            <h2 className="font-serif text-lg font-semibold text-[#333333] mt-0.5">
              {isEdit ? product.name : 'Add Fabric'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-[#64748B]/40 text-[#64748B] hover:bg-[#333333] transition-colors"
            aria-label="Close"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              <select
                name="category"
                value={values.category}
                onChange={handleChange}
                className={`${formInput(errors.category)} appearance-none cursor-pointer`}
              >
                <option value="">Select…</option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </select>
            </Field>
          </div>

          {/* Images */}
          <Field
            label={`Images (${totalImages}/${MAX_IMAGES})`}
            error={errors.images}
            hint={`Upload up to ${MAX_IMAGES} images. Supports JPG, PNG, WebP.`}
          >
            {/* Preview grid */}
            {(existingImages.length > 0 || imagePreviews.length > 0) && (
              <div className="flex flex-wrap gap-2 mb-3">
                {/* Existing images */}
                {existingImages.map((img, i) => (
                  <div key={`existing-${i}`} className="relative w-16 h-16 rounded-lg overflow-hidden group border border-[#CBD5E1]/50">
                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeExistingImage(i)}
                      className="absolute inset-0 bg-[#64748B]/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      aria-label="Remove image"
                    >
                      <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}

                {/* New images */}
                {imagePreviews.map((url, i) => (
                  <div key={`new-${i}`} className="relative w-16 h-16 rounded-lg overflow-hidden group border border-[#CBD5E1]/40">
                    <img src={url} alt="" className="w-full h-full object-cover" />
                    <div className="absolute top-0.5 left-0.5">
                      <span className="text-[8px] bg-[#C5A059] text-[#FFFFFF] px-1 rounded font-mono font-bold">NEW</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeNewImage(i)}
                      className="absolute inset-0 bg-[#64748B]/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      aria-label="Remove image"
                    >
                      <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                  className="flex items-center gap-2 px-4 py-2.5 border border-dashed border-[#CBD5E1] rounded-lg text-[#64748B] hover:border-[#C5A059] hover:text-[#333333] transition-all text-xs font-mono uppercase tracking-wider w-full justify-center"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Add Images ({MAX_IMAGES - totalImages} remaining)
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
          </Field>
        </form>

        {/* Footer */}
        <div className="flex gap-3 px-6 py-4 border-t border-[#CBD5E1]/50 flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 border border-[#CBD5E1] text-[#64748B]/70 rounded-lg font-mono text-xs uppercase tracking-wider hover:border-[#0F172A] hover:text-[#333333] transition-all"
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={submitting}
            className="flex-1 py-2.5 bg-[#C5A059] text-[#FFFFFF] rounded-lg font-mono text-xs uppercase tracking-wider hover:bg-[#0F172A] hover:text-[#FFFFFF] transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                {isEdit ? 'Saving…' : 'Creating…'}
              </>
            ) : isEdit ? 'Save Changes' : 'Create Product'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function Field({ label, error, hint, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="font-mono text-[9px] uppercase tracking-widest text-[#64748B]">
          {label}
        </label>
      )}
      {children}
      {error && (
        <p className="text-[#EF4444] text-xs font-mono flex items-center gap-1">
          <svg className="w-3 h-3 flex-shrink-0" viewBox="0 0 12 12" fill="currentColor">
            <path d="M6 1a5 5 0 100 10A5 5 0 006 1zm-.5 2.5h1v3.25h-1V3.5zm0 4.5h1v1h-1V8z" />
          </svg>
          {error}
        </p>
      )}
      {hint && !error && <p className="text-[#64748B]/70 text-[10px] font-mono">{hint}</p>}
    </div>
  )
}

function formInput(error) {
  return `w-full px-3 py-2.5 bg-[#F8F9FA] border ${error ? 'border-[#EF4444]' : 'border-[#CBD5E1]/60'} rounded-lg text-[#333333] text-sm placeholder-[#94A3B8] focus:outline-none focus:border-[#C5A059] transition-colors font-mono`
}
