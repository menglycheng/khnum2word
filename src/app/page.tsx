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
import { word2NumEN, word2NumKH, num2WordKH } from "../lib/converters";

interface Example {
  text: string;
  desc: string;
}

type ConversionType = "word2num" | "num2word";
type OutputType = "english" | "khmer";

const wordExamples: Example[] = [
  { text: "មួយពាន់", desc: "One thousand" },
  { text: "ប្រាំរយ", desc: "Five hundred" },
  { text: "ពីរម៉ឺន", desc: "Twenty thousand" },
  { text: "បីចុចប្រាំ", desc: "3.5" },
];

const numExamples: Example[] = [
  { text: "1000", desc: "One thousand" },
  { text: "500", desc: "Five hundred" },
  { text: "100 200", desc: "Multiple numbers" },
  { text: "3.5", desc: "Three point five" },
];

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
        converted = num2WordKH(input);
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
          <CardContent className="space-y-6">
            <div className="flex items-center justify-start gap-2">
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
              <div className="flex items-center justify-start gap-2">
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
      <footer className="fixed bottom-0 left-0 right-0 text-center py-4 text-sm text-gray-600">
        {/* footer content */}
        {/* copyright */}
        &copy; {new Date().getFullYear()} mengly. All rights reserved.
      </footer>
    </div>
  );
}
