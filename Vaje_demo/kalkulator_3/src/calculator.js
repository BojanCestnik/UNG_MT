// Celotno stanje in računska logika sta neodvisna od React komponent.
export const initialState = {
  display: '0',
  expression: '',
  firstOperand: null,
  operator: null,
  waitingForOperand: false,
  justCalculated: false,
  error: false,
};

const symbols = { '+': '+', '-': '-', '*': '*', '/': '÷' };

function calculate(a, b, operator) {
  switch (operator) {
    case '+': return a + b;
    case '-': return a - b;
    case '*': return a * b;
    case '/': return b === 0 ? null : a / b;
    default: return null;
  }
}

function formatResult(value) {
  if (value === null || !Number.isFinite(value)) return null;
  return String(Number(value.toPrecision(12)));
}

function errorState() {
  return {
    ...initialState,
    display: 'Napaka',
    expression: 'Deljenje z nič ni dovoljeno',
    error: true,
  };
}

export function calculatorReducer(state, action) {
  switch (action.type) {
    case 'CLEAR':
      return { ...initialState };

    case 'DIGIT': {
      const digit = action.value;
      const base = state.error ? initialState : state;
      if (base.waitingForOperand || base.justCalculated) {
        return {
          ...base,
          display: digit,
          expression: base.justCalculated ? '' : base.expression,
          waitingForOperand: false,
          justCalculated: false,
        };
      }
      if (base.display.replace(/\D/g, '').length >= 15) return base;
      return {
        ...base,
        display: base.display === '0' ? digit : base.display + digit,
      };
    }

    case 'DECIMAL': {
      const base = state.error ? initialState : state;
      if (base.waitingForOperand || base.justCalculated) {
        return {
          ...base,
          display: '0.',
          expression: base.justCalculated ? '' : base.expression,
          waitingForOperand: false,
          justCalculated: false,
        };
      }
      return base.display.includes('.')
        ? base
        : { ...base, display: base.display + '.' };
    }

    case 'OPERATOR': {
      if (state.error) return state;
      let display = state.display;
      if (state.operator && !state.waitingForOperand) {
        const result = formatResult(calculate(
          state.firstOperand, Number(display), state.operator
        ));
        if (result === null) return errorState();
        display = result;
      }
      return {
        ...state,
        display,
        firstOperand: Number(display),
        operator: action.value,
        expression: `${display} ${symbols[action.value]}`,
        waitingForOperand: true,
        justCalculated: false,
      };
    }

    case 'EQUALS': {
      if (state.error || !state.operator || state.waitingForOperand) {
        return state;
      }
      const result = formatResult(calculate(
        state.firstOperand, Number(state.display), state.operator
      ));
      if (result === null) return errorState();
      return {
        ...initialState,
        display: result,
        expression: `${state.firstOperand} ${symbols[state.operator]} ${state.display} =`,
        justCalculated: true,
      };
    }

    case 'DELETE': {
      if (state.error) return { ...initialState };
      if (state.waitingForOperand) return state;
      const shortened = state.display.slice(0, -1);
      return {
        ...state,
        display: shortened === '' || shortened === '-' ? '0' : shortened,
        expression: state.justCalculated ? '' : state.expression,
        justCalculated: false,
      };
    }

    default:
      return state;
  }
}
