import { SubmitHandler } from 'react-hook-form'
import { useStep } from './useStep'
import { useReview } from './swr/useReview'

type ReturnSubmitReview = {
  onSubmitReview: SubmitHandler<any>
}

export function useSubmitReview(formName: string): ReturnSubmitReview {
  const { updateReview } = useReview()
  const { nextStepReview } = useStep()

  const onSubmit: SubmitHandler<any> = async (data: any) => {
    try {
      await updateReview({ review: { [formName]: data, step: nextStepReview } })
    } catch (error) {
      console.log(error)
    }
  }

  return {
    onSubmitReview: onSubmit
  }
}
