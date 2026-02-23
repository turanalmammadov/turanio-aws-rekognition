/**
 * Input Sanitization Utilities
 * Sanitize and validate user inputs
 */

'use strict'

/**
 * Sanitize base64 string
 */
function sanitizeBase64(input) {
    if (typeof input !== 'string') return ''
    return input.trim().replace(/[^A-Za-z0-9+/=]/g, '')
}

/**
 * Validate image format
 */
function isValidImageFormat(input) {
    const validFormats = ['image/png', 'image/jpeg', 'image/jpg', 'image/bmp']
    return validFormats.some(format => input.includes(format))
}

/**
 * Strip HTML tags
 */
function stripHtmlTags(input) {
    if (typeof input !== 'string') return ''
    return input.replace(/<[^>]*>/g, '')
}

/**
 * Validate and sanitize request body
 */
function sanitizeRequestBody(body) {
    if (!body) return null
    
    const sanitized = {}
    
    for (const [key, value] of Object.entries(body)) {
        if (typeof value === 'string') {
            sanitized[key] = stripHtmlTags(value.trim())
        } else {
            sanitized[key] = value
        }
    }
    
    return sanitized
}

module.exports = {
    sanitizeBase64,
    isValidImageFormat,
    stripHtmlTags,
    sanitizeRequestBody
}
