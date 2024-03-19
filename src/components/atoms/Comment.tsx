import Image, { StaticImageData } from 'next/image'
import triangle from '../../../public/triangle.png'

export const Comment = ({
  className,
  comment,
  commentTitle,
  image,
  imageAlt,
  tailSign,
  classNameText
}: {
  className?: string
  comment?: string
  commentTitle?: string
  image?: StaticImageData
  imageAlt?: string
  tailSign?: boolean
  classNameText?: string
}) => {
  return (
    <div
      className={`text-sm text-primary-500 bg-lime p-6 ${
        tailSign ? 'rounded-t-2xl rounded-r-2xl lg:rounded-tl-none lg:rounded-bl-2xl' : 'rounded-2xl'
      } relative ${className}`}
    >
      <div className="flex items-center justify-between gap-3">
        <h5>{commentTitle}</h5>
        {image && <Image quality={100} src={image} alt={imageAlt || ''} width={36} height={48} />}
      </div>
      <p className={`pt-4 text-base w-4/5 ${classNameText}`}>{comment}</p>
      {tailSign && (
        <Image
          quality={100}
          src={triangle}
          width={30}
          height={30}
          alt="triangle"
          className="absolute -bottom-7 left-0 lg:top-0 lg:-left-7 lg:rotate-90"
        />
      )}
    </div>
  )
}
