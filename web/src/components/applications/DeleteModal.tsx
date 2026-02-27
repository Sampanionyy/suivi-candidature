import React from "react";
import { Button } from "../../components/ui/button";
import Modal from "../ui/modal";

interface DeleteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

const DeleteModal: React.FC<DeleteModalProps> = ({ isOpen, onClose, onConfirm }) => {
    return (
        <Modal
            isOpen={isOpen}
            title="Confirmer la suppression"
            footer={
                <>
                    <Button variant="outline" onClick={onClose} className="rounded-xl">
                        Annuler
                    </Button>
                    <Button variant="destructive" onClick={onConfirm} className="rounded-xl">
                        Supprimer
                    </Button>
                </>
            }
        >
            <p className="text-sm text-gray-600">
                Êtes-vous sûr de vouloir supprimer cette candidature ? Cette action est irréversible.
            </p>
        </Modal>
    );
};

export default DeleteModal;
