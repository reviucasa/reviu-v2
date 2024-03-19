type LabelProps = {
  className?: string
  tittle?: string
  children: React.ReactNode
}

export const Label = ({ className, children, tittle }: LabelProps) => (
  <>
    {children && (
      <div className={`flex flex-col gap-2 text-sm md:text-base ${className}`}>
        <span className="font-bold">{tittle}</span>
        <p className="text-sm md:text-base">{children}</p>
      </div>
    )}
  </>
)
