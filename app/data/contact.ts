interface BusinessContact {
  email: string
  location: string
  phoneAndWhatsApp: string | null
}

export const BUSINESS_CONTACT: BusinessContact = {
  email: "silverpineapplehosto@gmail.com",
  location: "Melbourne, FL 32935",
  // PHONE/WHATSAPP: set the shared E.164 number here when the captain supplies it.
  phoneAndWhatsApp: null,
}
