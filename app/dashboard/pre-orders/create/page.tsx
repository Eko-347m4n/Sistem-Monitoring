import Form from '@/app/ui/pre-orders/create-form';
import Breadcrumbs from '@/app/ui/pre-orders/breadcrumbs';
import { auth } from '@/auth';
import { notFound } from 'next/navigation';
 
export default async function Page() {
  const session = await auth();
  if (session?.user?.role !== 'ADMIN') {
    notFound();
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Pre-Orders', href: '/dashboard/pre-orders' },
          {
            label: 'Create Pre-Order',
            href: '/dashboard/pre-orders/create',
            active: true,
          },
        ]}
      />
      <Form />
    </main>
  );
}
