# Mock Data Lab 🧪

A lightweight, secure mock data API service hosted on Cloudflare Workers. This project provides realistic mock data for multiple projects, making it easy to develop and test applications without setting up complex backend infrastructure.

## Live API

The service is deployed at: https://mockdata.techieapps.workers.dev

## About

A centralized API that provides structured JSON mock data for development and testing. Data is organized by project namespaces, secured with Bearer token authentication, and served through Cloudflare Workers' global edge network.

**Common use cases:** Frontend development, API testing, prototyping, demos, and learning.

## Usage

### Authentication

All API requests require a Bearer token in the Authorization header:

```bash
curl -H "Authorization: Bearer YOUR_AUTH_TOKEN" \
  https://[YOUR-CLOUDFLARE-WORKER-URL]/projects/simple-library/data/books
```

### API Endpoints

#### Get Mock Data

```
GET /projects/:projectKey/data/:dataKey
```

**Parameters:**
- `projectKey` - The project namespace (e.g., `simple-library`)
- `dataKey` - The specific dataset to retrieve (e.g., `books`, `authors`)

**Example Request:**

```bash
curl -H "Authorization: Bearer YOUR_AUTH_TOKEN" \
  https://[YOUR-CLOUDFLARE-WORKER-URL]/projects/simple-library/data/books
```

**Example Response:**

```json
[
  {
    "id": 1,
    "title": "Sample Book",
    "author": "John Doe",
    ...
  }
]
```

### Available Datasets

#### Simple Library Project (`simple-library`)

- `/projects/simple-library/data/authors` - Author information
- `/projects/simple-library/data/books` - Book catalog
- `/projects/simple-library/data/publishers` - Publisher details
- `/projects/simple-library/data/tags` - Book tags/categories

### Error Responses

**401 Unauthorized** - Missing or invalid authentication token
```json
{
  "error": "Invalid or missing authentication"
}
```

**404 Not Found** - Project or dataset doesn't exist
```json
{
  "error": "Resource not found"
}
```

## Technical Details

### Architecture

- **Runtime**: Cloudflare Workers (V8 isolates)
- **Router**: `itty-router` v5 with AutoRouter
- **Language**: JavaScript (ES Modules)
- **Deployment**: Wrangler CLI


### How It Works

The service uses a **registry pattern** to organize mock data by project namespaces. Each project (like `simple-library`) contains multiple datasets (like `books`, `authors`). All endpoints are protected with Bearer token authentication, and data is served as JSON responses through a lightweight router.

### Local Development

#### Prerequisites

- Node.js (v18+)
- npm or yarn

#### Setup

1. **Clone the repository**

```bash
git clone https://github.com/techie014/mock-data-lab.git
// or
git clone git@github.com:techie014/mock-data-lab.git
```

2. **Install dependencies**

```bash
npm install
```

3. **Configure local environment**

Create a `.dev.vars` file in the project root:

```env
AUTH_TOKEN=your-local-dev-token
```

4. **Start the development server**

```bash
npm run dev
```

The service will be available at `http://localhost:8787`

5. **Test locally**

```bash
curl -H "Authorization: Bearer your-local-dev-token" \
  http://localhost:8787/projects/simple-library/data/books
```

### Deployment

The project uses GitHub Actions for automated deployment. Pushing a tag triggers the deployment workflow:

```bash
git tag v1.0.0
git push origin v1.0.0
```

This automatically deploys the worker to Cloudflare. Make sure `CLOUDFLARE_API_TOKEN` and `AUTH_TOKEN` are configured as repository secrets in GitHub.

### Adding New Mock Data

**New Project:** Create folder in `data/` → Add JSON files and `index.js` → Register in `data/index.js`

**New Dataset:** Add JSON file → Export in project's `index.js` → Access at `/projects/{project}/data/{dataset}`


### Dependencies

**Production:**
- `itty-router` (^5.0.22) - Lightweight router for Cloudflare Workers

**Development:**
- `wrangler` (^4.46.0) - Cloudflare Workers CLI
- `prettier` (^3.6.2) - Code formatter

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `AUTH_TOKEN` | Bearer token for API authentication | Yes |

**Local:** Set in `.dev.vars` file (auto-loaded by `wrangler dev`)

**Production:** Set using `wrangler secret put AUTH_TOKEN`

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Author

**techie**

## Contributing

Contributions, issues, and feature requests are welcome!

---

**Need help?** Open an issue or contact the maintainer.

