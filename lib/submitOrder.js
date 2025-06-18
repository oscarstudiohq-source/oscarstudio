import { supabase } from './supabaseClient';

export const submitOrder = async (orderData) => {
    try {
        const { error } = await supabase.from('orders').insert([orderData]);

        if (error) {
            console.error("Error inserting order:", error);
            return { success: false, error };
        }

        return { success: true };
    } catch (err) {
        console.error("Unexpected error:", err);
        return { success: false, error: err };
    }
};
