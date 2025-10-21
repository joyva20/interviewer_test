'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Space, Input, Pagination, Typography, Modal, Form } from 'antd';
import type { ColumnsType } from 'antd/es/table';

const { Title } = Typography;
const { Search } = Input;
const { TextArea } = Input;

// Interface Product sesuai spesifikasi
interface Product {
  product_id: string;
  product_title: string;
  product_price: number;
  product_category: string;
  product_description: string;
}

export default function ProductsPage() {
  // Setup State
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  
  // Form Instance
  const [form] = Form.useForm();

  // Fungsi Fetch Data
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/products');
      // API mengembalikan { data: [...] }, jadi kita ambil response.data.data
      setProducts(response.data.data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]); // Set empty array jika error
    } finally {
      setLoading(false);
    }
  };

  // useEffect untuk memanggil fetchProducts saat komponen pertama kali dimuat
  useEffect(() => {
    fetchProducts();
  }, []);

  // Setup Kolom Tabel
  const columns: ColumnsType<Product> = [
    {
      title: 'Product Title',
      dataIndex: 'product_title',
      key: 'product_title',
    },
    {
      title: 'Price',
      dataIndex: 'product_price',
      key: 'product_price',
      render: (price: number) => `Rp ${price.toLocaleString('id-ID')}`,
    },
    {
      title: 'Category',
      dataIndex: 'product_category',
      key: 'product_category',
    },
    {
      title: 'Description',
      dataIndex: 'product_description',
      key: 'product_description',
      ellipsis: true,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: unknown, record: Product) => (
        <Space size="middle">
          <Button type="primary" onClick={() => handleEdit(record)}>
            Edit
          </Button>
          <Button danger onClick={() => handleDelete(record.product_id)}>
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  // Placeholder functions untuk Edit dan Delete
  const handleEdit = (product: Product) => {
    console.log('Edit product:', product);
    // TODO: Implement edit functionality
  };

  const handleDelete = (productId: string) => {
    console.log('Delete product:', productId);
    // TODO: Implement delete functionality
  };

  const handleSearch = (value: string) => {
    console.log('Search:', value);
    // TODO: Implement search functionality
  };

  const handleCreateProduct = () => {
    console.log('Create new product');
    // TODO: Implement create product functionality
  };

  // Render JSX
  return (
    <div style={{ 
      minHeight: '100vh',
      backgroundColor: '#f5f5f5',
      padding: '40px 24px'
    }}>
      <div style={{ 
        maxWidth: '1400px', 
        margin: '0 auto',
        backgroundColor: 'white',
        padding: '32px',
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <Title level={2} style={{ marginBottom: '24px' }}>Product List</Title>
        
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          {/* Search dan Create Button */}
          <Space style={{ width: '100%', justifyContent: 'space-between', marginBottom: '16px' }}>
            <Search
              placeholder="Search products..."
              allowClear
              onSearch={handleSearch}
              style={{ width: 350 }}
              size="large"
            />
            <Button 
              type="primary" 
              onClick={handleCreateProduct}
              size="large"
            >
              Create Product
            </Button>
          </Space>

          {/* Table */}
          <Table
            columns={columns}
            dataSource={products}
            loading={loading}
            rowKey="product_id"
            pagination={false}
            bordered
            size="middle"
          />

          {/* Pagination */}
          <Pagination
            total={products.length}
            showSizeChanger
            showQuickJumper
            showTotal={(total) => `Total ${total} products`}
            defaultPageSize={10}
            style={{ textAlign: 'right', marginTop: '16px' }}
          />
        </Space>
      </div>
    </div>
  );
}
