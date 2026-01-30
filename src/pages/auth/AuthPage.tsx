import { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useUser } from "../../contexts/UserContext";
import { safeFetch, HttpError } from "../../utils/api";
import Modal from "../../components/layouts/Modal";
import { formTextInputStyles } from "../../constants/tailwindClasses";
import Button from "../../components/ui/Button/Button";

interface AuthPageProps {
  authorizeUser: () => void;
}

interface FormInputs {
  identifier: string; // Email or username for login; Username for signup
  email?: string; // Required for signup only
  password: string;
}

interface SignupPayload {
  email: string;
  username: string;
  password: string;
}

const REACT_APP_API_URL = process.env.REACT_APP_API_URL;

const AuthPage: React.FC<AuthPageProps> = ({
  authorizeUser,
}: AuthPageProps) => {
  const [isSignup, setIsSignup] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [signupSuccessModalIsOpen, setSignupSuccessModalIsOpen] =
    useState(false);
  const { login } = useUser();

  const toggleForm = () => {
    setIsSignup(!isSignup);
    setError("");
  };

  const {
    register,
    handleSubmit,
    clearErrors,
    formState: { errors },
  } = useForm<FormInputs>({
    mode: "onSubmit", // only validate on submit
    reValidateMode: "onChange",
  });

  useEffect(() => {
    clearErrors();
  }, [isSignup, clearErrors]);

  const signup = async ({ username, password, email }: SignupPayload) => {
    const payload: SignupPayload = {
      username,
      email,
      password,
    };
    const endpoint = "/v1/users";
    const fetchOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    };
    try {
      const { response, data } = await safeFetch(
        `${REACT_APP_API_URL}${endpoint}`,
        fetchOptions,
      );

      if (response && response.status === 201) {
        setIsSignup(false);
      }
    } catch (err: any) {
      console.error(err);
      throw err;
    }
  };

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    setError("");
    const { identifier, email = "", password } = data;

    if (isSignup) {
      try {
        await signup({
          username: identifier,
          email,
          password,
        });
        setSignupSuccessModalIsOpen(true);
      } catch (err: any) {
        // setError(err.message || "Signup failed");
        if (err.status && err.status === 409) {
          if (err instanceof HttpError) {
            console.error("Status:", err.status);
            console.error("Body:", err.body);
            if (err.body.errors[0].code === "username_already_exists") {
              setError(
                "A user with that username already exists.  Please try a different username.",
              );
            } else if (err.body.errors[0].code === "email_already_exists") {
              setError(
                "A user with that email already exists.  Please try a different email.",
              );
            }
          }
        } else {
          setError("Something went wrong.  Please try again later.");
        }
      }
    } else {
      try {
        await login({ identifier, password });
        authorizeUser();
        setError("");
      } catch (err: any) {
        setError(
          err.code === "unauthorized"
            ? "Invalid credentials"
            : `Login failed. ${err.message}` || "Login failed",
        );
      }
    }
  };

  const closeSignupSuccessmModal = () => {
    setSignupSuccessModalIsOpen(false);
    setIsSignup(false);
  };

  const labelStyles = "font-bold";
  const errorTextStyles = "text-mt-red text-sm mt-1 font-bold";
  const inputStyles = `font-bold border-2 border-hmt-dark-option4 rounded-lg px-2 py-2 text-gray-500 bg-white w-full`;

  return (
    <div
      className="h-screen w-screen min-w-[320px] flex flex-col items-center justify-center bg-gray-100 text-hmt-dark-option4"
      style={{ color: "#382b22" }}
    >
      <div
        className="flex flex-col gap-7 rounded-xl p-5 bg-gray-2 w-[310px]"
        style={{ borderWidth: "2px", borderColor: "#6b6b6b" }}
      >
        {/* Form Title */}
        <h2 className="text-xl font-semibold">
          {isSignup ? "Sign Up" : "Log In"}
        </h2>

        {/* Form (Inputs + Submit Button) */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
          {/* Inputs */}
          <div className="flex flex-col gap-2">
            {/* Email Input - only for Signup */}
            {isSignup && (
              <div className="flex flex-col">
                <label className={labelStyles} htmlFor="emailInput">
                  Email
                </label>
                <input
                  id="emailInput"
                  className={inputStyles}
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Invalid email format",
                    },
                  })}
                />
                {errors.email && (
                  <p id="emailInputErrorText" className={errorTextStyles}>
                    {errors.email.message}
                  </p>
                )}
              </div>
            )}

            {/* Identifier Input  (Username for Signup.  Email/Username for Login.) */}
            <div className="flex flex-col">
              <label className={labelStyles} htmlFor="identifierInput">
                {isSignup ? "Username" : "Email or Username"}
              </label>
              <input
                className={inputStyles}
                id="identifierInput"
                {...register("identifier", {
                  required: isSignup
                    ? "Username is required"
                    : "Username or email is required",
                  ...(isSignup && {
                    minLength: {
                      value: 3,
                      message: "Username must be at least 3 characters",
                    },
                  }),
                })}
              />
              {/* Identifier Error */}
              {errors.identifier && (
                <p id="identifierInputErrorText" className={errorTextStyles}>
                  {errors.identifier.message}
                </p>
              )}
            </div>

            {/* Password Input */}
            <div className="flex flex-col">
              <div className="flex gap-2 items-end">
                <div className="flex-1">
                  <label className={labelStyles} htmlFor="passwordInput">
                    Password
                  </label>
                  <div className="flex items-start gap-2">
                    <input
                      id="passwordInput"
                      className={inputStyles}
                      type={showPassword ? "text" : "password"}
                      {...register("password", {
                        required: "Password is required",
                        ...(isSignup && {
                          minLength: {
                            value: 6,
                            message: "Password must be at least 6 characters",
                          },
                        }),
                      })}
                    />
                  </div>
                </div>
                {/* Show Password Button */}
                <div>
                  <Button
                    text={showPassword ? "Hide" : "Show"}
                    buttonType="compact"
                    onClick={() => setShowPassword((prev) => !prev)}
                  ></Button>
                </div>
              </div>
              {/* Password Error */}
              {errors.password && (
                <div id="passwordInputErrorText" className={errorTextStyles}>
                  {errors.password.message}
                </div>
              )}
            </div>
          </div>
          {/* Submit Button */}
          <Button
            text={isSignup ? "Sign Up" : "Log In"}
            type="submit"
            buttonType="standard"
          />
        </form>
        {/* -- End Form -- */}

        {/* Signup / Login Error */}
        {error && (
          <div className="w-full text-center">
            <div className={errorTextStyles}>{error}</div>
          </div>
        )}

        {/* Form Toggle */}
        <div className="grid grid-cols-[1fr_1fr] items-center gap-2">
          <div className="text-sm text-center font-bold text-gray-400">
            {isSignup ? "Already have an account?" : "Don't have an account?"}
          </div>
          <Button
            onClick={toggleForm}
            text={isSignup ? "Log in" : "Sign up"}
            buttonType="compact"
          ></Button>
        </div>
      </div>

      {/* Signup Success Modal */}
      {signupSuccessModalIsOpen && (
        <Modal
          isOpen={signupSuccessModalIsOpen}
          onClose={closeSignupSuccessmModal}
          title={`Sign up was successful!`}
          buttons={[
            {
              label: "Ok",
              onClick: closeSignupSuccessmModal,
              buttonType: "compact",
            },
          ]}
        >
          <div className="text-center text-sm font-semibold">
            Please log in to continue.
          </div>
        </Modal>
      )}
    </div>
  );
};

export default AuthPage;
