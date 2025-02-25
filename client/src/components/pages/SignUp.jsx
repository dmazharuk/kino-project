/* eslint-disable react/prop-types */
import { Button, Form, Input, Card, Typography, message } from 'antd';
import { UserOutlined, MailOutlined, LockOutlined } from '@ant-design/icons';
import axiosInstance, { setAccessToken } from '../../utils/axiosInstanse';
import { useNavigate } from 'react-router';

const { Title } = Typography;

export default function Sign({ setUser }) {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  const onFinish = async (values) => {
    try {
      const res = await axiosInstance.post(`/api/v1.0/auth/signup`, {
        login: values.login,
        email: values.email,
        password: values.password,
      });
      console.log('res:', res);
      setAccessToken(res.data.accessToken);
      setUser(res.data.user);
      navigate('/user');

      messageApi.success(
        'Регистрация успешна! Пожалуйста, проверьте вашу почту для подтверждения.'
      );

      form.resetFields();
    } catch (error) {
      console.error('Ошибка при регистрации:', error);

      if (error.response) {
        const { status, data } = error.response;
        if (status === 400) {
          if (data.message.includes('email')) {
            messageApi.error('Пользователь с таким email уже существует.');
          } else if (data.message.includes('login')) {
            messageApi.error('Пользователь с таким логином уже существует.');
          } else {
            messageApi.error(data.message || 'Ошибка при регистрации.');
          }
        } else if (status === 500) {
          messageApi.error('Ошибка на сервере. Пожалуйста, попробуйте позже.');
        }
      } else {
        messageApi.error(
          'Ошибка при регистрации. Пожалуйста, попробуйте снова.'
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
          maxWidth: 500,
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Title level={2} style={{ textAlign: 'center', color: '#1890ff' }}>
          Регистрация
        </Title>

        <Form
          form={form}
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

          <Form.Item
            name="passwordTwo"
            dependencies={['password']}
            rules={[
              {
                required: true,
                message: 'Пожалуйста, подтвердите ваш пароль',
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Пароли не совпадают'));
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Подтверждение пароля"
            />
          </Form.Item>

          <Form.Item>
            {contextHolder}
            <Button type="primary" htmlType="submit">
              Зарегистрироваться
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
