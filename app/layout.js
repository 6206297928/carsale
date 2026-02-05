import { Inter } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/AuthProvider"; // Keep your AuthProvider
import Navbar from "@/components/Navbar"; // <--- Import the new Navbar

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "CARSALE - Buy & Sell Cars",
  description: "The best place to find your dream car.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Razorpay Script is loaded in BuyButton, but can be here too */}
        <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
      </head>
      <body className={inter.className}>
        <AuthProvider>
          
          {/* The Smart Navbar goes here */}
          <Navbar />
          
          {children}
        
        </AuthProvider>
      </body>
    </html>
  );
}