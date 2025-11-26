export default function StorySection() {
  return (
    <section id="story" className="py-20 lg:py-32 bg-white">
      <div className="box-container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left side - Image */}
          <div className="order-2 lg:order-1">
            <img src="/placeholder.svg?key=fk8vs" alt="Aunty Suzy" className="rounded-2xl shadow-xl w-full h-auto" />
          </div>

          {/* Right side - Story */}
          <div className="order-1 lg:order-2 space-y-6">
            <div>
              <p className="text-secondary font-semibold text-lg mb-2">Our Story</p>
              <h2 className="font-serif text-4xl text-foreground mb-4">From Palestine to London, With Love</h2>
            </div>

            <div className="space-y-4 text-lg text-muted-foreground leading-relaxed">
              <p>
                For over 20 years, Aunty Suzy has been bringing the warmth of Palestinian home cooking to London. What
                started as sharing family recipes with neighbours has blossomed into a mission to preserve heritage and
                celebrate culture through food and craft.
              </p>
              <p>
                Every product in our boxes is made with the same care, quality, and love that Aunty Suzy puts into her
                family kitchen. From traditional Labaneh and preserved vegetables to embroidered textiles and art
                pieces, each item tells a story of Palestinian creativity and resilience.
              </p>
              <p>
                By choosing Aunty Suzy, you're not just receiving beautiful products—you're supporting a thriving
                Palestinian community and keeping traditions alive in the heart of London.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6 pt-8">
              <div className="bg-amber-50 p-6 rounded-xl">
                <p className="text-3xl font-serif text-primary mb-2">20+</p>
                <p className="text-foreground font-semibold">Years of Heritage</p>
              </div>
              <div className="bg-orange-50 p-6 rounded-xl">
                <p className="text-3xl font-serif text-secondary mb-2">100%</p>
                <p className="text-foreground font-semibold">Handmade with Love</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
