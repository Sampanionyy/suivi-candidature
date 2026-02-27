import React from 'react';
import { MapPin } from 'lucide-react';
import type { IWorkMode } from '../../interfaces/types';
import { getWorkModeById } from '../../utils/preferences-helpers';

interface WorkModeSelectorProps {
    isEditingProfile: boolean;
    selectedWorkModes: number[];
    availableWorkModes: any;
    profile?: any;
    onToggleWorkMode: (modeId: number) => void;
}

export const WorkModeSelector: React.FC<WorkModeSelectorProps> = ({
    isEditingProfile,
    selectedWorkModes,
    availableWorkModes,
    profile,
    onToggleWorkMode
}) => {
    return (
        <div>
            <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <MapPin size={16} className="text-fuchsia-500" />
                Modes de travail préférés
            </label>

            {isEditingProfile ? (
                <div className="space-y-2">
                    {availableWorkModes.data?.map((mode: IWorkMode) => (
                        <label
                            key={mode.id}
                            className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-fuchsia-50 cursor-pointer transition-colors"
                        >
                            <input
                                type="checkbox"
                                checked={selectedWorkModes.includes(mode.id)}
                                onChange={() => onToggleWorkMode(mode.id)}
                                className="w-4 h-4 text-fuchsia-600 border-gray-300 rounded focus:ring-fuchsia-500"
                            />
                            <span className="text-gray-700">{mode.name}</span>
                        </label>
                    ))}
                </div>
            ) : (
                <div className="flex flex-wrap gap-2">
                    {selectedWorkModes.length === 0 ? (
                        <span className="text-gray-400 text-sm">Aucun mode sélectionné</span>
                    ) : (
                        selectedWorkModes.map(modeId => {
                            const mode = getWorkModeById(modeId, profile, availableWorkModes);
                            if (!mode) return null;
                            return (
                                <span
                                    key={modeId}
                                    className="inline-flex items-center bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm"
                                >
                                    {mode.name}
                                </span>
                            );
                        })
                    )}
                </div>
            )}
        </div>
    );
};
