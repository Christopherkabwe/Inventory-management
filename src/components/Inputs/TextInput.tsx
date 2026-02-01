"use client";
import React from "react";
import { Input } from "@/components/ui/input";

interface TextInputProps {
    label?: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
    required?: boolean;
    disabled?: boolean;
}

export const TextInput: React.FC<TextInputProps> = ({
    label,
    value,
    onChange,
    placeholder,
    className,
    required = false,
    disabled = false,
}) => {
    return (
        <div className="space-y-1">
            {label && (
                <label className="text-sm font-medium text-black px-2 py-1">
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}
            <Input
                type="text"
                value={value}
                placeholder={placeholder}
                required={required}
                disabled={disabled}
                onChange={(e) => onChange(e.target.value)}
                className={className}
            />
        </div>
    );
};

{/*
<TextInput
  placeholder="Enter text"
  className="border rounded px-2 py-1"
  value={someValue}
  onChange={(value) => updateSomeValue(value)}
/>
    
*/}