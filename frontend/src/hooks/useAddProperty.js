import { useState, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';

export const CATEGORIES = ['Apartments', 'Villas', 'Land'];

export const CATEGORY_ICONS = {
  Apartments: '🏢',
  Villas:     '🏡',
  Land:       '🌿',
};

export const YES_NO = ['Yes', 'No'];

export const defaultFlatType = () => ({
  label:        '',
  sqft:         '',
  pricePerUnit: '',
  bedrooms:     1,
  bathrooms:    1,
  kitchen:      'Yes',
  dining:       'Yes',
  drawing:      'No',
  parking:      'No',
  description:  '',
});

export const VILLA_DEFAULTS = {
  area: '', roadAccess: '', neighborhood: 'Residential',
  totalLandSize: '', totalFloors: '', bedrooms: '', bathrooms: '',
  living: 'Yes', dining: 'Yes', kitchen: 'Yes', description: '',
  constructionYear: '', developerName: '', materialsQuality: 'Tiles',
  earthquakeResistant: 'No',
  privatePool: 'No', garden: 'No', garage: 'No',
  rooftopTerrace: 'No', servantRoom: 'No', securitySystem: 'No',
};

export const LAND_DEFAULTS = {
  area: '', roadAccess: 'No',
  totalSize: '', plotShape: 'Rectangle',
  landType: 'Residential', fillingStatus: 'Ready to use', constructionReady: 'No',
  khatianNumber: '', dagNumber: '', landOwnership: 'Single owner', anyDispute: 'No',
  electricityLine: 'No', gasWaterConnection: 'No', drainageSystem: 'No',
  nearbySchool: '', nearbyHospital: '', nearbyMarket: '', futureDevelopment: '',
};

export const TYPE_COLORS = [
  { bg: 'bg-blue-400/20',   border: 'border-blue-400/40',   text: 'text-blue-300',   dot: 'bg-blue-400' },
  { bg: 'bg-pink-400/20',   border: 'border-pink-400/40',   text: 'text-pink-300',   dot: 'bg-pink-400' },
  { bg: 'bg-amber-400/20',  border: 'border-amber-400/40',  text: 'text-amber-300',  dot: 'bg-amber-400' },
  { bg: 'bg-teal-400/20',   border: 'border-teal-400/40',   text: 'text-teal-300',   dot: 'bg-teal-400' },
  { bg: 'bg-purple-400/20', border: 'border-purple-400/40', text: 'text-purple-300', dot: 'bg-purple-400' },
  { bg: 'bg-rose-400/20',   border: 'border-rose-400/40',   text: 'text-rose-300',   dot: 'bg-rose-400' },
  { bg: 'bg-cyan-400/20',   border: 'border-cyan-400/40',   text: 'text-cyan-300',   dot: 'bg-cyan-400' },
  { bg: 'bg-lime-400/20',   border: 'border-lime-400/40',   text: 'text-lime-300',   dot: 'bg-lime-400' },
  { bg: 'bg-orange-400/20', border: 'border-orange-400/40', text: 'text-orange-300', dot: 'bg-orange-400' },
  { bg: 'bg-indigo-400/20', border: 'border-indigo-400/40', text: 'text-indigo-300', dot: 'bg-indigo-400' },
  { bg: 'bg-emerald-400/20',border: 'border-emerald-400/40',text: 'text-emerald-300',dot: 'bg-emerald-400' },
  { bg: 'bg-fuchsia-400/20',border: 'border-fuchsia-400/40',text: 'text-fuchsia-300',dot: 'bg-fuchsia-400' },
];

export const useAddProperty = ({ onSuccess, defaultCategory = 'Apartments' }) => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title:           '',
    description:     '',
    price:           '',
    address:         '',
    city:            '',
    category:        defaultCategory,
    totalFloors:     5,
    unitsPerFloor:   4,
    totalUnitsCount: '',
    landSize:        '',
    handoverTime:    '',
  });

  const [villaForm, setVillaForm] = useState({ ...VILLA_DEFAULTS });
  const [landForm, setLandForm]   = useState({ ...LAND_DEFAULTS });

  const [flatTypes,     setFlatTypes]     = useState([defaultFlatType()]);
  const [location,      setLocation]      = useState(null);
  const [mainImage,     setMainImage]     = useState(null);
  const [mainPreview,   setMainPreview]   = useState('');
  const [gallery,       setGallery]       = useState([]);
  const [galleryPreviews, setGalleryPreviews] = useState([]);
  const [loading,       setLoading]       = useState(false);
  const [error,         setError]         = useState('');
  const [submitted,     setSubmitted]     = useState(false);
  const [selectedUnit,  setSelectedUnit]  = useState(null);

  const mainImgRef    = useRef();
  const galleryImgRef = useRef();

  const isApartment = form.category === 'Apartments';
  const isVilla = form.category === 'Villas';
  const isLand = form.category === 'Land';

  const handleChange = (e) => {
    setError('');
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddressBlur = async () => {
    if (!form.address) return;
    const query = `${form.address}, ${form.city || ''}, Bangladesh`.trim();
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1&email=mdashrafulislam0807@gmail.com`);
      const data = await res.json();
      if (data && data.length > 0) {
        setLocation({
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon),
          address: data[0].display_name
        });
      }
    } catch (err) {
    }
  };

  const handleVilla = (e) => {
    const { name, value } = e.target;
    setVillaForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleLand = (e) => {
    const { name, value } = e.target;
    setLandForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleMainImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setMainImage(file);
    setMainPreview(URL.createObjectURL(file));
  };

  const handleGallery = (e) => {
    const selected = Array.from(e.target.files).slice(0, 10 - gallery.length);
    setGallery((prev) => [...prev, ...selected].slice(0, 10));
    setGalleryPreviews((prev) =>
      [...prev, ...selected.map((f) => URL.createObjectURL(f))].slice(0, 10)
    );
  };

  const removeGallery = (idx) => {
    setGallery((prev)         => prev.filter((_, i) => i !== idx));
    setGalleryPreviews((prev) => prev.filter((_, i) => i !== idx));
  };

  const floors       = Math.max(1, Math.min(Number(form.totalFloors),   30));
  const unitsPerFlr  = Math.max(1, Math.min(Number(form.unitsPerFloor), 12));

  const addFlatType = () => {
    if (flatTypes.length >= unitsPerFlr) return;
    setFlatTypes((prev) => [...prev, defaultFlatType()]);
  };

  const removeFlatType = (idx) => {
    setFlatTypes((prev) => prev.filter((_, i) => i !== idx));
    setSelectedUnit(null);
  };

  const updateFlatType = (idx, field, value) =>
    setFlatTypes((prev) =>
      prev.map((ft, i) => (i === idx ? { ...ft, [field]: value } : ft))
    );

  const getTypeIndexForCol = (colIdx) => Math.min(colIdx, flatTypes.length - 1);

  const getUnitLabel = useMemo(() => {
    return (floorNum, colIdx) => {
      const typeIdx = getTypeIndexForCol(colIdx);
      const ft = flatTypes[typeIdx];
      const label = ft.label?.trim() || String.fromCharCode(65 + typeIdx);
      const sameTypeCols = [];
      for (let c = 0; c < unitsPerFlr; c++) {
        if (getTypeIndexForCol(c) === typeIdx) sameTypeCols.push(c);
      }
      if (sameTypeCols.length === 1) return `${floorNum}${label}`;
      const pos = sameTypeCols.indexOf(colIdx) + 1;
      return `${floorNum}${label}${pos}`;
    };
  }, [flatTypes, unitsPerFlr]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!mainImage) {
      setError('Please upload a main building image.');
      return;
    }

    setLoading(true);
    setError('');

    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => {
      if (k === 'category') {
        if (v === 'Apartments') fd.append(k, 'apartment');
        else if (v === 'Villas') fd.append(k, 'villa');
        else if (v === 'Land') fd.append(k, 'land');
        else fd.append(k, v.toLowerCase());
      } else {
        fd.append(k, v);
      }
    });

    if (location?.lat) {
      fd.append('lat', location.lat);
      fd.append('lng', location.lng);
    }
    fd.append('mainImage', mainImage);
    gallery.forEach((img) => fd.append('galleryImages', img));

    if (isApartment) {
      const sanitizedFlatTypes = flatTypes.map((ft) => ({
        ...ft,
        sqft: ft.sqft === '' ? 0 : Number(ft.sqft),
        pricePerUnit: ft.pricePerUnit === '' ? 0 : Number(ft.pricePerUnit),
        bedrooms: ft.bedrooms === '' ? 1 : Number(ft.bedrooms),
        bathrooms: ft.bathrooms === '' ? 1 : Number(ft.bathrooms),
      }));
      fd.append('flatTypes', JSON.stringify(sanitizedFlatTypes));
    } else if (isVilla) {
      const sanitizedVilla = { ...villaForm };
      ['totalLandSize', 'totalFloors', 'bedrooms', 'bathrooms', 'constructionYear'].forEach(key => {
        if (sanitizedVilla[key] === '') sanitizedVilla[key] = 0;
        else sanitizedVilla[key] = Number(sanitizedVilla[key]);
      });
      fd.append('villaDetails', JSON.stringify(sanitizedVilla));
    } else if (isLand) {
      const sanitizedLand = { ...landForm };
      if (sanitizedLand.totalSize === '') sanitizedLand.totalSize = 0;
      else sanitizedLand.totalSize = Number(sanitizedLand.totalSize);
      fd.append('landDetails', JSON.stringify(sanitizedLand));
    }

    try {
      await axiosInstance.post('/properties', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setSubmitted(true);
      onSuccess?.();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit property.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSubmitted(false);
    setForm({ title:'', description:'', price:'', address:'', city:'', category:'Apartments', totalFloors:5, unitsPerFloor:4, totalUnitsCount:'', landSize:'', handoverTime:'' });
    setVillaForm({ ...VILLA_DEFAULTS });
    setLandForm({ ...LAND_DEFAULTS });
    setFlatTypes([defaultFlatType()]); 
    setMainImage(null); 
    setMainPreview(''); 
    setGallery([]); 
    setGalleryPreviews([]); 
  };

  return {
    form, setForm, villaForm, landForm, flatTypes, location, setLocation, mainImage, mainPreview, gallery, galleryPreviews, loading, error, submitted, selectedUnit, setSelectedUnit,
    mainImgRef, galleryImgRef,
    isApartment, isVilla, isLand,
    handleChange, handleAddressBlur, handleVilla, handleLand, handleMainImage, handleGallery, removeGallery,
    addFlatType, removeFlatType, updateFlatType,
    floors, unitsPerFlr, getTypeIndexForCol, getUnitLabel,
    handleSubmit, resetForm,
    navigate
  };
};
