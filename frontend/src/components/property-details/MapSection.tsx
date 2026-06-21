export default function MapSection() {
  return (
    <div className="mt-8">
      <h3 className="text-xl font-bold text-gray-900 mb-4">Location Map</h3>
      <div className="w-full h-[400px] rounded-2xl overflow-hidden shadow-inner border border-gray-200">
        <iframe 
          title="Property Location"
          src="https://maps.google.com/maps?q=Gulshan+2,Dhaka&t=k&z=17&output=embed" 
          width="100%" 
          height="100%" 
          style={{ border: 0 }} 
          allowFullScreen 
          loading="lazy" 
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
    </div>
  );
}