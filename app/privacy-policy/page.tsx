import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Privacy Policy | MAFL Logistics",
  description: "Privacy Policy for MAFL Logistics - Your trusted logistics partner in East Africa",
}

export default function PrivacyPolicyPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8 text-center">Privacy Policy</h1>
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-muted-foreground mb-6">Last Updated: {new Date().toLocaleDateString()}</p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
            <p>
              MAISHA AGROFARM LIMITED LOGISTICS ("MAFL Logistics", "we", "our", or "us") respects your privacy and is
              committed to protecting your personal data. This privacy policy will inform you about how we look after
              your personal data when you visit our website and use our services, and tell you about your privacy rights
              and how the law protects you.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. Information We Collect</h2>
            <p>We may collect, use, store and transfer different kinds of personal data about you, including:</p>
            <ul className="list-disc pl-6 mt-2 space-y-2">
              <li>
                <strong>Identity Data</strong>: includes first name, last name, username or similar identifier, title.
              </li>
              <li>
                <strong>Contact Data</strong>: includes billing address, delivery address, email address and telephone
                numbers.
              </li>
              <li>
                <strong>Transaction Data</strong>: includes details about payments to and from you and other details of
                products and services you have purchased from us.
              </li>
              <li>
                <strong>Technical Data</strong>: includes internet protocol (IP) address, your login data, browser type
                and version, time zone setting and location, browser plug-in types and versions, operating system and
                platform, and other technology on the devices you use to access this website.
              </li>
              <li>
                <strong>Usage Data</strong>: includes information about how you use our website and services.
              </li>
              <li>
                <strong>Marketing and Communications Data</strong>: includes your preferences in receiving marketing
                from us and our third parties and your communication preferences.
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. How We Use Your Information</h2>
            <p>
              We will only use your personal data when the law allows us to. Most commonly, we will use your personal
              data in the following circumstances:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-2">
              <li>To provide and maintain our services</li>
              <li>To notify you about changes to our services</li>
              <li>To provide customer support</li>
              <li>To gather analysis or valuable information so that we can improve our services</li>
              <li>To monitor the usage of our services</li>
              <li>To detect, prevent and address technical issues</li>
              <li>To fulfill any other purpose for which you provide it</li>
              <li>
                To carry out our obligations and enforce our rights arising from any contracts entered into between you
                and us
              </li>
              <li>In any other way we may describe when you provide the information</li>
              <li>For any other purpose with your consent</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. Data Security</h2>
            <p>
              We have implemented appropriate security measures to prevent your personal data from being accidentally
              lost, used, or accessed in an unauthorized way, altered, or disclosed. In addition, we limit access to
              your personal data to those employees, agents, contractors, and other third parties who have a business
              need to know. They will only process your personal data on our instructions, and they are subject to a
              duty of confidentiality.
            </p>
            <p className="mt-2">
              We have put in place procedures to deal with any suspected personal data breach and will notify you and
              any applicable regulator of a breach where we are legally required to do so.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. Cookies</h2>
            <p>
              We use cookies and similar tracking technologies to track the activity on our service and hold certain
              information. Cookies are files with a small amount of data which may include an anonymous unique
              identifier.
            </p>
            <p className="mt-2">
              You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However,
              if you do not accept cookies, you may not be able to use some portions of our service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. Third-Party Disclosure</h2>
            <p>We may disclose your personal data to third parties in the following circumstances:</p>
            <ul className="list-disc pl-6 mt-2 space-y-2">
              <li>To our service providers who perform services on our behalf</li>
              <li>To comply with a legal obligation</li>
              <li>To protect and defend our rights or property</li>
              <li>To prevent or investigate possible wrongdoing in connection with the service</li>
              <li>To protect the personal safety of users of the service or the public</li>
              <li>To protect against legal liability</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. Your Data Protection Rights</h2>
            <p>
              Under certain circumstances, you have rights under data protection laws in relation to your personal data,
              including:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-2">
              <li>The right to access your personal data</li>
              <li>The right to request correction of your personal data</li>
              <li>The right to request erasure of your personal data</li>
              <li>The right to object to processing of your personal data</li>
              <li>The right to request restriction of processing your personal data</li>
              <li>The right to request transfer of your personal data</li>
              <li>The right to withdraw consent</li>
            </ul>
            <p className="mt-2">
              If you wish to exercise any of these rights, please contact us using the details provided below.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">8. Changes to This Privacy Policy</h2>
            <p>
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new
              Privacy Policy on this page and updating the "Last Updated" date at the top of this Privacy Policy.
            </p>
            <p className="mt-2">
              You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy
              are effective when they are posted on this page.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">9. Contact Us</h2>
            <p>If you have any questions about this Privacy Policy, please contact us:</p>
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
