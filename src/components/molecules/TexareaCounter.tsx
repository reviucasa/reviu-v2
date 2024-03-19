/* import { Control, useController } from "react-hook-form";

interface Props {
  control: Control<AssertsShape<any>>;
  name: string;
  maxLength?: number;
  className?: string;
  defaultValue?: string;
  placeholder?: string;
  ariaInvalid?: boolean;
}

const TextAreaWithCharCounter = ({
  control,
  name,
  maxLength = 400,
  className,
  defaultValue,
  placeholder,
  ariaInvalid,
}: Props) => {
  const { field } = useController({
    control,
    name,
    defaultValue,
  });

  return (
    <div className="relative">
      <textarea
        aria-invalid={ariaInvalid}
        {...field}
        maxLength={maxLength}
        placeholder={placeholder}
        className={`w-full ${className}`}
      />
      <div className="absolute bottom-4 right-4 text-gray-400 text-sm">
        {field.value?.length || 0}/{maxLength}
      </div>
    </div>
  );
};

export default TextAreaWithCharCounter;
 */