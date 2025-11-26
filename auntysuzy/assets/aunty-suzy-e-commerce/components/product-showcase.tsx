"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { ChevronLeft, ChevronRight } from "lucide-react"

export default function ProductShowcase() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const products = [
    {
      name: "Homemade Labaneh",
      description:
        "Creamy strained yoghurt made with traditional Palestinian methods. Perfect with olive oil and za'atar.",
      image: "/placeholder.svg?key=pme3s",
      season: "Year-round",
    },
    {
      name: "Preserved Okra",
      description:
        "Fresh okra preserved in olive oil and spices. A seasonal favourite that brings summer to your kitchen.",
      image: "/placeholder.svg?key=jk2eo",
      season: "Summer",
    },
    {
      name: "Hand-Embroidered Textile",
      description:
        "Traditional Palestinian embroidery featuring timeless patterns. Each piece is a work of art by local artisans.",
      image: "/placeholder.svg?key=yqyix",
      season: "Varies",
    },
    {
      name: "Aubergine in Oil",
      description:
        "Roasted aubergines in aromatic olive oil and garlic. A versatile addition to any Mediterranean table.",
      image: "/placeholder.svg?key=b1c19",
      season: "Autumn",
    },
    {
      name: "Artisan Spice Blend",
      description: "Handblended za'atar and sumac. The essence of Palestinian flavour in every sprinkle.",
      image: "/placeholder.svg?key=v089l'atar spice blend",
      season: "Year-round",
    },
    {
      name: "Keffiyeh Scarf",
      description:
        "Classic Palestinian keffiyeh representing cultural pride and heritage. A timeless piece of Palestinian identity.",
      image: "/placeholder.svg?key=0bdp8",
      season: "Varies",
    },
  ]

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % products.length)
  }

  const prev = () => {
    setCurrentIndex((prev) => (prev - 1 + products.length) % products.length)
  }

  const getVisibleProducts = () => {
    const items = []
    const itemsToShow = 3
    for (let i = 0; i < itemsToShow; i++) {
      const index = (currentIndex + i) % products.length
      items.push(products[index])
    }
    return items
  }

  return (
    <section className="py-20 lg:py-32 bg-white">
      <div className="box-container">
        <div className="text-center mb-16">
          <p className="text-secondary font-semibold text-lg mb-2">Discover Monthly Items</p>
          <h2 className="font-serif text-4xl lg:text-5xl text-foreground mb-6">What You'll Receive</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Every month brings different treasures. Here's a glimpse of the kinds of items featured in our Discovery
            Boxes.
          </p>
        </div>

        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {getVisibleProducts().map((product, index) => (
              <Card
                key={index}
                className="overflow-hidden group cursor-pointer transition-all duration-300 hover:shadow-xl"
              >
                <div className="relative h-64 overflow-hidden bg-muted">
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-start p-4">
                    <p className="text-white font-semibold">{product.season}</p>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-serif text-xl text-foreground mb-2">{product.name}</h3>
                  <p className="text-muted-foreground">{product.description}</p>
                </div>
              </Card>
            ))}
          </div>

          {/* Navigation */}
          <div className="flex justify-center gap-4 items-center">
            <button
              onClick={prev}
              className="p-3 rounded-full border border-border hover:bg-muted transition-colors"
              aria-label="Previous products"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex gap-2">
              {products.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentIndex ? "bg-primary w-8" : "bg-border"
                  }`}
                  aria-label={`Go to product ${index + 1}`}
                />
              ))}
            </div>
            <button
              onClick={next}
              className="p-3 rounded-full border border-border hover:bg-muted transition-colors"
              aria-label="Next products"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
