import FaceGreen from "public/images/faceGreen.svg";
import FacePink from "public/images/facePink.svg";
import { Card } from "../molecules/Card";
import { getTranslations } from "next-intl/server";

type SectionCardsProps = {
  className?: string;
};

export async function SectionCards({ className }: SectionCardsProps) {
  const t = await getTranslations();

  return (
    <div className={`${className} grid lg:grid-cols-2 justify-center gap-6`}>
      <Card
        background="bg-primary-100"
        image={FaceGreen}
        title={t("about.elProblema")}
        text={t("about.quienesHemosBuscado")}
      />
      <Card
        background="bg-secondary-200"
        image={FacePink}
        title={t("about.solución")}
        text={t("about.homeReviewPermite")}
      />
    </div>
  );
}
