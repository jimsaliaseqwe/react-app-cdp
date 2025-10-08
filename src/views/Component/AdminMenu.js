import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';
import classNames from 'classnames';
import { Ripple } from 'primereact/ripple';
import { Badge } from 'primereact/badge';
import { useDispatch, useSelector } from 'react-redux';
import { useRole } from '../../hook';
import { ROUTE_LINK, ROUTE_PATH } from '../../router';
import { Avatar } from 'primereact/avatar';
import { Menu } from 'primereact/menu';
import { restore } from '../../features/auth';
import DialogChangePackage from './DialogChangePackage';
import { useBase } from './BaseContext';

const AppSubmenu = ({ items = [], className, onMenuItemClick, root = false, userContext, isSub = false }) => {
    const [activeIndex, setActiveIndex] = useState(null);
    const { pathname } = useLocation();

    // Memoized: đệ quy kiểm tra path có active không
    const isChildActive = useCallback(
        (items) => {
            if (!items) return false;
            return items.some((item) => {
                if (item.path && pathname.endsWith(item.path)) return true;
                return isChildActive(item.children);
            });
        },
        [pathname],
    );

    useEffect(() => {
        const findActiveIndex = () => {
            for (let i = 0; i < items.length; i++) {
                const item = items[i];
                if (item.path && pathname === item.path) return i;
                if (item.children && isChildActive(item.children)) return i;
            }
            return null;
        };

        const matchedIndex = findActiveIndex();
        setActiveIndex(matchedIndex);
    }, [pathname, items, isChildActive]);

    // Memoized: sự kiện click item menu
    const handleMenuItemClick = useCallback(
        (event, item, index) => {
            if (item.disabled) {
                event.preventDefault();
                return;
            }

            if (item.command) {
                item.command({ originalEvent: event, item });
            }

            setActiveIndex((prev) => (prev === index ? null : index));

            if (onMenuItemClick) {
                onMenuItemClick({ originalEvent: event, item });
            }
        },
        [onMenuItemClick],
    );

    // Memoized: xử lý keyboard accessibility
    const onKeyDown = useCallback((event) => {
        if (event.code === 'Enter' || event.code === 'Space') {
            event.preventDefault();
            event.target.click();
        }
    }, []);

    // Memoized: nội dung link
    const renderLinkContent = useCallback((item) => {
        const Icon = typeof item.icon === 'function' ? item.icon : () => <i className={item.icon}></i>;
        return (
            <>
                <Icon />
                <span>{item.label}</span>
                {item.children && <i className="pi pi-fw pi-angle-down menuitem-toggle-icon"></i>}
                {item.badge && <Badge value={item.badge} />}
                <Ripple />
            </>
        );
    }, []);

    // Memoized: render NavLink hoặc <a>
    const renderLink = useCallback(
        (item, index, active) => {
            if (item.hideMenu) return null;

            const content = renderLinkContent(item);

            if (item.path) {
                const path = item.computePath ? item.computePath.apply(null, userContext) : item.path;
                return (
                    <NavLink
                        aria-label={item.label}
                        onKeyDown={onKeyDown}
                        role="menuitem"
                        className="p-ripple"
                        to={path}
                        target={item.target || '_self'}
                    >
                        {isSub && '•'} {content}
                    </NavLink>
                );
            } else {
                return (
                    <a
                        tabIndex={0}
                        aria-label={item.label}
                        onKeyDown={onKeyDown}
                        role="menuitem"
                        href={item.url}
                        className={`p-ripple${active ? ' active' : ''}`}
                        target={item.target}
                        onClick={(e) => handleMenuItemClick(e, item, index)}
                    >
                        {content}
                    </a>
                );
            }
        },
        [renderLinkContent, onKeyDown, handleMenuItemClick],
    );

    // Memoized: render danh sách menu items
    const renderedItems = useMemo(() => {
        return items.map((item, i) => {
            const active = activeIndex === i || isChildActive(item.children);
            const styleClass = classNames(item.badgeStyleClass, {
                'layout-menuitem-category': root,
                'active-menuitem': active && !item.path,
                'just-hover': active && !isChildActive(item.children),
                'has-sub': item.children && item.children.length > 0,
            });

            if (root) {
                return (
                    <li className={styleClass} key={i} role="none">
                        {/*<div className="layout-menuitem-root-text" aria-label={item.label}>{item.label}</div>*/}
                        <AppSubmenu userContext={userContext} items={item.children} onMenuItemClick={onMenuItemClick} />
                    </li>
                );
            } else {
                return (
                    <li className={styleClass} key={i} role="none">
                        {renderLink(item, i, active)}
                        <CSSTransition classNames="layout-submenu-wrapper" timeout={0} in={active} unmountOnExit>
                            <AppSubmenu
                                userContext={userContext}
                                items={item.children}
                                isSub={true}
                                onMenuItemClick={onMenuItemClick}
                            />
                        </CSSTransition>
                    </li>
                );
            }
        });
    }, [items, activeIndex, isChildActive, onMenuItemClick, renderLink, root]);

    return renderedItems.length > 0 ? (
        <ul className={className} role="menu">
            {renderedItems}
        </ul>
    ) : null;
};

