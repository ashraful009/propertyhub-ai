import { MapPin, BedDouble, Bath, Square, Wifi, Car, Waves, ShieldCheck } from 'lucide-react';

export default function PropertyInfo() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-2">
          Luxury Oceanview Apartment
        </h1>
        <p className="text-gray-500 flex items-center gap-2 text-lg">
          <MapPin className="text-blue-600" size={20} />
          Gulshan 2, Dhaka, Bangladesh
        </p>
      </div>

      <div className="flex flex-wrap gap-6 py-6 border-y border-gray-100">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><BedDouble size={24} /></div>
          <div>
            <p className="font-semibold text-gray-900">4 Bedrooms</p>
            <p className="text-sm text-gray-500">Spacious</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><Bath size={24} /></div>
          <div>
            <p className="font-semibold text-gray-900">3 Bathrooms</p>
            <p className="text-sm text-gray-500">Modern fittings</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><Square size={24} /></div>
          <div>
            <p className="font-semibold text-gray-900">2,450 sqft</p>
            <p className="text-sm text-gray-500">Floor area</p>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-4">Description</h3>
        <p className="text-gray-600 leading-relaxed">
          Experience the pinnacle of luxury living in this stunning apartment located in the heart of the city. Featuring floor-to-ceiling windows, smart home automation, and a master suite that defines comfort. Perfect for families looking for a blend of modern architecture and peaceful surroundings.
        </p>
      </div>

      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-4">Amenities</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3 text-gray-700 font-medium"><Wifi className="text-gray-400"/> High-Speed Wi-Fi</div>
          <div className="flex items-center gap-3 text-gray-700 font-medium"><Car className="text-gray-400"/> 2 Parking Spots</div>
          <div className="flex items-center gap-3 text-gray-700 font-medium"><Waves className="text-gray-400"/> Swimming Pool</div>
          <div className="flex items-center gap-3 text-gray-700 font-medium"><ShieldCheck className="text-gray-400"/> 24/7 Security</div>
        </div>
      </div>
    </div>
  );
}