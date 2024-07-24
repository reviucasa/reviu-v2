"use client";
import { useTranslations } from "next-intl";
import { useRouter } from "@/navigation";
import { useState } from "react";
import { FieldError } from "../atoms/FieldError";
import lupa from "public/images/lupa-green.png";
import { AgencyComboBox } from "../atoms/AgencyComboBox";
import { RealStateAgency } from "@/models/agency";

export function AgencyComboBoxClient({ className }: { className?: string }) {
  const t = useTranslations();
  const router = useRouter();
  const [selectedRealStateAgency, setSelectedRealStateAgency] =
    useState<RealStateAgency>();

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>();

  const onSelectRealStateAgency = async (agency: RealStateAgency) => {
    setSelectedRealStateAgency(agency);
    if (agency) {
      setLoading(true);
      router.push(`/agency/${agency.documentId}`);
    } else {
      setError(t("common.noSeEncontroLaInmobiliaria"));
    }
    setLoading(false);
  };

  return (
    <div className={`flex flex-col w-full items-center ${className}`}>
      <AgencyComboBox
        icon={lupa}
        placeholder={t("common.searchAgency")}
        className="lg:w-3/4 w-full"
        selectedAgencyLoading={loading}
        selectedRealStateAgency={selectedRealStateAgency}
        setSelectedRealStateAgency={onSelectRealStateAgency}
      />
      <div className="flex lg:w-3/4 w-full">
        <FieldError className=" my-3">{error}</FieldError>
      </div>
    </div>
  );
}
