import Image from "next/image";
import Union from "public/images/Union.svg";
import Vector from "public/images/Vector.svg";
import { getTranslations } from "next-intl/server";

export type SectionsType = {
  [name: string]: {
    text: string;
    children: React.ReactNode;
    styleBorder: string;
    bg: Array<any>;
  };
};
export async function Header() {
  const t = await getTranslations();

  return (
    <div
      className={
        "w-full flex lg:justify-between justify-center h-60 rounded-[32px]"
      }
    >
      <Image src={Vector} alt="Slide image" className="lg:flex hidden" />
      <div className="flex flex-col lg:justify-center text-center align-middle gap-6">
        <h1 className="lg:text-5xl text-[32px] leading-10	">
          {t("about.informacionPoder")}
        </h1>
        <p className="lg:text-base text-sm text-gray-500">
          {t("about.imaginasEncontrarPiso")}
        </p>
      </div>
      <Image src={Union} alt="Slide image" className="lg:flex hidden" />
    </div>
  );
}
