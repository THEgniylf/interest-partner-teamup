import { listMyPostVoByPageUsingPost } from '@/services/backend/postController';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { Avatar, Button, Space, Tag, message } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import React, { useRef } from 'react';
import { history } from '@umijs/max';

const PostMyPage: React.FC = () => {
  const actionRef = useRef<ActionType>();

  const columns: ProColumns<API.PostVO>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 80,
      hideInSearch: true,
    },
    {
      title: '标题',
      dataIndex: 'title',
      valueType: 'text',
      ellipsis: true,
    },
    {
      title: '标签',
      dataIndex: 'tagList',
      render: (_, record) => (
        <Space size={[0, 4]} wrap>
          {record.tagList?.map((tag) => (
            <Tag key={tag} color="blue">
              {tag}
            </Tag>
          ))}
        </Space>
      ),
      hideInSearch: true,
    },
    {
      title: '作者',
      dataIndex: ['user', 'userName'],
      render: (_, record) => (
        <Space>
          <Avatar size="small" src={record.user?.userAvatar} />
          <span>{record.user?.userName}</span>
        </Space>
      ),
      hideInSearch: true,
    },
    {
      title: '点赞',
      dataIndex: 'thumbNum',
      width: 80,
      hideInSearch: true,
    },
    {
      title: '收藏',
      dataIndex: 'favourNum',
      width: 80,
      hideInSearch: true,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      valueType: 'dateTime',
      width: 170,
      hideInSearch: true,
    },
    {
      title: '操作',
      valueType: 'option',
      width: 150,
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            size="small"
            onClick={() => history.push(`/post/detail/${record.id}`)}
          >
            查看
          </Button>
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => history.push(`/post/update/${record.id}`)}
          >
            编辑
          </Button>
        </Space>
      ),
      hideInSearch: true,
    },
  ];

  return (
    <PageContainer
      title="我的帖子"
      subTitle="管理你发布的所有帖子"
      extra={[
        <Button
          type="primary"
          key="add"
          icon={<PlusOutlined />}
          onClick={() => history.push('/post/add')}
        >
          发布新帖子
        </Button>,
      ]}
    >
      <ProTable<API.PostVO>
        headerTitle="我的帖子列表"
        actionRef={actionRef}
        rowKey="id"
        columns={columns}
        search={{
          labelWidth: 80,
        }}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `共 ${total} 条`,
        }}
        request={async (params, sort) => {
          const sortField = Object.keys(sort)?.[0];
          const sortOrder = sort?.[sortField] ?? undefined;

          const queryParams: API.PostQueryRequest = {
            current: params.current,
            pageSize: params.pageSize,
            sortField,
            sortOrder,
            title: params.title,
          };

          try {
            const res = await listMyPostVoByPageUsingPost(queryParams);
            return {
              success: res.code === 0,
              data: res.data?.records || [],
              total: Number(res.data?.total) || 0,
            };
          } catch (error: any) {
            message.error(error.message || '获取数据失败');
            return {
              success: false,
              data: [],
              total: 0,
            };
          }
        }}
      />
    </PageContainer>
  );
};

export default PostMyPage;
