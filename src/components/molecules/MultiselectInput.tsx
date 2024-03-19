import { RadioOption } from '@/components/atoms/RadioOption'
import { forwardRef, Ref } from 'react'

type MultiselectInputProps = {
  options: { label: string; value: string }[]
  onChange: (value: string[]) => void
  value?: Array<string>
  ariaInvalid?: boolean
}

export const MultiselectInput = forwardRef(function MultiselectInput(
  { options, onChange, value = [], ariaInvalid }: MultiselectInputProps,
  ref: Ref<HTMLDivElement>
) {
  const onClickOption = (optionValue: string) => {
    if (value.find((element) => element === optionValue)) {
      onChange(value.filter((element) => element !== optionValue))
    } else {
      onChange([...value, optionValue])
    }
  }

  return (
    <div aria-multiselectable ref={ref}>
      <div className="flex gap-2 flex-wrap">
        {options.map((option) => (
          <div key={option.label} onClick={() => onClickOption(option.value)}>
            <RadioOption
              ariaInvalid={ariaInvalid}
              label={option.label}
              checked={!!value.find((element) => element === option.value)}
            />
          </div>
        ))}
      </div>
    </div>
  )
})
