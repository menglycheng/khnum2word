import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  KHMER_DIGIT_WORD_MAP,
  KHMER_TENTH_MAP,
  NUM_WORDS_LIST,
  KHMER_TO_ROMAN,
  ROMAN_TO_KHMER,
  DIGIT_TO_KHMER,
  TENS_TO_KHMER,
} from "./constants";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

function indexOf(item: string, array: string[]): number {
  return array.indexOf(item);
}

function khmer2RomanNum(num: string): string {
  return num.replace(/[០-៩]/g, (match) => KHMER_TO_ROMAN[match] || match);
}

function roman2KhmerNum(num: string): string {
  return num.replace(/[0-9]/g, (match) => ROMAN_TO_KHMER[match] || match);
}

function text2Token(text: string): string[] {
  const cleanText = text.replace(/\s/g, "");
  const tokens: string[] = [];
  let remaining = cleanText;

  while (remaining.length > 0) {
    let token = "";

    for (const word of NUM_WORDS_LIST) {
      const wordLength = word.length;
      if (
        wordLength <= remaining.length &&
        word === remaining.substring(0, wordLength)
      ) {
        token = word;
        remaining = remaining.substring(wordLength);
        break;
      }
    }

    if (token === "" && remaining !== "") {
      throw new Error("cannot segment word");
    }

    if (token) {
      tokens.push(token);
    }
  }

  return tokens;
}

function collect(s: number[], t: number): [number[], number] {
  let tmp = [...s];
  let k = 0;

  while (tmp.length > 0) {
    if (tmp[tmp.length - 1] >= t) {
      return [tmp, k];
    }
    k += tmp[tmp.length - 1];
    tmp = tmp.slice(0, -1);
  }

  return [tmp, k];
}

function text2Int(tokens: string[]): string {
  let numArr: number[] = [];

  for (const token of tokens) {
    if (KHMER_DIGIT_WORD_MAP.hasOwnProperty(token)) {
      numArr.push(KHMER_DIGIT_WORD_MAP[token]);
    } else if (KHMER_TENTH_MAP.hasOwnProperty(token)) {
      numArr.push(KHMER_TENTH_MAP[token]);
    } else if (token === "លាន") {
      const [newArr, n] = collect(numArr, 1000000);
      numArr = newArr;
      numArr.push(n * 1000000);
    } else if (token === "សែន") {
      const [newArr, n] = collect(numArr, 100000);
      numArr = newArr;
      numArr.push(n * 100000);
    } else if (token === "ម៉ឺន") {
      const [newArr, n] = collect(numArr, 10000);
      numArr = newArr;
      numArr.push(n * 10000);
    } else if (token === "ពាន់") {
      const [newArr, n] = collect(numArr, 1000);
      numArr = newArr;
      numArr.push(n * 1000);
    } else if (token === "រយ") {
      const [newArr, n] = collect(numArr, 100);
      numArr = newArr;
      numArr.push(n * 100);
    }
  }

  const numWord = numArr.reduce((sum, num) => sum + num, 0);
  return numWord.toString();
}

function text2number(text: string): string {
  const tokens = text2Token(text);
  const posDot = indexOf("ចុច", tokens);

  if (posDot === -1) {
    return text2Int(tokens);
  }

  const digit = tokens.slice(0, posDot);
  const precision = tokens.slice(posDot + 1);
  let leadZero = "";
  let count = 0;

  for (const value of precision) {
    if (value === "សូន្យ") {
      leadZero += "0";
      count += 1;
    } else {
      break;
    }
  }

  if (count === precision.length) {
    return `${text2Int(digit)}.${leadZero}`;
  } else {
    return `${text2Int(digit)}.${leadZero}${text2Int(precision)}`;
  }
}

function convertIntegerToKhmer(num: number): string {
  if (num === 0) return DIGIT_TO_KHMER[0];

  let result = "";

  if (num >= 1000000) {
    const millions = Math.floor(num / 1000000);
    result += convertIntegerToKhmer(millions) + "លាន";
    num %= 1000000;
  }

  if (num >= 100000) {
    const hundredThousands = Math.floor(num / 100000);
    result += DIGIT_TO_KHMER[hundredThousands] + "សែន";
    num %= 100000;
  }

  if (num >= 10000) {
    const tenThousands = Math.floor(num / 10000);
    result += DIGIT_TO_KHMER[tenThousands] + "ម៉ឺន";
    num %= 10000;
  }

  if (num >= 1000) {
    const thousands = Math.floor(num / 1000);
    result += DIGIT_TO_KHMER[thousands] + "ពាន់";
    num %= 1000;
  }

  if (num >= 100) {
    const hundreds = Math.floor(num / 100);
    result += DIGIT_TO_KHMER[hundreds] + "រយ";
    num %= 100;
  }

  if (num >= 10) {
    const tens = Math.floor(num / 10) * 10;
    if (TENS_TO_KHMER[tens]) {
      result += TENS_TO_KHMER[tens];
    }
    num %= 10;
  }

  if (num > 0) {
    result += DIGIT_TO_KHMER[num];
  }

  return result;
}

function convertDecimalToKhmer(decStr: string): string {
  let result = "";
  for (const digit of decStr) {
    result += DIGIT_TO_KHMER[parseInt(digit)];
  }
  return result;
}

export {
  indexOf,
  khmer2RomanNum,
  roman2KhmerNum,
  text2Token,
  collect,
  text2Int,
  text2number,
  convertIntegerToKhmer,
  convertDecimalToKhmer,
};
