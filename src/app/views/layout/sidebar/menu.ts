import { MenuItem } from './menu.model';

export const MENU: MenuItem[] = [
  {
    label: 'Inicio',
    isTitle: true
  },
  {
    label: 'Dashboard',
    icon: 'home',
    link: '/dashboard'
  },
  {
    label: 'Admin',
    isTitle: true
  },
  {
    label: 'Perfil',
    icon: 'briefcase',
    subItems: [
      {
        label: 'Ver',
        link: '/configs/config',
      }
    ]
  },
  {
    label: 'Usuarios',
    icon: 'users',
    subItems: [
      {
        label: 'Listado',
        link: '/users',
      }
    ]
  },
  {
    label: 'Roles de seguridad',
    icon: 'users',
    subItems: [
      {
        label: 'Ver roles',
        link: '/roles/rol',
      }
    ]
  },
  {
    label: 'Usuario',
    isTitle: true
  },
  {
    label: 'Contraseña',
    icon: 'users',
    subItems: [
      {
        label: 'Cambiar contraseña',
        link: '/password/change-pass',
      }
    ]
  },
  {
    label: 'MODULOS',
    isTitle: true
  },
  {
    label: 'Productos',
    icon: 'briefcase',
    subItems: [
      {
        label: 'Ver',
        link: '/products/product',
      }
    ]
  },
  {
    label: 'Costos',
    icon: 'briefcase',
    subItems: [
      {
        label: 'Ver',
        link: '/fixes/fixe',
      }
      // {
      //   label: 'Variables',
      //   link: '/vars/var',
      // }
    ],
  },
  {
    label: 'Activos',
    icon: 'briefcase',
    subItems: [
      {
        label: 'Ver',
        link: '/assets/asset',
      }
    ]
  },
  {
    label: 'Presupuestos',
    icon: 'briefcase',
    subItems: [
      {
        label: 'Ver',
        link: '/budgets/budget',
      }
    ]
  },
  {
    label: 'Reportes',
    icon: 'briefcase',
    subItems: [
      {
        label: 'Ver Reportes',
        link: '/reports/report',
      },
      {
        label: 'Parametrización',
        link: '/controls/params',
      }
    ],
  }
];
