import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandInput, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command";
import { cn } from "@/lib/utils";

interface Transporter {
    id: string;
    name: string;
}

interface TransporterComboboxProps {
    transporters: Transporter[];
    value: string | null;
    onChange: (value: string) => void;
}

export function TransporterCombobox({ transporters, value, onChange }: TransporterComboboxProps) {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    className="w-full justify-between"
                >
                    {value ? transporters.find(t => t.id === value)?.name : "Select transporter"}
                    <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                </Button>
            </PopoverTrigger>

            <PopoverContent className="w-full p-0">
                <Command>
                    <CommandInput placeholder="Search transporter..." />
                    <CommandEmpty>No transporter found.</CommandEmpty>

                    <CommandGroup className="max-h-64 overflow-y-auto">
                        {transporters.map(t => (
                            <CommandItem
                                key={t.id}
                                value={t.name}
                                onSelect={() => onChange(t.id)}
                            >
                                <Check
                                    className={cn(
                                        "mr-2 h-4 w-4",
                                        value === t.id ? "opacity-100" : "opacity-0"
                                    )}
                                />
                                {t.name}
                            </CommandItem>
                        ))}
                    </CommandGroup>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
