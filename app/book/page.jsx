'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import BookingModal from '../../components/BookingModal'; // Import modal component

export default function Book() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const doctorId = searchParams.get('doctorId');
  const [doctors, setDoctors] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [formData, setFormData] = useState({ 
    name: '', 
    phone: '', 
    email: '', 
    address: '',
    date: '', 
    time: '', 
    symptoms: '' 
  });
  const [errors, setErrors] = useState({});
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationData, setConfirmationData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedDoctors = JSON.parse(localStorage.getItem('doctors') || '[]');
    const storedBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    setDoctors(storedDoctors);
    setBookings(storedBookings);
    setLoading(false);
  }, []);

  const selectedDoctor = doctors.find((d) => d.id === parseInt(doctorId));

  if (!selectedDoctor || loading) {
    return <div className="text-center">Loading or invalid doctor selection.</div>;
  }

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.phone) newErrors.phone = 'Phone is required';
    if (!formData.email || !formData.email.includes('@')) newErrors.email = 'Valid email is required';
    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.time) newErrors.time = 'Time is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const checkAvailability = () => {
    // Simple check: No overlapping bookings for the doctor on that date/time
    return !bookings.some(b => 
      b.doctorId === parseInt(doctorId) && 
      b.date === formData.date && 
      Math.abs(new Date(`2025-01-01 ${b.time}`).getTime() - new Date(`2025-01-01 ${formData.time}`).getTime()) < 3600000 // Within 1 hour
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm() || !checkAvailability()) {
      if (!checkAvailability()) setErrors({ ...errors, availability: 'This slot is already booked!' });
      return;
    }

    const newBooking = {
      id: Date.now(),
      doctorId: parseInt(doctorId),
      ...formData,
      createdAt: new Date().toISOString(),
    };
    const updatedBookings = [...bookings, newBooking];
    localStorage.setItem('bookings', JSON.stringify(updatedBookings));
    setConfirmationData({ ...newBooking, doctor: selectedDoctor });
    setShowConfirmation(true);
    setBookings(updatedBookings); // Update state
  };

  const handleConfirm = () => {
    setShowConfirmation(false);
    router.push('/');
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md fade-in">
      <h1 className="text-2xl font-bold mb-4 text-pink-800">Book Appointment with {selectedDoctor.name}</h1>
      <p className="text-gray-600 mb-4">Specialty: {selectedDoctor.specialty}</p>
      
      <form onSubmit={handleSubmit} className="space-y-4">
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
        <div>
          <label className="block text-sm font-medium text-gray-700">Phone Number *</label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className={`mt-1 block w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all ${errors.phone ? 'border-red-500' : ''}`}
            required
          />
          {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Email *</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className={`mt-1 block w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all ${errors.email ? 'border-red-500' : ''}`}
            required
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Address</label>
          <textarea
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            className="mt-1 block w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all"
            rows="2"
            placeholder="Your address..."
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Preferred Date *</label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className={`mt-1 block w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all ${errors.date ? 'border-red-500' : ''}`}
            required
          />
          {errors.date && <p className="text-red-500 text-sm">{errors.date}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Preferred Time *</label>
          <input
            type="time"
            value={formData.time}
            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
            className={`mt-1 block w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all ${errors.time ? 'border-red-500' : ''}`}
            required
          />
          {errors.time && <p className="text-red-500 text-sm">{errors.time}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Symptoms/Reason for Visit</label>
          <textarea
            value={formData.symptoms}
            onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })}
            className="mt-1 block w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all"
            rows="3"
            placeholder="Describe your symptoms..."
          />
        </div>
        {errors.availability && <p className="text-red-500 text-sm">{errors.availability}</p>}
        <button 
          type="submit" 
          className="w-full bg-pink-600 text-white py-2 rounded hover:bg-pink-700 transition-all"
          disabled={loading}
        >
          Confirm Booking
        </button>
      </form>

      {/* Confirmation Modal */}
      {showConfirmation && confirmationData && (
        <BookingModal 
          data={confirmationData} 
          onClose={handleConfirm} 
          title="Booking Confirmed!" 
          color="green"
        />
      )}
    </div>
  );
}