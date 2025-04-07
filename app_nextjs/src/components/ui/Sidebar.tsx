'use client';

import { Layout, Menu } from 'antd';
import { 
  DashboardOutlined,
  AppstoreOutlined,
  CalendarOutlined,
  TrophyOutlined,
  UserOutlined,
  CrownOutlined,
  TeamOutlined
} from '@ant-design/icons';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from '../../styles/Sidebar.module.scss';

const { Sider } = Layout;

// ... existing code ...

interface SidebarProps {
  collapsed: boolean;
}

export default function Sidebar({  collapsed }: SidebarProps) {
  const pathname = usePathname();
  
  // 从 localStorage 中获取 role
  const storedRole = localStorage.getItem('role');
  const role = storedRole? parseInt(storedRole) : null;
  let homeRole = '/'; // 修改为 let 声明，方便后续修改

  if (role === 0) {
    homeRole = 'admin'; // 直接修改外部的 homeRole
  } else if (role === 1 || role === 2) {
    homeRole = 'student'; // 直接修改外部的 homeRole
  }
  
  // 获取当前选中的菜单项
  const selectedKey = pathname.split('/')[2] || 'dashboard';
  
  // 创建菜单项
  const menuItems = [
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: <Link href={`/${homeRole}`}>首页</Link>, // 使用修改后的 homeRole
    },
    {
      key: 'activities',
      icon: <AppstoreOutlined />,
      label: <Link href={`/${homeRole}/activities`}>活动列表</Link>,
    },
    {
      key: 'my-activities',
      icon: <CalendarOutlined />,
      label: <Link href={`/${homeRole}/my-activities`}>我的活动</Link>,
    },
    {
      key: 'points',
      icon: <TrophyOutlined />,
      label: <Link href={`/${homeRole}/points`}>我的积分</Link>,
    },
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: <Link href={`/${homeRole}/profile`}>个人信息</Link>,
    },
  ];
  
  // 如果是管理员和社长，添加社长功能
  if (role === 1) {
    menuItems.push({
      key: 'club-management',
      icon: <CrownOutlined />,
      label: '社长功能',
      children: [
        {
          key: 'create-activity',
          label: <Link href={`/${homeRole}/create-activity`}>创建活动</Link>,
        },
        {
          key: 'manage-members',
          label: <Link href={`/${homeRole}/manage-members`}>管理成员</Link>,
        },
        {
          key: 'activity-stats',
          label: <Link href={`/${homeRole}/activity-stats`}>活动统计</Link>,
        },
      ],
    })
// 错误原因是多了一个分号，正确的代码应该去掉多余的分号
  } else if (role === 0 ) {
    menuItems.push({
      key: 'club-management',
      icon: <CrownOutlined />,
      label: '管理员功能',
      children: [
        {
          key: 'create-activity',
          label: <Link href={`/${homeRole}/create-activity`}>创建活动</Link>,
        },
        {
          key: 'manage-members',
          label: <Link href={`/${homeRole}/manage-members`}>管理成员</Link>,
        },
        {
          key: 'activity-stats',
          label: <Link href={`/${homeRole}/activity-stats`}>活动统计</Link>,
        },
        // 新增修改密码子菜单
        {
          key: 'change-password',
          label: <Link href={`/${homeRole}/change-password`}>修改密码</Link>,
        },
      ],
    });
  }

  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={collapsed}
      className={styles.sidebar}
      width={220}
    >
      <Menu
        mode="inline"
        selectedKeys={[selectedKey]}
        defaultOpenKeys={['club-management']}
        items={menuItems}
        className={styles.sideMenu}
        style={{ height: '100%', borderRight: 0 }}
      />
    </Sider>
  );
} 