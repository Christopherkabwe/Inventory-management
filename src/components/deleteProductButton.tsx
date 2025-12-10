"use client";

import { useActionState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { deleteProduct } from "@/lib/actions/products";

export default function DeleteProductButton({ id }: { id: string }) {
    const [state, dispatch] = useActionState(deleteProduct, { message: null, success: false });

    useEffect(() => {
        if (state.message) {
            if (state.success) {
                toast.success(state.message);
            } else {
                toast.error(state.message);
            }
        }
    }, [state]);

    return (
        <form action={dispatch}>
            <input type="hidden" name="id" value={id} />
            <button className="text-red-600 hover:text-red-700" type="submit">
                Delete
            </button>
        </form>
    );
}