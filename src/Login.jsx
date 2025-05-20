import React, { useState, useEffect } from "react";
import {
    signInWithEmailAndPassword,
    signInWithPopup,
    signInWithRedirect,
    getRedirectResult,
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
        const checkGoogleRedirect = async () => {
            try {
                const result = await getRedirectResult(auth);
                if (result?.user) {
                    navigate("/home");
                }
            } catch (err) {
                setError("Google sign-in failed. Please try again.");
            }
        };

        checkGoogleRedirect();
    }, [navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate("/home");
        } catch (err) {
            setError("Login failed. Please check your credentials.");
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setError("");

        try {
            if (window.innerWidth <= 768) {
                await signInWithRedirect(auth, googleProvider);
            } else {
                const result = await signInWithPopup(auth, googleProvider);
                navigate("/home");
            }
        } catch (err) {
            setError("Google sign-in failed. Try again or use email/password.");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
                <h2 className="text-3xl font-extrabold mb-8 text-center text-gray-800">Login</h2>

                {error && (
                    <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-md">{error}</div>
                )}

                <form onSubmit={handleLogin} className="space-y-5">
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full p-3 border rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                        autoComplete="email"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full p-3 border rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                        autoComplete="current-password"
                    />
                    
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full bg-blue-600 text-white p-3 rounded-md transition-opacity duration-200 ${
                            loading ? 'opacity-80 cursor-wait' : 'hover:bg-blue-700'
                        }`}
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>

                <button
                    onClick={handleGoogleLogin}
                    className="w-full mt-4 bg-red-500 text-white p-3 rounded-md hover:bg-red-600 transition-colors duration-200"
                >
                    Login with Google
                </button>

                <p className="text-center mt-6">
                    Don't have an account? <Link to="/signup" className="text-blue-600 hover:text-blue-800">Sign Up</Link>
                </p>
            </div>
        </div>
    );
}

export default Login;
