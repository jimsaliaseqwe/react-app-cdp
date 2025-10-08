import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { restore } from '../../features/auth';
import { useDispatch, useSelector } from 'react-redux';
import { ROUTE_LINK } from '../../router';
import { useRole } from '../../hook';
import { useBase } from './BaseContext';

const AppTopBar = () => {
    const { staticMenuInactive, onToggleMenuClick, onMobileTopBarMenuClick } =
        useBase();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const pathRole = useRole();

    const menuProfile = useRef(null);
    const user = useSelector(({ auth: { name } }) => name);

    const [profileItems, setProfileItems] = useState([]);

    const toggleMenuProfile = (event) => {
        menuProfile.current && menuProfile.current.toggle(event);
    };

    useEffect(() => {
        const [pathProfile] = ROUTE_LINK.F.ACCOUNT_PROFILE(pathRole);
        setProfileItems([
            {
                label: `Hi ${user.toUpperCase()}`,
                items: [
                    {
                        label: 'Tài khoản',
                        command() {
                            navigate(pathProfile);
                        },
                    },
                    {
                        label: 'Đăng xuất',
                        command() {
                            dispatch(restore());
                            navigate(`/${pathRole}/`);
                        },
                    },
                ],
            },
        ]);
    }, []);

    return (
        <div className="layout-topbar bg-bluegray-50 shadow-1">
            <button
                type="button"
                className="p-link  layout-menu-button layout-topbar-button mr-4"
                onClick={onToggleMenuClick}
            >
                {!staticMenuInactive ? (
                    <i className="pi pi-align-justify" />
                ) : (
                    <i className="pi pi-align-justify" />
                )}
            </button>

            <div className="layout-topbar-logo"></div>

            <button
                type="button"
                className="p-link layout-topbar-menu-button layout-topbar-button"
                onClick={onMobileTopBarMenuClick}
            >
                <i className="pi pi-ellipsis-v" />
            </button>

            {/*<ul className={classNames("layout-topbar-menu lg:flex origin-top mr-4", {'layout-topbar-menu-mobile-active': props['mobileTopBarMenuActive']})}>
                <li>
                    <button onClick={toggleMenuProfile} className="p-link layout-topbar-button">
                        <i className="pi pi-user"/>
                    </button>
                    <Menu model={profileItems} popup ref={menuProfile}/>
                </li>
            </ul>*/}
        </div>
    );
};

export default AppTopBar;
