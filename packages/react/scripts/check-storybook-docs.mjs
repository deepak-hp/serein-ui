const baseUrl = process.env.STORYBOOK_URL ?? 'http://127.0.0.1:6006';
const pages = ['AgentAPI', 'Introduction', 'Accessibility', 'Catalogue', 'Contracts'];

async function get(path) {
  const response = await fetch(`${baseUrl}${path}`);
  const body = await response.text();
  if (!response.ok) throw new Error(`${path} returned ${response.status}`);
  return { body, contentType: response.headers.get('content-type') ?? '' };
}

for (const page of pages) {
  const module = await get(`/stories/${page}.mdx`);
  if (!module.contentType.includes('javascript')) throw new Error(`${page}.mdx was not served as a JavaScript module`);
  if (/['"]\/ai\/[^'"]+\?(?:import&)?raw['"]/.test(module.body)) {
    throw new Error(`${page}.mdx imports a static /ai file as a raw JavaScript module`);
  }
  const rawImports = [...module.body.matchAll(/from\s+['"]([^'"]+\?(?:import&)?raw)['"]/g)].map(match => match[1]);
  for (const rawImport of rawImports) {
    const dependency = await get(rawImport);
    if (!dependency.contentType.includes('javascript')) {
      throw new Error(`${page}.mdx raw dependency ${rawImport} was not served as a JavaScript module`);
    }
  }
}

for (const asset of ['/ai/llms-full.txt', '/ai/README.md']) {
  const response = await get(asset);
  if (!response.body.trim()) throw new Error(`${asset} is empty`);
}

console.log(`Storybook MDX modules and static AI documents are reachable at ${baseUrl}.`);
