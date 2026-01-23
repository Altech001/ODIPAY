import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import SignInForm from "../../components/auth/SignInForm";

export default function SignIn() {
  return (
    <>
      <PageMeta
        title="Odipay - Sign In"
        description="Sign In to your account"
      />
      <AuthLayout>
        <SignInForm />
      </AuthLayout>
    </>
  );
}
