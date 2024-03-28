import React from "react";
import { Control, useController } from "react-hook-form";
import { AssertsShape } from "yup/lib/object";

interface Props {
  control: Control<AssertsShape<any>>;
  name: string;
  maxLength?: number;
  className?: string;
  defaultValue?: string;
  placeholder?: string;
  ariaInvalid?: boolean;
}

const TextAreaWithCharCounter = React.forwardRef<HTMLTextAreaElement, Props>(
  (
    {
      control,
      name,
      maxLength = 400,
      className,
      defaultValue,
      placeholder,
      ariaInvalid,
    },
    ref
  ) => {
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
  }
);

// Assign a displayName to the component
TextAreaWithCharCounter.displayName = "TextAreaWithCharCounter";

export default TextAreaWithCharCounter;
