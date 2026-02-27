import { Navigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';

interface AuthRedirectProps {
    children: React.ReactNode;
}

// Composant pour rediriger les utilisateurs déjà connectés
// depuis les pages login/register vers le dashboard
const AuthRedirect = ({ children }: AuthRedirectProps) => {
    const { isAuthenticated, isLoading } = useUser();

    // Attendre que la vérification soit terminée
    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    // Si déjà connecté, rediriger vers dashboard
    if (isAuthenticated) {
        return <Navigate to="/dashboard" replace />;
    }

    return <>{children}</>;
};

export default AuthRedirect;