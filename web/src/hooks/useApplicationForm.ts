import { useFormik } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import type { IApplication, IApplicationForm } from "../interfaces/types";
import { addApplication, updateApplication } from "../services/application-service";
import { toast } from "sonner";

const today = new Date();
today.setHours(0, 0, 0, 0);

const applicationSchema = Yup.object({
    position: Yup.string().required("Le poste est requis"),
    company: Yup.string().required("L'entreprise est requise"),
    applied_date: Yup.date()
        .required("La date est requise")
        .min(today, "La date doit être aujourd'hui ou ultérieure"),
    status: Yup.string().required("Le statut est requis"),
    interview_date: Yup.date()
        .min(today, "La date doit être aujourd'hui ou ultérieure")
        .nullable()
        .when("status", {
            is: "interview",
            then: (schema) =>
                schema.required("La date de l'entretien est requise"),
            otherwise: (schema) => schema.notRequired(),
        }),
});

export const useApplicationForm = (
    setApplications: React.Dispatch<React.SetStateAction<IApplication[]>>,
    setIsAddingNew: React.Dispatch<React.SetStateAction<boolean>>,
    setEditingId: React.Dispatch<React.SetStateAction<number | null>>,
    applications: IApplication[],
    userId: number | null,
    initialApplication?: IApplication 
) => {
    const [loading, setLoading] = useState(false);

    const formik = useFormik<Partial<IApplicationForm>>({
        initialValues: {
            id: initialApplication?.id,
            user_id: initialApplication?.user_id ?? userId,
            position: initialApplication?.position ?? "",
            company: initialApplication?.company ?? "",
            job_url: initialApplication?.job_url ?? "",
            applied_date: initialApplication?.applied_date ?? new Date().toISOString().split("T")[0],
            status: initialApplication?.status ?? "applied",
            interview_date: initialApplication?.interview_date ?? undefined,
            notes: initialApplication?.notes ?? "",
            cv_path: null,
            cover_letter_path: null,
        },
        validationSchema: applicationSchema,
        onSubmit: async (values, { resetForm, setErrors }) => {
            setLoading(true);
            try {
                let result;
                if (values.id) {
                    result = await updateApplication(values.id, values);
                } else {
                    result = await addApplication(values);
                }

                if (result.success) {                    
                    const newApp: IApplication = {
                        id:
                            result.data.data?.id ??
                            values.id ??
                            (applications.length
                                ? Math.max(...applications.map((a) => a.id)) + 1
                                : 1),
                        user_id: values.user_id ?? 0,
                        position: values.position ?? "",
                        company: values.company ?? "",
                        job_url: values.job_url ?? "",
                        applied_date: values.applied_date ?? new Date().toISOString(),
                        status: values.status ?? "applied",
                        interview_date: values.interview_date ?? null,
                        notes: values.notes ?? "",
                        cv_path: result.data.data?.cv_path ?? values.cv_path ?? null,
                        cover_letter_path: result.data.data?.cover_letter_path ?? values.cover_letter_path ?? null,
                        created_at: result.data.data?.created_at ?? initialApplication?.created_at ?? new Date().toISOString(),
                        updated_at: new Date().toISOString(),
                    };

                    if (values.id) {
                        setApplications((prev) =>
                            prev.map((app) => (app.id === values.id ? newApp : app))
                        );
                        toast.success("Candidature mise à jour avec succès !");
                    } else {
                        setApplications((prev) => [...prev, newApp]);
                        toast.success("Candidature ajoutée avec succès !");
                    }

                    resetForm();
                    setIsAddingNew(false);
                    setEditingId(null);
                } else {
                    if (result.fieldErrors) {
                        setErrors(result.fieldErrors);
                        toast.error("Veuillez corriger les erreurs du formulaire");
                    } else {
                        toast.error(values.id ? "Échec de la mise à jour" : "Échec de l'ajout");
                    }
                }
            } catch (err) {
                console.error("Erreur lors de l'ajout/édition", err);
                toast.error("Une erreur est survenue");
            } finally {
                setLoading(false);
            }
        },
    });

    return { formik, loading };
};
