import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-light text-gray-900 dark:text-white mb-2">
            Welcome Back
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Sign in to your account to continue shopping
          </p>
        </div>

        <SignIn
          appearance={{
            elements: {
              rootBox: "w-full mx-auto",
              card: "shadow-xl bg-white dark:bg-gray-800",
              headerTitle: "text-gray-900 dark:text-white",
              headerSubtitle: "text-gray-600 dark:text-gray-400",
              socialButtonsBlockButton:
                "border-gray-300 dark:border-gray-600 min-h-9",
              formButtonPrimary:
                "bg-black hover:bg-gray-800 dark:bg-white dark:text-black min-h-9",
              footerActionLink:
                "text-black hover:text-gray-800 dark:text-white",
              formFieldInput:
                "min-h-10 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-black dark:focus:border-white transition",
              footer: "bg-white",
            },
            // variables: {
            //   colorPrimary: "#000000",
            //   colorText: "#1f2937",
            //   colorBackground: "#ffffff",
            //   colorInputBackground: "#ffffff",
            //   colorInputText: "#111827",
            //   colorBorder: "#000",
            //   colorTextOnPrimaryBackground: "#ffffff",
            // },
          }}
          routing="path"
          path="/sign-in"
          signUpUrl="/sign-up"
        />
      </div>
    </div>
  );
}
