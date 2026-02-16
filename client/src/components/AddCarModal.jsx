import { useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, CloudArrowUpIcon, PhotoIcon } from '@heroicons/react/24/outline';

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

export default function AddCarModal({ open, onClose, onCreated }) {
  const [carForm, setCarForm] = useState(initialCarForm);
  const [carImages, setCarImages] = useState([]);
  const [carSubmitting, setCarSubmitting] = useState(false);
  const [carError, setCarError] = useState('');
  const [carSuccess, setCarSuccess] = useState('');

  const resetAndClose = () => {
    setCarForm(initialCarForm);
    setCarImages([]);
    setCarError('');
    setCarSuccess('');
    onClose?.();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCarError('');
    setCarSuccess('');

    if (!carImages.length) {
      setCarError('Please select at least one image.');
      return;
    }

    const required = ['make', 'model', 'year', 'price', 'mileage', 'color', 'engineSize', 'description', 'location', 'contactNumber'];
    for (const field of required) {
      if (!carForm[field]) {
        setCarError(`Field ${field} is required.`);
        return;
      }
    }

    try {
      setCarSubmitting(true);
      const fd = new FormData();
      Object.entries(carForm).forEach(([k, v]) => {
        if (k === 'features') {
          v.split(',').map(s => s.trim()).filter(Boolean).forEach(f => fd.append('features', f));
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
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={resetAndClose}
            className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-4xl bg-slate-800 rounded-2xl shadow-xl overflow-hidden border border-slate-700 max-h-[90vh] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-700">
              <h3 className="text-xl font-bold text-white">Add New Vehicle</h3>
              <button
                onClick={resetAndClose}
                className="text-slate-400 hover:text-white transition-colors p-1 hover:bg-slate-700 rounded-lg"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="overflow-y-auto p-6 flex-1">
              {carError && (
                <div className="mb-6 p-4 bg-red-500/10 text-red-400 rounded-xl border border-red-500/20 text-sm font-medium">
                  {carError}
                </div>
              )}
              {carSuccess && (
                <div className="mb-6 p-4 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20 text-sm font-medium">
                  {carSuccess}
                </div>
              )}

              <form id="add-car-form" onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Column: Basic Info */}
                <div className="space-y-6">
                  <h4 className="text-sm uppercase tracking-wider text-slate-400 font-semibold border-b border-slate-700 pb-2">Vehicle Details</h4>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1">Make</label>
                      <input className="input-field w-full" value={carForm.make} onChange={e => setCarForm({ ...carForm, make: e.target.value })} placeholder="Toyota" required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1">Model</label>
                      <input className="input-field w-full" value={carForm.model} onChange={e => setCarForm({ ...carForm, model: e.target.value })} placeholder="Camry" required />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1">Year</label>
                      <input type="number" className="input-field w-full" value={carForm.year} onChange={e => setCarForm({ ...carForm, year: e.target.value })} placeholder="2023" required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1">Price</label>
                      <div className="relative">
                        <span className="absolute left-3 top-2.5 text-slate-500">₹</span>
                        <input type="number" className="input-field w-full pl-8" value={carForm.price} onChange={e => setCarForm({ ...carForm, price: e.target.value })} placeholder="2500000" required />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1">Mileage (km)</label>
                      <input type="number" className="input-field w-full" value={carForm.mileage} onChange={e => setCarForm({ ...carForm, mileage: e.target.value })} placeholder="15000" required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1">Color</label>
                      <input className="input-field w-full" value={carForm.color} onChange={e => setCarForm({ ...carForm, color: e.target.value })} placeholder="Midnight Black" required />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1">Fuel Type</label>
                      <select className="input-field w-full" value={carForm.fuelType} onChange={e => setCarForm({ ...carForm, fuelType: e.target.value })}>
                        {['Petrol', 'Diesel', 'Electric', 'Hybrid', 'LPG', 'CNG'].map(f => <option key={f} value={f}>{f}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1">Transmission</label>
                      <select className="input-field w-full" value={carForm.transmission} onChange={e => setCarForm({ ...carForm, transmission: e.target.value })}>
                        {['Manual', 'Automatic', 'CVT', 'Semi-Automatic'].map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1">Body Type</label>
                      <select className="input-field w-full" value={carForm.bodyType} onChange={e => setCarForm({ ...carForm, bodyType: e.target.value })}>
                        {['Sedan', 'SUV', 'Hatchback', 'Coupe', 'Convertible', 'Wagon', 'Pickup', 'Van'].map(b => <option key={b} value={b}>{b}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1">Condition</label>
                      <select className="input-field w-full" value={carForm.condition} onChange={e => setCarForm({ ...carForm, condition: e.target.value })}>
                        {['Excellent', 'Good', 'Fair', 'Poor'].map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Engine Size</label>
                    <input className="input-field w-full" value={carForm.engineSize} onChange={e => setCarForm({ ...carForm, engineSize: e.target.value })} placeholder="2.5L 4-Cylinder" required />
                  </div>
                </div>

                {/* Right Column: Additional Info & Images */}
                <div className="space-y-6">
                  <h4 className="text-sm uppercase tracking-wider text-slate-400 font-semibold border-b border-slate-700 pb-2">Specs & Images</h4>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1">Doors</label>
                      <input type="number" className="input-field w-full" value={carForm.doors} onChange={e => setCarForm({ ...carForm, doors: e.target.value })} required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1">Seats</label>
                      <input type="number" className="input-field w-full" value={carForm.seats} onChange={e => setCarForm({ ...carForm, seats: e.target.value })} required />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Location</label>
                    <input className="input-field w-full" value={carForm.location} onChange={e => setCarForm({ ...carForm, location: e.target.value })} placeholder="Mumbai, MH" required />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Contact Number</label>
                    <input className="input-field w-full" value={carForm.contactNumber} onChange={e => setCarForm({ ...carForm, contactNumber: e.target.value })} placeholder="+91 98765 43210" required />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Features</label>
                    <input className="input-field w-full" value={carForm.features} onChange={e => setCarForm({ ...carForm, features: e.target.value })} placeholder="Bluetooth, Sunroof, Backup Camera (comma separated)" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Description</label>
                    <textarea className="input-field w-full min-h-[100px]" value={carForm.description} onChange={e => setCarForm({ ...carForm, description: e.target.value })} placeholder="Detailed description of the vehicle..." required />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Images (Max 5)</label>
                    <div className="border-2 border-dashed border-slate-600 rounded-xl p-4 hover:bg-slate-700/30 transition-colors text-center cursor-pointer relative group">
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={e => setCarImages(Array.from(e.target.files).slice(0, 5))}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <PhotoIcon className="w-8 h-8 text-slate-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                      <p className="text-sm text-slate-400">Click to upload or drag and drop</p>
                      <p className="text-xs text-slate-500 mt-1">SVG, PNG, JPG or GIF</p>
                    </div>

                    {carImages.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-3">
                        {carImages.map((f, i) => (
                          <div key={i} className="bg-slate-700/50 px-3 py-1.5 rounded-lg flex items-center gap-2 border border-slate-600">
                            <span className="text-xs text-slate-300 truncate max-w-[150px]">{f.name}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </form>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-slate-700 bg-slate-800 flex justify-end gap-3 z-10">
              <button
                type="button"
                onClick={resetAndClose}
                className="px-6 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="add-car-form"
                disabled={carSubmitting}
                className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {carSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <CloudArrowUpIcon className="w-5 h-5" />
                    <span>Create Listing</span>
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
