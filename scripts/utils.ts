import { styleText } from "node:util";
import readline from "node:readline";

export function getEst(): [day: number, year: number] {
  const now = new Date();
  const estDate = new Date(
    now.toLocaleString("en-US", { timeZone: "America/New_York" }),
  );
  if (estDate.getMonth() !== 11) {
    error("it's not december!");
  }
  return [estDate.getDate(), estDate.getFullYear()];
}

export function warn(msg: string) {
  console.warn(styleText(["yellow", "bold"], "[WARN] ") + msg);
}

export function error(msg: string) {
  console.error(styleText(["red", "bold"], "[ERROR] ") + msg);
}

export function info(msg: string) {
  console.log(styleText(["gray"], msg));
}

export function usage(msg: string) {
  console.log(styleText(["magenta", "bold"], "usage: ") + msg);
}

export function confirm(msg: string) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise<boolean>((resolve) => {
    rl.question(styleText(["gray"], `${msg} (y/N) `), (ans) => {
      rl.close();
      resolve(ans.toLowerCase() === "y");
    });
  });
}
