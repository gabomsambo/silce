interface BusinessContact {
  email: string
  privacyEmail: string
  location: string
  phoneAndWhatsApp: string | null
}

export const BUSINESS_CONTACT: BusinessContact = {
  email: "gabriel@silverpineapple.net",
  // Owner-chosen address for privacy and data requests (2026-10-11).
  privacyEmail: "gabriel@silverpineapple.net",
  location: "Melbourne, FL 32935",
  phoneAndWhatsApp: "+1 (201) 282-7398",
}
