"use client";
import React from "react";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { cn } from "../utils/utils";
// import {
//   IconBrandGithub,
//   IconBrandGoogle,
//   IconBrandOnlyfans,
// } from "@tabler/icons-react";
import useSignUp from "../hooks/useSignUp";
import { Form, Formik, FormikHelpers } from "formik";
import TitlePage from "../components/TitlePage";
// import * as Yup from "yup";

// const validationSchema = Yup.object().shape({
//   firstName: Yup.string().required("First name is required"),
//   lastName: Yup.string().required("Last name is required"),
//   userName: Yup.string().required("Username is required"),
//   age: Yup.string().required("Age is required"),
//   password: Yup.string()
//     .min(6, "Password must be at least 6 characters")
//     .required("Password is required"),
//   confirmpassword: Yup.string()
//     .oneOf([Yup.ref("password")], "Passwords must match")
//     .required("Confirm password is required"),
// });

function SignUp() {
  const { mutate: userSignUp } = useSignUp();

  const sleep = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));
  const handleSubmit = async (
    values: {
      firstName: string;
      lastName: string;
      userName: string;
      age: string;
      password: string;
      confirmpassword: string;
    },
    {
      setSubmitting,
      resetForm,
    }: FormikHelpers<{
      firstName: string;
      lastName: string;
      userName: string;
      age: string;
      password: string;
      confirmpassword: string;
    }>
  ) => {
    try {
      setSubmitting(true);

      console.log("Form is submitting...");

      await sleep(1500);

      await userSignUp(values);

      console.log("Form submitted successfully!");

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
      <TitlePage title="Registration" />
      <div className="flex justify-center items-center p-5">
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
              firstName: "",
              lastName: "",
              userName: "",
              age: "",
              password: "",
              confirmpassword: "",
            }}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="my-2">
                <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
                  <LabelInputContainer>
                    <Label htmlFor="firstname">First name</Label>
                    <Input
                      id="firstName"
                      placeholder="Tyler"
                      type="text"
                      name="firstName"
                    />
                  </LabelInputContainer>
                  <LabelInputContainer>
                    <Label htmlFor="lastname">Last name</Label>
                    <Input
                      id="lastName"
                      placeholder="Durden"
                      type="text"
                      name="lastName"
                    />
                  </LabelInputContainer>
                </div>
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
                  <Label htmlFor="age">Age</Label>
                  <Input id="age" placeholder="00" type="text" name="age" />
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
                <LabelInputContainer className="mb-8">
                  <Label htmlFor="confirmpassword">Confirm your password</Label>
                  <Input
                    id="confirmpassword"
                    placeholder="••••••••"
                    type="password"
                    name="confirmpassword"
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
                      Sign up →
                      <BottomGradient />
                    </>
                  )}
                </button>
                <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />
              </Form>
            )}
          </Formik>
        </div>
      </div>
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

export default SignUp;
