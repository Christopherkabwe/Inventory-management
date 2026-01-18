import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface Location {
    id: string;
    name: string;
}

interface LocationDropdownProps {
    locations: Location[];
    value: string;
    onChange: (value: string) => void;
}

const CLEAR_VALUE = "__ALL__";

export function LocationDropdown({
    locations,
    value,
    onChange,
}: LocationDropdownProps) {
    return (
        <div className="flex flex-col gap-1">
            <label className="font-medium mb-1">Location</label>

            <Select
                value={value || CLEAR_VALUE}
                onValueChange={(v) => onChange(v === CLEAR_VALUE ? "" : v)}
            >
                <SelectTrigger className="h-9 w-full border rounded-lg px-4">
                    <SelectValue placeholder="All Locations" />
                </SelectTrigger>

                <SelectContent className="max-h-60 overflow-y-auto">
                    {/* Clear option */}
                    <SelectItem value={CLEAR_VALUE} disabled={!value} className="py-2 text-gray-500">
                        All Locations
                    </SelectItem>

                    {locations.map((loc) => (
                        <SelectItem key={loc.id} value={loc.id} className="py-2">
                            {loc.name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}
