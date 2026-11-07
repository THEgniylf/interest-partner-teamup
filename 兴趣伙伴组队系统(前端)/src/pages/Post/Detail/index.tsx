import {
  deletePostUsingPost,
  getPostVoByIdUsingGet,
} from '@/services/backend/postController';
import { doPostFavourUsingPost } from '@/services/backend/postFavourController';
import { doThumbUsingPost } from '@/services/backend/postThumbController';
import { getLoginUserUsingGet } from '@/services/backend/userController';
import {
  EditOutlined,
  HeartFilled,
  HeartOutlined,
  LikeFilled,
  LikeOutlined,
  StarFilled,
  StarOutlined,
  DeleteOutlined,
  ArrowLeftOutlined,
} from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import { Avatar, Button, Card, Descriptions, Popconfirm, Space, Tag, Typography, message } from 'antd';
import React, { useEffect, useState } from 'react';
import { history, useParams } from '@umijs/max';

const { Title, Paragraph } = Typography;

const PostDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<API.PostVO | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentUserId, setCurrentUserId] = useState<string | undefined>();

  const loadPost = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const res = await getPostVoByIdUsingGet({ id });
      if (res.code === 0 && res.data) {
        setPost(res.data);
      } else {
        message.error(res.message || '获取帖子失败');
      }
    } catch (error: any) {
      message.error(error.message || '获取帖子失败');
    } finally {
      setLoading(false);
    }
  };

  const loadCurrentUser = async () => {
    try {
      const res = await getLoginUserUsingGet();
      if (res.code === 0 && res.data) {
        setCurrentUserId(res.data.id);
      }
    } catch {
    }
  };

  useEffect(() => {
    loadPost();
    loadCurrentUser();
  }, [id]);

  const handleThumb = async () => {
    if (!id) return;
    try {
      const res = await doThumbUsingPost({ postId: id });
      if (res.code === 0) {
        message.success(post?.hasThumb ? '取消点赞' : '点赞成功');
        setPost((prev) =>
          prev
            ? {
                ...prev,
                hasThumb: !prev.hasThumb,
                thumbNum: (prev.thumbNum || 0) + (prev.hasThumb ? -1 : 1),
              }
            : prev,
        );
      } else {
        message.error(res.message || '操作失败');
      }
    } catch (error: any) {
      message.error(error.message || '操作失败');
    }
  };

  const handleFavour = async () => {
    if (!id) return;
    try {
      const res = await doPostFavourUsingPost({ postId: id });
      if (res.code === 0) {
        message.success(post?.hasFavour ? '取消收藏' : '收藏成功');
        setPost((prev) =>
          prev
            ? {
                ...prev,
                hasFavour: !prev.hasFavour,
                favourNum: (prev.favourNum || 0) + (prev.hasFavour ? -1 : 1),
              }
            : prev,
        );
      } else {
        message.error(res.message || '操作失败');
      }
    } catch (error: any) {
      message.error(error.message || '操作失败');
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    try {
      const res = await deletePostUsingPost({ id });
      if (res.code === 0) {
        message.success('删除成功');
        history.push('/post');
      } else {
        message.error(res.message || '删除失败');
      }
    } catch (error: any) {
      message.error(error.message || '删除失败');
    }
  };

  const isOwner = post?.userId === currentUserId;

  return (
    <PageContainer
      loading={loading}
      breadcrumb={{
        items: [
          { title: '帖子大厅' },
          { title: post?.title || '帖子详情' },
        ],
      }}
      title={post?.title || '帖子详情'}
      onBack={() => history.back()}
      extra={
        isOwner ? (
          <Space>
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={() => history.push(`/post/update/${id}`)}
            >
              编辑
            </Button>
            <Popconfirm
              title="确定要删除这个帖子吗？"
              onConfirm={handleDelete}
              okText="删除"
              cancelText="取消"
            >
              <Button danger icon={<DeleteOutlined />}>
                删除
              </Button>
            </Popconfirm>
          </Space>
        ) : null
      }
    >
      {post && (
        <>
          <Card>
            <Descriptions column={1}>
              <Descriptions.Item label="发布者">
                <Space>
                  <Avatar src={post.user?.userAvatar} />
                  <span>{post.user?.userName}</span>
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="标签">
                <Space size={[0, 8]} wrap>
                  {post.tagList?.map((tag) => (
                    <Tag key={tag} color="blue">
                      {tag}
                    </Tag>
                  ))}
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="创建时间">{post.createTime}</Descriptions.Item>
              <Descriptions.Item label="更新时间">{post.updateTime}</Descriptions.Item>
            </Descriptions>
          </Card>

          <Card style={{ marginTop: 16 }} title="帖子内容">
            <Paragraph style={{ fontSize: 16, lineHeight: 1.8 }}>{post.content}</Paragraph>
          </Card>

          <Card style={{ marginTop: 16 }}>
            <Space size="large">
              <Button
                type={post.hasThumb ? 'primary' : 'default'}
                icon={post.hasThumb ? <LikeFilled /> : <LikeOutlined />}
                onClick={handleThumb}
              >
                {post.thumbNum || 0} 点赞
              </Button>
              <Button
                type={post.hasFavour ? 'primary' : 'default'}
                icon={post.hasFavour ? <StarFilled /> : <StarOutlined />}
                onClick={handleFavour}
              >
                {post.favourNum || 0} 收藏
              </Button>
              <Button icon={<ArrowLeftOutlined />} onClick={() => history.push('/post')}>
                返回列表
              </Button>
            </Space>
          </Card>
        </>
      )}
    </PageContainer>
  );
};

export default PostDetailPage;
