'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation'
import { authClient } from "@/lib/auth-client"; //import the auth client
import  routes  from "@/lib/routes"; //import the routes

export default function SignIn({ lng, message}: { lng: string, message: string }) {
    const router = useRouter();

    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [emailError, setEmailError] = useState('');


    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setEmailError('Please enter a valid email address.');
            return false;
        } else {
            setEmailError('');
            return true;
        }
    };
    
    const signIn = async (provider: "github" | "apple" | "discord" | "facebook" | "microsoft" | "google" | "spotify" | "twitch" | "twitter" | "dropbox" | "linkedin" | "gitlab" | "reddit") => {
        // Store the referer URL in local storage
        localStorage.setItem('referer', window.location.href);
        await authClient.signIn.social({

            provider: provider,
            /**
             * a url to redirect after the user authenticates with the provider
             * @default "/"
             */
            callbackURL: window.location.href, // dynamic referer does not work with google
            errorCallbackURL: "/error",
            newUserCallbackURL: routes.authSignUpSuccessCallback(),
            //disableRedirect: true,
        });
    }
    const sendVerificationNumber = async () => {
        try {
            if (!validateEmail(email)) return;
            const { data, error } = await authClient.emailOtp.sendVerificationOtp({
                email: email,
                type: "sign-in" // or "email-verification", "forget-password"
            });
            if (error) {
                console.error("Error sending verification number:", error);
                setEmailError('Failed to send verification number.');
            } else {
                setOtpSent(true);
            }
        } catch (error) {
            console.error("Error sending verification number:", error);
            setEmailError('Failed to send verification number.');
        }
    }
    const verifyOtp = async () => {
        try {
            const { data, error } = await authClient.emailOtp.verifyEmail({
                email: email,
                otp: otp
            });
            if (error) {
                console.error("Error verifying OTP:", error);
                alert('Failed to verify OTP.');
            } else {
                alert('OTP verified successfully.');
                // Redirect or perform further actions after successful verification
            }
        } catch (error) {
            console.error("Error verifying OTP:", error);
            alert('Failed to verify OTP.');
        }
    }
    return (
        <div>

            <h1 className="text-md font-bold mb-4">{message}</h1>
                {!otpSent && (
                    <div className="mt-4">
                        <label htmlFor="email" className="block text-gray-700 font-semibold mb-2">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            className="p-2 mb-2 w-64 border border-gray-300 rounded"
                        />
                        {emailError && <p className="text-red-500 text-sm mb-2">{emailError}</p>}

                        <button className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow flex items-center justify-center w-64"
                            onClick={sendVerificationNumber}
                        >
                            Send Verification Number
                        </button>
                    </div>
            )}
            {otpSent && (
                <div>
                <p className="text-gray-600 text-sm mt-2">
                    Verification number sent to {email} <button className="text-blue-500 hover:underline" onClick={() => {setOtpSent(false)}}>Redo</button>
                </p>
                <div className="mt-4">
                    <input
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        placeholder="Enter verification number"
                        className="p-2 mb-2 w-64 border border-gray-300 rounded"
                    />
                    <button className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow flex items-center justify-center w-64"
                        onClick={verifyOtp}
                    >
                        Verify number match
                    </button>
                </div>
                </div>
            )}
            


<hr className="my-8 w-64 border-t border-gray-300" />
<span>OR</span>

<button className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow flex items-center justify-center w-64 mb-4"
                onClick={() => signIn('github')}
            >
                <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.11.82-.26.82-.577v-2.17c-3.338.726-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.083-.73.083-.73 1.205.084 1.84 1.24 1.84 1.24 1.07 1.835 2.807 1.305 3.492.997.108-.775.42-1.305.763-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.467-2.38 1.235-3.22-.123-.303-.535-1.523.117-3.176 0 0 1.008-.322 3.3 1.23.96-.267 1.98-.4 3-.405 1.02.005 2.04.138 3 .405 2.29-1.552 3.297-1.23 3.297-1.23.653 1.653.24 2.873.118 3.176.77.84 1.235 1.91 1.235 3.22 0 4.61-2.803 5.625-5.475 5.92.43.37.823 1.1.823 2.22v3.293c0 .32.22.694.825.577C20.565 21.8 24 17.3 24 12c0-6.63-5.37-12-12-12z"/>
                </svg>
                Sign in with GitHub
            </button>
            <button className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow flex items-center justify-center w-64 mb-4"
                onClick={() => signIn('google')}
            >
                <svg className="w-6 h-6 mr-2" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                    <path fill="#4285F4" d="M24 9.5c3.1 0 5.6 1.1 7.5 2.9l5.6-5.6C33.6 3.5 29.1 1.5 24 1.5 14.8 1.5 7.2 7.8 4.7 16.1l6.9 5.3C13.2 15.1 18.1 9.5 24 9.5z"/>
                    <path fill="#34A853" d="M46.5 24c0-1.5-.1-2.9-.4-4.3H24v8.1h12.7c-.6 3.1-2.4 5.7-5 7.4l6.9 5.3c4-3.7 6.3-9.1 6.3-15.5z"/>
                    <path fill="#FBBC05" d="M11.6 28.4c-.4-1.1-.6-2.3-.6-3.4s.2-2.3.6-3.4l-6.9-5.3C3.6 19.5 3 21.7 3 24s.6 4.5 1.7 6.7l6.9-5.3z"/>
                    <path fill="#EA4335" d="M24 46.5c5.1 0 9.6-1.7 12.8-4.7l-6.9-5.3c-1.9 1.3-4.3 2.1-6.9 2.1-5.4 0-10-3.6-11.6-8.5l-6.9 5.3c3.5 7.1 10.7 11.1 18.6 11.1z"/>
                </svg>
                Sign in with Google
            </button>
            <button className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow flex items-center justify-center w-64"
                onClick={() => signIn('microsoft')}
            >
                <svg className="w-6 h-6 mr-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path fill="#F25022" d="M2 2h10v10H2z"/>
                    <path fill="#7FBA00" d="M12 2h10v10H12z"/>
                    <path fill="#00A4EF" d="M12 12h10v10H12z"/>
                    <path fill="#FFB900" d="M2 12h10v10H2z"/>
                </svg>
                Sign in with Microsoft
            </button>
        </div>
    );
}


 
