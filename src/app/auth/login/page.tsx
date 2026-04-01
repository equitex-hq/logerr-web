import LoginForm from "@/components/auth/LoginForm";

export const metadata = {
  title: "Login",
};

export default function Page() {
  return (
    <main>
      <section className="flex items-center justify-center min-h-dvh px-4 md:px-8 py-16">
        <LoginForm />
      </section>
    </main>
  );
}
