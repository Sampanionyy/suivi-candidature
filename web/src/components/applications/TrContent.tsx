import { Briefcase, Building2, Calendar, Edit, FileText, Link, Trash2 } from "lucide-react";
import React from "react";
import type { IApplication } from "../../interfaces/types";

interface TrContentProps {
    app: IApplication;
    formatDate: (dateStr: string) => string;
    statusColors: { [key: string]: string };
    statusOptions: { value: string; label: string }[];
    onDelete: () => void; 
    onEdit: () => void;
}

const TrContent: React.FC<TrContentProps> = React.memo(({ 
    app, 
    formatDate, 
    statusColors, 
    statusOptions, 
    onDelete, 
    onEdit 
}) => {
    const handleEditClick = React.useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        onEdit();
    }, [onEdit]);

    const handleDeleteClick = React.useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        onDelete();
    }, [onDelete]);

    const handleLinkClick = React.useCallback((url: string) => (e: React.MouseEvent) => {
        console.log({url});
        
        e.preventDefault();
        e.stopPropagation();
        window.open(url, '_blank', 'noopener,noreferrer');
    }, []);

    return (
        <tr className="hover:bg-gray-50 transition-colors">
            <td className="px-6 py-4">
                <div className="flex items-center space-x-2">
                    <Briefcase className="w-4 h-4 text-gray-400" />
                    <span className="font-medium text-gray-900">{app.position}</span>
                </div>
            </td>

            <td className="px-6 py-4">
                <div className="flex items-center space-x-2">
                    <Building2 className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-900">{app.company}</span>
                </div>
            </td>

            <td className="px-6 py-4">
                <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-900">{formatDate(app.applied_date)}</span>
                </div>
            </td>

            <td className="px-6 py-4">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[app.status]}`}>
                    {statusOptions.find((s) => s.value === app.status)?.label}
                </span>
            </td>

            <td className="px-6 py-4">
                {app.interview_date ? (
                    <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-green-500" />
                        <span className="text-gray-900">{formatDate(app.interview_date)}</span>
                    </div>
                ) : (
                    <span className="text-gray-400">-</span>
                )}
            </td>

            <td className="px-6 py-4">
                <div className="flex space-x-2">
                    {app.cv_path && (
                        <button
                            onClick={handleLinkClick(`${import.meta.env.VITE_API_BASE_URL}${app.cv_path}`)}
                            className="p-1 text-blue-600 hover:bg-blue-100 rounded transition-colors"
                            title="CV"
                        >
                            <FileText className="w-4 h-4" />
                        </button>
                    )}
                    {app.cover_letter_path && (
                        <button 
                            onClick={handleLinkClick(`${import.meta.env.VITE_API_BASE_URL}${app.cover_letter_path}`)}
                            className="p-1 text-green-600 hover:bg-green-100 rounded transition-colors" 
                            title="Lettre de motivation"
                        >
                            <FileText className="w-4 h-4" />
                        </button>
                    )}
                    {app.job_url && (
                        <button 
                            onClick={handleLinkClick(`http://localhost:8000${app.job_url}`)}
                            className="p-1 text-purple-600 hover:bg-purple-100 rounded transition-colors" 
                            title="Offre d'emploi"
                        >
                            <Link className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </td>

            <td className="px-6 py-4">
                <div className="flex space-x-2">
                    <button 
                        onClick={handleEditClick}
                        className="p-2 text-fuchsia-600 hover:bg-fuchsia-100 rounded-md transition-colors" 
                        title="Modifier"
                    >
                        <Edit className="w-4 h-4" />
                    </button>
                    <button
                        onClick={handleDeleteClick}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-md transition-colors"
                        title="Supprimer"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            </td>
        </tr>
    );
});

TrContent.displayName = 'TrContent';

export default TrContent;