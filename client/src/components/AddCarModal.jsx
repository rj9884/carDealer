import { useState } from 'react';
import axios from 'axios';

const initialCarForm = {
  make: '',
  model: '',
  year: '',
  price: '',
  mileage: '',
  color: '',
  fuelType: 'Petrol',
  transmission: 'Automatic',
  engineSize: '',
  bodyType: 'Sedan',
  doors: 4,
  seats: 5,
  description: '',
  features: '',
  condition: 'Excellent',
  location: '',
  contactNumber: ''
};

// Props: open (bool), onClose(), onCreated(newCar)
export default function AddCarModal({ open, onClose, onCreated }) {
  const [carForm, setCarForm] = useState(initialCarForm);
  const [carImages, setCarImages] = useState([]);
  const [carSubmitting, setCarSubmitting] = useState(false);
  const [carError, setCarError] = useState('');
  const [carSuccess, setCarSuccess] = useState('');

  if (!open) return null;

  const resetAndClose = () => {
    setCarForm(initialCarForm);
    setCarImages([]);
    setCarError('');
    setCarSuccess('');
    onClose?.();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl ring-1 ring-black/5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Add New Car</h3>
          <button onClick={resetAndClose} className="text-gray-400 hover:text-gray-600">✕</button>
        </div>
        {carError && <div className="mb-4 p-3 bg-red-50 text-red-700 rounded border border-red-200 text-sm">{carError}</div>}
        {carSuccess && <div className="mb-4 p-3 bg-green-50 text-green-700 rounded border border-green-200 text-sm">{carSuccess}</div>}
        <form onSubmit={async (e) => {
          e.preventDefault();
          setCarError(''); setCarSuccess('');
          if (!carImages.length) { setCarError('Please select at least one image.'); return; }
          const required = ['make','model','year','price','mileage','color','engineSize','description','location','contactNumber'];
          for (const field of required) { if (!carForm[field]) { setCarError(`Field ${field} is required.`); return; } }
          try {
            setCarSubmitting(true);
            const fd = new FormData();
            Object.entries(carForm).forEach(([k,v]) => {
              if (k === 'features') {
                v.split(',').map(s=>s.trim()).filter(Boolean).forEach(f => fd.append('features', f));
              } else {
                fd.append(k, v);
              }
            });
            carImages.forEach(img => fd.append('images', img));
            const res = await axios.post('/api/cars', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
            if (res.data?._id) {
              setCarSuccess('Car created successfully.');
              onCreated?.(res.data);
              setTimeout(() => { resetAndClose(); }, 1000);
            }
          } catch (err) {
            setCarError(err.response?.data?.message || 'Failed to create car');
          } finally {
            setCarSubmitting(false);
          }
        }} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Left column */}
          <div className="space-y-4">
            <div>
              <label className="label">Make</label>
              <input className="input-field" value={carForm.make} onChange={e=>setCarForm({...carForm, make:e.target.value})} required />
            </div>
            <div>
              <label className="label">Model</label>
              <input className="input-field" value={carForm.model} onChange={e=>setCarForm({...carForm, model:e.target.value})} required />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">Year</label>
                <input type="number" className="input-field" value={carForm.year} onChange={e=>setCarForm({...carForm, year:e.target.value})} required />
              </div>
              <div>
                <label className="label">Price</label>
                <input type="number" className="input-field" value={carForm.price} onChange={e=>setCarForm({...carForm, price:e.target.value})} required />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">Mileage</label>
                <input type="number" className="input-field" value={carForm.mileage} onChange={e=>setCarForm({...carForm, mileage:e.target.value})} required />
              </div>
              <div>
                <label className="label">Color</label>
                <input className="input-field" value={carForm.color} onChange={e=>setCarForm({...carForm, color:e.target.value})} required />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">Fuel Type</label>
                <select className="input-field" value={carForm.fuelType} onChange={e=>setCarForm({...carForm, fuelType:e.target.value})}>
                  {['Petrol','Diesel','Electric','Hybrid','LPG','CNG'].map(f=> <option key={f}>{f}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Transmission</label>
                <select className="input-field" value={carForm.transmission} onChange={e=>setCarForm({...carForm, transmission:e.target.value})}>
                  {['Manual','Automatic','CVT','Semi-Automatic'].map(t=> <option key={t}>{t}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="label">Engine Size</label>
              <input className="input-field" value={carForm.engineSize} onChange={e=>setCarForm({...carForm, engineSize:e.target.value})} required />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">Body Type</label>
                <select className="input-field" value={carForm.bodyType} onChange={e=>setCarForm({...carForm, bodyType:e.target.value})}>
                  {['Sedan','SUV','Hatchback','Coupe','Convertible','Wagon','Pickup','Van'].map(b=> <option key={b}>{b}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Condition</label>
                <select className="input-field" value={carForm.condition} onChange={e=>setCarForm({...carForm, condition:e.target.value})}>
                  {['Excellent','Good','Fair','Poor'].map(c=> <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>
          </div>
          {/* Right column */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">Doors</label>
                <input type="number" className="input-field" value={carForm.doors} onChange={e=>setCarForm({...carForm, doors:e.target.value})} required />
              </div>
              <div>
                <label className="label">Seats</label>
                <input type="number" className="input-field" value={carForm.seats} onChange={e=>setCarForm({...carForm, seats:e.target.value})} required />
              </div>
            </div>
            <div>
              <label className="label">Location</label>
              <input className="input-field" value={carForm.location} onChange={e=>setCarForm({...carForm, location:e.target.value})} required />
            </div>
            <div>
              <label className="label">Contact Number</label>
              <input className="input-field" value={carForm.contactNumber} onChange={e=>setCarForm({...carForm, contactNumber:e.target.value})} required />
            </div>
            <div>
              <label className="label">Features (comma separated)</label>
              <input className="input-field" value={carForm.features} onChange={e=>setCarForm({...carForm, features:e.target.value})} placeholder="Bluetooth, Backup Camera" />
            </div>
            <div>
              <label className="label">Description</label>
              <textarea className="input-field min-h-[100px]" value={carForm.description} onChange={e=>setCarForm({...carForm, description:e.target.value})} required />
            </div>
            <div>
              <label className="label">Images (up to 5)</label>
              <input type="file" accept="image/*" multiple onChange={e=> setCarImages(Array.from(e.target.files).slice(0,5))} className="block w-full text-sm file:mr-3 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
              {carImages.length>0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {carImages.map((f,i)=> <span key={i} className="px-2 py-1 bg-gray-100 rounded text-xs truncate max-w-[120px]">{f.name}</span>)}
                </div>
              )}
            </div>
            <div className="flex space-x-3 pt-2">
              <button type="button" onClick={resetAndClose} className="btn-secondary flex-1">Cancel</button>
              <button type="submit" disabled={carSubmitting} className="btn-primary flex-1 disabled:opacity-50">{carSubmitting ? 'Saving...' : 'Save Car'}</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
