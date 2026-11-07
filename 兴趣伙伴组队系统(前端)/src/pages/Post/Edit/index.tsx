import {
  addPostUsingPost,
  editPostUsingPost,
  getPostVoByIdUsingGet,
} from '@/services/backend/postController';
import { PageContainer } from '@ant-design/pro-components';
import { ProFormText, ProFormTextArea } from '@ant-design/pro-components';
import { Button, Card, Space, Tag, message } from 'antd';
import React, { useEffect, useState } from 'react';
import { history, useParams } from '@umijs/max';

const hotTags = [
  '游戏组队',
  '运动健身',
  '学习交流',
  '旅行结伴',
  '音乐爱好',
  '摄影约拍',
  '美食探店',
  '读书分享',
];

const PostEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;
  const [formData, setFormData] = useState<{
    title: string;
    content: string;
    tags: string[];
  }>({
    title: '',
    content: '',
    tags: [],
  });
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isEdit && id) {
      setLoading(true);
      getPostVoByIdUsingGet({ id })
        .then((res) => {
          if (res.code === 0 && res.data) {
            setFormData({
              title: res.data.title || '',
              content: res.data.content || '',
              tags: res.data.tagList || [],
            });
          } else {
            message.error(res.message || '获取帖子失败');
          }
        })
        .catch((error: any) => {
          message.error(error.message || '获取帖子失败');
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [id, isEdit]);

  const handleTagClick = (tag: string) => {
    setFormData((prev) => {
      const tags = prev.tags.includes(tag)
        ? prev.tags.filter((t) => t !== tag)
        : [...prev.tags, tag];
      return { ...prev, tags };
    });
  };

  const handleSubmit = async () => {
    if (!formData.title.trim()) {
      message.error('请输入标题');
      return;
    }
    if (!formData.content.trim()) {
      message.error('请输入内容');
      return;
    }
    setSubmitting(true);
    try {
      if (isEdit && id) {
        const res = await editPostUsingPost({
          id,
          title: formData.title,
          content: formData.content,
          tags: formData.tags,
        });
        if (res.code === 0) {
          message.success('更新成功');
          history.push(`/post/detail/${id}`);
        } else {
          message.error(res.message || '更新失败');
        }
      } else {
        const res = await addPostUsingPost({
          title: formData.title,
          content: formData.content,
          tags: formData.tags,
        });
        if (res.code === 0) {
          message.success('发布成功');
          history.push(`/post/detail/${res.data}`);
        } else {
          message.error(res.message || '发布失败');
        }
      }
    } catch (error: any) {
      message.error(error.message || '操作失败');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageContainer
      loading={loading}
      title={isEdit ? '编辑帖子' : '发布帖子'}
      subTitle="分享你的兴趣，找到志同道合的伙伴"
    >
      <Card>
        <ProFormText
          name="title"
          label="标题"
          rules={[{ required: true, message: '请输入标题' }]}
          placeholder="给你的帖子起个响亮的标题吧"
          fieldProps={{
            size: 'large',
            maxLength: 100,
            showCount: true,
            value: formData.title,
            onChange: (e) => setFormData((prev) => ({ ...prev, title: e.target.value })),
          }}
        />

        <div style={{ marginBottom: 24 }}>
          <div style={{ marginBottom: 8, fontWeight: 500 }}>选择标签（可多选）</div>
          <Space size={[8, 8]} wrap>
            {hotTags.map((tag) => (
              <Tag.CheckableTag
                key={tag}
                checked={formData.tags.includes(tag)}
                onChange={() => handleTagClick(tag)}
              >
                {tag}
              </Tag.CheckableTag>
            ))}
          </Space>
        </div>

        <ProFormTextArea
          name="content"
          label="内容"
          rules={[{ required: true, message: '请输入内容' }]}
          placeholder="详细描述一下你的需求吧..."
          fieldProps={{
            rows: 10,
            maxLength: 5000,
            showCount: true,
            value: formData.content,
            onChange: (e) => setFormData((prev) => ({ ...prev, content: e.target.value })),
          }}
        />

        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <Space size="large">
            <Button size="large" onClick={() => history.back()}>
              取消
            </Button>
            <Button
              type="primary"
              size="large"
              loading={submitting}
              onClick={handleSubmit}
            >
              {isEdit ? '保存修改' : '立即发布'}
            </Button>
          </Space>
        </div>
      </Card>
    </PageContainer>
  );
};

export default PostEditPage;
