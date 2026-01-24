import { createStore, applyMiddleware, compose } from "redux";
import reducer from "./reducers/index";
import { persistStore, persistReducer } from "redux-persist";

import thunk from "redux-thunk";
import storage from "redux-persist/lib/storage";

const persistConfig = {
  key: "root",
  // blacklist: ["customerDetails", "branch", "getSingleArticleDetails"],
  whitelist: [""],
  storage,
};

const persistedReducer = persistReducer(persistConfig, reducer);

const composeEnhancers =
  typeof window === "object" && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    : compose;

const enhancer = composeEnhancers(applyMiddleware(thunk));
// const store = createStore(reducer, enhancer);
const store = createStore(persistedReducer, enhancer);
const persistor = persistStore(store);

// export default store;
export { store, persistor };
