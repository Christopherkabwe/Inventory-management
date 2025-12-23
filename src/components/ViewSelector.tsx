"use client";
import { MapPin, User, Package } from "lucide-react";

interface Props {
    view: string;
    setView: (view: string) => void;
}

const ViewSelector = ({ view, setView }: Props) => {
    return (

        <div className="flex gap-4 flex-wrap mb-4">
            <h2 className="px-3 py-1 text-center font-semibold mt-1 mb-1">View Sales By :</h2>
            <button
                className={`px-3 py-1 rounded border cursor-pointer ${view === "location" ? "bg-gray-100" : ""
                    }`}
                onClick={() => setView("location")}
            >
                <MapPin className="inline w-4 h-4 mr-1" /> Location
            </button>
            <button
                className={`px-3 py-1 rounded border cursor-pointer ${view === "customer" ? "bg-gray-100" : ""
                    }`}
                onClick={() => setView("customer")}
            >
                <User className="inline w-4 h-4 mr-1" /> Customer
            </button>
            <button
                className={`px-3 py-1 rounded border cursor-pointer ${view === "product" ? "bg-gray-100" : ""
                    }`}
                onClick={() => setView("product")}
            >
                <Package className="inline w-4 h-4 mr-1" /> Product
            </button>
            <div className="border-b border-gray-300"></div>
        </div>


    );
};

export default ViewSelector;