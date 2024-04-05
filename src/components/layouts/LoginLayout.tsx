"use client";
import Image, { StaticImageData } from "next/image";
import Logo from "../../../public/reviuLogo.svg";
import { useRouter } from "next/navigation";

export const LoginLayout = ({
  children,
  image,
  imageAlt,
}: {
  children: React.ReactNode;
  image?: StaticImageData;
  imageAlt?: string;
}) => {
  const router = useRouter();

  return (
    <div className="flex h-screen lg:items-center bg-white">
      <div className="flex-1 hidden bg-secondary-200 h-full items-center justify-center relative lg:flex">
        {image && (
          <Image
            quality={100}
            src={image}
            alt={imageAlt || ""}
            width={300}
            className="object-contain h-auto"
            priority
          />
        )}
      </div>
      <div className="absolute top-8 left-8">
        <Image
          src={Logo}
          quality={100}
          alt="Home review"
          className="object-contain cursor-pointer h-auto"
          width={120}
          onClick={() => {
            router.push("/");
          }}
        />
      </div>
      <div className="px-4 mt-28 w-full lg:w-7/12 lg:px-32 lg:mt-0 ">
        {children}
      </div>
    </div>
  );
};
