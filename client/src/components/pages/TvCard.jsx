/* eslint-disable react/prop-types */
import {
  Card,
  Typography,
  Button,
  Image,
  Row,
  Col,
  Space,
  List,
  Avatar,
  Modal,
  InputNumber,
  Result,
} from 'antd';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import axiosInstance from '../../utils/axiosInstanse';
import { LoadingOutlined, CloseCircleOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const API_KEY = import.meta.env.VITE_API_KEY;
const API_URL = import.meta.env.VITE_API_URL;

export default function TvCard({ user }) {
  const navigate = useNavigate();
  const { id } = useParams();

  const [movieUser, setMovieUser] = useState({});
  const [movie, setMovie] = useState('');
  const [cast, setCast] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentEpisode, setCurrentEpisode] = useState(1);

  useEffect(() => {
    const fetchFunction = async () => {
      try {
        const movieResponse = await axios.get(`${API_URL}/tv/${id}`, {
          headers: {
            accept: 'application/json',
            Authorization: `Bearer ${API_KEY}`,
          },
          params: {
            language: 'ru-RU',
          },
        });
        setMovie(movieResponse.data);

        const creditsResponse = await axios.get(`${API_URL}/tv/${id}/credits`, {
          headers: {
            accept: 'application/json',
            Authorization: `Bearer ${API_KEY}`,
          },
          params: {
            language: 'ru-RU',
          },
        });
        setCast(creditsResponse.data.cast.slice(0, 5));

        const movieUser = await axiosInstance.get(`/api/v1.0/view`, {
          params: { userId: user.id, movieId: id },
        });
        if (movieUser.data) {
          setMovieUser(movieUser.data);
        } else {
          setMovieUser({ wish: false, look: false, view: false });
        }
      } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFunction();
  }, [id, user.id]);

  if (isLoading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
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
          <Result icon={<LoadingOutlined />} title="Загрузка..." />
        </Card>
      </div>
    );
  }

  if (!movie) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
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
          <Result
            icon={<CloseCircleOutlined style={{ color: '#ff4d4f' }} />}
            title="Фильм не найден"
          />
        </Card>
      </div>
    );
  }

  async function buttonView() {
    try {
      const response = await axiosInstance.post(`/api/v1.0/view/`, {
        userId: user.id,
        movieId: movie.id,
        type: 'tv',
      });

      if (response.status === 201) {
        navigate(-1);
      }
    } catch (error) {
      console.error('Ошибка при загрузке данных:', error);
    }
  }

  async function buttonDeletedView() {
    try {
      const response = await axiosInstance.put(`/api/v1.0/view/`, {
        userId: user.id,
        movieId: movie.id,
        type: 'tv',
      });

      if (response.status === 200) {
        setMovieUser((prev) => ({ ...prev, view: false }));
      }
    } catch (error) {
      console.error('Ошибка при загрузке данных:', error);
    }
  }

  async function buttonWish() {
    try {
      const response = await axiosInstance.post(`/api/v1.0/wish/`, {
        userId: user.id,
        movieId: movie.id,
        type: 'tv',
      });

      if (response.status === 201) {
        navigate(-1);
      }
    } catch (error) {
      console.error('Ошибка при загрузке данных:', error);
    }
  }

  async function buttonDeletedWish() {
    try {
      const response = await axiosInstance.put(`/api/v1.0/wish/`, {
        userId: user.id,
        movieId: movie.id,
        type: 'tv',
      });

      if (response.status === 200) {
        setMovieUser((prev) => ({ ...prev, wish: false }));
      }
    } catch (error) {
      console.error('Ошибка при загрузке данных:', error);
    }
  }

  async function buttonLook() {
    setIsModalVisible(true);
  }

  async function handleOk() {
    try {
      const response = await axiosInstance.post(`/api/v1.0/look/`, {
        userId: user.id,
        movieId: movie.id,
        type: 'tv',
        viewed: currentEpisode,
        total: movie.number_of_episodes,
      });
      if (response.status === 201) {
        setIsModalVisible(false);
        navigate(-1);
      }
    } catch (error) {
      console.error('Ошибка при загрузке данных:', error);
    }
  }

  function handleCancel() {
    setIsModalVisible(false);
  }

  async function buttonDeletedLook() {
    try {
      const response = await axiosInstance.put(`/api/v1.0/look/`, {
        userId: user.id,
        movieId: movie.id,
        type: 'tv',
      });

      if (response.status === 200) {
        setMovieUser((prev) => ({ ...prev, look: false }));
      }
    } catch (error) {
      console.error('Ошибка при загрузке данных:', error);
    }
  }

  return (
    <Card
      style={{
        width: '100%',
        maxWidth: '1400px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {user ? (
        <Row justify="end" style={{ marginBottom: '16px' }}>
          <Space>
            {movieUser.view ? (
              <Button type="primary" onClick={buttonDeletedView}>
                Не просмотрено
              </Button>
            ) : (
              <Button type="primary" onClick={buttonView}>
                Просмотрено
              </Button>
            )}

            {movieUser.wish ? (
              <Button onClick={buttonDeletedWish}>Не хочу посмотреть</Button>
            ) : !movieUser.view && !movieUser.look ? (
              <Button onClick={buttonWish}>Хочу посмотреть</Button>
            ) : null}

            {movieUser.look ? (
              <Button onClick={buttonDeletedLook}>Не смотрю сейчас</Button>
            ) : (
              <Button onClick={buttonLook}>Смотрю сейчас</Button>
            )}
          </Space>
        </Row>
      ) : null}

      <Row gutter={16}>
        <Col span={8}>
          <div style={{ position: 'relative', width: '100%' }}>
            <Image
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              style={{ width: '100%', borderRadius: '8px' }}
            />
            <div
              style={{
                position: 'absolute',
                top: '16px',
                left: '16px',
                background: 'rgba(0, 0, 0, 0.7)',
                padding: '8px',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '18px',
                fontWeight: 'bold',
              }}
            >
              {movie.vote_average.toFixed(1)}
            </div>
          </div>
        </Col>

        <Col span={16}>
          <Title level={3}>{movie.name}</Title>

          <Row style={{ marginTop: '16px' }}>
            <Col span={24}>
              <Text strong>Тип: </Text>
              <Text>Сериал</Text>
            </Col>
            <Col span={24}>
              <Text strong>Год выхода: </Text>
              <Text>{new Date(movie.first_air_date).getFullYear()}</Text>
            </Col>
            <Col span={24}>
              <Text strong>Количество сезонов: </Text>
              <Text>{movie.number_of_seasons}</Text>
            </Col>
            <Col span={24}>
              <Text strong>Количество серий: </Text>
              <Text>{movie.number_of_episodes}</Text>
            </Col>
            <Col span={24}>
              <Text strong>Дата выхода следующего сезона: </Text>
              <Text>
                {movie.next_episode_to_air
                  ? new Date(
                      movie.next_episode_to_air.air_date
                    ).toLocaleDateString()
                  : 'Неизвестно'}
              </Text>
            </Col>
            <Col span={24}>
              <Text strong>Жанр: </Text>
              <Text>{movie.genres.map((genre) => genre.name).join(', ')}</Text>
            </Col>
            <Col span={24}>
              <Text strong>Описание: </Text>
              <Text>{movie.overview}</Text>
            </Col>
          </Row>

          <Row style={{ marginTop: '16px' }}>
            <Col span={24}>
              <Text strong>Актеры: </Text>
              <List
                dataSource={cast}
                renderItem={(actor) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={
                        <Avatar
                          src={`https://image.tmdb.org/t/p/w92${actor.profile_path}`}
                          alt={actor.name}
                        />
                      }
                      title={actor.name}
                      description={`Роль: ${actor.character}`}
                    />
                  </List.Item>
                )}
              />
            </Col>
          </Row>
        </Col>
      </Row>

      <Modal
        title="На какой серии вы находитесь?"
        open={isModalVisible}
        okText="Записать"
        cancelText="Отмена"
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <InputNumber
          min={1}
          max={movie.number_of_episodes}
          defaultValue={1}
          onChange={(value) => setCurrentEpisode(value)}
        />
      </Modal>
    </Card>
  );
}
