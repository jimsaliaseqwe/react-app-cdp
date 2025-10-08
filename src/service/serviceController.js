export default async function (
    fetchHandler,
    setDataCallback,
    beforeHandler,
    finishHandler,
) {
    if (beforeHandler) {
        await beforeHandler();
    }

    await setDataCallback(await fetchHandler());

    if (finishHandler) {
        await finishHandler();
    }
}
