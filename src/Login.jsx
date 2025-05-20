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
        // Handle Google sign-in redirect
        getRedirectResult(auth)
            .then((result) => {
                if (result?.user) {
                    navigate("/home");
                }
            })
            .catch((err) => {
                console.error("Google redirect failed:", err.code, err.message);
                setError(`Google sign-in failed: ${err.message}`);
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
            console.error("Login error:", err.code, err.message);
            switch (err.code) {
                case "auth/user-not-found":
                    setError("User not found. Please check your email.");
                    break;
                case "auth/wrong-password":
                    setError("Incorrect password. Please try again.");
                    break;
                case "auth/network-request-failed":
                    setError("No internet connection. Please check your network.");
                    break;
                case "auth/too-many-requests":
                    setError("Too many login attempts. Please wait a moment.");
                    break;
                default:
                    setError(err.message || "An unexpected error occurred.");
            }
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
            console.error("Google sign-in error:", err.code, err.message);
            setError(`Google sign-in failed: ${err.message}`);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
                <h2 className="text-3xl font-extrabold mb-8 text-center text-gray-800">
                    Login
                </h2>
                
                {/* Enhanced error display */}
                {error && (
                    <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-md">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-5">
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full p-3 border rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                        autoCapitalize="none"
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
                    
                    {/* Enhanced loading state */}
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

                {/* Enhanced Google button styling */}
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