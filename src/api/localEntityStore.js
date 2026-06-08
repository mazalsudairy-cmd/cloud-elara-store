import { getInitialDb, ELARA_CATALOG_VERSION } from '@/api/seedData';

const STORAGE_KEY = 'elara_local_db_v1';

const REQUIRED_COLLECTIONS = ['User', 'AuthConfig', 'PasswordResetToken', 'AuthSettings', 'EmailSettings'];

function ensureCollections(db) {
  let changed = false;
  for (const c of REQUIRED_COLLECTIONS) {
    if (!Array.isArray(db[c])) {
      db[c] = [];
      changed = true;
    }
  }
  return changed;
}

function safeRead() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function write(db) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
}

function ensureDb() {
  let db = safeRead();
  if (!db || typeof db !== 'object') {
    db = getInitialDb();
    write(db);
    db = safeRead();
  } else if (db._catalog_version !== ELARA_CATALOG_VERSION) {
    const seed = getInitialDb();
    db.Product = seed.Product;
    db.Category = seed.Category;
    db._catalog_version = ELARA_CATALOG_VERSION;
    write(db);
    db = safeRead();
  }
  if (ensureCollections(db)) write(db);
  return db;
}

function newId(prefix) {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return `${prefix || 'id'}_${crypto.randomUUID()}`;
  }
  return `${prefix || 'id'}_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

function matchesWhere(record, where) {
  if (!where || Object.keys(where).length === 0) return true;
  return Object.entries(where).every(([k, v]) => record[k] === v);
}

function parseSort(sortKey) {
  if (!sortKey) return { field: 'created_date', desc: true };
  const desc = String(sortKey).startsWith('-');
  const field = desc ? String(sortKey).slice(1) : String(sortKey);
  return { field: field || 'created_date', desc };
}

function sortRecords(records, sortKey) {
  const { field, desc } = parseSort(sortKey);
  return [...records].sort((a, b) => {
    const av = a[field];
    const bv = b[field];
    if (av == null && bv == null) return 0;
    if (av == null) return 1;
    if (bv == null) return -1;
    if (typeof av === 'number' && typeof bv === 'number') {
      return desc ? bv - av : av - bv;
    }
    const as = String(av);
    const bs = String(bv);
    if (as < bs) return desc ? 1 : -1;
    if (as > bs) return desc ? -1 : 1;
    return 0;
  });
}

function sliceLimit(list, limit) {
  if (limit == null || limit === '' || Number.isNaN(Number(limit))) return list;
  const n = Number(limit);
  if (!Number.isFinite(n) || n <= 0) return list;
  return list.slice(0, n);
}

export function resetLocalDb() {
  localStorage.removeItem(STORAGE_KEY);
}

export function createEntityApi(collection) {
  return {
    async list(sortKey, limit) {
      const db = ensureDb();
      const rows = db[collection] || [];
      return sliceLimit(sortRecords(rows, sortKey), limit);
    },

    async filter(where, sortKey, limit) {
      const db = ensureDb();
      const rows = (db[collection] || []).filter((r) => matchesWhere(r, where));
      return sliceLimit(sortRecords(rows, sortKey), limit);
    },

    async create(data) {
      const db = ensureDb();
      if (!db[collection]) db[collection] = [];
      const ts = new Date().toISOString();
      const row = {
        ...data,
        id: data.id || newId(collection),
        created_date: data.created_date || ts,
        updated_date: ts,
      };
      db[collection].push(row);
      write(db);
      return row;
    },

    async update(id, data) {
      const db = ensureDb();
      const rows = db[collection] || [];
      const idx = rows.findIndex((r) => r.id === id);
      if (idx === -1) throw new Error(`${collection} not found: ${id}`);
      const ts = new Date().toISOString();
      const next = { ...rows[idx], ...data, id, updated_date: ts };
      rows[idx] = next;
      write(db);
      return next;
    },

    async delete(id) {
      const db = ensureDb();
      const rows = db[collection] || [];
      const nextRows = rows.filter((r) => r.id !== id);
      if (nextRows.length === rows.length) {
        throw new Error(`${collection} not found: ${id}`);
      }
      db[collection] = nextRows;
      write(db);
      return { ok: true };
    },
  };
}
