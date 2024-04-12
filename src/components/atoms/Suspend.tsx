import { Menu } from "@headlessui/react";
import { useTranslations } from "next-intl";
import { BiTrash } from "react-icons/bi";

export const Suspend = ({
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
      <Menu.Button
        className="flex gap-2 items-center bg-white rounded-lg p-2 border w-auto h-full hover:bg-red-200"
        onClick={onAction}
      >
        <div className="w-5 h-5 flex items-center justify-center cursor-pointer text-red-500 ">
          <BiTrash />
        </div>
        <span className="text-sm">Suspend / Delete</span>
      </Menu.Button>
    </Menu>
  );
};
