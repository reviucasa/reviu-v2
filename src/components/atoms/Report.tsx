import { Menu, MenuButton } from "@headlessui/react";
import Image from "next/image";
import Flag from "public/images/IconFlag.svg";
import { useTranslations } from "next-intl";

export const Report = ({
  onAction,
  className,
}: {
  onAction?: any;
  className?: string;
}) => {
  const t = useTranslations();

  return (
    <Menu
      as="div"
      className={`${className} right-0 bottom-10 overflow-visible z-50 block h-10 `}
    >
      <MenuButton
        className="flex gap-2 items-center bg-white rounded-lg p-2 border w-auto h-full hover:bg-secondary-200"
        onClick={onAction}
      >
        <div className="w-4 h-4 flex items-center justify-center cursor-pointer ">
          <Image
            quality={100}
            src={Flag}
            alt={"report"}
            width={17}
            height={17}
          />
        </div>
        <span className="text-sm">{t("common.feedback")}</span>
      </MenuButton>
    </Menu>
  );
};
