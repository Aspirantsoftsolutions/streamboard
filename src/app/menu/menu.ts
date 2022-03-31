import { CoreMenu } from '@core/types';

//? DOC: http://localhost:7777/demo/vuexy-angular-admin-dashboard-template/documentation/guide/development/navigation-menus.html#interface

export const menu: CoreMenu[] = [
  // Dashboard
  {
    id: 'dashboard',
    title: 'Dashboard',
    type: 'item',
    role: ['Admin'], //? To hide collapsible based on user role
    icon: 'home',
    url: 'dashboard/analytics',
    children: [
      {
        id: 'analytics',
        title: 'Analytics',
        translate: 'MENU.DASHBOARD.ANALYTICS',
        type: 'item',
        role: ['Admin'], //? To set multiple role: ['Admin', 'Client']
        icon: 'circle',
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
        id: 'users_list',
        title: 'Clients',
        type: 'item',
        role: ['Admin'],
        icon: 'circle',
        url: 'apps/user/user-list'
      },
      {
        id: 'schools_list',
        title: 'Schools',
        type: 'item',
        role: ['Admin'],
        icon: 'circle',
        url: 'apps/user/schools-list'
      },
      {
        id: 'teachers_list',
        title: 'Teachers',
        type: 'item',
        role: ['School', 'Class', 'Admin'],
        icon: 'circle',
        url: 'apps/user/teachers-list'
      },
      {
        id: 'students_list',
        title: 'Students',
        type: 'item',
        role: ['Teacher', 'School', 'Admin'],
        icon: 'circle',
        url: 'apps/user/students-list'
      },
      {
        id: 'classes_list',
        title: 'Classes',
        type: 'item',
        role: ['Teacher', 'School', 'Admin'],
        icon: 'circle',
        url: 'apps/user/classes-list'
      },
      {
        id: 'sessions_list',
        title: 'Sessions',
        type: 'item',
        icon: 'circle',
        url: 'apps/user/sessions-list'
      },
      {
        id: 'calendar',
        title: 'Calendar',
        translate: 'MENU.APPS.CALENDAR',
        type: 'item',
        role: ['Class'],
        icon: 'calendar',
        url: 'apps/calendar'
      },
      {
        id: 'subscriptions-list',
        title: 'Subscriptions',
        type: 'item',
        icon: 'circle',
        role: ['Admin'],
        url: 'apps/user/subscriptions-list'
      },
      {
        id: 'payments-list',
        title: 'Payments',
        type: 'item',
        role: ['Admin'],
        icon: 'circle',
        url: 'apps/user/payments-list'
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
            icon: 'circle',
            url: 'apps/invoice/list'
          },
          {
            id: 'invoicePreview',
            title: 'Notifications',
            type: 'item',
            icon: 'circle',
            url: 'apps/invoice/preview'
          },
          {
            id: 'invoiceEdit',
            title: 'Dynamic Forms',
            type: 'item',
            icon: 'circle',
            url: 'apps/invoice/edit'
          }
        ]
      },
    ]
  },
];
