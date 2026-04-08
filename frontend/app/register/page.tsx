"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { TextField } from "@mui/material";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    tel: "",
    password: "",
  });
  const [error, setError] = useState("");
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        const result = await signIn("credentials", {
          redirect: false,
          email: formData.email,
          password: formData.password,
        });

        if (result?.error) {
          router.push("/api/auth/signin");
        } else {
          router.push("/");
          router.refresh();
        }
      } else {
        setError(data.error || "Registration failed");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    }
  };

  return (
    <main className="min-h-screen bg-[#0f172a] text-white flex flex-col items-center justify-start px-8 py-32">
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-serif uppercase tracking-widest text-gray-100">Create Account</h1>
          <p className="text-[10px] text-gray-500 uppercase tracking-[0.3em] mt-2">Join the Wellness Experience</p>
          <div className="h-[1px] w-12 bg-blue-500/30 mx-auto mt-6" />
        </div>

        <div className="bg-[#1e2d3d]/40 border border-gray-700/30 rounded-2xl p-12 backdrop-blur-sm shadow-2xl">
          <form onSubmit={handleRegister} className="flex flex-col gap-10">
            {error && (
              <p className="text-[10px] text-red-400 uppercase tracking-widest text-center bg-red-500/10 py-2 rounded">
                {error}
              </p>
            )}

              <TextField
                label="Full Name"
                variant="outlined"
                fullWidth
                required
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                InputLabelProps={{ style: labelStyle }}
                sx={inputStyles}
              />

              <TextField
                label="Email Address"
                variant="outlined"
                fullWidth
                required
                type="email"
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                InputLabelProps={{ style: labelStyle }}
                sx={inputStyles}
              />

              <TextField
                label="Telephone (10 Digits)"
                variant="outlined"
                fullWidth
                required
                type="tel"
                onChange={(e) => setFormData({ ...formData, tel: e.target.value })}
                InputLabelProps={{ style: labelStyle }}
                sx={inputStyles}
              />

              <TextField
                label="Password"
                type="password"
                variant="outlined"
                fullWidth
                required
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                InputLabelProps={{ style: labelStyle }}
                sx={inputStyles}
              />
      
            <button
              type="submit"
              className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white text-[10px] uppercase tracking-[0.4em] font-bold rounded-xl transition-all shadow-lg shadow-blue-900/20"
            >
              Register
            </button>

            <button
              type="button"
              onClick={() => signIn("google", { callbackUrl: "/" })}
              className="w-full py-4 border border-gray-600/70 hover:border-gray-400 text-gray-200 hover:text-white text-[10px] uppercase tracking-[0.3em] font-semibold rounded-xl transition-all duration-300 bg-[#0f172a]/60"
            >
              Register With Google
            </button>
          </form>

          <div className="mt-10 text-center border-t border-gray-700/20 pt-8">
            <Link href="/api/auth/signin" className="text-[9px] uppercase tracking-widest text-gray-500 hover:text-blue-400 transition-colors">
              Already a member? <span className="text-blue-400 ml-1">Sign In</span>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

const labelStyle = {
  color: "#64748b",
  fontSize: "11px",
  letterSpacing: "0.15em",
};

const inputStyles = {
  "& .MuiOutlinedInput-root": {
    color: "white",
    backgroundColor: "rgba(15, 23, 42, 0.3)",
    borderRadius: "12px",
    fontSize: "14px",
    "& fieldset": { borderColor: "rgba(71, 85, 105, 0.3)" },
    "&:hover fieldset": { borderColor: "rgba(59, 130, 246, 0.4)" },
    "&.Mui-focused fieldset": { borderColor: "rgba(59, 130, 246, 0.8)" },
  },
};
