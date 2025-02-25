import { Button, Form, Input, Card, Typography, Space, message } from 'antd';
import { MailOutlined } from '@ant-design/icons';
import { NavLink, useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstanse';

const { Title } = Typography;

export default function RecoverPassoword() {
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();

  const onFinish = async (values) => {
    try {
      await axiosInstance.post(`/api/v1.0/auth/forgot-password`, {
        email: values.email,
      });

      messageApi.success(
        'Письмо с инструкциями по восстановлению пароля отправлено на ваш email.'
      );
      navigate('/sign');
    } catch (error) {
      console.error('Ошибка при восстановлении пароля:', error);

      if (error.response) {
        const { status } = error.response;
        if (status === 400) {
          messageApi.error('Пользователь с такой почтой не найден.');
        } else if (status === 500) {
          messageApi.error('Ошибка на сервере. Пожалуйста, попробуйте позже.');
        }
      } else {
        messageApi.error(
          'Ошибка при восстановлении пароля. Пожалуйста, попробуйте снова.'
        );
      }
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: 'linear-gradient(135deg, #f5f7fa, #c3cfe2)',
      }}
    >
      <Card
        style={{
          width: '100%',
          maxWidth: 400,
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Title level={2} style={{ textAlign: 'center', color: '#1890ff' }}>
          Восстановление пароля
        </Title>

        <Form
          name="basic"
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            name="email"
            rules={[
              {
                required: true,
                message: 'Пожалуйста, введите ваш email',
              },
              {
                type: 'email',
                message: 'Введите корректный email',
              },
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="Email" />
          </Form.Item>

          <Form.Item>
            {contextHolder}
            <Button type="primary" htmlType="submit" block>
              Отправить
            </Button>
          </Form.Item>

          <Space
            direction="vertical"
            align="center"
            style={{ width: '100%', marginTop: 16 }}
          >
            <span>Вспомнили пароль?</span>
            <Button type="link">
              <NavLink to="/sign">Войти</NavLink>
            </Button>
          </Space>
        </Form>
      </Card>
    </div>
  );
}
