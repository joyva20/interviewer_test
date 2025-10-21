import { NextResponse, NextRequest } from 'next/server';
import axios from 'axios';

export async function GET(request: NextRequest) {
  try {
    // Ambil search param dari URL
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    
    // Siapkan params untuk axios
    const axiosParams: { search?: string } = {};
    if (search) {
      axiosParams.search = search;
    }
    
    // Memanggil backend API eksternal dengan params
    const response = await axios.get('http://localhost:8001/api/web/v1/products', {
      params: axiosParams
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
