import { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useUser } from "../../contexts/UserContext";
import { safeFetch } from "../../utils/api";
import Modal from "../../components/layouts/Modal";
import { formTextInputStyles } from "../../constants/tailwindClasses";

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

interface SignupSuccessResponseJson {
    access_token: string;
    refresh_token: string;
    token_type: string;
    user_id: string;
}

function isSignupSuccessResponseJson(
    data: any
): data is SignupSuccessResponseJson {
    return (
        typeof data === "object" &&
        typeof data.access_token === "string" &&
        typeof data.refresh_token === "string" &&
        typeof data.token_type === "string" &&
        typeof data.user_id === "string"
    );
}

const REACT_APP_API_URL = process.env.REACT_APP_API_URL;

const AuthPage = ({ authorizeUser }: AuthPageProps) => {
    const [isSignup, setIsSignup] = useState(false);
    const [error, setError] = useState("");
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
    }, [isSignup]);

    const errorTextStyles = "text-red-500 text-sm mt-1";
    const inputStyles = `${formTextInputStyles} text-gb-bg border-b-hmt-dark-option4`;

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
                fetchOptions
            );

            if (data && isSignupSuccessResponseJson(data)) {
                console.log("Signup success: ", data);
            }
        } catch (err: any) {
            console.log(err);
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
            } catch (err: any) {
                // setError(err.message || "Signup failed");
                setError("Something went wrong.  Please try again later.");
            }
        } else {
            try {
                await login({ identifier, password });
                authorizeUser();
                setError("");
                setSignupSuccessModalIsOpen(true);
            } catch (err: any) {
                setError(
                    err.code === "unauthorized"
                        ? "Invalid credentials"
                        : `Login failed. ${err.message}` || "Login failed"
                );
            }
        }
    };

    const closeSignupSuccessmModal = () => {
        setSignupSuccessModalIsOpen(false);
        setIsSignup(false);
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gb-bg">
            <div className="bg-gb-yellow p-6 rounded-xl shadow-md w-80">
                <h2 className="text-xl font-semibold mb-4">
                    {isSignup ? "Sign Up" : "Log In"}
                </h2>

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex flex-col gap-2"
                >
                    {isSignup && (
                        <input
                            id="emailInput"
                            className={inputStyles}
                            placeholder="Email"
                            {...register("email", {
                                required: "Email is required",
                                pattern: {
                                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                    message: "Invalid email format",
                                },
                            })}
                        />
                    )}
                    {errors.email && (
                        <p id="emailInputErrorText" className={errorTextStyles}>
                            {errors.email.message}
                        </p>
                    )}

                    <input
                        id="identifierInput"
                        className={inputStyles}
                        placeholder={
                            isSignup ? "Username" : "Email or Username"
                        }
                        {...register("identifier", {
                            required: isSignup
                                ? "Username is required"
                                : "Username or email is required",
                            ...(isSignup && {
                                minLength: {
                                    value: 3,
                                    message:
                                        "Username must be at least 3 characters",
                                },
                            }),
                        })}
                    />
                    {errors.identifier && (
                        <p
                            id="identifierInputErrorText"
                            className={errorTextStyles}
                        >
                            {errors.identifier.message}
                        </p>
                    )}
                    <div className="relative w-full">
                        <input
                            id="passwordInput"
                            className={inputStyles}
                            placeholder="Password"
                            type={showPassword ? "text" : "password"}
                            {...register("password", {
                                required: "Password is required",
                                ...(isSignup && {
                                    minLength: {
                                        value: 6,
                                        message:
                                            "Password must be at least 6 characters",
                                    },
                                }),
                            })}
                        />
                        <button
                            id="showPasswordToggleButton"
                            type="button"
                            onClick={() => setShowPassword((prev) => !prev)}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-gb-blue"
                        >
                            {showPassword ? "Hide" : "Show"}
                        </button>
                    </div>
                    {errors.password && (
                        <p
                            id="passwordInputErrorText"
                            className={errorTextStyles}
                        >
                            {errors.password.message}
                        </p>
                    )}

                    <button type="submit" className="w-full">
                        {isSignup ? "Sign Up" : "Log In"}
                    </button>
                </form>

                {error && (
                    <div className="text-red-600 font-semibold mt-2">
                        {error}
                    </div>
                )}

                <button
                    className="text-mt-bg text-sm mt-2"
                    onClick={toggleForm}
                >
                    {isSignup
                        ? "Already have an account? Log in"
                        : "Don't have an account? Sign up"}
                </button>
            </div>
            {signupSuccessModalIsOpen && (
                <Modal
                    isOpen={signupSuccessModalIsOpen}
                    onClose={closeSignupSuccessmModal}
                    title={`Sign up was successful!`}
                    buttons={[
                        {
                            label: "Ok",
                            onClick: closeSignupSuccessmModal,
                            variant: "secondary",
                        },
                    ]}
                >
                    <div>Please log in to continue.</div>
                </Modal>
            )}
        </div>
    );
};

export default AuthPage;
