import { Dialog as HeadlessUIDialog } from "@headlessui/react";
import clsx from "clsx";
import { ReactNode } from "react";
import { AiOutlineClose } from "react-icons/ai";

export const Modal = ({
  isOpen,
  setIsOpen,
  children,
  title,
  description,
}: {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  children?: ReactNode;
  title?: string;
  description?: string;
}) => {
  return (
    <HeadlessUIDialog
      className="relative z-50"
      open={isOpen}
      onClose={() => setIsOpen(false)}
    >
      {/* The backdrop, rendered as a fixed sibling to the panel container */}
      <HeadlessUIDialog.Backdrop
        className="fixed inset-0 bg-black/50 z-40"
        aria-hidden="true"
      />

      {/* Full-screen container to center the panel */}
      <div className="fixed inset-0 flex items-center justify-center p-0">
        {/* The actual dialog panel  */}
        <HeadlessUIDialog.Panel
          className={"max-h-full  bg-transparent  drop-shadow-guzzu "}
        >
          <div className={"overflow-auto max-h-full mx-auto"}>
            <HeadlessUIDialog.Title as="h4" className="mb-4">
              {title}
            </HeadlessUIDialog.Title>
            <HeadlessUIDialog.Description>
              {description}
            </HeadlessUIDialog.Description>
            {children}
          </div>
        </HeadlessUIDialog.Panel>
      </div>
    </HeadlessUIDialog>
  );
};
