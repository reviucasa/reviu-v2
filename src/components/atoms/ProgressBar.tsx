import { useRouter } from 'next/router'
import { useMemo } from 'react'

type Step = {
  label: string
  url: string
}

export const ProgressBar = ({ steps }: { steps: Step[] }) => {
  const router = useRouter()

  const getPercent = useMemo((): number => {
    const activeIndex = steps.findIndex((step) => step.url === router.pathname)
    return Math.round((activeIndex / (steps.length - 1)) * 100)
  }, [router.pathname, steps])

  return (
    <div className="relative w-full h-1 bg-gray-200 rounded-full">
      <div className="absolute top-0 left-0 h-full bg-primary-500 rounded-full" style={{ width: `${getPercent}%` }} />
    </div>
  )
}
