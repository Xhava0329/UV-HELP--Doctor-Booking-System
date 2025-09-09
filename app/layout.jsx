import './globals.css';

export const metadata = {
  title: 'Doctor Booking System',
  description: 'Full-featured online doctor appointment booking',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet" />
      </head>
      <body>
        <nav className="bg-pink-600 text-white p-4 shadow-lg transition-all">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-2xl font-bold">Doctor Booking App</h1>
            <div className="space-x-4">
              <a href="/" className="hover:text-rose-200 transition-all">Home</a>
              <a href="/book" className="hover:text-rose-200 transition-all">Book Appointment</a>
            </div>
          </div>
        </nav>
        <main className="container mx-auto p-6">{children}</main>
      </body>
    </html>
  );
}