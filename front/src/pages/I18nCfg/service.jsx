import request from '@/utils/request';

export async function getI18nList(params) {
  return request('api/getI18n', {
    method: 'GET',
  });
}

export async function submitI18nItem(params) {
  return request('i18nItemSave', {
    method: 'POST',
    data: params,
  });
}

export async function getDbMsg() {
  return request('api/i18ndb', {
    method: 'get',
  });
}
