import * as XLSX from 'xlsx';

export function sleep(n) {
    return new Promise((r) => setTimeout(r, n));
}

export function dateToStringFull(date) {
    try {
        const year = date.getFullYear();
        const month = ('0' + (date.getMonth() + 1)).slice(-2);
        const day = ('0' + date.getDate()).slice(-2);
        const hours = ('0' + date.getHours()).slice(-2);
        const minutes = ('0' + date.getMinutes()).slice(-2);
        const seconds = ('0' + date.getSeconds()).slice(-2);

        return (
            year +
            '-' +
            month +
            '-' +
            day +
            ' ' +
            hours +
            ':' +
            minutes +
            ':' +
            seconds
        );
    } catch (e) {
        return '';
    }
}

export function dateToStringTime(date) {
    try {
        const hours = ('0' + date.getHours()).slice(-2);
        const minutes = ('0' + date.getMinutes()).slice(-2);
        const seconds = ('0' + date.getSeconds()).slice(-2);

        return hours + ':' + minutes + ':' + seconds;
    } catch (e) {
        return '';
    }
}

export function dateToTimestamp(date) {
    return Math.floor(date.getTime() / 1000);
}

export function timestampToDate(sec) {
    if (!sec || sec <= 0) return null;
    return new Date(sec * 1000);
}

export function formatDMYHIS(date, split = '-') {
    try {
        const year = date.getFullYear();
        const month = ('0' + (date.getMonth() + 1)).slice(-2);
        const day = ('0' + date.getDate()).slice(-2);
        const hours = ('0' + date.getHours()).slice(-2);
        const minutes = ('0' + date.getMinutes()).slice(-2);
        const seconds = ('0' + date.getSeconds()).slice(-2);

        return (
            day +
            split +
            month +
            split +
            year +
            ' ' +
            hours +
            ':' +
            minutes +
            ':' +
            seconds
        );
    } catch (e) {
        return '';
    }
}

export function formatDMY(date, split = '-') {
    try {
        const year = date.getFullYear();
        const month = ('0' + (date.getMonth() + 1)).slice(-2);
        const day = ('0' + date.getDate()).slice(-2);

        return day + split + month + split + year;
    } catch (e) {
        return '';
    }
}

export function toDateTimeVN(date) {
    return new Date(date).toLocaleString();
}

export function formatCurrencyVND(amount) {
    return amount.toLocaleString('vi-VN', {
        style: 'currency',
        currency: 'VND',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    });
}

export function shortText(text, prefixLength = 6) {
    const parts = text.split('.');
    if (parts.length < 2) return text;

    const original = parts[0];
    const ext = parts[1];

    const short =
        original.length > prefixLength
            ? shortString(original, prefixLength)
            : original;

    return `${short}.${ext}`;
}

export function shortString(string, prefixLength = 6) {
    if (string.length <= prefixLength) return string;
    return string.slice(0, prefixLength) + '...';
}

export function showToast(
    severity = 'info',
    summary,
    message = 'Có lỗi xảy ra trong quá trình xử lý',
) {
    if (this.current) {
        this.current.show({
            severity,
            summary,
            detail: message,
        });
    } else {
        alert(message);
    }
}

export function getEventLiveStatus(status) {
    const EventLiveStatus = {
        0: 'DEMO',
        1: 'LIVE',
    };

    return EventLiveStatus[status];
}

export const generateLinkGame = ({
    eventId,
    eventLiveId,
    projectId,
    mode,
    deviceId,
    gameUrl,
}) => {
    return `${process.env.REACT_APP_GAME_PLAY_URL}/${mode ? mode : '{0}'}/?projectId=${projectId ? projectId : '{PROJECT_ID}'}&event=${eventId}&eventLiveId=${eventLiveId}&deviceId=${deviceId ? deviceId : '{1}'}&typeOutapp=1&gameUrl=${encodeURIComponent(gameUrl)}`;
};

export const generateLinkMiniAppZalo = (miniAppId) => {
    return `https://zalo.me/s/${miniAppId}/`;
};

export const getQRLink = (url, width = 300, height = 300) => {
    return `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(url)}&size=${width}x${height}`;
};

