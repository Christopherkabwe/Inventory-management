"use client";
import React, { useState, useRef } from "react";
import {
    PDFDownloadLink,
    Document,
    Page,
    Text,
    View,
    StyleSheet,
    Font,
    Image,
} from "@react-pdf/renderer";
import { useReactToPrint } from "react-to-print";

// Register font (you would need to load your actual font files)
Font.register({
    family: "Roboto",
    fonts: [
        {
            src: "https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Mu4mxP.ttf",
            fontWeight: 400,
        },
        {
            src: "https://fonts.gstatic.com/s/roboto/v30/KFOlCnqEu92Fr1MmEU9fBBc9.ttf",
            fontWeight: 700,
        },
    ],
});

// Define styles for PDF
const pdfStyles = StyleSheet.create({
    page: {
        fontFamily: "Roboto",
        padding: 40,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 30,
    },
    logo: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 4,
    },
    slogan: {
        fontSize: 12,
        color: "#555",
    },
    invoiceTitle: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#333",
    },
    section: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: "bold",
        marginBottom: 8,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
        paddingBottom: 4,
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 8,
    },
    label: {
        fontSize: 10,
        color: "#777",
    },
    value: {
        fontSize: 10,
        fontWeight: "bold",
    },
    tableHeader: {
        flexDirection: "row",
        borderBottomWidth: 1,
        borderBottomColor: "#000",
        paddingBottom: 8,
        marginBottom: 8,
    },
    tableRow: {
        flexDirection: "row",
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
        paddingBottom: 8,
        marginBottom: 8,
    },
    colNo: { width: "10%" },
    colDesc: { width: "40%" },
    colQty: { width: "15%", textAlign: "right" },
    colPrice: { width: "15%", textAlign: "right" },
    colTotal: { width: "20%", textAlign: "right" },
    totals: {
        flexDirection: "row",
        justifyContent: "flex-end",
        marginTop: 20,
    },
    totalsBox: {
        width: "40%",
    },
    totalRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 6,
    },
    grandTotal: {
        fontSize: 14,
        fontWeight: "bold",
        marginTop: 10,
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopColor: "#000",
    },
    footer: {
        marginTop: 40,
        fontSize: 10,
        textAlign: "center",
        color: "#777",
    },
});

// PDF Document Component
const InvoicePDF = ({ invoiceData }: { invoiceData: InvoiceData }) => (
    <Document>
        <Page size="A4" style={pdfStyles.page}>
            <View style={pdfStyles.header}>
                <View>
                    <Text style={pdfStyles.logo}>{invoiceData.logo}</Text>
                    <Text style={pdfStyles.slogan}>{invoiceData.slogan}</Text>
                </View>
                <View>
                    <Text style={pdfStyles.invoiceTitle}>INVOICE</Text>
                </View>
            </View>

            <View
                style={[
                    pdfStyles.section,
                    { flexDirection: "row", justifyContent: "space-between" },
                ]}
            >
                <View style={{ width: "48%" }}>
                    <Text style={pdfStyles.sectionTitle}>Seller Information</Text>
                    <Text style={pdfStyles.value}>{invoiceData.companyName}</Text>
                    <Text style={pdfStyles.value}>{invoiceData.companyAddress}</Text>
                    <Text style={pdfStyles.value}>Phone: {invoiceData.companyPhone}</Text>
                    <Text style={pdfStyles.value}>Email: {invoiceData.companyEmail}</Text>
                </View>

                <View style={{ width: "48%" }}>
                    <Text style={pdfStyles.sectionTitle}>Bill To</Text>
                    <Text style={pdfStyles.value}>{invoiceData.clientCompanyName}</Text>
                    <Text style={pdfStyles.value}>
                        Attn: {invoiceData.clientContactPerson}
                    </Text>
                    <Text style={pdfStyles.value}>{invoiceData.clientLocation}</Text>
                    <Text style={pdfStyles.value}>Phone: {invoiceData.clientPhone}</Text>
                    <Text style={pdfStyles.value}>
                        Due Date: {invoiceData.invoiceDueDate}
                    </Text>
                </View>
            </View>

            <View style={pdfStyles.section}>
                <Text style={pdfStyles.sectionTitle}>Invoice Items</Text>
                <View style={pdfStyles.tableHeader}>
                    <Text style={pdfStyles.colNo}>NO.</Text>
                    <Text style={pdfStyles.colDesc}>PRODUCT/SERVICE</Text>
                    <Text style={pdfStyles.colQty}>QTY</Text>
                    <Text style={pdfStyles.colPrice}>UNIT PRICE</Text>
                    <Text style={pdfStyles.colTotal}>TOTAL</Text>
                </View>

                {invoiceData.items.map((item, index) => (
                    <View key={index} style={pdfStyles.tableRow}>
                        <Text style={pdfStyles.colNo}>{index + 1}</Text>
                        <Text style={pdfStyles.colDesc}>{item.description}</Text>
                        <Text style={pdfStyles.colQty}>{item.quantity}</Text>
                        <Text style={pdfStyles.colPrice}>
                            $ {item.unitPrice.toFixed(2)}
                        </Text>
                        <Text style={pdfStyles.colTotal}>$ {item.amount.toFixed(2)}</Text>
                    </View>
                ))}
            </View>

            <View style={pdfStyles.totals}>
                <View style={pdfStyles.totalsBox}>
                    <View style={pdfStyles.totalRow}>
                        <Text>Subtotal:</Text>
                        <Text>$ {invoiceData.subtotal.toFixed(2)}</Text>
                    </View>
                    <View style={pdfStyles.totalRow}>
                        <Text>Tax ({invoiceData.taxRate}%):</Text>
                        <Text>$ {invoiceData.salesTax.toFixed(2)}</Text>
                    </View>
                    <View style={pdfStyles.totalRow}>
                        <Text>Discount:</Text>
                        <Text>$ 0.00</Text>
                    </View>
                    <View style={pdfStyles.grandTotal}>
                        <Text>TOTAL DUE:</Text>
                        <Text>$ {invoiceData.total.toFixed(2)}</Text>
                    </View>
                </View>
            </View>

            <View style={pdfStyles.section}>
                <Text style={pdfStyles.sectionTitle}>Payment Information</Text>
                <Text>{invoiceData.paymentInstructions}</Text>
            </View>

            <View style={pdfStyles.footer}>
                <Text>{invoiceData.thankYouMessage}</Text>
                <Text>
                    {invoiceData.companyName} | {invoiceData.companyAddress}
                </Text>
                <Text>
                    Phone: {invoiceData.companyPhone} | Email: {invoiceData.companyEmail}
                </Text>
            </View>
        </Page>
    </Document>
);

