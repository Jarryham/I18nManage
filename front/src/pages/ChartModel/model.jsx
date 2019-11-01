import { fakeChartData, fakeBar, fakePie } from './service';
const initState = {
  lineData: [],
  barData: [],
  pieData: []
}
const Model = {
  namespace: 'ChartModelFake',
  state: initState,
  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(fakeChartData);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *fetchBar(_, { call, put }) {
      const barRes = yield call(fakeBar);
      yield put({
        type: 'save',
        payload: barRes
      });
    },
    *fetchPie(_, { call, put }) {
      const Res = yield call(fakePie);
      yield put({
        type: 'save',
        payload: Res
      });
    }
  },
  reducers: {
    save(state, { payload }) {
      // console.log(122)
      return { ...state, ...payload };
    },

    clear() {
      return initState;
    }
  }
}

export default Model