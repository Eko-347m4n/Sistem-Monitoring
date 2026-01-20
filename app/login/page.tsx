import LoginForm from '@/app/ui/login/login-form';
 
export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5">
        <div className="mb-4 text-center">
            <h1 className="text-2xl font-bold text-slate-900">Welcome Back</h1>
            <p className="text-slate-500 text-sm">Please sign in to your account</p>
        </div>
        <LoginForm />
      </div>
    </main>
  );
}