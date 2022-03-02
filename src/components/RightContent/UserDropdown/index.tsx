import {
  IdcardOutlined,
  LogoutOutlined,
  SettingOutlined,
  UserAddOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Menu, Spin } from 'antd';
import { Dropdown } from 'antd';

function UserDropdown(props: any) {
  // const loading = (
  //   <span>
  //     <Spin
  //       size="small"
  //       style={{
  //         marginLeft: 8,
  //         marginRight: 8,
  //       }}
  //     />
  //   </span>
  // );

  // 待配置
  const isLogin = false;
  const currentUser = { name: 'USER_A' };

  // if (!currentUser || !currentUser.name) {
  //   return loading;
  // };

  const onMenuClick = () => {
    console.log('111');
  };

  const menuHeaderDropdown = (
    <Menu selectedKeys={[]} onClick={onMenuClick}>
      {!isLogin && (
        <Menu.Item key="login">
          <IdcardOutlined />
          登录
        </Menu.Item>
      )}
      {!isLogin && (
        <Menu.Item key="register">
          <UserAddOutlined />
          注册
        </Menu.Item>
      )}
      {isLogin && (
        <Menu.Item key="center">
          <UserOutlined />
          个人中心
        </Menu.Item>
      )}
      {isLogin && (
        <Menu.Item key="settings">
          <SettingOutlined />
          个人设置
        </Menu.Item>
      )}
      {isLogin && <Menu.Divider />}
      {isLogin && (
        <Menu.Item key="logout">
          <LogoutOutlined />
          退出登录
        </Menu.Item>
      )}
    </Menu>
  );
  return (
    <Dropdown overlay={menuHeaderDropdown}>
      <span>
        <UserOutlined style={{ color: 'white' }} />
        <span style={{ color: 'white' }}>
          {isLogin ? currentUser.name : ''}
        </span>
      </span>
    </Dropdown>
  );
}

export default UserDropdown;
