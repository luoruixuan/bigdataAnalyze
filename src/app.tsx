import {
  BasicLayoutProps,
  Settings as LayoutSettings,
} from '@ant-design/pro-layout';
import Footer from '@/components/Footer';
import RightContent from '@/components/RightContent';

export const layout = ({
  initialState,
}: {
  initialState: { settings?: LayoutSettings };
}): BasicLayoutProps => {
  return {
    footerRender: () => <Footer />,
    // headerRender: false,  //不显示顶栏
    rightContentRender: () => <RightContent />,
    menuHeaderRender: undefined,
    // menu: {locale:true},
    ...initialState?.settings,
  };
};

export const locale = {
  default: 'ch-ZN',
};
