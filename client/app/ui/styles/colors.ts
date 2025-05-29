export type ColorSet = Record<string, string>;
export type Colors = Record<string, ColorSet | string>;

const black = "#000000";
const white = "#ffffff";
const transparent = "transparent";
const current = "currentColor";
const grey: ColorSet = {
  50: "#f9fafb",
  100: "#f3f4f6",
  200: "#e5e7eb",
  300: "#d1d5db",
  400: "#9ca3af",
  500: "#6b7280",
  600: "#4b5563",
  700: "#374151",
  800: "#1f2937",
  900: "#111827",
  950: "#030712",
};

const moss: ColorSet = {
  "50": "#424242",
  "100": "#424242",
  "300": "#424242",
  "500": "#424242",
  "700": "#424242",
  "900": "#424242",
};

const blue: ColorSet = {
  "50": "#F2F9FD",
  "100": "#E4F0FA",
  "300": "#8EC9EB",
  "500": "#2B94CC",
  "700": "#185E8C",
  "900": "#194461",
};

const green: ColorSet = {
  "50": "#F4FAEB",
  "100": "#E5F4D3",
  "300": "#ADDB7B",
  "500": "#7ABF39",
  "700": "#426A21",
  "900": "#30491E",
};

const red: ColorSet = {
  50: "#fef2f2",
  100: "#fee2e2",
  200: "#fecaca",
  300: "#fca5a5",
  400: "#f87171",
  500: "#ef4444",
  600: "#dc2626",
  700: "#b91c1c",
  800: "#991b1b",
  900: "#7f1d1d",
  950: "#450a0a",
};

const yellow: ColorSet = {
  "50": "#FDFCED",
  "100": "#F8F4CD",
  "300": "#EBDC6C",
  "500": "#DCAD24",
  "700": "#A2651B",
  "900": "#6D421A",
};

const purple: ColorSet = {
  "50": "#F5F4FE",
  "100": "#EBEAFD",
  "300": "#BFBAF8",
  "500": "#7D67EB",
  "700": "#5C35CC",
  "900": "#40268C",
};

export const _colors: Colors = {
  text: {
    primary: black,
    secondary: grey["900"],
    tertiary: grey["500"],
    white,
  },
  background: {
    primary: grey["50"],
    secondary: grey["100"],
    tertiary: grey["200"],
  },
  border: {
    primary: moss["300"],
    secondary: moss["500"],
    tertiary: moss["700"],
  },
  white,
  black,
  transparent,
  current,
  grey,
  blue,
  green,
  moss,
  red,
  yellow,
  purple,
};

export const colors = {
  ..._colors,
} as ColorSet;
