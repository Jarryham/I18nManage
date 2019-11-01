import request from '@/utils/request';

export async function fakeChartData() {
  return request('/api/fake_chart');
}

export async function fakeBar() {
  return request('/api/fakeBar');
}

export async function fakePie() {
  return request('/api/fakePie');
}
