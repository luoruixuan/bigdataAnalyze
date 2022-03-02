import { PageContainer } from '@ant-design/pro-layout';
import { Card, Carousel, Tree, Typography } from 'antd';
const { Title, Paragraph, Text, Link } = Typography;

export default function IndexPage() {
  const treeData = [
    {
      title: '思想哲学类',
      key: '0-0',
      children: [
        {
          title: '儒家',
          key: '0-0-0',
          children: [
            {
              title: '论语',
              key: '0-0-0-0',
              children: [
                { title: '学而第一', key: '0-0-0-0-1' },
                { title: '为政第二', key: '0-0-0-0-2' },
                { title: '八佾第三', key: '0-0-0-0-3' },
                { title: '八佾第四', key: '0-0-0-0-4' },
                { title: '公冶長第五', key: '0-0-0-0-5' },
              ],
            },
            { title: '孟子', key: '0-0-0-1' },
            { title: '礼记', key: '0-0-0-2' },
          ],
        },
        {
          title: '墨家',
          key: '0-0-1',
          children: [{ title: '墨子', key: '0-0-1-0' }],
        },
        {
          title: '道家',
          key: '0-0-2',
          children: [
            { title: '庄子', key: '0-0-2-0' },
            { title: '道德经', key: '0-0-2-1' },
          ],
        },
      ],
    },
    {
      title: '历史类',
      key: '0-1',
      children: [
        {
          title: 'parent 2-0',
          key: '断代史',
          children: [
            { title: 'leaf', key: '0-1-0-0' },
            { title: 'leaf', key: '0-1-0-1' },
          ],
        },
        {
          title: 'parent 2-1',
          key: '通史',
          children: [
            { title: 'leaf', key: '0-1-1-0' },
            { title: 'leaf', key: '0-1-1-1' },
          ],
        },
      ],
    },
  ];

  const onSelect = (selectedKeys: React.Key[], info: any) => {
    console.log('selected', selectedKeys[0]);
    console.log('info', info);
    window.location.href = '/book/论语';
  };

  const contentStyle = {
    height: '160px',
    color: '#fff',
    lineHeight: '160px',
    textAlign: 'center',
    background: '#364d79',
  };

  return (
    <PageContainer>
      <Card
        style={{ marginTop: 24 }}
        bordered={false}
        bodyStyle={{ padding: '32px 32px 32px 32px' }}
      >
        <Typography>
          <Title level={4}>系统简介</Title>
          <Paragraph>古籍大数据分析平台是XXXXXXXXXXXXXXXXX</Paragraph>
          <Title level={4}>数据说明</Title>
          <Paragraph>
            本项目的数据集来源为XXX，具体包括：
            <Tree showLine={true} onSelect={onSelect} treeData={treeData} />
          </Paragraph>
          <Title level={4}>功能概览</Title>
          <Paragraph>
            <Carousel autoplay>
              <div>
                <h3 style={contentStyle}>典籍检索</h3>
              </div>
              <div>
                <h3 style={contentStyle}>复用分析</h3>
              </div>
              <div>
                <h3 style={contentStyle}>词频统计</h3>
              </div>
              <div>
                <h3 style={contentStyle}>词义演化</h3>
              </div>
            </Carousel>
          </Paragraph>
        </Typography>
      </Card>
    </PageContainer>
  );
}
