export const TimeBodyTemplate = ({ time, format = 'vi-VN' }) => (
    <span>{time ? new Date(time).toLocaleString(format) : 'N/A'}</span>
);