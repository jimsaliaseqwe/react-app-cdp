import { createBrowserRouter } from 'react-router-dom';
import smodRoute from './smodRoute';
import adminRoute from './adminRoute';
import commonRoute from './commonRoute';
import { ROUTE_LINK, ROUTE_PATH } from './const';

const listRoute = [{ ...smodRoute }, { ...adminRoute }, ...commonRoute];

const routers = createBrowserRouter([...listRoute], {
    future: {
        v7_startTransition: true,
    },
});

export { routers, listRoute, ROUTE_PATH, ROUTE_LINK };
