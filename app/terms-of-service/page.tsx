import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';

export const metadata = {
  title: 'Terms of Service - OmniThread AI',
  description: 'Read the terms and conditions for using OmniThread AI.',
};

export default function TermsOfService() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20 pt-32">
        <h1 className="text-4xl font-bold text-white mb-8">Terms of Service</h1>

        <div className="space-y-8 text-muted-foreground">
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">1. Acceptance of Terms</h2>
            <p>
              By accessing and using OmniThread AI, you accept and agree to be bound by the terms and
              provision of this agreement. If you do not agree to abide by the above, please do not use
              this service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">2. Use License</h2>
            <p>
              Permission is granted to temporarily download one copy of the materials (information or
              software) on OmniThread AI for personal, non-commercial transitory viewing only. This is the
              grant of a license, not a transfer of title, and under this license you may not:
            </p>
            <ul className="list-disc list-inside space-y-2 mt-4">
              <li>Modify or copy the materials</li>
              <li>Use the materials for any commercial purpose or for any public display</li>
              <li>Attempt to decompile or reverse engineer any software contained on the site</li>
              <li>Remove any copyright or other proprietary notations from the materials</li>
              <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">3. Disclaimer</h2>
            <p>
              The materials on OmniThread AI are provided on an 'as is' basis. OmniThread AI makes no
              warranties, expressed or implied, and hereby disclaims and negates all other warranties
              including, without limitation, implied warranties or conditions of merchantability, fitness
              for a particular purpose, or non-infringement of intellectual property or other violation of
              rights.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">4. Limitations</h2>
            <p>
              In no event shall OmniThread AI or its suppliers be liable for any damages (including, without
              limitation, damages for loss of data or profit, or due to business interruption) arising out of
              the use or inability to use the materials on OmniThread AI.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">5. Content Responsibility</h2>
            <p>
              Users are responsible for all content they input into OmniThread AI and the generated outputs.
              You agree not to use the service to create content that is illegal, infringing, or harmful to
              others.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">6. Modification of Terms</h2>
            <p>
              OmniThread AI may revise these terms of service for its website at any time without notice. By
              using this website, you are agreeing to be bound by the then current version of these terms of
              service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Contact Information</h2>
            <p>
              If you have any questions about these Terms of Service, please contact us at
              hello@omnithread.ai
            </p>
          </section>
        </div>
      </div>

      <Footer />
    </main>
  );
}
