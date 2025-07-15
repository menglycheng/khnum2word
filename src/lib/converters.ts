import {
  text2number,
  khmer2RomanNum,
  roman2KhmerNum,
  convertIntegerToKhmer,
  convertDecimalToKhmer,
} from "./utils";

function word2NumEN(text: string): string {
  const num = text2number(text);
  return khmer2RomanNum(num);
}

function word2NumKH(text: string): string {
  const num = text2number(text);
  return roman2KhmerNum(num);
}

function num2WordKH(input: string): string {
  const numbers = input.trim().split(/\s+/);
  const results: string[] = [];

  for (const numStr of numbers) {
    if (!numStr) continue;

    const num = parseFloat(numStr);
    if (isNaN(num)) {
      throw new Error(`Invalid number format: ${numStr}`);
    }

    if (numStr.includes(".")) {
      const [intPart, decPart] = numStr.split(".");
      const intWords = convertIntegerToKhmer(parseInt(intPart));
      const decWords = convertDecimalToKhmer(decPart);
      results.push(`${intWords}ចុច${decWords}`);
    } else {
      results.push(convertIntegerToKhmer(parseInt(numStr)));
    }
  }

  return results.join(" ");
}

export { word2NumEN, word2NumKH, num2WordKH };
