"use client";
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface DigitMap {
  [key: string]: number;
}

interface NumberMap {
  [key: number]: string;
}

interface StringMap {
  [key: string]: string;
}

interface Example {
  text: string;
  desc: string;
}

type ConversionType = "word2num" | "num2word";
type OutputType = "english" | "khmer";

const KHMER_DIGIT_WORD_MAP: DigitMap = {
  សូន្យ: 0,
  មួយ: 1,
  ពីរ: 2,
  បី: 3,
  បួន: 4,
  ប្រាំ: 5,
  ប្រាំមួយ: 6,
  ប្រាំពីរ: 7,
  ប្រាំបី: 8,
  ប្រាំបួន: 9,
};

const KHMER_TENTH_MAP: DigitMap = {
  ដប់: 10,
  ម្ភៃ: 20,
  សាមសិប: 30,
  សែសិប: 40,
  ហាសិប: 50,
  ហុកសិប: 60,
  ចិតសិប: 70,
  ប៉ែតសិប: 80,
  កៅសិប: 90,
};

const NUM_WORDS_LIST: string[] = [
  ...Object.keys(KHMER_DIGIT_WORD_MAP),
  ...Object.keys(KHMER_TENTH_MAP),
  "លាន",
  "សែន",
  "ម៉ឺន",
  "ពាន់",
  "រយ",
  "ចុច",
];

const KHMER_TO_ROMAN: StringMap = {
  "០": "0",
  "១": "1",
  "២": "2",
  "៣": "3",
  "៤": "4",
  "៥": "5",
  "៦": "6",
  "៧": "7",
  "៨": "8",
  "៩": "9",
};

const ROMAN_TO_KHMER: StringMap = {
  "0": "០",
  "1": "១",
  "2": "២",
  "3": "៣",
  "4": "៤",
  "5": "៥",
  "6": "៦",
  "7": "៧",
  "8": "៨",
  "9": "៩",
};

const DIGIT_TO_KHMER: NumberMap = {
  0: "សូន្យ",
  1: "មួយ",
  2: "ពីរ",
  3: "បី",
  4: "បួន",
  5: "ប្រាំ",
  6: "ប្រាំមួយ",
  7: "ប្រាំពីរ",
  8: "ប្រាំបី",
  9: "ប្រាំបួន",
};

const TENS_TO_KHMER: NumberMap = {
  10: "ដប់",
  20: "ម្ភៃ",
  30: "សាមសិប",
  40: "សែសិប",
  50: "ហាសិប",
  60: "ហុកសិប",
  70: "ចិតសិប",
  80: "ប៉ែតសិប",
  90: "កៅសិប",
};

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

function word2NumEN(text: string): string {
  const num = text2number(text);
  return khmer2RomanNum(num);
}

function word2NumKH(text: string): string {
  const num = text2number(text);
  return roman2KhmerNum(num);
}

