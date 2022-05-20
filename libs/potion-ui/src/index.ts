import BaseButton from "./components/BaseButton/BaseButton.vue";
import BaseCard from "./components/BaseCard/BaseCard.vue";
import BaseTag from "./components/BaseTag/BaseTag.vue";
import CardFooter from "./components/CardFooter/CardFooter.vue";
import ConnectWalletButton from "./components/ConnectWalletButton/ConnectWalletButton.vue";
import InputNumber from "./components/InputNumber/InputNumber.vue";
import HeaderComponent from "./components/layout/Header/HeaderComponent.vue";
import TabNavigationComponent from "./components/TabNavigationComponent/TabNavigationComponent.vue";
import TokenIcon from "./components/TokenIcon/TokenIcon.vue";
import UnderlyingSelection from "./components/UnderlyingSelection/UnderlyingSelection.vue";
import CustomCurveParams from "./components/CustomCurveParams/CustomCurveParams.vue";
import CurveFormula from "./components/CurveFormula/CurveFormula.vue";
import BondingCurve from "./components/BondingCurve/BondingCurve.vue";
import InputSlider from "./components/InputSlider/InputSlider.vue";
import Tooltip from "./components/Tooltip/Tooltip.vue";

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
  TabNavigationComponent,
  TokenIcon,
  UnderlyingSelection,
  CustomCurveParams,
  CurveFormula,
  BondingCurve,
  InputSlider,
  Tooltip,
};
