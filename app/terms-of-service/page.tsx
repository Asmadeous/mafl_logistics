import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Terms of Service | MAFL Logistics",
  description: "Terms of Service for MAFL Logistics - Your trusted logistics partner in East Africa",
}

export default function TermsOfServicePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8 text-center">Terms of Service</h1>
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-muted-foreground mb-6">Last Updated: {new Date().toLocaleDateString()}</p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
            <p>
              Welcome to MAISHA AGROFARM LIMITED LOGISTICS ("MAFL Logistics", "we", "our", or "us"). These Terms of
              Service ("Terms") govern your use of our website, products, and services. By accessing or using our
              services, you agree to be bound by these Terms. If you disagree with any part of the Terms, you may not
              access our services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. Services Description</h2>
            <p>
              MAFL Logistics provides logistics and transportation services across Kenya and East Africa, including but
              not limited to:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-2">
              <li>Cross-Border Logistics</li>
              <li>Project Cargo & Oversized Load Transport</li>
              <li>Hazardous Goods Transportation</li>
              <li>Last-Mile Delivery</li>
              <li>Fleet Leasing & Contract Hauling</li>
              <li>Cold Chain Logistics</li>
              <li>Heavy Machinery Hire</li>
              <li>Road Construction Services</li>
            </ul>
            <p className="mt-2">
              The specific services provided to you will be outlined in a separate service agreement or contract. These
              Terms apply to all services provided by MAFL Logistics.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. User Obligations</h2>
            <p>By using our services, you agree to:</p>
            <ul className="list-disc pl-6 mt-2 space-y-2">
              <li>Provide accurate and complete information when using our services</li>
              <li>Comply with all applicable laws and regulations</li>
              <li>
                Ensure that all goods transported through our services are legal and properly declared, with appropriate
                documentation
              </li>
              <li>Pay all fees and charges associated with your use of our services</li>
              <li>Not use our services for any illegal or unauthorized purpose</li>
              <li>
                Not attempt to decompile, reverse engineer, disassemble or hack any of our systems or interfere with
                service delivery
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. Payment Terms</h2>
            <p>
              Payment terms will be specified in your service agreement or contract. Unless otherwise stated, payment is
              due upon receipt of invoice. We accept various payment methods as communicated to you during the service
              booking process.
            </p>
            <p className="mt-2">
              Late payments may result in late fees, service suspension, or termination. All fees are non-refundable
              unless otherwise specified in your service agreement or required by law.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. Liability Limitations</h2>
            <p>
              Our liability for loss or damage to goods during transport is limited as specified in your service
              agreement and applicable transportation laws. We are not liable for:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-2">
              <li>Delays caused by factors beyond our reasonable control</li>
              <li>
                Loss or damage resulting from improper packaging, incorrect declarations, or insufficient documentation
              </li>
              <li>Indirect, consequential, or incidental damages</li>
              <li>Force majeure events including natural disasters, civil unrest, or government actions</li>
            </ul>
            <p className="mt-2">
              We recommend that customers obtain appropriate insurance coverage for goods in transit. Insurance options
              may be available through MAFL Logistics upon request.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. Intellectual Property</h2>
            <p>
              All content on our website, including text, graphics, logos, images, and software, is the property of MAFL
              Logistics or its content suppliers and is protected by Kenyan and international copyright laws. The
              compilation of all content on this site is the exclusive property of MAFL Logistics.
            </p>
            <p className="mt-2">
              You may not reproduce, duplicate, copy, sell, resell, or exploit any portion of our website or services
              without express written permission from MAFL Logistics.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. Termination</h2>
            <p>
              We may terminate or suspend your access to our services immediately, without prior notice or liability,
              for any reason, including without limitation if you breach these Terms.
            </p>
            <p className="mt-2">
              Upon termination, your right to use our services will immediately cease. All provisions of these Terms
              which by their nature should survive termination shall survive termination, including, without limitation,
              ownership provisions, warranty disclaimers, indemnity, and limitations of liability.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">8. Governing Law</h2>
            <p>
              These Terms shall be governed and construed in accordance with the laws of Kenya, without regard to its
              conflict of law provisions.
            </p>
            <p className="mt-2">
              Our failure to enforce any right or provision of these Terms will not be considered a waiver of those
              rights. If any provision of these Terms is held to be invalid or unenforceable by a court, the remaining
              provisions of these Terms will remain in effect.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">9. Dispute Resolution</h2>
            <p>
              Any disputes arising out of or relating to these Terms or our services shall first be attempted to be
              resolved through good faith negotiations. If such negotiations fail, the dispute shall be submitted to
              arbitration in Nairobi, Kenya, in accordance with the Arbitration Rules of the Nairobi Centre for
              International Arbitration.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">10. Changes to Terms</h2>
            <p>
              We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision
              is material, we will try to provide at least 30 days' notice prior to any new terms taking effect.
            </p>
            <p className="mt-2">
              By continuing to access or use our services after those revisions become effective, you agree to be bound
              by the revised terms. If you do not agree to the new terms, please stop using our services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">11. Contact Us</h2>
            <p>If you have any questions about these Terms, please contact us:</p>
            <ul className="list-none mt-2 space-y-2">
              <li>By email: maishaagrofarmlimited@gmail.com</li>
              <li>By phone: +254 711 111 017</li>
              <li>By mail: Malili, Konza, Rift Valley, Kenya</li>
            </ul>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}
