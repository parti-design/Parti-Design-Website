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

## Importing project content from the `keystatic` branch

The `scripts/import-keystatic-projects.mjs` script reads project content from the local `keystatic` git branch and compares it to the live Payload `projects` collection through the production REST API.

It is intentionally conservative:

- default mode is a dry run
- existing live differences are reported as conflicts instead of being overwritten
- possible duplicates are reported for review
- apply mode only writes safe creates unless you provide explicit decisions for conflicts

**Requirements:** Node 20+, a local `keystatic` branch, and Payload admin credentials for `https://new.parti.design`

### Dry run

```bash
node scripts/import-keystatic-projects.mjs \
  --password <your-password> \
  --report ./tmp/import-report.json
```

Optional filters:

- `--slug <slug>` — only inspect one project (repeatable)
- `--branch <name>` — source branch, defaults to `keystatic`
- `--url <base>` — API base URL, defaults to `https://new.parti.design`
- `--email <email>` — admin email, defaults to `kasimir@parti.design`

The report groups each source project into one of these buckets:

- `match` — live already matches the `keystatic` source
- `create` — project does not exist live and can be created safely
- `conflict` — live project exists and differs from source
- `review` — no exact slug match, but a similar live title exists and should be reviewed manually

### Applying confirmed decisions

After reviewing the dry-run output, create a JSON file mapping source slugs to decisions:

```json
{
  "umea-together": "source",
  "waste-to-wonder-lab": {
    "action": "source",
    "liveSlug": "waste-to-wonder"
  },
  "klondyke-farms": "live"
}
```

Decision meanings:

- `"source"` — overwrite the matched live project with the `keystatic` source
- `"live"` — keep the current live project and skip importing that source project
- `"source"` with `"liveSlug"` — apply the source project onto a different existing live slug

Then run apply mode:

```bash
node scripts/import-keystatic-projects.mjs \
  --apply \
  --password <your-password> \
  --decisions ./tmp/import-decisions.json \
  --report ./tmp/import-apply-report.json
```

### Notes

- Media is uploaded first and then linked into `coverImage` / `gallery`
- The script imports English first, then patches Swedish localized fields
- Source content is read from git, so you do not need to switch away from `main`
- Rich text is converted from the simple project MDX format in `keystatic` into Lexical JSON for Payload
- Dry-run comparisons follow Payload locale fallback behavior, so missing Swedish fields are treated as English fallback instead of false conflicts

## Revalidating project pages manually

If project data is correct in Payload but `/work/<slug>` pages are still showing stale content or server errors, revalidate the frontend cache explicitly.

Endpoint:

- `POST /next/revalidate-projects`
- `GET /next/revalidate-projects`

Authentication:

- `Authorization: Bearer <CRON_SECRET>`

Examples:

```bash
curl -X POST https://new.parti.design/next/revalidate-projects \
  -H "Authorization: Bearer <CRON_SECRET>"
```

Revalidate only one or more project detail pages:

```bash
curl "https://new.parti.design/next/revalidate-projects?slug=waste-to-wonder-lab&slug=connect-tviste" \
  -H "Authorization: Bearer <CRON_SECRET>"
```

The endpoint always revalidates:

- `/work`
- `/en/work`
- `/sv/work`

And, for each requested project slug:

- `/work/<slug>`
- `/en/work/<slug>`
- `/sv/work/<slug>`
