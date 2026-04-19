"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { TextField } from "@mui/material";
import Image from "next/image";
import TermsContent from "../../component/TermsContent/termsContent";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    tel: "",
    password: "",
    role: "user",
  });
  
  const [error, setError] = useState<string>("");
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    tel: "",
    password: "",
  });

  // [NEW] State สำหรับจัดการ Terms of Service
  const [isTosOpen, setIsTosOpen] = useState(false);
  const [hasReadTos, setHasReadTos] = useState(false);
  const [isAgreed, setIsAgreed] = useState(false);
  const [tosError, setTosError] = useState("");

  const router = useRouter();

  const selectRole = (role: "user" | "shopowner") => {
    setFormData((prev) => ({ ...prev, role }));
    document.cookie = `register_role=${role}; path=/; max-age=600; samesite=lax`;
  };

  const validateForm = () => {
    const newErrors = {
      name: "",
      email: "",
      tel: "",
      password: "",
    };

    if (!formData.name.trim()) newErrors.name = "Name is required";

    if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Invalid email format";

    if (!/^\d{10}$/.test(formData.tel))
      newErrors.tel = "Telephone must be 10 digits";

    if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";

    setErrors(newErrors);

    return Object.values(newErrors).some(e => e !== "");
  };

  // [NEW] ฟังก์ชันเช็คการเลื่อนอ่าน Term of service
  const handleScrollTos = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    // เผื่อค่าความคลาดเคลื่อน 10px ป้องกันการเช็คที่เป๊ะจนเกินไป
    if (Math.ceil(scrollTop + clientHeight) >= scrollHeight - 10) {
      setHasReadTos(true);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setTosError(""); // ล้างข้อความแจ้งเตือนเดิม

    // [NEW] เช็คว่ากดติ๊กยอมรับหรือยัง ถ้ายังให้โชว์ข้อความสีแดง
    if (!isAgreed) {
      setTosError("* กรุณาอ่านและยอมรับ Terms of Service ก่อนทำการสมัคร");
      return;
    }

    const hasError = validateForm();
    if (hasError) return;

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
    <>
      <main className="min-h-screen bg-background text-foreground flex flex-col items-center justify-start px-8 py-32 transition-colors duration-500 relative z-0">
        <div className="max-w-md w-full">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-serif uppercase tracking-widest text-text-main">Create Account</h1>
            <p className="text-[10px] text-text-sub uppercase tracking-[0.3em] mt-2">Join the Wellness Experience</p>
            <div className="h-[1px] w-12 bg-accent/30 mx-auto mt-6" />
          </div>

          <div className="bg-card border border-card-border rounded-2xl p-12 backdrop-blur-sm shadow-2xl transition-colors">
            <form onSubmit={handleRegister} className="flex flex-col gap-10" noValidate>
              
              <TextField
                label="Full Name"
                variant="outlined"
                fullWidth
                required
                error={!!errors.name}
                helperText={errors.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                InputLabelProps={{ style: labelStyle }}
                sx={inputStyles}
              />

              <TextField
                label="Email Address"
                variant="outlined"
                fullWidth
                type="email"
                error={!!errors.email}
                helperText={errors.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                InputLabelProps={{ style: labelStyle }}
                sx={inputStyles}
              />

              <TextField
                label="Telephone (10 Digits)"
                variant="outlined"
                fullWidth
                required
                error={!!errors.tel}
                helperText={errors.tel}
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
                error={!!errors.password}
                helperText={errors.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                InputLabelProps={{ style: labelStyle }}
                sx={inputStyles}
              />

              <div className="space-y-3">
                <p className="text-[10px] uppercase tracking-[0.2em] text-text-sub text-center">
                  Select Account Type
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => selectRole("shopowner")}
                    className={`py-3 rounded-xl border text-[10px] uppercase tracking-[0.2em] transition-all ${
                      formData.role === "shopowner"
                        ? "border-accent text-accent bg-accent/10"
                        : "border-card-border text-text-sub bg-surface/30 hover:border-text-sub"
                    }`}
                  >
                    Shop Owner
                  </button>
                  <button
                    type="button"
                    onClick={() => selectRole("user")}
                    className={`py-3 rounded-xl border text-[10px] uppercase tracking-[0.2em] transition-all ${
                      formData.role === "user"
                        ? "border-accent text-accent bg-accent/10"
                        : "border-card-border text-text-sub bg-surface/30 hover:border-text-sub"
                    }`}
                  >
                    Client
                  </button>
                </div>
              </div>

              {/* [NEW] เช็คบ็อกซ์ยอมรับเงื่อนไข */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="tos-checkbox"
                    checked={isAgreed}
                    onClick={!hasReadTos ? () => setIsTosOpen(true):()=>{}}
                    onChange={(e) => setIsAgreed(e.target.checked)}
                    className="w-4 h-4 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 accent-accent"
                  />
                  <label htmlFor="tos-checkbox" className="text-[11px] text-text-sub tracking-wider">
                    I agree to the{" "}
                    <button
                      type="button"
                      onClick={() => setIsTosOpen(true)}
                      className="text-accent underline hover:text-accent/80 font-bold"
                    >
                      Terms of Service
                    </button>
                  </label>
                </div>
                {/* [NEW] แสดงข้อความสีแดงหากกดสมัครโดยไม่ได้ติ๊ก */}
                {tosError && (
                  <p className="text-red-500 text-[10px] uppercase tracking-wider">
                    {tosError}
                  </p>
                )}
                {!hasReadTos && !isAgreed && (
                  <p className="text-[10px] text-text-sub/50 uppercase tracking-wider">
                    * Please click on Terms of Service and read to the bottom
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-accent hover:opacity-90 text-white text-[10px] uppercase tracking-[0.3em] font-semibold rounded-xl transition-all shadow-lg shadow-accent/20"
              >
                Create Account
              </button>
        
              <button
                type="button"
                onClick={() => signIn("google", { callbackUrl: "/", role: formData.role })}
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

      {/* [NEW] Modal (Pop-up) สำหรับอ่าน Term of Service */}
      {isTosOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-card border border-card-border rounded-2xl w-full max-w-lg shadow-2xl flex flex-col max-h-[80vh]">
            <div className="p-6 border-b border-card-border flex justify-between items-center">
              <h2 className="text-xl font-serif text-text-main">Terms of Service</h2>
              <button onClick={() => setIsTosOpen(false)} className="text-text-sub hover:text-red-500">
                ✕
              </button>
            </div>
            
            {/* กล่องเนื้อหาที่ต้อง Scroll (นำ Component ที่แยกไว้มาใส่) */}
            <div
              className="p-6 overflow-y-auto flex-1 text-sm text-text-sub"
              onScroll={handleScrollTos}
            >
              <TermsContent />
            </div>

            <div className="p-6 border-t border-card-border flex justify-between items-center bg-surface/50 rounded-b-2xl">
              <span className="text-[10px] text-red-400 uppercase tracking-widest font-semibold">
                {!hasReadTos ? "โปรดเลื่อนอ่านจนสุดบรรทัดสุดท้าย" : "คุณสามารถกดยอมรับได้แล้ว"}
              </span>
              <button
                type="button"
                disabled={!hasReadTos}
                onClick={() => {
                  setIsAgreed(true);
                  setIsTosOpen(false);
                  setTosError(""); // ล้าง error ถ้าเคยกดผิดมา
                }}
                className={`px-6 py-2 text-[10px] uppercase tracking-widest font-bold rounded-lg transition-all ${
                  hasReadTos 
                    ? "bg-accent text-white hover:opacity-90 shadow-lg shadow-accent/20" 
                    : "bg-surface text-text-sub border border-card-border cursor-not-allowed opacity-50"
                }`}
              >
                Accept & Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
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
    "& hover fieldset": { borderColor: "var(--color-accent)" },
    "&.Mui-focused fieldset": { borderColor: "var(--color-accent)" },
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: "var(--color-accent)",
  }
};