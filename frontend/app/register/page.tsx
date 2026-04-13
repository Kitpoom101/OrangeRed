"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { TextField } from "@mui/material";
import Image from "next/image";

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
    // 1. เปลี่ยน bg-[#0f172a] เป็น bg-background และ text-white เป็น text-foreground
    <main className="min-h-screen bg-background text-foreground flex flex-col items-center justify-start px-8 py-32 transition-colors duration-500">
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-serif uppercase tracking-widest text-text-main">Create Account</h1>
          <p className="text-[10px] text-text-sub uppercase tracking-[0.3em] mt-2">Join the Wellness Experience</p>
          {/* 2. เปลี่ยนสีขีดเป็น accent */}
          <div className="h-[1px] w-12 bg-accent/30 mx-auto mt-6" />
        </div>

        {/* 3. เปลี่ยนพื้นหลังกล่องเป็น bg-card และขอบเป็น border-card-border */}
        <div className="bg-card border border-card-border rounded-2xl p-12 backdrop-blur-sm shadow-2xl transition-colors =">
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
              type="button"
              onClick={() => signIn("google", { callbackUrl: "/" })}
              className="w-full py-4 border border-card-border hover:border-text-sub text-text-main text-[10px] uppercase tracking-[0.3em] font-semibold rounded-xl transition-all bg-surface/40 flex items-center justify-center gap-3 shadow-sm hover:shadow-md"
            >
              <Image 
                src="/Decoration/googlelogo.webp" 
                alt="Google Logo"
                width={18} 
                height={18}
                className="object-contain" 
              />
              <span>Register With Google</span>
            </button>
          </form>

          <div className="mt-10 text-center border-t border-card-border/50 pt-8">
            <Link href="/api/auth/signin" className="text-[9px] uppercase tracking-widest text-text-sub hover:text-accent transition-colors">
              Already a member? <span className="text-accent ml-1 font-bold">Sign In</span>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

const labelStyle = {
  color: "var(--color-text-sub)",
  fontSize: "11px",
  letterSpacing: "0.15em",
};

const inputStyles = {
  "& .MuiOutlinedInput-root": {
    color: "var(--color-text-main)",
    backgroundColor: "var(--color-surface)", 
    borderRadius: "12px",
    fontSize: "14px",
    "& fieldset": { borderColor: "var(--color-card-border)" },
    "&:hover fieldset": { borderColor: "var(--color-accent)" },
    "&.Mui-focused fieldset": { borderColor: "var(--color-accent)" },
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: "var(--color-accent)",
  }
};