import React, { useEffect, useState } from "react";
import apiClient from "../services/api-service";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { Link } from "react-router-dom";

interface IStats {
    byStatus: { status: string; total: number }[];
    upcomingInterviews: { position: string; company: string; interview_date: string }[];
    totalApplications: number;
    applicationsOverTime: { year: number; month?: number; week?: number; total: number }[];
}

const Dashboard: React.FC = () => {
    const [stats, setStats] = useState<IStats | null>(null);
    const [loading, setLoading] = useState(false);

    const fetchStats = async () => {
        setLoading(true);
        try {
            const response = await apiClient.get(`/applications-stats?period=month`);
            if (response.data.success) {
                setStats(response.data.data);
            } else {
                toast.error(response.data.message || "Erreur lors du chargement du tableau de bord");
            }
        } catch (err: any) {
            console.error(err);
            toast.error("Impossible de charger le tableau de bord");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    if (loading || !stats) return <p className="p-4">Chargement...</p>;

    return (
        <div className="space-y-8 p-6">
            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="p-4 shadow-md rounded-xl bg-fuchsia-50">
                    <p className="text-sm text-gray-500">Total candidatures</p>
                    <p className="text-3xl font-bold text-fuchsia-500">{stats.totalApplications}</p>
                </Card>

                <Card className="p-4 shadow-md rounded-xl">
                    <p className="text-sm text-gray-500">En cours</p>
                    <p className="text-3xl font-bold text-blue-500">
                        {stats.byStatus.find((s) => s.status === "applied")?.total || 0}
                    </p>
                </Card>

                <Card className="p-4 shadow-md rounded-xl">
                    <p className="text-sm text-gray-500">Refusées</p>
                    <p className="text-3xl font-bold text-red-500">
                        {stats.byStatus.find((s) => s.status === "rejected")?.total || 0}
                    </p>
                </Card>

                <Card className="p-4 shadow-md rounded-xl">
                    <p className="text-sm text-gray-500">Entretiens</p>
                    <p className="text-3xl font-bold text-fuchsia-400">
                        {stats.upcomingInterviews.length}
                    </p>
                </Card>
            </div>

            {/* Graphe candidatures dans le temps */}
            <Card className="shadow-md rounded-xl">
                <CardHeader>
                    <CardTitle>Évolution des candidatures (par mois)</CardTitle>
                </CardHeader>
                <CardContent className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={stats.applicationsOverTime}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="total" fill="#f472b6" radius={[6, 6, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* Entretiens à venir */}
            <Card className="shadow-md rounded-xl">
                <CardHeader>
                    <CardTitle>Prochains entretiens</CardTitle>
                </CardHeader>
                <CardContent>
                    {stats.upcomingInterviews.length === 0 ? (
                        <p className="text-gray-500">Aucun entretien prévu</p>
                    ) : (
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {stats.upcomingInterviews.map((i, idx) => (
                                <li
                                    key={idx}
                                    className="p-4 rounded-lg bg-fuchsia-50 shadow-sm hover:shadow-md transition"
                                >
                                    <p className="font-semibold text-fuchsia-700">{i.position}</p>
                                    <p className="text-sm text-gray-600">@ {i.company}</p>
                                    <p className="mt-2 text-sm font-medium text-fuchsia-600 bg-fuchsia-200 px-3 py-1 rounded-full inline-block">
                                        {new Date(i.interview_date).toLocaleDateString("fr-FR")}
                                    </p>
                                </li>
                            ))}
                        </ul>
                    )}
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Link to="/applications">
                    <Card className="p-6 text-center cursor-pointer hover:shadow-lg transition rounded-xl bg-fuchsia-100">
                        <span className="font-medium">Ajouter une candidature</span>
                    </Card>
                </Link>

                <Link to="/calendar">
                    <Card className="p-6 text-center cursor-pointer hover:shadow-lg transition rounded-xl">
                        <span className="font-medium">Accéder au calendrier</span>
                    </Card>
                </Link>
            </div>

        </div>
    );
};

export default Dashboard;
