import React, { useState, useEffect } from "react";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  getRedirectResult,
  GoogleAuthProvider,
} from "firebase/auth";
import { auth, googleProvider } from "./firebase";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    getRedirectResult(auth)
      .then((result) => {
        if (result?.user) {
          navigate("/home");
        }
      })
      .catch((err) => {
        console.error("Google redirect failed:", err);
        setError("Google sign-in failed. Please try again.");
      });
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/home");
    } catch (err) {
      console.error("Login error:", err);
      setError("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    try {
      const result = await signInWithPopup(auth, googleProvider);
      if (result.user) {
        navigate("/home");
      }
    } catch (err) {
      console.error("Google sign-in error:", err);
      setError("Google sign-in failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-extrabold mb-8 text-center text-gray-800">
          Login
        </h2>
        {error && <p className="text-red-600 text-center">{error}</p>}
        <form onSubmit={handleLogin} className="space-y-5">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-3 border rounded-md"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-3 border rounded-md"
          />
          <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white p-3 rounded-md">
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <button onClick={handleGoogleLogin} className="w-full mt-4 bg-red-500 text-white p-3 rounded-md">
          Login with Google
        </button>

        <p className="text-center mt-6">
          Don't have an account? <Link to="/signup" className="text-blue-600">Sign Up</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
