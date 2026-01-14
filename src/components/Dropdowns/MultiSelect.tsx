"use client";

import { useEffect, useRef, useState } from "react";

export type MultiSelectOption = {
    id: string;
    name: string;
};

interface MultiSelectProps {
    label?: string;
    options: MultiSelectOption[];
    value: string[];
    onChange: (value: string[]) => void;
    placeholder?: string;
    searchable?: boolean;
}

export default function MultiSelect({
    label,
    options,
    value,
    onChange,
    placeholder = "Select options",
    searchable = true,
}: MultiSelectProps) {
    const [open, setOpen] = useState(false);
    const [filterText, setFilterText] = useState("");
    const containerRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);

    /* ---------------- OUTSIDE CLICK ---------------- */
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setOpen(false);
                setFilterText("");
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    /* ---------------- KEYBOARD SUPPORT ---------------- */
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setOpen((prev) => !prev);
        }
        if (e.key === "Escape") {
            setOpen(false);
            buttonRef.current?.focus();
        }
    };

    /* ---------------- TOGGLE ---------------- */
    const toggle = (name: string) => {
        onChange(
            value.includes(name)
                ? value.filter((v) => v !== name)
                : [...value, name]
        );
    };

    /* ---------------- CLEAR ---------------- */
    const clearAll = (e: React.MouseEvent) => {
        e.stopPropagation();
        onChange([]);
    };

    /* ---------------- FILTERED OPTIONS ---------------- */
    const filteredOptions = options.filter((opt) =>
        opt.name?.toLowerCase().includes(filterText.toLowerCase())
    );

    return (
        <div ref={containerRef} className="relative w-64">
            {label && <label className="block text-sm font-medium mb-1">{label}</label>}

            <button
                ref={buttonRef}
                type="button"
                aria-haspopup="listbox"
                aria-expanded={open}
                onClick={() => setOpen((prev) => !prev)}
                onKeyDown={handleKeyDown}
                className="w-full border rounded-md px-3 py-2 text-sm text-left bg-gray-100 flex justify-between items-center hover:bg-gray-200"
            >
                <span>
                    {value.length
                        ? `${value.length} selected`
                        : placeholder}
                </span>

                {value.length > 0 && (
                    <span
                        onClick={clearAll}
                        className="text-xs text-red-500 hover:underline ml-2"
                    >
                        Clear
                    </span>
                )}
            </button>

            {open && (
                <div
                    role="listbox"
                    tabIndex={-1}
                    className="absolute z-20 mt-1 w-full bg-white border rounded-md shadow-lg max-h-60 overflow-auto"
                >
                    {searchable && (
                        <input
                            type="text"
                            value={filterText}
                            onChange={(e) => setFilterText(e.target.value)}
                            placeholder="Search..."
                            className="w-full px-3 py-2 border-b text-sm focus:outline-none"
                        />
                    )}

                    {filteredOptions.length === 0 && (
                        <div className="px-3 py-2 text-sm text-gray-400">
                            No options
                        </div>
                    )}

                    {filteredOptions.map((opt) => (
                        <label
                            key={opt.id}
                            className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                        >
                            <input
                                type="checkbox"
                                checked={value.includes(opt.name)}
                                onChange={() => toggle(opt.name)}
                            />
                            {opt.name}
                        </label>
                    ))}
                </div>
            )}
        </div>
    );
}


{/**


// SERVER SIDE USE CASE //

export default async function FiltersPage() {
  const products = await getProductOptions(); // server-side
  const categories = await getCategoryOptions();
  const users = await getUserOptions();

  return (
    <div className="space-y-4">
      <ProductSelect products={products} value={[]} onChange={() => {}} />
      <CategorySelect categories={categories} value={[]} onChange={() => {}} />
      <UserSelect users={users} value={[]} onChange={() => {}} />
    </div>
  );
}


// CLIENT SIDE USE CASE //

"use client";
import { useEffect, useState } from "react";
import ProductSelect from "@/components/filters/ProductSelect";
import CategorySelect from "@/components/filters/CategorySelect";
import UserSelect from "@/components/filters/UserSelect";
import { MultiSelectOption } from "@/components/MultiSelect";

export default function FiltersClient() {
  const [products, setProducts] = useState<MultiSelectOption[]>([]);
  const [categories, setCategories] = useState<MultiSelectOption[]>([]);
  const [users, setUsers] = useState<MultiSelectOption[]>([]);

  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  useEffect(() => {
    fetch("/api/options/products").then(r => r.json()).then(setProducts);
    fetch("/api/options/categories").then(r => r.json()).then(setCategories);
    fetch("/api/options/users").then(r => r.json()).then(setUsers);
  }, []);

  return (
    <div className="space-y-4">
      <ProductSelect products={products} value={selectedProducts} onChange={setSelectedProducts} />
      <CategorySelect categories={categories} value={selectedCategories} onChange={setSelectedCategories} />
      <UserSelect users={users} value={selectedUsers} onChange={setSelectedUsers} />
    </div>
  );
}
 */}