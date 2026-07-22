import React from 'react';
import PropertyPriceSection from './PropertyPriceSection';
import { useAddProperty } from '../../hooks/useAddProperty';
import BasicInfoStep from './wizard/BasicInfoStep';
import ApartmentSpecStep from './wizard/ApartmentSpecStep';
import VillaSpecStep from './wizard/VillaSpecStep';
import LandSpecStep from './wizard/LandSpecStep';
import PropertyImagesStep from './wizard/PropertyImagesStep';

const AddPropertyWizard = ({ onSuccess, defaultCategory = 'Apartments' }) => {
  const {
    form, setForm, villaForm, landForm, flatTypes, location, setLocation, mainPreview, gallery, galleryPreviews, loading, error, submitted, selectedUnit, setSelectedUnit,
    mainImgRef, galleryImgRef,
    isApartment, isVilla, isLand,
    handleChange, handleAddressBlur, handleVilla, handleLand, handleMainImage, handleGallery, removeGallery,
    addFlatType, removeFlatType, updateFlatType,
    floors, unitsPerFlr, getTypeIndexForCol, getUnitLabel,
    handleSubmit, resetForm,
    navigate
  } = useAddProperty({ onSuccess, defaultCategory });

  if (submitted) {
    return (
      <div className="text-center py-14 animate-fadeIn">
        <div className="w-24 h-24 rounded-full bg-green-500/20 border-2 border-green-500/40 flex items-center justify-center mx-auto mb-6">
          <svg className="w-12 h-12 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Property Submitted! 🏠</h2>
        <p className="text-gray-500 text-sm mb-8 max-w-sm mx-auto">
          Your property is pending review. It will appear publicly once approved by the admin.
        </p>
        <div className="flex gap-3 justify-center">
          <button onClick={resetForm} className="btn-secondary">Add Another</button>
          <button onClick={() => navigate(-1)} className="btn-primary">Go to Dashboard</button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-600 text-sm animate-fadeIn flex items-center gap-2">
          <span>⚠️</span> {error}
        </div>
      )}

      <BasicInfoStep form={form} setForm={setForm} location={location} setLocation={setLocation} handleChange={handleChange} handleAddressBlur={handleAddressBlur} />

      {isApartment && (
        <ApartmentSpecStep
          form={form}
          handleChange={handleChange}
          flatTypes={flatTypes}
          addFlatType={addFlatType}
          removeFlatType={removeFlatType}
          updateFlatType={updateFlatType}
          floors={floors}
          unitsPerFlr={unitsPerFlr}
          getUnitLabel={getUnitLabel}
          getTypeIndexForCol={getTypeIndexForCol}
          selectedUnit={selectedUnit}
          setSelectedUnit={setSelectedUnit}
        />
      )}

      {isVilla && <VillaSpecStep villaForm={villaForm} handleVilla={handleVilla} />}

      {isLand && <LandSpecStep landForm={landForm} handleLand={handleLand} />}

      <PropertyPriceSection category={form.category} price={form.price} onChange={handleChange} />

      <PropertyImagesStep
        mainPreview={mainPreview}
        mainImgRef={mainImgRef}
        handleMainImage={handleMainImage}
        gallery={gallery}
        galleryPreviews={galleryPreviews}
        galleryImgRef={galleryImgRef}
        handleGallery={handleGallery}
        removeGallery={removeGallery}
      />

      <button type="submit" disabled={loading} className="btn-primary w-full py-4 text-base">
        {loading ? 'Uploading & Submitting...' : '🏠 Submit Property'}
      </button>
    </form>
  );
};

export default AddPropertyWizard;
