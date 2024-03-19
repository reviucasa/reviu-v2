import { ReactNode } from 'react'

export const FieldError = ({ children, className }: { children?: ReactNode; className?: string }) =>
  children ? <p className={`text-red-500 text-sm ${className}`}>{children}</p> : <></>
