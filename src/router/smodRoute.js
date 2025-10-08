import { lazy } from 'react';
import { ROUTE_PATH } from './const.js';

const SMod = lazy(() => import('../views/page/SMod'));

export default {
    path: ROUTE_PATH.SMOD,
    Component: SMod,
    //    handle: {fullscreen: true},
    children: [
        {
            label: 'Voucher',
            icon: 'pi pi-tag',
            children: [
                {
                    path: ROUTE_PATH.F.VOUCHER_TEMPLATE,
                    Component: lazy(
                        () =>
                            import(
                                '../views/page/SMod/Voucher/VoucherTemplate'
                            ),
                    ),
                    label: 'Quản lý Voucher Mẫu',
                },
                {
                    path: ROUTE_PATH.F.VOUCHER_LIST,
                    Component: lazy(() => import('../views/page/SMod/Voucher')),
                    label: 'Quản lý Voucher',
                },
            ],
        }
    ],
};
