// components/TermsContent.tsx
export default function TermsContent() {
  return (
    <div className="space-y-6 text-[var(--text-sub)] text-sm md:text-base leading-relaxed">
      {/* Header */}
      <h2 className="text-3xl font-bold text-[var(--text-main)] border-b border-[var(--card-border)] pb-4">
        Terms of Service
      </h2>
      <p className="italic text-[var(--gold)]">Last Updated: April 2026</p>

      <p className="text-[var(--text-main)]">
        Welcome to <strong>Orange Red</strong> Platform, This platform provides
        a search and booking system for massage and spa services. By accessing
        or using our platform, you ("User", "Customer") acknowledge that you
        have read, understood, and agreed to these terms in full.
      </p>

      {/* Section 1 */}
      <section>
        <h3 className="text-xl font-semibold text-[var(--accent)] mb-2">
          1. Definitions{" "}
        </h3>
        <ul className="list-none space-y-2 pl-4 border-l-2 border-[var(--gold)]">
          <li>
            <strong className="text-[var(--text-main)]">"Platform":</strong>{" "}
            Website, application, or any system under Jobphobia.
          </li>
          <li>
            <strong className="text-[var(--text-main)]">"User":</strong> Any
            person who registers, opens an account, or uses the platform.
          </li>
          <li>
            <strong className="text-[var(--text-main)]">
              "Service Provider":
            </strong>{" "}
            Massage shops, spas, or therapists registered on the platform.
          </li>
        </ul>
      </section>

      {/* Section 2 */}
      <section>
        <h3 className="text-xl font-semibold text-[var(--accent)] mb-2">
          2. User Accounts & Data
        </h3>
        <p className="mb-2">
          To provide complete service, users must provide accurate personal
          data:
        </p>
        <ul className="list-disc pl-6 space-y-1">
          <li>
            <strong className="text-[var(--text-main)]">Data Accuracy:</strong>{" "}
            You agree to provide truthful information including name, phone
            number, and email.
          </li>
          <li>
            <strong className="text-[var(--text-main)]">
              Profile Insights:
            </strong>{" "}
            We collect booking history and preferences (e.g., massage pressure,
            focus areas, or health conditions) for your safety and better
            experience.
          </li>
          <li>
            <strong className="text-[var(--text-main)]">
              PDPA Compliance:
            </strong>{" "}
            Data collection follows our Privacy Policy in accordance with the
            Personal Data Protection Act.
          </li>
        </ul>
      </section>

      {/* Section 3 */}
      <section>
        <h3 className="text-xl font-semibold text-[var(--accent)] mb-2">
          3. Scope of Service
        </h3>
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
      </section>

      {/* Section 4 */}
      <section>
        <h3 className="text-xl font-semibold text-[var(--accent)] mb-2">
          4. Payment & Cancellation
        </h3>
        <p>
          Cancellation policies are determined by each provider. Late
          cancellations or "No-shows" may result in a forfeited deposit as per
          the shop's specific policy.
        </p>
      </section>

      {/* Section 5 */}
      <section>
        <h3 className="text-xl font-semibold text-[var(--accent)] mb-2">
          5. User Responsibilities
        </h3>
        <p>
          <strong className="text-[var(--text-main)]">Punctuality:</strong>{" "}
          Please arrive 10-15 minutes early. Arriving late may result in reduced
          service time.
        </p>
        <p>
          <strong className="text-[var(--text-main)]">
            Health Disclosure:
          </strong>{" "}
          Users <strong className="text-[var(--red)]">must</strong> inform
          therapists of any health issues, injuries, or pregnancy. We are not
          liable for injuries resulting from concealed information.{" "}
        </p>
      </section>

      {/* Section 6 */}
      <section>
        <h3 className="text-xl font-semibold text-[var(--accent)] mb-2">
          6. Limitation of Liability
        </h3>
        <p>
          The Platform is not responsible for any injuries, property loss, or
          dissatisfaction occurring during service. We do not guarantee
          uninterrupted website availability during maintenance.
        </p>
      </section>

      {/* Section 7 */}
      <section>
        <h3 className="text-xl font-semibold text-[var(--accent)] mb-2">
          7. Termination
        </h3>
        <p>
          We reserve the right to suspend or terminate accounts that violate
          these terms or exhibit harmful behavior without prior notice.
        </p>
      </section>

      {/* Footer / Contact */}
      <div className="mt-10 p-6 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg shadow-sm">
        <h3 className="text-lg font-bold text-[var(--text-main)] mb-2">
          Contact Us
        </h3>
        <p className="text-sm">Email: support@XXXXXXXXXXX.com</p>
        <p className="text-sm">Tel: 02-XXX-XXXX</p>

        <div className="mt-6 pt-4 border-t border-[var(--card-border)] text-center">
          <p className="font-bold text-[var(--accent)]">
            By clicking "Accept", you agree to all terms and conditions
            mentioned above.
          </p>
        </div>
      </div>
    </div>
  );
}
