import { RadioOption } from '@/components/atoms/RadioOption'
import { RadioGroup } from '@headlessui/react'
import { forwardRef, Ref } from 'react'

type RadioInputProps = {
  value?: boolean | string
  options: { label: string; value: boolean | string }[]
  onChange: (value: boolean) => void
  ariaInvalid?: boolean
}

export const RadioInput = forwardRef(function radioInput(
  { value, options, onChange, ariaInvalid }: RadioInputProps,
  ref: Ref<HTMLDivElement>
) {
  return (
    <RadioGroup aria-multiselectable ref={ref} onChange={onChange} value={value}>
      <div className="flex gap-2 flex-wrap">
        {options.map((option) => (
          <RadioGroup.Option key={option.label} value={option.value}>
            {({ checked }) => <RadioOption ariaInvalid={ariaInvalid} label={option.label} checked={checked} />}
          </RadioGroup.Option>
        ))}
      </div>
    </RadioGroup>
  )
})
