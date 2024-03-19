import { FieldError } from '@/components/atoms/FieldError'
import { ReviewFormLayout } from '@/components/layouts/ReviewFormLayout'
import { RadioInput } from '@/components/molecules/RadioInput'
import { yupResolver } from '@hookform/resolvers/yup'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { AiOutlineInfoCircle } from 'react-icons/ai'
import { MdDone } from 'react-icons/md'
import { getUrlReview } from 'src/helpers/stepper'
import { useConfig } from 'src/hooks/swr/useConfig'
import { useReview } from 'src/hooks/swr/useReview'
import { useStep } from 'src/hooks/useStep'
import { useSubmitReview } from 'src/hooks/useSubmitReview'
import * as yup from 'yup'
import { Back } from '../atoms/Back'
import { Button } from '../atoms/Button'
import { HowDialog } from '../dialogs/HowDialog'
import { MultiselectInput } from '../molecules/MultiselectInput'
import TextAreaWithCharCounter from '../molecules/TexareaCounter'

export const NeighbourhoodForm = () => {
  const [vibeOpen, setVibeOpen] = useState(false)
  const [securityOpen, setSecurityOpen] = useState(false)
  const router = useRouter()
  const { nextStepReview } = useStep()
  const { review } = useReview()
  const { config } = useConfig()
  const { onSubmitReview } = useSubmitReview('neighbourhood')
  const { t } = useTranslation()

  const schema = yup.object({
    vibe: yup
      .array()
      .required(t('common:alMenosUnaOpcion', 'Debes seleccionar al menos una opción'))
      .test('minLenght', t('common:alMenosUnaOpcion', 'Debes seleccionar al menos una opción'), (val) =>
        val?.length ? val?.length > 0 : false
      ),
    tourists: yup.string().required(t('common:seleccionaOpcion', 'Debes seleccionar una opción')),
    noise: yup.string().required(t('common:seleccionaOpcion', 'Debes seleccionar una opción')),
    security: yup.string().required(t('common:seleccionaOpcion', 'Debes seleccionar una opción')),
    cleaning: yup.string().required(t('common:seleccionaOpcion', 'Debes seleccionar una opción')),
    services: yup
      .array()
      .required(t('common:alMenosUnaOpcion', 'Debes seleccionar al menos una opción'))
      .test('minLenght', t('common:alMenosUnaOpcion', 'Debes seleccionar al menos una opción'), (val) =>
        val?.length ? val?.length > 0 : false
      ),
    comments: yup.string().nullable()
  })

  const vibeValues = [
    {
      title: t('common:Tranquilo', 'Tranquilo'),
      description: t('common:bajosNivelesRuido', 'Bajos niveles de ruido, sin aglomeraciones en la calle')
    },
    {
      title: t('common:Lúdico/Festivo'),
      description: t('common:ambienteActivo', 'Ambiente activo, con oferta de ocio y espacios para compartir.')
    },
    {
      title: t('common:Familiar'),
      description: t('common:ambienteAmigable', 'Ambiente amigable para familias, colegios, parques infantiles...')
    },
    {
      title: t('common:Estudiantil'),
      description: t('common:centrosEducativos', 'Centros educativos, residencias, ocio universitario...')
    },
    {
      title: t('common:Nocturno'),
      description: t('common:zonaActiva', 'Zona activa durante las noches, por flujo de gente y/o locales.')
    }
  ]

  const securityValues = [
    {
      title: t('common:muySegura', 'Muy segura'),
      description: t('common:sinAltercados', 'No hay altercados en la zona y nunca me he sentido en peligro')
    },
    {
      title: t('common:mejorable', 'Mejorable'),
      description: t('common:algunAltercado', 'Algún que otro altercado durante el día. Inseguro de noche')
    },
    {
      title: t('common:sinProblemas', 'Sin problemas'),
      description: t('common:altercadosOcasionales', 'Los altercados son un problema ocasional que sale de la norma')
    },
    {
      title: t('common:pocoSegura', 'Poco segura'),
      description: t('common:inseguro', 'Es inseguro ir solo por la calle y hay altercados a diario.')
    }
  ]
  const {
    formState: { isDirty, isValid, errors, isSubmitSuccessful },
    handleSubmit,
    control,
    reset
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    reValidateMode: 'onChange',
    defaultValues: review?.review.neighbourhood
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
    reset(review?.review.neighbourhood)
  }, [review?.review.neighbourhood])

  type FormData = yup.InferType<typeof schema>

  const onSubmit: SubmitHandler<FormData> = (data) => onSubmitReview(data)

  return (
    <ReviewFormLayout title={t('common:barrio', 'Barrio o zona')}>
      {config && (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
          <div className="flex flex-col">
            <div className="flex justify-between">
              <label htmlFor="vibe">
                {t('common:ambience', 'Ambiente')}
                <AiOutlineInfoCircle
                  className="cursor-pointer"
                  onClick={() => {
                    setVibeOpen(true)
                  }}
                />
              </label>
              <span className="text-gray-500 text-sm">
                {t('neighbourhoodReview:unaOpcion', 'Elige al menos una opción')}
              </span>
            </div>
            <Controller
              name="vibe"
              control={control}
              render={({ field }) => (
                <MultiselectInput ariaInvalid={!!errors.vibe} {...field} options={config.neighborhood.vibe} />
              )}
            />
            {errors.vibe && <FieldError>{errors.vibe.message}</FieldError>}
          </div>
          <div className="flex flex-col">
            <label htmlFor="tourists">{t('common:turistas', 'Turistas')}</label>
            <Controller
              name="tourists"
              control={control}
              render={({ field }) => (
                <RadioInput ariaInvalid={!!errors.tourists} {...field} options={config.neighborhood.tourists} />
              )}
            />
            {errors.tourists && <FieldError>{errors.tourists.message}</FieldError>}
          </div>
          <div className="flex flex-col">
            <label htmlFor="noise">{t('common:ruido', 'Ruido')}</label>
            <Controller
              name="noise"
              control={control}
              render={({ field }) => (
                <RadioInput ariaInvalid={!!errors.noise} {...field} options={config.neighborhood.noise} />
              )}
            />
            {errors.noise && <FieldError>{errors.noise.message}</FieldError>}
          </div>
          <div className="flex flex-col">
            <label htmlFor="security">
              {t('common:seguridad', 'Seguridad')}
              <AiOutlineInfoCircle
                className="cursor-pointer"
                onClick={() => {
                  setSecurityOpen(true)
                }}
              />
            </label>
            <Controller
              name="security"
              control={control}
              render={({ field }) => (
                <RadioInput ariaInvalid={!!errors.security} {...field} options={config.neighborhood.security} />
              )}
            />
            {errors.security && <FieldError>{errors.security.message}</FieldError>}
          </div>
          <div className="flex flex-col">
            <label htmlFor="currentResidence">{t('common:limpieza', 'Limpieza')}</label>
            <Controller
              name="cleaning"
              control={control}
              render={({ field }) => (
                <RadioInput ariaInvalid={!!errors.cleaning} {...field} options={config.neighborhood.cleaning} />
              )}
            />
            {errors.cleaning && <FieldError>{errors.cleaning.message}</FieldError>}
          </div>
          <div className="flex flex-col">
            <div className="flex justify-between">
              <label htmlFor="currentResidence">
                {t('neighbourhoodReview:serviciosProximos', 'Servicios próximos (a 300m)')}
              </label>
              <span className="text-gray-500 text-sm">
                {t('neighbourhoodReview:unaOpcion', 'Elige al menos una opción')}
              </span>
            </div>
            <Controller
              name="services"
              control={control}
              render={({ field }) => <MultiselectInput {...field} options={config.neighborhood.services} />}
            />
            {errors.services && <FieldError>{errors.services.message}</FieldError>}
          </div>
          <div className="flex flex-col">
            <div className="flex justify-between">
              <label htmlFor="comments">{t('common:añadirComentario', '¿Quieres añadir un comentario?')}</label>
              <span className="text-gray-500 text-sm">{t('common:opcional', 'Opcional')}</span>
            </div>
            <Controller
              name="comments"
              control={control}
              render={({ field }) => (
                <TextAreaWithCharCounter
                  {...field}
                  ariaInvalid={!!errors.comments}
                  className="w-full h-32"
                  placeholder={t(
                    'neighbourhoodReview:algunComentarioAñadir',
                    'Añade algun comentario más que quieras aportar'
                  )}
                  name="comments"
                  control={control}
                />
              )}
            />
            {errors.comments && <FieldError>{errors.comments.message}</FieldError>}
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
        </form>
      )}
      <HowDialog
        isOpen={vibeOpen}
        setIsOpen={setVibeOpen}
        values={vibeValues}
        title={t('neighbourhoodReview:comoValorasAmbiente', 'Cómo valorar el ambiente en tu zona')}
      />
      <HowDialog
        isOpen={securityOpen}
        setIsOpen={setSecurityOpen}
        values={securityValues}
        title={t('neighbourhoodReview:comoValorasSeguridad', 'Cómo valorar la seguridad en tu zona')}
      />
    </ReviewFormLayout>
  )
}
