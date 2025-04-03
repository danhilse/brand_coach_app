import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Open_Sans } from "next/font/google"

// Initialize the Open Sans font
const openSans = Open_Sans({
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "600", "700"],
  variable: "--font-open-sans",
})

export const metadata: Metadata = {
  title: "Act-On Brand Analysis Tool",
  description: "Analyze marketing content against Act-On's brand guidelines",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
    generator: 'v0.dev'
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={openSans.className}>
      <body>{children}</body>
    </html>
  )
}



import './globals.css'