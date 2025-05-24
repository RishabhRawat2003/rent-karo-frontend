"use client";

import React from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { TOKEN } from "@/utils/enum";

const backend = process.env.NEXT_PUBLIC_BACKEND_URL as string;
const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string;

interface AuthenticationProps {
    role: string;
}

export const GoogleSignUp: React.FC<AuthenticationProps> = ({ role }) => {
    const router = useRouter();

    const handleLoginSuccess = async (response: any) => {
        const idToken = response.credential;
        try {
            const res = await axios.post(`${backend}/user/google-auth`, { idToken, role });
            if(res.status === 200) {
                localStorage.setItem(TOKEN, JSON.stringify(res.data.token));
                router.push("/");
                toast.success("User Created Successfully");
            }
        } catch (error) {
            console.error("Error sending ID token to backend:", error);
        }
    };

    return (
        <>
            <div className="w-full h-auto flex items-center justify-center mt-7">
                <div className="w-[90%] md:w-[45%]">
                    <GoogleOAuthProvider clientId={googleClientId}>
                        <div className="w-full h-10 bg-gray-300">
                            <GoogleLogin
                                onSuccess={handleLoginSuccess}
                                text="continue_with"
                            />
                        </div>
                    </GoogleOAuthProvider>
                </div>
            </div>
        </>
    );
};

export const GoogleSignIn: React.FC = () => {
    const router = useRouter();

    const handleLoginSuccess = async (response: any) => {
        const idToken = response.credential;
        try {
            const res = await axios.post(`${backend}/user/google-auth-sigin`, { idToken });
            if(res.status === 200) {
                localStorage.setItem(TOKEN, JSON.stringify(res.data.token));
                router.push("/");
                toast.success("User Logged in Successfully");
            }
        } catch (error: any) {
            console.error("Error sending ID token to backend:", error);
            toast.error(error.response.data.message);
            router.push("/pages/signup");
        }
    };

    return (
        <>
            <div className="w-full h-auto flex items-center justify-center mt-7">
                <div className="w-[80%]">
                    <GoogleOAuthProvider clientId={googleClientId}>
                        <div className="w-full h-10 bg-gray-300">
                            <GoogleLogin
                                onSuccess={handleLoginSuccess}
                                text="signin_with"
                            />
                        </div>
                    </GoogleOAuthProvider>
                </div>
            </div>
        </>
    );
};