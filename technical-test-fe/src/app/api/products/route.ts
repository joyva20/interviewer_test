import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET() {
  try {
    // Memanggil backend API eksternal
    const response = await axios.get('http://localhost:8001/api/web/v1/products');
    
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
