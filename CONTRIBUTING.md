# Contributing to Turanio AWS Rekognition

Thank you for your interest in contributing! This document provides guidelines for contributing to the project.

## Code of Conduct

Be respectful, inclusive, and professional in all interactions.

## How to Contribute

### Reporting Bugs

1. Check if the bug already exists in Issues
2. Provide clear reproduction steps
3. Include error messages and logs
4. Specify your environment (Node.js version, OS, AWS region)

### Suggesting Features

1. Open an issue with [Feature Request] prefix
2. Describe the use case
3. Explain expected behavior
4. Consider implementation complexity

### Pull Requests

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Add tests if applicable
5. Update documentation
6. Commit with clear messages
7. Push to your fork
8. Open a Pull Request

## Development Setup

```bash
git clone https://github.com/turanalmammadov/turanio-aws-rekognition.git
cd turanio-aws-rekognition
npm install
cp assets/aws-config.example.json assets/aws-config.json
# Add your AWS credentials
npm start
```

## Code Style

- Use consistent indentation (4 spaces)
- Follow existing code patterns
- Add comments for complex logic
- Use descriptive variable names

## Testing

```bash
npm test
```

Ensure all tests pass before submitting PR.

## Commit Messages

Format: `type: description`

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `test`: Tests
- `refactor`: Code refactoring
- `security`: Security improvements

Examples:
- `feat: add rate limiting middleware`
- `fix: correct typo in error handling`
- `docs: update API documentation`

## Pull Request Guidelines

- Keep changes focused and minimal
- Update relevant documentation
- Add tests for new features
- Ensure backward compatibility
- Reference related issues

## Security

Never commit:
- AWS credentials
- SSL private keys
- API keys
- Passwords

Use `.gitignore` and example config files.

## License

By contributing, you agree your contributions will be licensed under MIT License.

## Questions?

Open an issue or reach out to [@turanalmammadov](https://github.com/turanalmammadov)

Thank you for contributing! 🎉