const AppMenu = ({ model }) => {
    const { onMenuItemClick } = useBase();
    const role = useRole();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const partnerId = useSelector((state) => state.auth.userid);
    const partnerName = useSelector((state) => state.auth.username);

    const title = role.toUpperCase();
    const [pathProfile] = ROUTE_LINK.F.ACCOUNT_PROFILE(role);
    const [pathProfileBilling] = ROUTE_LINK.F.ACCOUNT_PAYMENT(role);

    const accountMenu = useRef(null);
    const dialogPackageForm = useState(false);
    let accountMenuOptions;
    if (role === 'smod') {
        accountMenuOptions = [
            {
                label: 'Nâng cấp gói',
                icon: 'pi pi-sparkles',
                command() {
                    dialogPackageForm[1](true);
                },
            },
            {
                label: 'Tài khoản',
                icon: 'pi pi-user',
                command() {
                    navigate(pathProfile);
                },
            },
            {
                label: 'Thanh toán',
                icon: 'pi pi-credit-card',
                command() {
                    navigate(pathProfileBilling);
                },
            },
            {
                separator: true,
            },
            {
                label: 'Hỗ trợ',
                icon: 'pi pi-headphones',
            },
            {
                label: 'Đăng xuất',
                icon: 'pi pi-sign-out',
                command() {
                    dispatch(restore());
                    navigate(ROUTE_PATH.SMOD);
                },
            },
        ];
    } else {
        accountMenuOptions = [
            {
                label: 'Tài khoản',
                icon: 'pi pi-user',
                command() {
                    navigate(pathProfile);
                },
            },
            {
                separator: true,
            },
            {
                label: 'Đăng xuất',
                icon: 'pi pi-sign-out',
                command() {
                    dispatch(restore());
                    navigate(ROUTE_PATH.ADMIN);
                },
            },
        ];
    }

    return (
        <div className="layout-menu-container flex flex-column h-screen">
            <div className="layout-sidebar-logo flex align-items-center justify-content-center relative p-3 border-bottom-1 border-gray-700">
                <NavLink to={ROUTE_LINK.F.DASHBOARD(role)[0]}>
                    <img src="/images/28-04/logo.webp" alt="gameads.vn" className="w-full" />
                </NavLink>
                <span className="uppercase text-gray-500 absolute" style={{ bottom: '.3rem', right: '0.9rem' }}>
                    {title}
                </span>
            </div>
            <AppSubmenu
                items={model}
                className="layout-menu"
                onMenuItemClick={onMenuItemClick}
                root={true}
                userContext={[role, partnerId]}
                role="menu"
            />

            <div className="mt-auto p-1">
                <div
                    className="flex p-2 hover:bg-black-alpha-50 border-round cursor-pointer"
                    aria-controls="popup_menu_account"
                    aria-haspopup
                    onClick={(event) => accountMenu.current.toggle(event)}
                >
                    <Avatar
                        label={(partnerName && partnerName[0] && partnerName[0].toUpperCase()) || 'P'}
                        className="mr-2"
                        shape="circle"
                        style={{ backgroundColor: '#2196F3', color: '#ffffff' }}
                    />
                    <div className="ml-2">
                        <span className="text-white uppercase">{partnerName}</span>
                        <br />
                        <small className="text-gray-400">Free</small>
                    </div>
                </div>
                <Menu
                    model={accountMenuOptions}
                    popup
                    ref={accountMenu}
                    id="popup_menu_account"
                    style={{ width: '14rem' }}
                />
            </div>

            <DialogChangePackage dialog={dialogPackageForm} />
        </div>
    );
};

export default AppMenu;
