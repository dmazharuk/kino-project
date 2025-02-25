/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import axiosInstance from '../../utils/axiosInstanse';
import { Button, Card, Result, Space, Typography } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';

const { Text } = Typography;

export default function ConfirmationEmail({ setUser }) {
  const { token } = useParams();
  const [res, setRes] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFunction = async () => {
      try {
        await axiosInstance.get(`api/v1.0/auth/confirm-email?token=${token}`);
        setRes('успех');
        setUser((prev) => ({ ...prev, isEmailConfirmed: true }));
      } catch (error) {
        console.error('Ошибка при подтверждении почты', error);

        if (error.response) {
          const { status, data } = error.response;
          if (status === 400) {
            if (data.message.includes('токен')) {
              setRes('токен');
            } else if (data.message.includes('Пользователь')) {
              setRes('пользователь');
            } else if (data.message.includes('Email')) {
              setRes('email');
            } else {
              setRes('Ошибка');
            }
          } else if (status === 500) {
            setRes('Сервер лежит');
          }
        } else {
          setRes('Снова');
        }
      }
    };

    fetchFunction();
  }, [token]);

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
          textAlign: 'center',
        }}
      >
        {res === 'успех' || res === 'email' ? (
          <Result
            icon={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
            title="Почта успешно подтверждена!"
            subTitle="Теперь вы можете пользоваться всеми функциями нашего сервиса."
            extra={
              <Button type="primary" onClick={() => navigate('/user')}>
                Перейти в профиль
              </Button>
            }
          />
        ) : (
          <Result
            icon={<CloseCircleOutlined style={{ color: '#ff4d4f' }} />}
            title="Ошибка подтверждения почты"
            subTitle={
              <Space direction="vertical">
                <Text>
                  Произошла ошибка при подтверждении вашей почты. Пожалуйста,
                  обратитесь в техническую поддержку по адресу:
                </Text>
                <Text strong>classnyikinodnevnik@mail.ru</Text>
              </Space>
            }
            extra={
              <Button type="primary" onClick={() => navigate('/')}>
                Вернуться на главную
              </Button>
            }
          />
        )}
      </Card>
    </div>
  );
}
