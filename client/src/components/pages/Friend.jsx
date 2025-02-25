/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import {
  Card,
  List,
  Typography,
  Button,
  Row,
  Col,
  Result,
  Space,
  Grid,
} from 'antd';
import axiosInstance from '../../utils/axiosInstanse';
import { useParams } from 'react-router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  MailOutlined,
  QuestionCircleOutlined,
  LoadingOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';
import Search from 'antd/es/transfer/search';

const { useBreakpoint } = Grid;
const { Title, Text } = Typography;

export default function Friend({ user, setUser }) {
  const { login } = useParams();
  const screens = useBreakpoint();
  const [isLoading, setIsLoading] = useState(true);

  const [friend, setFriend] = useState();
  const [stateOfFriendship, setStateOfFriendship] = useState(false);

  const [advice, setAdvice] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [filterFollowers, setFilterFollowers] = useState(followers);
  const [searchTextFollower, setSearchTextFollower] = useState('');

  const [follow, setFollow] = useState([]);
  const [filterFollow, setFilterFollow] = useState(follow);
  const [searchTextFollow, setSearchTextFollow] = useState('');

  const API_KEY = import.meta.env.VITE_API_KEY;
  const API_URL = import.meta.env.VITE_API_URL;

  const getGridColumns = () => {
    if (screens.xxl) return 6;
    if (screens.xl) return 5;
    if (screens.lg) return 4;
    if (screens.md) return 3;
    if (screens.sm) return 2;
    return 1;
  };

  useEffect(() => {
    if (searchTextFollower) {
      setFilterFollowers(
        followers.filter((friend) =>
          friend.name.toLowerCase().includes(searchTextFollower.toLowerCase())
        )
      );
    } else {
      setFilterFollowers(followers);
    }
  }, [searchTextFollower, followers]);

  useEffect(() => {
    if (searchTextFollow) {
      setFilterFollow(
        follow.filter((friend) =>
          friend.name.toLowerCase().includes(searchTextFollow.toLowerCase())
        )
      );
    } else {
      setFilterFollow(follow);
    }
  }, [searchTextFollow, follow]);

  useEffect(() => {
    const fetchFunctionUser = async () => {
      try {
        const fetchUser = await axiosInstance.get(`/api/v1.0/user/${user.id}`);
        setUser(fetchUser.data);
      } catch (error) {
        console.error('Ошибка NEN при загрузке данных:', error);
      }
    };

    const fetchFunctionFriend = async () => {
      try {
        const fetchFriend = await axiosInstance.get(
          `/api/v1.0/user/friend/${login}`
        );
        setFriend(fetchFriend.data);
      } catch (error) {
        console.error('Ошибка NEN при загрузке данных:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFunctionFriend();
    fetchFunctionUser();
  }, [user]);

  useEffect(() => {
    const fetchFunctionAdvice = async () => {
      try {
        const movieUser = await axiosInstance.get(
          `/api/v1.0/advice/${friend.id}`
        );
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

    const fetchFunctionFreindShip = async () => {
      try {
        const freiendship = await axiosInstance.get(`/api/v1.0/friends`, {
          params: { userId: user.id, friendId: friend.id },
        });
        if (freiendship.data) {
          setStateOfFriendship(true);
        }
      } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
      }
    };

    const fetchFunctionFollow = async () => {
      try {
        const subscriptions = await axiosInstance.get(
          `/api/v1.0/friends/subscriptions/${friend.id}`
        );
        setFollow(subscriptions.data[0].friends);
      } catch (error) {
        console.error('Ошибка NEN при загрузке данных:', error);
      }
    };

    const fetchFunctionFollowers = async () => {
      try {
        const followers = await axiosInstance.get(
          `/api/v1.0/friends/followers/${friend.id}`
        );

        setFollowers(followers.data[0].followers);
      } catch (error) {
        console.error('Ошибка NEN при загрузке данных:', error);
      }
    };

    fetchFunctionAdvice();
    fetchFunctionFreindShip();
    fetchFunctionFollow();
    fetchFunctionFollowers();
  }, [friend]);

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

  if (!friend) {
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
            title="Пользователь не найден"
          />
        </Card>
      </div>
    );
  }

  async function subscribe() {
    try {
      const response = await axiosInstance.post(`/api/v1.0/friends`, {
        userId: user.id,
        friendId: friend.id,
      });
      if (response.status === 200) {
        setStateOfFriendship(true);
      }
    } catch (error) {
      console.error('Ошибка при загрузке данных:', error);
    }
  }

  async function unsubscribe() {
    try {
      const response = await axiosInstance.delete(`/api/v1.0/friends`, {
        data: {
          userId: user.id,
          friendId: friend.id,
        },
      });
      if (response.status === 200) {
        setStateOfFriendship(false);
      }
    } catch (error) {
      console.error('Ошибка при загрузке данных:', error);
    }
  }

  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      <Row
        justify="space-between"
        align="middle"
        style={{ marginBottom: '24px' }}
      >
        <Col>
          <Title level={2}>{friend.login}</Title>
        </Col>
        <Col>
          {!stateOfFriendship && friend.id !== user.id ? (
            <Button type="primary" onClick={subscribe}>
              Подписаться
            </Button>
          ) : friend.id !== user.id ? (
            <Button onClick={unsubscribe}>Отписаться</Button>
          ) : null}
        </Col>
      </Row>

      {user.isEmailConfirmed ? (
        <>
          <Card title="Рекомендации" style={{ marginBottom: '24px' }}>
            <List
              grid={{ gutter: 16, column: getGridColumns() }}
              dataSource={advice.filter((el) => el.advice)}
              renderItem={(elem) => (
                <List.Item key={elem.id}>
                  <Card
                    cover={
                      <img
                        alt={elem.movie.title}
                        src={`https://image.tmdb.org/t/p/w500${elem.movie.poster_path}`}
                        style={{ height: '300px', objectFit: 'cover' }}
                      />
                    }
                  >
                    <Card.Meta
                      title={
                        elem.movie.title ? (
                          <a
                            href={`/movie/${elem.movie.id}`}
                            style={{
                              color: 'inherit',
                              textDecoration: 'none',
                            }}
                          >
                            {elem.movie.title}
                          </a>
                        ) : (
                          <a
                            href={`/tv/${elem.movie.id}`}
                            style={{
                              color: 'inherit',
                              textDecoration: 'none',
                            }}
                          >
                            {elem.movie.name}
                          </a>
                        )
                      }
                      description={
                        elem.type === 'movie' ? (
                          <Text ellipsis={{ rows: 2 }}>Фильм</Text>
                        ) : (
                          <Text ellipsis={{ rows: 2 }}>Сериал</Text>
                        )
                      }
                    />
                  </Card>
                </List.Item>
              )}
            />
          </Card>

          <Card title="Подписки" style={{ marginBottom: '24px' }}>
            <Search
              placeholder="Поиск среди подписок"
              value={searchTextFollow}
              onChange={(e) => setSearchTextFollow(e.target.value)}
              style={{ marginBottom: '16px' }}
            />

            <List
              dataSource={filterFollow}
              renderItem={(friend) => (
                <List.Item
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <List.Item.Meta
                    title={
                      <a href={`/users/${friend.login}`}>{friend.login}</a>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>

          <Card title="Подписчики" style={{ marginBottom: '24px' }}>
            <Search
              placeholder="Поиск среди подписчиков"
              value={searchTextFollower}
              onChange={(e) => setSearchTextFollower(e.target.value)}
              style={{ marginBottom: '16px' }}
            />

            <List
              dataSource={filterFollowers}
              renderItem={(friend) => (
                <List.Item>
                  <List.Item.Meta
                    title={
                      <a href={`/users/${friend.login}`}>{friend.login}</a>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </>
      ) : (
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
              maxWidth: 600,
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
              textAlign: 'center',
            }}
          >
            <Result
              icon={
                <MailOutlined style={{ color: '#1890ff', fontSize: '64px' }} />
              }
              title="Подтвердите ваш email"
              subTitle={
                <Space direction="vertical">
                  <Text>
                    Мы отправили письмо с подтверждением на ваш email.
                    Пожалуйста, проверьте вашу почту и перейдите по ссылке в
                    письме.
                  </Text>
                  <Text type="secondary">
                    Если вы не видите письмо, проверьте папку «Спам».
                  </Text>
                  <Text>
                    Если у вас возникли проблемы, обратитесь в техническую
                    поддержку по адресу:
                    <strong>classnyikinodnevnik@mail.ru</strong>
                  </Text>
                </Space>
              }
              extra={
                <Button
                  type="primary"
                  icon={<QuestionCircleOutlined />}
                  onClick={() => window.location.reload()}
                >
                  Уже подтвердили почту?
                </Button>
              }
            />
          </Card>
        </div>
      )}
    </div>
  );
}
