import axios from 'axios';

export const reqI = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_ENDPOINT,
});

function getCatchMessage(exception) {
    const response = exception['response'] || null;
    const data = (response && response['data']) || null;
    return (data && data['message']) || exception.message;
}

export function getLogin(username, password) {
    return new Promise((resolve, reject) => {
        reqI.get(`/auth/admin/login`, {
            params: { username, password },
        })
            .then(({ data }) => {
                resolve(data);
            })
            .catch((e) => {
                const response = e['response'] || null;
                const data = (response && response['data']) || null;
                e.message = (data && data['message']) || e.message;
                reject(e);
            });
    });
}

export function uploadPNG(eventLiveId, itemId, formData) {
    return new Promise((resolve, reject) => {
        reqI.post(`/bo/eventLive/${eventLiveId}/${itemId}/uploadImage`, formData, {
            baseURL: process.env.REACT_APP_API_UPLOAD_BASE_ENDPOINT,
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
            .then(({ data }) => {
                resolve(data);
            })
            .catch((e) => {
                const response = e['response'] || null;
                const data = (response && response['data']) || null;
                e.message = (data && data['message']) || e.message;
                reject(e);
            });
    });
}

export function upload(formData) {
    return new Promise((resolve, reject) => {
        reqI.post(`/bo/upload`, formData, {
            baseURL: process.env.REACT_APP_API_UPLOAD_BASE_ENDPOINT,
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
            .then(({ data }) => {
                resolve(data);
            })
            .catch((e) => {
                const response = e['response'] || null;
                const data = (response && response['data']) || null;
                e.message = (data && data['message']) || e.message;
                reject(e);
            });
    });
}

export function uploadPNGLogo(formData) {
    return new Promise((resolve, reject) => {
        reqI.post(`/bo/partner/uploadLogo`, formData, {
            baseURL:
                process.env.REACT_APP_ENV === 'dev'
                    ? 'https://eventserver.tpgame.store/api'
                    : process.env.REACT_APP_API_BASE_ENDPOINT,
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
            .then(({ data }) => {
                resolve(data);
            })
            .catch((e) => {
                const response = e['response'] || null;
                const data = (response && response['data']) || null;
                e.message = (data && data['message']) || e.message;
                reject(e);
            });
    });
}

export function newPartner(username, name, email, password) {
    return new Promise((resolve, reject) => {
        reqI.get(`/registerPartner`, {
            params: { username, name, email, password },
        })
            .then(({ data }) => {
                resolve(data);
            })
            .catch((e) => {
                const response = e['response'] || null;
                const data = (response && response['data']) || null;
                e.message = (data && data['message']) || e.message;
                reject(e);
            });
    });
}

export function editPartner(params) {
    return new Promise((resolve, reject) => {
        reqI.get(`/bo/partner/profile/edit`, {
            params,
        })
            .then(({ data }) => {
                resolve(data);
            })
            .catch((e) => {
                const response = e['response'] || null;
                const data = (response && response['data']) || null;
                e.message = (data && data['message']) || e.message;
                reject(e);
            });
    });
}

export function getListUser(filter = '') {
    return new Promise((resolve, reject) => {
        reqI.get(`/user/list`, {
            params: {
                filter,
            },
        })
            .then(({ data }) => {
                resolve(data);
            })
            .catch((e) => {
                const response = e['response'] || null;
                const data = (response && response['data']) || null;
                e.message = (data && data['message']) || e.message;
                reject(e);
            });
    });
}

export function createUser(role, username, password, name, phone, email) {
    return new Promise((resolve, reject) => {
        reqI.get(`/user/create-user`, {
            params: {
                role,
                username,
                password,
                name,
                phone,
                email,
            },
        })
            .then(({ data }) => {
                resolve(data);
            })
            .catch((e) => {
                const response = e['response'] || null;
                const data = (response && response['data']) || null;
                e.message = (data && data['message']) || e.message;
                reject(e);
            });
    });
}

export function updateUser(id, name, phone, email) {
    return new Promise((resolve, reject) => {
        reqI.get(`/user/update-user/${id}`, {
            params: {
                name,
                phone,
                email,
            },
        })
            .then(({ data }) => {
                resolve(data);
            })
            .catch((e) => {
                const response = e['response'] || null;
                const data = (response && response['data']) || null;
                e.message = (data && data['message']) || e.message;
                reject(e);
            });
    });
}

export function updatePassword(id, password) {
    return new Promise((resolve, reject) => {
        reqI.get(`/user/update-password/${id}`, {
            params: {
                password,
            },
        })
            .then(({ data }) => {
                resolve(data);
            })
            .catch((e) => {
                const response = e['response'] || null;
                const data = (response && response['data']) || null;
                e.message = (data && data['message']) || e.message;
                reject(e);
            });
    });
}

export function getListRole() {
    return new Promise((resolve, reject) => {
        reqI.get(`/data/list-role`)
            .then(({ data }) => {
                resolve(data);
            })
            .catch((e) => {
                const response = e['response'] || null;
                const data = (response && response['data']) || null;
                e.message = (data && data['message']) || e.message;
                reject(e);
            });
    });
}

export function getListPermission() {
    return new Promise((resolve, reject) => {
        reqI.get(`/data/list-permission`)
            .then(({ data }) => {
                resolve(data);
            })
            .catch((e) => {
                const response = e['response'] || null;
                const data = (response && response['data']) || null;
                e.message = (data && data['message']) || e.message;
                reject(e);
            });
    });
}

export function createPartner(username, password, name, email, contactPhone) {
    return new Promise((resolve, reject) => {
        reqI.get(`/partner/register`, {
            params: {
                username,
                password,
                name,
                email,
                contactPhone,
            },
        })
            .then(({ data }) => {
                resolve(data);
            })
            .catch((e) => {
                const response = e['response'] || null;
                const data = (response && response['data']) || null;
                e.message = (data && data['message']) || e.message;
                reject(e);
            });
    });
}

export function getProfilePartner() {
    return new Promise((resolve, reject) => {
        reqI.get(`/bo/partner/profile`)
            .then(({ data }) => {
                resolve(data);
            })
            .catch((e) => {
                const response = e['response'] || null;
                const data = (response && response['data']) || null;
                e.message = (data && data['message']) || e.message;
                reject(e);
            });
    });
}

export function getListPartner() {
    return new Promise((resolve, reject) => {
        reqI.get(`/partner/all`)
            .then(({ data }) => {
                resolve(data);
            })
            .catch((e) => {
                const response = e['response'] || null;
                const data = (response && response['data']) || null;
                e.message = (data && data['message']) || e.message;
                reject(e);
            });
    });
}

export function getPartnerInfo(partnerId) {
    return new Promise((resolve, reject) => {
        reqI.get(`/partner/info?partnerId=${partnerId}`)
            .then(({ data }) => {
                resolve(data);
            })
            .catch((e) => {
                const response = e['response'] || null;
                const data = (response && response['data']) || null;
                e.message = (data && data['message']) || e.message;
                reject(e);
            });
    });
}

export function updatePartner(
    partnerId,
    name,
    contactName,
    contactPhone,
    contactEmail,
    companyName,
    companyAddress,
    companyLogo,
    banner,
    miniAppLoyalty,
    status,
    cdpAccessToken,
    cdpRefreshToken,
    cdpAppId,
    cdpAppSecretKey,
    partnerAppId,
    partnerAppSecretKey,
    oaId,
    miniGameUrl,
) {
    return new Promise((resolve, reject) => {
        reqI.post(`/partner/update`, {
            partnerId,
            name,
            contactName,
            contactPhone,
            contactEmail,
            companyName,
            companyAddress,
            companyLogo,
            banner,
            miniAppLoyalty,
            status,
            cdpAccessToken,
            cdpRefreshToken,
            cdpAppId,
            cdpAppSecretKey,
            partnerAppId,
            partnerAppSecretKey,
            oaId,
            miniGameUrl,
        })
            .then(({ data }) => {
                resolve(data);
            })
            .catch((e) => {
                const response = e['response'] || null;
                const data = (response && response['data']) || null;
                e.message = (data && data['message']) || e.message;
                reject(e);
            });
    });
}

export function updateActivatePartner(id, activate, name, ownerId) {
    return new Promise((resolve, reject) => {
        reqI.get(`/partner/update`, {
            params: {
                id,
                activate: activate ? '1' : '0',
                name,
                ownerId,
            },
        })
            .then(({ data }) => {
                resolve(data);
            })
            .catch((e) => {
                const response = e['response'] || null;
                const data = (response && response['data']) || null;
                e.message = (data && data['message']) || e.message;
                reject(e);
            });
    });
}

export function updateOaId(partnerId, oaId, name, description) {
    return new Promise((resolve, reject) => {
        reqI.get(`/partner/updateOaId`, {
            params: {
                partnerId,
                oaId,
                name,
                description,
            },
        })
            .then(({ data }) => {
                resolve(data);
            })
            .catch((e) => {
                const response = e['response'] || null;
                const data = (response && response['data']) || null;
                e.message = (data && data['message']) || e.message;
                reject(e);
            });
    });
}

export function getListGame() {
    return new Promise((resolve, reject) => {
        reqI.get(`/data/game/list`)
            .then(({ data }) => {
                resolve(data);
            })
            .catch((e) => {
                const response = e['response'] || null;
                const data = (response && response['data']) || null;
                e.message = (data && data['message']) || e.message;
                reject(e);
            });
    });
}

export function getListEvent() {
    return new Promise((resolve, reject) => {
        reqI.get(`/bo/event/list`)
            .then(({ data }) => {
                resolve(data);
            })
            .catch((e) => {
                const response = e['response'] || null;
                const data = (response && response['data']) || null;
                e.message = (data && data['message']) || e.message;
                reject(e);
            });
    });
}

export function createEvent(name, partnerId, gameId, timeStart, timeEnd, activate, canCheat) {
    return new Promise((resolve, reject) => {
        reqI.get(`/bo/event/create`, {
            params: {
                name,
                partnerId,
            },
        })
            .then(({ data }) => {
                resolve(data);
            })
            .catch((e) => {
                const response = e['response'] || null;
                const data = (response && response['data']) || null;
                e.message = (data && data['message']) || e.message;
                reject(e);
            });
    });
}

export function updateEvent(eventId, payload) {
    return new Promise((resolve, reject) => {
        reqI.get(`/bo/event/${eventId}/edit?payload=${payload}`)
            .then(({ data }) => {
                resolve(data);
            })
            .catch((e) => {
                const response = e['response'] || null;
                const data = (response && response['data']) || null;
                e.message = (data && data['message']) || e.message;
                reject(e);
            });
    });
}

export function launchEvent(eventId, timeS, timeE, hostPass, gameId, canCheat, name) {
    return new Promise((resolve, reject) => {
        reqI.get(
            `/bo/event/${eventId}/launch?timeStart=${timeS}&timeEnd=${timeE}&hostPassword=${hostPass}&gameId=${gameId}&canCheat=${canCheat}&name=${name}`,
        )
            .then(({ data }) => {
                resolve(data);
            })
            .catch((e) => {
                const response = e['response'] || null;
                const data = (response && response['data']) || null;
                e.message = (data && data['message']) || e.message;
                reject(e);
            });
    });
}

export function createProjectEventLive(projectId, gameId, name, miniAppId) {
    return new Promise((resolve, reject) => {
        reqI.get(`/bo/project/${projectId}/eventLive/create`, {
            params: {
                gameId,
                name,
                miniAppId,
            },
        })
            .then(({ data }) => {
                resolve(data);
            })
            .catch((e) => {
                const response = e['response'] || null;
                const data = (response && response['data']) || null;
                e.message = (data && data['message']) || e.message;
                reject(e);
            });
    });
}

export function getListEventLive(eventId, projectId) {
    return new Promise((resolve, reject) => {
        reqI.get(`/bo/eventLive/list`, {
            params: {
                eventId: eventId || '',
                projectId: projectId || '',
            },
        })
            .then(({ data }) => {
                resolve(data);
            })
            .catch((e) => {
                const response = e['response'] || null;
                const data = (response && response['data']) || null;
                e.message = (data && data['message']) || e.message;
                reject(e);
            });
    });
}

export function getListPackage() {
    return new Promise((resolve, reject) => {
        reqI.get(`/bo/package/list`)
            .then(({ data }) => {
                resolve(data);
            })
            .catch((e) => {
                const response = e['response'] || null;
                const data = (response && response['data']) || null;
                e.message = (data && data['message']) || e.message;
                reject(e);
            });
    });
}

export function getEventLive(eventLiveId) {
    return new Promise((resolve, reject) => {
        reqI.get(`/bo/eventLive/${eventLiveId}`)
            .then(({ data }) => {
                resolve(data);
            })
            .catch((e) => {
                const response = e['response'] || null;
                const data = (response && response['data']) || null;
                e.message = (data && data['message']) || e.message;
                reject(e);
            });
    });
}

export function syncRewardWithVoucherTemplate(eventLiveGameId, params) {
    return new Promise((resolve, reject) => {
        reqI.get(`/bo/eventLiveGame/${eventLiveGameId}/syncRewardWithVoucherTemplate`, { params })
            .then(({ data }) => {
                resolve(data);
            })
            .catch((e) => {
                const response = e['response'] || null;
                const data = (response && response['data']) || null;
                e.message = (data && data['message']) || e.message;
                reject(e);
            });
    });
}

export function getLaunchingEvent(eventId) {
    return new Promise((resolve, reject) => {
        reqI.get(`/liveEvent/${eventId}`)
            .then(({ data }) => {
                resolve(data);
            })
            .catch((e) => {
                const response = e['response'] || null;
                const data = (response && response['data']) || null;
                e.message = (data && data['message']) || e.message;
                reject(e);
            });
    });
}

export function editEventLive(eventLiveId, config) {
    return new Promise((resolve, reject) => {
        reqI.get(`/bo/eventLive/${eventLiveId}/edit?payload=${config}`)
            .then(({ data }) => {
                resolve(data);
            })
            .catch((e) => {
                const response = e['response'] || null;
                const data = (response && response['data']) || null;
                e.message = (data && data['message']) || e.message;
                reject(e);
            });
    });
}

export function eventLiveConnectZaloMiniApp(eventLiveId, zaloMiniAppId) {
    return new Promise((resolve, reject) => {
        reqI.get(`/bo/eventLive/${eventLiveId}/connectZaloMiniApp`, {
            params: { zaloMiniAppId },
        })
            .then(({ data }) => {
                resolve(data);
            })
            .catch((e) => {
                const response = e['response'] || null;
                const data = (response && response['data']) || null;
                e.message = (data && data['message']) || e.message;
                reject(e);
            });
    });
}

export function editEventLiveGame(eventLiveGameId, config) {
    return new Promise((resolve, reject) => {
        reqI.get(`/bo/eventLiveGame/${eventLiveGameId}/edit?config=${config}`)
            .then(({ data }) => {
                resolve(data);
            })
            .catch((e) => {
                const response = e['response'] || null;
                const data = (response && response['data']) || null;
                e.message = (data && data['message']) || e.message;
                reject(e);
            });
    });
}

export function getListEventLog(eventLiveId) {
    return new Promise((resolve, reject) => {
        reqI.get(`/data/${eventLiveId}/partnerEventLog`)
            .then(({ data }) => {
                resolve(data);
            })
            .catch((e) => {
                const response = e['response'] || null;
                const data = (response && response['data']) || null;
                e.message = (data && data['message']) || e.message;
                reject(e);
            });
    });
}

export function getEventLiveReport(eventLiveId) {
    return new Promise((resolve, reject) => {
        reqI.get(`/data/${eventLiveId}/report`)
            .then(({ data }) => {
                resolve(data);
            })
            .catch((e) => {
                const response = e['response'] || null;
                const data = (response && response['data']) || null;
                e.message = (data && data['message']) || e.message;
                reject(e);
            });
    });
}

export function confirmClaimedEventLog(eventLiveId, roundId) {
    return new Promise((resolve, reject) => {
        reqI.get(`/data/${eventLiveId}/partnerEventLog/confirmClaimed?roundId=${roundId}`)
            .then(({ data }) => {
                resolve(data);
            })
            .catch((e) => {
                const response = e['response'] || null;
                const data = (response && response['data']) || null;
                e.message = (data && data['message']) || e.message;
                reject(e);
            });
    });
}

export function getListProject() {
    return new Promise((resolve, reject) => {
        reqI.get(`/bo/project/list`)
            .then(({ data }) => {
                resolve(data);
            })
            .catch((e) => {
                const response = e['response'] || null;
                const data = (response && response['data']) || null;
                e.message = (data && data['message']) || e.message;
                reject(e);
            });
    });
}

export function getProject(projectId) {
    return new Promise((resolve, reject) => {
        reqI.get(`/bo/project/${projectId}`)
            .then(({ data }) => {
                resolve(data);
            })
            .catch((e) => {
                const response = e['response'] || null;
                const data = (response && response['data']) || null;
                e.message = (data && data['message']) || e.message;
                reject(e);
            });
    });
}

export function getProjectAdvisions(projectId) {
    return new Promise((resolve, reject) => {
        reqI.get(`/bo/project/${projectId}/advision`)
            .then(({ data }) => {
                resolve(data);
            })
            .catch((e) => {
                const response = e['response'] || null;
                const data = (response && response['data']) || null;
                e.message = (data && data['message']) || e.message;
                reject(e);
            });
    });
}

export function createProject(payload, mediaFiles) {
    let formData = new FormData();
    formData.append('payload', JSON.stringify(payload)); // Phải stringify JSON
    mediaFiles.forEach((file, index) => {
        formData.append('mediaFiles', file);
    });

    return new Promise((resolve, reject) => {
        reqI.post(`/bo/project/create`, formData, {
            baseURL: process.env.REACT_APP_API_UPLOAD_BASE_ENDPOINT,
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
            .then(({ data }) => {
                resolve(data);
            })
            .catch((e) => {
                const response = e['response'] || null;
                const data = (response && response['data']) || null;
                e.message = (data && data['message']) || e.message;
                reject(e);
            });
    });
}

export function editProject(projectId, payload, mediaFiles) {
    let formData = new FormData();
    formData.append('payload', JSON.stringify(payload)); // Phải stringify JSON
    mediaFiles.forEach((file, index) => {
        let _file = file;
        if (file === null || file === undefined) {
            _file = new File([''], '__empty.txt', { type: 'text/plain' });
        }
        formData.append('mediaFiles', _file);
    });

    return new Promise((resolve, reject) => {
        reqI.post(`/bo/project/edit/${projectId}`, formData, {
            baseURL: process.env.REACT_APP_API_UPLOAD_BASE_ENDPOINT,
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
            .then(({ data }) => {
                resolve(data);
            })
            .catch((e) => {
                const response = e['response'] || null;
                const data = (response && response['data']) || null;
                e.message = (data && data['message']) || e.message;
                reject(e);
            });
    });
}

export function linkDeviceProject(projectId, deviceId) {
    return new Promise((resolve, reject) => {
        reqI.get(`/bo/project/${projectId}/linkDevice`, {
            params: {
                deviceId,
            },
        })
            .then(({ data }) => {
                resolve(data);
            })
            .catch((e) => {
                const response = e['response'] || null;
                const data = (response && response['data']) || null;
                e.message = (data && data['message']) || e.message;
                reject(e);
            });
    });
}

export function projectRebootDevices(projectId) {
    return new Promise((resolve, reject) => {
        reqI.get(`/bo/project/${projectId}/rebootDevices`)
            .then(({ data }) => {
                resolve(data);
            })
            .catch((e) => {
                const response = e['response'] || null;
                const data = (response && response['data']) || null;
                e.message = (data && data['message']) || e.message;
                reject(e);
            });
    });
}

export function projectChangePackage(projectId, packageId) {
    return new Promise((resolve, reject) => {
        reqI.get(`/bo/project/${projectId}/changePackage`, {
            params: { packageId },
        })
            .then(({ data }) => {
                resolve(data);
            })
            .catch((e) => {
                const response = e['response'] || null;
                const data = (response && response['data']) || null;
                e.message = (data && data['message']) || e.message;
                reject(e);
            });
    });
}

export function unLinkDeviceProject(projectId, deviceId) {
    return new Promise((resolve, reject) => {
        reqI.get(`/bo/project/${projectId}/unLinkDevice`, {
            params: {
                deviceId,
            },
        })
            .then(({ data }) => {
                resolve(data);
            })
            .catch((e) => {
                const response = e['response'] || null;
                const data = (response && response['data']) || null;
                e.message = (data && data['message']) || e.message;
                reject(e);
            });
    });
}

export function eventLiveChangeStatus(eventLiveId, status = 1) {
    return new Promise((resolve, reject) => {
        reqI.get(`/bo/eventLive/${eventLiveId}/changeStatus`, {
            params: { status },
        })
            .then(({ data }) => {
                resolve(data);
            })
            .catch((e) => {
                const response = e['response'] || null;
                const data = (response && response['data']) || null;
                e.message = (data && data['message']) || e.message;
                reject(e);
            });
    });
}

export function billing() {
    return new Promise((resolve, reject) => {
        reqI.get(`/bo/partner/billing`)
            .then(({ data }) => {
                resolve(data);
            })
            .catch((e) => {
                const response = e['response'] || null;
                const data = (response && response['data']) || null;
                e.message = (data && data['message']) || e.message;
                reject(e);
            });
    });
}

export function deposit(amount, note) {
    return new Promise((resolve, reject) => {
        reqI.get(`/payment/deposit`, {
            params: {
                amount,
                note,
            },
        })
            .then(({ data }) => {
                resolve(data);
            })
            .catch((e) => {
                const response = e['response'] || null;
                const data = (response && response['data']) || null;
                e.message = (data && data['message']) || e.message;
                reject(e);
            });
    });
}

export function loginEvent(eventId, userName, userPhone, eventCode) {
    return new Promise((resolve, reject) => {
        reqI.get(`/liveEvent/${eventId}/join/login`, {
            params: {
                userName,
                userPhone,
                eventCode,
            },
        })
            .then(({ data }) => {
                resolve(data);
            })
            .catch((e) => {
                const response = e['response'] || null;
                const data = (response && response['data']) || null;
                e.message = (data && data['message']) || e.message;
                reject(e);
            });
    });
}

export function loginEventByToken(eventId, authToken) {
    return new Promise((resolve, reject) => {
        reqI.get(`/liveEvent/${eventId}/join/loginByToken`, {
            params: {
                authToken,
            },
        })
            .then(({ data }) => {
                resolve(data);
            })
            .catch((e) => {
                const response = e['response'] || null;
                const data = (response && response['data']) || null;
                e.message = (data && data['message']) || e.message;
                reject(e);
            });
    });
}

export function getDevices() {
    return new Promise((resolve, reject) => {
        reqI.get(`/superAdmin/device/list`)
            .then(({ data }) => {
                resolve(data);
            })
            .catch((e) => {
                const response = e['response'] || null;
                const data = (response && response['data']) || null;
                e.message = (data && data['message']) || e.message;
                reject(e);
            });
    });
}

export function createDevice(deviceId, name, serialNumber, macAddress) {
    return new Promise((resolve, reject) => {
        reqI.get(`/superAdmin/device/create`, {
            params: {
                deviceId,
                name,
                serialNumber,
                macAddress,
            },
        })
            .then(({ data }) => {
                resolve(data);
            })
            .catch((e) => {
                const response = e['response'] || null;
                const data = (response && response['data']) || null;
                e.message = (data && data['message']) || e.message;
                reject(e);
            });
    });
}

export function getPackages() {
    return new Promise((resolve, reject) => {
        reqI.get(`/superAdmin/package/list`)
            .then(({ data }) => {
                resolve(data);
            })
            .catch((e) => {
                const response = e['response'] || null;
                const data = (response && response['data']) || null;
                e.message = (data && data['message']) || e.message;
                reject(e);
            });
    });
}

export function getZaloApps() {
    return new Promise((resolve, reject) => {
        reqI.get(`/superAdmin/zaloApp/list`)
            .then(({ data }) => {
                resolve(data);
            })
            .catch((e) => {
                const response = e['response'] || null;
                const data = (response && response['data']) || null;
                e.message = (data && data['message']) || e.message;
                reject(e);
            });
    });
}

export function createZaloApp(id, name, description) {
    return new Promise((resolve, reject) => {
        reqI.get(`/superAdmin/zaloApp/create`, {
            params: {
                id,
                name,
                description,
            },
        })
            .then(({ data }) => {
                resolve(data);
            })
            .catch((e) => {
                const response = e['response'] || null;
                const data = (response && response['data']) || null;
                e.message = (data && data['message']) || e.message;
                reject(e);
            });
    });
}

export function createZaloMiniApp(partnerId, appId, id, name, oaId = '') {
    return new Promise((resolve, reject) => {
        reqI.get(`/superAdmin/zaloApp/${partnerId}/createMiniApp`, {
            params: {
                id,
                mini_app_id: id,
                name,
                zalo_app_id: appId,
                oaId,
            },
        })
            .then(({ data }) => {
                resolve(data);
            })
            .catch((e) => {
                const response = e['response'] || null;
                const data = (response && response['data']) || null;
                e.message = (data && data['message']) || e.message;
                reject(e);
            });
    });
}

export function getVoucherTemplate(params) {
    return new Promise((resolve, reject) => {
        reqI.get(`/voucher/list-templates`, {
            params,
        })
            .then(({ data }) => {
                resolve(data);
            })
            .catch((e) => {
                const response = e['response'] || null;
                const data = (response && response['data']) || null;
                e.message = (data && data['message']) || e.message;
                reject(e);
            });
    });
}

export function getVoucherTemplateDetail(params) {
    return new Promise((resolve, reject) => {
        reqI.get(`/voucher/detail-template`, {
            params,
        })
            .then(({ data }) => {
                resolve(data);
            })
            .catch((e) => {
                const response = e['response'] || null;
                const data = (response && response['data']) || null;
                e.message = (data && data['message']) || e.message;
                reject(e);
            });
    });
}

export function createVoucherTemplate(params) {
    return new Promise((resolve, reject) => {
        reqI.get(`/voucher/createVoucherTemplate`, {
            params,
        })
            .then(({ data }) => {
                resolve(data);
            })
            .catch((e) => {
                const response = e['response'] || null;
                const data = (response && response['data']) || null;
                e.message = (data && data['message']) || e.message;
                reject(e);
            });
    });
}

export function updateVoucherTemplate(params) {
    return new Promise((resolve, reject) => {
        reqI.get(`/voucher/updateVoucherTemplate`, {
            params,
        })
            .then(({ data }) => {
                resolve(data);
            })
            .catch((e) => {
                const response = e['response'] || null;
                const data = (response && response['data']) || null;
                e.message = (data && data['message']) || e.message;
                reject(e);
            });
    });
}

export function getMessageTemplate(params) {
    return new Promise((resolve, reject) => {
        reqI.get(`/message/list-templates`, {
            params,
        })
            .then(({ data }) => {
                resolve(data);
            })
            .catch((e) => {
                const response = e['response'] || null;
                const data = (response && response['data']) || null;
                e.message = (data && data['message']) || e.message;
                reject(e);
            });
    });
}

export function getMessageTemplateDetail(params) {
    return new Promise((resolve, reject) => {
        reqI.get(`/message/detail-template`, {
            params,
        })
            .then(({ data }) => {
                resolve(data);
            })
            .catch((e) => {
                const response = e['response'] || null;
                const data = (response && response['data']) || null;
                e.message = (data && data['message']) || e.message;
                reject(e);
            });
    });
}

export function getZNSTemplate(params) {
    return new Promise((resolve, reject) => {
        reqI.get(`/zns/template/all`, {
            params,
        })
            .then(({ data }) => {
                resolve(data);
            })
            .catch((e) => {
                const response = e['response'] || null;
                const data = (response && response['data']) || null;
                e.message = (data && data['message']) || e.message;
                reject(e);
            });
    });
}

export function getZNSTemplateDetail(params) {
    return new Promise((resolve, reject) => {
        reqI.get(`/zns/template/detail`, {
            params,
        })
            .then(({ data }) => {
                resolve(data);
            })
            .catch((e) => {
                const response = e['response'] || null;
                const data = (response && response['data']) || null;
                e.message = (data && data['message']) || e.message;
                reject(e);
            });
    });
}

export function createMailTemplate(data) {
    return new Promise((resolve, reject) => {
        reqI.post(`/message/createMessageTemplate`, data)
            .then(({ data }) => {
                resolve(data);
            })
            .catch((e) => {
                const response = e['response'] || null;
                const data = (response && response['data']) || null;
                e.message = (data && data['message']) || e.message;
                reject(e);
            });
    });
}

export function updateMailTemplate(data) {
    return new Promise((resolve, reject) => {
        reqI.post(`/message/updateMessageTemplate`, data)
            .then(({ data }) => {
                resolve(data);
            })
            .catch((e) => {
                const response = e['response'] || null;
                const data = (response && response['data']) || null;
                e.message = (data && data['message']) || e.message;
                reject(e);
            });
    });
}

export function uploadImage(formData, onUploadProgress) {
    return new Promise((resolve, reject) => {
        reqI.post(`/uploadImage`, formData, {
            baseURL: process.env.REACT_APP_API_UPLOAD_BASE_ENDPOINT,
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            onUploadProgress: (e) => {
                onUploadProgress(e);
            },
        })
            .then(({ data }) => {
                resolve(data);
            })
            .catch((e) => {
                const response = e['response'] || null;
                const data = (response && response['data']) || null;
                e.message = (data && data['message']) || e.message;
                reject(e);
            });
    });
}

export function getAllAutomationWorkflow(params) {
    return new Promise((resolve, reject) => {
        reqI.get(`/zalo/automation/workflow/all`, {
            params,
        })
            .then(({ data }) => {
                resolve(data);
            })
            .catch((e) => {
                const response = e['response'] || null;
                const data = (response && response['data']) || null;
                e.message = (data && data['message']) || e.message;
                reject(e);
            });
    });
}

export function cloneAutomationWorkflow(params) {
    return new Promise((resolve, reject) => {
        reqI.get(`/zalo/automation/workflow/clone`, {
            params,
        })
            .then(({ data }) => {
                resolve(data);
            })
            .catch((e) => {
                const response = e['response'] || null;
                const data = (response && response['data']) || null;
                e.message = (data && data['message']) || e.message;
                reject(e);
            });
    });
}

export function getAutomationWorkflow(params) {
    return new Promise((resolve, reject) => {
        reqI.get(`/zalo/automation/workflow/detail`, {
            params,
        })
            .then(({ data }) => {
                resolve(data);
            })
            .catch((e) => {
                const response = e['response'] || null;
                const data = (response && response['data']) || null;
                e.message = (data && data['message']) || e.message;
                reject(e);
            });
    });
}

export function getAutomationStepList(params) {
    return new Promise((resolve, reject) => {
        reqI.get(`/zalo/automation/step/list`, {
            params,
        })
            .then(({ data }) => {
                resolve(data);
            })
            .catch((e) => {
                const response = e['response'] || null;
                const data = (response && response['data']) || null;
                e.message = (data && data['message']) || e.message;
                reject(e);
            });
    });
}

export function updateAutomationWorkflow(data) {
    return new Promise((resolve, reject) => {
        reqI.post(`/zalo/automation/workflow/update`, data)
            .then(({ data }) => {
                resolve(data);
            })
            .catch((e) => {
                const response = e['response'] || null;
                const data = (response && response['data']) || null;
                e.message = (data && data['message']) || e.message;
                reject(e);
            });
    });
}

export function createAutomationWorkflow(data) {
    return new Promise((resolve, reject) => {
        reqI.post(`/zalo/automation/workflow/create`, data)
            .then(({ data }) => {
                resolve(data);
            })
            .catch((e) => {
                const response = e['response'] || null;
                const data = (response && response['data']) || null;
                e.message = (data && data['message']) || e.message;
                reject(e);
            });
    });
}

export function updateAutomationWorkflowStatus(params) {
    return new Promise((resolve, reject) => {
        reqI.get(`/zalo/automation/workflow/status`, { params })
            .then(({ data }) => {
                resolve(data);
            })
            .catch((e) => {
                const response = e['response'] || null;
                const data = (response && response['data']) || null;
                e.message = (data && data['message']) || e.message;
                reject(e);
            });
    });
}

export function previewAutomationWorkflowStatus(params) {
    return new Promise((resolve, reject) => {
        reqI.get(`/zalo/automation/workflows/preview`, { params })
            .then(({ data }) => {
                resolve(data);
            })
            .catch((e) => {
                const response = e['response'] || null;
                const data = (response && response['data']) || null;
                e.message = (data && data['message']) || e.message;
                reject(e);
            });
    });
}

export function createWorkflowStep(data) {
    return new Promise((resolve, reject) => {
        reqI.post(`/zalo/automation/step/insertBatch`, data)
            .then(({ data }) => {
                resolve(data);
            })
            .catch((e) => {
                const response = e['response'] || null;
                const data = (response && response['data']) || null;
                e.message = (data && data['message']) || e.message;
                reject(e);
            });
    });
}

export function updateWorkflowStep(data) {
    return new Promise((resolve, reject) => {
        reqI.post(`/zalo/automation/step/update`, data)
            .then(({ data }) => {
                resolve(data);
            })
            .catch((e) => {
                const response = e['response'] || null;
                const data = (response && response['data']) || null;
                e.message = (data && data['message']) || e.message;
                reject(e);
            });
    });
}

export function updateWorkflowStepOrderBatch(data) {
    return new Promise((resolve, reject) => {
        reqI.post(`/zalo/automation/step/updateOrderBatch`, data)
            .then(({ data }) => {
                resolve(data);
            })
            .catch((e) => {
                const response = e['response'] || null;
                const data = (response && response['data']) || null;
                e.message = (data && data['message']) || e.message;
                reject(e);
            });
    });
}

export function deleteWorkflowStep(params) {
    return new Promise((resolve, reject) => {
        reqI.delete(`/zalo/automation/step/delete`, {
            params,
        })
            .then(({ data }) => {
                resolve(data);
            })
            .catch((e) => {
                const response = e['response'] || null;
                const data = (response && response['data']) || null;
                e.message = (data && data['message']) || e.message;
                reject(e);
            });
    });
}

export function getOATagList(params) {
    return new Promise((resolve, reject) => {
        reqI.get(`/tags/all`, {
            params,
        })
            .then(({ data }) => {
                resolve(data);
            })
            .catch((e) => {
                const response = e['response'] || null;
                const data = (response && response['data']) || null;
                e.message = (data && data['message']) || e.message;
                reject(e);
            });
    });
}

export function getCustomers(params) {
    return new Promise((resolve, reject) => {
        reqI.get(`/user/list`, {
            params,
        })
            .then(({ data }) => {
                resolve(data);
            })
            .catch((e) => {
                const response = e['response'] || null;
                const data = (response && response['data']) || null;
                e.message = (data && data['message']) || e.message;
                reject(e);
            });
    });
}

export function getCustomer(params) {
    return new Promise((resolve, reject) => {
        reqI.get(`/user/detail`, {
            params,
        })
            .then(({ data }) => {
                resolve(data);
            })
            .catch((e) => {
                const response = e['response'] || null;
                const data = (response && response['data']) || null;
                e.message = (data && data['message']) || e.message;
                reject(e);
            });
    });
}

export function getVouchers(params) {
    return new Promise((resolve, reject) => {
        reqI.get(`/voucher/list`, {
            params,
        })
            .then(({ data }) => {
                resolve(data);
            })
            .catch((e) => {
                const response = e['response'] || null;
                const data = (response && response['data']) || null;
                e.message = (data && data['message']) || e.message;
                reject(e);
            });
    });
}

export function getMessageLogs(params) {
    return new Promise((resolve, reject) => {
        reqI.get(`/messageLog/list`, {
            params,
        })
            .then(({ data }) => {
                resolve(data);
            })
            .catch((e) => {
                const response = e['response'] || null;
                const data = (response && response['data']) || null;
                e.message = (data && data['message']) || e.message;
                reject(e);
            });
    });
}

export function statOverview(params) {
    return new Promise((resolve, reject) => {
        reqI.get(`/stat/overview`, {
            params,
        })
            .then(({ data }) => {
                resolve(data);
            })
            .catch((e) => {
                const response = e['response'] || null;
                const data = (response && response['data']) || null;
                e.message = (data && data['message']) || e.message;
                reject(e);
            });
    });
}

export function statOverviewTrends(params) {
    return new Promise((resolve, reject) => {
        reqI.get(`/stat/overview/trends`, {
            params,
        })
            .then(({ data }) => {
                resolve(data);
            })
            .catch((e) => {
                const response = e['response'] || null;
                const data = (response && response['data']) || null;
                e.message = (data && data['message']) || e.message;
                reject(e);
            });
    });
}

export function getListFormTemplate(params) {
    return new Promise((resolve, reject) => {
        reqI.get(`/dynamicForm/form/list`, {
            params,
        })
            .then(({ data }) => {
                resolve(data);
            })
            .catch((e) => {
                const response = e['response'] || null;
                const data = (response && response['data']) || null;
                e.message = (data && data['message']) || e.message;
                reject(e);
            });
    });
}

export function getDynamicFormDetail(params) {
    // api/dynamicForm/form/detail?formId=123
    return new Promise((resolve, reject) => {
        reqI.get(`/dynamicForm/form/detail`, {
            params,
        })
            .then(({ data }) => {
                resolve(data);
            })
            .catch((e) => {
                const response = e['response'] || null;
                const data = (response && response['data']) || null;
                e.message = (data && data['message']) || e.message;
                reject(e);
            });
    });
}

export function createFormTemplate(body) {
    return new Promise((resolve, reject) => {
        reqI.post(`/dynamicForm/form/create`, body)
            .then(({ data }) => {
                resolve(data);
            })
            .catch((e) => {
                const response = e['response'] || null;
                const data = (response && response['data']) || null;
                e.message = (data && data['message']) || e.message;
                reject(e);
            });
    });
}

export function updateFormTemplate(body) {
    return new Promise((resolve, reject) => {
        reqI.post(`/dynamicForm/form/update`, body)
            .then(({ data }) => {
                resolve(data);
            })
            .catch((e) => {
                const response = e['response'] || null;
                const data = (response && response['data']) || null;
                e.message = (data && data['message']) || e.message;
                reject(e);
            });
    });
}

export function getSubmissionList(params) {
    return new Promise((resolve, reject) => {
        reqI.get(`/dynamicAction/submission/list`, {
            params,
        })
            .then(({ data }) => {
                resolve(data);
            })
            .catch((e) => {
                const response = e['response'] || null;
                const data = (response && response['data']) || null;
                e.message = (data && data['message']) || e.message;
                reject(e);
            });
    });
}

export function getSubmissionListByUser(params) {
    return new Promise((resolve, reject) => {
        reqI.get(`/dynamicAction/submission/byUser`, {
            params,
        })
            .then(({ data }) => {
                resolve(data);
            })
            .catch((e) => {
                const response = e['response'] || null;
                const data = (response && response['data']) || null;
                e.message = (data && data['message']) || e.message;
                reject(e);
            });
    });
}

export function getSubmissionDetail(params) {
    // dynamicAction/submission/detail?submissionId=5551
    return new Promise((resolve, reject) => {
        reqI.get(`/dynamicAction/submission/detail`, {
            params,
        })
            .then(({ data }) => {
                resolve(data);
            })
            .catch((e) => {
                const response = e['response'] || null;
                const data = (response && response['data']) || null;
                e.message = (data && data['message']) || e.message;
                reject(e);
            });
    });
}

export function createMission(params) {
    return new Promise((resolve, reject) => {
        reqI.post(`/mission/create`, params)
            .then(({ data }) => {
                resolve(data);
            })
            .catch((e) => {
                const response = e['response'] || null;
                const data = (response && response['data']) || null;
                e.message = (data && data['message']) || e.message;
                reject(e);
            });
    });
}

export function updateMission(params) {
    return new Promise((resolve, reject) => {
        reqI.put(`/mission/update`, params)
            .then(({ data }) => {
                resolve(data);
            })
            .catch((e) => {
                const response = e['response'] || null;
                const data = (response && response['data']) || null;
                e.message = (data && data['message']) || e.message;
                reject(e);
            });
    });
}

export function getMissionList(params) {
    // api/mission/list?partnerId=&status=&userId=
    return new Promise((resolve, reject) => {
        reqI.get(`/mission/list`, {
            params,
        })
            .then(({ data }) => {
                resolve(data);
            })
            .catch((e) => {
                const response = e['response'] || null;
                const data = (response && response['data']) || null;
                e.message = (data && data['message']) || e.message;
                reject(e);
            });
    });
}

export function getReport(params) {
    // api/dynamicForm/report/dashboardAll?from=1725100000&to=1727700000&interval=day
    return new Promise((resolve, reject) => {
        reqI.get(`/dynamicForm/report/dashboardAll`, {
            params,
        })
            .then(({ data }) => {
                resolve(data);
            })
            .catch((e) => {
                const response = e['response'] || null;
                const data = (response && response['data']) || null;
                e.message = (data && data['message']) || e.message;
                reject(e);
            });
    });
}

export function getReportDetail(params) {
    // api/dynamicForm/report/dashboard?formId=101&from=1725100000&to=1727700000&interval=day&topField=drink_type&topLimit=5
    return new Promise((resolve, reject) => {
        reqI.get(`/dynamicForm/report/dashboard`, {
            params,
        })
            .then(({ data }) => {
                resolve(data);
            })
            .catch((e) => {
                const response = e['response'] || null;
                const data = (response && response['data']) || null;
                e.message = (data && data['message']) || e.message;
                reject(e);
            });
    });
}

export function getWorkflowNamespace(params) {
    // api/dynamicForm/report/dashboard?formId=101&from=1725100000&to=1727700000&interval=day&topField=drink_type&topLimit=5
    return new Promise((resolve, reject) => {
        reqI.get(`/zalo/automation/workflow/namespace`, {
            params,
        })
            .then(({ data }) => {
                resolve(data);
            })
            .catch((e) => {
                const response = e['response'] || null;
                const data = (response && response['data']) || null;
                e.message = (data && data['message']) || e.message;
                reject(e);
            });
    });
}

export function importUser(data) {
    return new Promise((resolve, reject) => {
        reqI.postForm(`/bo/import/users`, data)
            .then(({ data }) => {
                resolve(data);
            })
            .catch((e) => {
                const response = e['response'] || null;
                const data = (response && response['data']) || null;
                e.message = (data && data['message']) || e.message;
                reject(e);
            });
    });
}
