/* eslint-disable react/prop-types */
import { useState } from 'react';
import { Menu, AutoComplete, Spin, Input, Tag } from 'antd';
import { NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { SearchOutlined } from '@ant-design/icons';

const API_KEY = import.meta.env.VITE_API_KEY;
const API_URL = import.meta.env.VITE_API_URL;

export default function NavigationBar({ user }) {
  const navigate = useNavigate();
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [current, setCurrent] = useState('');

  const onSearch = async (query) => {
    if (!query) {
      setSearchResults([]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.get(`${API_URL}/search/multi`, {
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${API_KEY}`,
        },
        params: {
          query: query,
          language: 'ru-RU',
        },
      });
      setSearchResults(response.data.results);
    } catch (error) {
      console.error('Ошибка при поиске фильмов:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onClick = (e) => {
    setCurrent(e.key);
  };

  const items = [
    {
      key: 'main',
      label: (
        <NavLink to="/" rel="noopener noreferrer">
          Главная
        </NavLink>
      ),
    },
    {
      key: 'friends',
      label: (
        <NavLink to="/friends" rel="noopener noreferrer">
          Пользователи
        </NavLink>
      ),
    },
    ...(user
      ? [
          {
            key: 'profile',
            label: (
              <NavLink to="/user" rel="noopener noreferrer">
                Привет, {user.login}
              </NavLink>
            ),
          },
        ]
      : [
          {
            key: 'sign',
            label: (
              <NavLink to="/sign" rel="noopener noreferrer">
                Войти
              </NavLink>
            ),
          },
        ]),
  ];

  const searchOptions = searchResults.map((movie) => ({
    key: movie.id,
    type: movie.media_type,
    value: movie.title || movie.name,
    label: (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <img
          src={
            movie.poster_path
              ? `https://image.tmdb.org/t/p/w92${movie.poster_path}`
              : 'https://via.placeholder.com/92x138?text=No+Poster'
          }
          alt={movie.title || movie.name}
          style={{ width: '40px', marginRight: '10px', borderRadius: '4px' }}
        />
        <div>
          <div>{movie.title || movie.name}</div>
          <div>
            <Tag color={movie.media_type === 'movie' ? 'blue' : 'green'}>
              {movie.media_type === 'movie' ? 'Фильм' : 'Сериал'}
            </Tag>
          </div>
        </div>
      </div>
    ),
  }));

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        backgroundColor: '#fff',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      }}
    >
      <Menu
        onClick={onClick}
        selectedKeys={[current]}
        mode="horizontal"
        items={items}
        style={{
          flex: 1,
          borderBottom: 'none',
          lineHeight: '70px',
          fontSize: '20px',
        }}
      />
      <AutoComplete
        options={searchOptions}
        onSearch={onSearch}
        onSelect={(value, option) => {
          navigate(
            `/${option.type === 'movie' ? 'movie' : 'tv'}/${option.key}`
          );
        }}
        placeholder="Поиск фильмов..."
        notFoundContent={
          isLoading ? <Spin size="small" /> : 'Ничего не найдено'
        }
        style={{ width: '300px', marginLeft: '24px' }}
        dropdownStyle={{
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        }}
        dropdownRender={(menu) => (
          <div
            style={{
              padding: '8px',
              borderRadius: '8px',
              backgroundColor: '#fff',
            }}
          >
            {menu}
          </div>
        )}
      >
        <Input
          suffix={<SearchOutlined style={{ color: 'rgba(0, 0, 0, 0.25)' }} />}
          style={{ borderRadius: '20px' }}
        />
      </AutoComplete>
    </div>
  );
}
