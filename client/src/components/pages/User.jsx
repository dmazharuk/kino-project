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
  Progress,
  Modal,
  InputNumber,
} from 'antd';
import axiosInstance, { setAccessToken } from '../../utils/axiosInstanse';
import { useNavigate } from 'react-router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  EyeInvisibleOutlined,
  MailOutlined,
  QuestionCircleOutlined,
  StepForwardOutlined,
  DeleteOutlined,
  LikeOutlined,
  DislikeOutlined,
  NumberOutlined,
} from '@ant-design/icons';
import Search from 'antd/es/transfer/search';

const { useBreakpoint } = Grid;
const { Title, Text, Paragraph } = Typography;

export default function User({ user, setUser }) {
  const navigate = useNavigate();
  const screens = useBreakpoint();

  const [view, setView] = useState([]);
  const [wish, setWish] = useState([]);
  const [look, setLook] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [filterFollowers, setFilterFollowers] = useState(followers);
  const [searchTextFollower, setSearchTextFollower] = useState('');

  const [follow, setFollow] = useState([]);
  const [filterFollow, setFilterFollow] = useState(follow);
  const [searchTextFollow, setSearchTextFollow] = useState('');

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentEpisode, setCurrentEpisode] = useState('');
  const [currentEpisodeTotal, setCurrentEpisodeTotlal] = useState('');
  const [currentMovieId, setCurrentMovieId] = useState('');

  const [isModalVisibleDel, setIsModalVisibleDel] = useState(false);

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
          friend.login.toLowerCase().includes(searchTextFollower.toLowerCase())
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
          friend.login.toLowerCase().includes(searchTextFollow.toLowerCase())
        )
      );
    } else {
      setFilterFollow(follow);
    }
  }, [searchTextFollow, follow]);

  const fetchFunctionUser = async () => {
    try {
      const fetchUser = await axiosInstance.get(`/api/v1.0/user/${user.id}`);
      setUser(fetchUser.data);
    } catch (error) {
      console.error('Ошибка NEN при загрузке данных:', error);
    }
  };

  const fetchFunctionFollow = async () => {
    try {
      const subscriptions = await axiosInstance.get(
        `/api/v1.0/friends/subscriptions/${user.id}`
      );
      setFollow(subscriptions.data[0].friends);
    } catch (error) {
      console.error('Ошибка NEN при загрузке данных:', error);
    }
  };

  const fetchFunctionFollowers = async () => {
    try {
      const followers = await axiosInstance.get(
        `/api/v1.0/friends/followers/${user.id}`
      );
      setFollowers(followers.data[0].followers);
    } catch (error) {
      console.error('Ошибка NEN при загрузке данных:', error);
    }
  };

  const fetchFunctionView = async () => {
    try {
      const movieUser = await axiosInstance.get(`/api/v1.0/view/${user.id}`);

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

      setView(movieUserResponse);
    } catch (error) {
      console.error('Ошибка при загрузке данных:', error);
    }
  };

  const fetchFunctionWish = async () => {
    try {
      const movieUser = await axiosInstance.get(`/api/v1.0/wish/${user.id}`);

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

      setWish(movieUserResponse);
    } catch (error) {
      console.error('Ошибка при загрузке данных:', error);
    }
  };

  const fetchFunctionLook = async () => {
    try {
      const movieUser = await axiosInstance.get(`/api/v1.0/look/${user.id}`);

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

      setLook(movieUserResponse);
    } catch (error) {
      console.error('Ошибка при загрузке данных:', error);
    }
  };

  useEffect(() => {
    fetchFunctionUser();
    fetchFunctionFollow();
    fetchFunctionFollowers();
    fetchFunctionLook();
    fetchFunctionView();
    fetchFunctionWish();
  }, []);

  async function viewMovie(movieId, type) {
    try {
      const response = await axiosInstance.post(`/api/v1.0/view/`, {
        userId: user.id,
        movieId,
        type,
      });
      const movie = look.find((el) => el.movie.id === movieId);
      if (response.status === 201) {
        setView((prev) => [...prev, movie]);
        setLook((prev) => prev.filter((el) => el.movie.id !== movieId));
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function deletedView(movieId, type) {
    try {
      const response = await axiosInstance.put(`/api/v1.0/view/`, {
        userId: user.id,
        movieId,
        type,
      });
      if (response.status === 200) {
        setView((prev) => prev.filter((el) => el.movie.id !== movieId));
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function recommendMovie(movieId, type) {
    try {
      const response = await axiosInstance.post(`/api/v1.0/advice/`, {
        userId: user.id,
        movieId,
        type,
      });
      if (response.status === 201) {
        setView((prev) =>
          prev.map((el) => {
            if (el.movie.id === movieId) {
              el.advice = true;
            }
            return el;
          })
        );
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function delRecommendMovie(movieId, type) {
    try {
      const response = await axiosInstance.put(`/api/v1.0/advice/`, {
        userId: user.id,
        movieId,
        type,
      });
      if (response.status === 200) {
        setView((prev) =>
          prev.map((el) => {
            if (el.movie.id === movieId) {
              el.advice = false;
            }
            return el;
          })
        );
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function deleteWish(movieId, type) {
    try {
      const response = await axiosInstance.put(`/api/v1.0/wish/`, {
        userId: user.id,
        movieId,
        type,
      });
      if (response.status === 200) {
        setWish((prev) => prev.filter((el) => el.movie.id !== movieId));
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function deleteLook(movieId, type) {
    try {
      const response = await axiosInstance.put(`/api/v1.0/look/`, {
        userId: user.id,
        movieId,
        type,
      });
      if (response.status === 200) {
        setLook((prev) => prev.filter((el) => el.movie.id !== movieId));
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function logoutHandler() {
    await axiosInstance.get('/api/v1.0/auth/signout');
    setUser('');
    setAccessToken('');
    navigate('/');
  }

  async function buttonEditLook(movieId, epissode, total) {
    setCurrentEpisode(epissode);
    setCurrentEpisodeTotlal(total);
    setCurrentMovieId(movieId);
    setIsModalVisible(true);
  }

  async function handleOk() {
    try {
      const response = await axiosInstance.post(`/api/v1.0/look/`, {
        userId: user.id,
        movieId: currentMovieId,
        type: 'tv',
        viewed: currentEpisode,
        total: currentEpisodeTotal,
      });
      if (response.status === 201) {
        setIsModalVisible(false);
        setLook((prev) =>
          prev.map((el) => {
            if (el.movieId === currentMovieId) {
              el.viewed = currentEpisode;
            }
            return el;
          })
        );
        setCurrentEpisode('');
        setCurrentEpisodeTotlal('');
        setCurrentMovieId('');
      }
    } catch (error) {
      console.error('Ошибка при загрузке данных:', error);
    }
  }

  function handleCancel() {
    setCurrentEpisode('');
    setCurrentEpisodeTotlal('');
    setCurrentMovieId('');
    setIsModalVisible(false);
  }

  async function deletedUser() {
    setIsModalVisibleDel(true);
  }

  async function handleOkDel() {
    try {
      const response = await axiosInstance.delete(`/api/v1.0/user/${user.id}`);
      if (response.status === 200) {
        logoutHandler();
        setIsModalVisibleDel(false);
      }
    } catch (error) {
      console.log('Ошибка при удалении', error);
    }
  }

  function handleCancelDel() {
    setIsModalVisibleDel(false);
  }

  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      <Row
        justify="space-between"
        align="middle"
        style={{ marginBottom: '24px' }}
      >
        <Col>
          <Title level={2}>Профиль пользователя {user.login}</Title>
        </Col>
        <Col>
          <Button type="primary" danger onClick={logoutHandler}>
            Выйти
          </Button>
        </Col>
      </Row>

      {user.isEmailConfirmed ? (
        <>
          <Card title="Просмотренные фильмы" style={{ marginBottom: '24px' }}>
            {view.length ? (
              <List
                grid={{ gutter: 16, column: getGridColumns() }}
                dataSource={view}
                renderItem={(elem) => (
                  <List.Item key={elem.id}>
                    <Card
                      cover={
                        <img
                          alt={elem.movie.title}
                          src={`https://image.tmdb.org/t/p/w500${elem.movie.poster_path}`}
                          style={{
                            height: '300px',
                            objectFit: 'cover',
                            whiteSpace: 'nowrap',
                          }}
                        />
                      }
                      actions={[
                        <Col key="1000">
                          <Button
                            key="1001"
                            type="text"
                            icon={<DeleteOutlined />}
                            onClick={() =>
                              deletedView(elem.movie.id, elem.type)
                            }
                          >
                            Удалить
                          </Button>
                          {elem.advice ? (
                            <Button
                              type="text"
                              icon={<DislikeOutlined />}
                              onClick={() =>
                                delRecommendMovie(elem.movie.id, elem.type)
                              }
                            >
                              Не pекомендую
                            </Button>
                          ) : (
                            <Button
                              type="text"
                              icon={<LikeOutlined />}
                              onClick={() =>
                                recommendMovie(elem.movie.id, elem.type)
                              }
                            >
                              Рекомендую
                            </Button>
                          )}
                        </Col>,
                      ]}
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
                            <Paragraph ellipsis={{ rows: 2 }}>Фильм</Paragraph>
                          ) : (
                            <Paragraph ellipsis={{ rows: 2 }}>Сериал</Paragraph>
                          )
                        }
                      />
                    </Card>
                  </List.Item>
                )}
              />
            ) : (
              <div>Добавьте свои фильмы</div>
            )}
          </Card>

          <Card title="Рекомендации" style={{ marginBottom: '24px' }}>
            {view.filter((el) => el.advice).length ? (
              <List
                grid={{ gutter: 16, column: getGridColumns() }}
                dataSource={view.filter((el) => el.advice)}
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
                      actions={[
                        <Button
                          key="1002"
                          type="text"
                          icon={<DislikeOutlined />}
                          onClick={() =>
                            delRecommendMovie(elem.movie.id, elem.type)
                          }
                        >
                          Не рекомендую
                        </Button>,
                      ]}
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
                            <Paragraph ellipsis={{ rows: 2 }}>Фильм</Paragraph>
                          ) : (
                            <Paragraph ellipsis={{ rows: 2 }}>Сериал</Paragraph>
                          )
                        }
                      />
                    </Card>
                  </List.Item>
                )}
              />
            ) : (
              <div>Добавьте свои pекомендации</div>
            )}
          </Card>

          <Card title="Хочу посмотреть" style={{ marginBottom: '24px' }}>
            {wish.length ? (
              <List
                grid={{ gutter: 16, column: getGridColumns() }}
                dataSource={wish}
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
                      actions={[
                        <Button
                          key="1003"
                          type="text"
                          icon={<EyeInvisibleOutlined />}
                          onClick={() => deleteWish(elem.movie.id, elem.type)}
                        >
                          Не хочу смотреть
                        </Button>,
                      ]}
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
                            <Paragraph ellipsis={{ rows: 2 }}>Фильм</Paragraph>
                          ) : (
                            <Paragraph ellipsis={{ rows: 2 }}>Сериал</Paragraph>
                          )
                        }
                      />
                    </Card>
                  </List.Item>
                )}
              />
            ) : (
              <div>Добавьте свои pекомендации</div>
            )}
          </Card>

          <Card title="Смотрю сейчас" style={{ marginBottom: '24px' }}>
            {look.length ? (
              <List
                grid={{ gutter: 16, column: getGridColumns() }}
                dataSource={look}
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
                      actions={[
                        <Col key="1004">
                          <Button
                            key="1005"
                            type="text"
                            icon={<StepForwardOutlined />}
                            onClick={() => deleteLook(elem.movie.id, elem.type)}
                          >
                            Не смотрю сейчас
                          </Button>
                          <Button
                            key="1006"
                            type="text"
                            icon={<StepForwardOutlined />}
                            onClick={() => viewMovie(elem.movie.id, elem.type)}
                          >
                            Посмотрел
                          </Button>
                          <Button
                            key="1007"
                            type="text"
                            icon={<NumberOutlined />}
                            onClick={() =>
                              buttonEditLook(
                                elem.movie.id,
                                elem.viewed,
                                elem.total
                              )
                            }
                          >
                            Редактировать
                          </Button>
                        </Col>,
                      ]}
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
                            <>
                              <Paragraph ellipsis={{ rows: 2 }}>
                                Фильм
                              </Paragraph>
                            </>
                          ) : (
                            <>
                              <Paragraph ellipsis={{ rows: 2 }}>
                                Сериал
                              </Paragraph>
                              <Progress
                                percent={Math.round(
                                  (elem.viewed / elem.total) * 100
                                )}
                                status="active"
                              />
                              <Paragraph ellipsis={{ rows: 2 }}>
                                {elem.viewed} из {elem.total} серий
                              </Paragraph>
                            </>
                          )
                        }
                      />
                    </Card>
                  </List.Item>
                )}
              />
            ) : (
              <div>Добавьте сериалы, которые вы смотрите сейчас</div>
            )}
          </Card>

          <Modal
            title="На какой серии вы находитесь?"
            okText="Записать"
            cancelText="Отмена"
            open={isModalVisible}
            onOk={handleOk}
            onCancel={handleCancel}
          >
            <InputNumber
              min={1}
              max={currentEpisodeTotal}
              value={currentEpisode}
              onChange={(value) => setCurrentEpisode(value)}
            />
          </Modal>

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

      <Button
        type="primary"
        danger
        onClick={deletedUser}
        style={{ display: 'block', margin: '0 auto' }}
      >
        Удалить страницу
      </Button>
      <Modal
        title={
          <div
            style={{ fontSize: '18px', fontWeight: 'bold', color: '#ff4d4f' }}
          >
            Вы уверены, что хотите удалить ваш аккаунт?
          </div>
        }
        open={isModalVisibleDel}
        onOk={handleOkDel}
        onCancel={handleCancelDel}
        okText="Да, удалить"
        cancelText="Отмена"
        okButtonProps={{
          style: { backgroundColor: '#ff4d4f', borderColor: '#ff4d4f' },
        }}
        styles={{ body: { padding: '24px', fontSize: '16px' } }}
      >
        <p>
          Все записи, связанные с вашим аккаунтом, также будут удалены. Аккаунт
          не подлежит восстановлению.
        </p>
      </Modal>
    </div>
  );
}
