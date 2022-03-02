import { PageContainer } from '@ant-design/pro-layout';
import { history } from 'umi';
import AdvancedSearch from './AdvancedSearch';

const tabList = [
  {
    key: 'book',
    tab: '书目结果',
  },
  {
    key: 'content',
    tab: '全文结果',
  },
];

export function SearchPage(props: any) {
  const handleTabChange = (key: string) => {
    const { match } = props;
    const url = match.url === '/' ? '' : match.url;
    switch (key) {
      case 'book':
        history.push(`${url}/book?`);
        break;
      case 'content':
        history.push(`${url}/content?`);
        break;
      default:
        break;
    }
  };

  const getTabKey = () => {
    const { match, location } = props;
    const url = match.path === '/' ? '' : match.path;
    const tabKey = location.pathname.replace(`${url}/`, '');
    if (tabKey && tabKey !== '/') {
      return tabKey;
    }
    return 'result';
  };

  return (
    <PageContainer
      content={<AdvancedSearch></AdvancedSearch>}
      title={'典籍查询'}
      tabList={tabList}
      tabActiveKey={getTabKey()}
      onTabChange={handleTabChange}
    >
      {props.children}
    </PageContainer>
  );
}

export default SearchPage;
