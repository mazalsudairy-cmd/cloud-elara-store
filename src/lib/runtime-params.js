const isNode = typeof window === 'undefined';

function createMemoryStorage() {
  const m = new Map();
  return {
    getItem(key) {
      return m.has(key) ? m.get(key) : null;
    },
    setItem(key, val) {
      m.set(key, String(val));
    },
    removeItem(key) {
      m.delete(key);
    },
  };
}

const storage = isNode ? createMemoryStorage() : window.localStorage;

const toSnakeCase = (str) => str.replace(/([A-Z])/g, '_$1').toLowerCase();

function migrateLegacyKeys() {
  if (isNode) return;
  const legacyPairs = [
    ['base44_access_token', 'elara_access_token'],
    ['base44_app_id', 'elara_app_id'],
    ['base44_app_base_url', 'elara_app_base_url'],
    ['base44_functions_version', 'elara_functions_version'],
  ];
  for (const [oldKey, newKey] of legacyPairs) {
    const v = storage.getItem(oldKey);
    if (v && !storage.getItem(newKey)) {
      storage.setItem(newKey, v);
    }
  }
}

const getAppParamValue = (paramName, { defaultValue = undefined, removeFromUrl = false } = {}) => {
  if (isNode) {
    return defaultValue;
  }
  migrateLegacyKeys();
  const storageKey = `elara_${toSnakeCase(paramName)}`;
  const urlParams = new URLSearchParams(window.location.search);
  const searchParam = urlParams.get(paramName);
  if (removeFromUrl) {
    urlParams.delete(paramName);
    const newUrl = `${window.location.pathname}${urlParams.toString() ? `?${urlParams.toString()}` : ''}${window.location.hash}`;
    window.history.replaceState({}, document.title, newUrl);
  }
  if (searchParam) {
    storage.setItem(storageKey, searchParam);
    return searchParam;
  }
  if (defaultValue) {
    storage.setItem(storageKey, defaultValue);
    return defaultValue;
  }
  const storedValue = storage.getItem(storageKey);
  if (storedValue) {
    return storedValue;
  }
  return null;
};

const getAppParams = () => {
  if (getAppParamValue('clear_access_token') === 'true') {
    storage.removeItem('elara_access_token');
    storage.removeItem('token');
    storage.removeItem('base44_access_token');
  }
  return {
    appId:
      getAppParamValue('app_id', { defaultValue: import.meta.env.VITE_APP_ID || import.meta.env.VITE_BASE44_APP_ID }) ||
      'elara-local',
    token: getAppParamValue('access_token', { removeFromUrl: true }),
    fromUrl: getAppParamValue('from_url', { defaultValue: isNode ? '' : window.location.href }),
    functionsVersion:
      getAppParamValue('functions_version', {
        defaultValue: import.meta.env.VITE_FUNCTIONS_VERSION || import.meta.env.VITE_BASE44_FUNCTIONS_VERSION,
      }) || '',
    appBaseUrl:
      getAppParamValue('app_base_url', {
        defaultValue: import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_BASE44_APP_BASE_URL,
      }) || '',
  };
};

export const appParams = {
  ...getAppParams(),
};
