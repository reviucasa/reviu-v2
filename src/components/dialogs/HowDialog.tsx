import { Dialog } from '../atoms/Dialog'

type HowEnvironmentDialogProps = {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  values: { title: string; description: string }[]
  title?: string
}

export const HowDialog = ({ isOpen, setIsOpen, values, title }: HowEnvironmentDialogProps) => {
  return (
    <Dialog isOpen={isOpen} setIsOpen={setIsOpen} title={title}>
      <div className="grid lg:grid-cols-2 gap-5">
        {values.map((value) => (
          <p key={value.title} className="text-sm border border-gray-300 p-3 rounded-md">
            <div className="font-bold">{value.title}</div>
            <span className="text-gray-500">{value.description}</span>
          </p>
        ))}
      </div>
    </Dialog>
  )
}
