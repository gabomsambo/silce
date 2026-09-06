import { photoSrcSet } from "@/lib/photos"

function UnitPhoto({
  src,
  alt,
  sizes,
  eager,
  className,
}: {
  src: string
  alt: string
  sizes: string
  eager?: boolean
  className?: string
}) {
  return (
    <img
      src={src}
      srcSet={photoSrcSet(src)}
      sizes={sizes}
      alt={alt}
      className={className}
      loading={eager ? "eager" : "lazy"}
      decoding={eager ? "sync" : "async"}
    />
  )
}

export default function UnitGallery({
  images,
  title,
  imageAlt,
}: {
  images: string[]
  title: string
  imageAlt: (title: string, number: number) => string
}) {
  if (images.length === 0) return null

  const hero = images[0]
  const mosaic = images.slice(1, 5)
  const rest = images.slice(5)

  return (
    <section className="relative">
      <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-2 md:h-[60vh]">
        <div className="relative overflow-hidden md:col-span-2 md:row-span-2">
          <UnitPhoto
            src={hero}
            alt={imageAlt(title, 1)}
            sizes="(min-width: 1024px) 50vw, 100vw"
            eager
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
        {mosaic.map((src, i) => (
          <div key={src} className="relative overflow-hidden min-h-[180px]">
            <UnitPhoto
              src={src}
              alt={imageAlt(title, i + 2)}
              sizes="(min-width: 1024px) 25vw, 50vw"
              eager={i < 2}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
        ))}
      </div>
      {rest.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
          {rest.map((src, i) => (
            <div key={src} className="relative overflow-hidden aspect-[3/2]">
              <UnitPhoto
                src={src}
                alt={imageAlt(title, i + 6)}
                sizes="(min-width: 768px) 25vw, 50vw"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
