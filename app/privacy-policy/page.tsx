import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';

export const metadata = {
  title: 'Privacy Policy - OmniThread AI',
  description: 'Learn how OmniThread AI protects your data and privacy.',
};

export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20 pt-32">
        <h1 className="text-4xl font-bold text-white mb-8">Privacy Policy</h1>

        <div className="space-y-8 text-muted-foreground">
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">1. Information We Collect</h2>
            <p>
              We collect information you provide directly to us, such as when you create an account,
              generate content, or provide feedback. This includes your name, email address, and the
              content you input into our service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">2. How We Use Your Information</h2>
            <p>
              We use the information we collect to provide, maintain, and improve our service. Your
              input content is processed by our AI models to generate output, but we do not store your
              generated content longer than necessary.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">3. Data Security</h2>
            <p>
              We take data security seriously and implement appropriate technical and organizational
              measures to protect your information against unauthorized access, alteration, disclosure,
              or destruction.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">4. Third-Party Services</h2>
            <p>
              We use third-party services for authentication (Supabase) and AI processing (Google
              Gemini, Groq). These services have their own privacy policies that apply to your use.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">5. Your Rights</h2>
            <p>
              You have the right to access, modify, or delete your personal data at any time. Contact
              us at hello@omnithread.ai to exercise these rights.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">6. Changes to This Policy</h2>
            <p>
              We may update this privacy policy from time to time. We will notify you of any significant
              changes by email or through our service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Contact Us</h2>
            <p>
              If you have any questions about this privacy policy, please contact us at
              hello@omnithread.ai
            </p>
          </section>
        </div>
      </div>

      <Footer />
    </main>
  );
}
