import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import SHA256 from "crypto-js/sha256";
import { Button } from "../../components/ui/Button";
import { useUser } from "../../contexts/UserContext";

interface AuthPageProps {
  onLogin: () => void;
}

interface SignupPayload {
  id: string;
  username: string;
  email: string;
  password_hash: string;
  password_salt: string;
  active: boolean;
  roles: string;
}

const SALT = "pjZKk6A8YtC8$9p&UIp62bv4PLwD7@dF";

const AuthPage = ({ onLogin }: AuthPageProps) => {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { login } = useUser();

  const handleAuth = async () => {
    if (!isSignup) {
      try {
        setError("");
        await login({ username: username, password });
        onLogin();
      } catch (err: any) {
        setError(err.message);
      }
    } else {
      try {
        setError("");
        const password_hash = SHA256(password + SALT).toString();
        const payload: SignupPayload = {
          id: uuidv4(),
          username,
          email,
          password_hash,
          password_salt: SALT,
          active: true,
          roles: "user",
        };

        const response = await fetch("http://127.0.0.1:8080/v1/users", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // no Authorization header here because signup is public
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Signup failed: ${errorText}`);
        }

        const newUser = await response.json();
        console.log("Signup successful:", newUser);

        // auto-login (might change later):
        await login({ username, password });
        onLogin();
      } catch (err: any) {
        setError(err.message || "Signup failed");
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-xl shadow-md w-80">
        <h2 className="text-xl font-semibold mb-4">
          {isSignup ? "Sign Up" : "Log In"}
        </h2>

        {isSignup && (
          <input
            className="w-full mb-2 p-2 border rounded"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        )}

        <input
          className="w-full mb-2 p-2 border rounded"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          className="w-full mb-4 p-2 border rounded"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

        <Button className="w-full mb-2" onClick={handleAuth}>
          {isSignup ? "Sign Up" : "Log In"}
        </Button>

        <button
          className="text-blue-600 text-sm"
          onClick={() => setIsSignup(!isSignup)}
        >
          {isSignup
            ? "Already have an account? Log in"
            : "Don't have an account? Sign up"}
        </button>
      </div>
    </div>
  );
};

export default AuthPage;
