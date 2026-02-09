"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true); // Toggle Login vs Signup
  const [formData, setFormData] = useState({ name: "", email: "", password: "", secretKey: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle Form Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (isLogin) {
      // 🔵 LOGIN LOGIC
      const res = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (res.error) {
        setError("Invalid Email or Password");
        setLoading(false);
      } else {
        router.push("/admin/dashboard"); // Send admins to dashboard
        router.refresh();
      }
    } else {
      // 🟢 REGISTER LOGIC
      try {
        const res = await fetch("/api/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        const data = await res.json();
        
        if (res.ok) {
          alert(data.message);
          setIsLogin(true); // Switch to login after success
        } else {
          setError(data.error);
        }
      } catch (err) {
        setError("Something went wrong");
      }
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
        
        {/* Header Switcher */}
        <div className="flex mb-6 bg-gray-100 p-1 rounded-lg">
            <button 
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-2 rounded-md font-bold text-sm transition ${isLogin ? 'bg-white shadow text-blue-600' : 'text-gray-500'}`}
            >
                Login
            </button>
            <button 
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-2 rounded-md font-bold text-sm transition ${!isLogin ? 'bg-white shadow text-blue-600' : 'text-gray-500'}`}
            >
                Sign Up
            </button>
        </div>

        <h2 className="text-2xl font-black text-gray-800 mb-2 text-center">
            {isLogin ? "Welcome Back 👋" : "Create Account 🚀"}
        </h2>
        <p className="text-gray-500 text-sm text-center mb-6">
            {isLogin ? "Login to manage your dashboard" : "Enter your details below"}
        </p>

        {error && <div className="bg-red-50 text-red-500 text-sm p-3 rounded-lg mb-4 text-center border border-red-100">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Name Field (Signup Only) */}
          {!isLogin && (
            <div>
                <label className="text-xs font-bold text-gray-500 uppercase ml-1">Full Name</label>
                <input
                type="text"
                className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                />
            </div>
          )}

          {/* Email */}
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase ml-1">Email Address</label>
            <input
                type="email"
                className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="name@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
            />
          </div>

          {/* Password */}
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase ml-1">Password</label>
            <input
                type="password"
                className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
            />
          </div>

          {/* Secret Key (Signup Only) */}
          {!isLogin && (
            <div>
                <label className="text-xs font-bold text-blue-600 uppercase ml-1">Secret Key (Optional)</label>
                <input
                type="text"
                className="w-full p-3 border-2 border-blue-100 bg-blue-50 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Enter admin key for privileges"
                value={formData.secretKey}
                onChange={(e) => setFormData({ ...formData, secretKey: e.target.value })}
                />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl font-bold transition shadow-lg mt-2"
          >
            {loading ? "Processing..." : (isLogin ? "Sign In" : "Create Account")}
          </button>
        </form>

        <div className="my-6 flex items-center">
            <div className="flex-grow border-t border-gray-200"></div>
            <span className="mx-4 text-gray-400 text-xs font-bold uppercase">Or continue with</span>
            <div className="flex-grow border-t border-gray-200"></div>
        </div>

        {/* Google Login Button */}
        <button
            type="button"
            onClick={() => signIn("google", { callbackUrl: "/" })}
            className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 py-3 rounded-xl font-bold transition"
        >
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
            Sign in with Google
        </button>

      </div>
    </div>
  );
}