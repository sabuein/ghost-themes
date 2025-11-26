import type React from "react"
import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Aunty Suzy - Authentic Palestinian Traditions",
  description:
    "Discover authentic Palestinian food, handcrafts, and heritage delivered monthly. Join our community of food and culture lovers.",
  keywords: ["Palestinian food", "handmade", "subscription box", "heritage", "authentic recipes"],
  authors: [{ name: "Aunty Suzy" }],
  creator: "Aunty Suzy",
  publisher: "Aunty Suzy",
  formatDetection: {
    email: false,
    telephone: false,
  },
    generator: 'v0.app'
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: "#3d4c1f",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
