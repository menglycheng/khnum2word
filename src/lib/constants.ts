interface DigitMap {
  [key: string]: number;
}

interface NumberMap {
  [key: number]: string;
}

interface StringMap {
  [key: string]: string;
}

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
  0: "០",
  1: "១",
  2: "២",
  3: "៣",
  4: "៤",
  5: "៥",
  6: "៦",
  7: "៧",
  8: "៨",
  9: "៩",
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

export type { DigitMap, NumberMap, StringMap };
export {
  KHMER_DIGIT_WORD_MAP,
  KHMER_TENTH_MAP,
  NUM_WORDS_LIST,
  KHMER_TO_ROMAN,
  ROMAN_TO_KHMER,
  DIGIT_TO_KHMER,
  TENS_TO_KHMER,
};
