import { CoreMenu } from '@core/types';

//? DOC: http://localhost:7777/demo/vuexy-angular-admin-dashboard-template/documentation/guide/development/navigation-menus.html#interface

export const menu: CoreMenu[] = [
  // Dashboard
  {
    id: 'dashboard',
    title: 'Dashboard',
    type: 'item',
    role: ['Admin','School'], //? To hide collapsible based on user role
    icon: 'home',
    url: 'dashboard/analytics',
    children: [
      {
        id: 'analytics',
        title: 'Analytics',
        translate: 'MENU.DASHBOARD.ANALYTICS',
        type: 'item',
        role: ['Admin', 'School'], //? To set multiple role: ['Admin', 'Client']
        icon: 'user',
        url: 'dashboard/analytics'
      },
    ]
  },
  // Apps & Pages
  {
    id: 'apps',
    type: 'section',
    title: 'Apps',
    translate: 'MENU.APPS.SECTION',
    icon: 'package',
    children: [
      {
        id: 'sso',
        title: 'SSO',
        type: 'item',
        role: ['Admin','School'], //  for school
        icon: 'user',
        url: 'apps/user/appazure'
      },
      {
        id: 'calendar',
        title: 'Calendar',
        translate: 'MENU.APPS.CALENDAR',
        type: 'item',
        role: ['Admin','Class', 'Student', 'Teacher', 'School'],
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
        id: 'collab',
        title: 'Collaboration Class',
        type: 'collapsible',
        role: ['Admin', 'School'],
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
        title: 'Clients',
        type: 'item',
        role: ['Admin'],
        icon: 'user',
        url: 'apps/user/user-list'
      },
      {
        id: 'schools_list',
        title: 'Schools',
        type: 'item',
        role: ['Admin'],
        icon: 'user',
        url: 'apps/user/schools-list'
      },
      {
        id: 'teachers_list',
        title: 'Teachers',
        type: 'item',
        role: ['School', 'Class', 'Admin'],
        icon: 'user',
        url: 'apps/user/teachers-list'
      },
      {
        id: 'students_list',
        title: 'Students',
        type: 'item',
        role: ['Teacher', 'School', 'Admin'],
        icon: 'user',
        url: 'apps/user/students-list'
      },
      {
        id: 'classes_list',
        title: 'Classes',
        type: 'item',
        role: ['School', 'Admin'],
        icon: 'user',
        url: 'apps/user/classes-list'
      },
      {
        id: 'groups_list',
        title: 'Groups',
        type: 'item',
        role: ['Teacher', 'School', 'Admin'],
        icon: 'user',
        url: 'apps/user/groups-list'
      },
      {
        id: 'grades_list',
        title: 'Grades',
        type: 'item',
        role: ['Teacher', 'School', 'Admin'],
        icon: 'user',
        url: 'apps/user/grades-list'
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
        id: 'invoice',
        title: 'Settings',
        type: 'collapsible',
        role: ['Admin','School'],
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
            title: 'Notifications',
            type: 'item',
            icon: 'user',
            url: 'apps/invoice/preview'
          },
          {
            id: 'invoiceEdit',
            title: 'Dynamic Forms',
            type: 'item',
            icon: 'user',
            url: 'apps/invoice/edit'
          }
        ]
      },
    ]
  },
];
