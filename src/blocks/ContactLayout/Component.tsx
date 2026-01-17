'use client'

import type { ContactLayoutBlock } from '@/payload-types'
import type { FormFieldBlock } from '@payloadcms/plugin-form-builder/types'

import React, { useCallback, useMemo, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'

import RichText from '@/components/RichText'
import { Media } from '@/components/Media'
import { Button } from '@/components/ui/button'
import { getClientSideURL } from '@/utilities/getURL'
import { Error } from '@/blocks/Form/Error'

const getDefaultValue = (field: FormFieldBlock) => {
  if ('defaultValue' in field && field.defaultValue !== undefined) {
    return field.defaultValue
  }

  if (field.blockType === 'checkbox') {
    return false
  }

  return ''
}

const inputClasses =
  'w-full bg-transparent border-b border-white/20 pb-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-primary'

export const ContactLayoutBlock: React.FC<ContactLayoutBlock> = (props) => {
  const {
    ctaEmail,
    ctaHeading,
    form: formFromProps,
    formHeading,
    heroHeading,
    heroSubheading,
    infoItems,
    media,
  } = props

  const form = typeof formFromProps === 'object' ? formFromProps : null

  const defaultValues = useMemo(() => {
    if (!form?.fields) return {}

    return form.fields.reduce<Record<string, unknown>>((acc, field) => {
      acc[field.name] = getDefaultValue(field)
      return acc
    }, {})
  }, [form?.fields])

  const formMethods = useForm({ defaultValues })
  const {
    formState: { errors },
    handleSubmit,
    register,
  } = formMethods

  const [isLoading, setIsLoading] = useState(false)
  const [hasSubmitted, setHasSubmitted] = useState<boolean>()
  const [error, setError] = useState<{ message: string; status?: string } | undefined>()

  const onSubmit = useCallback(
    (data: Record<string, unknown>) => {
      let loadingTimerID: ReturnType<typeof setTimeout>
      const submitForm = async () => {
        if (!form) return

        setError(undefined)

        const dataToSend = Object.entries(data).map(([name, value]) => ({
          field: name,
          value,
        }))

        loadingTimerID = setTimeout(() => {
          setIsLoading(true)
        }, 1000)

        try {
          const req = await fetch(`${getClientSideURL()}/api/form-submissions`, {
            body: JSON.stringify({
              form: form.id,
              submissionData: dataToSend,
            }),
            headers: {
              'Content-Type': 'application/json',
            },
            method: 'POST',
          })

          const res = await req.json()

          clearTimeout(loadingTimerID)

          if (req.status >= 400) {
            setIsLoading(false)

            setError({
              message: res.errors?.[0]?.message || 'Internal Server Error',
              status: res.status,
            })

            return
          }

          setIsLoading(false)
          setHasSubmitted(true)

          if (form.confirmationType === 'redirect' && form.redirect?.url) {
            window.location.href = form.redirect.url
          }
        } catch (err) {
          console.warn(err)
          setIsLoading(false)
          setError({
            message: 'Something went wrong.',
          })
        }
      }

      void submitForm()
    },
    [form],
  )

  if (!form) return null

  return (
    <section className="relative">
      <div className="container py-24">
        <div className="max-w-2xl">
          <p className="text-xs uppercase tracking-[0.3em] text-white/60">{heroSubheading}</p>
          <h2 className="mt-3 text-4xl font-semibold tracking-tight text-white md:text-5xl">
            {heroHeading}
          </h2>
        </div>

        <div className="mt-10 h-px w-full bg-white/10" />

        <div className="mt-12 grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
          <div>
            <h3 className="text-3xl font-semibold leading-tight text-white md:text-4xl whitespace-pre-line">
              {formHeading}
            </h3>
          </div>
          <div>
            <FormProvider {...formMethods}>
              {isLoading && !hasSubmitted && (
                <p className="text-sm text-white/70">Loading, please wait...</p>
              )}
              {error && (
                <p className="text-sm text-red-400">{`${error.status || '500'}: ${error.message || ''}`}</p>
              )}
              {!hasSubmitted && (
                <form className="space-y-8" id={form.id} onSubmit={handleSubmit(onSubmit)}>
                  {form.fields?.map((field, index) => {
                    if (!field?.blockType) return null

                    if (
                      field.blockType !== 'text' &&
                      field.blockType !== 'email' &&
                      field.blockType !== 'number' &&
                      field.blockType !== 'textarea'
                    ) {
                      return null
                    }

                    return (
                      <div key={index}>
                        <label
                          className="text-xs uppercase tracking-[0.3em] text-white/60"
                          htmlFor={field.name}
                        >
                          {field.label || field.name}
                        </label>
                        {field.blockType === 'textarea' ? (
                          <textarea
                            className={inputClasses}
                            id={field.name}
                            rows={4}
                            {...register(field.name, { required: field.required })}
                          />
                        ) : (
                          <input
                            className={inputClasses}
                            id={field.name}
                            type={field.blockType}
                            {...register(field.name, {
                              required: field.required,
                              valueAsNumber: field.blockType === 'number',
                            })}
                          />
                        )}
                        {errors[field.name] && <Error name={field.name} />}
                      </div>
                    )
                  })}

                  <Button size="sm" type="submit" variant="default">
                    {form.submitButtonLabel || 'Send'}
                  </Button>
                </form>
              )}
              {!isLoading && hasSubmitted && form.confirmationType === 'message' && (
                <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                  <RichText data={form.confirmationMessage} enableGutter={false} />
                </div>
              )}
            </FormProvider>
          </div>
        </div>

        <div className="mt-16 rounded-[32px] border border-white/10 bg-white/5 p-6">
          {media && typeof media === 'object' ? (
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-[24px]">
              <Media fill imgClassName="object-cover" resource={media} />
            </div>
          ) : (
            <div className="aspect-[16/9] w-full rounded-[24px] bg-black/40" />
          )}

          {infoItems && infoItems.length > 0 && (
            <div className="mt-6 grid gap-6 md:grid-cols-3">
              {infoItems.map((item, index) => {
                const value = item.value
                if (!value) return null

                const content = item.href ? (
                  <a className="text-white" href={item.href} rel="noreferrer" target="_blank">
                    {value}
                  </a>
                ) : (
                  <span className="text-white">{value}</span>
                )

                return (
                  <div className="text-sm" key={index}>
                    {item.label && (
                      <span className="block text-xs uppercase tracking-[0.3em] text-white/50">
                        {item.label}
                      </span>
                    )}
                    <div className="mt-2 text-sm text-white/80">{content}</div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {(ctaHeading || ctaEmail) && (
          <div className="mt-16 text-center">
            {ctaHeading && (
              <p className="text-xs uppercase tracking-[0.3em] text-primary">{ctaHeading}</p>
            )}
            {ctaEmail && (
              <a
                className="mt-4 block text-2xl font-semibold text-white underline underline-offset-4 md:text-4xl"
                href={`mailto:${ctaEmail}`}
              >
                {ctaEmail}
              </a>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
