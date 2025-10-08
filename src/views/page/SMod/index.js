import React, { useCallback, useEffect, useRef, useState } from 'react';
import 'primereact/resources/themes/tailwind-light/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';

import classNames from 'classnames';
import { Toast } from 'primereact/toast';
import '../../../assets/scss/layout.scss';
import '../../../assets/scss/commonportal.scss';
import LoginBO from '../LoginBO';
import { useSelector } from 'react-redux';
import { Outlet, useLocation, useMatches, useNavigate } from 'react-router-dom';

import { listRoute, ROUTE_LINK, ROUTE_PATH } from '../../../router';
import { reqI } from '../../../service/requestAPI';
import AppTopBar from '../../Component/AdminTopbar';
import AppMenu from '../../Component/AdminMenu';
import { CSSTransition } from 'react-transition-group';
import { useRole } from '../../../hook';
import { PrimeReactProvider } from 'primereact/api';
import { BaseProvider } from '../../Component/BaseContext';

export default function () {
    const matches = useMatches();
    const navigate = useNavigate();
    const location = useLocation();
    const role = useRole();

    const isFullScreen =
        matches[matches.length - 1].handle !== undefined &&
        matches[matches.length - 1].handle.fullscreen;

    const [layoutMode] = useState('static');
    const [layoutColorMode] = useState('light');
    const [inputStyle] = useState('outlined');
    const [ripple] = useState(true);
    const [staticMenuInactive, setStaticMenuInactive] = useState(false);
    const [overlayMenuActive, setOverlayMenuActive] = useState(false);
    const [mobileMenuActive, setMobileMenuActive] = useState(false);
    const [mobileTopBarMenuActive, setMobileTopBarMenuActive] = useState(false);
    const toast = useRef(null);
    const isAuth = useSelector((state) => state.auth.isAuth);
    const authToken = useSelector((state) => state.auth.token);

    if (isAuth) {
        reqI.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
    } else {
        reqI.defaults.headers.common['Authorization'] = '';
    }

    const menuItems = listRoute[0].children.filter(
        (i) =>
            typeof i['isShowMenu'] === 'undefined' || i['isShowMenu'] === true,
    );

    const menu = [
        {
            label: 'Menu',
            children: [...menuItems],
        },
    ];

    let menuClick = false;
    let mobileTopBarMenuClick = false;

    useEffect(() => {
        if (window) {
            window.document.querySelector('head title').innerText =
                'Admin | ' +
                window.document.querySelector('head title').innerText;
        }
    }, []);

    useEffect(() => {
        if (
            isAuth &&
            location &&
            (location.pathname === ROUTE_PATH.SMOD ||
                location.pathname === `${ROUTE_PATH.SMOD}/`)
        ) {
            navigate(ROUTE_LINK.F.DASHBOARD(role)[0]);
        }
    }, [isAuth, location]);

    useEffect(() => {
        if (mobileMenuActive) {
            addClass(document.body, 'body-overflow-hidden');
        } else {
            removeClass(document.body, 'body-overflow-hidden');
        }
    }, [mobileMenuActive]);

    const onWrapperClick = () => {
        if (!menuClick) {
            setOverlayMenuActive(false);
            setMobileMenuActive(false);
        }

        if (!mobileTopBarMenuClick) {
            setMobileTopBarMenuActive(false);
        }

        mobileTopBarMenuClick = false;
        menuClick = false;
    };

    const onToggleMenuClick = (event) => {
        menuClick = true;
        if (isDesktop()) {
            if (layoutMode === 'overlay') {
                if (mobileMenuActive) {
                    setOverlayMenuActive(true);
                }

                setOverlayMenuActive((prevState) => !prevState);
                setMobileMenuActive(false);
            } else if (layoutMode === 'static') {
                setStaticMenuInactive((prevState) => !prevState);
            }
        } else {
            setMobileMenuActive((prevState) => !prevState);
        }

        event.preventDefault();
    };

    const onSidebarClick = () => {
        menuClick = true;
    };

    const onMobileTopBarMenuClick = (event) => {
        mobileTopBarMenuClick = true;

        setMobileTopBarMenuActive((prevState) => !prevState);
        event.preventDefault();
    };

    const onMenuItemClick = (event) => {
        if (!event.item.items) {
            setOverlayMenuActive(false);
            setMobileMenuActive(false);
        }
    };
    const isDesktop = () => {
        return window.innerWidth >= 992;
    };

    const addClass = (element, className) => {
        if (element.classList) {
            element.classList.add(className);
        } else {
            element.className += ' ' + className;
        }
    };

    const removeClass = (element, className) => {
        if (element.classList) {
            element.classList.remove(className);
        } else {
            element.className = element.className.replace(
                new RegExp(
                    '(^|\\b)' + className.split(' ').join('|') + '(\\b|$)',
                    'gi',
                ),
                ' ',
            );
        }
    };

    const wrapperClass = classNames('layout-wrapper', {
        'layout-overlay': layoutMode === 'overlay',
        'layout-static': layoutMode === 'static',
        'layout-static-sidebar-inactive':
            staticMenuInactive && layoutMode === 'static',
        'layout-overlay-sidebar-active':
            overlayMenuActive && layoutMode === 'overlay',
        'layout-mobile-sidebar-active': mobileMenuActive,
        'p-input-filled': inputStyle === 'filled',
        'p-ripple-disabled': !ripple,
        'layout-theme-light': layoutColorMode === 'light',
    });

    const SMOD = useCallback(() => {
        if (isAuth) {
            if (isFullScreen) {
                return (
                    <PrimeReactProvider value={{}}>
                        <Outlet context={[toast]} />
                    </PrimeReactProvider>
                );
            }

            return (
                <PrimeReactProvider value={{}}>
                    <BaseProvider
                        value={{
                            layoutColorMode,
                            mobileMenuActive,
                            staticMenuInactive,
                            setStaticMenuInactive,
                            onToggleMenuClick,
                            mobileTopBarMenuActive,
                            onMobileTopBarMenuClick,
                            onSidebarClick,
                            onMenuItemClick,
                        }}
                    >
                        <div className={wrapperClass} onClick={onWrapperClick}>
                            <AppTopBar />

                            <div
                                className="layout-sidebar"
                                onClick={onSidebarClick}
                            >
                                <AppMenu model={menu} />
                            </div>

                            <div className="layout-main-container">
                                <div className="layout-main overflow-y-auto">
                                    <Outlet context={[toast, 'smod']} />
                                </div>
                            </div>

                            <CSSTransition
                                classNames="layout-mask"
                                timeout={{ enter: 200, exit: 200 }}
                                in={mobileMenuActive}
                                unmountOnExit
                            >
                                <div className="layout-mask p-component-overlay"></div>
                            </CSSTransition>
                        </div>
                    </BaseProvider>
                </PrimeReactProvider>
            );
        }
        return <LoginBO masterToast={toast} />;
    }, [
        isAuth,
        staticMenuInactive,
        mobileTopBarMenuActive,
        layoutMode,
        inputStyle,
        ripple,
    ]);

    return (
        <>
            {SMOD()}
            <Toast ref={toast} />
        </>
    );
}
