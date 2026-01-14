import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface Product {
    id: string;
    name: string;
}

interface ProductDropdownProps {
    products: Product[];
    value: string;
    onChange: (value: string) => void;
}

export function ProductDropdown({
    products,
    value,
    onChange,
}: ProductDropdownProps) {
    return (
        <div className="flex flex-col gap-1 mb-3">
            <label className="font-medium mb-1">Select Product</label>

            <Select value={value} onValueChange={onChange}>
                <SelectTrigger className="h-9 w-50 border border-gray-200 rounded-lg px-4">
                    <SelectValue placeholder="Select Product" />
                </SelectTrigger>

                <SelectContent className="max-h-60 overflow-y-auto">
                    {products.map((p) => (
                        <SelectItem
                            key={p.id}
                            value={p.id}
                            className="py-2"
                        >
                            {p.name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}
