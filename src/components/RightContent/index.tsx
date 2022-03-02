import { Space } from 'antd';
import { SelectLang } from 'umi';
import UserDropdown from './UserDropdown';
import { getLocale } from 'umi';

export default () => {
  // console.log(getLocale());
  return (
    <Space>
      {/* <span style={{color:"white"}}>
          关于我们
        </span> */}
      <SelectLang></SelectLang>
      <UserDropdown></UserDropdown>
    </Space>
  );
};
