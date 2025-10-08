import React, { useEffect, useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import BUSSINESSLOGO from '../../assets/image/BusinessLogo.png';
import { acceptLogin } from '../../features/auth';
import { useDispatch, useSelector } from 'react-redux';
import { getLogin } from '../../service/requestAPI';

export default function LoginBO(props) {
    const dispatch = useDispatch();
    const [username, setUsername] = useState('');
    const [usernameViewOnly, setUsernameViewOnly] = useState(false);
    const [password, setPassword] = useState('');
    const latestLoginUsername = useSelector(
        ({ auth: { username } }) => username,
    );

    useEffect(() => {
        const query = new URLSearchParams(window.location.search);
        if (query && query.get('welcome')) {
            setUsername(query.get('welcome'));
            setUsernameViewOnly(true);
        }
    }, []);

    useEffect(() => {
        const query = new URLSearchParams(window.location.search);
        if (!username && !query.get('welcome') && latestLoginUsername) {
            setUsername(latestLoginUsername);
        }
    }, [username]);

    const doLogin = async (event) => {
        try {
            event.preventDefault();

            if (!username || !password) {
                props.masterToast.current.show({
                    severity: 'error',
                    summary: 'Lỗi',
                    detail: 'Tên đăng nhập và mật khẩu là bắt buộc.',
                });
                return;
            }

            const response = await getLogin(username, password);
            const data = (response && response['data']) || null;
            if (!data) {
                props.masterToast.current.show({
                    severity: 'error',
                    summary: 'Lỗi',
                    detail: 'Lỗi máy chủ.',
                });
                return;
            }

            const auth_token = data['auth_token'];
            if (!auth_token) {
                props.masterToast.current.show({
                    severity: 'error',
                    summary: 'Lỗi',
                    detail: 'Lỗi xử lý máy chủ.',
                });
                return;
            }

            const user = data['user'] || {};

            dispatch(
                acceptLogin({
                    token: auth_token,
                    userid: user['id'],
                    expiredAt: 1000,
                    username: user['username'],
                    name: user['name'],
                    role: user['role'],
                }),
            );
        } catch (e) {
            props.masterToast.current.show({
                severity: 'error',
                summary: 'Lỗi',
                detail: e.message,
            });
        }
    };

    return (
        <div
            className="grid grid-nogutter justify-content-center align-items-center h-screen m-0 h-full"
            style={{ background: '#faf7f5' }}
        >
            <div className="lg:col-3 col-10">
                <img
                    src={BUSSINESSLOGO}
                    alt="logo"
                    width="150"
                    className="mt-auto mb-8 mx-auto block"
                />
                <form onSubmit={doLogin} className="mb-auto">
                    <div className="field mb-5">
                        <span className="w-full p-float-label">
                            <InputText
                                readOnly={usernameViewOnly}
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                id="txt-number-phone"
                                className="w-full"
                                required
                            />
                            <label htmlFor="txt-number-phone">
                                Tên đăng nhập
                            </label>
                        </span>
                    </div>
                    <div className="field mb-5">
                        <span className="w-full p-float-label">
                            <InputText
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                id="txt-full-name"
                                className="w-full"
                                type="password"
                                required
                            />
                            <label htmlFor="txt-full-name">Mật khẩu</label>
                        </span>
                    </div>
                    <div className="p-col-12 p-md-6 text-center">
                        <Button
                            className="w-full"
                            type="submit"
                            label="Đăng nhập"
                        />
                    </div>
                </form>
            </div>
        </div>
    );
}
