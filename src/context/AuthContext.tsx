import React, { createContext, useContext, useState, ReactNode } from "react";

interface AuthContextType {
    is2FAEnabled: boolean;
    set2FAEnabled: (enabled: boolean) => void;
    is2FAVerified: boolean;
    verify2FA: (code: string) => boolean;
    isAuthenticated: boolean;
    login: () => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [is2FAEnabled, set2FAEnabled] = useState(false);
    const [is2FAVerified, setIs2FAVerified] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(true);

    const login = () => setIsAuthenticated(true);
    const logout = () => {
        setIsAuthenticated(false);
        setIs2FAVerified(false);
    };

    const verify2FA = (code: string) => {
        // Demo verification logic
        if (code === "123456") {
            setIs2FAVerified(true);
            return true;
        }
        return false;
    };

    return (
        <AuthContext.Provider value={{
            is2FAEnabled,
            set2FAEnabled,
            is2FAVerified,
            verify2FA,
            isAuthenticated,
            login,
            logout
        }}>
            {children}
        </AuthContext.Provider>
    );
};
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
