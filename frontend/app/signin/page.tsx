"use client";
import { TextField, Alert } from "@mui/material";
import { signIn } from "next-auth/react";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image"; // เพิ่ม Import Image
import { useRouter } from "next/navigation";

export default function SigninPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await signIn("credentials", {
      redirect: false, 
      email,
      password,
    });

    if (res?.error) {
      setError(res.error);
      setLoading(false);
    } else if (res?.ok) {
      router.push("/");
      router.refresh(); 
    }
  };

  return (
    // 1. ปรับสีพื้นหลังและตัวหนังสือตาม Theme
    <main className="min-h-screen bg-background text-foreground flex flex-col items-center justify-start px-8 py-32 transition-colors duration-500">
      <div className="max-w-md w-full">
        <div className="text-center mb-14">
          <h1 className="text-3xl font-serif uppercase tracking-[0.3em] text-text-main">
            Welcome Back
          </h1>
          <p className="text-[10px] text-text-sub uppercase tracking-[0.3em] mt-4">
            Sign in to your account
          </p>
          <div className="h-[1px] w-12 bg-accent/30 mx-auto mt-8" />
        </div>

        {/* 2. ปรับ Card Style */}
        <div className="bg-card border border-card-border rounded-2xl p-12 backdrop-blur-md shadow-2xl transition-all">
          
          {error && (
            <Alert severity="error" sx={{ mb: 3, backgroundColor: 'rgba(211, 47, 47, 0.1)', color: '#ef4444', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-10 mt-6">
            <TextField
              onChange={(e) => setEmail(e.target.value)}
              label="Email Address"
              variant="outlined"
              fullWidth
              required
              InputLabelProps={{ style: labelStyle }}
              sx={inputStyles}
            />

            <TextField
              onChange={(e) => setPassword(e.target.value)}
              label="Password"
              type="password"
              variant="outlined"
              fullWidth
              required
              InputLabelProps={{ style: labelStyle }}
              sx={inputStyles}
            />

            {/* ปุ่ม Login ใช้สี Accent */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-accent hover:opacity-90 text-white text-[10px] uppercase tracking-[0.4em] font-bold rounded-xl transition-all duration-300 shadow-lg shadow-accent/20 disabled:opacity-50"
            >
              {loading ? "Locking in..." : "Log In"}
            </button>

            {/* 3. ปุ่ม Google พร้อมโลโก้และ Transition ที่รวดเร็ว */}
            <button
              type="button"
              onClick={() => signIn("google", { callbackUrl: "/" })}
              className="w-full py-4 border cursor-pointer border-card-border hover:border-text-sub text-text-main text-[10px] uppercase tracking-[0.3em] font-semibold rounded-xl bg-surface/40 flex items-center justify-center gap-3 transition-[background-color,border-color,color] duration-150 ease-out"
            >
              <Image 
                src="/Decoration/googlelogo.webp" 
                alt="Google Logo"
                width={18}
                height={18}
                className="object-contain"
              />
              <span>Continue With Google</span>
            </button>
          </form>

          <div className="mt-10 text-center border-t border-card-border/50 pt-8">
            <Link
              href="/register"
              className="text-[9px] uppercase tracking-[0.2em] text-text-sub hover:text-accent transition-colors duration-300"
            >
              Don't have an account?{" "}
              <span className="text-accent ml-1 font-bold">Register</span>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

// 4. สไตล์ของ Label
const labelStyle = {
  color: "var(--color-text-sub)",
  fontSize: "11px",
  letterSpacing: "0.15em",
};

// 5. สไตล์ของ Input ดึงค่าจาก CSS Variables
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