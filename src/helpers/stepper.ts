import { steps } from "@/staticData"

//funcion para obtener la url dinámica positionStep
export const getUrlReview = (reviewStep: number) => steps[reviewStep].url

//funcion para encontrar url en el array
export const getPositionUrlReview = (urlToFind: string) => steps.findIndex((posUrl) => posUrl.url === urlToFind)

//funcion para obtener la posicion dinámica
export const getNextStepReview = (reviewStep: number, step: number) => (reviewStep > step ? reviewStep : step)
