import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import {
    PieChart, Pie, Cell, Tooltip, ResponsiveContainer
} from 'recharts';
import type { IStats } from '../../interfaces/types';

interface PositionDistributionProps {
    stats: IStats;
}

const COLORS = ['#f472b6', '#fb7185', '#f9a8d4', '#fbcfe8', '#e0e7ff', '#c7d2fe'];

const PositionDistribution: React.FC<PositionDistributionProps> = ({ stats }) => {
    return (
        <Card className="border-0 shadow-md rounded-xl">
            <CardHeader>
                <CardTitle>Répartition des postes</CardTitle>
            </CardHeader>
            <CardContent className="h-64 flex justify-center items-center">
                <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                        <Pie
                            data={stats.positions}
                            dataKey="total"
                            nameKey="position"
                            outerRadius={100}
                            label
                        >
                            {stats.positions.map((_, index: any) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                    </PieChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    )
}

export default PositionDistribution