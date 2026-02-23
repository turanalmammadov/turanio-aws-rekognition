/**
 * Unit Tests for Image Validation Middleware
 */

const { validateImageData, MAX_IMAGE_SIZE_MB } = require('../middleware/validation')

describe('Image Validation', () => {
    
    describe('validateImageData()', () => {
        
        test('should accept valid base64 image', () => {
            const validImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='
            const result = validateImageData(validImage)
            expect(result.valid).toBe(true)
            expect(result.buffer).toBeDefined()
        })
        
        test('should reject non-string image data', () => {
            const result = validateImageData(12345)
            expect(result.valid).toBe(false)
            expect(result.error).toContain('string')
        })
        
        test('should reject image without base64 marker', () => {
            const result = validateImageData('invalid image data')
            expect(result.valid).toBe(false)
            expect(result.error).toContain('base64')
        })
        
        test('should reject empty base64 data', () => {
            const result = validateImageData('data:image/png;base64,')
            expect(result.valid).toBe(false)
            expect(result.error).toContain('No image data')
        })
        
        test('should handle decode errors gracefully', () => {
            const result = validateImageData('data:image/png;base64,invalid!!!base64')
            expect(result.valid).toBe(false)
        })
    })
})
