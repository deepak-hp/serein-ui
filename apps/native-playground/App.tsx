import { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { formatMoney } from '@serein-ui/format';
import { Button, Readout, SereinProvider, Switch, TextField, typeStyle, useSereinFonts, useTheme, type ThemePreference } from '@serein-ui/native';

/** One theme's panel: every component, with one signal action. */
function Showcase() {
  const theme = useTheme();
  const c = theme.color;
  const [notify, setNotify] = useState(true);
  const [amount, setAmount] = useState('2400');
  const [sending, setSending] = useState(false);
  const value = Number(amount.replace(/[^\d.]/g, '')) || 0;
  const overLimit = value > 50000;

  const send = () => {
    setSending(true);
    setTimeout(() => setSending(false), 1600);
  };

  return <View style={{ flexGrow: 1, flexBasis: 320, gap: theme.space['5'], padding: theme.space['5'], backgroundColor: c['surface-raised'], borderWidth: theme.size.hairline, borderColor: c.line, borderRadius: theme.radius.panel }}>
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
      <Text accessibilityRole="header" style={[typeStyle('heading'), { color: c.ink }]}>Send money</Text>
      <Text style={[typeStyle('label'), { color: c['ink-muted'] }]}>{`${theme.name} theme`}</Text>
    </View>
    <Readout value={value} />
    <TextField label="Amount" keyboardType="decimal-pad" value={amount} onChangeText={setAmount} description="Daily limit ₹50,000" error={overLimit ? 'Over your daily limit of ₹50,000' : undefined} />
    <TextField label="Note" placeholder="Optional" />
    <Switch label="Notify the recipient" description="They get a message when it arrives" checked={notify} onCheckedChange={setNotify} />
    <Button block busy={sending} unavailableReason={overLimit ? 'Over daily limit' : undefined} onPress={send}>{`Send ${formatMoney(value)}`}</Button>
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: theme.space['3'] }}>
      <Button variant="secondary">Save draft</Button>
      <Button variant="quiet">Cancel</Button>
      <Button variant="danger">Remove payee</Button>
    </View>
  </View>;
}

function Screen({ preference, onPreference }: { preference: ThemePreference; onPreference: (p: ThemePreference) => void }) {
  const theme = useTheme();
  return <ScrollView style={{ backgroundColor: theme.color.surface }} contentContainerStyle={{ padding: theme.space['4'], paddingTop: theme.space['7'], gap: theme.space['5'] }}>
    <StatusBar style={theme.name === 'dark' ? 'light' : 'dark'} />
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
      <Text accessibilityRole="header" style={[typeStyle('title'), { color: theme.color.ink }]}>Serein native</Text>
      <Text style={[typeStyle('label'), { color: theme.color['ink-muted'] }]}>@serein-ui/native</Text>
    </View>
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: theme.space['2'] }}>
      {(['system', 'light', 'dark'] as const).map((p) => <Button key={p} variant={p === preference ? 'secondary' : 'quiet'} accessibilityState={{ selected: p === preference }} onPress={() => onPreference(p)}>{`Page: ${p}`}</Button>)}
    </View>
    {/* Both themes side by side (stacked on phones), whatever the page theme. */}
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: theme.space['5'] }}>
      <SereinProvider theme="light"><Showcase /></SereinProvider>
      <SereinProvider theme="dark"><Showcase /></SereinProvider>
    </View>
  </ScrollView>;
}

export default function App() {
  const [fontsLoaded] = useSereinFonts();
  const [preference, setPreference] = useState<ThemePreference>('system');
  if (!fontsLoaded) return null;
  return <SereinProvider theme={preference}><Screen preference={preference} onPreference={setPreference} /></SereinProvider>;
}
