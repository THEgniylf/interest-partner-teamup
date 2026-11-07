import { listPostVoByPageUsingPost, searchPostVoByPageUsingPost } from '@/services/backend/postController';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { Avatar, Button, Card, Col, Input, Row, Space, Tag, Typography, message } from 'antd';
import React, { useRef, useState } from 'react';
import { history } from '@umijs/max';

const PostListPage: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [searchText, setSearchText] = useState<string>('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const hotTags = [
    '游戏组队',
    '运动健身',
    '学习交流',
    '旅行结伴',
    '音乐爱好',
    '摄影约拍',
    '美食探店',
    '读书会',
  ];

  const columns: ProColumns<API.PostVO>[] = [
    {
      title: '标题',
      dataIndex: 'title',
      valueType: 'text',
      ellipsis: true,
      fieldProps: {
        style: { width: '100%' },
      },
    },
    {
      title: '标签',
      dataIndex: 'tagList',
      valueType: 'select',
      render: (_, record) => (
        <Space size={[0, 4]} wrap>
          {record.tagList?.map((tag) => (
            <Tag key={tag} color="blue">
              {tag}
            </Tag>
          ))}
        </Space>
      ),
    },
    {
      title: '作者',
      dataIndex: ['user', 'userName'],
      valueType: 'text',
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
      valueType: 'digit',
      width: 80,
      hideInSearch: true,
    },
    {
      title: '收藏',
      dataIndex: 'favourNum',
      valueType: 'digit',
      width: 80,
      hideInSearch: true,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      valueType: 'dateTime',
      hideInSearch: true,
      width: 170,
    },
  ];

  return (
    <PageContainer
      title="帖子大厅"
      subTitle="发现志同道合的伙伴"
      extra={[
        <Button
          type="primary"
          key="add"
          icon={<PlusOutlined />}
          onClick={() => history.push('/post/add')}
        >
          发布帖子
        </Button>,
      ]}
    >
      <Card style={{ marginBottom: 16 }}>
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Input.Search
              placeholder="搜索帖子标题或内容"
              allowClear
              enterButton={<Button icon={<SearchOutlined />}>搜索</Button>}
              size="large"
              onSearch={(value) => {
                setSearchText(value);
                actionRef.current?.reload();
              }}
              onChange={(e) => {
                if (!e.target.value) {
                  setSearchText('');
                  actionRef.current?.reload();
                }
              }}
            />
          </Col>
          <Col span={24}>
            <Typography.Text strong style={{ marginRight: 8 }}>
              热门标签：
            </Typography.Text>
            <Space size={[8, 8]} wrap>
              {hotTags.map((tag) => (
                <Tag.CheckableTag
                  key={tag}
                  checked={selectedTags.includes(tag)}
                  onChange={(checked) => {
                    if (checked) {
                      setSelectedTags([...selectedTags, tag]);
                    } else {
                      setSelectedTags(selectedTags.filter((t) => t !== tag));
                    }
                    actionRef.current?.reload();
                  }}
                >
                  {tag}
                </Tag.CheckableTag>
              ))}
            </Space>
          </Col>
        </Row>
      </Card>

      <ProTable<API.PostVO>
        headerTitle="全部帖子"
        actionRef={actionRef}
        rowKey="id"
        columns={columns}
        search={{
          labelWidth: 100,
          defaultCollapsed: true,
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
            content: params.content,
            tags: params.tagList,
          };

          let res;
          if (searchText) {
            queryParams.searchText = searchText;
            res = await searchPostVoByPageUsingPost(queryParams);
          } else {
            res = await listPostVoByPageUsingPost(queryParams);
          }

          if (selectedTags.length > 0) {
            queryParams.tags = selectedTags;
            res = await listPostVoByPageUsingPost(queryParams);
          }

          return {
            success: res.code === 0,
            data: res.data?.records || [],
            total: Number(res.data?.total) || 0,
          };
        }}
        onRow={(record) => ({
          onClick: () => {
            history.push(`/post/detail/${record.id}`);
          },
        })}
      />
    </PageContainer>
  );
};

export default PostListPage;
