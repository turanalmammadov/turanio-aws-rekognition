# Security Policy

## Supported Versions

We release security updates for the following versions:

| Version | Supported          |
| ------- | ------------------ |
| latest  | :white_check_mark: |

## Reporting a Vulnerability

We take security seriously. If you discover a security vulnerability in this project, please report it responsibly.

### How to Report

1. **Do not** open a public GitHub issue for security vulnerabilities.
2. Email the maintainers with details, or use GitHub Security Advisories if you have that option.
3. Include:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

### What to Expect

- We will acknowledge your report as soon as possible.
- We will work on a fix and keep you updated.
- We will credit you in the release notes (unless you prefer to stay anonymous).

### Best Practices for This Project

- **Credentials**: Never commit `assets/aws-config.json` or any file containing AWS keys. Use `.gitignore` and `assets/aws-config.example.json` as a template.
- **API keys**: If you add API key authentication, keep keys in environment variables or a secrets manager.
- **Input**: The project uses input validation and sanitization; avoid disabling these in production.
- **HTTPS**: Use HTTPS in production; the server supports both HTTP and HTTPS.

Thank you for helping keep this project and its users safe.
