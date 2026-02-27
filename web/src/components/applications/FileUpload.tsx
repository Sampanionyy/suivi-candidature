import { useCallback, useRef } from "react";

export const FileUploadButton: React.FC<{
    value: File | null;
    onChange: (file: File | null) => void;
    title: string;
    Icon: React.FC<{ className: string }>;
}> = ({ value, onChange, title, Icon }) => {
    const inputRef = useRef<HTMLInputElement>(null);

    const handleChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            onChange(e.target.files?.[0] || null);
        },
        [onChange]
    );

    return (
        <div className="flex flex-col items-center">
            <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className={`p-2 rounded-md transition-colors ${
                    value ? 'bg-green-100 text-green-600 hover:bg-green-200' : 'bg-gray-100 text-gray-500 hover:bg-fuchsia-100 hover:text-fuchsia-600'
                }`}
                title={value ? `${title}: ${value.name}` : title}
            >
                <Icon className="w-4 h-4" />
            </button>
            <input ref={inputRef} type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={handleChange} />
        </div>
    );
};
