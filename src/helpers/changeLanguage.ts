import { NextRouter } from 'next/router'

export const languageRedirect = (router: NextRouter, language: string) => {
  const { pathname, asPath, query, locale } = router
  if (locale === language) return
  router.push({ pathname, query }, asPath, { locale: language, shallow: false })
  localStorage.setItem('language', language)
}
