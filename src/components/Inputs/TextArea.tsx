"use client";
import React from "react";

interface TextAreaProps {
    label?: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
    required?: boolean;
    disabled?: boolean;
    rows?: number;
}

export const TextArea: React.FC<TextAreaProps> = ({
    label,
    value,
    onChange,
    placeholder,
    className,
    required = false,
    disabled = false,
    rows = 1,
}) => {
    return (
        <div className="space-y-1">
            {label && (
                <label className="text-sm font-medium text-black px-2 py-1">
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}
            <textarea
                value={value}
                placeholder={placeholder}
                required={required}
                disabled={disabled}
                onChange={(e) => onChange(e.target.value)}
                className={`border rounded-md px-2 py-1.5 w-full ${className}`}
                rows={rows}
            />
        </div>
    );
};


{/*
<TextArea
  placeholder="Enter text"
  className="border rounded px-2 py-1"
  value={someValue}
  onChange={(value) => updateSomeValue(value)}
  rows={5} // optional, defaults to 3
/>
    
*/}