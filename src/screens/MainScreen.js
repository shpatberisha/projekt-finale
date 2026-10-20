import React, { useMemo, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { calculateExpression } from './calculatorApi';

const buttons = [
  ['C', '⌫', '(', ')'],
  ['sin', 'cos', 'tan', '√'],
  ['ln', 'log', 'exp', '÷'],
  ['7', '8', '9', '×'],
  ['4', '5', '6', '-'],
  ['1', '2', '3', '+'],
  ['0', '.', 'π'],
  ['='],
];

const getSecondaryKeys = (value) => {
  const map = {
    sin: 'sin(',
    cos: 'cos(',
    tan: 'tan(',
    '√': 'sqrt(',
    ln: 'ln(',
    log: 'log(',
    exp: 'exp(',
    'π': 'pi',
    '÷': '/',
    '×': '*',
  };

  return map[value] || value;
};

export default function MainScreen() {
  const [expression, setExpression] = useState('');
  const [result, setResult] = useState('0');
  const [loading, setLoading] = useState(false);

  const displayValue = useMemo(() => {
    if (!expression.trim()) return '0';
    return expression;
  }, [expression]);

  const appendValue = (value) => {
    if (value === '=') {
      evaluateExpression();
      return;
    }

    if (value === 'C') {
      setExpression('');
      setResult('0');
      return;
    }

    if (value === '⌫') {
      setExpression((prev) => prev.slice(0, -1));
      return;
    }

    setExpression((prev) => prev + getSecondaryKeys(value));
  };

  const evaluateExpression = async () => {
    const finalExpression = expression.trim();
    if (!finalExpression) return;

    setLoading(true);
    const value = await calculateExpression(finalExpression);
    setResult(value);
    setExpression('');
    setLoading(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      <View style={styles.container}>
        <Text style={styles.title}>Scientific</Text>

        <View style={styles.displayWrap}>
          <Text style={styles.expression} numberOfLines={2}>{displayValue}</Text>
          <Text style={styles.result} numberOfLines={1}>{loading ? '...' : result}</Text>
        </View>

        <View style={styles.keypad}>
          {buttons.flat().map((button, index) => {
            const isAction = ['C', '⌫', '=', '÷', '×', '-', '+'].includes(button);
            const isFunction = ['sin', 'cos', 'tan', '√', 'ln', 'log', 'exp', 'π'].includes(button);
            const isZero = button === '0';
            const isEquals = button === '=';
            const isStandaloneEquals = isEquals && buttons.length > 0 && buttons[buttons.length - 1].length === 1;

            return (
              <TouchableOpacity
                key={`${button}-${index}`}
                activeOpacity={0.8}
                style={[
                  styles.key,
                  isAction && styles.actionKey,
                  isFunction && styles.functionKey,
                  isEquals && styles.equalsKey,
                  isZero && styles.zeroKey,
                  isStandaloneEquals && styles.standaloneEquals,
                ]}
                onPress={() => appendValue(button)}
              >
                <Text style={[styles.keyText, isEquals && styles.equalsText]}>{button}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#031a2d',
  },
  container: {
    flex: 1,
    width: '100%',
    maxWidth: 420,
    alignSelf: 'center',
    backgroundColor: '#031a2d',
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 14,
  },
  title: {
    color: '#f2f7ff',
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginBottom: 10,
  },
  displayWrap: {
    width: '100%',
    minHeight: 110,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 18,
    paddingHorizontal: 12,
    paddingVertical: 10,
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    marginBottom: 12,
  },
  expression: {
    color: '#dfeaf8',
    fontSize: 14,
    marginBottom: 4,
    textAlign: 'right',
  },
  result: {
    color: '#f7fbff',
    fontSize: 38,
    fontWeight: '700',
    lineHeight: 42,
    textAlign: 'right',
  },
  keypad: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 8,
  },
  key: {
    width: '23%',
    height: 54,
    minHeight: 54,
    backgroundColor: '#465a6d',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  actionKey: {
    backgroundColor: '#566b7d',
  },
  functionKey: {
    backgroundColor: '#1ca5f3',
  },
  equalsKey: {
    backgroundColor: '#1ca5f3',
    width: '23%',
  },
  standaloneEquals: {
    width: '100%',
    marginTop: 8,
  },
  zeroKey: {
    width: '48%',
  },
  keyText: {
    color: '#f3f8ff',
    fontSize: 22,
    fontWeight: '600',
  },
  equalsText: {
    fontSize: 26,
    fontWeight: '700',
  },
});
