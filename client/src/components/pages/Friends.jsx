/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import { Card, List, Input, Button } from 'antd';
import { UserAddOutlined, UserDeleteOutlined } from '@ant-design/icons';
import axiosInstance from '../../utils/axiosInstanse';

const { Search } = Input;

export default function Friends({ user }) {
  const [users, setUsers] = useState([]);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    async function fetchUsers() {
      try {
        let usersDB = await axiosInstance.get(`/api/v1.0/user/`);
        usersDB = usersDB.data.filter((el) => el.id !== user.id);
        const usersWithFriendship = await Promise.all(
          usersDB.map(async (friend) => {
            const friendship = await axiosInstance.get(`/api/v1.0/friends`, {
              params: { userId: user.id, friendId: friend.id },
            });
            return {
              ...friend,
              friendship: !!friendship.data,
            };
          })
        );

        setUsers(usersWithFriendship);
      } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
      }
    }

    fetchUsers();
  }, [user]);

  const filteredUsers = users.filter((user) =>
    user.login.toLowerCase().includes(searchText.toLowerCase())
  );

  async function subscribe(friend) {
    try {
      const response = await axiosInstance.post(`/api/v1.0/friends`, {
        userId: user.id,
        friendId: friend.id,
      });
      if (response.status === 200) {
        setUsers((prev) =>
          prev.map((el) => {
            if (el.id === friend.id) {
              el.friendship = true;
            }
            return el;
          })
        );
      }
    } catch (error) {
      console.error('Ошибка при загрузке данных:', error);
    }
  }

  async function unsubscribe(friend) {
    try {
      const response = await axiosInstance.delete(`/api/v1.0/friends`, {
        data: {
          userId: user.id,
          friendId: friend.id,
        },
      });
      if (response.status === 200) {
        setUsers((prev) =>
          prev.map((el) => {
            if (el.id === friend.id) {
              el.friendship = false;
            }
            return el;
          })
        );
      }
    } catch (error) {
      console.error('Ошибка при загрузке данных:', error);
    }
  }

  return (
    <div>
      <Card title="Все пользователи" style={{ marginBottom: '24px' }}>
        <Search
          placeholder="Поиск пользователей"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ marginBottom: '16px' }}
        />

        <List
          dataSource={filteredUsers}
          renderItem={(user) => (
            <List.Item
              actions={[
                !user.friendship ? (
                  <Button
                    key=""
                    type="primary"
                    icon={<UserAddOutlined />}
                    onClick={() => subscribe(user)}
                  >
                    Подписаться
                  </Button>
                ) : (
                  <Button
                    key=""
                    icon={<UserDeleteOutlined />}
                    onClick={() => unsubscribe(user)}
                  >
                    Отписаться
                  </Button>
                ),
              ]}
            >
              <List.Item.Meta
                title={<a href={`/users/${user.login}`}>{user.login}</a>}
              />
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
}
