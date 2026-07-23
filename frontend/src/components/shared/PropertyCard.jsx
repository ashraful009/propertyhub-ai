import { Link } from 'react-router-dom';

const PropertyCard = ({ property }) => {
  const {
    _id, title, price, city, category,
    mainImage, galleryImages, images, companyId,
    totalFloors, unitsPerFloor,
    bookingMoneyPercentage, bookingMoneyAmount,
    unitStatus,
  } = property;

  const coverImage = mainImage || galleryImages?.[0] || images?.[0] || null;
  const totalImgs  = (mainImage ? 1 : 0) + (galleryImages?.length || 0) || images?.length || 0;
  const totalUnits = (totalFloors || 0) * (unitsPerFloor || 0);

  // Compute booking money: use enriched value from API, else fallback to 20%
  const bookingAmt = bookingMoneyAmount || Math.round((price || 0) * (bookingMoneyPercentage || 20) / 100);
  const bookingPct = bookingMoneyPercentage || 20;

  const categoryStyles = {
    apartment: { bg: 'bg-blue-500/80',  text: 'text-white' },
    land:      { bg: 'bg-amber-500/80', text: 'text-white' },
    villa:     { bg: 'bg-pink-500/80',  text: 'text-white' },
  };
  const catStyle = categoryStyles[category] || categoryStyles.apartment;

  return (
    <Link
      to={`/property/${_id}`}
      className="group block relative rounded-2xl overflow-hidden
                 aspect-[4/5] sm:aspect-[3/4] xl:aspect-[4/5]
                 hover:shadow-2xl hover:shadow-primary-500/10
                 transition-all duration-500 ring-1 ring-white/[0.06]
                 hover:ring-primary-500/30"
    >
      {}
      <div className="absolute inset-0">
        {coverImage ? (
          <img
            src={coverImage}
            alt={title}
            loading="lazy"
            className="w-full h-full object-cover
                       group-hover:scale-110 transition-transform duration-700 ease-out"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center
                          bg-gradient-to-br from-primary-950/80 to-dark-900">
            <svg className="w-12 h-12 sm:w-16 sm:h-16 text-gray-700" fill="none" viewBox="0 0 24 24"
                 stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9
                   0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1
                   1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
        )}
      </div>

      {}
      <div className="absolute inset-0 bg-gradient-to-t
                      from-black via-black/50 to-transparent
                      opacity-80 group-hover:opacity-90 transition-opacity duration-300" />

      {}
      <div className="absolute top-3 left-3 right-3 flex justify-between items-start z-10">
        <span className={`text-[9px] sm:text-[10px] md:text-[11px] px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg font-semibold uppercase tracking-wider
                          backdrop-blur-md ${catStyle.bg} ${catStyle.text}`}>
          {category}
        </span>

        {totalImgs > 1 && (
          <span className="bg-black/50 backdrop-blur-md text-white text-[9px] sm:text-[10px] md:text-[11px]
                           px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-lg flex items-center gap-1">
            <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3" fill="currentColor" viewBox="0 0 24 24">
              <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2
                       2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0
                       00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {totalImgs}
          </span>
        )}
      </div>

      {}
      <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 z-10">
        <div className="flex items-end justify-between gap-2 sm:gap-3">
          {}
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-white text-sm sm:text-base md:text-lg leading-tight
                           line-clamp-1 group-hover:text-primary-300 transition-colors duration-300">
              {title}
            </h3>

            {}
            <div className="flex items-center gap-1 text-gray-200/90 text-[10px] sm:text-xs mt-1 sm:mt-1.5">
              <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 flex-shrink-0" fill="none" viewBox="0 0 24 24"
                   stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827
                     0l-4.244-4.243a8 8 0 1111.314 0z" />
              </svg>
              <span className="truncate">{city}</span>
            </div>

            {}
            <div className="flex items-center flex-wrap gap-x-1.5 sm:gap-x-2 gap-y-0.5 text-[9px] sm:text-[10px] md:text-[11px] text-gray-300 mt-1.5 sm:mt-2">
              {category === 'apartment' && (
                <>
                  <span className="flex items-center gap-0.5">
                    <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16" />
                    </svg>
                    {totalFloors} Floor{totalFloors > 1 ? 's' : ''}
                  </span>
                  <span className="text-gray-300">·</span>
                  <span>{totalUnits} Unit{totalUnits > 1 ? 's' : ''}</span>
                </>
              )}
              {category === 'villa' && (
                <span className="flex items-center gap-0.5">
                  <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16" />
                  </svg>
                  {property.villaDetails?.totalFloors || totalFloors} Floor{(property.villaDetails?.totalFloors || totalFloors) > 1 ? 's' : ''}
                </span>
              )}
              {category === 'land' && property.landDetails?.totalSize > 0 && (
                <span className="flex items-center gap-0.5">
                  {property.landDetails.totalSize} Katha
                </span>
              )}
              {companyId?.name && (
                <>
                  {(category === 'apartment' || category === 'villa' || (category === 'land' && property.landDetails?.totalSize > 0)) && (
                    <span className="text-gray-300">·</span>
                  )}
                  <span className="truncate text-primary-300 font-medium">{companyId.name}</span>
                </>
              )}
            </div>
          </div>

          {}
          <div className="flex-shrink-0 text-right flex flex-col items-end justify-center">
            {(category === 'villa' || category === 'land') && (unitStatus === 'booked' || unitStatus === 'sold') ? (
              <div className={`px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg font-bold text-xs sm:text-sm border 
                ${unitStatus === 'booked' ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' : 'bg-red-500/20 text-red-300 border-red-500/30'}`}>
                {unitStatus === 'booked' ? 'Booked' : 'Sold Out'}
              </div>
            ) : (
              <div className="flex flex-col items-end gap-1.5 sm:gap-2">
                <div>
                  <p className="text-[8px] sm:text-[9px] md:text-[10px] text-gray-300 uppercase tracking-wider mb-0.5">
                    Booking ({bookingPct}%)
                  </p>
                  <p className="text-sm sm:text-base md:text-lg font-bold text-white leading-tight">
                    ৳{bookingAmt?.toLocaleString()}
                  </p>
                </div>
                <div className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 rounded-lg sm:rounded-xl bg-primary-500/20 border border-primary-500/30
                                flex items-center justify-center
                                group-hover:bg-primary-500 group-hover:border-primary-400
                                transition-all duration-300">
                  <svg className="w-3 h-3 sm:w-4 sm:h-4 text-primary-300 group-hover:text-white
                                  group-hover:translate-x-0.5 transition-all duration-300"
                       fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                      d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PropertyCard;
