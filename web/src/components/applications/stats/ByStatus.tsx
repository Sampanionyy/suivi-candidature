import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import type { IStats } from '../../../interfaces/types';

interface ByStatusProps {
    stats: IStats;
}

const statusTranslation: Record<string, string> = {
    to_apply: 'À postuler',
    applied: 'Candidature envoyée',
    interview: 'Entretien',
    offered: 'Offre reçue',
    rejected: 'Refusée',
    accepted: 'Acceptée'
};

const ByStatus: React.FC<ByStatusProps> = ({ stats }) => {

    return (
        <Card className="border-0 shadow-md rounded-xl">
            <CardHeader>
                <CardTitle>Candidatures par statut</CardTitle>
            </CardHeader>
            <CardContent className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stats.byStatus}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                            dataKey="status"
                            tickFormatter={(val) => statusTranslation[val] || val}
                        />                            
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="total" fill="#f472b6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    )
}

export default ByStatus