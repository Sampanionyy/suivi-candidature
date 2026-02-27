import React from 'react';
import { Upload, FileText, Paperclip } from 'lucide-react';
import { FileUploadButton } from './FileUpload';

interface FileUploadSectionProps {
    cvPath: null | File;
    coverLetterPath: null | File;
    jobUrl: string;
    onCvChange: (file: File | null) => void;
    onCoverLetterChange: (file: File | null) => void;
}

export const FileUploadSection: React.FC<FileUploadSectionProps> = ({
    cvPath,
    coverLetterPath,
    jobUrl,
    onCvChange,
    onCoverLetterChange
}) => {
    return (
        <div className="flex flex-col space-y-2">
            <FileUploadButton
                value={cvPath}
                onChange={onCvChange}
                title="CV"
                Icon={cvPath ? FileText : Upload}
            />
            <FileUploadButton
                value={coverLetterPath}
                onChange={onCoverLetterChange}
                title="Lettre"
                Icon={coverLetterPath ? Paperclip : Upload}
            />
            {jobUrl && (
                <div className="text-xs text-gray-500 truncate" title={jobUrl}>
                    URL: {jobUrl}
                </div>
            )}
        </div>
    );
};