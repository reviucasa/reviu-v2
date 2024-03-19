import { FieldError } from '@/components/atoms/FieldError'
import { ReviewFormLayout } from '@/components/layouts/ReviewFormLayout'
import { RadioInput } from '@/components/molecules/RadioInput'
import { yupResolver } from '@hookform/resolvers/yup'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import padlock from 'public/padlock.png'
import { useEffect } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { MdDone } from 'react-icons/md'
import { range } from 'src/helpers/generateRange'
import { getUrlReview } from 'src/helpers/stepper'
import { useReview } from 'src/hooks/swr/useReview'
import { useStep } from 'src/hooks/useStep'
import { useSubmitReview } from 'src/hooks/useSubmitReview'
import * as yup from 'yup'
import { Back } from '../atoms/Back'
import { Button } from '../atoms/Button'

export const StayForm = () => {
  const { review } = useReview()
  const { onSubmitReview } = useSubmitReview('stay')
  const router = useRouter()
  const { nextStepReview } = useStep()
  const { t } = useTranslation()

  const schema = yup.object({
    current_residence: yup.boolean().required(),
    start_month: yup.string().when(['current_residence'], {
      is: (current_residence: boolean) => current_residence === true,
      then: yup.string().required(t('common:seleccionaMes', 'Debes seleccionar un mes')),
      otherwise: yup
        .string()
        .required(t('common:seleccionaMes', 'Debes seleccionar un mes'))
        .test('validStartMonth', t("common.mesInicio",'El mes de inicio no puede ser posterior al mes actual'), function (value) {
          const { current_residence, start_year } = this.parent
          if (current_residence === true && value) {
            const currentYear = new Date().getFullYear()
            const currentMonth = new Date().getMonth() + 1
            const startYear = parseInt(start_year)
            const startMonth = parseInt(value)
            if (startYear > currentYear) {
              return false
            }
            if (startYear === currentYear && startMonth > currentMonth) {
              return false
            }
          }
          return true
        })
    }),
    start_year: yup.string().required(t('common:seleccionaAño', 'Debes seleccionar un año')),
    end_year: yup.string().when(['current_residence', 'start_year'], {
      is: (current_residence: boolean) => current_residence === false,
      then: yup
        .string()
        .required(t('common:seleccionaAño', 'Debes seleccionar un año'))
        .test('validYear', t('common:añoSalida','El año de salida no puede ser anterior al año de inicio'), function (value) {
          const { start_year } = this.parent
          if (!start_year || !value) {
            return true
          }
          const startYear = parseInt(start_year)
          const endYear = parseInt(value)
          return endYear >= startYear
        })
    }),
    end_month: yup.string().when(['current_residence', 'start_year', 'start_month'], {
      is: (current_residence: boolean) => current_residence === false,
      then: yup
        .string()
        .required(t('common:seleccionaMes', 'Debes seleccionar un mes'))
        .test('validEndMonth', t('common:mesSalida','El mes de salida no puede ser posterior al mes de inicio'), function (value) {
          const { start_year, start_month, end_year } = this.parent
          if (!start_year || !start_month || !value) {
            return true
          }
          const startYear = parseInt(start_year)
          const endYear = parseInt(end_year)
          const startMonth = parseInt(start_month)
          const endMonth = parseInt(value)
          if (startYear === endYear) {
            return endMonth >= startMonth
          }
          return true
        })
    }),
    start_price: yup.string().required(t('common:seleccionaPrecio','Debes seleccionar un precio')),
    end_price: yup.string().when('current_residence', (current_residence, schema) => {
      return current_residence === false ? schema.required(t('common:seleccionaPrecio','Debes seleccionar un precio')) : schema
    })
  })

  const {
    formState: { isDirty, isValid, errors, isSubmitSuccessful },
    register,
    handleSubmit,
    control,
    watch,
    reset
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    reValidateMode: 'onChange',
    defaultValues: review?.review.stay
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
    reset(review?.review.stay)
  }, [review?.review.stay])

  type FormData = yup.InferType<typeof schema>

  const onSubmit: SubmitHandler<FormData> = (data) => onSubmitReview(data)

  const watchcurrent_residence = watch('current_residence')
  return (
    <ReviewFormLayout
      title={t('stayReview:estancia', 'Estancia')}
      image={padlock}
      imageAlt="Padlock"
      commentTitle={t('stayReview:opinionAnonima')}
      comment={t('stayReview:informacionAnonima')}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <div className="flex flex-col">
          <label htmlFor="current_residence">
            {t('stayReview:residesActualmente', '¿Resides actualmente en esta dirección?')}
          </label>
          <Controller
            name="current_residence"
            control={control}
            render={({ field }) => (
              <RadioInput
                ariaInvalid={!!errors.current_residence}
                {...field}
                options={[
                  { label: t('common:si', 'Si'), value: true },
                  { label: t('common:no', 'No'), value: false }
                ]}
              />
            )}
          />

          {errors.current_residence && <FieldError>{errors.current_residence.message}</FieldError>}
        </div>
        {watchcurrent_residence !== undefined && (
          <div className="flex flex-col">
            <label>{t('stayReview:cuandoEmpezasteVivir', '¿Cuándo empezaste a vivir?')}</label>
            <div className="flex gap-3">
              <div className="w-full">
                <select aria-invalid={!!errors.start_month} className="w-full" {...register('start_month')}>
                  <option value="">{t('common:mes', 'Mes')}</option>
                  {range(1, 12).map((month) => (
                    <option key={month} value={month}>
                      {month}
                    </option>
                  ))}
                </select>
                {errors.start_month && <FieldError>{errors.start_month.message}</FieldError>}
              </div>
              <div className="w-full">
                <select aria-invalid={!!errors.start_year} className="w-full" {...register('start_year')}>
                  <option value="">{t('common:año', 'Año')}</option>
                  {range(2023, 1980, -1).map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
                {errors.start_year && <FieldError>{errors.start_year.message}</FieldError>}
              </div>
            </div>
          </div>
        )}
        {watchcurrent_residence?.valueOf() === false && (
          <div className="flex flex-col">
            <label>{t('stayReview:cuandoDejasteVivir', '¿Cuándo dejaste de vivir?')}</label>

            <div className="flex gap-3">
              <div className="w-full">
                <select aria-invalid={!!errors.end_month} className="w-full" {...register('end_month')}>
                  <option value="">{t('common:mes', 'Mes')}</option>
                  {range(1, 12).map((month) => (
                    <option key={month} value={month}>
                      {month}
                    </option>
                  ))}
                </select>
                {errors.end_month && <FieldError>{errors.end_month.message}</FieldError>}
              </div>
              <div className="w-full">
                <select aria-invalid={!!errors.end_year} className="w-full" {...register('end_year')}>
                  <option value="">{t('common:año', 'Año')}</option>
                  {range(2023, 1980, -1).map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
                {errors.end_year && <FieldError>{errors.end_year.message}</FieldError>}
              </div>
            </div>
          </div>
        )}

        {watchcurrent_residence !== undefined && (
          <div className="flex flex-col">
            <label htmlFor="start_price">
              {t('stayReview:quePrecioTeniaEntrar', '¿Qué precio tenia cuando entraste?')}
            </label>
            <input
              aria-invalid={!!errors.start_price}
              type="number"
              className="w-full"
              placeholder={t('stayReview:precioVivienda', 'Precio de la vivienda')}
              {...register('start_price')}
            />
            {errors.start_price && <FieldError>{errors.start_price.message}</FieldError>}
          </div>
        )}

        {watchcurrent_residence === false && (
          <div className="flex flex-col">
            <label htmlFor="end_price">{t('stayReview:quePrecioTeniaSalir', '¿Qué precio tenia te fuiste?')}</label>
            <input
              aria-invalid={!!errors.end_price}
              type="number"
              className="w-full"
              placeholder={t('stayReview:precioVivienda', 'Precio de la vivienda')}
              {...register('end_price')}
            />
            {errors.end_price && <FieldError>{errors.end_price.message}</FieldError>}
          </div>
        )}
        {watchcurrent_residence !== undefined && (
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
        )}
      </form>
    </ReviewFormLayout>
  )
}
