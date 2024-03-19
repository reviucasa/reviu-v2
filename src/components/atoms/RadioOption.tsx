type RadioOptionProps = {
  label: string
  checked: boolean
  ariaInvalid?: boolean
}

export const RadioOption = ({ label, checked, ariaInvalid }: RadioOptionProps) => {
  return (
    <div
      className={`py-2 px-4 border border-gray-300 rounded-md cursor-pointer text-gray-600 font-light hover:bg-primary-200 hover:border-primary-300 hover:text-primary-500 ${
        checked ? 'text-primary-500 bg-primary-100 border-primary-300' : ''
      } ${ariaInvalid ? 'border-red-500' : ''}`}
    >
      {label}
    </div>
  )
}
