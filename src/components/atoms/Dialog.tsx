import { Dialog as HeadlessUIDialog } from '@headlessui/react'
import { ReactNode } from 'react'
import { AiOutlineClose } from 'react-icons/ai'

export const Dialog = ({
  isOpen,
  setIsOpen,
  children,
  title,
  description,
  className,
  iconClose
}: {
  isOpen: boolean
  setIsOpen: (value: boolean) => void
  children?: ReactNode
  title?: string
  description?: string
  className?: string
  iconClose?: boolean
}) => {
  return (
    <HeadlessUIDialog className="relative z-50" open={isOpen} onClose={() => setIsOpen(false)}>
      {/* The backdrop, rendered as a fixed sibling to the panel container */}
      <HeadlessUIDialog.Backdrop className="fixed inset-0 bg-black/50 z-40" aria-hidden="true" />

      {/* Full-screen container to center the panel */}
      <div className="fixed inset-0 flex items-center justify-center lg:p-4 p-0">
        {/* The actual dialog panel  */}
        <HeadlessUIDialog.Panel className={`${className} max-h-full  rounded-2xl bg-white  drop-shadow-guzzu `}>
          {iconClose && (
            <div
              className="flex bg-white w-10 h-10 absolute -left-10 top-14 justify-center items-center rounded-l-lg cursor-pointer"
              onClick={() => setIsOpen(false)}
            >
              <AiOutlineClose size={24} />
            </div>
          )}
          <div className="overflow-auto lg:p-10 p-4 max-h-full mx-auto">
            <HeadlessUIDialog.Title as="h4" className="mb-4">
              {title}
            </HeadlessUIDialog.Title>
            <HeadlessUIDialog.Description>{description}</HeadlessUIDialog.Description>
            {children}
          </div>
        </HeadlessUIDialog.Panel>
      </div>
    </HeadlessUIDialog>
  )
}
