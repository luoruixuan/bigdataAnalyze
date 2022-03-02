import { PageContainer } from '@ant-design/pro-layout';
import { Alert, Card, Tabs, Typography, Table, Button } from 'antd';
const { Title } = Typography;

function warpTag(content: string, keyword: string, tagName: string) {
  if (content === '') {
    return content;
  }
  const a = content.toLowerCase();
  const b = keyword.toLowerCase();

  const indexof = a.indexOf(b);
  const c = indexof > -1 ? content.substr(indexof, keyword.length) : '';
  const val = `<${tagName} style="color:red">${c}</${tagName}>`;
  const regS = new RegExp(keyword, 'gi');
  const node = new DOMParser().parseFromString(
    content.replace(regS, val),
    'text/html',
  ).body.childNodes;
  return content.replace(regS, val);
}

function NestedTable(props: any) {
  console.log(props.keyword);

  const columns = [
    {
      title: '序号',
      width: '10%',
      render: (text: any, record: any, index: number) => `${index + 1}`,
    },
    {
      title: '复用文本',
      dataIndex: 'text',
      key: 'text',
      width: '70%',
      render: (text: any, records: any) => (
        <div
          dangerouslySetInnerHTML={{
            __html: warpTag(text, props.keyword, 'span'),
          }}
        ></div>
      ),
    },
    {
      title: '所属篇目',
      dataIndex: 'book',
      key: 'book',
      width: '20%',
      render: (_: any, records: any) => (
        <a href={`/book/${records.book}`}>
          {records.book}-{records.chapter}
        </a>
      ),
    },
  ];

  const data = [
    {
      key: '11',
      text: '「學而時習之」，「鷹乃學習」之義。「子路有聞，未之能行，唯恐有聞。」人不知而不慍。',
      book: '二程外書',
      chapter: '章节XX',
    },
    {
      key: '12',
      text: '「學而時習之」，「鷹乃學習」之義。「子路有聞，未之能行，唯恐有聞。」人不知而不慍。',
      book: '二程外書',
      chapter: '章节XX',
    },
    {
      key: '13',
      text: '「學而時習之」，「鷹乃學習」之義。「子路有聞，未之能行，唯恐有聞。」人不知而不慍。',
      book: '二程外書',
      chapter: '章节XX',
    },
  ];

  return <Table columns={columns} dataSource={data} pagination={false} />;
}

function sentenceBrowse(props: any) {
  const routes: never[] = [];
  console.log(`${props.match.params.SentenceId}`);

  return (
    <PageContainer title={false} breadcrumb={{ routes }}>
      <Card>
        <Title level={3}>
          子曰：「
          <span
            style={{ backgroundColor: '#F5A9A9' }}
            onClick={() => {
              document.getElementById('學而時習之')?.scrollIntoView();
            }}
          >
            學而時習之
          </span>
          ，不亦說乎？有朋自遠方來，不亦樂乎？
          <span
            style={{ backgroundColor: '#F5A9A9' }}
            onClick={() => {
              document.getElementById('人不知而不慍')?.scrollIntoView();
            }}
          >
            人不知而不慍
          </span>
          ，不亦君子乎？
        </Title>
        <div style={{ paddingTop: 20, paddingBottom: 20 }}>
          <Alert
            message="该句在本系统所收录的所有书目中共复用XXX次"
            type="success"
            showIcon
          />
        </div>

        <Title level={4} id="學而時習之">
          學而時習之
        </Title>
        <NestedTable keyword={'學而時習之'} />
        <br></br>
        <Title level={4} id="人不知而不慍">
          人不知而不慍
        </Title>
        <NestedTable keyword={'人不知而不慍'} />
      </Card>
    </PageContainer>
  );
}

export default sentenceBrowse;
