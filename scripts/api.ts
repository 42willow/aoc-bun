export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}
export async function fetchInput(day: number, year: number) {
  const res = await fetch(`https://adventofcode.com/${year}/day/${day}/input`, {
    headers: { Cookie: `session=${process.env.SESSION}` },
  });
  if (!res.ok)
    throw new ApiError(
      `failed to fetch input: ${res.status} ${res.statusText}`,
      res.status,
    );
  console.log("input fetched successfully!");
  return await res.text();
}

export async function submitAnswer(
  day: number,
  year: number,
  part: 1 | 2,
  answer: string,
) {
  // make post request to submit answer
  // https://adventofcode.com/2023/day/1/input
  const res = await fetch(
    `https://adventofcode.com/${year}/day/${day}/answer`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Cookie: `session=${process.env.SESSION}`,
      },
      body: new URLSearchParams({ level: part.toString(), answer }),
    },
  );
  if (!res.ok)
    throw new ApiError(
      `failed to submit answer: ${res.status} ${res.statusText}`,
      res.status,
    );
  const resText = await res.text();
  // console.log(resText);

  if (resText.includes("You gave an answer too recently"))
    throw new Error(
      `failed to submit answer: rate limited (${resText.match(/(\d+)s left to wait/)?.[0]})`,
    );

  if (resText.includes("You don't seem to be solving the right level."))
    throw new Error("failed to submit answer: wrong level");

  if (resText.includes("To play, please identify yourself"))
    throw new Error("failed to submit answer: invalid session token");

  if (resText.includes("That's the right answer!")) return true;
  return false;
}
