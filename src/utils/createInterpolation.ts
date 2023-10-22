//@ts-ignore
import invariant from './invariant.js'

export enum ExtrapolateType {
  extend = 'extend',
  identity = 'identity',
  clamp = 'clamp',
}

export type InterpolationConfigType = {
  inputRange: Array<number>
  outputRange: Array<number>
  easing?: (input: number) => number
  extrapolate?: ExtrapolateType
  extrapolateLeft?: ExtrapolateType
  extrapolateRight?: ExtrapolateType
}

function findRange(input: number, inputRange: Array<number>) {
  let i
  for (i = 1; i < inputRange.length - 1; ++i) {
    if (inputRange[i] >= input) {
      break
    }
  }
  return i - 1
}

const linear = (t: number) => t

function checkValidInputRange(arr: Array<number>) {
  invariant(arr.length >= 2, 'inputRange must have at least 2 elements')
  for (let i = 1; i < arr.length; ++i) {
    invariant(
      arr[i] >= arr[i - 1],
      /* $FlowFixMe[incompatible-type] (>=0.13.0) - In the addition expression
       * below this comment, one or both of the operands may be something that
       * doesn't cleanly convert to a string, like undefined, null, and object,
       * etc. If you really mean this implicit string conversion, you can do
       * something like String(myThing) */
      'inputRange must be monotonically non-decreasing ' + arr
    )
  }
}

function checkInfiniteRange(name: string, arr: Array<number>) {
  invariant(arr.length >= 2, name + ' must have at least 2 elements')
  invariant(
    arr.length !== 2 || arr[0] !== -Infinity || arr[1] !== Infinity,
    /* $FlowFixMe[incompatible-type] (>=0.13.0) - In the addition expression
     * below this comment, one or both of the operands may be something that
     * doesn't cleanly convert to a string, like undefined, null, and object,
     * etc. If you really mean this implicit string conversion, you can do
     * something like String(myThing) */
    name + 'cannot be ]-infinity;+infinity[ ' + arr
  )
}
/**
 * Very handy helper to map input ranges to output ranges with an easing
 * function and custom behavior outside of the ranges.
 */
function createInterpolation(
  config: InterpolationConfigType
): (input: number) => number | string {
  const outputRange: Array<number> = config.outputRange as any
  checkInfiniteRange('outputRange', outputRange)

  const inputRange = config.inputRange
  checkInfiniteRange('inputRange', inputRange)
  checkValidInputRange(inputRange)

  const easing = config.easing || linear

  let extrapolateLeft: ExtrapolateType = ExtrapolateType.extend
  if (config.extrapolateLeft !== undefined) {
    extrapolateLeft = config.extrapolateLeft
  } else if (config.extrapolate !== undefined) {
    extrapolateLeft = config.extrapolate
  }

  let extrapolateRight: ExtrapolateType = ExtrapolateType.extend
  if (config.extrapolateRight !== undefined) {
    extrapolateRight = config.extrapolateRight
  } else if (config.extrapolate !== undefined) {
    extrapolateRight = config.extrapolate
  }

  return (input) => {
    const range = findRange(input, inputRange)
    return interpolate(
      input,
      inputRange[range],
      inputRange[range + 1],
      outputRange[range],
      outputRange[range + 1],
      easing,
      extrapolateLeft,
      extrapolateRight
    )
  }
}

function interpolate(
  input: number,
  inputMin: number,
  inputMax: number,
  outputMin: number,
  outputMax: number,
  easing: (input: number) => number,
  extrapolateLeft: ExtrapolateType,
  extrapolateRight: ExtrapolateType
) {
  let result = input

  // Extrapolate
  if (result < inputMin) {
    if (extrapolateLeft === 'identity') {
      return result
    } else if (extrapolateLeft === 'clamp') {
      result = inputMin
    } else if (extrapolateLeft === 'extend') {
      // noop
    }
  }

  if (result > inputMax) {
    if (extrapolateRight === 'identity') {
      return result
    } else if (extrapolateRight === 'clamp') {
      result = inputMax
    } else if (extrapolateRight === 'extend') {
      // noop
    }
  }

  if (outputMin === outputMax) {
    return outputMin
  }

  if (inputMin === inputMax) {
    if (input <= inputMin) {
      return outputMin
    }
    return outputMax
  }

  // Input Range
  if (inputMin === -Infinity) {
    result = -result
  } else if (inputMax === Infinity) {
    result = result - inputMin
  } else {
    result = (result - inputMin) / (inputMax - inputMin)
  }

  // Easing
  result = easing(result)

  // Output Range
  if (outputMin === -Infinity) {
    result = -result
  } else if (outputMax === Infinity) {
    result = result + outputMin
  } else {
    result = result * (outputMax - outputMin) + outputMin
  }

  return result
}

export default createInterpolation
