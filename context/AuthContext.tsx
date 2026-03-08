import { router } from 'expo-router';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';

type User = {
    uid: string;
    name: string;
    email: string;
    avatar?: string;
    role?: string;
};

type AuthContextType = {
    user: User | null;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    signup: (name: string, email: string, password: string) => Promise<void>;
    logout: () => void;
};

const AuthContext = createContext<AuthContextType>({
    user: null,
    isLoading: true,
    login: async () => { },
    signup: async () => { },
    logout: () => { },
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                try {
                    // Fetch user details from Firestore
                    const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
                    if (userDoc.exists()) {
                        const userData = userDoc.data();
                        setUser({
                            uid: firebaseUser.uid,
                            name: userData.name || firebaseUser.email?.split('@')[0],
                            email: firebaseUser.email || '',
                            avatar: userData.avatar,
                            role: userData.role || 'user'
                        });
                    } else {
                        // Fallback if no specific doc found
                        setUser({
                            uid: firebaseUser.uid,
                            name: firebaseUser.email?.split('@')[0] || 'User',
                            email: firebaseUser.email || '',
                            role: 'user'
                        });
                    }
                } catch (error) {
                    console.error("Error fetching user data:", error);
                }
            } else {
                setUser(null);
            }
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const login = async (email: string, password: string) => {
        setIsLoading(true);
        try {
            await signInWithEmailAndPassword(auth, email, password);
            
            // Per requirement: admin@uniform.com is the admin
            if (email.toLowerCase() === 'admin@uniform.com') {
                router.replace('/admin');
            } else {
                router.replace('/(tabs)');
            }
        } catch (error) {
            console.error("Login Error:", error);
            setIsLoading(false);
            throw error;
        }
    };

    const signup = async (name: string, email: string, password: string) => {
        setIsLoading(true);
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const firebaseUser = userCredential.user;

            const colors = ['0D8ABC', '1ABC9C', 'E74C3C', '9B59B6', 'F1C40F'];
            const color = colors[name.length % colors.length];
            const avatarUrl = `https://ui-avatars.com/api/?name=${name.replace(/ /g, '+')}&background=${color}&color=fff&size=256`;

            // Save additional user info to Firestore
            await setDoc(doc(db, 'users', firebaseUser.uid), {
                uid: firebaseUser.uid,
                name: name,
                email: email,
                avatar: avatarUrl,
                role: 'user', // Default role for app signups
                createdAt: new Date()
            });

            setUser({
                uid: firebaseUser.uid,
                name: name,
                email: email,
                avatar: avatarUrl,
                role: 'user'
            });

            router.replace('/(tabs)');
        } catch (error) {
            console.error("Signup Error:", error);
            setIsLoading(false);
            throw error;
        }
    };

    const logout = async () => {
        try {
            await signOut(auth);
            setUser(null);
            router.replace('/(auth)/login');
        } catch (error) {
            console.error("Logout Error:", error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, login, signup, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
