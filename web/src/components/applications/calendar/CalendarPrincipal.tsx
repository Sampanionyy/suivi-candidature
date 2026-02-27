import React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getInterviewsForDate } from '../../../utils/date-utils';
import type { Interview } from '../../../interfaces/types';

interface CalendarPrincipalProps {
    currentDate: Date;
    setCurrentDate: React.Dispatch<React.SetStateAction<Date>>;
    selectedDate: Date | null;
    setSelectedDate: React.Dispatch<React.SetStateAction<Date | null>>;
    interviews: Interview[];
}

const CalendarPrincipal: React.FC<CalendarPrincipalProps> = ({
    currentDate,
    setCurrentDate,
    selectedDate,
    setSelectedDate,
    interviews
}) => {
    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        const days = [];

        // Jours du mois précédent pour compléter la première semaine
        for (let i = startingDayOfWeek - 1; i >= 0; i--) {
            const prevDate = new Date(year, month, -i);
            days.push({ date: prevDate, isCurrentMonth: false });
        }

        // Jours du mois actuel
        for (let day = 1; day <= daysInMonth; day++) {
            days.push({ date: new Date(year, month, day), isCurrentMonth: true });
        }

        // Jours du mois suivant pour compléter la dernière semaine
        const remainingDays = 42 - days.length;
        for (let day = 1; day <= remainingDays; day++) {
            const nextDate = new Date(year, month + 1, day);
            days.push({ date: nextDate, isCurrentMonth: false });
        }

        return days;
    };

    const navigateMonth = (direction: 'prev' | 'next') => {
        setCurrentDate(prev => {
            const newDate = new Date(prev);
            if (direction === 'prev') {
                newDate.setMonth(prev.getMonth() - 1);
            } else {
                newDate.setMonth(prev.getMonth() + 1);
            }
            return newDate;
        });
    };

    const goToToday = () => {
        setCurrentDate(new Date());
    };

    const days = getDaysInMonth(currentDate);
    const monthName = currentDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
    const dayNames = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

    return (
        <div className="max-w-6xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                {/* En-tête du calendrier */}
                <div className="bg-fuchsia-300 text-white p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-2xl font-bold capitalize">{monthName}</h2>
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={() => navigateMonth('prev')}
                                className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <button
                                onClick={goToToday}
                                className="px-4 py-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors text-sm font-medium"
                            >
                                Aujourd'hui
                            </button>
                            <button
                                onClick={() => navigateMonth('next')}
                                className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Jours de la semaine */}
                    <div className="grid grid-cols-7 gap-1">
                        {dayNames.map(day => (
                            <div key={day} className="text-center py-3 text-sm font-medium">
                                {day}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Grille du calendrier */}
                <div className="p-6">
                    <div className="grid grid-cols-7 gap-1">
                        {days.map((day, index) => {
                            const dayInterviews = getInterviewsForDate(day.date, interviews);
                            const isToday = day.date.toDateString() === new Date().toDateString();
                            const isSelected = selectedDate && day.date.toDateString() === selectedDate.toDateString();

                            return (
                                <div
                                    key={index}
                                    className={`
                                        min-h-[120px] p-2 border border-gray-100 rounded-lg cursor-pointer
                                        hover:bg-fuchsia-50 transition-all duration-200
                                        ${!day.isCurrentMonth ? 'bg-gray-50 text-gray-400' : 'bg-white'}
                                        ${isToday ? 'ring-2 ring-fuchsia-300 bg-fuchsia-50' : ''}
                                        ${isSelected ? 'ring-2 ring-fuchsia-500 bg-fuchsia-100' : ''}
                                    `}
                                    onClick={() => setSelectedDate(day.date)}
                                >
                                    <div className={`
                                        text-sm font-medium mb-1
                                        ${isToday ? 'text-fuchsia-600' : day.isCurrentMonth ? 'text-gray-900' : 'text-gray-400'}
                                    `}>
                                        {day.date.getDate()}
                                    </div>

                                    <div className="space-y-1">
                                        {dayInterviews.slice(0, 2).map((interview: Interview) => (
                                            <div
                                                key={interview.id}
                                                className="text-xs bg-fuchsia-100 text-fuchsia-800 px-2 py-1 rounded truncate"
                                                title={`${interview.position} - ${interview.company}`}
                                            >
                                                {interview.company}
                                            </div>
                                        ))}
                                        {dayInterviews.length > 2 && (
                                            <div className="text-xs text-gray-500">
                                                +{dayInterviews.length - 2} autres
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CalendarPrincipal