import 'sanitize.css';
import { ThemeProvider } from 'styled-components';
import { Theme } from 'styles/theme';
import 'tailwindcss/tailwind.css';
import '../src/styles/globals.css';

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  backgrounds: {
    default: 'white',
    values: [
      {
        name: 'white',
        value: '#FFFFFF',
      },
      {
        name: 'blue',
        value: '#6b7595',
      },
    ],
  },
};

const withThemeProvider = (Story, context) => {
  return (
    <ThemeProvider theme={Theme}>
      <Story {...context} />
    </ThemeProvider>
  );
};

export const decorators = [withThemeProvider];
