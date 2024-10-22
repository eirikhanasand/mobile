import { ReactNode } from 'react'
import { PersistGate } from "redux-persist/integration/react"
import { Provider } from "react-redux"
import store from "@redux/store"
import { persistStore } from 'redux-persist'

let persistor = persistStore(store)

export default function Wrapper({children}: {children?: ReactNode}) {
    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                {children}
            </PersistGate>
        </Provider>
    )
}