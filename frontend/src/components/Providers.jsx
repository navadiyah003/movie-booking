"use client"

import { persistedStore, store } from "@/redux/store";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";


const Providers = ({ children }) => {
    return (
        <Provider store={store}>
            <PersistGate persistor={persistedStore}>
                {children}
            </PersistGate>
        </Provider>
    )
}

export default Providers;