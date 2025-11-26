"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Our Story", href: "#story" },
    { label: "Membership", href: "#membership" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ]

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b border-border">
      <nav className="box-container py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <span className="text-white font-serif font-bold text-lg">AS</span>
          </div>
          <span className="font-serif text-xl font-bold text-primary hidden sm:inline">Aunty Suzy</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-foreground hover:text-primary transition-colors font-medium text-sm"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="hidden md:flex items-center gap-4">
          <Link href="/account">
            <Button variant="ghost" className="text-foreground hover:text-primary">
              Account
            </Button>
          </Link>
          <Link href="/cart">
            <Button className="bg-secondary hover:bg-secondary/90 text-secondary-foreground gap-2">
              <ShoppingBag className="w-4 h-4" />
              Cart
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden p-2 hover:bg-muted rounded-lg transition-colors"
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden border-t border-border bg-white">
          <div className="box-container py-4 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block text-foreground hover:text-primary transition-colors font-medium py-2"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="border-t border-border pt-4 space-y-2">
              <Link href="/account" onClick={() => setIsOpen(false)}>
                <Button variant="outline" className="w-full bg-transparent">
                  Account
                </Button>
              </Link>
              <Link href="/cart" onClick={() => setIsOpen(false)}>
                <Button className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground">Cart</Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
