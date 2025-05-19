// If this file exists, update it to use our new component
import FAQSection from "@/components/faq-section"
import PageBanner from "@/components/page-banner"

// Update the page to use dark text in light mode
export default function FAQPage() {
  const allFaqs = [
    {
      question: "What areas does MAFL Logistics operate in?",
      answer:
        "MAFL Logistics operates throughout Kenya and East Africa, with a focus on major transport corridors and cross-border routes.",
    },
    {
      question: "What types of cargo does MAFL transport?",
      answer:
        "We specialize in bulk cargo, oversized equipment, construction materials, and general freight across various industries.",
    },
    {
      question: "How does MAFL ensure cargo safety?",
      answer:
        "We implement rigorous safety protocols, use modern tracking technology, and employ experienced drivers trained in cargo security.",
    },
    {
      question: "Does MAFL handle customs clearance for cross-border shipments?",
      answer:
        "Yes, we provide comprehensive customs clearance services to ensure smooth cross-border operations for our clients.",
    },
    {
      question: "What makes MAFL different from other logistics providers?",
      answer:
        "Our deep local knowledge, dedicated customer service, modern fleet, and commitment to reliability set us apart in the East African logistics market.",
    },
    // Add more FAQs as needed
  ]

  return (
    <div className="min-h-screen">
      {/* <PageBanner
        title="Frequently Asked Questions"
        subtitle="Find answers to common questions about our logistics services"
        backgroundImage="/logistics-background.png"
      /> */}

      <FAQSection faqs={allFaqs} />
    </div>
  )
}
