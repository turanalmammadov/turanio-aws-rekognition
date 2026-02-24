'use strict';

/**
 * Lightweight in-memory LRU-style TTL cache for AWS Rekognition results.
 * Prevents duplicate API calls for the same image within the TTL window.
 *
 * Usage:
 *   const cache = require('./utils/cache');
 *   cache.set('key', data, 60000); // TTL 60 seconds
 *   cache.get('key');              // returns data or null
 */

const DEFAULT_TTL_MS = 60 * 1000; // 1 minute
const MAX_ENTRIES = 200;

class TTLCache {
  constructor({ ttl = DEFAULT_TTL_MS, maxEntries = MAX_ENTRIES } = {}) {
    this._ttl = ttl;
    this._maxEntries = maxEntries;
    this._store = new Map();
  }

  set(key, value, ttl = this._ttl) {
    // Evict oldest entry when at capacity
    if (this._store.size >= this._maxEntries && !this._store.has(key)) {
      const firstKey = this._store.keys().next().value;
      this._store.delete(firstKey);
    }

    this._store.set(key, {
      value,
      expiresAt: Date.now() + ttl,
    });
  }

  get(key) {
    const entry = this._store.get(key);
    if (!entry) return null;

    if (Date.now() > entry.expiresAt) {
      this._store.delete(key);
      return null;
    }

    return entry.value;
  }

  delete(key) {
    return this._store.delete(key);
  }

  clear() {
    this._store.clear();
  }

  get size() {
    return this._store.size;
  }
}

// Shared singleton instance for the app
const defaultCache = new TTLCache();

module.exports = defaultCache;
module.exports.TTLCache = TTLCache;
