"use client";
import { MapPin, User, Package, Users, UserCheck } from "lucide-react";

type View = "location" | "customer" | "product" | "salesperson" | "manager";

interface Props {
    view: View;
    setView: (view: View) => void;
}

const ViewSelector = ({ view, setView }: Props) => {
    return (
        <div className="grid gap-2 w-full grid-cols-[auto_1fr_1fr_1fr_1fr_1fr] sm:flex sm:w-auto mb-2">
            <span className="h-8 text-xs text-center p-2">View By:</span>

            <button
                className={`h-8 px-3 py-1 rounded border cursor-pointer ${view === "location" ? "bg-gray-100" : ""
                    }`}
                onClick={() => setView("location")}
            >
                <span className="flex items-center gap-1 whitespace-nowrap">
                    <MapPin className="w-3 h-3" />
                    <span className="text-xs">Location</span>
                </span>
            </button>

            <button
                className={`h-8 px-3 py-1 rounded border cursor-pointer ${view === "customer" ? "bg-gray-100" : ""
                    }`}
                onClick={() => setView("customer")}
            >
                <span className="flex items-center gap-1 whitespace-nowrap">
                    <User className="w-3 h-3" />
                    <span className="text-xs">Customer</span>
                </span>
            </button>

            <button
                className={`h-8 px-3 py-1 rounded border cursor-pointer ${view === "product" ? "bg-gray-100" : ""
                    }`}
                onClick={() => setView("product")}
            >
                <span className="flex items-center gap-1 whitespace-nowrap">
                    <Package className="w-3 h-3" />
                    <span className="text-xs">Product</span>
                </span>
            </button>

            <button
                className={`h-8 px-3 py-1 rounded border cursor-pointer ${view === "salesperson" ? "bg-gray-100" : ""
                    }`}
                onClick={() => setView("salesperson")}
            >
                <span className="flex items-center gap-1 whitespace-nowrap">
                    <Users className="w-3 h-3" />
                    <span className="text-xs">Sales Person</span>
                </span>
            </button>

            {/* ✅ MANAGER VIEW */}
            <button
                className={`h-8 px-3 py-1 rounded border cursor-pointer ${view === "manager" ? "bg-gray-100" : ""
                    }`}
                onClick={() => setView("manager")}
            >
                <span className="flex items-center gap-1 whitespace-nowrap">
                    <UserCheck className="w-3 h-3" />
                    <span className="text-xs">Manager</span>
                </span>
            </button>
        </div>
    );
};

export default ViewSelector;
