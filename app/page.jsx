"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
// import Image from "next/image";

import demo from "./assets/demo.png";
export default function Home() {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("all");
  const [bookings, setBookings] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize demo data in localStorage if not present
    if (!localStorage.getItem("doctors")) {
      const demoDoctors = [
        {
          id: 1,
          name: "Dr. Rahman",
          specialty: "Cardiologist",
          available: "Mon-Fri, 9 AM - 5 PM",
          image: "https://via.placeholder.com/150x150?text=Dr+Sultana",
          bio: "Expert in heart diseases with 10+ years experience.",
        },
        {
          id: 2,
          name: "Dr. Sultana",
          specialty: "Pediatrician",
          available: "Tue-Sat, 10 AM - 6 PM",
          image: "https://via.placeholder.com/150x150?text=Dr+Sultana",
          bio: "Specializes in child health and vaccinations.",
        },
        {
          id: 3,
          name: "Dr. Khan",
          specialty: "Dentist",
          available: "Mon-Wed, 8 AM - 4 PM",
          image: "https://via.placeholder.com/150x150?text=Dr+Khan",
          bio: "Dental care and oral surgery specialist.",
        },
        {
          id: 4,
          name: "Dr. Ahmed",
          specialty: "Cardiologist",
          available: "Wed-Sun, 11 AM - 7 PM",
          image: "https://via.placeholder.com/150x150?text=Dr+Ahmed",
          bio: "Focuses on preventive cardiology.",
        },
        {
          id: 5,
          name: "Dr. Fatima",
          specialty: "Pediatrician",
          available: "Mon-Thu, 9 AM - 3 PM",
          image: "https://via.placeholder.com/150x150?text=Dr+Fatima",
          bio: "Pediatric nutrition and growth expert.",
        },
      ];
      localStorage.setItem("doctors", JSON.stringify(demoDoctors));
    }

    // Load data from localStorage
    const storedDoctors = JSON.parse(localStorage.getItem("doctors") || "[]");
    setDoctors(storedDoctors);
    setFilteredDoctors(storedDoctors);

    const storedBookings = JSON.parse(localStorage.getItem("bookings") || "[]");
    setBookings(storedBookings);

    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    setUser(storedUser);

    setLoading(false);
  }, []);

  useEffect(() => {
    let filtered = doctors;
    if (searchTerm) {
      filtered = filtered.filter((doctor) =>
        doctor.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (selectedSpecialty !== "all") {
      filtered = filtered.filter(
        (doctor) => doctor.specialty === selectedSpecialty
      );
    }
    setFilteredDoctors(filtered);
  }, [searchTerm, selectedSpecialty, doctors]);

  const specialties = ["all", ...new Set(doctors.map((d) => d.specialty))];

  const handleCancelBooking = (bookingId) => {
    if (confirm("Are you sure you want to cancel this booking?")) {
      const updatedBookings = bookings.filter((b) => b.id !== bookingId);
      localStorage.setItem("bookings", JSON.stringify(updatedBookings));
      setBookings(updatedBookings);
    }
  };

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-pink-800 text-center fade-in">
        Find and Book Doctors
      </h1>

      {/* Search and Filter */}
      <div className="bg-white p-4 rounded-lg shadow-md fade-in">
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="Search doctors by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 border p-2 rounded focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all"
          />
          <select
            value={selectedSpecialty}
            onChange={(e) => setSelectedSpecialty(e.target.value)}
            className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all"
          >
            {specialties.map((spec) => (
              <option key={spec} value={spec}>
                {spec.charAt(0).toUpperCase() + spec.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Doctor Profiles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDoctors.map((doctor) => (
          <div
            key={doctor.id}
            className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-all hover:scale-105"
          >
            {/* <Image
              src={doctor.image}
              alt={doctor.name}
              width={300}
              height={200}
              className="w-full h-40 object-cover rounded mb-4"
            /> */}
            {/* <Image
              src={doctor.image}
              alt={doctor.name}
              className="w-full h-40 object-cover rounded mb-4"
              onError={(e) => {
                e.target.src =
                  "https://via.placeholder.com/150x150?text=Doctor+Image";
              }}
            /> */}
            <h2 className="text-xl font-semibold text-gray-800">
              {doctor.name}
            </h2>
            <p className="text-pink-600 font-medium">{doctor.specialty}</p>
            <p className="text-gray-600 text-sm mb-2">{doctor.bio}</p>
            <p className="text-gray-500 text-sm">
              Available: {doctor.available}
            </p>
            <Link
              href={`/book?doctorId=${doctor.id}`}
              className="mt-4 block bg-pink-600 text-white text-center py-2 rounded hover:bg-pink-700 transition-all"
            >
              Book Appointment
            </Link>
          </div>
        ))}
      </div>

      {filteredDoctors.length === 0 && (
        <p className="text-center text-gray-600">
          No doctors found. Try adjusting your search or filter.
        </p>
      )}

      {/* My Bookings Section - Always shows from localStorage */}
      <div className="bg-white p-6 rounded-lg shadow-md fade-in">
        <h2 className="text-2xl font-semibold mb-4 text-pink-800">
          My Bookings
        </h2>
        {bookings.length === 0 ? (
          <p className="text-gray-600">No bookings yet. Book an appointment!</p>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => {
              const doctor = doctors.find((d) => d.id === booking.doctorId);
              return (
                <div
                  key={booking.id}
                  className="border border-gray-200 p-4 rounded-lg bg-pink-50 transition-all hover:bg-pink-100"
                >
                  <p className="text-gray-800">
                    <strong>Patient:</strong> {booking.name}
                  </p>
                  <p className="text-gray-800">
                    <strong>Phone:</strong> {booking.phone}
                  </p>
                  <p className="text-gray-800">
                    <strong>Doctor:</strong> {doctor ? doctor.name : "Unknown"}
                  </p>
                  <p className="text-gray-800">
                    <strong>Date:</strong> {booking.date}
                  </p>
                  <p className="text-gray-800">
                    <strong>Time:</strong> {booking.time}
                  </p>
                  <p className="text-gray-800">
                    <strong>Symptoms:</strong> {booking.symptoms}
                  </p>
                  <div className="flex space-x-2 mt-2">
                    <Link
                      href={`/edit-booking?bookingId=${booking.id}`}
                      className="bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600 transition-all"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleCancelBooking(booking.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
