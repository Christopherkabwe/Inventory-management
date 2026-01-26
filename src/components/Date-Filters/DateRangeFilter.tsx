"use client";

import * as React from "react";
import { CalendarIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/search/Calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface DateRange {
    start?: Date;
    end?: Date;
}

interface DateRangeFilterProps {
    value: DateRange;
    onChange: (range: DateRange) => void;
}

export function DateRangeFilter({ value, onChange }: DateRangeFilterProps) {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    className={cn(
                        "w-full justify-start text-left font-bold",
                        !value.start && "text-muted-foreground"
                    )}
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {value.start
                        ? value.end
                            ? `${value.start.toLocaleDateString()} – ${value.end.toLocaleDateString()}`
                            : value.start.toLocaleDateString()
                        : "Select Date Range"}
                </Button>
            </PopoverTrigger>

            <PopoverContent
                className="w-auto p-0 rounded-lg shadow-md"
                align="start"
            >
                <div className="p-3">
                    <Calendar
                        mode="range"
                        selected={{ from: value.start, to: value.end }}
                        onSelect={(range) =>
                            onChange({
                                start: range?.from,
                                end: range?.to,
                            })
                        }
                        numberOfMonths={2}
                        showOutsideDays
                    />
                </div>

                {(value.start || value.end) && (
                    <div className="border-t p-2">
                        <Button
                            variant="ghost"
                            className="w-full text-red-500"
                            onClick={() => onChange({})}
                        >
                            <X className="mr-2 h-4 w-4" /> Clear dates
                        </Button>
                    </div>
                )}
            </PopoverContent>
        </Popover>
    );
}


{/*
    HOW TO USE DATE RANGE FILTER

import DateRangeFilter from "@/components/MultiselectComboBox/DateRangeFilter"

interface DateRange {
    start?: Date;
    end?: Date;
}

const [dateRange, setDateRange] = useState<DateRange>({});



useEffect(() => {
        let filtered = data;

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
                r.product.toLowerCase().includes(searchLower) ||
                r.locationName.toLowerCase().includes(searchLower) ||
                new Date(r.date).toLocaleDateString().toLowerCase().includes(searchLower)
            );
        }

        // ✅ Filter by date range
        // Date range normalization
        const start = dateRange.start
            ? new Date(new Date(dateRange.start).setHours(0, 0, 0, 0))
            : null;

        const end = dateRange.end
            ? new Date(new Date(dateRange.end).setHours(23, 59, 59, 999))
            : null;

        if (start || end) {
            filtered = filtered.filter((r) => {
                const rowDate = new Date(r.date);

                if (start && rowDate < start) return false;
                if (end && rowDate > end) return false;

                return true;
            });
        }

        setFilteredRows(filtered);
    }, [data, selectedProducts, selectedCategories, selectedLocations, referenceSearch, dateRange]);


    <DateRangeFilter
    value={dateRange}
    onChange={setDateRange}
    />

*/}