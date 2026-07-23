import React from 'react';

const PropertyImagesStep = ({
  mainPreview,
  mainImgRef,
  handleMainImage,
  gallery,
  galleryPreviews,
  galleryImgRef,
  handleGallery,
  removeGallery,
}) => (
  <section className="glass-card p-6">
    <div className="flex items-center gap-3 mb-5 pb-3 border-b border-blue-100">
      
      <div>
        <h3 className="text-gray-900 font-semibold text-base">Property Images</h3>
        <p className="text-gray-500 text-xs mt-0.5">Main cover image and optional gallery</p>
      </div>
    </div>

    <div className="mb-6">
      <p className="text-sm font-semibold text-gray-800 mb-3">
        Main Building Image <span className="text-red-600">*</span>
      </p>
      <div
        onClick={() => mainImgRef.current?.click()}
        className={`relative rounded-xl border-2 border-dashed cursor-pointer transition-all duration-200 overflow-hidden ${
          mainPreview
            ? 'border-primary-500/40 bg-transparent'
            : 'border-blue-200 hover:border-primary-500/50 hover:bg-slate-50 h-40 flex items-center justify-center'
        }`}
      >
        {mainPreview ? (
          <div className="relative group">
            <img src={mainPreview} alt="main" className="w-full h-56 object-cover rounded-xl" />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-xl">
              <span className="text-gray-900 text-sm font-medium">Change Image</span>
            </div>
          </div>
        ) : (
          <div className="text-center">
            
            <p className="text-gray-500 text-sm font-medium">Click to upload main image</p>
          </div>
        )}
      </div>
      <input ref={mainImgRef} type="file" accept="image/*" className="hidden" onChange={handleMainImage} />
    </div>

    <div>
      <p className="text-sm font-semibold text-gray-800 mb-3">
        Gallery Images ({gallery.length}/10)
      </p>
      {gallery.length < 10 && (
        <label
          htmlFor="gallery-images"
          className="flex flex-col items-center gap-2 px-6 py-5 rounded-xl border-2 border-dashed border-blue-100 hover:border-primary-500/40 hover:bg-slate-50 cursor-pointer transition-all duration-200 mb-4"
        >
          
          <p className="text-gray-500 text-sm">Upload gallery images</p>
          <input id="gallery-images" type="file" accept="image/*" multiple className="hidden" ref={galleryImgRef} onChange={handleGallery} />
        </label>
      )}

      {galleryPreviews.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
          {galleryPreviews.map((src, i) => (
            <div key={i} className="relative group aspect-square rounded-lg overflow-hidden border border-blue-100">
              <img src={src} alt="" className="w-full h-full object-cover" />
              <button type="button" onClick={() => removeGallery(i)} className="absolute top-1 right-1 w-5 h-5 bg-black/70 rounded-full text-gray-900 flex items-center justify-center opacity-0 group-hover:opacity-100 text-xs">
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  </section>
);

export default PropertyImagesStep;
