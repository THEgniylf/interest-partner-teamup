import { getLoginUserUsingGet, updateMyUserUsingPost } from '@/services/backend/userController';
import { PageContainer } from '@ant-design/pro-components';
import { ProFormText, ProFormTextArea } from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import { Avatar, Button, Card, Col, Descriptions, Row, Space, Tag, message } from 'antd';
import React, { useEffect, useState } from 'react';

const UserProfilePage: React.FC = () => {
  const { initialState, setInitialState } = useModel('@@initialState');
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    userName: '',
    userAvatar: '',
    userProfile: '',
  });

  const loadUserInfo = async () => {
    setLoading(true);
    try {
      const res = await getLoginUserUsingGet();
      if (res.code === 0 && res.data) {
        setFormData({
          userName: res.data.userName || '',
          userAvatar: res.data.userAvatar || '',
          userProfile: res.data.userProfile || '',
        });
        setInitialState({
          ...initialState,
          currentUser: res.data,
        });
      }
    } catch (error: any) {
      message.error(error.message || '获取用户信息失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUserInfo();
  }, []);

  const handleSave = async () => {
    try {
      const res = await updateMyUserUsingPost(formData);
      if (res.code === 0) {
        message.success('保存成功');
        setEditMode(false);
        loadUserInfo();
      } else {
        message.error(res.message || '保存失败');
      }
    } catch (error: any) {
      message.error(error.message || '保存失败');
    }
  };

  const currentUser = initialState?.currentUser;

  return (
    <PageContainer
      title="个人中心"
      subTitle="管理你的个人信息"
    >
      <Row gutter={16}>
        <Col xs={24} md={8}>
          <Card loading={loading} style={{ textAlign: 'center' }}>
            <Avatar
              size={120}
              src={formData.userAvatar || currentUser?.userAvatar}
              style={{ marginBottom: 16 }}
            />
            <h2 style={{ marginBottom: 8 }}>
              {currentUser?.userName || formData.userName || '未命名用户'}
            </h2>
            <Space>
              <Tag color={currentUser?.userRole === 'admin' ? 'red' : 'blue'}>
                {currentUser?.userRole === 'admin' ? '管理员' : '普通用户'}
              </Tag>
            </Space>
            <p style={{ marginTop: 16, color: '#666' }}>
              {formData.userProfile || currentUser?.userProfile || '这个人很懒，什么都没留下'}
            </p>
          </Card>
        </Col>

        <Col xs={24} md={16}>
          {!editMode ? (
            <Card
              title="基本信息"
              extra={
                <Button type="primary" onClick={() => setEditMode(true)}>
                  编辑资料
                </Button>
              }
            >
              <Descriptions column={1} bordered>
                <Descriptions.Item label="用户ID">{currentUser?.id}</Descriptions.Item>
                <Descriptions.Item label="昵称">
                  {formData.userName || currentUser?.userName || '-'}
                </Descriptions.Item>
                <Descriptions.Item label="角色">
                  {currentUser?.userRole === 'admin' ? '管理员' : '普通用户'}
                </Descriptions.Item>
                <Descriptions.Item label="简介">
                  {formData.userProfile || currentUser?.userProfile || '-'}
                </Descriptions.Item>
                <Descriptions.Item label="创建时间">{currentUser?.createTime}</Descriptions.Item>
              </Descriptions>
            </Card>
          ) : (
            <Card
              title="编辑资料"
              extra={
                <Space>
                  <Button onClick={() => setEditMode(false)}>取消</Button>
                  <Button type="primary" onClick={handleSave}>
                    保存
                  </Button>
                </Space>
              }
            >
              <ProFormText
                name="userName"
                label="昵称"
                fieldProps={{
                  maxLength: 30,
                  showCount: true,
                  value: formData.userName,
                  onChange: (e: any) =>
                    setFormData((prev) => ({ ...prev, userName: e.target.value })),
                }}
              />
              <ProFormText
                name="userAvatar"
                label="头像地址"
                placeholder="请输入头像图片URL"
                fieldProps={{
                  value: formData.userAvatar,
                  onChange: (e: any) =>
                    setFormData((prev) => ({ ...prev, userAvatar: e.target.value })),
                }}
              />
              <ProFormTextArea
                name="userProfile"
                label="个人简介"
                placeholder="介绍一下自己吧~"
                fieldProps={{
                  rows: 4,
                  maxLength: 200,
                  showCount: true,
                  value: formData.userProfile,
                  onChange: (e: any) =>
                    setFormData((prev) => ({ ...prev, userProfile: e.target.value })),
                }}
              />
            </Card>
          )}
        </Col>
      </Row>
    </PageContainer>
  );
};

export default UserProfilePage;
