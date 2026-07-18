# Data Model: Production Deployment Readiness

## ReadinessStatus

- `ready`: Verified in code/config and does not require further action.
- `needs-code-fix`: Requires repository changes before production.
- `needs-external-setup`: Requires Vercel, MongoDB, DNS, domain, storage, or hosting configuration outside the repo.
- `blocked`: Cannot be verified safely with current information or permissions.
- `deferred`: Valid follow-up, but not required for this package.
- `not-applicable`: Not relevant to the current deployment surface.

## EnvironmentVariableRequirement

Fields:
- `name`: Environment variable name.
- `surface`: `public-site`, `dashboard`, `api`, `hosting`, or `shared`.
- `environments`: Local/development/preview/production relevance.
- `classification`: `public` or `secret`.
- `required`: Whether production launch requires it.
- `validationRule`: Non-secret description of valid shape.
- `currentEvidence`: Static evidence path or report note.
- `status`: ReadinessStatus.
- `externalOwner`: Repo, Vercel, MongoDB, DNS, storage provider, or deployment owner.

Validation rules:
- Secret values must never be stored in the model.
- Production public variables may include URLs only if they are non-localhost approved origins.
- Missing production secrets are `needs-external-setup`, not `ready`.

## ProductionOrigin

Fields:
- `name`: Human-readable origin role.
- `url`: Redacted or expected URL, such as `https://fortuneconstruction.mw`.
- `surface`: Public site, dashboard, API, upload assets, or SEO.
- `allowedInCors`: Whether API CORS should allow it.
- `productionSafe`: Whether it avoids localhost/development hosts.
- `status`: ReadinessStatus.

Validation rules:
- Production origins must use HTTPS unless an external platform explicitly terminates TLS and documents the public HTTPS URL.
- Localhost origins are allowed only for local/development status.

## DeploymentTarget

Fields:
- `target`: Public site, dashboard, API, MongoDB, upload storage, or domain/DNS.
- `buildCommand`: Command required for build verification.
- `outputDirectory`: Expected deployable output, if applicable.
- `runtimeRequirements`: Node runtime, persistent filesystem, external database, or static hosting needs.
- `domainBinding`: Expected production domain or subdomain.
- `status`: ReadinessStatus.
- `notes`: Non-secret readiness notes.

## SecretReadinessCheck

Fields:
- `secretName`: Variable name only.
- `requiredInProduction`: Boolean.
- `acceptedState`: Description such as present, non-blank, non-placeholder, strong.
- `failureMode`: Expected non-sensitive error or blocked state.
- `evidence`: Test/static check reference.
- `status`: ReadinessStatus.

## DatabaseReadinessCheck

Fields:
- `variableName`: Usually `MONGODB_URI`.
- `productionRequired`: Boolean.
- `remotePolicy`: Allowed in production or with explicit safe flag.
- `localSafety`: Expected local/test/development behavior.
- `redactionEvidence`: Static/test reference.
- `status`: ReadinessStatus.

## UploadStorageStrategy

Fields:
- `category`: Image, video, or CV.
- `currentPath`: Non-secret local path pattern.
- `maxSizeBytes`: Current validation limit.
- `allowedExtensions`: Allowed extension list.
- `allowedMimeTypes`: Allowed MIME list.
- `publicUrlPattern`: Current URL path behavior.
- `persistenceStatus`: Durable, ephemeral, external required, or unknown.
- `status`: ReadinessStatus.

## VerificationRecord

Fields:
- `commandOrCheck`: Command or static check name.
- `surface`: Public, dashboard, API, docs, hosting, or cross-cutting.
- `result`: Passed, failed, blocked, or not-run.
- `date`: Execution date.
- `evidenceSummary`: Non-secret summary.
- `followUp`: Optional next action.

## ReadinessReport

Sections:
- Environment variable matrix.
- Production origin matrix.
- Deployment target matrix.
- Security readiness.
- MongoDB readiness.
- Upload storage readiness.
- Vercel/domain/DNS readiness.
- Verification log.
- Blocked external setup.
- Deferred follow-ups.
- Final launch status.
