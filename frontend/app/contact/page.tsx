
"use client";

import { useState } from "react";
import { TextField } from "@mui/material";

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Sending message:", formData);
    setIsSubmitted(true);
  };

  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col items-center py-32 px-8">
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-serif uppercase tracking-widest text-text-main">Contact Us</h1>
          <p className="text-[10px] text-text-sub uppercase tracking-[0.3em] mt-2">We'd love to hear from you</p>
          <div className="h-[1px] w-12 bg-accent/30 mx-auto mt-6" />
        </div>

        <div className="bg-card border border-card-border rounded-2xl p-12 shadow-2xl">
          {isSubmitted ? (
            <div className="text-center py-10">
              <h3 className="text-xl text-accent font-bold mb-2">Message Sent!</h3>
              <p className="text-text-sub text-sm">Thank you for reaching out. We will get back to you soon.</p>
              <button 
                onClick={() => setIsSubmitted(false)}
                className="mt-6 text-[10px] text-text-sub underline uppercase tracking-widest"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-8">
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
                type="email"
                variant="outlined"
                fullWidth
                required
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                InputLabelProps={{ style: labelStyle }}
                sx={inputStyles}
              />
              <TextField
                label="Your Message"
                variant="outlined"
                fullWidth
                required
                multiline
                rows={4}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                InputLabelProps={{ style: labelStyle }}
                sx={inputStyles}
              />
              
              <button
                type="submit"
                className="w-full py-4 bg-accent hover:opacity-90 text-white text-[10px] uppercase tracking-[0.3em] font-semibold rounded-xl transition-all shadow-lg shadow-accent/20 active:scale-[0.98]"
              >
                Send Message
              </button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}

const labelStyle = { color: "var(--color-text-sub)", fontSize: "11px", letterSpacing: "0.15em" };
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
  "& .MuiInputLabel-root.Mui-focused": { color: "var(--color-accent)" }
};