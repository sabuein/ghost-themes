import Link from "next/link"
import { Facebook, Instagram, Mail, Phone } from "lucide-react"

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="box-container py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-secondary/20 flex items-center justify-center">
                <span className="font-serif font-bold text-lg">AS</span>
              </div>
              <span className="font-serif text-xl font-bold">Aunty Suzy</span>
            </div>
            <p className="text-primary-foreground/80 text-sm leading-relaxed">
              Bringing Palestinian heritage and handmade treasures to London since 2004.
            </p>
            <div className="flex gap-4 pt-4">
              <a href="#" className="hover:text-secondary transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-secondary transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="mailto:hello@auntysuzy.co.uk" className="hover:text-secondary transition-colors">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-serif text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {[
                { label: "Home", href: "/" },
                { label: "Membership", href: "#membership" },
                { label: "About Us", href: "/about" },
                { label: "Blog", href: "/blog" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-primary-foreground/80 hover:text-secondary transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-serif text-lg font-bold mb-4">Support</h3>
            <ul className="space-y-2">
              {[
                { label: "Contact Us", href: "/contact" },
                { label: "FAQs", href: "/faqs" },
                { label: "Shipping Info", href: "/shipping" },
                { label: "Returns", href: "/returns" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-primary-foreground/80 hover:text-secondary transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-serif text-lg font-bold mb-4">Get in Touch</h3>
            <div className="space-y-3">
              <a
                href="mailto:hello@auntysuzy.co.uk"
                className="flex items-center gap-2 text-primary-foreground/80 hover:text-secondary transition-colors text-sm"
              >
                <Mail className="w-4 h-4" />
                hello@auntysuzy.co.uk
              </a>
              <a
                href="tel:+442071234567"
                className="flex items-center gap-2 text-primary-foreground/80 hover:text-secondary transition-colors text-sm"
              >
                <Phone className="w-4 h-4" />
                +44 207 123 4567
              </a>
              <p className="text-primary-foreground/80 text-sm">London, United Kingdom</p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-primary-foreground/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-primary-foreground/60 text-sm">&copy; {currentYear} Aunty Suzy. All rights reserved.</p>
            <div className="flex gap-6">
              <Link
                href="/privacy"
                className="text-primary-foreground/60 hover:text-secondary transition-colors text-sm"
              >
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-primary-foreground/60 hover:text-secondary transition-colors text-sm">
                Terms of Service
              </Link>
              <Link
                href="/cookies"
                className="text-primary-foreground/60 hover:text-secondary transition-colors text-sm"
              >
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
