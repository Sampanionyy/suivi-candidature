import React from 'react';
import { Briefcase } from 'lucide-react';
import type { IJobContractType } from '../../interfaces/types';
import { getContractTypeById } from '../../utils/preferences-helpers';

interface ContractTypeSelectorProps {
    isEditingProfile: boolean;
    selectedContractTypes: number[];
    availableContractTypes: any;
    profile?: any;
    onToggleContractType: (typeId: number) => void;
}

export const ContractTypeSelector: React.FC<ContractTypeSelectorProps> = ({
    isEditingProfile,
    selectedContractTypes,
    availableContractTypes,
    profile,
    onToggleContractType
}) => {
    return (
        <div>
            <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Briefcase size={16} className="text-fuchsia-500" />
                Types de contrat recherchés
            </label>

            {isEditingProfile ? (
                <div className="space-y-2">
                    {availableContractTypes.data?.map((type: IJobContractType) => (
                        <label
                            key={type.id}
                            className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-fuchsia-50 cursor-pointer transition-colors"
                        >
                            <input
                                type="checkbox"
                                checked={selectedContractTypes.includes(type.id)}
                                onChange={() => onToggleContractType(type.id)}
                                className="w-4 h-4 text-fuchsia-600 border-gray-300 rounded focus:ring-fuchsia-500"
                            />
                            <span className="text-gray-700">{type.name}</span>
                        </label>
                    ))}
                </div>
            ) : (
                <div className="flex flex-wrap gap-2">
                    {selectedContractTypes.length === 0 ? (
                        <span className="text-gray-400 text-sm">Aucun type de contrat sélectionné</span>
                    ) : (
                        selectedContractTypes.map(typeId => {
                            const type = getContractTypeById(typeId, profile, availableContractTypes);
                            if (!type) return null;
                            return (
                                <span
                                    key={typeId}
                                    className="inline-flex items-center bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm"
                                >
                                    {type.name}
                                </span>
                            );
                        })
                    )}
                </div>
            )}
        </div>
    );
};