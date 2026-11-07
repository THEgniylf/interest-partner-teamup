export default [
  {
    path: '/user',
    layout: false,
    routes: [
      { path: '/user/login', component: './User/Login' },
      { path: '/user/register', component: './User/Register' },
    ],
  },
  {
    path: '/',
    redirect: '/post',
  },
  {
    path: '/post',
    name: '帖子大厅',
    icon: 'fire',
    component: './Post/List',
  },
  {
    path: '/post/detail/:id',
    name: '帖子详情',
    hideInMenu: true,
    component: './Post/Detail',
  },
  {
    path: '/post/add',
    name: '发布帖子',
    hideInMenu: true,
    component: './Post/Edit',
  },
  {
    path: '/post/update/:id',
    name: '编辑帖子',
    hideInMenu: true,
    component: './Post/Edit',
  },
  {
    path: '/my/post',
    name: '我的帖子',
    icon: 'profile',
    component: './Post/My',
  },
  {
    path: '/my/favour',
    name: '我的收藏',
    icon: 'star',
    component: './Post/Favour',
  },
  {
    path: '/user/profile',
    name: '个人中心',
    icon: 'user',
    component: './User/Profile',
  },
  {
    path: '/admin',
    icon: 'crown',
    name: '管理页',
    access: 'canAdmin',
    routes: [
      { path: '/admin', redirect: '/admin/user' },
      { icon: 'table', path: '/admin/user', component: './Admin/User', name: '用户管理' },
    ],
  },
  { path: '*', layout: false, component: './404' },
];
