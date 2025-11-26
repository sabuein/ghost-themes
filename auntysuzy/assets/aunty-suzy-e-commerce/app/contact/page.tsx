import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Mail, Phone, MapPin } from "lucide-react"

export const metadata = {
  title: "Contact Aunty Suzy - Get in Touch",
  description: "Have questions? Reach out to the Aunty Suzy team.",
}

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-amber-50 to-orange-50 border-b border-border">
        <div className="box-container">
          <h1 className="font-serif text-5xl lg:text-6xl text-foreground mb-6 leading-tight">Get in Touch</h1>
          <p className="text-xl text-muted-foreground max-w-2xl">
            Questions? We'd love to hear from you. Reach out anytime.
          </p>
        </div>
      </section>

      {/* Contact Info & Form */}
      <section className="py-20 lg:py-32">
        <div className="box-container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            {[
              {
                icon: Mail,
                label: "Email",
                value: "hello@auntysuzy.co.uk",
                link: "mailto:hello@auntysuzy.co.uk",
              },
              {
                icon: Phone,
                label: "Phone",
                value: "+44 207 123 4567",
                link: "tel:+442071234567",
              },
              {
                icon: MapPin,
                label: "Location",
                value: "London, United Kingdom",
                link: "#",
              },
            ].map((contact, index) => {
              const IconComponent = contact.icon
              return (
                <Card key={index} className="p-8 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                    <IconComponent className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="font-serif text-xl text-foreground mb-2">{contact.label}</h3>
                  <a href={contact.link} className="text-muted-foreground hover:text-primary transition-colors">
                    {contact.value}
                  </a>
                </Card>
              )
            })}
          </div>

          {/* Contact Form */}
          <Card className="p-12 max-w-2xl mx-auto">
            <h2 className="font-serif text-3xl text-foreground mb-8">Send us a Message</h2>
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-foreground font-semibold mb-2">First Name</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Your first name"
                  />
                </div>
                <div>
                  <label className="block text-foreground font-semibold mb-2">Last Name</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Your last name"
                  />
                </div>
              </div>
              <div>
                <label className="block text-foreground font-semibold mb-2">Email</label>
                <input
                  type="email"
                  className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label className="block text-foreground font-semibold mb-2">Message</label>
                <textarea
                  className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  rows={6}
                  placeholder="Tell us what's on your mind..."
                />
              </div>
              <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3">
                Send Message
              </Button>
            </form>
          </Card>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 lg:py-32 bg-white border-t border-border">
        <div className="box-container max-w-2xl">
          <h2 className="font-serif text-4xl text-foreground mb-12 text-center">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              {
                q: "How often will I receive my box?",
                a: "Discovery Members receive a carefully curated box every month on the 15th. You can pause or cancel your subscription anytime.",
              },
              {
                q: "What if I have dietary restrictions?",
                a: "We're happy to work with you! Contact us to discuss any allergies or dietary requirements, and we'll do our best to accommodate.",
              },
              {
                q: "Can I gift a subscription?",
                a: "Gift subscriptions are available for both 3, 6, and 12-month periods. Perfect for someone who loves authentic food and culture.",
              },
              {
                q: "How do I pause my subscription?",
                a: "You can pause your membership anytime from your account dashboard. No penalties, no questions asked.",
              },
            ].map((item, index) => (
              <Card key={index} className="p-6">
                <h3 className="font-semibold text-foreground mb-3">{item.q}</h3>
                <p className="text-muted-foreground">{item.a}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
