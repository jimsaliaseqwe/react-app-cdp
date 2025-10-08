export const mediaDefault = {
    mediaType: 'image',
    duration: 10,
    link: '',
    mediaFile: null,
    eventLiveId: 1,
};

export const createScheduleDefault = () => ({
    medias: [{ ...mediaDefault }], // Luôn tạo một object mới
    startTime: '',
    startDate: new Date(),
});

export const generateLinkGame = ({
    eventId,
    eventLiveId,
    projectId,
    mode,
    deviceId,
}) => {
    return `${process.env.REACT_APP_GAME_PLAY_URL}/${mode ? mode : '{0}'}/?projectId=${projectId ? projectId : '{PROJECT_ID}'}&event=${eventId}&eventLiveId=${eventLiveId}&deviceId=${deviceId ? deviceId : '{1}'}&typeOutapp=1`;
};
export const computeLinkGame = (originLink, mode, deviceId) => {
    return originLink.replace('{0}', mode).replace('{1}', deviceId);
};
