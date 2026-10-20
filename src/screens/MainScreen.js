import React, { useMemo, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { calculateExpression } from '../api/calculatorApi';

const buttons = [
  ['C', '⌫', '(', ')'],
  ['sin', 'cos', 'tan', '√'],
  ['ln', 'log', 'exp', '÷'],
  ['7', '8', '9', '×'],
  ['4', '5', '6', '-'],
  ['1', '2', '3', '+'],
  ['0', '.', 'π', '='],
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
        <Text style={styles.title}>Scientific Calculator</Text>

        <View style={styles.displayWrap}>
          <Text style={styles.expression}>{displayValue}</Text>
          <Text style={styles.result}>{loading ? '...' : result}</Text>
        </View>

        <View style={styles.keypad}>
          {buttons.flat().map((button, index) => {
            const isAction = ['C', '⌫', '=', '÷', '×', '-', '+'].includes(button);
            const isFunction = ['sin', 'cos', 'tan', '√', 'ln', 'log', 'exp', 'π'].includes(button);

            return (
              <TouchableOpacity
                key={`${button}-${index}`}
                style={[
                  styles.key,
                  isAction && styles.actionKey,
                  isFunction && styles.functionKey,
                  button === '=' && styles.equalsKey,
                ]}
                onPress={() => appendValue(button)}
              >
                <Text style={styles.keyText}>{button}</Text>
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
    backgroundColor: '#031a2d',
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: 18,
  },
  title: {
    color: '#f2f7ff',
    fontSize: 36,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 18,
  },
  displayWrap: {
    alignItems: 'flex-end',
    marginBottom: 18,
    minHeight: 110,
    justifyContent: 'flex-end',
  },
  expression: {
    color: '#dfeaf8',
    fontSize: 24,
    marginBottom: 8,
  },
  result: {
    color: '#f7fbff',
    fontSize: 74,
    fontWeight: '700',
    lineHeight: 74,
  },
  keypad: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  key: {
    width: '23%',
    height: 120,
    backgroundColor: '#44556a',
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionKey: {
    backgroundColor: '#3f4d5d',
  },
  functionKey: {
    backgroundColor: '#1ca5f3',
  },
  equalsKey: {
    backgroundColor: '#1ca5f3',
  },
  keyText: {
    color: '#f3f8ff',
    fontSize: 30,
    fontWeight: '500',
  },
});
