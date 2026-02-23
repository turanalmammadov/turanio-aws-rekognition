# API Documentation

Complete API reference for Turanio AWS Rekognition service.

## Base URL

```
HTTP:  http://localhost:80
HTTPS: https://localhost:5555
```

## Authentication

Currently no authentication required. Implement API keys for production use.

## Endpoints

### POST /doFaceAnalysis

Analyze a single face in an uploaded image.

**Request Body:**
```json
{
  "image": "data:image/png;base64,iVBORw0KGgo..."
}
```

**Response (Success):**
```json
{
  "success": true,
  "data": {
    "FaceDetails": [{
      "BoundingBox": {
        "Width": 0.5,
        "Height": 0.7,
        "Left": 0.2,
        "Top": 0.1
      },
      "Confidence": 99.9,
      "Emotions": [
        { "Type": "HAPPY", "Confidence": 95.2 },
        { "Type": "CALM", "Confidence": 3.5 }
      ],
      "AgeRange": {
        "Low": 25,
        "High": 35
      },
      "Gender": {
        "Value": "Male",
        "Confidence": 98.5
      },
      "Smile": {
        "Value": true,
        "Confidence": 92.1
      }
    }]
  }
}
```

**Response (Error):**
```json
{
  "success": false,
  "error": "Error message",
  "code": "AWS_ERROR_CODE"
}
```

**Status Codes:**
- `200` - Success
- `400` - Bad request (invalid image format)
- `500` - AWS API error

---

### POST /doCompare

Compare two faces and return similarity score.

**Request Body:**
```json
{
  "leftImage": "data:image/png;base64,...",
  "rightImage": "data:image/png;base64,..."
}
```

**Response (Success):**
```json
{
  "success": true,
  "data": {
    "FaceMatches": [{
      "Similarity": 95.5,
      "Face": {
        "BoundingBox": { ... },
        "Confidence": 99.8
      }
    }],
    "UnmatchedFaces": [],
    "SourceImageFace": {
      "BoundingBox": { ... },
      "Confidence": 99.9
    }
  }
}
```

**Response (Error):**
```json
{
  "success": false,
  "error": "Error message",
  "code": "AWS_ERROR_CODE"
}
```

**Status Codes:**
- `200` - Success
- `400` - Bad request (missing or invalid images)
- `500` - AWS API error

---

### POST /savePics

Save uploaded images to server (development/testing only).

**Request Body:**
```json
{
  "leftImage": "data:image/png;base64,...",
  "rightImage": "data:image/png;base64,..."
}
```

**Response:**
```
OK
```

**Status Code:** `201`

**Note:** Saves as `leftImage.png` and `rightImage.png` in project root.

---

## Rate Limits

| Endpoint | Limit |
|----------|-------|
| /doFaceAnalysis | 100 requests / 15 min per IP |
| /doCompare | 50 requests / 15 min per IP |
| General | 200 requests / min per IP |

**Rate Limit Response:**
```json
{
  "success": false,
  "error": "Rate limit exceeded",
  "retryAfter": 1709001234
}
```

**Status Code:** `429 Too Many Requests`

---

## Error Codes

| Code | Description |
|------|-------------|
| `InvalidImageFormatException` | Image format not supported |
| `InvalidParameterException` | Invalid request parameters |
| `ImageTooLargeException` | Image exceeds size limit (5MB) |
| `ProvisionedThroughputExceededException` | AWS rate limit |
| `ThrottlingException` | AWS throttling |
| `AccessDeniedException` | AWS credentials issue |

---

## AWS Rekognition Features

### Detected Face Attributes

- **Age Range**: Estimated age (e.g., 25-35)
- **Gender**: Male/Female with confidence
- **Emotions**: Happy, Sad, Angry, Confused, Calm, etc.
- **Facial Features**: Eyeglasses, Sunglasses, Beard, Mustache
- **Face Quality**: Brightness, Sharpness
- **Pose**: Pitch, Roll, Yaw angles
- **Landmarks**: Eye positions, Nose, Mouth, etc.

### Comparison Metrics

- **Similarity Score**: 0-100%
- **Face Matching**: Bounding boxes
- **Confidence Levels**: Per detection

---

## Usage Examples

### cURL

**Face Analysis:**
```bash
curl -X POST http://localhost/doFaceAnalysis \
  -H "Content-Type: application/json" \
  -d '{"image":"data:image/png;base64,iVBORw0KGgo..."}'
```

**Face Comparison:**
```bash
curl -X POST http://localhost/doCompare \
  -H "Content-Type: application/json" \
  -d '{
    "leftImage": "data:image/png;base64,...",
    "rightImage": "data:image/png;base64,..."
  }'
```

### JavaScript (Fetch API)

```javascript
// Face Analysis
const response = await fetch('http://localhost/doFaceAnalysis', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ image: base64Image })
})
const result = await response.json()

// Face Comparison
const response = await fetch('http://localhost/doCompare', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        leftImage: base64Image1,
        rightImage: base64Image2
    })
})
const result = await response.json()
```

---

## Image Requirements

**Format:**
- PNG, JPEG, BMP
- Base64 encoded
- Data URL format: `data:image/{type};base64,{data}`

**Size:**
- Maximum: 5MB (AWS limit)
- Minimum: 80x80 pixels
- Recommended: 640x480 or higher

**Quality:**
- Good lighting
- Clear, unobstructed faces
- Frontal face preferred
- Minimal blur

---

## Best Practices

1. **Image Optimization**
   - Compress images before upload
   - Use JPEG for photos (smaller size)
   - Maintain aspect ratio

2. **Error Handling**
   - Always check `success` field
   - Handle rate limit errors gracefully
   - Implement retry logic with backoff

3. **Security**
   - Use HTTPS in production
   - Implement authentication
   - Rate limit client-side too
   - Validate uploads before sending

4. **Performance**
   - Cache results when possible
   - Batch process multiple images
   - Use appropriate image sizes

---

## Development

**Environment Variables:**
```bash
PORT=3000           # HTTP port
LOG_LEVEL=INFO      # debug, info, warn, error
LOG_DIR=./logs      # Log file directory
AWS_REGION=us-east-2
```

**Testing:**
```bash
npm test
```

---

## Support

For issues and questions:
- GitHub Issues: https://github.com/turanalmammadov/turanio-aws-rekognition/issues
- AWS Rekognition Docs: https://docs.aws.amazon.com/rekognition/

---

**Version:** 1.0.0  
**Last Updated:** February 2026
