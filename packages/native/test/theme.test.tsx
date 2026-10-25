import { Text } from 'react-native';
import * as ReactNative from 'react-native';
import { act, render, renderHook, screen } from '@testing-library/react-native';
import { AccessibilityInfo } from 'react-native';
import { SereinProvider, typeStyle, useReducedMotion, useTheme } from '../src';

function ThemeName() {
  return <Text>{useTheme().name}</Text>;
}

describe('theme', () => {
  afterEach(() => jest.restoreAllMocks());

  it('follows the system colour scheme by default', async () => {
    jest.spyOn(ReactNative, 'useColorScheme').mockReturnValue('dark');
    await render(<SereinProvider><ThemeName /></SereinProvider>);
    expect(screen.getByText('dark')).toBeTruthy();
  });

  it('lets a provider force a theme', async () => {
    jest.spyOn(ReactNative, 'useColorScheme').mockReturnValue('dark');
    await render(<SereinProvider theme="light"><ThemeName /></SereinProvider>);
    expect(screen.getByText('light')).toBeTruthy();
  });

  it('reports and tracks the reduce-motion setting', async () => {
    let listener: (value: boolean) => void = () => {};
    jest.spyOn(AccessibilityInfo, 'isReduceMotionEnabled').mockResolvedValue(true);
    jest.spyOn(AccessibilityInfo, 'addEventListener').mockImplementation(((_: string, fn: (value: boolean) => void) => { listener = fn; return { remove: jest.fn() }; }) as never);
    const { result } = await renderHook(() => useReducedMotion());
    expect(result.current).toBe(true);
    await act(async () => listener(false));
    expect(result.current).toBe(false);
  });

  it('maps type tokens to per-weight families without fontWeight', () => {
    expect(typeStyle('measure')).toEqual({ fontFamily: 'ChivoMono-Regular', fontSize: 12, lineHeight: 16, letterSpacing: 0 });
    expect(typeStyle('label', 600)).toMatchObject({ fontFamily: 'AnekLatin-SemiBold', fontSize: 13 });
    expect(typeStyle('body')).not.toHaveProperty('fontWeight');
  });
});
