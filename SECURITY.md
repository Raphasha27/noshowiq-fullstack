# Security Policy

## Scope

noshowiq is maintained as a development repository. Treat any bundled credentials, fixtures, or mock services as non-production examples and replace them before deployment.

## Safe Usage

- Do not commit real secrets, production .env files, private keys, or customer data.
- Prefer environment variables and local secret stores for credentials.
- Review CORS, auth, and storage defaults before exposing the application to public traffic.

## Reporting

Report security concerns privately to the repository owner before opening a public issue. Include affected files, reproduction steps, and any required rotation guidance for exposed secrets.

## Maintenance

- Keep dependencies current with automated update tooling.
- Add deployment-specific security headers and secret scanning in CI before release.
- Re-run build and test checks after upgrading framework or infrastructure dependencies.

