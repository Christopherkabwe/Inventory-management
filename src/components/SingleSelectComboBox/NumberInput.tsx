"use client";

import React from "react";
import { Input } from "@/components/ui/input";

interface NumberInputProps {
    label?: string;
    value: number;
    onChange: (value: number) => void;
    min?: number;
    max?: number;
    step?: number;
    placeholder?: string;
    className?: string;
    required?: boolean;
    disabled?: boolean;
}

export const NumberInput: React.FC<NumberInputProps> = ({
    label,
    value,
    onChange,
    min = 0,
    max,
    step = 1,
    placeholder,
    className,
    required = false,
    disabled = false,
}) => {
    return (
        <div className="space-y-1">
            {label && (
                <label className="text-sm font-medium text-gray-700 px-2 py-1">
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}

            <Input
                type="number"
                value={Number.isFinite(value) ? value : 0}
                min={min}
                max={max}
                step={step}
                placeholder={placeholder}
                required={required}
                disabled={disabled}
                onChange={(e) => {
                    const v = e.target.value;
                    const num = v === "" ? 0 : Number(v);
                    if (!Number.isNaN(num)) {
                        onChange(num);
                    }
                }}
                className={className}
            />
        </div>
    );
};
