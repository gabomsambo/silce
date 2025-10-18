import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Search Properties",
  description: "Search available properties at Silver Pineapple. Find the perfect short-term rental in Melbourne, FL.",
  robots: {
    index: false,  // Don't index search results page (dynamic widget content)
    follow: true,
  },
}

export default function SearchLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
