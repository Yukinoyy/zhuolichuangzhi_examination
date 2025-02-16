import { configureStore, createSlice } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage'; // 默认是 localStorage
import { persistStore, persistReducer } from 'redux-persist';

// 持久化配置
const persistLoginConfig = {
  key: 'login', // 设置为 "root"，表示该配置适用于整个 store
  storage, // 使用 localStorage 存储
};

// 持久化配置
const persistregisterConfig = {
  key: 'register', // 设置为 "root"，表示该配置适用于整个 store
  storage, // 使用 localStorage 存储
};
// 持久化配置
const persistForgotPasswordConfig = {
  key: 'forgotPassword', // 设置为 "root"，表示该配置适用于整个 store
  storage, // 使用 localStorage 存储
};

// 登录数据 slice
const loginSlice = createSlice({
  name: 'login',
  initialState: { username: '', password: '' },
  reducers: {
    setLoginData: (state, action) => {
      state.username = action.payload.username;
      state.password = action.payload.password;
    },
  },
});

// 注册数据 slice
const registerSlice = createSlice({
  name: 'register',
  initialState: { username: '', captcha: '', phone: '', password: '' },
  reducers: {
    setRegisterData: (state, action) => {
      state.username = action.payload.username;
      state.captcha = action.payload.captcha;
      state.phone = action.payload.phone;
      state.password = action.payload.password;
    },
  },
});

// 忘记密码数据 slice
const forgotPasswordSlice = createSlice({
  name: 'forgotPassword',
  initialState: { phone: '', captcha: '', password: '' },
  reducers: {
    setForgotPasswordData: (state, action) => {
      state.phone = action.payload.phone;
      state.captcha = action.payload.captcha;
      state.password = action.payload.password;
    },
  },
});

// 创建持久化的 reducer
const loginPersistedReducer = persistReducer(persistLoginConfig, loginSlice.reducer);
const registerPersistedReducer = persistReducer(persistregisterConfig, registerSlice.reducer);
const forgotPasswordPersistedReducer = persistReducer(persistForgotPasswordConfig, forgotPasswordSlice.reducer);

// 创建 Redux store，包含所有 slice
const store = configureStore({
  reducer: {
    login: loginPersistedReducer,
    register: registerPersistedReducer,
    forgotPassword: forgotPasswordPersistedReducer,
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware({
    //关闭redux序列化检测
    serializableCheck: false
  })
});

// 创建持久化的 store
const persistor = persistStore(store);

export const { setLoginData } = loginSlice.actions;
export const { setRegisterData } = registerSlice.actions;
export const { setForgotPasswordData } = forgotPasswordSlice.actions;

export { store, persistor };