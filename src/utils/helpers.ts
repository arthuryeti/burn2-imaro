import BigNumber from "bignumber.js";

type ErrorWithMessage = {
  message: string;
};

function isErrorWithMessage(error: unknown): error is ErrorWithMessage {
  return (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof (error as Record<string, unknown>).message === "string"
  );
}

function toErrorWithMessage(maybeError: unknown): ErrorWithMessage {
  if (isErrorWithMessage(maybeError)) return maybeError;

  try {
    return new Error(JSON.stringify(maybeError));
  } catch {
    // fallback in case there's an error stringifying the maybeError

    // like with circular references for example.

    return new Error(String(maybeError));
  }
}

export function getErrorMessage(error: unknown) {
  return toErrorWithMessage(error).message;
}

/**
 * Simple util for creating a BN
 */
export function toBN(val: BigNumber.Value): BigNumber {
  return new BigNumber(val);
}

export function bnum(val: string | number | BigNumber): BigNumber {
  const number = typeof val === "string" ? val : val ? val.toString() : "0";
  return new BigNumber(number);
}

export enum FiatCurrency {
  usd = "usd",
}

export enum FiatSymbol {
  usd = "$",
}

export interface FNumOptions extends Intl.NumberFormatOptions {
  fixedFormat?: boolean; // If true, don't auto-adjust based on number magnitde
  abbreviate?: boolean; // If true, reduce number size and add k/M/B to end
  dontAdjustLarge?: boolean; // If true, don't auto-adjust if the number is large
}

export const NumberFormats: Record<string, FNumOptions> = {
  percent: {
    style: "percent",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  },
  // Basis Points
  bp: {
    style: "bp",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  },
  token: {
    maximumFractionDigits: 2,
  },
  float: {
    maximumFractionDigits: 4,
  },
  fiat: {
    abbreviate: true,
    style: "currency",
  },
};

export function formatNumber(
  number: number | string | undefined,
  options: FNumOptions | undefined = {},
  currency: FiatCurrency = FiatCurrency.usd
): string {
  if (typeof number === "string") {
    if (number === "NaN") return "-";
    if (number === "") return "-";
    if (number === "-") return "-";
    number = Number(number || 0);
  }

  if (number == null) {
    return "-";
  }

  // bp - basis points
  if (options.style === "bp") {
    number = bnum(number).div(10000).toNumber();
    options = { ...options, style: "percent" };
  }

  const formatterOptions: Intl.NumberFormatOptions = {
    ...options,
    // @ts-expect-error
    roundingMode: "trunc",
  };
  let postfixSymbol = "";

  if (options.abbreviate) {
    const lookup = [
      { value: 1, symbol: "" },
      { value: 1e3, symbol: "k" },
      { value: 1e6, symbol: "m" },
      { value: 1e9, symbol: "b" },
    ];
    const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
    const item = lookup
      .slice()
      .reverse()
      .find(function (item) {
        // @ts-expect-error
        return number >= item.value;
      });
    postfixSymbol = item ? item.symbol : "";
    const fractionDigits = 2;
    number = item
      ? new BigNumber(
          (number / item.value).toFixed(fractionDigits).replace(rx, "$1")
        ).toNumber()
      : number;
  }

  if (number >= 1e4 && !options.fixedFormat && !options.dontAdjustLarge) {
    formatterOptions.minimumFractionDigits = 0;
    formatterOptions.maximumFractionDigits = 0;
  }

  if (options.style === "percent") {
    if (
      number < 0 &&
      formatterOptions.maximumFractionDigits &&
      formatterOptions.maximumFractionDigits >= 2 &&
      (formatterOptions.minimumFractionDigits || 0) <
        formatterOptions.maximumFractionDigits - 2
    ) {
      // For consistency with numeral which rounds based on digits before percentages are multiplied by 100
      formatterOptions.maximumFractionDigits =
        formatterOptions.maximumFractionDigits - 2;
    }
    formatterOptions.useGrouping = false;

    if (number > 0 && number < 0.01) {
      return "< 0.01%";
    }
  }

  if (options.style === "currency") {
    formatterOptions.currency = currency;
  }

  if (options.style === "currency" && number > 0 && number < 0.01) {
    return "< $0.01";
  }

  if (!options.fixedFormat && !options.style && number > 0 && number < 0.01) {
    return "< 0.01";
  }

  if (!options.fixedFormat && number < 1e-6 && number > 0) {
    number = 0;
  }

  const formatter = new Intl.NumberFormat("en-US", formatterOptions);
  let formattedNumber = formatter.format(number);

  // If the number is -0, remove the negative
  // if (formattedNumber[0] === "-" && !formattedNumber.match(/[1-9]/)) {
  //   formattedNumber = formattedNumber.slice(1);
  // }

  if (options.style === "percent") {
    formattedNumber = formatBigPercent(formattedNumber);
  }

  return formattedNumber + postfixSymbol;
}

/**
 * @summary Returns processed percent, which is > 1000.
 * @example formatBigPercent('1337.23%');  // => '1,337%'
 */
export function formatBigPercent(percent: string): string {
  const _percent = Number(percent.replace("%", ""));

  if (_percent >= 1000) {
    return `${_percent.toFixed().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}%`;
  }
  return percent;
}
