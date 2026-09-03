interface BusinessContact {
  email: string
  location: string
  formEndpoint: string
  phoneAndWhatsApp: string | null
}

export const BUSINESS_CONTACT: BusinessContact = {
  email: "silverpineapplehosto@gmail.com",
  location: "Melbourne, FL 32935",
  formEndpoint: "https://formsubmit.co/ajax/silverpineapplehosto@gmail.com",
  // PHONE/WHATSAPP: set the shared E.164 number here when the captain supplies it.
  phoneAndWhatsApp: null,
}