interface InvoiceItem {
    description: string;
    quantity: number;
    unitPrice: number;
    taxable: boolean;
    amount: number;
}

interface InvoiceData {
    logo: string;
    slogan: string;
    companyName: string;
    companyAddress: string;
    companyPhone: string;
    companyEmail: string;
    clientContactPerson: string;
    clientCompanyName: string;
    clientLocation: string;
    clientPhone: string;
    invoiceDueDate: string;
    items: InvoiceItem[];
    subtotal: number;
    taxRate: number;
    salesTax: number;
    total: number;
    paymentInstructions: string;
    contactInstructions: string;
    thankYouMessage: string;
}

const InvoiceOne: React.FC = () => {
    const [editMode, setEditMode] = useState(false);
    const [showEmailModal, setShowEmailModal] = useState(false);
    const [emails, setEmails] = useState("");
    const invoiceRef = useRef<HTMLDivElement>(null);

    const [invoiceData, setInvoiceData] = useState<InvoiceData>({
        logo: "DESISHUB",
        slogan: "Leveraging Technology",
        companyName: "DESISHUB",
        companyAddress: "Company Address",
        companyPhone: "0762063160 | 0756384580",
        companyEmail: "info@desishub.com",
        clientContactPerson: "Mary Awalith",
        clientCompanyName: "CODELABS CO. LTD",
        clientLocation: "South Sudan",
        clientPhone: "922031601",
        invoiceDueDate: "22/5/2025",
        items: [
            {
                description:
                    "Payment for Backend Development of a Shipment and Tracking Web application",
                quantity: 1,
                unitPrice: 300,
                taxable: false,
                amount: 300,
            },
        ],
        subtotal: 300,
        taxRate: 0,
        salesTax: 0,
        total: 300,
        paymentInstructions:
            "All dues are Payable to Desishub through Cash or MTN MOMO 0762 063 160",
        contactInstructions:
            "If you have any questions concerning this Invoice, please contact:\nCall or Whatsapp: 0762063160 | 0756384580",
        thankYouMessage: "Thank you for your business!",
    });

    const handlePrint = useReactToPrint({
        contentRef: invoiceRef,
    });

    const handleSendEmail = () => {
        console.log("Sending invoice to:", emails);
        setShowEmailModal(false);
        setEmails("");
    };

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setInvoiceData({
            ...invoiceData,
            [name]: value,
        });
    };

    const handleItemChange = (
        index: number,
        field: keyof InvoiceItem,
        value: string | boolean | number
    ) => {
        const newItems = [...invoiceData.items];
        newItems[index] = {
            ...newItems[index],
            [field]:
                field === "taxable"
                    ? Boolean(value)
                    : field === "quantity" || field === "unitPrice" || field === "amount"
                        ? Number(value)
                        : value,
        };

        // Recalculate amount based on quantity and unit price
        if (field === "quantity" || field === "unitPrice") {
            newItems[index].amount =
                newItems[index].quantity * newItems[index].unitPrice;
        }

        const subtotal = newItems.reduce((sum, item) => sum + item.amount, 0);
        const salesTax = subtotal * (invoiceData.taxRate / 100);
        const total = subtotal + salesTax;

        setInvoiceData({
            ...invoiceData,
            items: newItems,
            subtotal,
            salesTax,
            total,
        });
    };

    const addNewItem = () => {
        setInvoiceData({
            ...invoiceData,
            items: [
                ...invoiceData.items,
                {
                    description: "",
                    quantity: 1,
                    unitPrice: 0,
                    taxable: false,
                    amount: 0,
                },
            ],
        });
    };

    const removeItem = (index: number) => {
        const newItems = invoiceData.items.filter((_, i) => i !== index);
        const subtotal = newItems.reduce((sum, item) => sum + item.amount, 0);
        const salesTax = subtotal * (invoiceData.taxRate / 100);
        const total = subtotal + salesTax;

        setInvoiceData({
            ...invoiceData,
            items: newItems,
            subtotal,
            salesTax,
            total,
        });
    };

    const submitForm = () => {
        console.log("Invoice Data:", invoiceData);
        setEditMode(false);
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">
                        Invoice Generator
                    </h1>
                    <div className="flex space-x-2">
                        {!editMode && (
                            <>
                                <button
                                    onClick={handlePrint}
                                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                                >
                                    Print
                                </button>
                                <PDFDownloadLink
                                    document={<InvoicePDF invoiceData={invoiceData} />}
                                    fileName="invoice.pdf"
                                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                                >
                                    {({ loading }) => (loading ? "Preparing..." : "Download PDF")}
                                </PDFDownloadLink>
                                <button
                                    onClick={() => setShowEmailModal(true)}
                                    className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
                                >
                                    Send Via Mail
                                </button>
                            </>
                        )}
                        <button
                            onClick={() => setEditMode(!editMode)}
                            className={`px-4 py-2 ${editMode
                                ? "bg-gray-600 hover:bg-gray-700"
                                : "bg-yellow-600 hover:bg-yellow-700"
                                } text-white rounded transition`}
                        >
                            {editMode ? "Preview" : "Edit Mode"}
                        </button>
                    </div>
                </div>

                {editMode ? (
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold mb-6">Edit Invoice</h2>

                        {/* Branding Card */}
                        <div className="bg-gray-50 p-4 rounded-lg mb-6">
                            <h3 className="font-medium text-lg mb-3 text-gray-700">
                                Branding
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Logo/Company Name
                                    </label>
                                    <input
                                        type="text"
                                        name="logo"
                                        value={invoiceData.logo}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Slogan
                                    </label>
                                    <input
                                        type="text"
                                        name="slogan"
                                        value={invoiceData.slogan}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Company Details Card */}
                        <div className="bg-gray-50 p-4 rounded-lg mb-6">
                            <h3 className="font-medium text-lg mb-3 text-gray-700">
                                Company Details
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Company Name
                                    </label>
                                    <input
                                        type="text"
                                        name="companyName"
                                        value={invoiceData.companyName}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Company Address
                                    </label>
                                    <input
                                        type="text"
                                        name="companyAddress"
                                        value={invoiceData.companyAddress}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Phone
                                    </label>
                                    <input
                                        type="text"
                                        name="companyPhone"
                                        value={invoiceData.companyPhone}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        name="companyEmail"
                                        value={invoiceData.companyEmail}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Client Details Card */}
                        <div className="bg-gray-50 p-4 rounded-lg mb-6">
                            <h3 className="font-medium text-lg mb-3 text-gray-700">
                                Client Details
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Contact Person
                                    </label>
                                    <input
                                        type="text"
                                        name="clientContactPerson"
                                        value={invoiceData.clientContactPerson}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Company Name
                                    </label>
                                    <input
                                        type="text"
                                        name="clientCompanyName"
                                        value={invoiceData.clientCompanyName}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Location
                                    </label>
                                    <input
                                        type="text"
                                        name="clientLocation"
                                        value={invoiceData.clientLocation}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Phone
                                    </label>
                                    <input
                                        type="text"
                                        name="clientPhone"
                                        value={invoiceData.clientPhone}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Due Date
                                    </label>
                                    <input
                                        type="text"
                                        name="invoiceDueDate"
                                        value={invoiceData.invoiceDueDate}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Invoice Items Card */}
                        <div className="bg-gray-50 p-4 rounded-lg mb-6">
                            <div className="flex justify-between items-center mb-3">
                                <h3 className="font-medium text-lg text-gray-700">
                                    Invoice Items
                                </h3>
                                <button
                                    onClick={addNewItem}
                                    className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                                >
                                    + Add Item
                                </button>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-100">
                                        <tr>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                #
                                            </th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Description
                                            </th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Qty
                                            </th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Unit Price
                                            </th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Taxable
                                            </th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Amount
                                            </th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {invoiceData.items.map((item, index) => (
                                            <tr key={index}>
                                                <td className="px-4 py-2 whitespace-nowrap">
                                                    {index + 1}
                                                </td>
                                                <td className="px-4 py-2">
                                                    <input
                                                        type="text"
                                                        value={item.description}
                                                        onChange={(e) =>
                                                            handleItemChange(
                                                                index,
                                                                "description",
                                                                e.target.value
                                                            )
                                                        }
                                                        className="w-full p-1 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                                                    />
                                                </td>
                                                <td className="px-4 py-2">
                                                    <input
                                                        type="number"
                                                        value={item.quantity}
                                                        onChange={(e) =>
                                                            handleItemChange(
                                                                index,
                                                                "quantity",
                                                                e.target.value
                                                            )
                                                        }
                                                        min="1"
                                                        className="w-full p-1 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                                                    />
                                                </td>
                                                <td className="px-4 py-2">
                                                    <input
                                                        type="number"
                                                        value={item.unitPrice}
                                                        onChange={(e) =>
                                                            handleItemChange(
                                                                index,
                                                                "unitPrice",
                                                                e.target.value
                                                            )
                                                        }
                                                        className="w-full p-1 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                                                    />
                                                </td>
                                                <td className="px-4 py-2">
                                                    <input
                                                        type="checkbox"
                                                        checked={item.taxable}
                                                        onChange={(e) =>
                                                            handleItemChange(
                                                                index,
                                                                "taxable",
                                                                e.target.checked
                                                            )
                                                        }
                                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                                    />
                                                </td>
                                                <td className="px-4 py-2 whitespace-nowrap">
                                                    $ {item.amount.toFixed(2)}
                                                </td>
                                                <td className="px-4 py-2 whitespace-nowrap">
                                                    <button
                                                        onClick={() => removeItem(index)}
                                                        className="text-red-600 hover:text-red-800"
                                                    >
                                                        Remove
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Totals Card */}
                        <div className="bg-gray-50 p-4 rounded-lg mb-6">
                            <h3 className="font-medium text-lg mb-3 text-gray-700">Totals</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Tax Rate (%)
                                    </label>
                                    <input
                                        type="number"
                                        value={invoiceData.taxRate}
                                        onChange={(e) => {
                                            const taxRate = Number(e.target.value);
                                            const salesTax = invoiceData.subtotal * (taxRate / 100);
                                            setInvoiceData({
                                                ...invoiceData,
                                                taxRate,
                                                salesTax,
                                                total: invoiceData.subtotal + salesTax,
                                            });
                                        }}
                                        className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Sales Tax ($)
                                    </label>
                                    <input
                                        type="text"
                                        value={invoiceData.salesTax.toFixed(2)}
                                        readOnly
                                        className="w-full p-2 border border-gray-300 rounded bg-gray-100"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Total ($)
                                    </label>
                                    <input
                                        type="text"
                                        value={invoiceData.total.toFixed(2)}
                                        readOnly
                                        className="w-full p-2 border border-gray-300 rounded bg-gray-100"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Messages Card */}
                        <div className="bg-gray-50 p-4 rounded-lg mb-6">
                            <h3 className="font-medium text-lg mb-3 text-gray-700">
                                Messages
                            </h3>
                            <div className="grid grid-cols-1 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Payment Instructions
                                    </label>
                                    <textarea
                                        name="paymentInstructions"
                                        value={invoiceData.paymentInstructions}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                                        rows={2}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Contact Instructions
                                    </label>
                                    <textarea
                                        name="contactInstructions"
                                        value={invoiceData.contactInstructions}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                                        rows={3}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Thank You Message
                                    </label>
                                    <input
                                        type="text"
                                        name="thankYouMessage"
                                        value={invoiceData.thankYouMessage}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <button
                                onClick={submitForm}
                                className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                ) : (
                    <div ref={invoiceRef} className="bg-white p-8 rounded-lg shadow-md">
                        <div className="mb-8">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-800">
                                        {invoiceData.logo}
                                    </h1>
                                    <p className="text-gray-600">{invoiceData.slogan}</p>
                                </div>
                                <div className="text-right">
                                    <h2 className="text-2xl font-bold text-gray-700 mb-4">
                                        INVOICE
                                    </h2>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                            <div>
                                <h3 className="text-sm font-semibold text-gray-500 mb-2">
                                    Seller Information
                                </h3>
                                <p className="font-medium">{invoiceData.companyName}</p>
                                <p>{invoiceData.companyAddress}</p>
                                <p>Phone: {invoiceData.companyPhone}</p>
                                <p>Email: {invoiceData.companyEmail}</p>
                            </div>

                            <div className="bg-gray-50 p-4 rounded">
                                <h3 className="text-sm font-semibold text-gray-500 mb-2">
                                    Bill To
                                </h3>
                                <p>
                                    <span className="font-medium">Company:</span>{" "}
                                    {invoiceData.clientCompanyName}
                                </p>
                                <p>
                                    <span className="font-medium">Attn:</span>{" "}
                                    {invoiceData.clientContactPerson}
                                </p>
                                <p>
                                    <span className="font-medium">Location:</span>{" "}
                                    {invoiceData.clientLocation}
                                </p>
                                <p>
                                    <span className="font-medium">Phone:</span>{" "}
                                    {invoiceData.clientPhone}
                                </p>
                                <p className="mt-2">
                                    <span className="font-medium">Due Date:</span>{" "}
                                    {invoiceData.invoiceDueDate}
                                </p>
                            </div>
                        </div>

                        <div className="mb-8">
                            <div className="border-t border-b border-gray-200 py-2">
                                <h3 className="font-semibold">Invoice Items</h3>
                            </div>
                            <table className="w-full mt-4">
                                <thead>
                                    <tr className="border-b border-gray-200 text-left">
                                        <th className="pb-2">NO.</th>
                                        <th className="pb-2">PRODUCT/SERVICE</th>
                                        <th className="pb-2 text-right">QTY</th>
                                        <th className="pb-2 text-right">UNIT PRICE</th>
                                        <th className="pb-2 text-right">TOTAL</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {invoiceData.items.map((item, index) => (
                                        <tr key={index} className="border-b border-gray-100">
                                            <td className="py-3">{index + 1}</td>
                                            <td className="py-3">{item.description}</td>
                                            <td className="text-right">{item.quantity}</td>
                                            <td className="text-right">
                                                $ {item.unitPrice.toFixed(2)}
                                            </td>
                                            <td className="text-right">$ {item.amount.toFixed(2)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="flex justify-end">
                            <div className="w-64">
                                <div className="flex justify-between py-2 border-b border-gray-200">
                                    <span>Subtotal</span>
                                    <span>$ {invoiceData.subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between py-2 border-b border-gray-200">
                                    <span>Tax ({invoiceData.taxRate}%)</span>
                                    <span>$ {invoiceData.salesTax.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between py-2 border-b border-gray-200">
                                    <span>Discount</span>
                                    <span>$ 0.00</span>
                                </div>
                                <div className="flex justify-between py-2 font-bold text-lg">
                                    <span>TOTAL DUE</span>
                                    <span>$ {invoiceData.total.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 text-sm text-gray-600 whitespace-pre-line">
                            <p className="font-medium mb-2">Payment Information:</p>
                            <p>{invoiceData.paymentInstructions}</p>
                            <p className="mt-4">{invoiceData.contactInstructions}</p>
                        </div>

                        <div className="mt-12 text-center text-gray-500">
                            <p>{invoiceData.thankYouMessage}</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Email Modal */}
            {showEmailModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <h3 className="text-xl font-semibold mb-4">
                            Send Invoice via Email
                        </h3>
                        <div className="mb-4">
                            <label className="block text-sm text-gray-600 mb-2">
                                Recipient Emails (comma separated)
                            </label>
                            <textarea
                                value={emails}
                                onChange={(e) => setEmails(e.target.value)}
                                className="w-full p-2 border rounded"
                                rows={4}
                                placeholder="email1@example.com, email2@example.com"
                            />
                        </div>
                        <div className="flex justify-end space-x-2">
                            <button
                                onClick={() => setShowEmailModal(false)}
                                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSendEmail}
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                            >
                                Send
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InvoiceOne;

