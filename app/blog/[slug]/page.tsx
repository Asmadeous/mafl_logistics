"use client"

import { Suspense } from "react"
import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { CalendarIcon, Clock, Share2, User } from "lucide-react"
import { format } from "date-fns"

// Mock blog post data
const mockPosts = {
  "future-of-logistics-east-africa": {
    id: "1",
    title: "The Future of Logistics in East Africa",
    slug: "future-of-logistics-east-africa",
    excerpt: "Exploring the emerging trends and technologies shaping the logistics industry across East Africa.",
    content: `
      <h2>The Evolving Landscape of Logistics in East Africa</h2>
      <p>The logistics industry in East Africa is undergoing a significant transformation, driven by technological advancements, changing consumer behaviors, and regional integration efforts. As we look to the future, several key trends are emerging that will shape the industry in the coming years.</p>
      
      <h3>Digital Transformation</h3>
      <p>Technology is revolutionizing how logistics companies operate in East Africa. From route optimization algorithms to real-time tracking systems, digital tools are enhancing efficiency and transparency throughout the supply chain. Mobile applications are connecting truck drivers with cargo owners, reducing empty runs and lowering costs.</p>
      
      <h3>Regional Integration</h3>
      <p>The East African Community (EAC) continues to work towards deeper integration, which will have profound implications for the logistics sector. Reduced border restrictions, harmonized regulations, and improved infrastructure are making cross-border transportation more seamless.</p>
      
      <h3>Sustainable Practices</h3>
      <p>Environmental concerns are driving the adoption of greener practices in logistics. Companies are investing in fuel-efficient vehicles, optimizing routes to reduce emissions, and exploring alternative fuels. This shift towards sustainability is not just environmentally responsible but often leads to cost savings in the long run.</p>
      
      <h2>Challenges and Opportunities</h2>
      <p>Despite the promising developments, the logistics industry in East Africa faces several challenges. Poor infrastructure, particularly in rural areas, continues to hamper efficient transportation. Regulatory inconsistencies across countries can lead to delays and increased costs.</p>
      
      <p>However, these challenges also present opportunities for innovative solutions. Companies that can navigate these complexities while leveraging technology and sustainable practices will be well-positioned for success in the evolving logistics landscape of East Africa.</p>
    `,
    featured_image: "/placeholder.svg?height=500&width=1200",
    author_name: "John Doe",
    author_image: "/placeholder.svg?height=100&width=100",
    category: { id: "1", name: "Industry Insights", slug: "industry-insights" },
    category_id: "1",
    published_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
    tags: [
      { id: "1", name: "Logistics", slug: "logistics" },
      { id: "2", name: "Technology", slug: "technology" },
    ],
  },
  "cross-border-transportation-challenges-solutions": {
    id: "2",
    title: "Cross-Border Transportation: Challenges and Solutions",
    slug: "cross-border-transportation-challenges-solutions",
    excerpt: "Navigating the complexities of cross-border logistics in the East African region.",
    content: `
      <h2>Understanding Cross-Border Logistics in East Africa</h2>
      <p>Cross-border transportation in East Africa presents unique challenges and opportunities for logistics providers. With six countries making up the East African Community (EAC) - Kenya, Tanzania, Uganda, Rwanda, Burundi, and South Sudan - the region offers a sizable market but also complex regulatory environments.</p>
      
      <h3>Key Challenges</h3>
      <p>Several factors complicate cross-border logistics in the region:</p>
      <ul>
        <li><strong>Documentation Requirements:</strong> Each border crossing requires specific documentation, which can vary between countries and change frequently.</li>
        <li><strong>Infrastructure Limitations:</strong> Poor road conditions, inadequate border facilities, and limited rail networks increase transit times and costs.</li>
        <li><strong>Security Concerns:</strong> Certain routes face security challenges that require additional precautions and sometimes armed escorts.</li>
        <li><strong>Regulatory Inconsistencies:</strong> Despite EAC integration efforts, regulations still differ significantly between member states.</li>
      </ul>
      
      <h3>Emerging Solutions</h3>
      <p>Despite these challenges, innovative solutions are emerging:</p>
      <ul>
        <li><strong>One-Stop Border Posts (OSBPs):</strong> These facilities allow for joint inspections by neighboring countries, reducing clearance times significantly.</li>
        <li><strong>Digital Documentation Systems:</strong> Electronic submission and processing of customs documents are streamlining border procedures.</li>
        <li><strong>Regional Harmonization Efforts:</strong> The EAC is working towards standardized regulations and procedures across member states.</li>
        <li><strong>Specialized Cross-Border Expertise:</strong> Logistics providers with deep knowledge of regional requirements offer valuable services to navigate these complexities.</li>
      </ul>
      
      <h2>The MAFL Approach to Cross-Border Logistics</h2>
      <p>At MAFL Logistics, we've developed specialized expertise in cross-border transportation throughout East Africa. Our approach combines technology, local knowledge, and strategic partnerships to overcome the challenges of regional logistics.</p>
      
      <p>By staying ahead of regulatory changes, investing in driver training for cross-border routes, and maintaining strong relationships with customs authorities, we're able to provide reliable and efficient cross-border services to our clients.</p>
    `,
    featured_image: "/placeholder.svg?height=500&width=1200",
    author_name: "Jane Smith",
    author_image: "/placeholder.svg?height=100&width=100",
    category: { id: "2", name: "Operations", slug: "operations" },
    category_id: "2",
    published_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(), // 5 days ago
    tags: [
      { id: "3", name: "Cross-Border", slug: "cross-border" },
      { id: "4", name: "Regulations", slug: "regulations" },
    ],
  },
  "sustainable-logistics-practices": {
    id: "3",
    title: "Sustainable Logistics Practices for a Greener Future",
    slug: "sustainable-logistics-practices",
    excerpt: "How logistics companies can reduce their environmental impact while maintaining efficiency.",
    content: `
      <h2>The Importance of Sustainability in Logistics</h2>
      <p>The logistics industry, with its heavy reliance on fossil fuels and significant carbon footprint, has a crucial role to play in addressing climate change. As environmental concerns become increasingly important to businesses and consumers alike, logistics companies must adapt by implementing sustainable practices.</p>
      
      <h3>Key Sustainable Practices</h3>
      <p>Several approaches can help logistics companies reduce their environmental impact:</p>
      <ul>
        <li><strong>Fleet Optimization:</strong> Regular maintenance, driver training, and route planning can significantly reduce fuel consumption and emissions.</li>
        <li><strong>Alternative Fuels:</strong> Exploring options like biodiesel, compressed natural gas, or electric vehicles can lower carbon emissions.</li>
        <li><strong>Efficient Loading:</strong> Maximizing cargo space utilization reduces the number of trips required and thus lowers emissions.</li>
        <li><strong>Warehouse Efficiency:</strong> Energy-efficient lighting, solar power, and optimized temperature control can reduce the environmental impact of warehousing operations.</li>
      </ul>
      
      <h3>The Business Case for Sustainability</h3>
      <p>Beyond environmental benefits, sustainable logistics practices often make good business sense:</p>
      <ul>
        <li><strong>Cost Savings:</strong> Reduced fuel consumption and energy usage directly translate to lower operational costs.</li>
        <li><strong>Regulatory Compliance:</strong> Staying ahead of environmental regulations prevents potential fines and disruptions.</li>
        <li><strong>Customer Preference:</strong> Many clients now prioritize environmentally responsible logistics partners.</li>
        <li><strong>Brand Reputation:</strong> A commitment to sustainability enhances company image and can be a competitive advantage.</li>
      </ul>
      
      <h2>MAFL's Commitment to Sustainable Logistics</h2>
      <p>At MAFL Logistics, we recognize our responsibility to minimize our environmental impact. We've implemented several initiatives to make our operations more sustainable, including:</p>
      <ul>
        <li>Regular fleet maintenance and driver training programs to optimize fuel efficiency</li>
        <li>Route optimization to reduce empty miles and unnecessary fuel consumption</li>
        <li>Gradual transition to more fuel-efficient vehicles</li>
        <li>Paperless documentation systems to reduce waste</li>
      </ul>
      
      <p>By balancing environmental responsibility with operational efficiency, we're working towards a more sustainable future for logistics in East Africa.</p>
    `,
    featured_image: "/placeholder.svg?height=500&width=1200",
    author_name: "David Mwangi",
    author_image: "/placeholder.svg?height=100&width=100",
    category: { id: "3", name: "Sustainability", slug: "sustainability" },
    category_id: "3",
    published_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(), // 7 days ago
    tags: [
      { id: "5", name: "Environment", slug: "environment" },
      { id: "6", name: "Green Logistics", slug: "green-logistics" },
    ],
  },
  "revolutionizing-heavy-machinery-transport": {
    id: "4",
    title: "Revolutionizing Heavy Machinery Transport in Kenya",
    slug: "revolutionizing-heavy-machinery-transport",
    excerpt:
      "How MAFL Logistics is setting new standards in the transportation of heavy machinery across Kenya and beyond.",
    content: `
      <h2>The Challenge of Heavy Machinery Transport</h2>
      <p>Transporting heavy machinery in Kenya presents unique challenges due to infrastructure limitations, regulatory requirements, and the specialized equipment needed. Construction equipment, industrial machinery, and agricultural implements often exceed standard dimensions and weights, requiring specialized handling and transportation solutions.</p>
      
      <h3>Key Considerations in Heavy Machinery Transport</h3>
      <p>Successfully moving heavy equipment requires attention to several critical factors:</p>
      <ul>
        <li><strong>Route Planning:</strong> Identifying roads that can accommodate oversized loads, considering bridge clearances, weight restrictions, and road conditions.</li>
        <li><strong>Specialized Equipment:</strong> Using the right trailers and trucks designed for heavy loads, including lowboys, extendable trailers, and multi-axle configurations.</li>
        <li><strong>Permits and Compliance:</strong> Obtaining necessary permits for oversized loads and ensuring compliance with transportation regulations.</li>
        <li><strong>Load Securing:</strong> Properly securing machinery to prevent movement during transit, which is critical for safety and preventing damage.</li>
        <li><strong>Risk Management:</strong> Comprehensive insurance coverage and contingency planning for potential challenges during transport.</li>
      </ul>
      
      <h3>MAFL's Innovative Approach</h3>
      <p>At MAFL Logistics, we've developed specialized expertise in heavy machinery transport through years of experience and continuous improvement. Our approach includes:</p>
      <ul>
        <li><strong>Advanced Equipment:</strong> We've invested in a fleet specifically designed for heavy and oversized loads, including hydraulic trailers that can be adjusted for different machinery types.</li>
        <li><strong>Comprehensive Planning:</strong> Our team conducts thorough route surveys and develops detailed transport plans for each piece of machinery.</li>
        <li><strong>Experienced Personnel:</strong> Our drivers and logistics coordinators are specially trained in heavy machinery transport techniques and safety protocols.</li>
        <li><strong>Technology Integration:</strong> We utilize GPS tracking and real-time monitoring to ensure safe and efficient transport.</li>
      </ul>
      
      <h2>Case Study: Transporting Mining Equipment to Remote Sites</h2>
      <p>One of our most challenging projects involved transporting several pieces of mining equipment to a remote site in northern Kenya. The equipment included excavators, crushers, and generators weighing up to 40 tons each.</p>
      
      <p>The route presented numerous challenges, including unpaved roads, river crossings, and steep gradients. Through careful planning, specialized equipment, and experienced personnel, we successfully delivered all machinery on schedule and without incident.</p>
      
      <h2>Looking Forward</h2>
      <p>As Kenya's infrastructure development continues to accelerate, the demand for heavy machinery transport will grow. MAFL Logistics is committed to continuing our investment in equipment, personnel, and processes to meet this demand while setting new standards for safety, efficiency, and reliability in heavy machinery transport.</p>
    `,
    featured_image: "/placeholder.svg?height=500&width=1200",
    author_name: "Mahdi M. Issack",
    author_image: "/placeholder.svg?height=100&width=100",
    category: { id: "4", name: "Company News", slug: "company-news" },
    category_id: "4",
    published_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    tags: [
      { id: "7", name: "Heavy Machinery", slug: "heavy-machinery" },
      { id: "8", name: "Innovation", slug: "innovation" },
    ],
  },
}

