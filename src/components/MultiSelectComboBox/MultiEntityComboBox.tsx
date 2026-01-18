"use client";

import { Check, ChevronsUpDown, X } from "lucide-react";
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

interface MultiEntityComboboxProps {
    items: Entity[];
    values: string[]; // multiple selected IDs
    placeholder: string;
    searchPlaceholder?: string;
    onChange: (values: string[]) => void;
}

export function MultiEntityCombobox({
    items,
    values,
    placeholder,
    searchPlaceholder = "Search...",
    onChange,
}: MultiEntityComboboxProps) {
    const toggle = (id: string) => {
        if (values.includes(id)) {
            onChange(values.filter((v) => v !== id));
        } else {
            onChange([...values, id]);
        }
    };

    const clearAll = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        onChange([]);
    };

    const selectedLabels = items
        .filter((i) => values.includes(i.id))
        .map((i) => i.label);

    return (
        <div className="relative">
            <Popover>
                <PopoverTrigger asChild>
                    <Button variant="outline" role="combobox" className="w-full justify-between">
                        <span className="truncate">
                            {selectedLabels.length ? selectedLabels.join(", ") : placeholder}
                        </span>
                        <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                    <div className="flex justify-end items-center p-2 border-b">
                        {values.length > 0 && (
                            <div className="flex justify-between items-center w-full px-2 py-1">
                                <span className="text-sm text-gray-500">Clear All</span>
                                <X onClick={clearAll} className="h-6 w-6 text-gray-400 hover:text-red-600 cursor-pointer" />
                            </div>
                        )}
                    </div>
                    <Command>
                        <CommandInput placeholder={searchPlaceholder} />
                        <CommandEmpty>No results found.</CommandEmpty>
                        <CommandGroup className="max-h-64 overflow-y-auto">
                            {items.map((item) => (
                                <CommandItem key={item.id} value={item.label} onSelect={() => toggle(item.id)}>
                                    <Check className={cn("mr-2 h-4 w-4", values.includes(item.id) ? "opacity-100" : "opacity-0")} />
                                    {item.label}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </Command>
                </PopoverContent>
            </Popover>
        </div>
    );
}



{/*

const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

<MultiProductCombobox
  products={products}
  values={selectedProducts}
  onChange={setSelectedProducts}
/>
const [locationIds, setLocationIds] = useState<string[]>([]);
const [transporterId, setTransporterId] = useState("");

<MultiLocationCombobox
  locations={locations}
  values={locationIds}
  onChange={setLocationIds}
/>

<TransporterCombobox
  transporters={transporters}
  value={transporterId}
  onChange={setTransporterId}
/>

 */}