// import { useState } from "react";
// import { useAuth } from "./Auth";
import TitlePage from "../components/TitlePage";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { cn } from "../utils/utils";
// import Input from "./Input";
import Background from "../components/Background";
import { Form, Formik, FormikHelpers } from "formik";
import useLogin from "../hooks/useLogin";
import { Link } from "react-router-dom";

function Login() {
  // const [user, setUser] = useState("");

  // const auth = useAuth();

  // const navigate = useNavigate();

  // const handleLogin = () => {
  //   auth.login(user);
  //   navigate("/app/home");
  // };

  const { mutate: userLogin } = useLogin();

  const sleep = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const handleSubmit = async (
    values: {
      userName: string;
      password: string;
    },
    {
      setSubmitting,
      resetForm,
    }: FormikHelpers<{
      userName: string;
      password: string;
    }>
  ) => {
    try {
      setSubmitting(true);

      console.log("Form is submitting...");

      await sleep(1000);

      await userLogin(values);

      console.log("Form submitted successfully!");

      console.log("name", values.userName);

      resetForm();
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setSubmitting(false);

      console.log("Form submission process completed."); // Log a message when the entire process is completed
    }
  };
  return (
    <>
      <TitlePage title="Login Page" />
      <Background url="blue-bg.jpg">
        {/* <div className="flex justify-center items-center min-h-screen">
          <div className=" bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-20 border border-gray-100 rounded-lg h-96 overflow-hidden">
            <div className="flex justify-center items-center  text-white text-2xl font-bold p-2">
              Login Page
            </div>
            <div className="p-10  h-full flex flex-col justify-between ">
              <div>
                <h1 className="text-white text-xl font-bold">Username</h1>
              </div>
              <div className="mb-10 flex justify-between">
                <Button color="red">
                  Log in
                </Button>

                <Link to="signup">Sign Up</Link>
              </div>
            </div>
          </div>
        </div> */}
        <div className="flex justify-center items-center p-5 min-h-screen">
          <div className="max-w-md w-full mx-auto rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black">
            <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
              Welcome to Aceternity
            </h2>
            <p className="text-neutral-600 text-sm max-w-sm mt-2 dark:text-neutral-300">
              Login to aceternity if you can because we don&apos;t have a login
              flow yet
            </p>

            <Formik
              initialValues={{
                userName: "",
                password: "",
              }}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting }) => (
                <Form className="my-2">
                  <LabelInputContainer className="mb-4">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="userName"
                      placeholder=""
                      type="text"
                      name="userName"
                    />
                  </LabelInputContainer>
                  <LabelInputContainer className="mb-4">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      placeholder="••••••••"
                      type="password"
                      name="password"
                    />
                  </LabelInputContainer>

                  <button
                    className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
                    type="submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="border-gray-400 h-6 w-6 animate-spin rounded-full border-4 border-t-white"></div>
                      </div>
                    ) : (
                      <>
                        Login →
                        <BottomGradient />
                      </>
                    )}
                  </button>
                  <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />
                </Form>
              )}
            </Formik>
            <Link 
              to="/signup"
              className="text-sm hover:underline hover:text-blue-600 mt-2 inline-block"
            >
              {"Don't"} have an account? Sign up here
            </Link>
          </div>
        </div>
      </Background>
    </>
  );
}

const BottomGradient = () => {
  return (
    <>
      <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
      <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
    </>
  );
};

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
    </div>
  );
};

export default Login;
