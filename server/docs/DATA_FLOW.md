# Data Flow (Post-Seed Removal)

All sample seeding & migration scripts have been removed. Runtime now controls data creation.

## Entities
- Users: Created via public registration endpoint. First admin must already exist or be promoted manually in DB.
- Cars: Created via Admin Panel (multipart form -> /api/cars).

## Images
- Uploaded car images go directly to Cloudinary (temporary disk files cleaned asynchronously).

## Admin Status Endpoint
- GET /api/users/admin/status/summary (auth: admin) returns counts: `{ userCount, carCount, adminCount }`.

## Manual Maintenance
- To purge data, drop MongoDB collections. No auto re-seeding occurs.
- `migration-upload-log.json` was removed; historical filename mapping no longer needed.

