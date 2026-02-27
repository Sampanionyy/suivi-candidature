import React, { useState, useEffect } from 'react';
import apiClient from '../services/api-service'; 
import CalendarDetails from '../components/applications/calendar/CalendarDetails';
import type { Interview } from '../interfaces/types';
import CalendarPrincipal from '../components/applications/calendar/CalendarPrincipal';

const CalendarPage: React.FC = () => {
    const [interviews, setInterviews] = useState<Interview[]>([]);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchInterviews = async () => {
            try {
                const response = await apiClient.get('/applications-interviews');
                if (response.data.success) {
                    setInterviews(response.data.data);
                }
            } catch (error) {
                console.error('Erreur lors du chargement des entretiens:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchInterviews();
    }, []);

    
    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-fuchsia-50 to-pink-50 flex items-center justify-center">
                <div className="animate-pulse flex space-x-4">
                    <div className="rounded-full bg-fuchsia-300 h-4 w-4"></div>
                    <div className="rounded-full bg-fuchsia-300 h-4 w-4"></div>
                    <div className="rounded-full bg-fuchsia-300 h-4 w-4"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-fuchsia-50 to-pink-50">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Calendrier des entretiens</h1>
                    <p className="text-gray-600">Gérez vos candidatures efficacement</p>
                </div>

                {/* Calendrier principal */}
                <CalendarPrincipal 
                    currentDate={currentDate} 
                    setCurrentDate={setCurrentDate} 
                    interviews={interviews} 
                    selectedDate={selectedDate} 
                    setSelectedDate={setSelectedDate} 
                />

                {/* Détails de la date sélectionnée */}
                {selectedDate && (
                    <CalendarDetails selectedDate={selectedDate} interviews={interviews} />
                )}
            </div>
        </div>
    );
};

export default CalendarPage;