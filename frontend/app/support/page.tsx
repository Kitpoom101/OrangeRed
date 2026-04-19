"use client";

import { useState } from "react";
import Link from "next/link";

const faqs = [
  { question: "How do I reset my password?", answer: "You can reset your password by clicking on 'Forgot Password' on the login page." },
  { question: "Can I change my account role later?", answer: "Currently, account roles are permanent. You will need to create a new account to switch between User and Shop Owner." },
  { question: "Where can I view my order history?", answer: "Log into your account and navigate to the 'Dashboard' section to view your history." }
];

export default function SupportPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col items-center py-32 px-8">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-serif uppercase tracking-widest text-text-main">Help Center</h1>
          <p className="text-[10px] text-text-sub uppercase tracking-[0.3em] mt-2">How can we help you today?</p>
          <div className="h-[1px] w-12 bg-accent/30 mx-auto mt-6" />
        </div>

        {/* Quick Contact Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
          <div className="bg-card border border-card-border rounded-2xl p-6 flex flex-col items-center text-center hover:border-accent transition-colors">
            <h3 className="text-text-main font-bold tracking-wider mb-2">Live Chat</h3>
            <p className="text-xs text-text-sub mb-4">Chat with our team directly.</p>
            <button className="text-[10px] bg-accent/10 text-accent px-4 py-2 rounded-lg font-bold uppercase tracking-widest">Start Chat</button>
          </div>
          <div className="bg-card border border-card-border rounded-2xl p-6 flex flex-col items-center text-center hover:border-accent transition-colors">
            <h3 className="text-text-main font-bold tracking-wider mb-2">Email Support</h3>
            <p className="text-xs text-text-sub mb-4">Send us a detailed message.</p>
            <Link href="/contact" className="text-[10px] bg-surface text-text-main border border-card-border px-4 py-2 rounded-lg font-bold uppercase tracking-widest hover:bg-card-border transition-colors">
              Go to Contact
            </Link>
          </div>
        </div>

        {/* FAQ Section */}
        <div>
          <h2 className="text-xl font-serif text-text-main mb-6 uppercase tracking-widest border-b border-card-border pb-4">Frequently Asked Questions</h2>
          <div className="flex flex-col gap-3">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-card border border-card-border rounded-xl overflow-hidden transition-all">
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full p-5 text-left flex justify-between items-center bg-surface/30 hover:bg-surface/50"
                >
                  <span className="text-sm font-semibold text-text-main">{faq.question}</span>
                  <span className="text-accent text-xl">{openFaq === index ? "−" : "+"}</span>
                </button>
                <div 
                  className={`overflow-hidden transition-all duration-300 ${openFaq === index ? "max-h-40 p-5 pt-0 border-t border-card-border/50" : "max-h-0 px-5"}`}
                >
                  <p className="text-sm text-text-sub mt-4">{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </main>
  );
}