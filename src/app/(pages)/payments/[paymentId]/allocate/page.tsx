"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { formatNumber } from "@/lib/utils";
import { CheckCircleIcon } from "lucide-react";
import { useUser } from "@/app/context/UserContext";

type Payment = {
    id: string;
    amount: number;
    customer: { name: string };
    paymentDate: string;
};

type Invoice = {
    id: string;
    invoiceNumber: string;
    total: number;
    balance: number;        // real invoice balance
    allocatedNow: number;   // allocations made from this payment
    createdAt: string;
};

export default function AllocatePaymentPage({ params }: { params: Promise<{ paymentId: string }> }) {
    const user = useUser();
    const userRole = user?.role;

    const [paymentId, setPaymentId] = useState<string | null>(null);
    const [payment, setPayment] = useState<Payment | null>(null);
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [allocations, setAllocations] = useState<Record<string, string>>({});
    const [originalAllocations, setOriginalAllocations] = useState<Record<string, string>>({});
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(true);
    const [unallocatedBalance, setUnallocatedBalance] = useState<number>(0);
    const [manualEdit, setManualEdit] = useState(false);
    const [audit, setAudit] = useState<any[]>([]);
    const router = useRouter();
    const [showRollbackModal, setShowRollbackModal] = useState(false);
    const [rollbackReason, setRollbackReason] = useState("");
    const [rollbackStep, setRollbackStep] = useState<"LAST" | "ENTRY" | "ALL">("LAST");
    const [rollbackAuditId, setRollbackAuditId] = useState<string | null>(null);

    // Compute the total of new allocations input
    const newAllocated = Object.values(allocations).reduce((sum, val) => {
        const num = parseFloat(val);
        return sum + (Number.isFinite(num) ? num : 0);
    }, 0);

    const remainingUnallocated = unallocatedBalance - newAllocated;

    // Fetch payment + invoices + allocations
    const reloadPayment = async () => {
        if (!paymentId) return;
        setLoading(true);
        try {
            const res = await axios.get(`/api/payments/${paymentId}`);
            setPayment(res.data.payment);
            setInvoices(res.data.invoices);

            // HYDRATE allocations from backend truth
            const hydrated: Record<string, string> = {};
            res.data.invoices.forEach((inv: Invoice) => {
                if (inv.allocatedNow > 0) {
                    hydrated[inv.id] = inv.allocatedNow.toString();
                }
            });
            setAllocations(hydrated);
            setOriginalAllocations(hydrated);
            setManualEdit(false);

            // Update unallocated balance (actual from backend)
            setUnallocatedBalance(res.data.unallocatedBalance ?? 0);

            await reloadAudit();
        } finally {
            setLoading(false);
        }
    };

    const reloadAudit = async () => {
        if (!paymentId) return;
        const res = await axios.get(`/api/payments/${paymentId}/audit`);
        setAudit(res.data.audit);
    };

    useEffect(() => {
        params.then((p) => setPaymentId(p.paymentId));
    }, [params]);

    useEffect(() => {
        if (paymentId) reloadPayment();
    }, [paymentId]);

    const invoicesWithRemaining = useMemo(() => {
        return invoices.map((inv) => {
            const allocatedInput = parseFloat(allocations[inv.id] ?? "");
            const allocated = Number.isFinite(allocatedInput) ? allocatedInput : inv.allocatedNow;
            return { ...inv, allocatedNow: allocated, remainingBalance: inv.balance - allocated };
        });
    }, [invoices, allocations]);

    const isAnyInvoiceOverAllocated = invoicesWithRemaining.some(inv => inv.remainingBalance < 0);
    const isAllInvoicesFullyAllocated = invoicesWithRemaining.every(inv => inv.remainingBalance <= 0);

    const overrideInvoices = useMemo(() => {
        if (userRole !== "ADMIN") return new Set<string>();
        return new Set(
            invoicesWithRemaining
                .filter(inv => inv.balance <= 0 && Number(allocations[inv.id] ?? 0) > 0)
                .map(inv => inv.id)
        );
    }, [invoicesWithRemaining, allocations, userRole]);

    const changedAllocations = Object.fromEntries(
        Object.entries(allocations).filter(([id, value]) => value !== originalAllocations[id])
    );

    const saveAllocations = async () => {
        if (remainingUnallocated < 0) {
            toast.error("Allocation exceeds available balance");
            return;
        }
        if (isAnyInvoiceOverAllocated) {
            toast.error("One or more invoices exceed their balance");
            return;
        }

        setSaving(true);
        try {
            await axios.post(`/api/payments/${paymentId}/allocate`, { allocations: changedAllocations });
            toast.success("Allocations saved");
            router.push("/payments");
        } catch {
            toast.error("Failed to save allocations");
        } finally {
            setSaving(false);
        }
    };

    const rollback = async () => {
        if (!rollbackReason.trim()) {
            toast.error("Reason is required for rollback");
            return;
        }

        try {
            await axios.post(`/api/payments/${paymentId}/rollback`, {
                step: rollbackStep,
                auditId: rollbackAuditId,
                reason: rollbackReason,
            });
            toast.success("Rollback complete");
            setShowRollbackModal(false);
            setRollbackReason("");
            setRollbackAuditId(null);
            await reloadPayment();
            await reloadAudit();
        } catch {
            toast.error("Rollback failed");
        }
    };

    const filteredAudit = useMemo(() => {
        return audit; // Simplified: you can add filter dropdown if needed
    }, [audit]);

    if (loading) return <p className="p-6">Loading...</p>;
    if (!payment) return <p className="p-6">No payment found</p>;

    return (
        <div className="bg-white p-6 rounded shadow max-w-5xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Allocate Payment</h1>

            <div className="mb-4 bg-gray-50 p-4 rounded">
                <p><strong>Customer:</strong> {payment.customer.name}</p>
                <p><strong>Payment Amount:</strong> K{formatNumber(payment.amount, 2)}</p>
                <p className={remainingUnallocated < 0 ? "text-red-600" : "text-green-700"}>
                    <strong>Remaining After Allocation:</strong> K{formatNumber(remainingUnallocated, 2)}
                </p>
            </div>

            <table className="w-full border-collapse mb-4">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="border px-2 py-1 text-left">Invoice</th>
                        <th className="border px-2 py-1 text-right">Total</th>
                        <th className="border px-2 py-1 text-right">Balance</th>
                        <th className="border px-2 py-1 text-right">Allocate</th>
                    </tr>
                </thead>
                <tbody>
                    {invoicesWithRemaining.map(inv => {
                        const isFullyAllocated = inv.remainingBalance <= 0;
                        return (
                            <tr key={inv.id}>
                                <td className="border px-2 py-1 flex items-center gap-2">
                                    {inv.invoiceNumber}
                                    {isFullyAllocated && (
                                        <span className="text-green-600 flex items-center">
                                            <CheckCircleIcon className="w-4 h-4" />
                                            <span className="ml-1 text-xs">Fully Allocated</span>
                                        </span>
                                    )}
                                </td>
                                <td className="border px-2 py-1 text-right">{inv.total.toFixed(2)}</td>
                                <td className={"border px-2 py-1 text-right " + (inv.remainingBalance < 0 ? "text-red-600" : "")}>
                                    {inv.remainingBalance.toFixed(2)}
                                </td>
                                <td className="border px-2 py-1 text-right">
                                    <input
                                        type="number"
                                        min={0}
                                        max={inv.balance}
                                        value={allocations[inv.id] ?? ""}
                                        disabled={isFullyAllocated && userRole !== "ADMIN"}
                                        className="border rounded p-1 w-28 text-right"
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            const num = parseFloat(value);
                                            setManualEdit(true);
                                            if (Number.isFinite(num) && num > inv.balance) {
                                                toast.error("Cannot allocate more than invoice balance");
                                            } else {
                                                setAllocations({ ...allocations, [inv.id]: value });
                                            }
                                        }}
                                    />
                                    {overrideInvoices.has(inv.id) && (
                                        <p className="text-sm text-red-600 mt-1">⚠ Admin override</p>
                                    )}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>

            <button
                disabled={remainingUnallocated < 0 || isAnyInvoiceOverAllocated || saving}
                onClick={saveAllocations}
                className="mt-4 bg-green-600 text-white px-6 py-2 rounded disabled:opacity-50"
            >
                {saving ? "Saving..." : "Save Allocations"}
            </button>
        </div>
    );
}
