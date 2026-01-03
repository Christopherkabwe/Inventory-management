"use client";

import DashboardLayout from "@/components/DashboardLayout";
import { useEffect, useState } from "react";
import { Listbox } from "@headlessui/react";
import { RotateCw, User } from "lucide-react";

interface Product {
    id: string;
    name: string;
    sku: string;
    price: number;
    packSize: number;
    weightValue: number;
    category?: string;
}

interface Customer {
    id: string;
    name: string;
    address?: string;
}

interface Location {
    id: string;
    name: string;
}

interface SaleItem {
    productId: string;
    sku: string;
    packSize?: number;
    uom?: string;
    quantity: number;
    price: number;
    vat?: number;
    total: number;
    tonnage?: number;
}


// ...imports and interfaces remain the same

export default function CreateSalePage() {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [locations, setLocations] = useState<Location[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [items, setItems] = useState<SaleItem[]>([]);

    const [selectedCustomer, setSelectedCustomer] = useState<string>("");
    const [deliveryAddress, setDeliveryAddress] = useState<string>("");
    const [selectedLocation, setSelectedLocation] = useState<string>("");
    const [transporterName, setTransporterName] = useState<string>("");
    const [vehicleNumber, setVehicleNumber] = useState<string>("");
    const [driverName, setDriverName] = useState<string>("");
    const [driverContact, setDriverContact] = useState<string>("");
    const [paymentReference, setPaymentReference] = useState<string>("Cash");
    const [preparedBy, setPreparedBy] = useState<string>("Admin"); // default current user
    const [createdBy, setCreatedBy] = useState<string>("admin");

    const [orderNumber, setOrderNumber] = useState("");
    const [orderedBy, setOrderedBy] = useState("");
    const [orderDateTime, setOrderDateTime] = useState(() => {
        const now = new Date();

        const yyyy = now.getFullYear();
        const mm = String(now.getMonth() + 1).padStart(2, "0"); // months are 0-indexed
        const dd = String(now.getDate()).padStart(2, "0");

        const hh = String(now.getHours()).padStart(2, "0");
        const min = String(now.getMinutes()).padStart(2, "0");

        return `${yyyy}-${mm}-${dd}T${hh}:${min}`;
    });
    const [poNumber, setPoNumber] = useState(""); // optional, manual
    const [approvedBy, setApprovedBy] = useState("");

    const [invoiceNumber, setInvoiceNumber] = useState<string>("");
    const [deliveryNote, setDeliveryNote] = useState<string>("");

    const [defaultVAT, setDefaultVAT] = useState<number>(16); // e.g., 16% +

    const totalQuantity = items.reduce((s, i) => s + i.quantity, 0);
    const totalTonnage = items.reduce((s, i) => s + (i.tonnage || 0), 0);
    const totalAmount = items.reduce((s, i) => s + i.total, 0);


    useEffect(() => {
        async function fetchData() {
            const [custRes, locRes, prodRes, lastOrderRes] = await Promise.all([
                fetch("/api/customers").then(r => r.json()),
                fetch("/api/locations").then(r => r.json()),
                fetch("/api/products").then(r => r.json()),
                fetch("/api/sales/lastOrderNumber").then(r => r.json()), // returns { lastOrderNumber: "ORD00000042" }
            ]);

            setCustomers(custRes.data || []);
            setLocations(locRes.data || []);
            setProducts(prodRes.data || []);

            const nextOrder = generateNextOrderNumber(lastOrderRes.lastOrderNumber);
            setOrderNumber(nextOrder);
        }

        fetchData();
    }, []);

    useEffect(() => {
        const cust = customers.find(c => c.id === selectedCustomer);
        setDeliveryAddress(cust?.address || "");
    }, [selectedCustomer, customers]);

    const addItem = () => {
        setItems([
            ...items,
            {
                productId: "",
                sku: "",
                quantity: 1,
                price: 0,
                total: 0,
                uom: "kg",
                vat: defaultVAT,
            },
        ]);
    };

    const updateItem = (index: number, field: keyof SaleItem, value: any) => {
        const newItems: SaleItem[] = [...items];

        newItems[index] = {
            ...newItems[index],
            [field]: value,
        };

        const product = products.find(p => p.id === newItems[index].productId);

        if (product && field === "productId") {
            newItems[index] = {
                ...newItems[index],
                price: product.price,
                sku: product.sku,
                packSize: product.packSize,
                uom: "kg",
                vat: 0,
            };
        }

        const qty = newItems[index].quantity || 0;
        const price = newItems[index].price || 0;
        const vat = newItems[index].vat || 0;

        newItems[index].total = +(qty * price * (1 + vat / 100)).toFixed(2);

        if (product) {
            newItems[index].tonnage = +(
                (product.weightValue * qty * (newItems[index].packSize || 1)) / 1000
            ).toFixed(2);
        }

        setItems(newItems);
    };

    const removeItem = (index: number) => setItems(items.filter((_, i) => i !== index));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Confirmation before creating sale
        const confirmCreate = window.confirm(
            "Are you sure you want to create this sales order? This action cannot be undone."
        );
        if (!confirmCreate) return;

        if (!selectedCustomer || !selectedLocation || !driverName || !items.length) {
            alert("Please fill all required fields and add at least one item.");
            return;
        }

        try {
            const res = await fetch("/api/sales", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    customerId: selectedCustomer,
                    deliveryAddress,
                    locationId: selectedLocation,
                    transporterName,
                    vehicleNumber,
                    driverName,
                    driverContact,
                    paymentReference,
                    orderedBy,
                    preparedBy,
                    items,
                    createdBy,
                    orderNumber,   // system-generated
                    poNumber,      // optional manual input
                }),
            });

            const data = await res.json();

            if (res.ok) {
                setInvoiceNumber(data.invoiceNumber);
                setDeliveryNote(data.deliveryNote);

                alert(`Sale created: ${data.invoiceNumber} / ${data.deliveryNote}`);

                // Reset form after successful creation
                setItems([]);
                setSelectedCustomer("");
                setDeliveryAddress("");
                setSelectedLocation("");
                setTransporterName("");
                setVehicleNumber("");
                setDriverName("");
                setDriverContact("");
                setPaymentReference("Cash");
                setOrderedBy("");
            } else {
                alert("Error: " + data.error);
            }
        } catch (err) {
            console.error(err);
            alert("Failed to create sale");
        }
    };

    const generateNextOrderNumber = (lastOrderNumber: string | null) => {
        let nextNumber = 1;

        if (lastOrderNumber) {
            // Remove 'ORD' prefix and parse number
            const num = parseInt(lastOrderNumber.slice(3), 10);
            nextNumber = num + 1;
        }

        // Pad with zeros to 8 digits
        return `ORD${String(nextNumber).padStart(8, "0")}`;
    };

    // Vat Amount
    const totalVATAmount = items.reduce(
        (s, i) => s + (i.total - (i.price * i.quantity)), 0
    );



    return (
        <DashboardLayout>
            <div className="w-full p-6 border border-black dark:border-gray-500 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 dark:border-gray-500">
                <hr className="border-t-2 border-black dark:border-gray-500 mb-5" />
                <h1 className="text-4xl font-bold text-blue-900 mb-6 text-center">Sales Order</h1>
                <hr className="border-t-2 border-black dark:border-gray-500 mb-5" />
                <form onSubmit={handleSubmit} className="w-full space-y-6">
                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-0 w-full">
                        <div className="overflow-x-auto p-3 w-full text-left space-y-2">
                            <p className="text-2xl text-blue-900 font-bold">Biz360° Business Management</p>
                            <p className="text-md text-left font-bold">123 Business St., Lusaka, Zambia</p>
                            <p className="text-md text-left font-bold">support@biz360.com</p>
                            <p className="text-md text-left font-bold">+260 978 370 871</p>
                        </div>
                        <div className="hidden sm:flex justify-center items-center overflow-x-auto p-10 gap-5 w-full">
                            <RotateCw className="xl:h-20 xl:w-20 h-12 w-12 text-blue-900" />
                            <h1 className="text-2xl text-blue-900 font-bold">Biz360°</h1>
                        </div>
                        {/* ===Location & Payment / Personnel Info === */}
                        <div className="w-full flex">
                            <div className="overflow-x-auto w-full border border-black dark:border-gray-500">

                                <table className="w-full text-sm">
                                    <tbody className="divide-y divide-black">
                                        <tr>
                                            <th className="px-2 py-2 text-left border-r border-black dark:border-gray-500">Point Of Sale</th>
                                            <td className="px-2 py-1">
                                                <select
                                                    value={selectedLocation}
                                                    onChange={e => setSelectedLocation(e.target.value)}
                                                    required
                                                    className="w-full bg-white dark:text-black"
                                                >
                                                    <option value="">Select Location</option>
                                                    {locations.map(l => (
                                                        <option key={l.id} value={l.id}>{l.name}</option>
                                                    ))}
                                                </select>
                                            </td>
                                        </tr>
                                        <tr>
                                            <th className="px-2 py-2 text-left border-r border-black dark:border-gray-500">Order Number</th>
                                            <td className="px-2 py-1">
                                                <input
                                                    value={orderNumber}
                                                    readOnly
                                                    className="w-full bg-white text-sm dark:text-black"
                                                    placeholder="Enter Order No."
                                                />
                                            </td>
                                        </tr>
                                        <tr>
                                            <th className="px-2 py-2 text-left border-r border-black dark:border-gray-500">Ordered By</th>
                                            <td className="px-2 py-1">
                                                <input
                                                    value={orderedBy}
                                                    onChange={e => setOrderedBy(e.target.value)}
                                                    className="w-full bg-white text-sm dark:text-black"
                                                    placeholder="Enter Ordered By"
                                                />
                                            </td>
                                        </tr>
                                        <tr>
                                            <th className="px-2 py-2 text-left border-r border-black dark:border-gray-500">Order Date</th>
                                            <td className="px-2 py-1">
                                                <input
                                                    type="datetime-local"
                                                    value={orderDateTime}
                                                    onChange={(e) => setOrderDateTime(e.target.value)}
                                                    className="w-full bg-white text-sm dark:text-black"
                                                    placeholder="Enter Order Date"
                                                />
                                            </td>
                                        </tr>
                                        <tr>
                                            <th className="px-2 py-2 text-left border-r border-black dark:border-gray-500">
                                                PO No.
                                            </th>
                                            <td className="px-2 py-1">
                                                <input
                                                    value={poNumber}
                                                    onChange={e => setPoNumber(e.target.value)}
                                                    className="w-full bg-white text-sm dark:text-black"
                                                    placeholder="Enter PO No."
                                                />
                                            </td>
                                        </tr>
                                        <tr>
                                            <th className="px-2 py-2 text-left border-r border-black dark:border-gray-500">Payment Reference</th>
                                            <td className="px-2 py-1">
                                                <select
                                                    value={paymentReference}
                                                    onChange={e => setPaymentReference(e.target.value)}
                                                    className="w-full bg-white text-sm dark:text-black"
                                                >
                                                    <option value="Cash">Cash</option>
                                                    <option value="Credit">Credit</option>
                                                    <option value="COD">COD</option>
                                                </select>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <hr className="border-t-2 border-black dark:border-gray-500 mb-5" />
                    {/* Restructure */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 w-full">

                        {/* === grid 1: Customer Name === */}
                        <div className="overflow-x-auto w-full border border-black dark:border-gray-500">
                            <table className="w-full text-sm">
                                <thead className="bg-blue-200 dark:bg-gray-100">
                                    <tr>
                                        <th colSpan={2} className="px-2 py-1 text-center border border-black dark:border-gray-500 dark:text-black">
                                            Customer Name
                                        </th>
                                    </tr>
                                    <tr><td colSpan={2} className="h-px border border-black dark:border-gray-500 p-0 m-0"></td></tr>
                                </thead>
                                <tbody className="px-2 py-2 transition focus-within:ring-2 focus-within:ring-gray-300 focus-within:ring-offset-black dark:focus-within:ring-offset-gray-50">
                                    <tr>
                                        <td colSpan={2} className="px-2 py-1">
                                            <Listbox value={selectedCustomer} onChange={setSelectedCustomer}>
                                                <div className="relative w-full">
                                                    {/* Dynamic height button */}
                                                    <Listbox.Button
                                                        as="button"
                                                        className="w-full p-2 text-left bg-white dark:bg-gray-100 text-sm whitespace-normal break-words text-gray-900"
                                                    >
                                                        {customers.find(c => c.id === selectedCustomer)?.name || "Select Customer"}
                                                    </Listbox.Button>

                                                    <Listbox.Options className="absolute z-10 mt-1 w-full bg-white max-h-60 overflow-y-auto">
                                                        {customers.map((c) => (
                                                            <Listbox.Option
                                                                key={c.id}
                                                                value={c.id}
                                                                className={({ active, selected }) =>
                                                                    `cursor-pointer select-none p-2 ${active ? "bg-blue-200 text-white" : selected ? "bg-gray-100" : "text-gray-900 dark:text-black"}`
                                                                }
                                                            >
                                                                {c.name}
                                                            </Listbox.Option>
                                                        ))}
                                                    </Listbox.Options>
                                                </div>
                                            </Listbox>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        {/* === Grid: 2 Delivery Address === */}
                        <div className="overflow-x-auto w-full border border-black dark:border-gray-500">
                            <table className="w-full text-sm">
                                <thead className="bg-blue-200 dark:bg-gray-100">
                                    <tr>
                                        <th colSpan={2} className="px-2 py-1 text-center border border-black dark:border-gray-500 dark:text-black">
                                            Delivery Address
                                        </th>
                                    </tr>
                                    <tr><td colSpan={2} className="h-px border border-black dark:border-gray-500 p-0 m-0"></td></tr>
                                </thead>
                                <tbody className="bg-gray-30">
                                    <tr>
                                        <td colSpan={2} className="px-2 py-1">
                                            <textarea
                                                value={deliveryAddress}
                                                onChange={e => setDeliveryAddress(e.target.value)}
                                                className="text-left w-full p-2 bg-white dark:bg-gray-50 dark:text-black text-sm resize-none min-h-[40px]"
                                                rows={3} // default visible lines
                                                placeholder="Enter Delivery Address"
                                            />
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        {/* === Grid 3: Shipping Information === */}
                        <div className="overflow-x-auto w-full border border-black dark:border-gray-500">
                            <table className="w-full text-sm">
                                <thead className="bg-blue-200 dark:bg-gray-100 border border-black dark:border-gray-500">
                                    <tr>
                                        <th colSpan={2} className="px-2 py-1 text-center dark:text-black">
                                            Shipping Information
                                        </th>
                                    </tr>
                                    <tr><td colSpan={2} className="h-px border border-black dark:border-gray-500 p-0 m-0" /></tr>
                                </thead>

                                <tbody className="divide-y divide-black">
                                    <tr>
                                        <th className="px-2 py-2 text-left border-r border-black dark:border-gray-500">
                                            Transporter Name
                                        </th>
                                        <td className="px-1 py-1">
                                            <input
                                                type="text"
                                                value={transporterName}
                                                onChange={e => setTransporterName(e.target.value)}
                                                className="px-2 py-1 w-full bg-white text-sm dark:text-black"
                                                placeholder="Enter Transporter"
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <th className="px-2 py-2 text-left border-r border-black dark:border-gray-500">Vehicle No.</th>
                                        <td className="px-1 py-1">
                                            <input
                                                type="text"
                                                value={vehicleNumber}
                                                onChange={e => setVehicleNumber(e.target.value)}
                                                className="px-2 py-1 w-full bg-white text-sm dark:text-black"
                                                placeholder="Enter Vehicle No."
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <th className="px-2 py-2 text-left border-r border-black dark:border-gray-500">Driver Name</th>
                                        <td className="px-1 py-1">
                                            <input
                                                type="text"
                                                value={driverName}
                                                onChange={e => setDriverName(e.target.value)}
                                                className="px-2 py-1 w-full bg-white text-sm dark:text-black"
                                                placeholder="Enter Driver Name"
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <th className="px-2 py-2 text-left border-r border-black dark:border-gray-500">Driver Contact</th>
                                        <td className="px-1 py-1">
                                            <input
                                                type="text"
                                                value={driverContact}
                                                onChange={e => setDriverContact(e.target.value)}
                                                className="px-2 py-1 w-full bg-white text-sm dark:text-black"
                                                placeholder="Enter Driver contact"
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <th className="px-2 py-2 text-left border-r border-black dark:border-gray-500">Driver Signature</th>
                                        <td className="px-1 py-1">
                                            <input
                                                type="text"
                                                value={driverName}
                                                onChange={e => setDriverName(e.target.value)}
                                                className="px-2 py-1 w-full bg-white text-sm dark:text-black"
                                                placeholder="Enter Driver Name"
                                            />
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                    </div>
                    <hr className="border-t-2 border-black dark:border-gray-500 mb-5" />

                    {/* Sale Items Table */}
                    <div className="overflow-x-auto w-full">
                        <table className="min-w-full table-auto border-collapse text-sm">
                            <thead className="bg-blue-200 dark:bg-gray-100 border-r border-black">
                                <tr>
                                    <th className="px-2 py-2 border border-black dark:border-gray-500 dark:text-black w-15">S/No.</th>
                                    <th className="px-2 py-2 border border-black dark:border-gray-500 dark:text-black text-left w-60">Product Name</th>
                                    <th className="px-2 py-2 border border-black dark:border-gray-500 dark:text-black truncate">SKU</th>
                                    <th className="px-2 py-2 border border-black dark:border-gray-500 dark:text-black">Pack Size</th>
                                    <th className="px-2 py-2 border border-black dark:border-gray-500 dark:text-black">UoM</th>
                                    <th className="px-2 py-2 border border-black dark:border-gray-500 dark:text-black">Quantity</th>
                                    <th className="px-2 py-2 border border-black dark:border-gray-500 dark:text-black">Tonnage</th>
                                    <th className="px-2 py-2 border border-black dark:border-gray-500 dark:text-black">Price (ZMW)</th>
                                    <th className="px-2 py-2 border border-black dark:border-gray-500 dark:text-black">VAT (%)</th>
                                    <th className="px-2 py-2 border border-black dark:border-gray-500 dark:text-black w-40">Total Amount (ZMW)</th>
                                    <th className="px-2 py-2 border border-black dark:border-gray-500 dark:text-black">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide divide-black">
                                {(items.length > 0 ? items : [{} as SaleItem]).map((item, index) => (
                                    <tr key={index}>
                                        <td className="px-2 py-1 border border-black dark:border-gray-500 text-center">{index + 1}</td>
                                        <td className="px-2 py-1 border border-black dark:border-gray-500">
                                            <select
                                                value={item.productId || ""}
                                                onChange={e => updateItem(index, "productId", e.target.value)}
                                                className="w-full px-1 py-0.5 text-sm"
                                            >
                                                <option value="">Select Product</option>
                                                {products.map(p => (
                                                    <option key={p.id} value={p.id}>{p.name}</option>
                                                ))}
                                            </select>
                                        </td>
                                        <td className="px-2 py-1 border border-black dark:border-gray-500 text-center">
                                            <input value={item.sku || ""} readOnly className="w-full border-none bg-transparent text-sm text-center" />
                                        </td>
                                        <td className="px-2 py-1 border border-black dark:border-gray-500 text-center">
                                            <input value={item.packSize || ""} readOnly className="w-full border-none bg-transparent text-sm text-center" />
                                        </td>
                                        <td className="px-2 py-1 border border-black dark:border-gray-500 text-center">
                                            <input value={item.uom || "kg"} readOnly className="w-full border-none bg-transparent text-sm text-center" />
                                        </td>
                                        <td className="px-2 py-1 border border-black dark:border-gray-500 text-center">
                                            <input
                                                type="number"
                                                min={1}
                                                value={item.quantity || 1}
                                                onChange={e => updateItem(index, "quantity", +e.target.value)}
                                                className="w-full border px-1 py-0.5 rounded text-sm text-center"
                                            />
                                        </td>
                                        <td className="px-2 py-1 border border-black dark:border-gray-500 text-center">
                                            <input value={item.tonnage?.toFixed(2) || "0.00"} readOnly className="w-full border-none bg-transparent text-sm text-center" />
                                        </td>
                                        <td className="px-2 py-1 border border-black dark:border-gray-500 text-center">
                                            <input
                                                type="number"
                                                value={item.price || 0}
                                                onChange={e => updateItem(index, "price", +e.target.value)}
                                                className="w-full border px-1 py-0.5 rounded text-sm text-center"
                                            />
                                        </td>
                                        <td className="px-2 py-1 border border-black dark:border-gray-500 text-center">
                                            <input
                                                type="number"
                                                value={item.vat || defaultVAT}
                                                onChange={e => updateItem(index, "vat", +e.target.value)}
                                                className="w-full border px-1 py-0.5 rounded text-sm text-center"
                                            />
                                        </td>
                                        <td className="px-2 py-1 border border-black dark:border-gray-500 text-center">
                                            <input value={item.total?.toFixed(2) || "0.00"} readOnly className="w-full border-none bg-transparent text-sm text-center" />
                                        </td>

                                        <td className="px-2 py-1 border border-black dark:border-gray-500 text-center">
                                            <button
                                                type="button"
                                                onClick={() => removeItem(index)}
                                                className="text-red-500 text-sm font-semibold"
                                            >
                                                Remove
                                            </button>
                                        </td>
                                    </tr>
                                ))}

                                {/* Totals Row */}
                                <tr className="bg-blue-200 dark:bg-gray-100 border border-black dark:border-gray-500 font-bold">
                                    <td colSpan={5} className="px-2 py-2 text-black text-center border border-black dark:border-gray-500 dark:text-black">Totals</td>
                                    <td className="px-2 py-2 text-black text-center border border-black dark:border-gray-500 dark:text-black">{totalQuantity}</td>
                                    <td className="px-2 py-2 text-black text-center border border-black dark:border-gray-500 dark:text-black">{totalTonnage.toFixed(2)}</td>
                                    <td colSpan={2} className="px-2 py-2 border border-black dark:border-gray-500"></td>
                                    <td className="px-2 py-2 text-black text-center border border-black dark:border-gray-500 dark:text-black">
                                        {items.reduce((sum, i) => sum + i.total, 0).toFixed(2)}
                                    </td>
                                    <td className="px-2 py-2 border border-black dark:border-gray-500"></td>
                                </tr>
                            </tbody>
                        </table>

                    </div>
                    <hr className="border-t-2 border-black dark:border-gray-500 mb-5" />
                    <div className="flex items-center flex justify-center gap-10 grid-cols-3">
                        {/* Action Buttons */}

                        {/* Add Item Button */}
                        <div className="px-5 py-5">
                            <button
                                type="button"
                                onClick={addItem}
                                className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition"
                            >
                                + Add Item
                            </button>
                        </div>
                        <div className="px-5 py-5">
                            {/* Submit Button */}
                            <button
                                type="submit"
                                className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition"
                            >
                                Create Sales Order
                            </button>
                        </div>
                        <div className="px-5 py-5">
                            {/* Clear All Button */}
                            <button
                                type="button"
                                onClick={() => {
                                    const confirmClear = window.confirm(
                                        "Are you sure you want to clear all fields? This cannot be undone."
                                    );
                                    if (!confirmClear) return;

                                    setSelectedCustomer("");
                                    setDeliveryAddress("");
                                    setSelectedLocation("");
                                    setTransporterName("");
                                    setVehicleNumber("");
                                    setDriverName("");
                                    setDriverContact("");
                                    setPaymentReference("Cash");
                                    setOrderedBy("");
                                    setPreparedBy("admin");
                                    setCreatedBy("admin");
                                    setPoNumber("");
                                    setApprovedBy("");
                                    setItems([]); // clear all items
                                    setInvoiceNumber("");
                                    setDeliveryNote("");
                                }}
                                className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition mr-3"
                            >
                                Clear All Items
                            </button>
                        </div>
                    </div>
                    {invoiceNumber && deliveryNote && (
                        <div className="mt-2 text-right text-green-600 font-medium">
                            Invoice: {invoiceNumber} | Delivery Note: {deliveryNote}
                        </div>
                    )}
                    <hr className="border-t-2 border-black dark:border-gray-500 mb-5" />

                    {/* Authorizations */}
                    <div className="overflow-x-auto w-full border border-black dark:border-gray-500">
                        <div className="bg-blue-200 border border-black dark:border-gray-500">
                            <div className="flex items-center justify-center py-3 ">
                                <h1 className="font-bold my-0 leading-none">Authorisation</h1>
                            </div>
                        </div>
                        <div className="overflow-x-auto w-full border border-black dark:border-gray-500 grid grid-cols-1 grid grid-cols-3 p-5 gap-5">
                            <div className="overflow-x-auto w-full">
                                <table className="w-full text-sm border border-black dark:border-gray-500">
                                    <thead className="border border-black dark:border-gray-500">
                                        <tr className="">
                                            <th colSpan={2} className="px-2 py-1 text-center">
                                                Collected | Received By
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-black">
                                        <tr className="border border-black dark:border-gray-500">
                                            <th className="px-2 py-2 text-left border-r border-black dark:border-gray-500">
                                                Full Name
                                            </th>
                                            <td className="px-1 py-1">
                                                <input
                                                    type="text"
                                                    value={transporterName}
                                                    onChange={e => setTransporterName(e.target.value)}
                                                    className="px-2 py-1 w-full bg-white text-sm dark:text-black"
                                                    placeholder="Enter Full Name"
                                                />
                                            </td>
                                        </tr>
                                    </tbody>
                                    <tbody className="divide-y divide-black">
                                        <tr className="border border-black dark:border-gray-500">
                                            <th className="px-2 py-2 text-left border-r border-black dark:border-gray-500">
                                                Date
                                            </th>
                                            <td className="px-1 py-1">
                                                <input
                                                    type="text"
                                                    value={transporterName}
                                                    onChange={e => setTransporterName(e.target.value)}
                                                    className="px-2 py-1 w-full bg-white text-sm dark:text-black"
                                                    placeholder="Enter Date"
                                                />
                                            </td>
                                        </tr>
                                    </tbody>
                                    <tbody className="divide-y divide-black">
                                        <tr className="border border-black dark:border-gray-500">
                                            <th className="px-2 py-2 text-left border-r border-black dark:border-gray-500">
                                                Time
                                            </th>
                                            <td className="px-1 py-1">
                                                <input
                                                    type="text"
                                                    value={transporterName}
                                                    onChange={e => setTransporterName(e.target.value)}
                                                    className="px-2 py-1 w-full bg-white text-sm dark:text-black"
                                                    placeholder="Enter Time"
                                                />
                                            </td>
                                        </tr>
                                    </tbody>
                                    <tbody className="divide-y divide-black">
                                        <tr className="border border-black dark:border-gray-500">
                                            <th className="px-2 py-2 text-left border-r border-black dark:border-gray-500">
                                                Signature
                                            </th>
                                            <td className="px-1 py-1">
                                                <textarea
                                                    type="text"
                                                    className="px-1 py-1 w-full bg-white text-sm dark:text-black text-start"
                                                    placeholder="Sign here"
                                                />
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div className="overflow-x-auto w-full">
                                <table className="w-full text-sm border border-black dark:border-gray-500">
                                    <thead className="border border-black dark:border-gray-500">
                                        <tr className="">
                                            <th colSpan={2} className="px-2 py-1 text-center">
                                                Dispatched By
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody className="divide-y divide-black">
                                        <tr className="border border-black dark:border-gray-500">
                                            <th className="px-2 py-2 text-left border-r border-black dark:border-gray-500">
                                                Full Name
                                            </th>
                                            <td className="px-1 py-1">
                                                <input
                                                    type="text"
                                                    value={transporterName}
                                                    onChange={e => setTransporterName(e.target.value)}
                                                    className="px-2 py-1 w-full bg-white text-sm dark:text-black"
                                                    placeholder="Enter Full Name"
                                                />
                                            </td>
                                        </tr>
                                    </tbody>
                                    <tbody className="divide-y divide-black">
                                        <tr className="border border-black dark:border-gray-500">
                                            <th className="px-2 py-2 text-left border-r border-black dark:border-gray-500">
                                                Date
                                            </th>
                                            <td className="px-1 py-1">
                                                <input
                                                    type="text"
                                                    value={transporterName}
                                                    onChange={e => setTransporterName(e.target.value)}
                                                    className="px-2 py-1 w-full bg-white text-sm dark:text-black"
                                                    placeholder="Enter Date Dispatched"
                                                />
                                            </td>
                                        </tr>
                                    </tbody>
                                    <tbody className="divide-y divide-black">
                                        <tr className="border border-black dark:border-gray-500">
                                            <th className="px-2 py-2 text-left border-r border-black dark:border-gray-500">
                                                Time
                                            </th>
                                            <td className="px-1 py-1">
                                                <input
                                                    type="text"
                                                    value={transporterName}
                                                    onChange={e => setTransporterName(e.target.value)}
                                                    className="px-2 py-1 w-full bg-white text-sm dark:text-black"
                                                    placeholder="Enter Time"
                                                />
                                            </td>
                                        </tr>
                                    </tbody>
                                    <tbody className="divide-y divide-black">
                                        <tr className="border border-black dark:border-gray-500">
                                            <th className="px-2 py-2 text-left border-r border-black dark:border-gray-500">
                                                Signature
                                            </th>
                                            <td className="px-1 py-1">
                                                <textarea
                                                    type="text"
                                                    className="px-1 py-1 w-full bg-white text-sm dark:text-black text-start"
                                                    placeholder="Sign here"
                                                />
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div className="overflow-x-auto w-full">
                                <table className="w-full text-sm border border-black dark:border-gray-500">
                                    <thead className="border border-black dark:border-gray-500">
                                        <tr className="">
                                            <th colSpan={2} className="px-2 py-1 text-center">
                                                Authorised By
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody className="divide-y divide-black">
                                        <tr className="border border-black dark:border-gray-500">
                                            <th className="px-2 py-2 text-left border-r border-black dark:border-gray-500">
                                                Full Name
                                            </th>
                                            <td className="px-1 py-1">
                                                <input
                                                    type="text"
                                                    value={transporterName}
                                                    onChange={e => setTransporterName(e.target.value)}
                                                    className="px-2 py-1 w-full bg-white text-sm dark:text-black"
                                                    placeholder="Enter Full Name"
                                                />
                                            </td>
                                        </tr>
                                    </tbody>
                                    <tbody className="divide-y divide-black">
                                        <tr className="border border-black dark:border-gray-500">
                                            <th className="px-2 py-2 text-left border-r border-black dark:border-gray-500">
                                                Date
                                            </th>
                                            <td className="px-1 py-1">
                                                <input
                                                    type="text"
                                                    value={transporterName}
                                                    onChange={e => setTransporterName(e.target.value)}
                                                    className="px-2 py-1 w-full bg-white text-sm dark:text-black"
                                                    placeholder="Enter Date Dispatched"
                                                />
                                            </td>
                                        </tr>
                                    </tbody>
                                    <tbody className="divide-y divide-black">
                                        <tr className="border border-black dark:border-gray-500">
                                            <th className="px-2 py-2 text-left border-r border-black dark:border-gray-500">
                                                Time
                                            </th>
                                            <td className="px-1 py-1">
                                                <input
                                                    type="text"
                                                    value={transporterName}
                                                    onChange={e => setTransporterName(e.target.value)}
                                                    className="px-2 py-1 w-full bg-white text-sm dark:text-black"
                                                    placeholder="Enter Time"
                                                />
                                            </td>
                                        </tr>
                                    </tbody>
                                    <tbody className="divide-y divide-black">
                                        <tr className="border border-black dark:border-gray-500">
                                            <th className="px-2 py-2 text-left border-r border-black dark:border-gray-500">
                                                Signature
                                            </th>
                                            <td className="px-1 py-1">
                                                <textarea
                                                    type="text"
                                                    className="px-1 py-1 w-full bg-white text-sm dark:text-black text-start"
                                                    placeholder="Sign here"
                                                />
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </form>
                <div className="grid grid-cols-1 text-center ">
                    <div className="py-5">
                        <p className="text-center font-semibold text-gray-500">
                            This is a system generated Sales Order
                            please ensure you verify Products, Quantities, Prices and Total Amount.
                        </p>
                    </div>
                    <div className="">
                        <div className="text-center font-semibold justify-between gap-2">
                            It's a pleasure doing business with You.
                        </div>
                    </div>
                </div>
            </div >
        </DashboardLayout >
    );
}
