// Supabase Client Configuration
// This file initializes the Supabase client for frontend use

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

// Initialize Supabase client
let supabaseClient = null;

export const initSupabase = async () => {
    if (supabaseClient) return supabaseClient;

    if (!SUPABASE_URL || !SUPABASE_KEY) {
        console.error('Supabase credentials not configured');
        return null;
    }

    try {
        // Dynamically import Supabase client
        const { createClient } = await import('@supabase/supabase-js');
        supabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY);
        console.log('Supabase client initialized');
        return supabaseClient;
    } catch (error) {
        console.error('Failed to initialize Supabase:', error);
        return null;
    }
};

export const getSupabase = () => supabaseClient;

// Helper functions for common operations

export const insertOutage = async (outageData) => {
    const client = getSupabase();
    if (!client) throw new Error('Supabase not initialized');

    const { data, error } = await client
        .from('outages')
        .insert([outageData])
        .select();

    if (error) throw error;
    return data;
};

export const getOutages = async (filters = {}) => {
    const client = getSupabase();
    if (!client) throw new Error('Supabase not initialized');

    let query = client.from('outages').select('*');

    if (filters.status) {
        query = query.eq('status', filters.status);
    }
    if (filters.urgency) {
        query = query.eq('urgency', filters.urgency);
    }
    if (filters.limit) {
        query = query.limit(filters.limit);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
};

export const insertServiceRequest = async (requestData) => {
    const client = getSupabase();
    if (!client) throw new Error('Supabase not initialized');

    const { data, error } = await client
        .from('service_requests')
        .insert([requestData])
        .select();

    if (error) throw error;
    return data;
};

export const getServiceRequests = async (filters = {}) => {
    const client = getSupabase();
    if (!client) throw new Error('Supabase not initialized');

    let query = client.from('service_requests').select('*');

    if (filters.status) {
        query = query.eq('status', filters.status);
    }
    if (filters.service_type) {
        query = query.eq('service_type', filters.service_type);
    }
    if (filters.limit) {
        query = query.limit(filters.limit);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
};

export const getAnnouncements = async () => {
    const client = getSupabase();
    if (!client) throw new Error('Supabase not initialized');

    const { data, error } = await client
        .from('announcement1')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
};

export const uploadFile = async (bucket, path, file) => {
    const client = getSupabase();
    if (!client) throw new Error('Supabase not initialized');

    const { data, error } = await client.storage
        .from(bucket)
        .upload(path, file);

    if (error) throw error;
    return data;
};

export const getPublicUrl = (bucket, path) => {
    const client = getSupabase();
    if (!client) throw new Error('Supabase not initialized');

    const { data } = client.storage
        .from(bucket)
        .getPublicUrl(path);

    return data.publicUrl;
};
