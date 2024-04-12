import { useTranslations } from "next-intl";
import FaceGreen from "public/faceGreen.svg";
import FacePink from "public/facePink.svg";
import { Card } from "../molecules/Card";

type SectionCardsProps = {
  className?: string;
};

export function SectionCards({ className }: SectionCardsProps) {
  const t = useTranslations();

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
