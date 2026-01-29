"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { formatNumber } from "@/lib/utils";
import { ArrowLeft, CheckCircleIcon } from "lucide-react";
import { useUser } from "@/app/context/UserContext";
import Link from "next/link";
import { Dropdown } from "@/components/SingleSelectComboBox/GenericDropdown";

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
    balance: number;
    allocatedNow: number;
    allocatedAmount: number;
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
    const [auditFilter, setAuditFilter] = useState<"ALL" | "ALLOCATE" | "ROLLBACK" | "UPDATE">("ALL");
    const [rollbackAuditId, setRollbackAuditId] = useState<string | null>(null);
    const [allocatedInvoices, setAllocatedInvoices] = useState<Invoice[]>([]);

    const remainingUnallocated = unallocatedBalance;

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
            setAllocatedInvoices(res.data.allocatedInvoices);
            console.log(res.data.allocatedInvoices);

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
            const remaining = inv.balance - allocated;
            return {
                ...inv,
                allocatedNow: allocated,
                remainingBalance: Math.max(0, remaining), // never negative for display
                isAdminOverridden: remaining < 0,        // flag to highlight admin overrides
            };
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
        if (auditFilter === "ALL") return audit;
        return audit.filter(a => a.action === auditFilter);
    }, [audit, auditFilter]);

    if (loading) return <p className="p-6">Loading...</p>;
    if (!payment) return <p className="p-6">No payment found</p>;

    return (
        <div className="">
            <div className="mb-4">
                <Link
                    className="inline-flex items-center gap-2 text-sm cursor-pointer font-medium text-zinc-600 hover:text-zinc-900"
                    href="/payments"
                >
                    <ArrowLeft className="h-4 w-4" /> Back
                </Link>
            </div>
            <div className="bg-white p-5 rounded shadow max-w-5xl mx-auto">
                <h1 className="text-2xl font-bold mb-4">Allocate Payment</h1>

                <div className="mb-4 bg-gray-50 p-4 rounded">
                    <p><strong>Customer:</strong> {payment.customer.name}</p>
                    <p><strong>Payment Amount:</strong> K{formatNumber(payment.amount, 2)}</p>
                    <p className={remainingUnallocated < 0 ? "text-red-600" : "text-green-700"}>
                        <strong>Unallocated Amount:</strong> K{formatNumber(remainingUnallocated, 2)}
                    </p>
                </div>
                <div className="mb-5">
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
                                const isFullyAllocated = inv.remainingBalance <= 0 && !inv.forceShow;
                                return (
                                    <tr key={inv.id}>
                                        <td className="border px-2 py-1  gap-2">
                                            <div className="flex items-center">
                                                {inv.invoiceNumber}
                                                {isFullyAllocated && (
                                                    <span className="text-green-600 flex items-center">
                                                        <CheckCircleIcon className="w-4 h-4" />
                                                        <span className="ml-1 text-xs">Fully Allocated</span>
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="border px-2 py-1 text-right">{inv.total.toFixed(2)}</td>
                                        <td
                                            className={
                                                "border px-2 py-1 text-right " +
                                                (inv.isAdminOverridden ? "text-red-600" : inv.remainingBalance < 0 ? "text-red-600" : "")
                                            }
                                        >
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
                <div className="mb-5">
                    <h2 className="text-lg font-bold mb-2">Invoices Allocated From This Payment</h2>
                    <table className="w-full border-collapse">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="border px-2 py-1 text-left">Invoice</th>
                                <th className="border px-2 py-1 text-right">Total</th>
                                <th className="border px-2 py-1 text-right">Allocated Amount</th>
                                <th className="border px-2 py-1 text-right">Remaining Balance</th>
                            </tr>
                        </thead>
                        <tbody>
                            {allocatedInvoices?.map(inv => (
                                <tr key={inv.id} className="hover:bg-gray-50">
                                    <td className="border px-2 py-1">{inv.invoiceNumber}</td>
                                    <td className="border px-2 py-1 text-right">{inv.total.toFixed(2)}</td>
                                    <td className="border px-2 py-1 text-right text-blue-600">{inv.allocatedAmount.toFixed(2)}</td>
                                    <td className="border px-2 py-1 text-right">{(inv.balance - inv.allocatedAmount).toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="">
                    <div className="gap-5">
                        <h2 className="text-lg font-bold mb-2">Audit Trail</h2>
                        <div className="flex justify-end mb-3">
                            <Dropdown
                                label=""
                                value={auditFilter}
                                onChange={(val) =>
                                    setAuditFilter(val as "ALL" | "ALLOCATE" | "ROLLBACK" | "UPDATE")
                                }
                                items={[
                                    { id: "ALL", label: "All" },
                                    { id: "ALLOCATE", label: "Allocate" },
                                    { id: "ROLLBACK", label: "Rollback" },
                                    { id: "UPDATE", label: "Update" },
                                ]}
                            />
                        </div>
                    </div>

                    <table className="w-full border-collapse">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="border px-2 py-1 text-left">Action</th>
                                <th className="border px-2 py-1 text-left">Invoice</th>
                                <th className="border px-2 py-1 text-right">Old Amount</th>
                                <th className="border px-2 py-1 text-right">New Amount</th>
                                <th className="border px-2 py-1 text-left">Created By</th>
                                <th className="border px-2 py-1 text-left">Date</th>
                                <th className="border px-2 py-1 text-left">Reason</th>
                                {userRole === "ADMIN" && <th className="border px-2 py-1 text-center">Rollback</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {filteredAudit.length === 0 ? (
                                <tr>
                                    <td colSpan={userRole === "ADMIN" ? 8 : 7} className="border px-2 py-2 text-center text-gray-500">
                                        No audit records found
                                    </td>
                                </tr>
                            ) : (
                                filteredAudit.map((a) => (
                                    <tr key={a.id} className="hover:bg-gray-50">
                                        <>
                                            <td className="border px-2 py-1">{a.action}</td>
                                            <td className="border px-2 py-1">{a.invoiceNumber || "-"}</td>
                                            <td className="border px-2 py-1 text-right">{Number(a.oldAmount).toFixed(2)}</td>
                                            <td className="border px-2 py-1 text-right">{Number(a.newAmount).toFixed(2)}</td>
                                            <td className="border px-2 py-1">{a.createdByName}</td>
                                            <td className="border px-2 py-1">{new Date(a.createdAt).toLocaleString()}</td>
                                            <td className="border px-2 py-1">{a.reason || "-"}</td>
                                            <td className="border px-2 py-1 text-center">
                                                {userRole === "ADMIN" && (
                                                    <button
                                                        className="px-3 py-1 rounded bg-yellow-400"
                                                        onClick={() => {
                                                            setRollbackStep("ENTRY");
                                                            setRollbackAuditId(a.id);
                                                            setShowRollbackModal(true);
                                                        }}
                                                    >
                                                        Rollback
                                                    </button>
                                                )}
                                            </td>
                                        </>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                {userRole === "ADMIN" && (
                    <div className="flex gap-4 mt-6">
                        <button
                            className="bg-yellow-500 text-white px-4 py-2 rounded"
                            onClick={() => {
                                setRollbackStep("LAST");
                                setRollbackAuditId(null);
                                setShowRollbackModal(true);
                            }}
                        >
                            Rollback Last Allocation
                        </button>

                        <button
                            className="bg-red-600 text-white px-4 py-2 rounded"
                            onClick={() => {
                                setRollbackStep("ALL");
                                setRollbackAuditId(null);
                                setShowRollbackModal(true);
                            }}
                        >
                            Rollback ALL Allocations
                        </button>
                    </div>
                )}

                {showRollbackModal && (
                    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                        <div className="bg-white rounded p-6 w-full max-w-md shadow-lg">
                            <h2 className="text-lg font-semibold mb-2">Rollback Allocation</h2>

                            <p className="text-sm text-gray-600 mb-4">
                                This action will revert allocation changes. Please provide a reason.
                            </p>

                            <textarea
                                className="w-full border rounded p-2 mb-4"
                                rows={4}
                                value={rollbackReason}
                                onChange={(e) => setRollbackReason(e.target.value)}
                                placeholder="Reason for rollback..."
                            />

                            <div className="flex justify-end gap-3">
                                <button
                                    className="px-4 py-2 rounded border"
                                    onClick={() => setShowRollbackModal(false)}
                                >
                                    Cancel
                                </button>

                                <button
                                    className="px-4 py-2 rounded bg-red-600 text-white"
                                    onClick={rollback}
                                >
                                    Confirm Rollback
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
