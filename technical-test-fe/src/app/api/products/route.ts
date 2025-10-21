import { NextResponse, NextRequest } from 'next/server';
import axios from 'axios';

export async function GET(request: NextRequest) {
  try {
    // Ambil query params dari URL
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const page = searchParams.get('page');
    const limit = searchParams.get('limit');
    
    // Ambil Authorization header dari request
    const authHeader = request.headers.get('authorization');
    
    // Siapkan params untuk axios
    const axiosParams: { search?: string; page?: string; limit?: string } = {};
    if (search) {
      axiosParams.search = search;
    }
    if (page) {
      axiosParams.page = page;
    }
    if (limit) {
      axiosParams.limit = limit;
    }
    
    // Siapkan headers untuk backend
    const headers: { Authorization?: string } = {};
    if (authHeader) {
      headers.Authorization = authHeader;
    }
    
    // Memanggil backend API eksternal dengan params dan headers
    const response = await axios.get('http://localhost:8001/api/web/v1/products', {
      params: axiosParams,
      headers
    });
    
    // Mengembalikan data dari backend
    return NextResponse.json(response.data);
  } catch (error) {
    // Menangani error dan mengembalikan respons error
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}
