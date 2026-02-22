# Turanio AWS Rekognition

Face recognition and comparison using AWS Rekognition API

[![AWS Rekognition](https://img.shields.io/badge/AWS-Rekognition-orange?logo=amazon-aws)](https://aws.amazon.com/rekognition/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green?logo=node.js)](https://nodejs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/turanalmammadov/turanio-aws-rekognition/pulls)

## 🎯 Features

- **Face Detection**: Detect faces in images with detailed analysis
- **Face Comparison**: Compare two faces and get similarity scores
- **AWS Integration**: Powered by AWS Rekognition API
- **Real-time Analysis**: Fast face recognition results
- **HTTPS Support**: Secure communication with SSL/TLS
- **Image Upload**: Direct image upload and analysis

## 📸 Demo

[![AWSREKONGNITIONTURANIO](https://i.ibb.co/XYsxbDp/turanio.png)](https://aws.amazon.com/rekognition/)

## 🚀 Quick Start

### Prerequisites

- Node.js 14+ installed
- AWS Account with Rekognition enabled
- AWS credentials (Access Key ID and Secret Access Key)

### Installation

```bash
# Clone the repository
git clone https://github.com/turanalmammadov/turanio-aws-rekognition.git

# Navigate to project directory
cd turanio-aws-rekognition

# Install dependencies
npm install
```

### Configuration

1. **AWS Credentials Setup**

Create `assets/aws-config.json` with your AWS credentials:

```json
{
  "accessKeyId": "YOUR_AWS_ACCESS_KEY_ID",
  "secretAccessKey": "YOUR_AWS_SECRET_ACCESS_KEY",
  "region": "us-east-2"
}
```

⚠️ **Security Warning**: Never commit real AWS credentials to version control!

2. **SSL Certificates (Optional)**

For HTTPS support, place your SSL certificates in `assets/`:
- `assets/key.pem` - Private key
- `assets/certificate.pem` - SSL certificate

For development, you can generate self-signed certificates:

```bash
openssl req -x509 -newkey rsa:4096 -keyout assets/key.pem -out assets/certificate.pem -days 365 -nodes
```

### Running the Application

```bash
# Start the server
npm start

# Server will run on:
# HTTP:  http://localhost:80
# HTTPS: https://localhost:5555
```

## 📡 API Endpoints

### POST `/doFaceAnalysis`

Analyze a single face in an image.

**Request:**
```json
{
  "image": "data:image/png;base64,iVBORw0KGgoAAAANS..."
}
```

**Response:**
```json
{
  "FaceDetails": [{
    "BoundingBox": { ... },
    "Confidence": 99.9,
    "Emotions": [...],
    "AgeRange": { ... },
    "Gender": { ... }
  }]
}
```

### POST `/doCompare`

Compare two faces and get similarity score.

**Request:**
```json
{
  "leftImage": "data:image/png;base64,...",
  "rightImage": "data:image/png;base64,..."
}
```

**Response:**
```json
{
  "FaceMatches": [{
    "Similarity": 95.5,
    "Face": { ... }
  }],
  "UnmatchedFaces": []
}
```

### POST `/savePics`

Save uploaded images to server (for testing).

**Request:**
```json
{
  "leftImage": "data:image/png;base64,...",
  "rightImage": "data:image/png;base64,..."
}
```

## 🏗️ Architecture

```
┌─────────────┐      HTTPS      ┌──────────────┐      AWS SDK      ┌─────────────────┐
│   Client    │ ───────────────> │ Express API  │ ────────────────> │ AWS Rekognition │
│  (Browser)  │                  │   (Node.js)  │                   │      API        │
└─────────────┘ <─────────────── └──────────────┘ <──────────────── └─────────────────┘
                  JSON Response        Process                Result
```

## 🛠️ Technologies

- **Backend**: Node.js, Express.js
- **Cloud**: AWS Rekognition
- **Security**: HTTPS with SSL/TLS
- **Image Processing**: Base64 encoding/decoding
- **CORS**: Cross-origin resource sharing enabled

## 🔒 Security Considerations

- ⚠️ **Never commit AWS credentials** to version control
- ✅ Use environment variables or AWS IAM roles in production
- ✅ Implement rate limiting for production use
- ✅ Add authentication/authorization middleware
- ✅ Validate and sanitize all inputs
- ✅ Use HTTPS in production

## 📝 Development

### Project Structure

```
turanio-aws-rekognition/
├── assets/
│   ├── aws-config.json      # AWS credentials (gitignored)
│   ├── key.pem              # SSL private key
│   └── certificate.pem      # SSL certificate
├── index.html               # Frontend interface
├── server.js                # Express server + AWS integration
├── package.json             # Dependencies
└── README.md                # This file
```

### Environment Variables

You can use environment variables instead of config file:

```bash
export AWS_ACCESS_KEY_ID="your-access-key"
export AWS_SECRET_ACCESS_KEY="your-secret-key"
export AWS_REGION="us-east-2"
export PORT=3000
```

## 🧪 Testing

```bash
# Start the server
npm start

# Open browser
open http://localhost:80

# Or test API directly
curl -X POST http://localhost:80/doFaceAnalysis \
  -H "Content-Type: application/json" \
  -d '{"image":"data:image/png;base64,..."}'
```

## 📚 AWS Rekognition Features Used

- **DetectFaces**: Detect faces and analyze attributes
  - Age range estimation
  - Gender detection
  - Emotion analysis
  - Face landmarks
  - Quality assessment

- **CompareFaces**: Compare facial features between images
  - Similarity scoring (0-100%)
  - Bounding box coordinates
  - Confidence levels

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- [AWS Rekognition Documentation](https://docs.aws.amazon.com/rekognition/)
- [AWS SDK for JavaScript](https://aws.amazon.com/sdk-for-javascript/)
- [Project Repository](https://github.com/turanalmammadov/turanio-aws-rekognition)

## ⚡ Performance

- Face detection: ~1-2 seconds per image
- Face comparison: ~1-2 seconds per pair
- Depends on image size and AWS region latency

## 🆘 Troubleshooting

### Common Issues

**Error: "Missing credentials"**
- Ensure `assets/aws-config.json` exists and has valid credentials
- Or set AWS environment variables

**Error: "AccessDenied"**
- Check AWS IAM permissions for Rekognition
- Required permissions: `rekognition:DetectFaces`, `rekognition:CompareFaces`

**Error: "Region not configured"**
- Verify region in aws-config.json
- Ensure region supports Rekognition

**HTTPS not working**
- Generate SSL certificates (see Configuration section)
- Check if port 5555 is available

## 🌟 Author

**Turan Almammadov**
- GitHub: [@turanalmammadov](https://github.com/turanalmammadov)
- Website: [turanalmammadov.com](https://turanalmammadov.com/)

---

⭐ If you find this project helpful, please give it a star!
