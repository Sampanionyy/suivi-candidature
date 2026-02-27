import React, { useEffect, useState } from 'react';
import apiClient from '../services/api-service';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import ByStatus from '../components/applications/stats/ByStatus';
import type { IStats } from '../interfaces/types';
import TopCompanies from '../components/applications/stats/TopCompanies';
import UpcomingInterviews from '../components/applications/stats/UpcomingInterviews';
import TotalApplicationsOverTime from '../components/applications/stats/TotalApplicationsOverTime';
import PositionDistribution from '../components/applications/stats/PositionDistribution';

const Statistics: React.FC = () => {
    const [stats, setStats] = useState<IStats | null>(null);
    const [loading, setLoading] = useState(false);
    const [period, setPeriod] = useState<'week' | 'month' | 'year'>('week');

    const fetchStats = async () => {
        setLoading(true);
        try {
            const response = await apiClient.get(`/applications-stats?period=${period}`);
            if (response.data.success) {
                setStats(response.data.data);
            } else {
                toast.error(response.data.message || 'Erreur lors du chargement des statistiques');
            }
        } catch (err: any) {
            console.error(err);
            toast.error('Impossible de charger les statistiques');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, [period]);


    if (loading || !stats) return <p className="p-4 text-gray-500">Chargement des statistiques...</p>;

    return (
        <div className="space-y-6 p-4">
            <Card className="border-0 shadow-md rounded-xl">
                <CardHeader>
                    <CardTitle>Total de candidatures</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-3xl font-extrabold text-fuchsia-300">{stats.totalApplications}</p>
                </CardContent>
            </Card>

            <ByStatus stats={stats} />

            <TopCompanies stats={stats} />

            <UpcomingInterviews stats={stats} />

            <TotalApplicationsOverTime stats={stats} period={period} setPeriod={setPeriod} />

            <PositionDistribution stats={stats} />
        </div>
    );
};

export default Statistics;
