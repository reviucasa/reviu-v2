import { Button } from '@/components/atoms/Button'
import { Dialog } from '@/components/atoms/Dialog'

type HowEnvironmentDialogProps = {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  description: string
  title?: string
  onAccept?: () => void
  acceptText: string
}

export const AcceptDialog = ({
  isOpen,
  setIsOpen,
  description,
  title,
  onAccept,
  acceptText
}: HowEnvironmentDialogProps) => {
  const onClickAccept = () => {
    if (onAccept) onAccept()
    setIsOpen(false)
  }
  return (
    <Dialog
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      title={title}
      description={description}
      className="text-center w-[500px]"
    >
      <div className="w-full flex justify-center mt-10">
        <Button buttonClassName="btn-primary-500" onClick={onClickAccept}>
          {acceptText}
        </Button>
      </div>
    </Dialog>
  )
}
