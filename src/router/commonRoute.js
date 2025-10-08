import { lazy } from 'react';
import { ROUTE_PATH } from './const';

const LoginBO = lazy(() => import('../views/page/LoginBO'));
const NavForward = lazy(() => import('../views/Component/NavForward'));

export default [
    {
        path: ROUTE_PATH.FORWARD,
        hideMenu: true,
        Component: NavForward,
        label: 'forward',
    },
    {
        path: '/login',
        Component: LoginBO,
    },
];
