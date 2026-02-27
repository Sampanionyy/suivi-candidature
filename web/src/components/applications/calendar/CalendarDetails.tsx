import React from 'react'

import { formatDate, getInterviewsForDate } from '../../../utils/date-utils';
import type { Interview } from '../../../interfaces/types';
import { setStatusName } from '../../../utils/utils';

interface CalendarDetailsProps {
    selectedDate: Date;
    interviews: Interview[];
}

const CalendarDetails: React.FC<CalendarDetailsProps> = ({ selectedDate, interviews }) => {
    return (
        <div className="max-w-6xl mx-auto mt-6">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <h3 className="text-xl font-semibold mb-4 text-fuchsia-600">
                    {formatDate(selectedDate)}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {getInterviewsForDate(selectedDate, interviews).length > 0 ? (
                        getInterviewsForDate(selectedDate, interviews).map(interview => (
                            <div key={interview.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                                <h4 className="font-semibold text-gray-900 mb-2">{interview.position}</h4>
                                <p className="text-gray-600 mb-2">{interview.company}</p>
                                <span className={`
                                    inline-block text-xs px-3 py-1 rounded-full
                                    ${interview.status === 'scheduled' ? 'bg-blue-100 text-blue-800' : ''}
                                    ${interview.status === 'completed' ? 'bg-green-100 text-green-800' : ''}
                                    ${interview.status === 'cancelled' ? 'bg-red-100 text-red-800' : ''}
                                    ${interview.status === 'rejected' ? 'bg-gray-100 text-gray-800' : ''}
                                `}>
                                    {setStatusName(interview.status)}
                                </span>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full text-center text-gray-500 py-8">
                            <p>Aucun entretien prévu pour cette date</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default CalendarDetails