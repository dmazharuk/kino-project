import { Button, Col, Result, Row } from 'antd';
import { NavLink } from 'react-router';
import { HomeOutlined } from '@ant-design/icons';

export default function ErrorPage() {
  return (
    <Row
      justify="center"
      align="middle"
      style={{ minHeight: '100vh', backgroundColor: '#f0f2f5' }}
    >
      <Col>
        <Result
          status="404"
          title="Ошибка 404"
          subTitle="Извините, страница, которую вы посетили, не существует."
          extra={
            <Button type="primary" icon={<HomeOutlined />}>
              <NavLink to="/" rel="noopener noreferrer">
                Вернуться на главную
              </NavLink>
            </Button>
          }
        />
      </Col>
    </Row>
  );
}
