import React from "react";
import { Control, useController } from "react-hook-form";
import { BiLink } from "react-icons/bi";
import { AssertsShape } from "yup/lib/object";

interface Props {
  control: Control<AssertsShape<any>>;
  name: string;
  maxLength?: number;
  className?: string;
  defaultValue?: string;
  placeholder?: string;
  ariaInvalid?: boolean;
  withAddLink?: boolean;
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
      withAddLink = false,
    },
    ref
  ) => {
    const { field } = useController({
      control,
      name,
      defaultValue,
    });

    const insertLink = () => {
      const url = prompt("Enter the URL:", "www.idra.com");
      if (url) {
        const text = prompt("Enter the text for the link:");
        field.onChange(
          `${field.value} <a href="https://${url}" style="color: #9E80F7; text-decoration: underline; font-weight: 500;" target="_blank">${text}</a>`
        );
      }
    };

    return (
      <div className="relative">
        {withAddLink && (
          <div
            onClick={insertLink}
            className="absolute cursor-pointer -top-8 right-0  bg-primary-300 text-white  px-2 py-1 rounded text-xs"
          >Add link</div>
        )}
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