// Mock related posts data
const mockRelatedPosts = {
  "1": [
    {
      id: "5",
      title: "Digital Transformation in Logistics",
      slug: "digital-transformation-logistics",
      featured_image: "/placeholder.svg?height=160&width=320",
      published_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(), // 10 days ago
    },
    {
      id: "6",
      title: "The Impact of AI on Supply Chain Management",
      slug: "impact-ai-supply-chain-management",
      featured_image: "/placeholder.svg?height=160&width=320",
      published_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15).toISOString(), // 15 days ago
    },
  ],
  "2": [
    {
      id: "7",
      title: "Navigating Customs Regulations in East Africa",
      slug: "navigating-customs-regulations-east-africa",
      featured_image: "/placeholder.svg?height=160&width=320",
      published_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 8).toISOString(), // 8 days ago
    },
    {
      id: "8",
      title: "Improving Last-Mile Delivery in Urban Areas",
      slug: "improving-last-mile-delivery-urban-areas",
      featured_image: "/placeholder.svg?height=160&width=320",
      published_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 12).toISOString(), // 12 days ago
    },
  ],
  "3": [
    {
      id: "9",
      title: "Reducing Carbon Footprint in Logistics Operations",
      slug: "reducing-carbon-footprint-logistics-operations",
      featured_image: "/placeholder.svg?height=160&width=320",
      published_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 9).toISOString(), // 9 days ago
    },
    {
      id: "10",
      title: "Electric Vehicles in Commercial Transportation",
      slug: "electric-vehicles-commercial-transportation",
      featured_image: "/placeholder.svg?height=160&width=320",
      published_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14).toISOString(), // 14 days ago
    },
  ],
  "4": [
    {
      id: "11",
      title: "MAFL Logistics Expands Fleet with New Vehicles",
      slug: "mafl-logistics-expands-fleet",
      featured_image: "/placeholder.svg?height=160&width=320",
      published_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 20).toISOString(), // 20 days ago
    },
    {
      id: "12",
      title: "MAFL Opens New Office in Mombasa",
      slug: "mafl-opens-new-office-mombasa",
      featured_image: "/placeholder.svg?height=160&width=320",
      published_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(), // 30 days ago
    },
  ],
}

