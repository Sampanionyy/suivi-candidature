import { useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { toast } from "sonner";

import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { registerUser } from "../../services/auth-service";
import FormRegister from "../../components/auth/FormRegister";

type RegisterValues = {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    acceptTerms: boolean;
};

const validationSchema = yup.object({
    name: yup.string().min(2, "Le nom doit contenir au moins 2 caractères").required("Le nom est requis"),
    email: yup.string().email("Email invalide").required("L'email est requis"),
    password: yup.string().min(8, "Le mot de passe doit contenir au moins 8 caractères").required("Le mot de passe est requis"),
    password_confirmation: yup.string()
        .oneOf([yup.ref('password')], "Les mots de passe ne correspondent pas")
        .required("Veuillez confirmer le mot de passe"),
    acceptTerms: yup.boolean().oneOf([true], "Vous devez accepter les conditions"),
});

export default function RegisterPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const formik = useFormik<RegisterValues>({
        initialValues: {
            name: "",
            email: "",
            password: "",
            password_confirmation: "",
            acceptTerms: false,
        },
        validationSchema,
        onSubmit: async (values, { setErrors, resetForm }) => {
            setLoading(true);

            const result = await registerUser(values);

            if (result.success) {
                toast.success(result.message || "Inscription réussie ! Vous pouvez maintenant vous connecter.");
                resetForm();
            } else {
                if (result.fieldErrors) {
                    setErrors(result.fieldErrors);
                } else {
                    toast.error(result.message || 'Une erreur est survenue lors de l\'inscription');
                }
            }

            setLoading(false);
        }
    });

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-fuchsia-50 px-4 mt-4">
            <div className="w-full max-w-3xl">
                <div className="items-center">
                    <Card className="rounded-2xl">
                        <CardHeader>
                            <CardTitle className="text-2xl">Créer un compte</CardTitle>
                            <p className="text-sm text-slate-500 mt-1">Commencez en quelques secondes — c'est rapide et sécurisé.</p>
                        </CardHeader>
                        <CardContent>
                            <FormRegister 
                                formik={formik}
                                showPassword={showPassword}
                                setShowPassword={setShowPassword} 
                                loading={loading}
                            />
                        </CardContent>
                    </Card>
                </div>

                <div className="mt-6 text-center text-xs text-slate-400">Sécurité — Vos données sont transmis·es via HTTPS et stockées de manière sécurisée conformement aux bonnes pratiques.</div>
            </div>
        </div>
    );
}
