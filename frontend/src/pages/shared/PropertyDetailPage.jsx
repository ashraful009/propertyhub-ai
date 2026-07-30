import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import axiosInstance from '../../api/axiosInstance';
import UnitVisualizer from '../../components/customer/UnitVisualizer';
import UnitDetailView from '../../components/customer/UnitDetailView';

import PropertyDetailSkeleton from '../../components/customer/PropertyDetailSkeleton';
import PropertyBottomGallery from '../../components/customer/PropertyBottomGallery';
import PropertyQuickStats from '../../components/customer/PropertyQuickStats';
import PropertyAboutTab from '../../components/customer/PropertyAboutTab';
import PropertyChatbot from '../../components/customer/PropertyChatbot';

const CATEGORY_ICONS = {
  apartment: '', villa: '', land: '',
};

const PropertyDetailPage = () => {
  const { id } = useParams();

  const [property,    setProperty]    = useState(null);
  const [unitData,    setUnitData]    = useState({ units: [], grouped: {}, stats: {} });
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState('');
  const [selectedUnit, setSelectedUnit] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [propRes, unitRes] = await Promise.all([
          axiosInstance.get(`/properties/${id}`),
          axiosInstance.get(`/units/property/${id}`),
        ]);
        setProperty(propRes.data.data.property);
        setUnitData(unitRes.data.data);
      } catch {
        setError('Property not found or unavailable.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return <PropertyDetailSkeleton />;

  if (error || !property) {
    return (
      <div className="container-main py-20 text-center">
        <p className="text-gray-900 font-semibold mb-2">{error}</p>
        <Link to="/" className="btn-primary mt-4 inline-flex">← Back to Home</Link>
      </div>
    );
  }

  const {
    title, description, city, address, category,
    mainImage, galleryImages, images, totalFloors, unitsPerFloor,
    location, villaDetails, landDetails,
  } = property;

  const cat = category?.toLowerCase();

  const allImages = [];
  if (mainImage) allImages.push(mainImage);
  if (galleryImages?.length) allImages.push(...galleryImages);
  if (!allImages.length && images?.length) allImages.push(...images);

  const hasMap = location?.lat && location?.lng;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      
      <div className="container-main py-10">
        
        {/* Header Section */}
        <div className="flex flex-wrap items-start gap-3 mb-6">
          <div className="flex-1">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-blackops text-gray-900 tracking-wide">{title}</h1>
            <div className="flex items-center gap-2 mt-3 text-gray-500">
              <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              </svg>
              <span className="text-lg">{address}, {city}</span>
            </div>
          </div>
          <span className="text-sm px-4 py-2 rounded-xl bg-primary-500/15 border border-primary-500/30 text-primary-600 font-semibold capitalize">
            {CATEGORY_ICONS[category]} {category}
          </span>
        </div>

        {/* Quick Stats */}
        <div className="mb-12">
          <PropertyQuickStats
            cat={cat}
            villaDetails={villaDetails}
            landDetails={landDetails}
            totalFloors={totalFloors}
            unitsPerFloor={unitsPerFloor}
            unitData={unitData}
          />
        </div>

        {/* Building Information */}
        <div className="mb-16">
          <h2 className="text-3xl font-blackops text-gray-900 mb-8 tracking-wider">Building Information</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white border border-blue-100 rounded-3xl p-6 shadow-sm">
              <PropertyAboutTab
                cat={cat}
                description={description}
                villaDetails={villaDetails}
                landDetails={landDetails}
              />
            </div>
            
            <div className="h-[400px]">
              {hasMap ? (
                <div className="h-full rounded-3xl overflow-hidden border border-blue-100 shadow-sm relative z-0">
                  <MapContainer
                    center={[location.lat, location.lng]}
                    zoom={15}
                    style={{ height: '100%', width: '100%' }}
                    scrollWheelZoom={false}
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker position={[location.lat, location.lng]} />
                  </MapContainer>
                </div>
              ) : (
                <div className="h-full bg-white border border-blue-100 rounded-3xl p-6 shadow-sm flex flex-col items-center justify-center text-center">
                  <p className="text-gray-500">
                    {address}, {city}
                    <br />
                    <span className="text-gray-600 mt-2 block">No map coordinates available for this property.</span>
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Unit Information */}
        <div className="mb-8">
          <h2 className="text-3xl font-blackops text-gray-900 mb-2 tracking-wider">Unit Information</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] xl:grid-cols-[2fr_1fr] gap-8 items-start">
            <div className="bg-white border border-blue-100 rounded-3xl p-6 shadow-sm">
              <UnitVisualizer
                units={unitData.units}
                grouped={unitData.grouped}
                stats={unitData.stats}
                property={property}
                onUnitClick={setSelectedUnit}
              />
            </div>
            
            <div className="h-full min-h-[500px] sticky top-24">
              <UnitDetailView unit={selectedUnit} property={property} />
            </div>
          </div>
        </div>
      </div>

      {/* Photo Gallery at the bottom */}
      <PropertyBottomGallery title={title} allImages={allImages} />

      <PropertyChatbot propertyId={property._id} />
    </div>
  );
};

export default PropertyDetailPage;
