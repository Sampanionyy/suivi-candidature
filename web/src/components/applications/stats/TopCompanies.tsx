import React from 'react'

import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import type { IStats } from '../../../interfaces/types';

interface TopCompaniesProps {
    stats: IStats;
}

const TopCompanies: React.FC<TopCompaniesProps> = ({ stats }) => {
    return (
        <Card className="border-0 shadow-md rounded-xl">
            <CardHeader>
                <CardTitle>Top entreprises ciblées</CardTitle>
            </CardHeader>
            <CardContent className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stats.topCompanies}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="company" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="total" fill="#ec4899" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    )
}

export default TopCompanies