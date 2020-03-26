export type StrictOmit<T, K extends keyof T> = Omit<T, K>;
type a = (...a: number[]) => number;

/**
 * Partially curries a function so that (a, ...rest) => b becomes
 * a => ((...rest) => b)
 * @param func - function to curry
 */
export function curryOne<param1T, restT extends any[], out>(func: (param1: param1T, ...rest: restT) => out) {
  return (param1: param1T) => (...rest: restT) => func(param1, ...rest);
}
/**
 * Partially curries a function an arbitrary amount. Behavior depends on how the
 * output is used. This can be used for curryOne, but  (a, ...rest) => b becomes
 * a => ((...rest) => b)
 * @param func - function to curry
 */
export function curry<out>(func: (...params) => out) {
  return (...in1) => (...in2) => func(...in1, ...in2);
}

/**
 * Partially applies [func], supplying the arguments [params].
 */
export function applyPartial<out>(func: (...params) => out, ...paritalParams) {
  let temp = curry(func)(...paritalParams);
  if (typeof temp === "function") {
    return temp();
  }
  return temp;
}