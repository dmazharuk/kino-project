/* eslint-disable react/prop-types */
import { Outlet } from 'react-router';
import NavigationBar from '../ui/NavigationBar';
import { Layout } from 'antd';
import { Content, Header } from 'antd/es/layout/layout';

export default function AppLayout({ user }) {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ padding: 0, backgroundColor: '#001529' }}>
        <NavigationBar user={user} />
      </Header>

      <Content style={{ padding: '24px', margin: 0, flex: 1 }}>
        <Outlet />
      </Content>
    </Layout>
  );
}
