type ChipProps = {
  className?: string
  children: React.ReactNode
}

export const Chip = ({ className, children }: ChipProps) => (
  <div className={`flex justify-center items-center font-bold px-4 py-1 rounded-full uppercase ${className}`}>
    {children}
  </div>
)
