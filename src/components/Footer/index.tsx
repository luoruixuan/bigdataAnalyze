import { DefaultFooter } from '@ant-design/pro-layout';

export default () => {
  const defaultMessage = "北京大学数字人文中心";
  const currentYear = new Date().getFullYear();

  return (
    <DefaultFooter
      copyright={`${currentYear} ${defaultMessage}`}
      links={[]}
      // links={[
      //   {
      //     key: 'Ant Design Pro',
      //     title: 'Ant Design Pro',
      //     href: 'https://pro.ant.design',
      //     blankTarget: true,
      //   },
      // ]}
    />
  );
};
