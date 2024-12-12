import { ManagementForm } from '@/components/forms/ManagementForm'
import { setRequestLocale } from 'next-intl/server';

export default function Management({
  params: { locale },
}: {
  params: { locale: string };
}) {
  setRequestLocale(locale);
  return <ManagementForm />
}

