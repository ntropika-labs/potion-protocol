import BaseButton from "./components/BaseButton/BaseButton.vue";
import BaseCard from "./components/BaseCard/BaseCard.vue";
import BaseTag from "./components/BaseTag/BaseTag.vue";
import CardFooter from "./components/CardFooter/CardFooter.vue";
import ConnectWalletButton from "./components/ConnectWalletButton/ConnectWalletButton.vue";
import InputNumber from "./components/InputNumber/InputNumber.vue";
import HeaderComponent from "./components/layout/Header/HeaderComponent.vue";

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
export {
  BaseButton,
  HeaderComponent,
  ConnectWalletButton,
  BaseCard,
  BaseTag,
  CardFooter,
  InputNumber,
};
