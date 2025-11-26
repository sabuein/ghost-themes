import { Card } from "@/components/ui/card"
import Link from "next/link"

export const metadata = {
  title: "Blog - Aunty Suzy",
  description: "Stories, recipes, and insights from the Aunty Suzy community.",
}

export default function BlogPage() {
  const blogPosts = [
    {
      id: 1,
      title: "Labaneh: The Heart of Palestinian Kitchens",
      excerpt:
        "Discover the centuries-old tradition of making labaneh, the creamy strained yogurt that appears on tables across Palestine and the Levant.",
      category: "Recipes & Traditions",
      date: "November 2024",
      image: "/placeholder.svg?key=blog1",
      content: `Labaneh is more than just a dairy product—it's a symbol of Palestinian hospitality and tradition. Made by straining yogurt through cheesecloth for 24 hours, the process requires patience and care, much like many Palestinian culinary traditions.

The result is a thick, creamy delicacy that can be served as a dip with olive oil and fresh herbs, rolled into balls preserved in oil, or enjoyed simply with warm bread. Every Palestinian family has their own labaneh recipe, their own technique passed down through generations.

In Aunty Suzy's kitchen, labaneh is prepared using traditional methods, using the finest yogurt and the patience that comes from doing something the right way. Each batch takes a full day to prepare, but the result is worth every minute.`,
    },
    {
      id: 2,
      title: "The Stories Behind Our Embroideries",
      excerpt:
        "Meet the artisans whose hands create the beautiful Palestinian embroidered pieces in your Aunty Suzy boxes.",
      category: "Artisan Stories",
      date: "October 2024",
      image: "/placeholder.svg?key=blog2",
      content: `Palestinian embroidery is instantly recognizable—the intricate patterns, the bold colors, the stories stitched into every piece. Each design represents a region, a family, a heritage.

Our artisans dedicate months to creating each piece, using techniques passed down through their families. The patterns often feature olive branches, cedar trees, and geometric designs that have adorned Palestinian clothing and homes for centuries.

By supporting these artisans, we're ensuring that these traditions continue to thrive, that young generations learn the craft, and that Palestinian cultural heritage remains vibrant and alive.`,
    },
    {
      id: 3,
      title: "Seasonal Harvests: What's Coming in December",
      excerpt:
        "Explore what Aunty Suzy has in store for the December discovery box, celebrating the season with traditional Palestinian fare.",
      category: "Seasonal Guide",
      date: "September 2024",
      image: "/placeholder.svg?key=blog3",
      content: `December brings a special kind of abundance in Palestinian traditions. As the harvest season winds down, we focus on preserved goods, dried herbs, and ingredients perfect for festive gatherings.

This month's box features:
- Homemade pomegranate molasses for cooking and beverages
- Dried za'atar blends for bread and vegetables
- Handmade fig jam from summer harvests
- Embroidered table linens for festive gatherings
- A special gift selected to celebrate the season

Each item has been selected with care, considering both availability and the seasonal spirit.`,
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-amber-50 to-orange-50 border-b border-border">
        <div className="box-container">
          <h1 className="font-serif text-5xl lg:text-6xl text-foreground mb-6 leading-tight">
            Stories from Aunty Suzy
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl">
            Recipes, traditions, artisan stories, and seasonal insights from our community
          </p>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="py-20 lg:py-32">
        <div className="box-container">
          <div className="space-y-12">
            {blogPosts.map((post) => (
              <article key={post.id}>
                <Card className="overflow-hidden hover:shadow-lg transition-all duration-300">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="overflow-hidden bg-muted h-64 md:h-auto">
                      <img
                        src={post.image || "/placeholder.svg"}
                        alt={post.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-8 flex flex-col justify-center">
                      <div className="flex items-center gap-4 mb-4">
                        <span className="text-sm font-semibold text-secondary bg-secondary/10 px-3 py-1 rounded-full">
                          {post.category}
                        </span>
                        <span className="text-sm text-muted-foreground">{post.date}</span>
                      </div>
                      <h2 className="font-serif text-3xl text-foreground mb-3 line-clamp-2">{post.title}</h2>
                      <p className="text-muted-foreground mb-6 line-clamp-2">{post.excerpt}</p>
                      <Link href={`/blog/${post.id}`}>
                        <button className="text-primary font-semibold hover:text-primary/80 transition-colors inline-flex items-center gap-2">
                          Read Full Story
                          <span>→</span>
                        </button>
                      </Link>
                    </div>
                  </div>
                </Card>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-20 lg:py-32 bg-gradient-to-br from-primary/10 to-secondary/10">
        <div className="box-container text-center max-w-2xl mx-auto">
          <h2 className="font-serif text-4xl text-foreground mb-6">Never Miss a Story</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Subscribe to our newsletter for recipes, artisan features, and seasonal insights delivered monthly.
          </p>
          <form className="flex gap-4">
            <input
              type="email"
              placeholder="Your email"
              className="flex-1 px-6 py-3 rounded-lg border border-border bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button className="px-8 py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-semibold transition-colors">
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  )
}
