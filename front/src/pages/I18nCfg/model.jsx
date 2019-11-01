import { getI18nList, submitI18nItem, getDbMsg } from './service';

const initState = {
  i18n: [],
  db: {},
};
const Model = {
  namespace: 'i18nContent',
  state: initState,
  effects: {
    *fetchList(_, { call, put }) {
      const response = yield call(getI18nList);

      yield put({
        type: 'save',
        payload: response,
      });
    },
    *fetchDb(_, { call, put }) {
      const response = yield call(getDbMsg);

      yield put({
        type: 'save',
        payload: { db: response.data },
      });
    },
    *saveI18n({ payload }, { call, put }) {
      const { resolve } = payload;
      const response = yield call(submitI18nItem, payload.data);
      !!resolve && resolve(response);
    },
  },
  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },

    clear() {
      return initState;
    },
  },
};
export default Model;
