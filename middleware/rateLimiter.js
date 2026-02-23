/**
 * Rate Limiting Middleware
 * Prevents abuse of AWS Rekognition API endpoints
 */

'use strict'

const rateLimit = require('express-rate-limit')

// Rate limiter for face analysis endpoint
const faceAnalysisLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: {
        success: false,
        error: 'Too many face analysis requests. Please try again later.',
        retryAfter: '15 minutes'
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
        res.status(429).json({
            success: false,
            error: 'Rate limit exceeded for face analysis',
            limit: 100,
            window: '15 minutes',
            retryAfter: Math.ceil(req.rateLimit.resetTime.getTime() / 1000)
        })
    }
})

// Rate limiter for face comparison endpoint  
const faceComparisonLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 50, // More strict as comparison is resource-intensive
    message: {
        success: false,
        error: 'Too many comparison requests. Please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false
})

// General API rate limiter
const generalLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 200,
    standardHeaders: true,
    legacyHeaders: false
})

module.exports = {
    faceAnalysisLimiter,
    faceComparisonLimiter,
    generalLimiter
}
