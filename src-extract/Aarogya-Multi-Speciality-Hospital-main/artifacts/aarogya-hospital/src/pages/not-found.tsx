import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';
import { HOSPITAL, PHONE, TEL } from '@/components/common';
import { useLanguage } from '@/lib/i18n';

export default function NotFound() {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md mx-4">
        <CardContent className="pt-6">
          <div className="flex mb-4 gap-2">
            <AlertCircle className="h-8 w-8 text-red-500" />
            <h1 className="text-2xl font-bold text-gray-900">
              {HOSPITAL}
            </h1>
          </div>

          <p className="mt-4 text-sm text-gray-600">
            {t.notFound.message}
          </p>
          <div className="mt-6 flex flex-col gap-3 text-sm">
            <a className="font-semibold text-green-900 underline" href="/">{t.notFound.home}</a>
            <a className="font-semibold text-green-900 underline" href={TEL}>{t.notFound.call(PHONE)}</a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
