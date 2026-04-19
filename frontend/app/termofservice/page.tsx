"use client";
import Link from "next/link";

export default function TOS() {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--text-sub)] p-8 md:p-16 transition-colors duration-500">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header & Navigation */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-6 border-b border-[var(--card-border)] pb-8">
          <div className="space-y-2">
            <h1 className="text-3xl md:text-5xl font-serif tracking-[0.2em] uppercase text-[var(--text-main)]">
              Terms of <span className="text-[var(--gold)]">Service</span>
            </h1>
            <p className="text-[10px] tracking-[0.3em] uppercase text-[var(--gold)] opacity-80">
              Jobphobia Wellness Platform
            </p>
          </div>

          <Link href="/" className="group mb-1">
            <span className="text-[11px] font-serif italic tracking-[0.3em] uppercase text-[var(--text-sub)] transition-all duration-500 group-hover:text-[var(--accent)]">
              Return Home
              <span className="block h-[1px] w-0 bg-[var(--accent)] transition-all duration-500 group-hover:w-full mt-1 opacity-50" />
            </span>
          </Link>
        </div>

        {/* Content Body */}
        <div className="space-y-12 text-sm md:text-base leading-relaxed backdrop-blur-sm bg-[var(--card-bg)]/30 p-8 md:p-12 rounded-2xl border border-[var(--card-border)] shadow-2xl">
          <div className="space-y-4">
            <p className="text-[var(--text-main)] leading-relaxed">
              Welcome to <strong>Jobphobia</strong> Platform. This platform
              provides a search and booking system for massage and spa services.
              By accessing or using our platform, you acknowledge that you have
              read, understood, and agreed to these terms in full.
            </p>
          </div>

          {/* Section 1 */}
          <section className="space-y-4">
            <h2 className="text-lg font-serif tracking-[0.2em] text-[var(--accent)] uppercase flex items-center gap-3">
              <span className="h-[1px] w-8 bg-[var(--gold)]"></span>
              1. Definitions
            </h2>
            <div className="pl-11 space-y-2 border-l border-[var(--card-border)] ml-1">
              <p>
                <strong className="text-[var(--text-main)]">"Platform":</strong>{" "}
                Website, application, or any system under Jobphobia.
              </p>
              <p>
                <strong className="text-[var(--text-main)]">"User":</strong> Any
                person who registers, opens an account, or uses the platform.
              </p>
              <p>
                <strong className="text-[var(--text-main)]">
                  "Service Provider":
                </strong>{" "}
                Massage shops, spas, or therapists registered on the platform.
              </p>
            </div>
          </section>

          {/* Section 2 */}
          <section className="space-y-4">
            <h2 className="text-lg font-serif tracking-[0.2em] text-[var(--accent)] uppercase flex items-center gap-3">
              <span className="h-[1px] w-8 bg-[var(--gold)]"></span>
              2. User Accounts & Data
            </h2>
            <div className="pl-11 border-l border-[var(--card-border)] ml-1 space-y-3">
              <p>
                To provide complete service, users must provide accurate
                personal data:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong className="text-[var(--text-main)]">
                    Data Accuracy:
                  </strong>{" "}
                  You agree to provide truthful information including name,
                  phone number, and email.
                </li>
                <li>
                  <strong className="text-[var(--text-main)]">
                    Profile Insights:
                  </strong>{" "}
                  We collect booking history and preferences (e.g., massage
                  pressure, focus areas, or health conditions) for your safety
                  and better experience.
                </li>
                <li>
                  <strong className="text-[var(--text-main)]">
                    PDPA Compliance:
                  </strong>{" "}
                  Data collection follows our Privacy Policy in accordance with
                  the Personal Data Protection Act.
                </li>
              </ul>
            </div>
          </section>

          {/* Section 3 */}
          <section className="space-y-4">
            <h2 className="text-lg font-serif tracking-[0.2em] text-[var(--accent)] uppercase flex items-center gap-3">
              <span className="h-[1px] w-8 bg-[var(--gold)]"></span>
              3. Scope of Service
            </h2>
            <div className="pl-11 border-l border-[var(--card-border)] ml-1 space-y-2">
              <p>
                <strong className="text-[var(--text-main)]">
                  Intermediary Role:
                </strong>{" "}
                We act only as a "Middleman" matching users with providers. We
                do not own the shops or employ the therapists.
              </p>
              <p>
                <strong className="text-[var(--text-main)]">
                  Booking Completion:
                </strong>{" "}
                Bookings are confirmed only after system validation and deposit
                payment (if required).
              </p>
            </div>
          </section>

          {/* Section 4 */}
          <section className="space-y-4">
            <h2 className="text-lg font-serif tracking-[0.2em] text-[var(--accent)] uppercase flex items-center gap-3">
              <span className="h-[1px] w-8 bg-[var(--gold)]"></span>
              4. Payment & Cancellation
            </h2>
            <p className="pl-11 border-l border-[var(--card-border)] ml-1">
              Cancellation policies are determined by each provider. Late
              cancellations or "No-shows" may result in a forfeited deposit as
              per the shop's specific policy.
            </p>
          </section>

          {/* Section 5 */}
          <section className="space-y-4">
            <h2 className="text-lg font-serif tracking-[0.2em] text-[var(--accent)] uppercase flex items-center gap-3">
              <span className="h-[1px] w-8 bg-[var(--gold)]"></span>
              5. User Responsibilities
            </h2>
            <div className="pl-11 border-l border-[var(--card-border)] ml-1 space-y-3">
              <p>
                <strong className="text-[var(--text-main)]">
                  Punctuality:
                </strong>{" "}
                Please arrive 10-15 minutes early. Arriving late may result in
                reduced service time.
              </p>
              <p>
                <strong className="text-[var(--text-main)]">
                  Health Disclosure:
                </strong>{" "}
                Users <strong className="text-[var(--red)]">must</strong> inform
                therapists of any health issues, injuries, or pregnancy. We are
                not liable for injuries resulting from concealed information.
              </p>
            </div>
          </section>

          {/* Section 6 */}
          <section className="space-y-4">
            <h2 className="text-lg font-serif tracking-[0.2em] text-[var(--accent)] uppercase flex items-center gap-3">
              <span className="h-[1px] w-8 bg-[var(--gold)]"></span>
              6. Limitation of Liability
            </h2>
            <p className="pl-11 border-l border-[var(--card-border)] ml-1">
              The Platform is not responsible for any injuries, property loss,
              or dissatisfaction occurring during service. We do not guarantee
              uninterrupted website availability during maintenance.
            </p>
          </section>

          {/* Section 7 */}
          <section className="space-y-4">
            <h2 className="text-lg font-serif tracking-[0.2em] text-[var(--red)] uppercase flex items-center gap-3">
              <span className="h-[1px] w-8 bg-[var(--red)]"></span>
              7. Termination
            </h2>
            <p className="pl-11 border-l border-[var(--card-border)] ml-1">
              We reserve the right to suspend or terminate accounts that violate
              these terms or exhibit harmful behavior without prior notice.
            </p>
          </section>

          {/* Contact Us Footer */}
          <div className="pt-12 mt-8 border-t border-[var(--card-border)] flex flex-col items-center space-y-6">
            <div className="text-center space-y-2">
              <h3 className="text-lg font-serif text-[var(--text-main)] uppercase tracking-widest">
                Contact Us
              </h3>
              <p className="text-sm opacity-70">
                Email: support@XXXXXXXXXXX.com | Tel: 02-XXX-XXXX
              </p>
            </div>

            <p className="text-[9px] tracking-[0.4em] uppercase text-[var(--text-sub)] opacity-50">
              Last Updated: April 2026
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
