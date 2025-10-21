'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Space, Input, Pagination, Typography, Modal, Form, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { UploadFile } from 'antd/es/upload/interface';

const { Title } = Typography;
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
  // Setup State
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  // Debounced search term
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  
  // Form Instance
  const [form] = Form.useForm();

  // Fungsi Fetch Data
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/products', {
        params: { search: debouncedSearchTerm }
      });
      // API mengembalikan { data: [...] }, jadi kita ambil response.data.data
      const productsData = response.data.data || [];
      setProducts(productsData);
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]); // Set empty array jika error
    } finally {
      setLoading(false);
    }
  };

  // useEffect untuk memanggil fetchProducts saat debouncedSearchTerm berubah
  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchTerm]);

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
          <Button danger onClick={() => handleDelete(record.product_id)}>
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  // Placeholder functions untuk Edit dan Delete
  // Placeholder functions untuk Delete
  const handleDelete = (productId: string) => {
    console.log('Delete product:', productId);
    // TODO: Implement delete functionality
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
      
      // Jika ada file yang diupload, tambahkan ke values
      if (fileList.length > 0 && fileList[0].originFileObj) {
        // Untuk saat ini, kita simpan nama file saja
        // Dalam production, file harus diupload ke server/cloud storage
        values.product_image = fileList[0].name;
      }
      
      if (editingProduct) {
        // Update existing product
        await axios.put('/api/product', {
          ...values,
          product_id: editingProduct.product_id
        });
        
        // Tampilkan notifikasi success
        message.success('Product updated successfully!');
      } else {
        // Create new product
        await axios.post('/api/product', values);
        
        // Tampilkan notifikasi success
        message.success('Product created successfully!');
      }
      
      setIsModalOpen(false);
      setFileList([]);
      setEditingProduct(null);
      fetchProducts(); // Refresh tabel
    } catch (error) {
      console.error('Error submitting product:', error);
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
        <Title level={2} style={{ marginBottom: '24px' }}>Product List</Title>
        
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
            total={products.length}
            showSizeChanger
            showQuickJumper
            showTotal={(total) => `Total ${total} products`}
            defaultPageSize={10}
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
