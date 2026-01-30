import { router } from 'expo-router';
import React, { createContext, useContext, useEffect, useState } from 'react';

type User = {
    name: string;
    email: string;
    avatar?: string;
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
    isLoading: false,
    login: async () => { },
    signup: async () => { },
    logout: () => { },
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // Simulate persistent login check
    useEffect(() => {
        // Can add logic here to restore user from AsyncStorage
    }, []);

    const login = async (email: string, password: string) => {
        setIsLoading(true);
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));

        // Simulate successful login
        const namePart = email.split('@')[0];
        const formattedName = namePart.charAt(0).toUpperCase() + namePart.slice(1);

        // Generate a deterministic avatar color based on name length
        const colors = ['0D8ABC', '1ABC9C', 'E74C3C', '9B59B6', 'F1C40F'];
        const color = colors[formattedName.length % colors.length];

        setUser({
            name: formattedName,
            email: email,
            avatar: `https://ui-avatars.com/api/?name=${formattedName}&background=${color}&color=fff&size=256`,
        });

        setIsLoading(false);
        router.replace('/(tabs)');
    };

    const signup = async (name: string, email: string, password: string) => {
        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 800));

        const colors = ['0D8ABC', '1ABC9C', 'E74C3C', '9B59B6', 'F1C40F'];
        const color = colors[name.length % colors.length];

        setUser({
            name: name,
            email: email,
            avatar: `https://ui-avatars.com/api/?name=${name.replace(/ /g, '+')}&background=${color}&color=fff&size=256`,
        });

        setIsLoading(false);
        router.replace('/(tabs)');
    };

    const logout = () => {
        setUser(null);
        router.replace('/(auth)/login');
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, login, signup, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
