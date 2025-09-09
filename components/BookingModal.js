export default function BookingModal({ data, onClose, title, color = 'green' }) {
  const colorClass = color === 'green' ? 'bg-green-600' : color === 'blue' ? 'bg-blue-600' : 'bg-pink-600';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`bg-white p-6 rounded-lg shadow-lg max-w-md w-full m-4 fade-in transition-all`}>
        <h2 className={`text-xl font-bold mb-4 text-${color}-800`}>{title}</h2>
        <div className="space-y-2 text-gray-800 mb-4">
          <p><strong>Patient Name:</strong> {data.name}</p>
          <p><strong>Phone:</strong> {data.phone}</p>
          <p><strong>Email:</strong> {data.email}</p>
          <p><strong>Address:</strong> {data.address}</p>
          <p><strong>Doctor:</strong> {data.doctor.name}</p>
          <p><strong>Date:</strong> {data.date}</p>
          <p><strong>Time:</strong> {data.time}</p>
          <p><strong>Symptoms:</strong> {data.symptoms}</p>
        </div>
        <button 
          onClick={onClose}
          className={`w-full ${colorClass} text-white py-2 rounded hover:opacity-90 transition-all`}
        >
          OK
        </button>
      </div>
    </div>
  );
}