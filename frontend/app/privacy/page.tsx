import React from "react";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col items-center py-32 px-8">
      <div className="max-w-3xl w-full">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-serif uppercase tracking-widest text-text-main">Privacy Policy</h1>
          <p className="text-[10px] text-text-sub uppercase tracking-[0.3em] mt-2">Last updated: April 2026</p>
          <div className="h-[1px] w-12 bg-accent/30 mx-auto mt-6" />
        </div>

        <div className="bg-card border border-card-border rounded-2xl p-8 md:p-12 shadow-2xl space-y-8 text-sm text-text-sub leading-relaxed">
          <section>
            <h2 className="text-lg font-bold text-text-main mb-3 uppercase tracking-wider">1. Information We Collect</h2>
            <p>
              We collect information you provide directly to us when you create an account, fill out a form, 
              or communicate with us. This may include your name, email address, and phone number.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-text-main mb-3 uppercase tracking-wider">2. How We Use Your Information</h2>
            <p>
              We use the information we collect to provide, maintain, and improve our services, 
              to communicate with you, and to personalize your experience on our platform.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-text-main mb-3 uppercase tracking-wider">3. Data Security</h2>
            <p>
              We implement reasonable security measures to protect your personal information. 
              However, please be aware that no method of transmission over the internet is 100% secure.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}