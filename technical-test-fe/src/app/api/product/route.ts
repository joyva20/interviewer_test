import { NextResponse, NextRequest } from 'next/server';
import axios from 'axios';

// POST - Create Product
export async function POST(request: NextRequest) {
  try {
    // Ambil body JSON dari request
    const body = await request.json();
    
    // Ambil Authorization header dari request
    const authHeader = request.headers.get('authorization');
    
    // Siapkan headers untuk backend
    const headers: { Authorization?: string } = {};
    if (authHeader) {
      headers.Authorization = authHeader;
    }
    
    // Gunakan axios.post untuk meneruskan request ke backend
    const response = await axios.post('http://localhost:8001/api/web/v1/product', body, { headers });
    
    // Kembalikan data respons dari axios
    return NextResponse.json(response.data);
  } catch (error) {
    // Menangani error dan mengembalikan respons error
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}

// PUT - Update Product
export async function PUT(request: NextRequest) {
  try {
    // Ambil body JSON dari request
    const body = await request.json();
    
    // Ambil Authorization header dari request
    const authHeader = request.headers.get('authorization');
    
    // Siapkan headers untuk backend
    const headers: { Authorization?: string } = {};
    if (authHeader) {
      headers.Authorization = authHeader;
    }
    
    // Gunakan axios.put untuk meneruskan request ke backend
    const response = await axios.put('http://localhost:8001/api/web/v1/product', body, { headers });
    
    // Kembalikan data respons dari axios
    return NextResponse.json(response.data);
  } catch (error) {
    // Menangani error dan mengembalikan respons error
    console.error('Error updating product:', error);
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    );
  }
}

// GET - Get Single Product
export async function GET(request: NextRequest) {
  try {
    // Ambil query param product_id dari URL
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('product_id');
    
    // Validasi jika productId tidak ada
    if (!productId) {
      return NextResponse.json(
        { error: 'product_id is required' },
        { status: 400 }
      );
    }
    
    // Ambil Authorization header dari request
    const authHeader = request.headers.get('authorization');
    
    // Siapkan headers untuk backend
    const headers: { Authorization?: string } = {};
    if (authHeader) {
      headers.Authorization = authHeader;
    }
    
    // Gunakan axios.get untuk memanggil backend dengan params
    const response = await axios.get('http://localhost:8001/api/web/v1/product', {
      params: { product_id: productId },
      headers
    });
    
    // Kembalikan data respons dari axios
    return NextResponse.json(response.data);
  } catch (error) {
    // Menangani error dan mengembalikan respons error
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}

// DELETE - Delete Product
export async function DELETE(request: NextRequest) {
  try {
    // Ambil query param product_id dari URL
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('product_id');
    
    // Validasi jika productId tidak ada
    if (!productId) {
      return NextResponse.json(
        { error: 'product_id is required' },
        { status: 400 }
      );
    }
    
    // Ambil Authorization header dari request
    const authHeader = request.headers.get('authorization');
    
    // Siapkan headers untuk backend
    const headers: { Authorization?: string } = {};
    if (authHeader) {
      headers.Authorization = authHeader;
    }
    
    // Gunakan axios.delete untuk memanggil backend dengan params
    const response = await axios.delete('http://localhost:8001/api/web/v1/product', {
      params: { product_id: productId },
      headers
    });
    
    // Kembalikan data respons dari axios
    return NextResponse.json(response.data);
  } catch (error) {
    // Menangani error dan mengembalikan respons error
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    );
  }
}
