import Image from "next/image";
import { getTranslations } from "next-intl/server";
import Nextgen from "public/images/eu-nextgen.png";
import GobEs from "public/images/gob-es.png";
import GenCat from "public/images/gencat.png";
import Canodrom from "public/images/canodrom.png";

export async function Partners() {
  const t = await getTranslations();

  return (
    <div>
      <h3 className="lg:text-[20px] lg:leading-10 text-sm leading-7 text-center">
        {t("about.confíanEnNosotros")}
      </h3>

      <div className="flex flex-col w-full md:flex-row items-center justify-between gap-12 md:gap-6 mt-12 max-w-lg mx-auto">
        <Image src={Canodrom} className="h-auto w-32" alt="icon canodrom" />
        <Image src={GenCat} className="h-auto w-36" alt="icon gencat" />
        <Image src={GobEs} className="h-auto w-36" alt="icon gobes" />
        <Image src={Nextgen} className="h-auto w-36" alt="icon next-gen" />
      </div>
    </div>
  );
}
