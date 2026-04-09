'use client';

import { useState, useEffect } from 'react';

interface LocationData {
  locations: string[];
}

interface PredictionResponse {
  estimated_price: number;
  status: string;
}

export default function Home() {
  const [locations, setLocations] = useState<string[]>([]);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [sqft, setSqft] = useState<number>(1200);
  const [bhk, setBhk] = useState<number>(2);
  const [bath, setBath] = useState<number>(2);
  const [price, setPrice] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('http://127.0.0.1:5000/get_location_names')
      .then(res => res.json())
      .then((data: LocationData) => setLocations(data.locations))
      .catch(() => setError('Cannot connect to Flask backend. Is it running on port 5000?'));
  }, []);

  const handlePredict = async () => {
    if (!selectedLocation) {
      setError('Please select a location');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('http://127.0.0.1:5000/predict_home_price', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          location: selectedLocation,
          total_sqft: sqft,
          bhk,
          bath,
        }),
      });
      const data: PredictionResponse = await res.json();
      if (data.status === 'success') setPrice(data.estimated_price);
      else setError('Prediction failed');
    } catch {
      setError('Network error. Make sure Flask server is running on port 5000');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-6 border border-white/20">
        <h1 className="text-3xl font-bold text-center text-white mb-2">🏡 Dream Home Predictor</h1>
        <p className="text-center text-white/70 mb-6">Know The Price Before You Buy</p>

        <div className="space-y-4">
          <div>
            <label className="block text-white mb-1"> Location</label>
            <select
              className="w-full p-2 rounded-lg bg-white/20 text-white"
              value={selectedLocation}
              onChange={e => setSelectedLocation(e.target.value)}
              style={{ colorScheme: 'dark' }}  // 👈 forces dark mode dropdown
            >
              <option value="" className="text-black bg-white">Select location</option>
              {locations.map(loc => (
                <option key={loc} value={loc} className="text-black bg-white">
                  {loc.replace(/_/g, ' ')}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-white mb-1"> Square Feet</label>
            <input
              type="number"
              className="w-full p-2 rounded-lg bg-white/20 text-white border border-white/30"
              value={sqft}
              onChange={(e) => setSqft(Number(e.target.value))}
              min={300}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-white mb-1"> BHK</label>
              <input
                type="number"
                className="w-full p-2 rounded-lg bg-white/20 text-white border border-white/30"
                value={bhk}
                onChange={(e) => setBhk(Number(e.target.value))}
                min={1}
              />
            </div>
            <div>
              <label className="block text-white mb-1"> Bathrooms</label>
              <input
                type="number"
                className="w-full p-2 rounded-lg bg-white/20 text-white border border-white/30"
                value={bath}
                onChange={(e) => setBath(Number(e.target.value))}
                min={1}
              />
            </div>
          </div>

          <button
            onClick={handlePredict}
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-violet-300 to-violet-400 hover:from-gray-200 hover:to-gray-400 text-black font-bold rounded-xl transition-all disabled:opacity-50"
          >
            {loading ? 'Calculating...' : ' Predict Price '}
          </button>

          {error && (
            <div className="bg-red-500/20 border-l-4 border-red-500 text-red-200 p-3 rounded">
              {error}
            </div>
          )}

          {price !== null && (
            <div className="mt-4 p-4 bg-black/40 rounded-xl text-center">
              <h3 className="text-white/80 text-sm">Estimated Price</h3>
              <div className="text-4xl font-bold text-amber-400">
                ₹ {price.toLocaleString('en-IN')}
              </div>
              <div className="text-white/60 text-xs">Lakhs (1 Lakh = 1,00,000 INR)</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}