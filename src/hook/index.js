import { useBlocker, useLocation } from 'react-router-dom';
import { useEffect, useMemo, useRef } from 'react';
import { ROUTE_PATH } from '../router';
import { useSelector } from 'react-redux';
import { generateUUID } from '../util/func';

export function useRole() {
    const location = useLocation();

    return useMemo(() => {
        const pathSegment = location.pathname;

        if (pathSegment.startsWith(ROUTE_PATH.ADMIN)) {
            return 'admin';
        }

        if (pathSegment.startsWith(ROUTE_PATH.SMOD)) {
            return 'smod';
        }

        if (pathSegment.startsWith(ROUTE_PATH.MOD)) {
            return 'mod';
        }
    }, [location.pathname]);
}

export function useWarnBeforeUnload(when) {
    useEffect(() => {
        if (!when) return;

        const handler = (e) => {
            e.preventDefault();
            e.returnValue = ''; // cần set để Chrome/Firefox hiển thị cảnh báo
        };

        window.addEventListener('beforeunload', handler);
        return () => window.removeEventListener('beforeunload', handler);
    }, [when]);
}

export function useConfirmLeave(when, handler) {
    const blocker = useBlocker(when);

    useEffect(() => {
        if (blocker.state === 'blocked') {
            if (handler()) {
                blocker.proceed();
            } else {
                blocker.reset();
            }
        }
    }, [blocker, handler]);
}

export function useCachingBoResources(key) {
    const resource = useSelector((state) => state.boResources[key]);
    const expiredAt = resource?.expiredAt;

    return useMemo(() => {
        if (key === null || key === undefined) {
            return null;
        }

        if (expiredAt !== null && Date.now() < expiredAt) {
            return resource;
        }

        return null;
    }, [key, resource, expiredAt]);
}

export function useUID() {
    const uidRef = useRef(generateUUID());
    return uidRef.current;
}
