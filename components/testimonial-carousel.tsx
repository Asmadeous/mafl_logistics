"use client"

import React from "react"
import { Quote } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface Testimonial {
  id: string
  name: string
  company: string
  role: string
  content: string
  imageUrl: string
}

const testimonials: Testimonial[] = [
  {
    id: "1",
    name: "John Mutua",
    company: "Nairobi Freight Solutions",
    role: "Operations Manager",
    content:
      "MAFL Logistics has transformed our supply chain operations. Their efficient service and attention to detail have saved us both time and money.",
    imageUrl: "/john-mutua.jpg",
  },
  {
    id: "2",
    name: "Amina Hassan",
    company: "East Africa Shipping",
    role: "Supply Chain Director",
    content:
      "Working with MAFL has been a game-changer for our business. Their cross-border expertise has opened new markets for us across East Africa.",
    imageUrl: "/focused-logistics-professional.png",
  },
  {
    id: "3",
    name: "Michael Omondi",
    company: "Kenya Freight Ltd",
    role: "CEO",
    content:
      "The team at MAFL consistently delivers exceptional service. Their knowledge of local regulations and customs procedures is unmatched in the industry.",
    imageUrl: "/confident-fleet-manager.png",
  },
]

export function TestimonialCarousel() {
  const [activeIndex, setActiveIndex] = React.useState(0)

  React.useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="w-full py-12 bg-gray-50 dark:bg-gray-900">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="inline-block rounded-full bg-orange-500/10 px-4 py-1.5 text-sm font-medium text-orange-500">
            Client Testimonials
          </div>
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">What Our Clients Say</h2>
          <p className="max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
            Hear from businesses across East Africa who trust MAFL Logistics for their transportation needs
          </p>
          <div className="w-12 h-1 bg-orange-500 mt-2"></div>
        </div>

        <div className="mx-auto max-w-5xl py-12">
          <div className="relative overflow-hidden rounded-lg">
            <div
              className="flex transition-transform duration-500"
              style={{ transform: `translateX(-${activeIndex * 100}%)` }}
            >
              {testimonials.map((testimonial) => (
                <Card key={testimonial.id} className="w-full flex-shrink-0 border-none shadow-none">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-6 items-center">
                      <div className="w-full md:w-1/3">
                        <img
                          src={testimonial.imageUrl || "/placeholder.svg"}
                          alt={testimonial.name}
                          className="rounded-xl object-cover w-full aspect-square"
                        />
                      </div>
                      <div className="w-full md:w-2/3 flex flex-col space-y-4">
                        <div className="flex items-center space-x-2 text-amber-500">
                          <Quote className="h-6 w-6" />
                        </div>
                        <p className="text-lg italic">{testimonial.content}</p>
                        <div className="flex items-center space-x-4">
                          <div>
                            <h3 className="font-semibold">{testimonial.name}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {testimonial.role}, {testimonial.company}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          <div className="flex justify-center space-x-2 mt-4">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`h-2 w-2 rounded-full ${
                  index === activeIndex ? "bg-orange-500" : "bg-gray-300 dark:bg-gray-700"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
