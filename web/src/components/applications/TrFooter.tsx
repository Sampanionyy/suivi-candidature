import { Briefcase } from 'lucide-react'

interface TrFooterProps {
    setIsAddingNew: React.Dispatch<React.SetStateAction<boolean>>
}

const TrFooter: React.FC<TrFooterProps> = ({ setIsAddingNew }) => {
    return (
        <tr>
            <td colSpan={7} className="px-6 py-12 text-center">
                <div className="flex flex-col items-center space-y-2">
                    <Briefcase className="w-12 h-12 text-gray-300" />
                    <p className="text-gray-500">Aucune candidature trouvée</p>
                    <button
                        onClick={() => setIsAddingNew(true)}
                        className="mt-4 px-4 py-2 bg-fuchsia-500 text-white rounded-lg hover:bg-fuchsia-600 transition-colors"
                    >
                        Ajouter votre première candidature
                    </button>
                </div>
            </td>
        </tr>
    )
}

export default TrFooter