import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import type { IStats } from '../../../interfaces/types';

interface UpcomingInterviewsProps {
    stats: IStats;
}

const UpcomingInterviews: React.FC<UpcomingInterviewsProps> = ({ stats }) => {
    return (
        <Card className="border-0 shadow-md rounded-xl">
            <CardHeader>
                <CardTitle>Entretiens à préparer</CardTitle>
            </CardHeader>
            <CardContent>
                {stats.upcomingInterviews.length === 0 ? (
                    <p className="text-gray-500">Aucun entretien prévu</p>
                ) : (
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {stats.upcomingInterviews.map((i, idx) => (
                            <li
                                key={idx}
                                className="flex justify-between items-center p-4 rounded-lg bg-fuchsia-50 shadow-sm hover:shadow-md transition"
                            >
                                <div>
                                    <p className="font-semibold text-fuchsia-700">{i.position}</p>
                                    <p className="text-sm text-fuchsia-500">@ {i.company}</p>
                                </div>
                                <span className="text-sm font-medium text-fuchsia-600 bg-fuchsia-200 px-3 py-1 rounded-full">
                                    {new Date(i.interview_date).toLocaleDateString('fr-FR')}
                                </span>
                            </li>
                        ))}
                    </ul>
                )}
            </CardContent>
        </Card>
    )
}

export default UpcomingInterviews;