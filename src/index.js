import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';

//import reportWebVitals from './reportWebVitals';
import { RouterProvider } from 'react-router-dom';
import { routers } from './router';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store } from './store';
import { persistStore } from 'redux-persist';
import { CALENDAR_VI } from './util/func';
import { addLocale } from 'primereact/api';

let persist = persistStore(store);

const root = ReactDOM.createRoot(document.getElementById('root'));

addLocale('vi', CALENDAR_VI);

root.render(
    <Provider store={store}>
        <PersistGate persistor={persist}>
            <Suspense
                fallback={
                    <div
                        style={{
                            height: '100vh',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        Loading...
                    </div>
                }
            >
                <RouterProvider
                    router={routers}
                    future={{
                        v7_startTransition: true,
                        v7_relativeSplatPath: true,
                    }}
                />
            </Suspense>
        </PersistGate>
    </Provider>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
//reportWebVitals();
