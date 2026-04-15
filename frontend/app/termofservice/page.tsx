"use client";
import Link from "next/link";

export default function TOS() {
  return (
    <div className="min-h-screen bg-[#0f172a] text-gray-300 p-8 md:p-16">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header และ ปุ่มย้อนกลับ */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-6 border-b border-gray-800/50 pb-6">
          <h1 className="text-3xl md:text-4xl font-serif tracking-widest uppercase text-gray-100">
            Terms of Service
          </h1>
          <Link href="/" className="group mb-1">
            <span className="text-[11px] font-serif italic tracking-[0.3em] uppercase text-gray-500 transition-all duration-500 group-hover:text-blue-300">
              Return Home
              <span className="block h-[1px] w-0 bg-blue-300 transition-all duration-500 group-hover:w-full mt-1 opacity-50" />
            </span>
          </Link>
        </div>

        {/* เนื้อหา Terms of Service (สามารถเปลี่ยนข้อความด้านในได้เลย) */}
        <div className="space-y-10 text-sm md:text-base leading-relaxed text-gray-400">
          <section className="space-y-4">
            <h2 className="text-lg font-serif tracking-[0.1em] text-gray-200 uppercase">
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing and using JobPhobia Massage ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. In addition, when using these particular services, you shall be subject to any posted guidelines or rules applicable to such services.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-serif tracking-[0.1em] text-gray-200 uppercase">
              2. Description of Service
            </h2>
            <p>
              JobPhobia Massage provides digital wellness experiences tailored for individuals experiencing job-related phobias. We reserve the right to modify, suspend, or discontinue the Service at any time without notice.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-serif tracking-[0.1em] text-gray-200 uppercase">
              3. User Conduct
            </h2>
            <p>
              Users agree to use the Service only for lawful purposes and in a way that does not infringe the rights of, restrict, or inhibit anyone else's use and enjoyment of the Service. Prohibited behavior includes harassing or causing distress or inconvenience to any other user, transmitting obscene or offensive content, or disrupting the normal flow of dialogue within the Service.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-serif tracking-[0.1em] text-gray-200 uppercase">
              4. Disclaimer of Warranties
            </h2>
            <p>
              The Service is provided on an "as is" and "as available" basis. JobPhobia Massage makes no representations or warranties of any kind, express or implied, as to the operation of the Service or the information, content, or materials included on the Service. You expressly agree that your use of the Service is at your sole risk.
            </p>
          </section>
          
          <div className="pt-12 border-t border-gray-800/50 text-[10px] tracking-[0.2em] uppercase text-gray-500 text-center">
            Last Updated: April 2026
          </div>
        </div>
      </div>
    </div>
  );
}