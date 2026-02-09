import { MultiEntityCombobox } from "./MultiEntityComboBox";

export function MultiProductCombobox({ products, values, onChange }) {
    return (
        <MultiEntityCombobox
            items={products.map((p) => ({
                id: p.id,
                label: p.name,
            }))}
            values={values}
            placeholder="Select products"
            searchPlaceholder="Search product..."
            onChange={onChange}
        />
    );
}


{/**
const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
const [selectedLocations, setSelectedLocations] = useState<string[]>([]);

useEffect(() => {
        setAllRows(rows);
        setFilteredRows(rows);

        // Populate products, categories, locations, and source types
        const uniqueProducts = Array.from(
            new Map(rows.map(p => [p.productId, p.product])).entries()
        ).map(([id, name]) => ({ id, name }));
        const uniqueCategories: Category[] = Array.from(
            new Set(rows.map(r => r.category).filter(Boolean))
        ).map(label => ({ id: label!, label }));
        const uniqueLocations = Array.from(
            new Map(rows.map(r => [r.locationId, r.locationName])).entries()
        ).map(([id, label]) => ({ id, label }));
        const uniqueSourceTypes: SourceType[] = Array.from(
            new Set(rows.map(r => r.sourceType))
        ).map(label => ({ id: label!, label }));

        setProducts(uniqueProducts);
        setCategories(uniqueCategories);
        setLocations(uniqueLocations);
        setSourceTypes(uniqueSourceTypes);
    }, [rows]);

    useEffect(() => {
        let filtered = allRows;
        // Filter by product IDs
        if (selectedProducts.length > 0) {
            filtered = filtered.filter(r => selectedProducts.includes(r.productId));
        }
        // Filter by category names
        if (selectedCategories.length > 0) {
            filtered = filtered.filter(r => selectedCategories.includes(r.category!));
        }
        // Filter by location IDs
        if (selectedLocations.length > 0) {
            filtered = filtered.filter(r => selectedLocations.includes(r.locationId));
        }
        // Filter by reference search
        if (referenceSearch.trim() !== "") {
            const searchLower = referenceSearch.toLowerCase();
            filtered = filtered.filter(r =>
                r.reference.toLowerCase().includes(searchLower) ||
                r.sku.toLowerCase().includes(searchLower) ||
                r.product.toLowerCase().includes(searchLower) ||
                r.category?.toLowerCase().includes(searchLower) ||
                r.locationName.toLowerCase().includes(searchLower) ||
                new Date(r.date).toLocaleDateString().toLowerCase().includes(searchLower)
            );
        }
        // ✅ Filter by date range
        // Date range normalization
        const start = dateRange.start ? new Date(new Date(dateRange.start).setHours(0, 0, 0, 0)) : null;
        const end = dateRange.end ? new Date(new Date(dateRange.end).setHours(23, 59, 59, 999)) : null;
        if (start || end) {
            filtered = filtered.filter((r) => {
                const rowDate = new Date(r.date);
                if (start && rowDate < start) return false;
                if (end && rowDate > end) return false;
                return true;
            });
        }
        setFilteredRows(filtered);
    }, [allRows, selectedProducts, selectedCategories, selectedLocations, referenceSearch, dateRange]);

*/}