function num2WordKH(num: number): string {
  const numStr = num.toString();

  if (numStr.includes(".")) {
    const [intPart, decPart] = numStr.split(".");
    const intWords = convertIntegerToKhmer(parseInt(intPart));
    const decWords = convertDecimalToKhmer(decPart);
    return `${intWords}ចុច${decWords}`;
  }

  return convertIntegerToKhmer(parseInt(numStr));
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
    result += convertIntegerToKhmer(hundredThousands) + "សែន";
    num %= 100000;
  }

  if (num >= 10000) {
    const tenThousands = Math.floor(num / 10000);
    result += convertIntegerToKhmer(tenThousands) + "ម៉ឺន";
    num %= 10000;
  }

  if (num >= 1000) {
    const thousands = Math.floor(num / 1000);
    result += convertIntegerToKhmer(thousands) + "ពាន់";
    num %= 1000;
  }

  if (num >= 100) {
    const hundreds = Math.floor(num / 100);
    result += convertIntegerToKhmer(hundreds) + "រយ";
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

export default function KhmerNumberConverter(): React.JSX.Element {
  const [input, setInput] = useState<string>("");
  const [result, setResult] = useState<string>("");
  const [conversionType, setConversionType] =
    useState<ConversionType>("word2num");
  const [outputType, setOutputType] = useState<OutputType>("english");

  const handleConvert = (): void => {
    if (!input.trim()) {
      toast.error("Please enter some text");
      setResult("");
      return;
    }

    try {
      let converted: string;

      if (conversionType === "word2num") {
        if (outputType === "english") {
          converted = word2NumEN(input);
        } else {
          converted = word2NumKH(input);
        }
      } else {
        const num = parseFloat(input);
        if (isNaN(num)) {
          throw new Error("Invalid number format");
        }
        converted = num2WordKH(num);
      }

      setResult(converted);
      toast.success(`Conversion completed: ${converted}`);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An error occurred";
      toast.error(errorMessage);
      setResult("");
    }
  };

  const wordExamples: Example[] = [
    { text: "មួយពាន់", desc: "One thousand" },
    { text: "ប្រាំរយ", desc: "Five hundred" },
    { text: "ពីរម៉ឺន", desc: "Twenty thousand" },
    { text: "បីចុចប្រាំ", desc: "3.5" },
  ];

  const numExamples: Example[] = [
    { text: "1000", desc: "One thousand" },
    { text: "500", desc: "Five hundred" },
    { text: "20000", desc: "Twenty thousand" },
    { text: "3.5", desc: "Three point five" },
  ];

  const currentExamples: Example[] =
    conversionType === "word2num" ? wordExamples : numExamples;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold">Khmer Number Converter</h1>
          <p className="text-muted-foreground">
            Convert between Khmer number words and digits
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Converter</CardTitle>
            <CardDescription>
              Choose your conversion type and enter text or numbers below
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 ">
            <div className="flex items-center justify-start  gap-2">
              <Label className="font-bold">Conversion Type:</Label>
              <RadioGroup
                value={conversionType}
                onValueChange={(value) =>
                  setConversionType(value as ConversionType)
                }
                className="flex gap-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="word2num"
                    id="word2num"
                    className="cursor-pointer"
                  />
                  <Label htmlFor="word2num" className="text-gray-600">
                    Words to Numbers
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="num2word"
                    id="num2word"
                    className="cursor-pointer"
                  />
                  <Label htmlFor="num2word" className="text-gray-600">
                    Numbers to Words
                  </Label>
                </div>
              </RadioGroup>
            </div>
            {conversionType === "word2num" && (
              <div className="flex items-center justify-start  gap-2">
                <Label className="font-bold">Output Format:</Label>
                <RadioGroup
                  value={outputType}
                  onValueChange={(value) => setOutputType(value as OutputType)}
                  className="flex gap-6"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="english"
                      id="english"
                      className="cursor-pointer"
                    />
                    <Label htmlFor="english" className="text-gray-600">
                      English Numbers
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="khmer"
                      id="khmer"
                      className="cursor-pointer"
                    />
                    <Label htmlFor="khmer" className="text-gray-600">
                      Khmer Numbers
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            )}

            <div className="flex gap-4 items-start md:items-center">
              <Label className="font-bold">Example:</Label>
              <div className="flex flex-wrap gap-2">
                {currentExamples.map((example, index) => (
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-2 justify-start cursor-pointer hover:bg-gray-300 w-fit transition-color px-2 py-1 rounded-xl"
                    key={index}
                    onClick={() => setInput(example.text)}
                  >
                    <div className="text-xs font-medium">{example.text}</div>
                    <p className="text-xs">({example.desc})</p>
                  </Badge>
                ))}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="input" className="font-bold">
                  {conversionType === "word2num"
                    ? "Input (Khmer Text)"
                    : "Input (Numbers)"}
                </Label>
                <Textarea
                  id="input"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={
                    conversionType === "word2num"
                      ? "Enter Khmer number words..."
                      : "Enter numbers (e.g., 123, 45.67)..."
                  }
                  className="h-32 resize-none"
                />
              </div>

              <div className="space-y-2">
                <Label className="font-bold">Output</Label>
                <div className="h-32 p-3 border rounded-lg bg-muted/30 overflow-auto">
                  <div className="text-xl font-mono">{result}</div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-end">
              <Button
                onClick={handleConvert}
                className="sm:mt-auto cursor-pointer"
              >
                Convert
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
