import { styleText } from "node:util";
import path from "node:path";
import { submitAnswer } from "./api";
import { confirm, error, getEst, info, usage, warn } from "./utils";

const [part, day, year] = process.argv.slice(2);

if (
  process.argv.slice(2).includes("--help") ||
  process.argv.slice(2).includes("-h")
) {
  usage("bun solve <part> [day] [year]");
  info("if no arguments are provided the current day and year will be used");

  process.exit(0);
}

if (part) {
  const partNum = parseInt(part);
  if (partNum !== 1 && partNum !== 2) throw new Error("part must be 1 or 2");

  if (day && year) {
    solve(partNum, parseInt(day), parseInt(year));
  } else {
    const [day, year] = getEst();
    solve(partNum, day, year);
  }
} else {
  throw new Error("part argument is required to submit answer");
}

export async function solve(part: 1 | 2, day: number, year: number) {
  const dayStr = day.toString().padStart(2, "0");
  const srcDir = path.join(import.meta.dirname, `../src/${year}`);
  const dayDir = path.join(srcDir, `day${dayStr}`);
  const inputFile = Bun.file(path.join(dayDir, "input.txt"));

  console.log(
    styleText(["magenta", "bold"], "solving ") + `${year}, day ${day}`,
  );

  // run solution
  import(path.join(dayDir, "index.ts"))
    .then(async (module) => {
      console.log(styleText(["gray"], "running solution..."));
      const input = module.parse(await inputFile.text());

      let answer;
      if (part === 1) {
        answer = await module.partOne(input);
      } else {
        answer = await module.partTwo(input);
      }

      if (!answer) warn("no answer returned from solve function");

      console.log(styleText(["green", "bold"], `answer: ${answer}`));

      if (!part) {
        warn("part not specified, cannot submit answer");
        return;
      }

      // prompt to submit answer
      const confirmed = await confirm("submit answer?");
      if (confirmed) {
        const correct = await submitAnswer(
          day,
          year,
          part,
          answer.toString(),
        ).catch((err) => {
          error(err.message);
        });

        if (correct === undefined) return;

        if (correct) {
          console.log(styleText(["green", "bold"], "✓ correct answer!"));
        } else {
          console.log(styleText(["red", "bold"], "✗ incorrect answer"));
        }
      } else {
        console.log(styleText(["gray"], "answer not submitted"));
      }
    })
    .catch((err) => {
      error("failed to run solution:");
      error(err);
    });
}
