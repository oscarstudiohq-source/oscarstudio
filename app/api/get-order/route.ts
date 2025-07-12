// app/api/get-order/route.ts
import { NextRequest } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get('order_id');

    if (!orderId) {
        return new Response(JSON.stringify(null), { status: 400 });
    }

    const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('order_id', orderId)
        .single();

    if (error || !data) {
        return new Response(JSON.stringify(null), { status: 404 });
    }

    return new Response(JSON.stringify(data));
}
