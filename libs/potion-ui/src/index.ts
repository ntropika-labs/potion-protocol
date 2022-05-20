//helpers
export * from "./helpers";

import BaseButton from "./components/BaseButton/BaseButton.vue";
import BaseCard from "./components/BaseCard/BaseCard.vue";
import BaseTag from "./components/BaseTag/BaseTag.vue";
import BondingCurve from "./components/BondingCurve/BondingCurve.vue";
import CardFooter from "./components/CardFooter/CardFooter.vue";
import ConnectWalletButton from "./components/ConnectWalletButton/ConnectWalletButton.vue";
import CriteriasRecap from "./components/CriteriasRecap/CriteriasRecap.vue";
import CurveFormula from "./components/CurveFormula/CurveFormula.vue";
import CustomCurveParams from "./components/CustomCurveParams/CustomCurveParams.vue";
import HeaderComponent from "./components/layout/Header/HeaderComponent.vue";
import InputNumber from "./components/InputNumber/InputNumber.vue";
import TabNavigationComponent from "./components/TabNavigationComponent/TabNavigationComponent.vue";
import TokenSelection from "./components/TokenSelection/TokenSelection.vue";

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
  BaseCard,
  BaseTag,
  BondingCurve,
  CardFooter,
  ConnectWalletButton,
  CriteriasRecap,
  CurveFormula,
  CustomCurveParams,
  HeaderComponent,
  InputNumber,
  TabNavigationComponent,
  TokenSelection,
};
