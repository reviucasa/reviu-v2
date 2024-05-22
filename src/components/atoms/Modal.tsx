import { Description, DialogPanel, DialogTitle, Dialog as HeadlessUIDialog } from "@headlessui/react";
import { ReactNode } from "react";
import { AiOutlineClose } from "react-icons/ai";

export const Modal = ({
  isOpen,
  setIsOpen,
  children,
  title,
  description,
  iconClose,
}: {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  children?: ReactNode;
  title?: string;
  description?: string;
  iconClose?: boolean;
}) => {
  return (
    <HeadlessUIDialog
      className="relative z-50"
      open={isOpen}
      onClose={() => setIsOpen(false)}
    >
      {/* The backdrop, rendered as a fixed sibling to the panel container */}
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      {/* Full-screen container to center the panel */}
      <div className="fixed inset-0 flex items-center justify-center p-0">
        {/* The actual dialog panel  */}
        <DialogPanel
          className={"max-h-full  bg-transparent  drop-shadow-guzzu "}
        >
          {iconClose && (
            <div
              className="flex bg-white w-10 h-10 absolute right-6 top-6 justify-center items-center rounded-lg cursor-pointer"
              onClick={() => setIsOpen(false)}
            >
              <AiOutlineClose size={24} />
            </div>
          )}
          <div className={"overflow-auto max-h-full mx-auto"}>
            <DialogTitle as="h4" className="mb-4">
              {title}
            </DialogTitle>
            <Description>
              {description}
            </Description>
            {children}
          </div>
        </DialogPanel>
      </div>
    </HeadlessUIDialog>
  );
};
