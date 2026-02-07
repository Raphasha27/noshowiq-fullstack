# Security Policy

## Supported Versions

HealthBridge AI is currently in active development. Security updates are provided for the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x (Alpha)   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

We take the security of HealthBridge AI seriously. If you discover a security vulnerability, please follow these guidelines:

### Where to Report

Please report security vulnerabilities by emailing **[Your Email]** or by opening a **private security advisory** on GitHub.

**Please do NOT report security vulnerabilities through public GitHub issues.**

### What to Include

When reporting a vulnerability, please include:
- A description of the vulnerability
- Steps to reproduce the issue
- Potential impact assessment
- Suggested fix (if available)

### Response Timeline

- **Initial Response**: Within 48 hours of report submission
- **Status Updates**: Every 7 days until resolution
- **Resolution Timeline**: We aim to patch critical vulnerabilities within 30 days

### What to Expect

**If the vulnerability is accepted:**
- We will work on a fix and keep you updated on progress
- You will be credited in the security advisory (unless you prefer to remain anonymous)
- We will notify you before public disclosure

**If the vulnerability is declined:**
- We will provide a detailed explanation of why it doesn't qualify as a security issue
- We may suggest alternative reporting channels if appropriate

## Security Best Practices

When deploying HealthBridge AI:
- Always use HTTPS in production
- Keep dependencies up to date
- Use environment variables for sensitive configuration
- Enable authentication for the backend API
- Regularly backup healthcare data
- Follow POPIA (Protection of Personal Information Act) compliance for South African healthcare data

## Data Privacy

HealthBridge AI handles sensitive healthcare information. We are committed to:
- POPIA (SA) compliance
- Encrypted data transmission
- Secure data storage
- Access control and audit logging

---

**Thank you for helping keep HealthBridge AI and its users safe!**

## Resolved Vulnerabilities

| Advisory ID | Severity | Description | Status |
| --- | --- | --- | --- |
| **GHSA-pcg4-9c6x-qp9h** | Critical (9.1) | Authentication Bypass Due to Improper Token Validation | :white_check_mark: Patched |

> **CVSS v3.1**: `CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:N`
> **Weakness**: CWE-287 (Improper Authentication)
> **Fix Details**: Implemented JWT Authentication middleware in `Program.cs`, enforced `[Authorize]` on all API Controllers, and configured secure token validation with strong secrets in `appsettings.json`.
