import { getEst, info, usage } from "./utils";

const [part, day, year] = process.argv.slice(2);

if (
  process.argv.slice(2).includes("--help") ||
  process.argv.slice(2).includes("-h")
) {
  usage("bun example [part] [day] [year]");
  info("if no arguments are provided the current day and year will be used");

  process.exit(0);
}

let partNum: 1 | 2 | undefined;
if (part) {
  partNum = parseInt(part) as 1 | 2;
  if (partNum !== 1 && partNum !== 2) throw new Error("part must be 1 or 2");
}

if (day && year) {
  example(parseInt(day), parseInt(year), partNum);
} else {
  const [day, year] = getEst();
  example(day, year, partNum);
}

export async function example(day: number, year: number, part?: 1 | 2) {
  Bun.spawn([
    "bun",
    "test",
    year.toString(),
    "--test-name-pattern",
    `day ${day} ${part ? `part ${part}` : ""}`,
    "--watch",
  ]);
}
