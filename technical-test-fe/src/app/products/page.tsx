'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Table, Button, Space, Input, Pagination, Typography, Modal, Form, Upload, message, Popconfirm } from 'antd';
import { UploadOutlined, LogoutOutlined, UserOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { UploadFile } from 'antd/es/upload/interface';
import { useAuth } from '@/context/AuthContext';

const { Title, Text } = Typography;
const { TextArea } = Input;

// Interface Product sesuai spesifikasi
interface Product {
  product_id: string;
  product_title: string;
  product_price: number;
  product_category: string;
  product_description: string;
  product_image?: string;
}

// Custom Hook useDebounce
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default function ProductsPage() {
  // Auth & Router
  const { user, loading: authLoading, logout, getToken } = useAuth();
  const router = useRouter();
  
  // Setup State
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  
  // Debounced search term
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  
  // Form Instance
  const [form] = Form.useForm();

  // Fungsi Fetch Data
  const fetchProducts = async () => {
    try {
      setLoading(true);
      
      // Get Firebase token
      const token = await getToken();
      console.log('Firebase Token:', token ? 'Token berhasil didapat' : 'Tidak ada token');
      
      const response = await axios.get('/api/products', {
        params: { 
          search: debouncedSearchTerm,
          page: currentPage,
          limit: pageSize
        },
        headers: {
          ...(token && { Authorization: `Bearer ${token}` })
        }
      });
      
      // Debug: Log response structure
      console.log('API Response:', response.data);
      
      // Check jika response mengandung error (status_code: "200" tapi ada error)
      if (response.data.status_code === "200" && response.data.is_success === false) {
        console.error('API Error:', response.data.data);
        
        // Jika token expired, logout user
        if (response.data.data && response.data.data.includes('expired')) {
          message.error('Session expired. Please login again.');
          await logout();
          router.push('/login');
          return;
        }
        
        message.error('Failed to load products');
        setProducts([]);
        setTotalItems(0);
        return;
      }
      
      // API mengembalikan { data: [...], pagination: { total, ... } }
      // Pastikan data adalah array
      let productsData = [];
      
      if (response.data && Array.isArray(response.data.data)) {
        productsData = response.data.data;
      } else if (Array.isArray(response.data)) {
        // Jika response langsung array (format lama)
        productsData = response.data;
      }
      
      console.log('Products Data (array):', productsData);
      setProducts(productsData);
      
      // Update total items dari pagination response
      if (response.data.pagination) {
        setTotalItems(response.data.pagination.total);
      } else {
        setTotalItems(productsData.length);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]); // Set empty array jika error
      setTotalItems(0);
      message.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  // Protected Route - Redirect jika belum login
  useEffect(() => {
    if (!authLoading && !user) {
      message.warning('Please login to access this page');
      router.push('/login');
    }
  }, [authLoading, user, router]);

  // useEffect untuk reset page ke 1 saat search berubah
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm]);

  // useEffect untuk memanggil fetchProducts saat dependencies berubah
  useEffect(() => {
    if (user) {
      fetchProducts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchTerm, currentPage, pageSize, user]);

  // Handle Logout
  const handleLogout = async () => {
    try {
      await logout();
      message.success('Logged out successfully');
      router.push('/login');
    } catch (error) {
      message.error('Failed to logout');
    }
  };

  // Show loading saat check authentication
  if (authLoading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center' 
      }}>
        <Title level={4}>Loading...</Title>
      </div>
    );
  }

  // Jika belum login, return null (akan redirect)
  if (!user) {
    return null;
  }

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
          <Button type="primary" onClick={() => handleShowEditModal(record)}>
            Edit
          </Button>
          <Popconfirm
            title="Delete the product"
            description="Are you sure you want to delete this product?"
            onConfirm={() => handleDelete(record.product_id)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger>Delete</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // Fungsi Delete Product
  const handleDelete = async (productId: string) => {
    try {
      console.log('Deleting product with ID:', productId);
      
      // Get Firebase token
      const token = await getToken();
      console.log('Firebase Token for Delete:', token ? 'Token berhasil didapat' : 'Tidak ada token');
      
      const response = await axios.delete(`/api/product?product_id=${productId}`, {
        headers: {
          ...(token && { Authorization: `Bearer ${token}` })
        }
      });
      
      console.log('Delete response:', response.data);
      
      // Check jika response mengandung error
      if (response.data.status_code === "200" && response.data.is_success === false) {
        console.error('API Error:', response.data.data);
        
        // Jika token expired, logout user
        if (response.data.data && response.data.data.includes('expired')) {
          message.error('Session expired. Please login again.');
          await logout();
          router.push('/login');
          return;
        }
        
        message.error('Failed to delete product');
        return;
      }
      
      message.success('Product deleted successfully!');
      
      // Reset ke page 1 jika produk di page terakhir habis
      if (products.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      } else {
        fetchProducts(); // Refresh tabel setelah delete
      }
    } catch (error: any) {
      console.error('Failed to delete product', error);
      
      // Check if error response has token expired message
      if (error.response?.data?.data?.includes('expired')) {
        message.error('Session expired. Please login again.');
        await logout();
        router.push('/login');
        return;
      }
      
      message.error('Failed to delete product');
    }
  };

  // Fungsi Buka Modal Create
  const handleShowCreateModal = () => {
    setEditingProduct(null);
    form.resetFields();
    setFileList([]);
    setIsModalOpen(true);
  };

  // Fungsi Buka Modal Edit
  const handleShowEditModal = (product: Product) => {
    setEditingProduct(product);
    form.setFieldsValue(product);
    setFileList([]);
    setIsModalOpen(true);
  };

  // Fungsi Tutup Modal
  const handleCancel = () => {
    setIsModalOpen(false);
    setFileList([]);
    setEditingProduct(null);
  };

  // Fungsi Submit Form Create/Update Product
  const handleFormSubmit = async (values: Product) => {
    try {
      setFormLoading(true);
      
      // Get Firebase token
      const token = await getToken();
      console.log('Firebase Token for Submit:', token ? 'Token berhasil didapat' : 'Tidak ada token');
      
      // Jika ada file yang diupload, tambahkan ke values
      if (fileList.length > 0 && fileList[0].originFileObj) {
        // Untuk saat ini, kita simpan nama file saja
        // Dalam production, file harus diupload ke server/cloud storage
        values.product_image = fileList[0].name;
      }
      
      const config = {
        headers: {
          ...(token && { Authorization: `Bearer ${token}` })
        }
      };
      
      let response;
      
      if (editingProduct) {
        // Update existing product
        response = await axios.put('/api/product', {
          ...values,
          product_id: editingProduct.product_id
        }, config);
      } else {
        // Create new product
        response = await axios.post('/api/product', values, config);
      }
      
      // Check jika response mengandung error
      if (response.data.status_code === "200" && response.data.is_success === false) {
        console.error('API Error:', response.data.data);
        
        // Jika token expired, logout user
        if (response.data.data && response.data.data.includes('expired')) {
          message.error('Session expired. Please login again.');
          await logout();
          router.push('/login');
          return;
        }
        
        message.error(editingProduct ? 'Failed to update product' : 'Failed to create product');
        return;
      }
      
      // Tampilkan notifikasi success
      message.success(editingProduct ? 'Product updated successfully!' : 'Product created successfully!');
      
      setIsModalOpen(false);
      setFileList([]);
      setEditingProduct(null);
      fetchProducts(); // Refresh tabel
    } catch (error: any) {
      console.error('Error submitting product:', error);
      
      // Check if error response has token expired message
      if (error.response?.data?.data?.includes('expired')) {
        message.error('Session expired. Please login again.');
        await logout();
        router.push('/login');
        return;
      }
      
      // Tampilkan notifikasi error
      message.error(editingProduct ? 'Failed to update product. Please try again.' : 'Failed to create product. Please try again.');
    } finally {
      setFormLoading(false);
    }
  };

  // Fungsi Handle Upload File
  const handleUploadChange = ({ fileList: newFileList }: { fileList: UploadFile[] }) => {
    setFileList(newFileList);
  };

  // Custom request untuk mencegah auto upload
  const customRequest = ({ onSuccess }: { onSuccess?: (body: unknown) => void }) => {
    // Tidak melakukan upload sebenarnya, hanya simpan file di state
    setTimeout(() => {
      if (onSuccess) {
        onSuccess('ok');
      }
    }, 0);
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
        {/* Header dengan User Info dan Logout */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '24px',
          paddingBottom: '16px',
          borderBottom: '1px solid #f0f0f0'
        }}>
          <Title level={2} style={{ margin: 0 }}>Product List</Title>
          <Space>
            <Space>
              <UserOutlined style={{ fontSize: '16px' }} />
              <Text strong>{user?.email}</Text>
            </Space>
            <Button 
              danger 
              icon={<LogoutOutlined />}
              onClick={handleLogout}
            >
              Logout
            </Button>
          </Space>
        </div>
        
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          {/* Search dan Create Button */}
          <Space style={{ width: '100%', justifyContent: 'space-between', marginBottom: '16px' }}>
            <Input
              placeholder="Search products (by title, category, or description)..."
              allowClear
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: 450 }}
              size="large"
              prefix={<span style={{ marginRight: 8 }}>🔍</span>}
            />
            <Button 
              type="primary" 
              onClick={handleShowCreateModal}
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
            current={currentPage}
            pageSize={pageSize}
            total={totalItems}
            onChange={(page, size) => {
              setCurrentPage(page);
              if (size !== pageSize) {
                setPageSize(size);
                setCurrentPage(1); // Reset ke page 1 jika page size berubah
              }
            }}
            showSizeChanger
            showQuickJumper
            showTotal={(total) => `Total ${total} items`}
            style={{ textAlign: 'right', marginTop: '16px' }}
          />
        </Space>
      </div>

      {/* Modal Create/Edit Product */}
      <Modal
        title={editingProduct ? 'Edit Product' : 'Create New Product'}
        open={isModalOpen}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={formLoading}
            onClick={() => form.submit()}
          >
            Submit
          </Button>,
        ]}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFormSubmit}
        >
          <Form.Item
            name="product_title"
            label="Product Title"
            rules={[{ required: true, message: 'Please input product title!' }]}
          >
            <Input placeholder="Enter product title" />
          </Form.Item>

          <Form.Item
            name="product_price"
            label="Price"
            rules={[{ required: true, message: 'Please input product price!' }]}
          >
            <Input type="number" placeholder="Enter product price" />
          </Form.Item>

          <Form.Item
            name="product_category"
            label="Category"
            rules={[{ required: true, message: 'Please input product category!' }]}
          >
            <Input placeholder="Enter product category" />
          </Form.Item>

          <Form.Item
            name="product_description"
            label="Description"
          >
            <TextArea rows={4} placeholder="Enter product description" />
          </Form.Item>

          <Form.Item
            name="product_image"
            label="Product Image (Optional)"
            tooltip="Upload product image (JPG, PNG, etc.)"
          >
            <Upload
              fileList={fileList}
              onChange={handleUploadChange}
              customRequest={customRequest}
              beforeUpload={() => false}
              maxCount={1}
              accept="image/*"
            >
              <Button icon={<UploadOutlined />}>Choose Image File</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
