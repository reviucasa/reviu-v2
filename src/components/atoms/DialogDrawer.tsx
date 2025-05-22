import {
  Description,
  DialogPanel,
  DialogTitle,
  Dialog as HeadlessUIDialog,
  TransitionChild,
} from "@headlessui/react";
import { ReactNode, useRef } from "react";
import { AiOutlineClose } from "react-icons/ai";

export const DialogDrawer = ({
  isOpen,
  setIsOpen,
  children,
  title,
  description,
  className,
  iconClose,
}: {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  children?: ReactNode;
  title?: string;
  description?: string;
  className?: string;
  iconClose?: boolean;
}) => {
  const initialFocus = useRef(null);
  return (
    <HeadlessUIDialog
      initialFocus={initialFocus}
      className="relative z-10"
      open={isOpen}
      onClose={() => setIsOpen(false)}
    >
      {/* The backdrop, rendered as a fixed sibling to the panel container */}
      <div className="fixed inset-0 bg-black/50" aria-hidden="true" />

      {/* Full-screen container to center the panel */}
      <TransitionChild
        enter="transition duration-500 sm:duration-700"
        enterFrom="translate-x-full"
        enterTo="translate-x-0"
        leave="transition duration-500 "
        leaveFrom="translate-x-0"
        leaveTo="translate-x-full"
      >
        <div className="fixed inset-0 flex items-center justify-center p-4">
          {/* The actual dialog panel  */}
          <DialogPanel
            ref={initialFocus}
            className={`${className} max-h-full rounded-2xl bg-white drop-shadow-guzzu`}
          >
            {iconClose && (
              <>
                <div
                  className="lg:flex hidden bg-white w-10 h-10 absolute -left-10 top-14 justify-center items-center rounded-l-lg cursor-pointer"
                  onClick={() => setIsOpen(false)}
                >
                  <AiOutlineClose size={24} />
                </div>
                <div
                  className="lg:hidden flex absolute bg-white border border-gray-400 p-2 top-4 right-2 justify-center items-center rounded-lg cursor-pointer z-10"
                  onClick={() => setIsOpen(false)}
                >
                  <AiOutlineClose size={24} />
                </div>
              </>
            )}
            <div className="overflow-auto lg:p-10 p-4 pt-12 max-h-full mx-auto">
              <DialogTitle as="h4" className="mb-4">
                {title}
              </DialogTitle>
              <Description>{description}</Description>
              {children}
            </div>
          </DialogPanel>
        </div>
      </TransitionChild>
    </HeadlessUIDialog>
  );
};
