import { getTranslations } from 'next-intl/server';

export default async function Introduction() {
  const t = await getTranslations('introduction');

  return (
    <section className="py-20 px-4 bg-transparent">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-primary mb-8 tracking-tight">{t('heading')}</h2>
        <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
          {t('body')}
        </p>
      </div>
    </section>
  )
}
