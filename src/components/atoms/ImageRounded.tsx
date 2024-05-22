type ImageProps = {
  children: React.ReactNode
  image?: any
  smallSize?: boolean
  className?: string
  classNameCard?: string
}
import Image from 'next/image'
export const ImageRounded: React.FC<ImageProps> = ({
  children,
  image,
  className,
  classNameCard,
  smallSize
}: ImageProps) => {
  return (
    <div className={className}>
      <div className={`${smallSize && 'px-14'}`}>
        <div className={`${classNameCard} h-0 md:w-full pb-[114%] rounded-t-[48%] relative overflow-hidden`}>
          <Image fill sizes="auto" className="object-cover" src={image} alt="" />
        </div>
      </div>
      {children}
    </div>
  )
}
