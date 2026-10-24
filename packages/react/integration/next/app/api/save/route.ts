let attempt = 0;

export async function POST(request: Request) {
  const body = await request.json().catch(() => null) as {
    name?: unknown;
    team?: unknown;
    summary?: unknown;
  } | null;

  if (
    !body
    || typeof body.name !== 'string'
    || !body.name.trim()
    || !['design', 'engineering', 'operations'].includes(String(body.team))
    || typeof body.summary !== 'boolean'
  ) {
    return Response.json({ message: 'Invalid local workspace settings.' }, { status: 400 });
  }

  attempt += 1;
  const currentAttempt = attempt;
  await new Promise((resolve) => setTimeout(resolve, 450));

  if (currentAttempt === 1) {
    return Response.json(
      { attempt: currentAttempt, message: 'Attempt 1 failed in the local route.' },
      { status: 503 },
    );
  }
  return Response.json({ attempt: currentAttempt, saved: body });
}
