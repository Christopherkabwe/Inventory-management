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

{/*

const [productId, setProductId] = useState("");
const [locationId, setLocationId] = useState("");
const [categories, setCategories] = useState<string[]>([]);

useEffect(() => {
  const params = new URLSearchParams();

  if (productId) params.set("productId", productId);
  if (locationId) params.set("locationId", locationId);
  categories.forEach(c => params.append("categories", c));

  fetch(`/api/rbac/inventory-history?${params.toString()}`)
    .then(res => res.json())
    .then(setRows)
    .finally(() => setLoading(false));
}, [productId, locationId, categories]);

*/}