"use client";
import { TextField } from "@mui/material";
import { signIn } from "next-auth/react";
import { useState } from "react";
import Link from "next/link";
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
    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
      callbackUrl: "/",
    });

    if (result?.error) {
      setError("Invalid email or password.");
      setLoading(false);
      return;
    }
    if (result?.url) router.push(result.url);
    setLoading(false);
  };

  return (
    // Added py-32 to give it a massive gap from the top/bottom
    <main className="min-h-screen bg-[#0f172a] text-white flex flex-col items-center justify-start px-8 py-32">
      <div className="max-w-md w-full">
        {/* Header Section - Added mb-14 for more space before the card */}
        <div className="text-center mb-14">
          <h1 className="text-3xl font-serif uppercase tracking-[0.3em] text-gray-100">
            Welcome Back
          </h1>
          <p className="text-[10px] text-gray-500 uppercase tracking-[0.3em] mt-4">
            Sign in to your account
          </p>
          <div className="h-[1px] w-12 bg-blue-500/30 mx-auto mt-8" />
        </div>

        {/* Login Card - Increased p-12 for internal breathing room */}
        <div className="bg-[#1e2d3d]/40 border border-gray-700/30 rounded-2xl p-12 backdrop-blur-md shadow-2xl">
          <form onSubmit={handleSubmit} className="flex flex-col gap-10 mt-6">
            {error && (
              <p className="text-[10px] text-red-400 uppercase tracking-widest text-center bg-red-500/10 py-2 rounded">
                {error}
              </p>
            )}

            <TextField
              onChange={(e) => setEmail(e.target.value)}
              label="Email Address"
              variant="outlined"
              fullWidth
              InputLabelProps={{
                style: {
                  color: "#64748b",
                  fontSize: "11px",
                  letterSpacing: "0.15em",
                },
              }}
              sx={inputStyles}
            />

            <TextField
              onChange={(e) => setPassword(e.target.value)}
              label="Password"
              type="password"
              variant="outlined"
              fullWidth
              InputLabelProps={{
                style: {
                  color: "#64748b",
                  fontSize: "11px",
                  letterSpacing: "0.15em",
                },
              }}
              sx={inputStyles}
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 cursor-pointer bg-blue-600 hover:bg-blue-500 text-white text-[10px] uppercase tracking-[0.4em] font-bold rounded-xl transition-all duration-300 shadow-lg shadow-blue-900/40"
            >
              {loading ? "Locking in..." : "Log In"}
            </button>

            <button
              type="button"
              onClick={() => signIn("google", { callbackUrl: "/" })}
              className="w-full py-4 border cursor-pointer border-gray-600/70 hover:border-gray-400 text-gray-200 hover:text-white text-[10px] uppercase tracking-[0.3em] font-semibold rounded-xl transition-all duration-300 bg-[#0f172a]/60"
            >
              Continue With Google
            </button>
          </form>

          <div className="mt-10 text-center border-t border-gray-700/20 pt-8">
            <Link
              href="/register"
              className="text-[9px] uppercase tracking-[0.2em] text-gray-500 hover:text-white transition-colors duration-300"
            >
              Don't have an account?{" "}
              <span className="text-blue-400 ml-1">Register</span>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

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
