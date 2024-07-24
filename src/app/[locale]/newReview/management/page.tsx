import { ManagementForm } from '@/components/forms/ManagementForm'
import { unstable_setRequestLocale } from 'next-intl/server';

export default function Management({
  params: { locale },
}: {
  params: { locale: string };
}) {
  unstable_setRequestLocale(locale);
  return <ManagementForm />
}

