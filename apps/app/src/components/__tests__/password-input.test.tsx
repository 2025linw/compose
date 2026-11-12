import {
  fireEvent,
  screen,
  userEvent,
  waitFor,
} from '@testing-library/react-native';

import { renderWithProviders } from '@utils/tests/render';

import { buildTheme } from '@contexts/theme/settings';

import PasswordInput from '../password-input';

describe('<PasswordInput /> Content', () => {
  test('shows the placeholder and masks the password by default', async () => {
    await renderWithProviders(<PasswordInput placeholder="Enter password" />);

    const textInput = screen.getByPlaceholderText('Enter password');

    expect(textInput).toBeVisible();
    expect(textInput).toHaveProp('secureTextEntry', true);
    expect(screen.getByRole('button')).toBeVisible();
  });
});

describe('<PasswordInput /> Style', () => {
  const theme = buildTheme('default', 'light');

  test('renders a borderless, transparent inner input by default', async () => {
    await renderWithProviders(<PasswordInput placeholder="Enter password" />);

    const textInput = screen.getByPlaceholderText('Enter password');

    expect(textInput).toHaveStyle({
      padding: 0,
      borderWidth: 0,
      borderRadius: 0,
      backgroundColor: 'transparent',
    });
  });

  test('applies the focused border to the wrapper and restores it on blur', async () => {
    await renderWithProviders(
      <PasswordInput
        placeholder="Enter password"
        testID="password-input"
      />,
    );

    const textInput = screen.getByPlaceholderText('Enter password');
    const { container, focused } = theme.components.TextInput;
    const defaultBorder = { borderColor: container.borderColor };

    expect(screen.getByTestId('password-input')).toHaveStyle(defaultBorder);

    fireEvent(textInput, 'focus');

    await waitFor(() => {
      expect(screen.getByTestId('password-input')).toHaveStyle(focused);
    });

    fireEvent(screen.getByPlaceholderText('Enter password'), 'blur');

    await waitFor(() => {
      expect(screen.getByTestId('password-input')).not.toHaveStyle(focused);
    });
    expect(screen.getByTestId('password-input')).toHaveStyle(defaultBorder);
  });
});

describe('<PasswordInput /> Action', () => {
  test('reveals and hides the password without changing its value', async () => {
    const user = userEvent.setup();
    const onChangeText = jest.fn();

    await renderWithProviders(
      <PasswordInput
        placeholder="Enter password"
        onChangeText={onChangeText}
      />,
    );

    const textInput = screen.getByPlaceholderText('Enter password');

    await user.type(textInput, 'sample-password');

    expect(textInput).toHaveDisplayValue('sample-password');
    onChangeText.mockClear();

    await user.press(screen.getByRole('button'));

    const revealedInput = screen.getByPlaceholderText('Enter password');

    expect(revealedInput).toHaveProp('secureTextEntry', false);
    expect(revealedInput).toHaveDisplayValue('sample-password');

    await user.press(screen.getByRole('button'));

    const hiddenInput = screen.getByPlaceholderText('Enter password');

    expect(hiddenInput).toHaveProp('secureTextEntry', true);
    expect(hiddenInput).toHaveDisplayValue('sample-password');
    expect(onChangeText).not.toHaveBeenCalled();
  });

  test('calls onChangeText when typing', async () => {
    const user = userEvent.setup();
    const onChangeText = jest.fn();

    await renderWithProviders(
      <PasswordInput
        placeholder="Enter password"
        onChangeText={onChangeText}
      />,
    );

    const textInput = screen.getByPlaceholderText('Enter password');

    await user.type(textInput, 'sample-password');

    expect(onChangeText).toHaveBeenLastCalledWith('sample-password');
  });

  test('disabled=true prevents editing and revealing the password', async () => {
    const user = userEvent.setup();

    await renderWithProviders(
      <PasswordInput
        placeholder="Enter password"
        disabled
      />,
    );

    const textInput = screen.getByPlaceholderText('Enter password');
    const toggleButton = screen.getByRole('button');

    expect(textInput).toHaveProp('editable', false);
    expect(toggleButton).toBeDisabled();

    await user.press(toggleButton);

    expect(screen.getByPlaceholderText('Enter password')).toHaveProp(
      'secureTextEntry',
      true,
    );
  });
});
