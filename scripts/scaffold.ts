import { styleText } from "node:util";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { existsSync } from "node:fs";
import { fetchInput, ApiError } from "./api";
import { error, info, usage, confirm, getEst } from "./utils";

const [day, year] = process.argv.slice(2);

if (
  process.argv.slice(2).includes("--help") ||
  process.argv.slice(2).includes("-h")
) {
  usage("bun scaffold [day] [year]");
  info("if no arguments are provided the current day and year will be used");

  process.exit(0);
}

if (day && year) {
  scaffold(parseInt(day), parseInt(year));
} else {
  const [day, year] = getEst();
  scaffold(day, year);
}

export async function scaffold(day: number, year: number) {
  const dayStr = day.toString().padStart(2, "0");
  const srcDir = path.join(import.meta.dirname, `../src/${year}`);
  const dayDir = path.join(srcDir, `day${dayStr}`);

  console.log(styleText(["magenta", "bold"], `🔧 scaffolding`));
  console.log(`${year}, day ${day}`);

  // fetch input
  info("fetching input...");
  const input = await fetchInput(day, year).catch((err) => {
    if (err instanceof ApiError) {
      if (err.status === 404) {
        error("input not available yet");
        process.exit(1);
      } else {
        error(err.message);
      }
    } else {
      error("unknown error fetching input");
      error(err);
    }
  });

  // check if directory exists
  if (existsSync(srcDir)) {
    const confirmed = await confirm(
      "directory exists, do you wish to continue?",
    );

    if (!confirmed) return;
  }

  await mkdir(srcDir, { recursive: true });

  function ts(strings: TemplateStringsArray, ...values: any[]) {
    let raw = String.raw(strings, ...values);
    return raw.trim();
  }

  const test = ts`
import { parse, partOne, partTwo } from ".";
import { beforeAll, describe, test, expect } from "bun:test";
import path from "node:path";

const example = Bun.file(path.join(import.meta.dirname, "example.txt"));
let parsedInput: any;

describe("day ${day}", () => {
  beforeAll(async () => {
    parsedInput = parse(await example.text());
    console.log(parsedInput);
  });
  test("part 1", () => {
    expect(partOne(parsedInput)).toBe("");
  });
  test("part 2", () => {
    expect(partTwo(parsedInput)).toBe("");
  });
});
`;

  const solution = ts`
export function parse(input: string) {
  return input;
}

export function partOne(input: ReturnType<typeof parse>): string {
  return "";
}

export function partTwo(input: ReturnType<typeof parse>): string {
  return "";
}
`;

  await Bun.write(path.join(dayDir, `index.ts`), solution);
  await Bun.write(path.join(dayDir, `index.test.ts`), test);
  await Bun.write(path.join(dayDir, `input.txt`), input ?? "");
  await Bun.write(path.join(dayDir, `example.txt`), "");

  console.log(styleText(["gray"], "setup complete, have fun :)"));
}
