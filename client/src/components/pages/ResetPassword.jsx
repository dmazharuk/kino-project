import { Button, Form, Input, Card, Typography, message } from 'antd';
import { LockOutlined } from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstanse';

const { Title } = Typography;

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();

  const onFinish = async (values) => {
    try {
      await axiosInstance.post(`/api/v1.0/auth/reset-password/${token}`, {
        password: values.password,
      });

      messageApi.success('Пароль успешно изменен.');
      navigate('/sign');
    } catch (error) {
      console.error('Ошибка при сбросе пароля:', error);

      if (error.response) {
        const { status, data } = error.response;
        if (status === 400) {
          messageApi.error(data.message || 'Ошибка при сбросе пароля.');
        } else if (status === 500) {
          messageApi.error('Ошибка на сервере. Пожалуйста, попробуйте позже.');
        }
      } else {
        messageApi.error(
          'Ошибка при сбросе пароля. Пожалуйста, попробуйте снова.'
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
          Сброс пароля
        </Title>

        <Form name="basic" onFinish={onFinish} autoComplete="off">
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: 'Пожалуйста, введите новый пароль',
              },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Новый пароль"
            />
          </Form.Item>

          <Form.Item>
            {contextHolder}
            <Button type="primary" htmlType="submit" block>
              Сбросить пароль
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
