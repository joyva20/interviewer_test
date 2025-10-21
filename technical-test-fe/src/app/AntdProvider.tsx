'use client';

import React from 'react';
import { App, ConfigProvider } from 'antd';
import { AntdRegistry } from '@ant-design/nextjs-registry';

export default function AntdProvider({ children }: { children: React.ReactNode }) {
  return (
    <AntdRegistry>
      <ConfigProvider>
        <App>{children}</App>
      </ConfigProvider>
    </AntdRegistry>
  );
}
