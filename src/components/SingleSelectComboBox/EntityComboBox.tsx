"use client";

import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface Entity {
    id: string;
    label: string;
}

interface EntityComboboxProps {
    items: Entity[];
    value: string;
    placeholder: string;
    searchPlaceholder?: string;
    onChange: (value: string) => void;
}

export function EntityCombobox({
    items,
    value,
    placeholder,
    searchPlaceholder = "Search...",
    onChange,
}: EntityComboboxProps) {
    const selected = items.find((i) => i.id === value);

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    className="w-full justify-between"
                >
                    {selected?.label ?? placeholder}
                    <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                </Button>
            </PopoverTrigger>

            <PopoverContent
                align="start"
                className="w-[--radix-popover-trigger-width] p-0"
            >
                <Command>
                    <CommandInput placeholder={searchPlaceholder} />
                    <CommandEmpty>No results found.</CommandEmpty>

                    <CommandGroup className="max-h-64 overflow-y-auto">
                        {items.map((item) => (
                            <CommandItem
                                key={item.id}
                                value={item.label}
                                onSelect={() => onChange(item.id)}
                            >
                                <Check
                                    className={cn(
                                        "mr-2 h-4 w-4",
                                        value === item.id ? "opacity-100" : "opacity-0"
                                    )}
                                />
                                {item.label}
                            </CommandItem>
                        ))}
                    </CommandGroup>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
