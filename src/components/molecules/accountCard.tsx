import Image, { StaticImageData } from 'next/image'

export const AccountCard = ({
  className,
  emailAccount,
  children,
  image,
  imageAlt
}: {
  children: React.ReactNode
  className?: string
  emailAccount?: string
  image?: StaticImageData
  imageAlt?: string
}) => {
  return (
    <div className={`${className} border border-gray-300 rounded-md lg:p-6 p-4 w-full`}>
      <div className="grid lg:grid-cols-[auto_1fr] grid-cols-[1fr_auto] lg:gap-8 gap-4">
        <div className="lg:block hidden">{image && <Image src={image} alt={imageAlt || ''} className="h-fit" />}</div>
        <div>
          <p className="flex items-center lg:text-base text-sm font-bold mb-4">{emailAccount}</p>
          {children}
        </div>
        <div className="flex lg:hidden">{image && <Image src={image} alt={imageAlt || ''} className="h-fit" />}</div>
      </div>
    </div>
  )
}
