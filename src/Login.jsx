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
    const [debugInfo, setDebugInfo] = useState([]);
    const navigate = useNavigate();

    // Debug helper function
    const logDebug = (message) => {
        const timestamp = new Date().toISOString();
        const newDebugInfo = [...debugInfo, `[${timestamp}] ${message}`];
        setDebugInfo(newDebugInfo);
        console.log(message);
    };

    useEffect(() => {
        logDebug("Login component mounted");
        
        const checkGoogleRedirect = async () => {
            logDebug("Checking Google redirect result...");
            
            // Verify domain configuration
            const currentDomain = window.location.hostname;
            logDebug(`Current domain: ${currentDomain}`);
            
            try {
                const result = await getRedirectResult(auth);
                logDebug("Google redirect result:", JSON.stringify(result));
                
                if (result?.user) {
                    logDebug("User logged in via Google redirect");
                    navigate("/home");
                }
            } catch (err) {
                logDebug(`Google redirect failed: ${JSON.stringify(err)}`);
                setError(err.message || "Google sign-in failed unexpectedly.");
            }
        };
        
        checkGoogleRedirect();
    }, [navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        logDebug("Starting email/password login attempt");

        try {
            const currentUser = auth.currentUser;
            logDebug("Current Firebase auth state:", 
                     currentUser ? "User already signed in" : "No user signed in");

            await signInWithEmailAndPassword(auth, email, password);
            logDebug("Email/password authentication successful");
            
            const newUser = auth.currentUser;
            logDebug("New Firebase auth state:", 
                     newUser ? JSON.stringify(newUser.providerData[0]) : "No user data");
            
            navigate("/home");
        } catch (err) {
            logDebug(`Email/password login failed: ${JSON.stringify(err)}`);
            setError(err.message || "An unexpected error occurred.");
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setError("");
        logDebug("Starting Google authentication flow");

        try {
            logDebug("Using Google provider:", JSON.stringify(googleProvider));
            
            const result = await signInWithPopup(auth, googleProvider);
            logDebug("Google sign-in successful", 
                     JSON.stringify(result.user.providerData[0]));
            
            navigate("/home");
        } catch (err) {
            logDebug(`Google sign-in failed: ${JSON.stringify(err)}`);
            setError("Google sign-in failed unexpectedly.");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
                <h2 className="text-3xl font-extrabold mb-8 text-center text-gray-800">
                    Login
                </h2>
                
                {error && (
                    <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-md">
                        {error}
                    </div>
                )}

                {/* Debug Information Display */}
                {debugInfo.length > 0 && (
                    <div className="mt-4 mb-6 p-4 bg-gray-50 rounded-lg overflow-auto max-h-[150px] font-mono text-sm">
                        {debugInfo.map((log, index) => (
                            <div key={index}>{log}</div>
                        ))}
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