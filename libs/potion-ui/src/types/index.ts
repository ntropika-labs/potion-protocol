export interface PropsMap<T> {
  [iterator: string]: T;
}

// prettier-ignore
export enum ThemePalette {
  primary       = "primary",
  secondary     = "secondary",
  transparent   = "transparent",
  opaque        = "opaque",
}

// prettier-ignore
export enum ButtonPalette {
  primary       = "primary",
  "primary-o"   = "primary-o",
  secondary     = "secondary",
  "secondary-o" = "secondary-o",
  accent        = "accent",
  "accent-o"    = "accent-o",
  tertiary      = "tertiary",
  white         = "white",
  "white-o"     = "white-o",
  filter        = "filter",
  warning       = "warning",
  error         = "error",
  transparent   = "transparent",
  flat          = "flat"
}

// prettier-ignore
export enum ButtonSize {
  icon      = "icon",
  xs        = "xs",
  sm        = "sm",
  md        = "md",
  lg        = "lg",
}

// prettier-ignore
export enum ButtonWeight {
  medium      = "medium",
  bold        = "bold"
}

// prettier-ignore
export enum InputType {
  text        = "text",
  number      = "number",
  email       = "email",
  telephone   = "telephone",
}

export interface ListElement {
  id: number | string;
  label: string;
  checked?: boolean;
  showAdditionalInfo?: boolean;
}

export enum IconStrokeWeight {
  bold = 24,
  light = 12,
  thin = 8,
  regular = 16,
}
export interface EmergingCurve {
  data: number[];
  symbol: string;
}
