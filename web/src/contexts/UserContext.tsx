import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

interface IUser {
    id: number;
    name: string;
    email: string;
    gmail_token?: string;
}

interface IUserContext {
    user: IUser | null;
    token: string | null;
    isAuthenticated: boolean;
    login: (user: IUser, token: string) => void;
    logout: () => void;
    isLoading: boolean;
    gmailConnected: boolean;
    setGmailConnected: (value: boolean) => void;
}

const UserContext = createContext<IUserContext | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<IUser | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [gmailConnected, setGmailConnected] = useState(false);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const storedToken = localStorage.getItem('token');
        const storedGmail = localStorage.getItem('gmail_connected');

        if (storedUser && storedToken) {
            try {
                setUser(JSON.parse(storedUser));
                setToken(storedToken);
            } catch {
                localStorage.removeItem('user');
                localStorage.removeItem('token');
            }
        }

        if (storedGmail === 'true') {
            setGmailConnected(true);
        }

        // Détecte le retour OAuth Google
        const params = new URLSearchParams(window.location.search);
        if (params.get('gmail') === 'connected') {
            setGmailConnected(true);
            localStorage.setItem('gmail_connected', 'true');
            // Nettoie l'URL sans recharger la page
            window.history.replaceState({}, '', window.location.pathname);
        }

        setIsLoading(false);
    }, []);

    const login = (userData: IUser, userToken: string) => {
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', userToken);
        setUser(userData);
        setToken(userToken);
    };

    const logout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        localStorage.removeItem('gmail_connected');
        setUser(null);
        setToken(null);
        setGmailConnected(false);
        window.location.href = '/login';
    };

    const isAuthenticated = !!(user && token);

    return (
        <UserContext.Provider value={{
            user,
            token,
            isAuthenticated,
            login,
            logout,
            isLoading,
            gmailConnected,
            setGmailConnected,
        }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) throw new Error('useUser doit être utilisé dans un UserProvider');
    return context;
};