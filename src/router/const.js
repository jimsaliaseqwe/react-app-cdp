const LIST_ROUTE_ROLE = ['admin', 'smod'];

export const ROUTE_PATH = {
    HOME: '/',
    FORWARD: '/f',
    SMOD: process.env.REACT_APP_SMOD_PATH_ROOT,
    MOD: '/mod',
    ADMIN: process.env.REACT_APP_ADMIN_PATH_ROOT,
    F: {
        VOUCHER: `voucher`,
        VOUCHER_TEMPLATE: `voucher/template`,
        VOUCHER_LIST: `voucher/list`,
    },
    S: {
        DEVICE: `device`,
        PACKAGE: `package`,
        ZALO_APP: `zaloApp`,
        PARTNER: `partner`,
    },
};

const MAP_ROUTE_ROLE = {
    admin: ROUTE_PATH.ADMIN,
    smod: ROUTE_PATH.SMOD,
};

export const ROUTE_LINK = {
    HOME: ROUTE_PATH.HOME,
    SMOD: ROUTE_PATH.SMOD,
    MOD: ROUTE_PATH.MOD,
    FORWARD: ROUTE_PATH.FORWARD,
    ADMIN: ROUTE_PATH.ADMIN,
    F: {
        VOUCHER: (base) => [
            `${routeToRootPath(base)}${ROUTE_PATH.F.VOUCHER}`,
            new RegExp(
                `\/${routeToRootPath(base, false)}\/${ROUTE_PATH.F.VOUCHER}\/?$`,
            ),
        ],
        VOUCHER_TEMPLATE: (base) => [
            `${routeToRootPath(base)}${ROUTE_PATH.F.VOUCHER_TEMPLATE}`,
        ]
    },
    S: {
        DEVICE: (base) => [
            `${routeToRootPath(base)}${ROUTE_PATH.S.DEVICE}`,
            new RegExp(
                `\/${routeToRootPath(base, false)}\/${ROUTE_PATH.S.DEVICE}\/?$`,
            ),
        ],
        PARTNER: (base) => [
            `${routeToRootPath(base)}${ROUTE_PATH.S.PARTNER}`,
            new RegExp(
                `\/${routeToRootPath(base, false)}\/${ROUTE_PATH.S.PARTNER}\/?$`,
            ),
        ],
    },
};

function routeToRootPath(role, full = true) {
    if (LIST_ROUTE_ROLE.includes(role)) {
        role = MAP_ROUTE_ROLE[role];
    }
    if (!role) return '/';

    const trimmed = role.trim();
    if (trimmed === '' || trimmed === '/') return '/';

    const clean = trimmed.replace(/^\/+|\/+$/g, '');

    return full ? `/${clean}/` : clean;
}
