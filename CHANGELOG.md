# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.2] - 2026-04-13

### Security
- 🔒 **CRITICAL**: Implement JWT Token Authentication (RFC 6750 Bearer Token)
- 🔒 Removed insecure custom headers (`x-user-id`, `x-user-role`)
- 🔒 Fixed authentication bypass vulnerability via header spoofing
- 🔒 Added server-side token verification with secret key
- 🔒 Implement token expiration (7 days default)
- 🔒 Enhanced authMiddleware to validate tokens from Authorization header

### Added
- JWT token generation on login and registration OTP verification
- `JWT_SECRET` and `JWT_EXPIRES_IN` environment variables
- SECURITY_FIXES.md documentation with attack scenarios and solutions
- Token persistence in Zustand authStore

### Changed
- Login response now includes JWT token: `{ token, user }`
- API client uses Bearer token in Authorization header
- authMiddleware validates JWT before allowing requests
- userController.login() creates and returns JWT token
- userController.verifyRegisterOtp() generates JWT on successful verification

### Fixed
- Authentication now uses cryptographically signed tokens instead of arbitrary headers
- User role and permissions cannot be forged by client-side header manipulation

## [1.0.1] - 2026-04-13

### Fixed
- Sửa lại logic login logout
- Update logic giỏ hàng

## [1.0.0] - 2026-04-12

### Added
- LICENSE file
- Improve profile flow, order actions, and logout UX

### Fixed
- Hot fix and auto bump

## [0.0.8] - 2026-04-11

### Fixed
- Hot fix and auto bump

### Changed
- Update danh giá

## [0.0.7] - 2026-04-10

### Added
- Add Blog menu to navbar

### Changed
- Update seed.js

## [0.0.6] - 2026-04-09

### Fixed
- Merge branch 'main' from GitHub

## [0.0.5] - 2026-04-08

### Added
- Anti XSS attack protection
- Enhanced security measures

### Fixed
- Hot fix and auto bump

## [0.0.4] - 2026-04-07

### Changed
- Merge branch 'phuong1'
- Update login logout logic - cart data persists after logout
- Add comments for better code documentation
- Filter order status logic

### Fixed
- Hot fix and auto bump

## [0.0.3] - 2026-04-06

### Added
- Update document

### Fixed
- Hot fix and auto bump

## [0.0.2] - 2026-04-05

### Initial Release
- First working version

## [0.0.1] - 2026-04-04

### Initial Commit
- Project initialization
- Basic project structure setup
