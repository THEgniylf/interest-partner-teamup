import { PageContainer } from '@ant-design/pro-components';
import { Card, theme, Typography } from 'antd';
import React from 'react';

const Welcome: React.FC = () => {
  const { token } = theme.useToken();
  return (
    <PageContainer>
      <Card
        style={{ borderRadius: 8 }}
        bodyStyle={{
          backgroundImage:
            'background-image: linear-gradient(75deg, #FBFDFF 0%, #F5F7FF 100%)',
        }}
      >
        <div
          style={{
            backgroundPosition: '100% -30%',
            backgroundRepeat: 'no-repeat',
            backgroundSize: '274px auto',
          }}
        >
          <div style={{ fontSize: '28px', color: token.colorTextHeading, fontWeight: 600 }}>
            🎉 欢迎来到兴趣伙伴组队系统
          </div>
          <Typography.Paragraph
            style={{
              fontSize: '16px',
              color: token.colorTextSecondary,
              lineHeight: '28px',
              marginTop: 16,
              marginBottom: 32,
              width: '80%',
            }}
          >
            发现志同道合的伙伴，一起组队探索新世界！在这个平台上，你可以发布兴趣帖子、寻找组队伙伴、
            收藏感兴趣的内容，让你的课余生活更加精彩。
          </Typography.Paragraph>
        </div>
      </Card>
    </PageContainer>
  );
};

export default Welcome;
