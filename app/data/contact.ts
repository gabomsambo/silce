interface BusinessContact {
  email: string
  location: string
  formEndpoint: string
  phoneAndWhatsApp: string | null
}

export const BUSINESS_CONTACT: BusinessContact = {
  email: "hello@silverpineapple.net",
  location: "Melbourne, FL 32935",
  // FormSubmit requires a one-time click-through activation of this inbox before it
  // delivers anything; until then this stays the raw address. Once activated, swap in
  // the hashed alias endpoint so the inbox is not compiled into the client bundle.
  // See "Form delivery" in AGENTS.md.
  formEndpoint: "https://formsubmit.co/ajax/hello@silverpineapple.net",
  phoneAndWhatsApp: "+1 (201) 282-7398",
}
