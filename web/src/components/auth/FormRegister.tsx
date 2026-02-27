import React from 'react'
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Button } from "../../components/ui/button";
import { Checkbox } from "../../components/ui/checkbox";

import { Mail, User, Lock, Eye, EyeOff } from "lucide-react";

type Props = {
    formik: any,
    showPassword: boolean,
    setShowPassword: React.Dispatch<React.SetStateAction<boolean>>,
    loading: boolean
}

const FormRegister: React.FC<Props> = ({ formik, showPassword, setShowPassword, loading }) => {
    return (
        <form onSubmit={formik.handleSubmit} className="space-y-4">
            <div>
                <Label htmlFor="name" className="flex items-center gap-2">
                    <User className="w-4 h-4 text-fuchsia-500 mb-1" /> Nom
                </Label>
                <Input
                    id="name"
                    name="name"
                    placeholder="Votre nom"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    aria-invalid={!!(formik.touched.name && formik.errors.name)}
                />
                {formik.touched.name && formik.errors.name && (
                    <p className="text-xs text-red-600 mt-1">{formik.errors.name}</p>
                )}
            </div>

            <div>
                <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-fuchsia-500 mb-1" /> Email
                </Label>
                <Input
                    id="email"
                    name="email"
                    placeholder="you@example.com"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    aria-invalid={!!(formik.touched.email && formik.errors.email)}
                />
                {formik.touched.email && formik.errors.email && (
                    <p className="text-xs text-red-600 mt-1">{formik.errors.email}</p>
                )}
            </div>

            <div>
                <Label htmlFor="password" className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-fuchsia-500 mb-1" /> Mot de passe
                </Label>
                <div className="relative">
                    <Input
                        id="password"
                        name="password"
                        placeholder="••••••••"
                        type={showPassword ? 'text' : 'password'}
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        aria-invalid={!!(formik.touched.password && formik.errors.password)}
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded focus:outline-none"
                        aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                    >
                        {showPassword ? <EyeOff className="w-4 h-4 text-fuchsia-500" /> : <Eye className="w-4 h-4 text-fuchsia-500" />}
                    </button>
                </div>
                {formik.touched.password && formik.errors.password && (
                    <p className="text-xs text-red-600 mt-1">{formik.errors.password}</p>
                )}
            </div>

            <div>
                <Label htmlFor="password_confirmation" className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-fuchsia-500 mb-1" /> Confirmer le mot de passe
                </Label>
                <Input
                    id="password_confirmation"
                    name="password_confirmation"
                    placeholder="••••••••"
                    type={showPassword ? 'text' : 'password'}
                    value={formik.values.password_confirmation}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    aria-invalid={!!(formik.touched.password_confirmation && formik.errors.password_confirmation)}
                />
                {formik.touched.password_confirmation && formik.errors.password_confirmation && (
                    <p className="text-xs text-red-600 mt-1">{formik.errors.password_confirmation}</p>
                )}
            </div>

            <div className="flex items-center gap-3">
                <Checkbox
                    id="acceptTerms"
                    name="acceptTerms"
                    checked={formik.values.acceptTerms}
                    onCheckedChange={(val: any) => formik.setFieldValue('acceptTerms', !!val)}
                />
                <Label htmlFor="acceptTerms" className="text-sm">J'accepte les <a className="text-fuchsia-600 underline" href="#">conditions</a></Label>
            </div>
            {formik.touched.acceptTerms && formik.errors.acceptTerms && (
                <p className="text-xs text-red-600 mt-1">{formik.errors.acceptTerms}</p>
            )}

            <div className="pt-2">
                <Button type="submit" disabled={loading} className="w-full bg-fuchsia-300 hover:bg-fuchsia-400 text-white">
                    {loading ? 'Création...' : 'Créer mon compte'}
                </Button>
            </div>

            <div className="text-center text-sm text-slate-500">
                Déjà un compte ? <a className="text-fuchsia-600 underline" href="/login">Connectez-vous</a>
            </div>
        </form>
    )
}

export default FormRegister