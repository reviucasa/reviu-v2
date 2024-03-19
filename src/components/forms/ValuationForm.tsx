import { yupResolver } from '@hookform/resolvers/yup'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { MdDone } from 'react-icons/md'
import { getUrlReview } from 'src/helpers/stepper'
import { useConfig } from 'src/hooks/swr/useConfig'
import { useReview } from 'src/hooks/swr/useReview'
import { useStep } from 'src/hooks/useStep'
import { useSubmitReview } from 'src/hooks/useSubmitReview'
import * as yup from 'yup'
import { Back } from '../atoms/Back'
import { Button } from '../atoms/Button'
import { FieldError } from '../atoms/FieldError'
import { ReviewFormLayout } from '../layouts/ReviewFormLayout'
import { MultiselectInput } from '../molecules/MultiselectInput'
import { RadioInput } from '../molecules/RadioInput'

export const ValuationForm = () => {
  const { review } = useReview()
  const { config } = useConfig()
  const { onSubmitReview } = useSubmitReview('valuation')
  const router = useRouter()
  const { nextStepReview } = useStep()
  const { t } = useTranslation()

  const schema = yup.object({
    summer_temperature: yup.string().required(t('common:seleccionaOpcion', 'Debes seleccionar una opción')),
    winter_temperature: yup.string().required(t('common:seleccionaOpcion', 'Debes seleccionar una opción')),
    noise: yup.string().required(t('common:seleccionaOpcion', 'Debes seleccionar una opción')),
    light: yup.string().required(t('common:seleccionaOpcion', 'Debes seleccionar una opción')),
    maintenance: yup.string().required(t('common:seleccionaOpcion', 'Debes seleccionar una opción')),
    services: yup.array()
  })
  const {
    formState: { isDirty, isValid, errors, isSubmitSuccessful },
    handleSubmit,
    control,
    reset
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    reValidateMode: 'onChange',
    defaultValues: review?.review.valuation
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
    if (isSubmitSuccessful) router.push(getUrlReview(nextStepReview))
  }, [isSubmitSuccessful])

  useEffect(() => {
    router.events.on('routeChangeStart', handleRouteChange)
    return () => router.events.off('routeChangeStart', handleRouteChange)
  }, [isDirty])

  useEffect(() => {
    reset(review?.review.valuation)
  }, [review?.review.valuation])

  type FormData = yup.InferType<typeof schema>
  const onSubmit: SubmitHandler<FormData> = async (data) => onSubmitReview(data)

  return (
    <ReviewFormLayout title={t('common:valoracionPiso', 'Valoración del piso')}>
      {config && (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
          <div className="flex flex-col">
            <label htmlFor="currentResidence">{t('common:temperaturaVerano', 'Temperatura en verano')}</label>
            <Controller
              name="summer_temperature"
              control={control}
              render={({ field }) => (
                <RadioInput
                  ariaInvalid={!!errors.summer_temperature}
                  {...field}
                  options={config.building_quality?.summer_temperature}
                />
              )}
            />
            {errors.summer_temperature && <FieldError>{errors.summer_temperature.message}</FieldError>}
          </div>
          <div className="flex flex-col">
            <label htmlFor="currentResidence">{t('common:temperaturaInvierno', 'Temperatura en invierno')}</label>
            <Controller
              name="winter_temperature"
              control={control}
              render={({ field }) => (
                <RadioInput
                  ariaInvalid={!!errors.winter_temperature}
                  {...field}
                  options={config.building_quality?.winter_temperature}
                />
              )}
            />
            {errors.winter_temperature && <FieldError>{errors.winter_temperature.message}</FieldError>}
          </div>
          <div className="flex flex-col">
            <label htmlFor="currentResidence">{t('common:ruido', 'Ruido')}</label>
            <Controller
              name="noise"
              control={control}
              render={({ field }) => (
                <RadioInput ariaInvalid={!!errors.noise} {...field} options={config.building_quality.noise} />
              )}
            />
            {errors.noise && <FieldError>{errors.noise.message}</FieldError>}
          </div>
          <div className="flex flex-col">
            <label htmlFor="currentResidence">{t('common:luz', 'Luz')}</label>
            <Controller
              name="light"
              control={control}
              render={({ field }) => (
                <RadioInput ariaInvalid={!!errors.light} {...field} options={config.building_quality.light} />
              )}
            />
            {errors.light && <FieldError>{errors.light.message}</FieldError>}
          </div>
          <div className="flex flex-col">
            <label htmlFor="currentResidence">{t('valuationForm:estadoPiso', 'Estado del piso y mantenimiento')}</label>
            <Controller
              name="maintenance"
              control={control}
              render={({ field }) => (
                <RadioInput
                  ariaInvalid={!!errors.maintenance}
                  {...field}
                  options={config.building_quality.maintenance}
                />
              )}
            />
            {errors.maintenance && <FieldError>{errors.maintenance.message}</FieldError>}
          </div>
          <div className="flex flex-col">
            <div className="flex justify-between">
              <label htmlFor="currentResidence">{t('common:services', 'Servicios')}</label>{' '}
              <span className="text-gray-500 text-sm">
                {t('valuationForm:eligeTantasComoQuieras', 'Elige tantas como quieras')}
              </span>
            </div>
            <Controller
              name="services"
              control={control}
              render={({ field }) => (
                <MultiselectInput
                  ariaInvalid={!!errors.services}
                  {...field}
                  options={config.building_quality.services}
                />
              )}
            />
            {errors.services && <FieldError>{errors.services.message}</FieldError>}
          </div>
          <div className="flex justify-between">
            <div>
              <Back className="lg:hidden" />
            </div>
            <Button
              buttonClassName={isFormCompleted ? 'btn-primary-transparent font-semibold' : 'btn-primary-500'}
              disabled={isFormCompleted}
            >
              {isFormCompleted ? (
                <>
                  {t('common:guardado', 'Guardado')}
                  <MdDone size={22} />
                </>
              ) : (
                <>{t('common:guardar', 'Guardar')}</>
              )}
            </Button>
          </div>
        </form>
      )}
    </ReviewFormLayout>
  )
}
