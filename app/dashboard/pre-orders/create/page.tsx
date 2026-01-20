import Form from '@/app/ui/pre-orders/create-form';
import Breadcrumbs from '@/app/ui/pre-orders/breadcrumbs';
 
export default async function Page() {
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
