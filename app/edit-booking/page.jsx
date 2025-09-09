'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import BookingModal from '../../components/BookingModal';

export default function EditBooking() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const bookingId = parseInt(searchParams.get('bookingId'));
  const [doctors, setDoctors] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [formData, setFormData] = useState({ 
    name: '', phone: '', email: '', address: '', date: '', time: '', symptoms: '' 
  });
  const [errors, setErrors] = useState({});
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedDoctors = JSON.parse(localStorage.getItem('doctors') || '[]');
    const storedBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    setDoctors(storedDoctors);
    setBookings(storedBookings);

    const existingBooking = storedBookings.find(b => b.id === bookingId);
    if (existingBooking) {
      setFormData({
        name: existingBooking.name,
        phone: existingBooking.phone,
        email: existingBooking.email || '',
        address: existingBooking.address || '',
        date: existingBooking.date,
        time: existingBooking.time,
        symptoms: existingBooking.symptoms || ''
      });
    }

    setLoading(false);
  }, [bookingId]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Name is required';
    // Add similar validations as in book/page.js
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const updatedBookings = bookings.map(b => 
      b.id === bookingId ? { ...b, ...formData, updatedAt: new Date().toISOString() } : b
    );
    localStorage.setItem('bookings', JSON.stringify(updatedBookings));
    setShowConfirmation(true);
    setBookings(updatedBookings);
  };

  const handleConfirm = () => {
    setShowConfirmation(false);
    router.push('/');
  };

  if (loading) return <div className="text-center">Loading...</div>;

  const existingBooking = bookings.find(b => b.id === bookingId);
  if (!existingBooking) return <div className="text-center">Booking not found.</div>;

  const doctor = doctors.find(d => d.id === existingBooking.doctorId);

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md fade-in">
      <h1 className="text-2xl font-bold mb-4 text-pink-800">Edit Booking with {doctor ? doctor.name : 'Doctor'}</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Similar form fields as book/page.js, with value={formData.field} and onChange */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Your Name *</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className={`mt-1 block w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all ${errors.name ? 'border-red-500' : ''}`}
            required
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
        </div>
        {/* Add other fields: phone, email, address, date, time, symptoms similarly */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Phone Number *</label>
          <input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="mt-1 block w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="mt-1 block w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Address</label>
          <textarea value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} className="mt-1 block w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all" rows="2" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Date *</label>
          <input type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} className="mt-1 block w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Time *</label>
          <input type="time" value={formData.time} onChange={(e) => setFormData({ ...formData, time: e.target.value })} className="mt-1 block w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Symptoms</label>
          <textarea value={formData.symptoms} onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })} className="mt-1 block w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all" rows="3" />
        </div>
        <button type="submit" className="w-full bg-pink-600 text-white py-2 rounded hover:bg-pink-700 transition-all">Update Booking</button>
      </form>

      {showConfirmation && (
        <BookingModal 
          data={{ ...formData, doctor }} 
          onClose={handleConfirm} 
          title="Booking Updated!" 
          color="blue"
        />
      )}
    </div>
  );
}