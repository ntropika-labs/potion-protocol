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
  transparent   = "transparent",
  opaque        = "opaque",
}

// prettier-ignore
export enum ButtonSize {
  icon      = "icon",
  small     = "small",
  medium    = "medium",
  large     = "large",
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
