import { Pathnames, LocalePrefix } from "next-intl/routing";

export const defaultLocale = "ca" as const;
export const locales = ["es", "ca", "en"] as const;

export const pathnames: Pathnames<typeof locales> = {
  "/": "/",
  "/about": {
    es: "/sobre-nosotros",
    ca: "/sobre-nosaltres",
    en: "/about",
  },
  "/account": {
    es: "/cuenta",
    ca: "/compte",
    en: "/account",
  },
  "/agency/[agency]": {
    es: "/immobiliaria/[agency]",
    ca: "/inmobiliaria/[agency]",
    en: "/agency/[agency]",
  },
  "/auth": "/auth",
  "/auth/checkEmail": {
    es: "/auth/revisa-correo",
    ca: "/auth/revisa-correu",
    en: "/auth/check-email",
  },
  "/blog": "/blog",
  /* "/building": {
    es: "/edificio",
    ca: "/edifici",
    en: "/building",
  }, */
  /* "/building/[building]": {
    es: "/edificio/[building]",
    ca: "/edifici/[building]",
    en: "/building/[building]",
  }, */
  "/building/[city]/[address]/[number]": {
    es: "/opinión-edificio/[city]/[address]/[number]",
    ca: "/opinió-edifici/[city]/[address]/[number]",
    en: "/opinion-building/[city]/[address]/[number]",
  },
  "/cookies": "/cookies",
  "/review": {
    es: "/reseña",
    ca: "/ressenya",
    en: "/review",
  },
  "/faqs": "/faqs",
  "/legalNotice": {
    es: "/aviso-legal",
    ca: "/avis-legal",
    en: "/legal-notice",
  },
  "/legalPages": "/legal",
  "/privacyPolicy": {
    es: "/politica-privacidad",
    ca: "/politica-privadesa",
    en: "/privacy-policy",
  },
  "/newReview": {
    es: "/nueva-reseña",
    ca: "/nova-ressenya",
    en: "/new-review",
  },
  "/newReview/address": {
    es: "/nueva-reseña/direccion",
    ca: "/nova-ressenya/adreça",
    en: "/new-review/address",
  },
  "/newReview/community": {
    es: "/nueva-reseña/comunidad",
    ca: "/nova-ressenya/comunitat",
    en: "/new-review/building",
  },
  "/newReview/management": {
    es: "/nueva-reseña/gestion",
    ca: "/nova-ressenya/gestio",
    en: "/new-review/management",
  },
  "/newReview/neighbourhood": {
    es: "/nueva-reseña/vecindario",
    ca: "/nova-ressenya/barri",
    en: "/new-review/neighbourhood",
  },
  "/newReview/opinion": {
    es: "/nueva-reseña/opinion",
    ca: "/nova-ressenya/opinio",
    en: "/new-review/opinion",
  },
  "/newReview/stay": {
    es: "/nueva-reseña/estancia",
    ca: "/nova-ressenya/estada",
    en: "/new-review/stay",
  },
  "/newReview/valuation": {
    es: "/nueva-reseña/valoracion",
    ca: "/nova-ressenya/valoracio",
    en: "/new-review/valuation",
  },
  /* "/review/[address]/[reviewId]": {
    es: "/reseña/[address]/[reviewId]",
    ca: "/ressenya/[address]/[reviewId]",
    en: "/review/[address]/[reviewId]",
  }, */
  "/review/[city]/[address]/[number]/[reviewId]": {
    es: "/reseña/[city]/[address]/[number]/[reviewId]",
    ca: "/ressenya/[city]/[address]/[number]/[reviewId]",
    en: "/review/[city]/[address]/[number]/[reviewId]",
  },
  "/success": "/success",
  "/suspended": "/suspended",
  "/termsAndConditions": {
    es: "/condiciones-uso",
    ca: "/condicions-us",
    en: "/terms-conditions",
  },
};

export const localePrefix: LocalePrefix<typeof locales> = "always";

export const port = process.env.PORT || 3000;
export const host = "https://reviucasa.com"; //`http://localhost:${port}`;
