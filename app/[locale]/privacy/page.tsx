import type { Metadata } from "next";
import type { ReactNode } from "react";
import { getFormatter, getTranslations } from "next-intl/server";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { BUSINESS_CONTACT } from "@/app/data/contact";
import { BROWSER_STORAGE_ITEMS, PRIVACY_POLICY_UPDATED, THIRD_PARTY_POLICIES } from "@/app/data/privacy";

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata.privacy" });

  return {
    title: { absolute: t("title") },
    description: t("description"),
    alternates: {
      canonical: `/${locale}/privacy`,
      languages: {
        en: "/en/privacy",
        es: "/es/privacy",
        "x-default": "/en/privacy"
      }
    }
  };
}

const LINK_CLASS = "font-semibold text-tan-hover underline underline-offset-4 hover:text-primary";

function mailLink(address: string) {
  return function MailLink(chunks: ReactNode) {
    return (
      <a href={`mailto:${address}`} className={LINK_CLASS}>
        {chunks}
      </a>
    );
  };
}

function externalLink(href: string) {
  return function ExternalLink(chunks: ReactNode) {
    return (
      <a href={href} className={LINK_CLASS} target="_blank" rel="noopener noreferrer">
        {chunks}
      </a>
    );
  };
}

const emailTags = { address: BUSINESS_CONTACT.email, email: mailLink(BUSINESS_CONTACT.email) };
const privacyEmailTags = {
  privacyAddress: BUSINESS_CONTACT.privacyEmail,
  privacyEmail: mailLink(BUSINESS_CONTACT.privacyEmail)
};
const policyTags = {
  hospitable: externalLink(THIRD_PARTY_POLICIES.hospitable),
  stripe: externalLink(THIRD_PARTY_POLICIES.stripe),
  airbnb: externalLink(THIRD_PARTY_POLICIES.airbnb)
};

const COLLECTION_SECTIONS = ["newsletter", "contact", "reviews", "booking", "direct", "visit"] as const;
const THIRD_PARTY_LOADS = ["maps", "hospitable", "stripe", "fonts", "turnstile"] as const;
const RECIPIENTS = [
  "cloudflare",
  "resend",
  "formsubmit",
  "hospitable",
  "stripe",
  "openstreetmap",
  "google",
  "whatsapp"
] as const;
const RETENTION_ITEMS = ["newsletter", "messages", "bookings", "browser"] as const;

function Section({ id, heading, children }: { id: string; heading: string; children: ReactNode }) {
  return (
    <section aria-labelledby={id} className="space-y-4">
      <h2 id={id} className="text-2xl font-bold text-primary">
        {heading}
      </h2>
      {children}
    </section>
  );
}

