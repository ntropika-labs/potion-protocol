import BaseButton from "./components/Button/BaseButton.vue";
import BaseCheckbox from "./components/Checkbox/BaseCheckbox.vue";
import BaseInput from "./components/Input/BaseInput.vue";
import HeaderComponent from "./components/layout/Header/HeaderComponent.vue";
import ListComponent from "./components/List/ListComponent.vue";

export type {
  IconStrokeWeight,
  ListElement,
  InputType,
  ButtonPalette,
  ButtonSize,
  ThemePalette,
  PropsMap,
} from "./types";
/**
 * Here, we export each of the components as a named export.
 * TODO: Add a folder per component and export the SFC as a named export in a TS file so we can globally import them.
 */
export { BaseButton, BaseCheckbox, BaseInput, ListComponent, HeaderComponent };
