import Header from "@/components/header"
import Footer from "@/components/footer"
import Hero from "@/components/hero"
import MembershipTiers from "@/components/membership-tiers"
import ProductShowcase from "@/components/product-showcase"
import StorySection from "@/components/story-section"
import Newsletter from "@/components/newsletter"

export default function Home() {
  return (
    <>
      <Header />
      <main className="min-h-screen">
        <Hero />
        <StorySection />
        <MembershipTiers />
        <ProductShowcase />
        <Newsletter />
      </main>
      <Footer />
    </>
  )
}
