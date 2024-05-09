import { useTranslations } from "next-intl";
import Cactus from "public/images/BgCactus.svg";
import circulosection from "public/images/circulosection.svg";
import Justicia from "public/images/justicia.svg";
import KeyCommunity from "public/images/keyCommunty.svg";
import { ImageRounded } from "../atoms/ImageRounded";
import Image from "next/image";

export function OurValues() {
  const t = useTranslations();

  return (
    <div>
      <div className="flex justify-center mb-8">
        <label className="flex self-center absolute text-xs font-bold uppercase">
          {t("about.ourValues")}
        </label>
        <Image
          src={circulosection}
          alt=""
          width={152}
          className="h-auto"
        ></Image>
      </div>

      <div className="grid lg:grid-cols-3 justify-center gap-6 ">
        <ImageRounded smallSize classNameCard="bg-secondary-500" image={Cactus}>
          <h3 className="mt-7 mb-6 text-center">{t("about.transparencia")}</h3>
          <p className="text-center">{t("about.yaNoNecesitas")}</p>
        </ImageRounded>
        <ImageRounded
          smallSize
          classNameCard="bg-primary-500"
          image={KeyCommunity}
        >
          <h3 className="mt-7 mb-6 text-center">{t("about.comunidad")}</h3>
          <p className="text-center">{t("about.entreTodosPodemos")}</p>
        </ImageRounded>{" "}
        <ImageRounded
          smallSize
          classNameCard="bg-secondary-500"
          image={Justicia}
        >
          <h3 className="mt-7 mb-6 text-center">{t("about.justicia")}</h3>
          <p className="text-center">{t("about.hagamosEncontrar")}</p>
        </ImageRounded>
      </div>
    </div>
  );
}
