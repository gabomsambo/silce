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
  // FormSubmit activation for gabriel@silverpineapple.net is proven for the
  // production origin https://silverpineapple.net (2026-11-24): a labelled
  // POST with that Origin returned success:true and the message was seen in
  // the gabriel@ mailbox under Spam (not Inbox). Endpoint stays the raw
  // address; a hashed alias was not substituted. Other origins (e.g.
  // localhost) may still get "needs Activation".
  formEndpoint: "https://formsubmit.co/ajax/gabriel@silverpineapple.net",
  phoneAndWhatsApp: "+1 (201) 282-7398",
}
