"use client";

import React from "react";
import { Input } from "@/components/ui/input";

interface NumberInputProps {
    value: number;
    onChange: (value: number) => void;
    min?: number;
    max?: number;
    step?: number;
    placeholder?: string;
    className?: string;
    required?: boolean;
}

export const NumberInput: React.FC<NumberInputProps> = ({
    value,
    onChange,
    min = 0,
    max,
    step = 1,
    placeholder,
    className,
    required = false,
}) => {
    return (
        <Input
            type="number"
            min={min}
            max={max}
            step={step}
            value={value}
            placeholder={placeholder}
            required={required}
            onChange={(e) => {
                const newValue = Number(e.target.value);
                onChange(newValue);
            }}
            className={className}
        />
    );
};
