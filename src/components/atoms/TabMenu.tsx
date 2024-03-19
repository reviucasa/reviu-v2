type MenuOptionProps = {
  key: string
  title: string
  onClick: () => void
}

type TabMenuProps = {
  className?: string
  title?: string
  options: MenuOptionProps[]
  activeOption: string
}

export const TabMenu = ({ className, title, options, activeOption }: TabMenuProps): JSX.Element => {
  return (
    <div
      className={`border-b border-b-gray-400 w-full flex items-baseline justify-between ${className}  md:overflow-visible overflow-auto no-scrollbar`}
    >
      {title && <span>{title}</span>}
      <div className={`${!!title && 'justify-end'} w-full flex md:gap-12 gap-8`}>
        {options.map((option) => {
          const active = activeOption === option.key
          return (
            <div
              key={option.title}
              className={`${
                active && 'border-b-2 border-b-secondary-500'
              } cursor-pointer md:whitespace-normal whitespace-nowrap`}
              onClick={option.onClick}
            >
              {option.title}
            </div>
          )
        })}
      </div>
    </div>
  )
}
