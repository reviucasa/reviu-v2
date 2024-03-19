import { yupResolver } from '@hookform/resolvers/yup'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import smileHouse from 'public/smile_house.png'
import { useEffect } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { useReview } from 'src/hooks/swr/useReview'
import { useStep } from 'src/hooks/useStep'
import { useSubmitReview } from 'src/hooks/useSubmitReview'
import * as yup from 'yup'
import { Back } from '../atoms/Back'
import { Button } from '../atoms/Button'
import { FieldError } from '../atoms/FieldError'
import { ReviewFormLayout } from '../layouts/ReviewFormLayout'
import { RadioInput } from '../molecules/RadioInput'
import TextAreaWithCharCounter from '../molecules/TexareaCounter'

export const OpinionForm = () => {
  const { review, updateReview } = useReview()
  const { onSubmitReview } = useSubmitReview('opinion')
  const router = useRouter()
  const { nextStepReview } = useStep()
  const { t } = useTranslation()

  const schema = yup.object({
    title: yup.string().required(t('common:tituloRequerido', 'El título es requerido')),
    positive: yup.string().required(t('common:tuValoracionPositiva', 'Necesitamos tu valoración positiva')),
    negative: yup.string().required(t('common:tuValoracionNegativa', 'Necesitamos tu valoración negativa')),
    recomend: yup
      .boolean()
      .required(t('common:recomendariasVivienda', 'Necesitamos saber si recomendarías la vivienda'))
  })
  type FormData = yup.InferType<typeof schema>
  const {
    formState: { isDirty, isValid, errors, isSubmitSuccessful },
    control,
    handleSubmit,
    reset
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    reValidateMode: 'onChange',
    defaultValues: review?.review.opinion
  })
  const isFormCompleted = isValid && !isDirty

  const handleRouteChange = () => {
    if (isDirty) {
      const resultado = confirm(
        t(
          'common:withSaving',
          '¡Tienes cambios sin guardar!\nVas a perder los cambios si no guardas los cambios realizados antes de cambiar de sección.'
        )
      )
      if (!resultado) {
        router.events.emit('routeChangeError', 'routeChange aborted', '', { shallow: false }) //primer argumento NOMBRE del evento // segundo info ruta actual // tercero ruta destino
        throw 'routeChange aborted.'
      }
    }
  }

  useEffect(() => {
    router.events.on('routeChangeStart', handleRouteChange)
    return () => router.events.off('routeChangeStart', handleRouteChange)
  }, [isDirty])

  useEffect(() => {
    reset(review?.review.opinion)
  }, [review?.review.opinion])

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    await onSubmitReview(data)
    await updateReview({ draft: false })
    router.push('/success')
  }

  return (
    <ReviewFormLayout
      title={t('opinionReview:opinionPiso', 'Opinión del piso')}
      image={smileHouse}
      imageAlt="Smile house"
      commentTitle={t('opinionReview:conciso')}
      comment={t('opinionReview:estaInformacion')}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <div className="flex flex-col">
          <label htmlFor="title">{t('opinionReview:resumeExperiencia', 'Resume tu experiencia en un titular')}</label>
          <Controller
            name="title"
            control={control}
            render={({ field }) => (
              <TextAreaWithCharCounter
                {...field}
                maxLength={80}
                ariaInvalid={!!errors.positive}
                className="w-full h-20"
                placeholder={t('opinionReview:escribeSencillo', 'Escribe un título sencillo')}
                name="title"
                control={control}
              />
            )}
          />
          {errors.title && <FieldError>{errors.title.message}</FieldError>}
        </div>
        <div className="flex flex-col">
          <label htmlFor="positive">
            {t('opinionReview:valorPositivo', '¿Qué valoras positivamente de este piso?')}
          </label>
          <Controller
            name="positive"
            control={control}
            render={({ field }) => (
              <TextAreaWithCharCounter
                {...field}
                ariaInvalid={!!errors.positive}
                className="w-full h-32"
                placeholder={t(
                  'opinionReview:cuentanosCosasBuenas',
                  'Cuéntanos las cosas buenas que tiene la vivienda'
                )}
                name="positive"
                control={control}
              />
            )}
          />

          {errors.positive && <FieldError>{errors.positive.message}</FieldError>}
        </div>
        <div className="flex flex-col">
          <label htmlFor="negative">
            {t('opinionReview:valorNegativo', '¿Qué valoras negativamente de este piso?')}
          </label>

          <Controller
            name="negative"
            control={control}
            render={({ field }) => (
              <TextAreaWithCharCounter
                {...field}
                ariaInvalid={!!errors.negative}
                className="w-full h-32"
                placeholder={t('opinionReview:cuentanosMejorias', 'Cuéntanos las cosas que mejorarías de la vivienda')}
                name="negative"
                control={control}
              />
            )}
          />
          {errors.negative && <FieldError>{errors.negative.message}</FieldError>}
        </div>
        <div className="flex flex-col">
          <label htmlFor="recomend">{t('opinionReview:recomendarias', '¿Recomendarias este piso a un amigo?')}</label>
          <Controller
            name="recomend"
            control={control}
            render={({ field }) => (
              <RadioInput
                ariaInvalid={!!errors.recomend}
                {...field}
                options={[
                  { label: t('common:si', 'Si'), value: true },
                  { label: t('common:no', 'No'), value: false }
                ]}
              />
            )}
          />

          {errors.recomend && <FieldError>{errors.recomend.message}</FieldError>}
        </div>

        <div className="flex justify-between">
          <div>
            <Back className="lg:hidden" />
          </div>
          <Button buttonClassName={'btn-secondary-500'}>{t('common:publicar')}</Button>
        </div>
      </form>
    </ReviewFormLayout>
  )
}
