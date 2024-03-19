import { FieldError } from '@/components/atoms/FieldError'
import { ReviewFormLayout } from '@/components/layouts/ReviewFormLayout'
import { RadioInput } from '@/components/molecules/RadioInput'
import { yupResolver } from '@hookform/resolvers/yup'
import axios from 'axios'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import Face from 'public/face.png'
import { useCallback, useEffect, useState } from 'react'
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
import { RealAgencyComboBox } from '../atoms/RealAgencyComboBox'
import TextAreaWithCharCounter from '../molecules/TexareaCounter'

export const ManagementForm = () => {
  const { review } = useReview()
  const { onSubmitReview } = useSubmitReview('management')
  const { config } = useConfig()
  const router = useRouter()
  const { nextStepReview } = useStep()
  const { t } = useTranslation()

  const [selectedRealStateAgency, setSelectedRealStateAgency] = useState<string>()
  const [error, setError] = useState<string>()

  const schema = yup.object({
    is_real_state_agency: yup.boolean().required(t('common:seleccionaOpcion', 'Debes seleccionar una opción')),
    real_state_agency: yup.string().when('is_real_state_agency', (is_real_state_agency, schema) => {
      return is_real_state_agency === true
        ? schema.required(t('common:necesitamosSaber', 'Necesitamos saber el nombre de la inmobiliaria'))
        : schema
    }),
    real_state_dealing: yup.string().when('is_real_state_agency', (is_real_state_agency, schema) => {
      return is_real_state_agency === true
        ? schema.required(t('common:seleccionaOpcion', 'Debes seleccionar una opción'))
        : schema
    }),
    landlord_dealing: yup.string().required(t('common:seleccionaOpcion', 'Debes seleccionar una opción')),
    problem_solving: yup.string(),
    deposit: yup.string(),
    advice_real_state: yup.string(),
    advice_landlord: yup.string()
  })

  const {
    formState: { isDirty, isValid, errors, isSubmitSuccessful, dirtyFields },
    handleSubmit,
    control,
    watch,
    register,
    reset,
    setValue,
    getValues
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    reValidateMode: 'onChange',
    defaultValues: review?.review.management
  })

  const onSelectRealStateAgency = useCallback(async () => {
    setError(undefined)
    if (review && selectedRealStateAgency) {
      try {
        setValue('real_state_agency', selectedRealStateAgency, {
          shouldDirty: selectedRealStateAgency !== getValues('real_state_agency')
        })
      } catch (error) {
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 404) setError(t('common:noSeEncontroLaInmobiliaria'))
          else setError(error.response?.data.status)
        }
      }
    }
  }, [selectedRealStateAgency])

  useEffect(() => {
    if (selectedRealStateAgency) onSelectRealStateAgency()
  }, [selectedRealStateAgency])

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
    if (review) {
      setSelectedRealStateAgency(review?.review.management?.real_state_agency)
    }
  }, [review?.review.management])

  useEffect(() => {
    if (isSubmitSuccessful) router.push(getUrlReview(nextStepReview))
  }, [isSubmitSuccessful])

  useEffect(() => {
    router.events.on('routeChangeStart', handleRouteChange)
    return () => router.events.off('routeChangeStart', handleRouteChange)
  }, [isDirty])

  useEffect(() => {
    reset(review?.review.management)
  }, [review?.review.management])

  type FormData = yup.InferType<typeof schema>
  const watchIsRealStateAgency = watch('is_real_state_agency')
  const isFormCompleted = isValid && !isDirty

  const onSubmit: SubmitHandler<FormData> = (data) => onSubmitReview(data)

  return (
    <ReviewFormLayout
      title={t('managementReview:gestion', 'Gestión')}
      image={Face}
      imageAlt="face"
      commentTitle={t('managementReview:seAmable', 'Se amable y contructivo')}
      comment={t('managementReview:feedback', 'El feedback positivo es la mejor manera de comunicar y ser escuchado.')}
    >
      {config && (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
          <div className="flex flex-col">
            <label htmlFor="is_real_state_agency">
              {t('managementReview:gestionadoInmobiliaria', '¿Has gestionado el piso a través de una inmobiliaria?')}
            </label>
            <Controller
              name="is_real_state_agency"
              control={control}
              render={({ field }) => (
                <RadioInput
                  ariaInvalid={!!errors.is_real_state_agency}
                  {...field}
                  options={[
                    { label: t('common:si', 'Si'), value: true },
                    { label: t('common:no', 'No'), value: false }
                  ]}
                />
              )}
            />
            {errors.is_real_state_agency && <FieldError>{errors.is_real_state_agency.message}</FieldError>}
          </div>

          {watchIsRealStateAgency?.valueOf() === true && (
            <div className="flex flex-col">
              <label htmlFor="real_state_agency">
                {t('managementReview:queInmobiliaria', '¿Qué inmobiliaria lleva o ha llevado la gestión?')}
              </label>

              <RealAgencyComboBox
                selectedRealStateAgency={selectedRealStateAgency}
                setSelectedRealStateAgency={setSelectedRealStateAgency}
              />
              {errors.real_state_agency && <FieldError>{errors.real_state_agency.message}</FieldError>}
              <FieldError>{error}</FieldError>
            </div>
          )}
          {watchIsRealStateAgency?.valueOf() === true && (
            <div className="flex flex-col">
              <label htmlFor="real_state_dealing">
                {t('managementReview:tratoInmobiliaria', '¿Cómo ha sido el trato de la inmobiliaria?')}
              </label>
              <Controller
                name="real_state_dealing"
                control={control}
                render={({ field }) => (
                  <RadioInput
                    ariaInvalid={!!errors.real_state_dealing}
                    {...field}
                    options={config.landlord.landlord_treatment}
                  />
                )}
              />
              {errors.real_state_dealing && <FieldError>{errors.real_state_dealing.message}</FieldError>}
            </div>
          )}
          {watchIsRealStateAgency !== undefined && (
            <>
              <div className="flex flex-col">
                <label htmlFor="landlord_dealing">
                  {t('managementReview:tratoCasero', '¿Cómo ha sido el trato del casero/a?')}
                </label>
                <Controller
                  name="landlord_dealing"
                  control={control}
                  render={({ field }) => (
                    <RadioInput
                      ariaInvalid={!!errors.landlord_dealing}
                      {...field}
                      options={config.landlord.landlord_treatment}
                    />
                  )}
                />
                {errors.landlord_dealing && <FieldError>{errors.landlord_dealing.message}</FieldError>}
              </div>
              <div className="flex flex-col">
                <div className="flex justify-between">
                  <label htmlFor="problem_solving">
                    {t('managementReview:respuestaProblema', '¿Y la respuesta cuando surgió un problema?')}
                  </label>
                  <span className="text-gray-500 text-sm">{t('common:opcional', 'Opcional')}</span>
                </div>
                <Controller
                  name="problem_solving"
                  control={control}
                  render={({ field }) => (
                    <RadioInput
                      ariaInvalid={!!errors.problem_solving}
                      {...field}
                      options={config.landlord.problem_solving}
                    />
                  )}
                />
                {errors.problem_solving && <FieldError>{errors.problem_solving.message}</FieldError>}
              </div>
              <div className="flex flex-col">
                {review?.review.stay.current_residence ? (
                  ''
                ) : (
                  <>
                    <label htmlFor="deposit">{t('managementReview:fianza', '¿Te devolvieron la fianza?')}</label>
                    <Controller
                      name="deposit"
                      control={control}
                      render={({ field }) => <RadioInput {...field} options={config.landlord.deposit} />}
                    />
                    {errors.deposit && <FieldError>{errors.deposit.message}</FieldError>}
                  </>
                )}
              </div>
            </>
          )}
          {watchIsRealStateAgency?.valueOf() === true && (
            <div className="flex flex-col">
              <div className="flex justify-between">
                <label htmlFor="advice_real_state">
                  {t('managementReview:consejosInmobiliaria', '¿Qué consejos le darías a la inmobiliaria?')}
                </label>
                <span className="text-gray-500 text-sm">{t('common:opcional', 'Opcional')}</span>
              </div>
              <Controller
                name="advice_real_state"
                control={control}
                render={({ field }) => (
                  <TextAreaWithCharCounter
                    {...field}
                    ariaInvalid={!!errors.advice_real_state}
                    className="w-full h-32"
                    placeholder={t('managementReview:feedbackPositivo', 'Apórtales feedback contructivo')}
                    name="advice_real_state"
                    control={control}
                  />
                )}
              />
              {errors.advice_real_state && <FieldError>{errors.advice_real_state.message}</FieldError>}
            </div>
          )}
          {watchIsRealStateAgency !== undefined && (
            <>
              {' '}
              <div className="flex flex-col">
                <div className="flex justify-between">
                  <label htmlFor="advice_landlord">
                    {t('managementReview:consejosCasero', '¿Qué consejos le darías al casero/a?')}
                  </label>
                  <span className="text-gray-500 text-sm">{t('common:opcional', 'Opcional')}</span>
                </div>
                <Controller
                  name="advice_landlord"
                  control={control}
                  render={({ field }) => (
                    <TextAreaWithCharCounter
                      {...field}
                      ariaInvalid={!!errors.advice_landlord}
                      className="w-full h-32"
                      placeholder={t('managementReview:feedbackPositivo', 'Apórtales feedback contructivo')}
                      name="advice_landlord"
                      control={control}
                    />
                  )}
                />
                {errors.advice_landlord && <FieldError>{errors.advice_landlord.message}</FieldError>}
              </div>
              <div className="flex justify-between">
                <div>
                  <Back className="lg:hidden" />
                </div>

                <Button
                  buttonClassName={isFormCompleted ? 'btn-primary-transparent font-semibold' : 'btn-primary-500'}
                  disabled={isFormCompleted}
                >
                  {isFormCompleted ? t('common:guardado', 'Guardado') : t('common:guardar', 'Guardar')}
                  {isFormCompleted && <MdDone size={22} />}
                </Button>
              </div>
            </>
          )}
        </form>
      )}
    </ReviewFormLayout>
  )
}
