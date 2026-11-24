interface BusinessContact {
  email: string
  privacyEmail: string
  location: string
  formEndpoint: string
  phoneAndWhatsApp: string | null
}

export const BUSINESS_CONTACT: BusinessContact = {
  email: "gabriel@silverpineapple.net",
  // Owner-chosen address for privacy and data requests (2026-10-11).
  privacyEmail: "gabriel@silverpineapple.net",
  location: "Melbourne, FL 32935",
  // FormSubmit activation for gabriel@silverpineapple.net was completed on
  // 2026-11-24; a labelled test submission was confirmed received (Gmail filed
  // it in Spam). Endpoint stays the raw address; a hashed alias was not
  // substituted.
  formEndpoint: "https://formsubmit.co/ajax/gabriel@silverpineapple.net",
  phoneAndWhatsApp: "+1 (201) 282-7398",
}
