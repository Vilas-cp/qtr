import { SignInButton } from "@clerk/nextjs";

const SignInPage = () => {
  return (
    <div className="signin-page">
      <h1>Please Sign In</h1>
      <SignInButton>
        <button>Sign In with Clerk</button>
      </SignInButton>
    </div>
  );
};

export default SignInPage;
