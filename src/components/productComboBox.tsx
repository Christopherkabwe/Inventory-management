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

interface Product {
    id: string;
    name: string;
}

interface ProductComboboxProps {
    products: Product[];
    value: string | null;
    onChange: (value: string) => void;
}

export function ProductCombobox({
    products,
    value,
    onChange,
}: ProductComboboxProps) {
    return (
        <Popover>
            <PopoverTrigger asChild >
                <Button
                    variant="outline"
                    role="combobox"
                    className="w-[260px] justify-between"
                >
                    {
                        value
                            ? products.find((p) => p.id === value)?.name
                            : "Select product"}
                    < ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                </Button>
            </PopoverTrigger>

            < PopoverContent className="w-[260px] p-0" >
                <Command>
                    <CommandInput placeholder="Search product..." />
                    <CommandEmpty>No product found.</CommandEmpty>

                    <CommandGroup className="max-h-64 overflow-y-auto">
                        {
                            products.map((product) => (
                                <CommandItem
                                    key={product.id}
                                    value={product.name}
                                    onSelect={() => onChange(product.id)}
                                >
                                    <Check
                                        className={
                                            cn(
                                                "mr-2 h-4 w-4",
                                                value === product.id ? "opacity-100" : "opacity-0"
                                            )
                                        }
                                    />
                                    {product.name}
                                </CommandItem>
                            ))
                        }
                    </CommandGroup>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
