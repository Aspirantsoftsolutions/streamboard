import { CoreMenu } from '@core/types';

//? DOC: http://localhost:7777/demo/vuexy-angular-admin-dashboard-template/documentation/guide/development/navigation-menus.html#interface

export const menu: CoreMenu[] = [
  // Dashboard
  {
    id: 'dashboard',
    title: 'Dashboard',
    type: 'item',
    icon: 'home',
    url: 'dashboard/ecommerce',
    children: [
      {
        id: 'analytics',
        title: 'Analytics',
        translate: 'MENU.DASHBOARD.ANALYTICS',
        type: 'item',
        icon: 'user',
        url: 'dashboard/ecommerce'
      },
    ]
  },
  // Apps & Pages
  {
    id: 'apps',
    type: 'section',
    title: 'Apps',
    translate: 'Main Menu',
    icon: 'package',
    children: [
      
      {
        id: 'calendar',
        title: 'Calendar',
        translate: 'MENU.APPS.CALENDAR',
        type: 'item',
        role: ['Admin', 'Student', 'Teacher', 'School'],
        icon: 'calendar',
        url: 'apps/calendar'
      },
      
      // {
      //   id: 'sessions_list',
      //   title: 'Collaboration Class',
      //   type: 'item',
      //   icon: 'user',
      //   url: 'apps/user/sessions-list'
      // },
    {
        id: 'quick_sessionsa',
        title: 'Quick Sessions',
        type: 'item',
        icon: 'user',
        role: ['Individual'],
        url: 'apps/user/quick_sessions'
      },
      {
        id: 'collab',
        title: 'Collaboration Class',
        type: 'collapsible',
        role: ['School','Teacher','Student'],
        icon: 'file-text',
        children: [
          {
            id: 'quick_sessions',
            title: 'Quick Sessions',
            type: 'item',
            icon: 'user',
            url: 'apps/user/quick_sessions'
          },
          {
            id: 'live_sessions',
            title: 'Live Sessions',
            type: 'item',
            icon: 'user',
            url: 'apps/user/live_sessions'
          },
          {
            id: 'scheduled_sessions',
            title: 'Scheduled Sessions',
            type: 'item',
            icon: 'user',
            url: 'apps/user/scheduled_sessions'
          },
        ]
      },
      {
        id: 'users_list',
        title: 'All Users',
        type: 'item',
        role: ['School'],
        icon: 'user',
        url: 'apps/user/user-list'
      },
      {
        id: 'clients_list',
        title: 'Clients',
        type: 'item',
        role: ['Admin'],
        icon: 'user',
        url: 'apps/user/clients-list'
      },
      {
        id: 'whiteBoard',
        title: 'WhiteBoard',
        translate: 'WhiteBoard',
        type: 'item',
        icon: 'home',
        role: ['School','Admin'],
        url: 'apps/user/ind-sessions-list'
      },
      {
        id: 'sso',
        title: 'SSO',
        type: 'item',
        role: ['School','Admin'], //  for school
        icon: 'user',
        url: 'apps/user/starterSSO'
      },
      {
        id: 'integrations',
        title: 'Integrations',
        type: 'item',
        role: ['Admin'], 
        icon: 'user',
        url: 'pages/miscellaneous/coming-soon'
      },
      {
        id: 'subscriptions-list',
        title: 'Subscriptions',
        type: 'item',
        icon: 'user',
        role: ['Admin'],
        url: 'apps/user/subscriptions-list'
      },
      {
        id: 'payments-list',
        title: 'Payments',
        type: 'item',
        role: ['Admin'],
        icon: 'user',
        url: 'apps/user/payments-list'
      },
      {
        id: 'reports-list',
        title: 'Reports',
        type: 'item',
        role: ['Admin'],
        icon: 'user',
        url: 'pages/miscellaneous/coming-soon'
      },
      {
        id: 'invoice',
        title: 'Settings',
        type: 'collapsible',
        role: ['Admin'],
        icon: 'file-text',
        children: [
          {
            id: 'invoice-list',
            title: 'Roles & Permissions',
            type: 'item',
            icon: 'user',
            url: 'apps/invoice/list'
          },
          {
            id: 'invoicePreview',
            title: 'Invoice Preview',
            type: 'item',
            icon: 'user',
            url: 'apps/invoice/preview'
          },
          {
            id: 'invoiceEdit',
            title: 'Invoice Edit',
            type: 'item',
            icon: 'user',
            url: 'apps/invoice/edit'
          }
        ]
      },
      // {
      //   id: 'schools_list',
      //   title: 'Schools',
      //   type: 'item',
      //   role: ['Admin'],
      //   icon: 'user',
      //   url: 'apps/user/schools-list'
      // },
      {
        id: 'teachers_list',
        title: 'Teachers',
        type: 'item',
        role: ['School', 'Class'],
        icon: 'user',
        url: 'apps/user/teachers-list'
      },
      {
        id: 'students_list',
        title: 'Students',
        type: 'item',
        role: ['Teacher', 'School'],
        icon: 'user',
        url: 'apps/user/students-list'
      },
      {
        id: 'classes_list',
        title: 'Classes',
        type: 'item',
        role: ['School'],
        icon: 'user',
        url: 'apps/user/classes-list'
      },
      {
        id: 'groups_list',
        title: 'Groups',
        type: 'item',
        role: ['Teacher', 'School'],
        icon: 'user',
        url: 'apps/user/groups-list'
      },
      {
        id: 'grades_list',
        title: 'Grades',
        type: 'item',
        role: ['Teacher', 'School'],
        icon: 'user',
        url: 'apps/user/grades-list'
      },
     
      {
        id: 'notifications',
        title: 'Notifications',
        translate: 'Notifications',
        type: 'item',
        role: ['Admin', 'School'],
        icon: 'home',
        url: 'apps/user/notifications'
      },
      
      
    ]
  },
];
