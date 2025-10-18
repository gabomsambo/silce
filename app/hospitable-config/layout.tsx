import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Configuration Page - Do Not Index",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
}

export default function HospitableConfigLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