// Loading component for Suspense
function BlogPostSkeleton() {
  return (
    <div className="pt-24 pb-16 animate-pulse">
      <section className="py-12 bg-gradient-to-b from-white to-gray-50 dark:from-mafl-dark/80 dark:to-mafl-dark/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="h-6 w-24 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
            <div className="h-10 w-3/4 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
            <div className="flex flex-wrap gap-4 mb-6">
              <div className="h-5 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-5 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-5 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          </div>
        </div>
      </section>
      <div className="h-[300px] md:h-[500px] w-full bg-gray-200 dark:bg-gray-700"></div>
    </div>
  )
}

async function getBlogPost(slug: string) {
  // Return mock post data instead of querying Supabase
  return mockPosts[slug as keyof typeof mockPosts] || null
}

async function getRelatedPosts(categoryId: string, currentPostId: string) {
  // Return mock related posts instead of querying Supabase
  return mockRelatedPosts[categoryId as keyof typeof mockRelatedPosts] || []
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  return (
    <Suspense fallback={<BlogPostSkeleton />}>
      <BlogPostContent slug={params.slug} />
    </Suspense>
  )
}

async function BlogPostContent({ slug }: { slug: string }) {
  const post = await getBlogPost(slug);

  if (!post) {\
    slug}: slug: string ) {
  const post = await getBlogPost(slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = await getRelatedPosts(post.category_id, post.id);

  // Format the date
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "MMMM d, yyyy");
  };

  // Calculate reading time (rough estimate)
  const calculateReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / wordsPerMinute);
    return readingTime;
  };

  const readingTime = calculateReadingTime(post.content);

  return (
    <div className="pt-24 pb-16">
      {/* Hero Section */}
      <section className="py-12 bg-gradient-to-b from-white to-gray-50 dark:from-mafl-dark/80 dark:to-mafl-dark/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Link
              href="/blog"
              className="inline-flex items-center text-sm text-muted-foreground hover:text-mafl-orange mb-4"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Blog
            </Link>

            <h1 className="text-3xl md:text-4xl font-bold mb-4">{post.title}</h1>

            <div className="flex flex-wrap items-center text-sm text-muted-foreground mb-6 gap-4">
              <div className="flex items-center">
                <User className="h-4 w-4 mr-1" />
                <span>{post.author_name}</span>
              </div>
              <div className="flex items-center">
                <CalendarIcon className="h-4 w-4 mr-1" />
                <span>{formatDate(post.published_at)}</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                <span>{readingTime} min read</span>
              </div>
              <Link href={`/blog/category/${post.category.slug}`}>
                <Badge variant="outline" className="bg-muted/50">
                  {post.category.name}
                </Badge>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Image */}
      <div className="relative h-[300px] md:h-[500px] w-full">
        <Image
          src={post.featured_image || "/placeholder.svg?height=500&width=1200"}
          alt={post.title}
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Blog Content */}
      <section className="py-12 bg-white dark:bg-mafl-dark/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8">
              <article className="prose dark:prose-invert prose-lg max-w-none">
                <div dangerouslySetInnerHTML={{ __html: post.content }} />
              </article>

              {/* Tags */}
              <div className="mt-8 pt-6 border-t">
                <div className="flex flex-wrap gap-2 items-center">
                  <span className="text-sm font-medium">Tags:</span>
                  {post.tags.map((tag: any) => (
                    <Link key={tag.id} href={`/blog/tag/${tag.slug}`}>
                      <Badge variant="outline" className="bg-muted/50">
                        {tag.name}
                      </Badge>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Share */}
              <div className="mt-6 pt-6 border-t">
                <div className="flex items-center">
                  <span className="text-sm font-medium mr-4">Share this article:</span>
                  <div className="flex space-x-2">
                    <button
                      onClick={() =>
                        window.open(
                          `https://twitter.com/intent/tweet?url=${encodeURIComponent(
                            `${window.location.origin}/blog/${post.slug}`,
                          )}&text=${encodeURIComponent(post.title)}`,
                          "_blank",
                        )
                      }
                      className="p-2 rounded-full bg-muted/50 hover:bg-muted transition-colors"
                      aria-label="Share on Twitter"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                      </svg>
                    </button>
                    <button
                      onClick={() =>
                        window.open(
                          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                            `${window.location.origin}/blog/${post.slug}`,
                          )}`,
                          "_blank",
                        )
                      }
                      className="p-2 rounded-full bg-muted/50 hover:bg-muted transition-colors"
                      aria-label="Share on Facebook"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                      </svg>
                    </button>
                    <button
                      onClick={() =>
                        window.open(
                          `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(
                            `${window.location.origin}/blog/${post.slug}`,
                          )}&title=${encodeURIComponent(post.title)}`,
                          "_blank",
                        )
                      }
                      className="p-2 rounded-full bg-muted/50 hover:bg-muted transition-colors"
                      aria-label="Share on LinkedIn"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                        <rect x="2" y="9" width="4" height="12" />
                        <circle cx="4" cy="4" r="2" />
                      </svg>
                    </button>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(`${window.location.origin}/blog/${post.slug}`);
                        alert("Link copied to clipboard!");
                      }}
                      className="p-2 rounded-full bg-muted/50 hover:bg-muted transition-colors"
                      aria-label="Copy link"
                    >
                      <Share2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4">
              {/* Author Info */}
              <div className="bg-muted/30 p-6 rounded-lg mb-8">
                <div className="flex items-center mb-4">
                  <div className="relative h-12 w-12 rounded-full overflow-hidden mr-4">
                    <Image
                      src={post.author_image || "/placeholder.svg?height=100&width=100"}
                      alt={post.author_name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-bold">{post.author_name}</h3>
                    <p className="text-sm text-muted-foreground">Author</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  MAFL Logistics expert sharing insights on transportation and logistics in East Africa.
                </p>
              </div>

              {/* Related Posts */}
              {relatedPosts.length > 0 && (
                <div>
                  <h3 className="text-xl font-bold mb-4">Related Articles</h3>
                  <div className="space-y-4">
                    {relatedPosts.map((relatedPost: any) => (
                      <Card key={relatedPost.id} className="overflow-hidden">
                        <div className="relative h-40 w-full">
                          <Image
                            src={relatedPost.featured_image || "/placeholder.svg?height=160&width=320"}
                            alt={relatedPost.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <CardContent className="pt-4">
                          <Link href={`/blog/${relatedPost.slug}`}>
                            <h4 className="font-bold hover:text-mafl-orange transition-colors line-clamp-2">
                              {relatedPost.title}
                            </h4>
                          </Link>
                          <p className="text-xs text-muted-foreground mt-1">{formatDate(relatedPost.published_at)}</p>
                        </CardContent>
                        <CardFooter className="pt-0">
                          <Link
                            href={`/blog/${relatedPost.slug}`}
                            className="text-xs text-mafl-orange hover:text-mafl-orange/80 font-medium"
                          >
                            Read More
                          </Link>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Subscription */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4">Subscribe to Our Newsletter</h2>
            <p className="text-muted-foreground mb-6">
              Stay updated with our latest articles, industry insights, and company news.
            </p>
            <form
              className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto"
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const email = formData.get("email") as string;
                // Handle newsletter subscription
                alert(`Thank you for subscribing with ${email}!`);
              }}
            >
              <input
                type="email"
                name="email"
                placeholder="Your email address"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                required
              />
              <button
                type="submit"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
