import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Phone, Mail, MessageCircle, Send } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function ClientSupportPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Support</h1>
          <p className="text-muted-foreground mt-2">Get help with your logistics needs.</p>
        </div>
        <Badge variant="destructive" className="text-sm">
          3 unread messages
        </Badge>
      </div>

      <Tabs defaultValue="chat" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="chat" className="relative">
            Live Chat
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
              3
            </span>
          </TabsTrigger>
          <TabsTrigger value="faq">FAQs</TabsTrigger>
        </TabsList>

        <TabsContent value="chat" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Chat with Support</CardTitle>
              <CardDescription>Our team is here to help with any questions or issues you may have.</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px] pr-4 mb-4 border rounded-md p-4">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Avatar>
                      <AvatarImage src="/friendly-support.png" alt="Support Agent" />
                      <AvatarFallback>SA</AvatarFallback>
                    </Avatar>
                    <div className="bg-muted p-3 rounded-lg max-w-[80%]">
                      <p className="text-sm">Hello! Welcome to MAFL Logistics support. How can I assist you today?</p>
                      <p className="text-xs text-muted-foreground mt-1">10:30 AM</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 justify-end">
                    <div className="bg-primary text-primary-foreground p-3 rounded-lg max-w-[80%]">
                      <p className="text-sm">Hi, I need help tracking my recent shipment.</p>
                      <p className="text-xs text-primary-foreground/70 mt-1">10:32 AM</p>
                    </div>
                    <Avatar>
                      <AvatarImage src="/diverse-users-interface.png" alt="You" />
                      <AvatarFallback>YO</AvatarFallback>
                    </Avatar>
                  </div>

                  <div className="flex items-start gap-3">
                    <Avatar>
                      <AvatarImage src="/friendly-support.png" alt="Support Agent" />
                      <AvatarFallback>SA</AvatarFallback>
                    </Avatar>
                    <div className="bg-muted p-3 rounded-lg max-w-[80%]">
                      <p className="text-sm">
                        I'd be happy to help with that. Could you please provide your shipment tracking number or order
                        reference?
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">10:33 AM</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Avatar>
                      <AvatarImage src="/friendly-support.png" alt="Support Agent" />
                      <AvatarFallback>SA</AvatarFallback>
                    </Avatar>
                    <div className="bg-muted p-3 rounded-lg max-w-[80%] border-2 border-red-500">
                      <div className="flex items-center">
                        <p className="text-sm">
                          I've checked your order #MAF-2023-45678. It appears there was a delay at the border crossing.
                          The shipment should arrive by tomorrow afternoon.
                        </p>
                        <Badge variant="outline" className="ml-2 bg-red-100 text-red-800 border-red-300">
                          New
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">11:15 AM</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Avatar>
                      <AvatarImage src="/friendly-support.png" alt="Support Agent" />
                      <AvatarFallback>SA</AvatarFallback>
                    </Avatar>
                    <div className="bg-muted p-3 rounded-lg max-w-[80%] border-2 border-red-500">
                      <div className="flex items-center">
                        <p className="text-sm">
                          Would you like me to arrange for a notification when the shipment is out for delivery?
                        </p>
                        <Badge variant="outline" className="ml-2 bg-red-100 text-red-800 border-red-300">
                          New
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">11:16 AM</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Avatar>
                      <AvatarImage src="/friendly-support.png" alt="Support Agent" />
                      <AvatarFallback>SA</AvatarFallback>
                    </Avatar>
                    <div className="bg-muted p-3 rounded-lg max-w-[80%] border-2 border-red-500">
                      <div className="flex items-center">
                        <p className="text-sm">
                          I've also added a 10% discount to your next order as compensation for the delay. The discount
                          code is MAFL10NEXT.
                        </p>
                        <Badge variant="outline" className="ml-2 bg-red-100 text-red-800 border-red-300">
                          New
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">11:18 AM</p>
                    </div>
                  </div>
                </div>
              </ScrollArea>

              <div className="flex gap-2">
                <Textarea placeholder="Type your message here..." className="min-h-[80px]" />
                <Button size="icon" className="h-[80px] w-12">
                  <Send className="h-5 w-5" />
                </Button>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col items-start">
              <p className="text-sm font-medium mb-2">Alternative Contact Methods:</p>
              <div className="flex flex-col space-y-2 w-full">
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2" />
                  <span className="text-sm">+254 (0) 722 123 456</span>
                </div>
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-2" />
                  <span className="text-sm">support@mafl-logistics.com</span>
                </div>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="faq" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
              <CardDescription>Find answers to common questions about our services.</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>How do I track my shipment?</AccordionTrigger>
                  <AccordionContent>
                    You can track your shipment by entering your tracking number in the tracking section of our website
                    or mobile app. Alternatively, you can contact our customer service team with your tracking number
                    for assistance.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2">
                  <AccordionTrigger>What are your delivery timeframes?</AccordionTrigger>
                  <AccordionContent>
                    Our delivery timeframes vary depending on the service you've selected and the destination. Standard
                    deliveries within Kenya typically take 2-3 business days, while international shipments can take
                    5-10 business days depending on the destination country.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3">
                  <AccordionTrigger>How do I request a quote for logistics services?</AccordionTrigger>
                  <AccordionContent>
                    You can request a quote by filling out the quote request form on our website, contacting our sales
                    team directly, or using the "Request Quote" feature in your client dashboard. Please provide details
                    about your shipment including origin, destination, dimensions, and weight for an accurate quote.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-4">
                  <AccordionTrigger>What payment methods do you accept?</AccordionTrigger>
                  <AccordionContent>
                    We accept various payment methods including credit/debit cards, bank transfers, M-Pesa, and other
                    mobile money services. For corporate clients, we also offer credit terms subject to approval.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-5">
                  <AccordionTrigger>How do I file a claim for damaged or lost shipments?</AccordionTrigger>
                  <AccordionContent>
                    To file a claim for damaged or lost shipments, please contact our customer service team within 7
                    days of the delivery date. You'll need to provide your tracking number, photos of damaged items (if
                    applicable), and a description of the issue. Our team will guide you through the claims process.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
            <CardFooter>
              <Card className="w-full border-dashed">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <MessageCircle className="h-5 w-5 mr-2" />
                    Can't find what you're looking for?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form className="space-y-4">
                    <div className="space-y-2">
                      <Input placeholder="Your Name" />
                    </div>
                    <div className="space-y-2">
                      <Input placeholder="Your Email" type="email" />
                    </div>
                    <div className="space-y-2">
                      <Textarea placeholder="Your Question" className="min-h-[100px]" />
                    </div>
                    <Button className="w-full">Submit Question</Button>
                  </form>
                </CardContent>
              </Card>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