export default async function PrivacyPage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "privacy" });
  const format = await getFormatter({ locale });
  const updated = format.dateTime(new Date(`${PRIVACY_POLICY_UPDATED}T12:00:00Z`), {
    dateStyle: "long",
    timeZone: "UTC"
  });
  return (
    <main className="min-h-screen bg-coastal-mist">
      <Navbar />
      <article className="mx-auto max-w-3xl px-4 pb-20 pt-28 text-gray-700 leading-relaxed">
        <header className="mb-10 space-y-4">
          <h1 className="text-4xl font-bold text-primary md:text-5xl">{t("title")}</h1>
          <p className="text-sm text-gray-600">{t("lastUpdated", { date: updated })}</p>
          <p className="text-lg">{t("intro")}</p>
        </header>

        <div className="space-y-12">
          <Section id="who-we-are" heading={t("whoWeAre.heading")}>
            <p>{t("whoWeAre.body")}</p>
            <p>{t.rich("whoWeAre.privacyContact", privacyEmailTags)}</p>
            <p>{t.rich("whoWeAre.email", emailTags)}</p>
          </Section>

          <Section id="what-we-collect" heading={t("collect.heading")}>
            <p>{t("collect.intro")}</p>
            <div className="space-y-4">
              {COLLECTION_SECTIONS.map((key) => (
                <div key={key} className="rounded-lg border border-gray-200 bg-white p-5">
                  <h3 className="mb-3 text-lg font-semibold text-primary">{t(`collect.${key}.heading`)}</h3>
                  <dl className="space-y-2">
                    {(["what", "why", "who"] as const).map((field) => (
                      <div key={field} className="sm:grid sm:grid-cols-[9rem_minmax(0,1fr)] sm:gap-4">
                        <dt className="font-semibold text-gray-900">{t(`collect.${field}Label`)}</dt>
                        <dd>{t(`collect.${key}.${field}`)}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              ))}
            </div>
          </Section>

          <Section id="cookies" heading={t("storage.heading")}>
            <p>{t("storage.intro")}</p>
            <ul className="space-y-4">
              {BROWSER_STORAGE_ITEMS.map((item) => (
                <li key={item.id} className="rounded-lg border border-gray-200 bg-white p-5">
                  <p className="mb-3 break-words font-mono text-sm font-semibold text-gray-900">{item.names}</p>
                  <dl className="space-y-2 text-sm">
                    <div className="sm:grid sm:grid-cols-[9rem_minmax(0,1fr)] sm:gap-4">
                      <dt className="font-semibold text-gray-900">{t("storage.setByLabel")}</dt>
                      <dd>{item.setBy}</dd>
                    </div>
                    <div className="sm:grid sm:grid-cols-[9rem_minmax(0,1fr)] sm:gap-4">
                      <dt className="font-semibold text-gray-900">{t("storage.typeLabel")}</dt>
                      <dd>{item.kinds.map((kind) => t(`storage.kinds.${kind}`)).join(", ")}</dd>
                    </div>
                    <div className="sm:grid sm:grid-cols-[9rem_minmax(0,1fr)] sm:gap-4">
                      <dt className="font-semibold text-gray-900">{t("storage.purposeLabel")}</dt>
                      <dd>{t(`storage.items.${item.id}.purpose`)}</dd>
                    </div>
                    <div className="sm:grid sm:grid-cols-[9rem_minmax(0,1fr)] sm:gap-4">
                      <dt className="font-semibold text-gray-900">{t("storage.durationLabel")}</dt>
                      <dd>{t(`storage.items.${item.id}.duration`)}</dd>
                    </div>
                  </dl>
                </li>
              ))}
            </ul>
            <h3 className="pt-2 text-lg font-semibold text-primary">{t("storage.choicesHeading")}</h3>
            <p>{t("storage.choices")}</p>
            <p>{t("storage.thirdParty")}</p>
            <h3 className="pt-2 text-lg font-semibold text-primary">{t("storage.loadsHeading")}</h3>
            <p>{t("storage.loadsIntro")}</p>
            <ul className="list-disc space-y-1 pl-6">
              {THIRD_PARTY_LOADS.map((key) => (
                <li key={key}>{t(`storage.loads.${key}`)}</li>
              ))}
            </ul>
          </Section>

          <Section id="recipients" heading={t("recipients.heading")}>
            <p>{t("recipients.intro")}</p>
            <ul className="list-disc space-y-1 pl-6">
              {RECIPIENTS.map((key) => (
                <li key={key}>{t(`recipients.items.${key}`)}</li>
              ))}
            </ul>
          </Section>

          <Section id="location" heading={t("location.heading")}>
            <p>{t("location.body")}</p>
          </Section>

          <Section id="retention" heading={t("retention.heading")}>
            <ul className="list-disc space-y-2 pl-6">
              {RETENTION_ITEMS.map((key) => (
                <li key={key}>{key === "bookings" ? t.rich("retention.bookings", policyTags) : t(`retention.${key}`)}</li>
              ))}
            </ul>
          </Section>

          <Section id="rights" heading={t("rights.heading")}>
            <p>{t("rights.body")}</p>
            <p>{t.rich("rights.request", privacyEmailTags)}</p>
            <p>{t("rights.complaint")}</p>
          </Section>

          <Section id="required" heading={t("required.heading")}>
            <p>{t("required.body")}</p>
            <p>{t("required.automated")}</p>
          </Section>

          <Section id="do-not-track" heading={t("dnt.heading")}>
            <p>{t("dnt.body")}</p>
          </Section>

          <Section id="changes" heading={t("changes.heading")}>
            <p>{t("changes.body")}</p>
          </Section>

          <Section id="contact" heading={t("contact.heading")}>
            <p>{t.rich("contact.privacy", privacyEmailTags)}</p>
            <p>{t.rich("contact.general", emailTags)}</p>
          </Section>
        </div>
      </article>
      <Footer />
    </main>
  );
}
