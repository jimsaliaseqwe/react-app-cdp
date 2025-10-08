import { lazy } from 'react';
import { ROUTE_PATH } from './const';

const SpAdmin = lazy(() => import('../views/page/SuperAdmin'));
const Devices = lazy(() => import('../views/page/SuperAdmin/Devices'));
const Package = lazy(() => import('../views/page/SuperAdmin/Package'));
const ZaloApp = lazy(() => import('../views/page/SuperAdmin/ZaloApp'));
const Partner = lazy(() => import('../views/page/SuperAdmin/Partner'));

export default {
    path: ROUTE_PATH.ADMIN,
    Component: SpAdmin,
    children: [
        {
            path: ROUTE_PATH.S.DEVICE,
            Component: Devices,
            label: 'Thiết bị',
            icon: 'pi pi-desktop',
        },
        {
            path: ROUTE_PATH.S.PACKAGE,
            Component: Package,
            label: 'Gói',
            icon: 'pi pi-shopping-cart',
        },
        {
            path: ROUTE_PATH.S.ZALO_APP,
            Component: ZaloApp,
            label: 'Zalo APP',
            icon: 'pi pi-th-large',
        },
        {
            path: ROUTE_PATH.S.PARTNER,
            Component: Partner,
            label: 'Partner',
            icon: 'pi pi-users',
        },
    ],
};
