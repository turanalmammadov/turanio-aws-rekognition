'use strict';

const MAX_BASE64_SIZE = 5 * 1024 * 1024; // 5MB in base64 chars

const SUPPORTED_FORMATS = ['jpeg', 'jpg', 'png'];

/**
 * Validates that a base64-encoded image is within size limits
 * @param {string} base64 - base64 encoded image string
 * @returns {{ valid: boolean, error?: string }}
 */
function validateImageSize(base64) {
  if (!base64 || typeof base64 !== 'string') {
    return { valid: false, error: 'Image data must be a non-empty string' };
  }

  // Strip data URI prefix if present (e.g. "data:image/jpeg;base64,...")
  const raw = base64.replace(/^data:image\/\w+;base64,/, '');

  if (raw.length > MAX_BASE64_SIZE) {
    return {
      valid: false,
      error: `Image exceeds maximum allowed size of ${MAX_BASE64_SIZE / (1024 * 1024)}MB`,
    };
  }

  return { valid: true };
}

/**
 * Detects image format from base64 header bytes
 * @param {string} base64 - base64 encoded image string
 * @returns {string|null} detected format or null
 */
function detectImageFormat(base64) {
  if (!base64 || typeof base64 !== 'string') return null;

  const raw = base64.replace(/^data:image\/\w+;base64,/, '');

  // Decode first 4 bytes
  let bytes;
  try {
    bytes = Buffer.from(raw.slice(0, 8), 'base64');
  } catch (_) {
    return null;
  }

  // JPEG: starts with FF D8 FF
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
    return 'jpeg';
  }

  // PNG: starts with 89 50 4E 47 0D 0A 1A 0A
  if (
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47
  ) {
    return 'png';
  }

  return null;
}

/**
 * Full validation: size + format check
 * @param {string} base64 - base64 encoded image string
 * @returns {{ valid: boolean, format?: string, error?: string }}
 */
function validateImage(base64) {
  const sizeCheck = validateImageSize(base64);
  if (!sizeCheck.valid) return sizeCheck;

  const format = detectImageFormat(base64);
  if (!format) {
    return {
      valid: false,
      error: `Unsupported image format. Supported formats: ${SUPPORTED_FORMATS.join(', ')}`,
    };
  }

  return { valid: true, format };
}

module.exports = { validateImage, validateImageSize, detectImageFormat, SUPPORTED_FORMATS };
