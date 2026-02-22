/**
 * Request Validation Middleware
 * Validates image data format and size constraints
 */

'use strict'

const MAX_IMAGE_SIZE_MB = 10
const MAX_IMAGE_SIZE_BYTES = MAX_IMAGE_SIZE_MB * 1024 * 1024

/**
 * Validate base64 image data
 * @param {string} imageData - Base64 encoded image string
 * @returns {{valid: boolean, error?: string, buffer?: Buffer}}
 */
function validateImageData(imageData) {
    if (!imageData || typeof imageData !== 'string') {
        return {
            valid: false,
            error: 'Image data must be a non-empty string'
        }
    }

    // Check for base64 marker
    if (!imageData.includes('base64,')) {
        return {
            valid: false,
            error: 'Invalid image format. Expected base64-encoded data URL.'
        }
    }

    // Extract base64 content
    const base64Text = imageData.split('base64,')[1]
    
    if (!base64Text || base64Text.trim().length === 0) {
        return {
            valid: false,
            error: 'No image data found after base64 marker'
        }
    }

    // Decode base64
    let buffer
    try {
        buffer = Buffer.from(base64Text, 'base64')
    } catch (err) {
        return {
            valid: false,
            error: 'Failed to decode base64 data: ' + err.message
        }
    }

    // Validate buffer size
    if (buffer.length === 0) {
        return {
            valid: false,
            error: 'Decoded image buffer is empty'
        }
    }

    // Check maximum size (AWS Rekognition limit is 5MB for image bytes)
    if (buffer.length > MAX_IMAGE_SIZE_BYTES) {
        return {
            valid: false,
            error: `Image too large. Maximum size: ${MAX_IMAGE_SIZE_MB}MB, received: ${(buffer.length / 1024 / 1024).toFixed(2)}MB`
        }
    }

    return {
        valid: true,
        buffer
    }
}

/**
 * Middleware to validate single image request
 * Use with /doFaceAnalysis endpoint
 */
function validateSingleImage(req, res, next) {
    if (!req.body || req.body.length === 0) {
        return res.status(400).json({
            success: false,
            error: 'Request body is required'
        })
    }

    const postText = req.body.toString('utf-8')
    const validation = validateImageData(postText)

    if (!validation.valid) {
        return res.status(400).json({
            success: false,
            error: validation.error
        })
    }

    // Attach validated buffer to request for handler use
    req.imageBuffer = validation.buffer
    next()
}

/**
 * Middleware to validate dual image comparison request
 * Use with /doCompare endpoint
 */
function validateImageComparison(req, res, next) {
    if (!req.body) {
        return res.status(400).json({
            success: false,
            error: 'Request body is required'
        })
    }

    // Validate left image
    if (!req.body.leftImage) {
        return res.status(400).json({
            success: false,
            error: 'leftImage is required'
        })
    }

    const leftValidation = validateImageData(req.body.leftImage.toString('utf-8'))
    if (!leftValidation.valid) {
        return res.status(400).json({
            success: false,
            error: 'Left image: ' + leftValidation.error
        })
    }

    // Validate right image
    if (!req.body.rightImage) {
        return res.status(400).json({
            success: false,
            error: 'rightImage is required'
        })
    }

    const rightValidation = validateImageData(req.body.rightImage.toString('utf-8'))
    if (!rightValidation.valid) {
        return res.status(400).json({
            success: false,
            error: 'Right image: ' + rightValidation.error
        })
    }

    // Attach validated buffers to request
    req.leftImageBuffer = leftValidation.buffer
    req.rightImageBuffer = rightValidation.buffer
    next()
}

module.exports = {
    validateImageData,
    validateSingleImage,
    validateImageComparison,
    MAX_IMAGE_SIZE_MB,
    MAX_IMAGE_SIZE_BYTES
}
