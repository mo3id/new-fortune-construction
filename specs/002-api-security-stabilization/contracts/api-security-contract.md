# API Security Contract: First Repair Package

## Compatibility Rule

Valid existing public website and dashboard requests must continue to use the current paths and success response shapes unless the request is invalid or unsafe.

## Health

### `GET /health`

**Purpose**: Local and operational readiness check.

**Origin Handling**: Allowed with no browser `Origin`; allowed from approved website/dashboard origins.

**Success Response**

```json
{
  "status": "ok",
  "timestamp": "2026-07-17T00:00:00.000Z",
  "services": {
    "api": "ok",
    "database": "ok"
  },
  "mode": "local"
}
```

**Degraded Response**

```json
{
  "status": "degraded",
  "timestamp": "2026-07-17T00:00:00.000Z",
  "services": {
    "api": "ok",
    "database": "unavailable"
  },
  "mode": "local"
}
```

**Response Rules**

- Must not expose DB URI, credentials, JWT secret, or full filesystem paths.
- Must be reachable for local verification even when browser CORS is restricted.

## Authentication

### `POST /api/auth/login`

**Current Valid Request Shape**

```json
{
  "username": "admin-user",
  "password": "submitted-password"
}
```

**Current Success Shape To Preserve**

```json
{
  "token": "jwt-token",
  "username": "admin-user"
}
```

**Validation/Error Rules**

- Missing username or password returns a client error with a non-sensitive message.
- Invalid credentials return an authentication error with the existing user-facing meaning.
- Missing, blank, or unsafe JWT signing configuration fails closed with a non-sensitive configuration error.
- Token signing and verification must never use a hardcoded fallback secret.

## CORS

**Allowed Browser Origins**

- Configured public website origin.
- Configured dashboard origin.
- Documented local development origins used by the public site and dashboard.

**Rejected Browser Origins**

- Any browser request with an `Origin` not in the allowlist.

**No-Origin Requests**

- May be allowed for local health checks and non-browser tools.
- Must not be treated as a wildcard browser approval.

## Uploads

### `POST /api/upload`

**Purpose**: Authenticated image upload.

**Field**: `image`

**Success Shape To Preserve**

```json
{
  "url": "/uploads/images/generated-file-name.ext",
  "type": "image"
}
```

**Validation Rules**

- Requires authentication.
- Accepts only approved image MIME/extension pairs.
- Enforces configured image size limit.
- Stores generated sanitized filenames.

### `POST /api/upload/video`

**Purpose**: Authenticated video upload.

**Field**: `video`

**Success Shape To Preserve**

```json
{
  "url": "/uploads/videos/generated-file-name.ext",
  "type": "video"
}
```

**Validation Rules**

- Requires authentication.
- Accepts only approved video MIME/extension pairs.
- Enforces configured video size limit.
- Stores generated sanitized filenames.

### `POST /api/applications/submit`

**Purpose**: Public job application with optional CV.

**Field**: `cvFile`

**Current Success Shape To Preserve**

```json
{
  "message": "Application submitted successfully",
  "id": "application-id"
}
```

**Validation Rules**

- Validates required application fields.
- Accepts only approved CV document MIME/extension pairs when a file is provided.
- Enforces configured CV size limit.
- Stores generated sanitized filenames.

## Route Validation

Representative routes in the first package should return a consistent validation error shape:

```json
{
  "message": "Invalid request",
  "code": "VALIDATION_ERROR",
  "details": [
    {
      "field": "fieldName",
      "message": "Safe field-level issue"
    }
  ]
}
```

**Rules**

- Validation errors use client error status.
- Details are safe for clients and do not expose schema internals.
- Existing valid website/dashboard payloads remain accepted.

## Async Error Handling

Unexpected route failures should return:

```json
{
  "message": "Unexpected server error",
  "code": "INTERNAL_ERROR"
}
```

**Rules**

- Client response must not include stack trace, DB URI, credentials, token secret, or raw exception object.
- Server logs may include safe category and request context, but not secrets.
