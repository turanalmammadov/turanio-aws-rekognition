/**
 * Logging Utility
 * Structured logging for AWS Rekognition API
 */

'use strict'

const fs = require('fs')
const path = require('path')

// Log levels
const LOG_LEVELS = {
    ERROR: 0,
    WARN: 1,
    INFO: 2,
    DEBUG: 3
}

// Current log level from environment
const CURRENT_LEVEL = LOG_LEVELS[process.env.LOG_LEVEL || 'INFO']

// Log directory
const LOG_DIR = process.env.LOG_DIR || path.join(__dirname, '../logs')

// Ensure log directory exists
function ensureLogDir() {
    if (!fs.existsSync(LOG_DIR)) {
        fs.mkdirSync(LOG_DIR, { recursive: true })
    }
}

/**
 * Format log message
 */
function formatMessage(level, message, metadata = {}) {
    const timestamp = new Date().toISOString()
    const logObject = {
        timestamp,
        level,
        message,
        ...metadata
    }
    return JSON.stringify(logObject)
}

/**
 * Write to log file
 */
function writeToFile(level, message, metadata) {
    try {
        ensureLogDir()
        const date = new Date().toISOString().split('T')[0]
        const logFile = path.join(LOG_DIR, `rekognition-${date}.log`)
        const logLine = formatMessage(level, message, metadata) + '\n'
        fs.appendFileSync(logFile, logLine)
    } catch (err) {
        console.error('Failed to write to log file:', err)
    }
}

/**
 * Log error message
 */
function error(message, metadata = {}) {
    if (CURRENT_LEVEL >= LOG_LEVELS.ERROR) {
        console.error(`[ERROR] ${message}`, metadata)
        writeToFile('ERROR', message, metadata)
    }
}

/**
 * Log warning message
 */
function warn(message, metadata = {}) {
    if (CURRENT_LEVEL >= LOG_LEVELS.WARN) {
        console.warn(`[WARN] ${message}`, metadata)
        writeToFile('WARN', message, metadata)
    }
}

/**
 * Log info message
 */
function info(message, metadata = {}) {
    if (CURRENT_LEVEL >= LOG_LEVELS.INFO) {
        console.log(`[INFO] ${message}`, metadata)
        writeToFile('INFO', message, metadata)
    }
}

/**
 * Log debug message
 */
function debug(message, metadata = {}) {
    if (CURRENT_LEVEL >= LOG_LEVELS.DEBUG) {
        console.log(`[DEBUG] ${message}`, metadata)
        writeToFile('DEBUG', message, metadata)
    }
}

/**
 * Log AWS API call
 */
function logAWSCall(operation, params = {}) {
    info(`AWS Rekognition API call: ${operation}`, {
        operation,
        timestamp: new Date().toISOString()
    })
}

/**
 * Log request details
 */
function logRequest(req) {
    info('Incoming request', {
        method: req.method,
        path: req.path,
        ip: req.ip,
        userAgent: req.get('user-agent')
    })
}

module.exports = {
    error,
    warn,
    info,
    debug,
    logAWSCall,
    logRequest,
    LOG_LEVELS
}
