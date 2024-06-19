import { Menu, MenuButton } from "@headlessui/react";
import { BiCheckCircle } from "react-icons/bi";

export const Unsuspend = ({
  onAction,
  className,
}: {
  onAction?: any;
  className?: string;
}) => {
  return (
    <Menu
      as="div"
      className={`${className} right-0 bottom-10 overflow-visible z-50 block h-10 `}
    >
      <MenuButton
        className="flex gap-2 items-center bg-white rounded-lg p-2 border w-auto h-full  hover:border-green-500"
        onClick={onAction}
      >
        <div className="w-5 h-5 flex items-center justify-center cursor-pointer text-green-500 ">
          <BiCheckCircle />
        </div>
        <span className="text-sm">Publish </span>
      </MenuButton>
    </Menu>
  );
};
