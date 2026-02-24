# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-02-24

### Added

- Face detection and comparison using AWS Rekognition API
- HTTPS support with SSL/TLS
- Image upload and base64 analysis endpoints
- Input validation and sanitization middleware
- Rate limiting for API protection
- Health check endpoint (`/health`)
- Metrics endpoint for monitoring
- Multi-stage Dockerfile and docker-compose for containerized deployment
- Comprehensive README with quick start, API docs, and troubleshooting
- CONTRIBUTING.md for contributors
- API.md documentation
- SECURITY.md for responsible disclosure

### Security

- Input sanitization to prevent injection attacks
- Payload size limits for DoS prevention
- `.gitignore` for credentials and sensitive files
- Example config template (`assets/aws-config.example.json`)
