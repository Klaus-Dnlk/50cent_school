import React, { FC } from 'react';
import { Outlet } from 'react-router-dom';
import { Layout } from 'antd';

import { FooterComponent, HeaderComponent } from '@/components';
const { Header, Footer, Content } = Layout;

const LayoutComponent: FC = () => {
  return (
    <>
      <Layout>
        <Header>
          <HeaderComponent />
        </Header>
        <Content>
          <Outlet />
        </Content>
        <Footer>
          <FooterComponent />
        </Footer>
      </Layout>
    </>
  );
};

export { LayoutComponent };
