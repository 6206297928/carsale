import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AuthProvider from "@/components/AuthProvider";

// Metadata for SEO and Favicon
export const metadata = {
  title: "CARSALE - Premium Used Cars",
  description: "Buy and Sell Verified Used Cars",
  icons: {
    icon: '/car.png', 
  },
};

// The Main Layout Component
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-black font-sans flex flex-col min-h-screen">
        <AuthProvider>
          
          {/* Navbar at top */}
          <Navbar />
          
          {/* Main content expands to fill space */}
          <main className="flex-grow">
            {children}
          </main>

          {/* Footer at bottom */}
          <Footer /> 

        </AuthProvider>
      </body>
    </html>
  );
}