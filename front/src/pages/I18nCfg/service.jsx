import request from '@/utils/request';

export async function getI18nList(params) {
  return request('data', {
    method: 'POST',
    data: { id: 5 },
  });
}

export async function submitI18nItem(params) {
  return request('i18nItemSave', {
    method: 'POST',
    data: params,
  });
}

export async function getDbMsg() {
  return request('i18ndb', {
    method: 'get',
  });
}
