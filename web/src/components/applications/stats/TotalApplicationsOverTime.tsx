import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import type { IStats } from '../../../interfaces/types';

interface TotalApplicationsOverTimeProps {
    stats: IStats;
    period: 'week' | 'month' | 'year';
    setPeriod: (period: 'week' | 'month' | 'year') => void;
}

const TotalApplicationsOverTime: React.FC<TotalApplicationsOverTimeProps> = ({ stats, period, setPeriod }) => {
    return (
        <Card className="border-0 shadow-md rounded-xl">
            <CardHeader className="flex justify-between items-center">
                <CardTitle>Candidatures {period}</CardTitle>
                <select
                    value={period}
                    onChange={(e) => {
                        e.preventDefault(); 
                        setPeriod(e.target.value as 'week' | 'month' | 'year');
                    }}
                    className="border border-fuchsia-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-fuchsia-200"
                >
                    <option value="week">Par semaine</option>
                    <option value="month">Par mois</option>
                    <option value="year">Par année</option>
                </select>
            </CardHeader>
            <CardContent className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stats.applicationsOverTime}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                            dataKey={period === 'week' ? 'week' : period === 'month' ? 'month' : 'year'}
                            tickFormatter={(val) => val.toString()}
                        />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="total" fill="#f472b6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    )
}

export default TotalApplicationsOverTime