export const computeLinkGame = (originLink, mode, deviceId) => {
    return originLink.replace('{0}', mode).replace('{1}', deviceId);
};

export const callVoidWithNewThread = (func) => {
    try {
        setTimeout(() => func());
    } catch (e) {
        console.error(e);
    }
};

export function toUnicodeEscape(html) {
    return html
        .split('')
        .map((c) => {
            const code = c.charCodeAt(0);
            return code < 128
                ? // Escape các ký tự đặc biệt
                  c === '<'
                    ? '\\u003C'
                    : c === '>'
                      ? '\\u003E'
                      : c === '/'
                        ? '\\u002F'
                        : c === '"'
                          ? '\\u0022'
                          : c === '&'
                            ? '\\u0026'
                            : c
                : '\\u' + code.toString(16).padStart(4, '0');
        })
        .join('');
}

export function stripHTMLRegex(html) {
    return (typeof html === 'string' && html.replace(/<[^>]*>/g, '')) || html;
}

export function getValFromStrPath(obj, path) {
    try {
        return path.split('.').reduce((acc, key) => acc?.[key], obj);
    } catch (e) {
        return path;
    }
}

export const GAME = {
    VQMM: 1,
    DUA_VIT: 2,
    CSMM: 3,
    DAO_VANG: 4,
    LUCKY_BOX: 5,
};

export const CALENDAR_VI = {
    firstDayOfWeek: 1,
    showMonthAfterYear: true,
    dayNames: [
        'Chủ Nhật',
        'Thứ Hai',
        'Thứ Ba',
        'Thứ Tư',
        'Thứ Năm',
        'Thứ Sáu',
        'Thứ Bảy',
    ],
    dayNamesShort: ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'],
    dayNamesMin: ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'],
    monthNames: [
        'Tháng 1',
        'Tháng 2',
        'Tháng 3',
        'Tháng 4',
        'Tháng 5',
        'Tháng 6',
        'Tháng 7',
        'Tháng 8',
        'Tháng 9',
        'Tháng 10',
        'Tháng 11',
        'Tháng 12',
    ],
    monthNamesShort: [
        'Th1',
        'Th2',
        'Th3',
        'Th4',
        'Th5',
        'Th6',
        'Th7',
        'Th8',
        'Th9',
        'Th10',
        'Th11',
        'Th12',
    ],
    today: 'Hôm nay',
    clear: 'Xóa',
};

export function randomString(length = 6) {
    const chars =
        'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-';
    let result = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * chars.length);
        result += chars[randomIndex];
    }
    return result;
}

export function setDeepNumber(obj, path) {
    const parts = path.split('.');
    let current = obj;

    for (let i = 0; i < parts.length; i++) {
        let key = parts[i];

        // nếu là array field
        if (key.endsWith('[]')) {
            key = key.slice(0, -2);
            if (Array.isArray(current[key])) {
                current[key].forEach((item) => {
                    const subPath = parts.slice(i + 1).join('.');
                    if (subPath) setDeepNumber(item, subPath);
                });
            }
            return; // kết thúc branch
        }

        if (i === parts.length - 1) {
            // leaf
            if (current && current[key] != null && current[key] !== '') {
                current[key] = Number(current[key]);
            }
        } else {
            current = current ? current[key] : null;
            if (!current) return;
        }
    }
}

export function capitalizeFirst(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
}

export function generateUUID() {
    if (typeof crypto?.randomUUID === 'function') {
        return crypto.randomUUID();
    }

    return (
        Date.now().toString(16) +
        Math.floor(Math.random() * Number.MAX_SAFE_INTEGER).toString(16)
    );
}

export async function convertXlsxToCsvFile(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const worksheet = workbook.Sheets[workbook.SheetNames[0]];

                const csv = XLSX.utils.sheet_to_csv(worksheet);
                const utf8WithBom = '\uFEFF' + csv;

                const csvFile = new File([utf8WithBom], file.name.replace(/\.xlsx$/, '.csv'), {
                    type: 'text/csv;charset=utf-8',
                });

                resolve(csvFile);
            } catch (err) {
                reject(err);
            }
        };
        reader.onerror = reject;
        reader.readAsArrayBuffer(file);
    });
}
