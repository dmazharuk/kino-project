/* eslint-disable react/prop-types */
import { Button, Form, Input, Card, Typography, Space, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { NavLink, useNavigate } from 'react-router-dom';
import axiosInstance, { setAccessToken } from '../../utils/axiosInstanse';

const { Title } = Typography;

export default function Sign({ setUser }) {
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();

  const onFinish = async (values) => {
    try {
      const res = await axiosInstance.post(`/api/v1.0/auth/signin`, {
        login: values.login,
        password: values.password,
      });
      console.log('res:', res);

      setAccessToken(res.data.accessToken);
      setUser(res.data.user);
      messageApi.success('Успешная авторизация');
      navigate('/user');
    } catch (error) {
      console.error('Ошибка при регистрации:', error);

      if (error.response) {
        const { status, data } = error.response;
        if (status === 400) {
          if (data.message.includes('login')) {
            messageApi.error(
              'Пользователь с таким логином не найден. Зарегистрируйтесь!'
            );
          } else if (data.message.includes('password')) {
            messageApi.error('Не верный пароль');
          } else {
            messageApi.error(data.message || 'Ошибка при авторизации.');
          }
        } else if (status === 500) {
          messageApi.error('Ошибка на сервере. Пожалуйста, попробуйте позже.');
        }
      } else {
        messageApi.error(
          'Ошибка при авторизации. Пожалуйста, попробуйте снова.'
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
          Вход в систему
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
            name="login"
            rules={[
              {
                required: true,
                message: 'Пожалуйста, введите ваш логин',
              },
            ]}
          >
            <Input prefix={<UserOutlined />} placeholder="Логин" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: 'Пожалуйста, введите ваш пароль',
              },
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Пароль" />
          </Form.Item>

          <Form.Item>
            {contextHolder}
            <Button type="primary" htmlType="submit" block>
              Войти
            </Button>
          </Form.Item>

          <Space
            direction="vertical"
            align="center"
            style={{ width: '100%', marginTop: 16 }}
          >
            <div>
              <span>Забыли пароль? </span>
              <NavLink to="/recover">Восстановить пароль</NavLink>
            </div>
            <div>
              <span>Нет аккаунта? </span>
              <NavLink to="/signUp">Зарегистрироваться</NavLink>
            </div>
          </Space>
        </Form>
      </Card>
    </div>
  );
}
