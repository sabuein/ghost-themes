import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export const metadata = {
  title: "About Aunty Suzy - Palestinian Heritage",
  description: "Learn the story of Aunty Suzy, a Palestinian artisan preserving tradition in London for over 20 years.",
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-amber-50 to-orange-50 border-b border-border">
        <div className="box-container">
          <h1 className="font-serif text-5xl lg:text-6xl text-foreground mb-6 leading-tight">
            The Heart Behind Aunty Suzy
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl">
            A journey of love, tradition, and community spanning from Palestine to the heart of London
          </p>
        </div>
      </section>

      {/* Main Story */}
      <section className="py-20 lg:py-32">
        <div className="box-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
            <div>
              <img
                src="/placeholder.svg?key=story1"
                alt="Aunty Suzy in her kitchen"
                className="rounded-2xl shadow-xl w-full"
              />
            </div>
            <div className="space-y-6">
              <h2 className="font-serif text-4xl text-foreground">Her Story</h2>
              <div className="space-y-4 text-lg text-muted-foreground leading-relaxed">
                <p>
                  Aunty Suzy arrived in London over 20 years ago, carrying with her the culinary traditions of her
                  Palestinian heritage. What began as sharing family recipes with neighbours has blossomed into a
                  mission to celebrate Palestinian culture and keep traditions alive.
                </p>
                <p>
                  Every product made in her kitchen reflects the love, authenticity, and craftsmanship passed down
                  through generations. From Labaneh to preserved vegetables, from handwoven textiles to embroidered
                  pieces, each item carries the spirit of Palestine.
                </p>
                <p>
                  Today, Aunty Suzy isn't just preparing food—she's creating a bridge between communities, celebrating
                  the richness of Palestinian heritage, and supporting artisans and craftspeople who share her vision.
                </p>
              </div>
            </div>
          </div>

          {/* Values */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
            {[
              {
                title: "Authenticity",
                description:
                  "Every recipe, every craft follows traditional Palestinian methods. No shortcuts, no compromises on quality or heritage.",
                icon: "🌿",
              },
              {
                title: "Community",
                description:
                  "We work with local artisans, support Palestinian craftspeople, and celebrate the diverse talents within our community.",
                icon: "🤝",
              },
              {
                title: "Seasonality",
                description:
                  "We respect the seasons and nature's rhythms. What's in your box reflects what's fresh, available, and at its best.",
                icon: "🍂",
              },
            ].map((value, index) => (
              <Card key={index} className="p-8 border-2 border-border hover:border-primary transition-colors">
                <div className="text-4xl mb-4">{value.icon}</div>
                <h3 className="font-serif text-2xl text-foreground mb-3">{value.title}</h3>
                <p className="text-muted-foreground">{value.description}</p>
              </Card>
            ))}
          </div>

          {/* Impact */}
          <Card className="p-12 bg-gradient-to-br from-primary/5 to-secondary/5 border-2 border-primary/20">
            <h2 className="font-serif text-4xl text-foreground mb-8">Our Impact</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                { number: "20+", label: "Years Serving" },
                { number: "1000+", label: "Families Connected" },
                { number: "50+", label: "Artisans Supported" },
                { number: "100%", label: "Handmade" },
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <p className="text-5xl font-serif text-primary mb-2">{stat.number}</p>
                  <p className="text-foreground font-semibold">{stat.label}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </section>

      {/* Heritage Timeline */}
      <section className="py-20 lg:py-32 bg-white border-t border-border">
        <div className="box-container">
          <h2 className="font-serif text-4xl text-foreground mb-16 text-center">Our Heritage</h2>
          <div className="max-w-2xl mx-auto">
            {[
              {
                year: "2004",
                title: "Journey Begins",
                description:
                  "Aunty Suzy arrives in London, bringing Palestinian culinary traditions with her. First recipes shared with family and friends.",
              },
              {
                year: "2010",
                title: "Community Growing",
                description:
                  "Demand for authentic Palestinian food grows. Aunty Suzy begins producing products commercially while maintaining traditional methods.",
              },
              {
                year: "2018",
                title: "Artisan Partnership",
                description:
                  "Starts collaborating with Palestinian artisans and craftspeople, expanding beyond food to include textiles, embroideries, and art.",
              },
              {
                year: "2024",
                title: "Aunty Suzy Experience",
                description:
                  "Launches the monthly discovery box, creating a comprehensive celebration of Palestinian heritage combining food, craft, and storytelling.",
              },
            ].map((timeline, index) => (
              <div key={index} className="flex gap-8 mb-12 last:mb-0">
                <div className="flex-shrink-0">
                  <div className="w-24 h-24 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                    <span className="font-serif text-2xl font-bold">{timeline.year}</span>
                  </div>
                </div>
                <div className="flex-1 pt-4">
                  <h3 className="font-serif text-2xl text-foreground mb-2">{timeline.title}</h3>
                  <p className="text-muted-foreground text-lg">{timeline.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 lg:py-32 bg-gradient-to-br from-primary/10 to-secondary/10">
        <div className="box-container text-center">
          <h2 className="font-serif text-4xl text-foreground mb-6">Join the Aunty Suzy Family</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-12">
            Be part of a community celebrating Palestinian heritage, supporting artisans, and sharing the love of
            authentic, handmade traditions.
          </p>
          <Link href="/#membership">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
              Choose Your Membership
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
