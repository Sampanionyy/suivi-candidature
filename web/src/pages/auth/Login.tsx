import { useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { toast } from "sonner";

import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { loginUser } from "../../services/auth-service";
import FormLogin from "../../components/auth/FormLogin";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../contexts/UserContext";

type LoginValues = {
    email: string;
    password: string;
    rememberMe: boolean;
};

const validationSchema = yup.object({
    email: yup.string().email("Email invalide").required("L'email est requis"),
    password: yup.string().required("Le mot de passe est requis"),
    rememberMe: yup.boolean(),
});

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
        const { login } = useUser(); 

    const navigate = useNavigate();

    const formik = useFormik<LoginValues>({
        initialValues: {
            email: "",
            password: "",
            rememberMe: false,
        },
        validationSchema,
        onSubmit: async (values, { setErrors }) => {
            setLoading(true);

            const result = await loginUser(values);

            if (result.success) {
                toast.success(result.message || "Connexion réussie !");
                
                login(result.data.user, result.data.token);

                navigate("/dashboard");
            } else {
                if (result.fieldErrors) {
                    setErrors(result.fieldErrors);
                } else {
                    toast.error(result.message || "Une erreur est survenue lors de la connexion");
                }
            }

            setLoading(false);
        },
    });

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-fuchsia-50 px-4 mt-4">
            <div className="w-full max-w-3xl">
                <div className="items-center">
                    <Card className="rounded-2xl">
                        <CardHeader>
                            <CardTitle className="text-2xl">Se connecter</CardTitle>
                            <p className="text-sm text-slate-500 mt-1">
                                Accédez à votre compte en toute sécurité.
                            </p>
                        </CardHeader>
                        <CardContent>
                            <FormLogin
                                formik={formik}
                                showPassword={showPassword}
                                setShowPassword={setShowPassword}
                                loading={loading}
                            />
                        </CardContent>
                    </Card>
                </div>

                <div className="mt-6 text-center text-xs text-slate-400">
                    Sécurité — Vos données sont transmises via HTTPS et stockées de manière sécurisée conformément aux bonnes pratiques.
                </div>
            </div>
        </div>
    );
}
