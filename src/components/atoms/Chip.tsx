/* type ChipProps = {
  className?: string
  children: React.ReactNode
}

export const Chip = ({ className, children }: ChipProps) => (
  <div className={`flex justify-center items-center font-bold rounded-full uppercase ${className}`}>
    {children}
  </div>
)
 */

import clsx from "clsx";

type ChipProps = {
  className?: string;
  children: React.ReactNode;
};

export const Chip = ({ className, children }: ChipProps) => (
  <div
    className={clsx(
      "flex items-center font-bold uppercase justify-center rounded-full",
      className
    )}
  >
    {children}
  </div>
);
