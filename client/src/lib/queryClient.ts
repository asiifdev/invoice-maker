// client/src/lib/queryClient.ts
import { QueryClient } from '@tanstack/react-query';
import { supabase } from './supabase'; // Impor instance supabase untuk mendapatkan session token

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

// Default fetcher for react-query
export const apiRequest = async (url: string, options?: RequestInit) => {
  const { data: { session } } = await supabase.auth.getSession(); // Dapatkan sesi pengguna
  const accessToken = session?.access_token; // Dapatkan access token

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY, // Tambahkan Supabase Anon Key
  };

  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`; // Tambahkan Authorization header jika ada token
  }
  
  const response = await fetch(url, {
    headers: {
      ...headers, // Gunakan headers yang sudah kita buat
      ...options?.headers, // Gabungkan dengan headers opsional dari pemanggil
    },
    ...options,
  });

  if (!response.ok) {
    // Coba parse error response jika ada
    let errorMessage = `HTTP error! status: ${response.status}`;
    try {
      const errorBody = await response.json();
      if (errorBody && errorBody.message) {
        errorMessage += ` - ${errorBody.message}`;
      }
    } catch (e) {
      // Ignore if parsing fails
    }
    throw new Error(errorMessage);
  }

  return response.json();
};

// Set up default query function
queryClient.setDefaultOptions({
  queries: {
    queryFn: ({ queryKey }) => {
      const [url] = queryKey as [string];
      // Pastikan `url` yang digunakan di sini adalah URL API Anda sendiri
      // atau jika itu URL Supabase PostgREST langsung, maka `apiRequest` harus menangani headers.
      return apiRequest(url);
    },
  },
});