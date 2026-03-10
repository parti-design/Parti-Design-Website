# Content Management

Projects, posts, and media can be managed via the Payload admin panel or programmatically via the API.

## Admin panel
`https://new.parti.design/admin` — use your Parti Design credentials to log in.

## Uploading images via script

The `scripts/upload-media.mjs` script resizes images to ≤2500px and uploads them to the media library, optionally attaching them to a project gallery.

**Requirements:** Node 20+ (configured via nvm in `~/.zshrc`)

```bash
node scripts/upload-media.mjs <image-folder> [options]
```

**Options:**

| Flag | Default | Description |
|------|---------|-------------|
| `--project-id <id>` | — | Attach uploaded images to this project's gallery |
| `--url <base>` | `https://new.parti.design` | API base URL |
| `--email <email>` | `kasimir@parti.design` | Admin email |
| `--password <pass>` | — | Admin password |
| `--max-px <px>` | `2500` | Max image dimension |
| `--quality <q>` | `88` | JPEG quality (1–100) |
| `--replace` | false | Replace gallery instead of appending |

**Example — upload Kotten Sauna photos and attach to gallery:**
```bash
node scripts/upload-media.mjs public/images/projects/kotten-sauna \
  --project-id 10 \
  --password <your-password>
```

Images placed in `public/images/projects/<project-slug>/` are not served directly — they are only used as a source for the upload script. Uploaded media lives on the Hetzner volume and is served from `/api/media/file/`.

## Payload REST API

All collections expose REST endpoints at `https://new.parti.design/api/<collection>`.

- `GET /api/projects` — list all projects
- `POST /api/projects` — create a project
- `PATCH /api/projects/<id>` — update a project
- `POST /api/media` — upload a media file (multipart/form-data)

Authenticate first via `POST /api/users/login` to get a JWT token, then pass it as `Authorization: JWT <token>`.

See `scripts/upload-media.mjs` for a working reference implementation.
