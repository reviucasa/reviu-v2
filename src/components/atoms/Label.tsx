type LabelProps = {
  className?: string
  title?: string
  children: React.ReactNode
}

export const Label = ({ className, children, title }: LabelProps) => (
  <>
    {children && (
      <div className={`flex flex-col gap-2 text-sm md:text-base ${className}`}>
        <span className="font-bold">{title}</span>
        <p className="text-sm md:text-base">{children}</p>
      </div>
    )}
  </>
)
