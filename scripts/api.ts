export class FetchInputError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "FetchInputError";
    this.status = status;
  }
}
export async function fetchInput(day: number, year: number) {
  const res = await fetch(`https://adventofcode.com/${year}/day/${day}/input`, {
    headers: { Cookie: `session=${process.env.SESSION}` },
  });
  if (!res.ok)
    throw new FetchInputError(
      `failed to fetch input: ${res.status} ${res.statusText}`,
      res.status,
    );
  return await res.text();
}
