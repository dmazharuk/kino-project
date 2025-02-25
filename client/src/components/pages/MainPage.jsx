/* eslint-disable react/prop-types */
import { Carousel, Button, Card, Row, Col, Typography, Layout } from 'antd';
import { PlusOutlined, UserOutlined } from '@ant-design/icons';
import { NavLink } from 'react-router';
import { useEffect, useState } from 'react';
import axiosInstance from '../../utils/axiosInstanse';
import axios from 'axios';

const { Title, Paragraph } = Typography;
const { Content } = Layout;

export default function MainPage({ user }) {
  const [advice, setAdvice] = useState([]);

  const API_KEY = import.meta.env.VITE_API_KEY;
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchFunctionAdvice = async () => {
      try {
        const movieUser = await axiosInstance.get(`/api/v1.0/advice`);
        const movieUserResponse = await Promise.all(
          movieUser.data.map(async (elem) => {
            const movieResponse = await axios.get(
              `${API_URL}/${elem.type}/${elem.movieId}`,
              {
                headers: {
                  accept: 'application/json',
                  Authorization: `Bearer ${API_KEY}`,
                },
                params: {
                  language: 'ru-RU',
                },
              }
            );
            return { ...elem, movie: movieResponse.data };
          })
        );

        setAdvice(movieUserResponse);
      } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
      }
    };

    fetchFunctionAdvice();
  }, []);

  return (
    <Layout
      style={{
        minHeight: '100vh',
        padding: '24px',
        backgroundColor: '#f0f2f5',
      }}
    >
      <Content>
        <Row justify="center" style={{ marginBottom: '24px' }}>
          <Col span={24} style={{ textAlign: 'center' }}>
            <Title level={2}>Кинодневник</Title>
            <Paragraph>
              Кинодневник — это сервис, который сделает жизнь любого любителя
              фильмов лучше. Записывайте просмотренные фильмы, отмечайте сезоны
              и серии, делитесь своими просмотрами с друзьями!
            </Paragraph>
          </Col>
        </Row>

        <Row justify="center" style={{ marginBottom: '24px' }}>
          {user ? (
            <Button type="primary" size="large" icon={<UserOutlined />}>
              <NavLink to="/user">Мой профиль</NavLink>
            </Button>
          ) : (
            <Button type="primary" size="large" icon={<PlusOutlined />}>
              <NavLink to="/sign">Войти/Зарегистрироваться</NavLink>
            </Button>
          )}
        </Row>

        <Row justify="center" style={{ marginBottom: '16px' }}>
          <Col span={24} style={{ textAlign: 'center' }}>
            <Title level={3}>Рекомендации пользователей</Title>
          </Col>
        </Row>

        <Row justify="center" style={{ marginBottom: '24px' }}>
          <Col span={24}>
            <Carousel
              autoplay
              style={{
                height: '800px',
                backgroundColor: '#000',
              }}
            >
              {advice.map((item) => (
                <NavLink
                  key={item.movie.id}
                  to={`/${item.type === 'movie' ? 'movie' : 'tv'}/${
                    item.movieId
                  }`}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'start',
                      height: '800px',
                      backgroundImage: `url(https://image.tmdb.org/t/p/original${item.movie.backdrop_path})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      backgroundRepeat: 'no-repeat',
                    }}
                  >
                    <div
                      style={{
                        width: '100%',
                        textAlign: 'center',
                        color: '#fff',
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        padding: '16px',
                        borderRadius: '8px',
                      }}
                    >
                      <Title level={3} style={{ color: '#fff', margin: 0 }}>
                        {item.movie.title || item.movie.name}
                      </Title>
                      <Paragraph style={{ color: '#fff', margin: 0 }}>
                        {item.movie.genres
                          .map((genre) => genre.name)
                          .join(', ')}
                      </Paragraph>
                    </div>
                  </div>
                </NavLink>
              ))}
            </Carousel>
          </Col>
        </Row>

        <Row gutter={[16, 16]} justify="center">
          <Col xs={24} sm={12} md={8}>
            <Card title="Запись фильмов">
              <Paragraph>
                Добавляйте просмотренные фильмы в свой дневник, чтобы не забыть,
                что вы уже смотрели.
              </Paragraph>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Card title="Отметка сезонов и серий">
              <Paragraph>
                Отмечайте просмотренные сезоны и серии сериалов, чтобы следить
                за своим прогрессом.
              </Paragraph>
            </Card>
          </Col>

          <Col xs={24} sm={12} md={8}>
            <Card title="Делитесь с друзьями">
              <Paragraph>
                Делитесь своими просмотрами с друзьями и обсуждайте любимые
                фильмы и сериалы.
              </Paragraph>
            </Card>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
}
