import "@unocss/reset/tailwind.css";
import "uno.css";

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  backgrounds: {
    default: "potion",
    values: [
      {
        name: "potion",
        value:
          "linear-gradient( 113.69deg, var(--deep-blue) 23.72%, var(--deepBlack-900) 81.45% )",
      },
      {
        name: "light",
        value: "#F8F8F8",
      },
      {
        name: "dark",
        value: "#333333",
      },
    ],
  },
};
