/**
 * @file Домашка по FP ч. 1
 *
 * Основная задача — написать самому, или найти в FP библиотеках функции anyPass/allPass
 * Эти функции/их аналоги есть и в ramda и в lodash
 *
 * allPass — принимает массив функций-предикатов, и возвращает функцию-предикат, которая
 * вернет true для заданного списка аргументов, если каждый из предоставленных предикатов
 * удовлетворяет этим аргументам (возвращает true)
 *
 * anyPass — то же самое, только удовлетворять значению может единственная функция-предикат из массива.
 *
 * Если какие либо функции написаны руками (без использования библиотек) это не является ошибкой
 */

import * as R from "ramda";

const isRed = (idx) => (arr) => R.equals(arr[idx], "red");
const isGreen = (idx) => (arr) => R.equals(arr[idx], "green");
const isWhite = (idx) => (arr) => R.equals(arr[idx], "white");
const isOrange = (idx) => (arr) => R.equals(arr[idx], "orange");
const isBlue = (idx) => (arr) => R.equals(arr[idx], "blue");
const count = R.countBy((i) => i);
const equal4 = R.equals(4);

// 1. Красная звезда, зеленый квадрат, все остальные белые.
export const validateFieldN1 = ({ star, square, triangle, circle }) => {
  return R.allPass([isRed(0), isGreen(1), isWhite(2), isWhite(3)])([
    star,
    square,
    triangle,
    circle
  ]);
};

// 2. Как минимум две фигуры зеленые.
export const validateFieldN2 = ({ star, square, triangle, circle }) => {
  const hasGreen = (value) => (items) => R.indexOf(value, items) !== -1;
  const hasMany = (value) => (items) => R.indexOf(value, items) !== R.lastIndexOf(value, items);

  return R.allPass([hasGreen("green"), hasMany("green")])([star, square, triangle, circle]);
};

// 3. Количество красных фигур равно кол-ву синих.
export const validateFieldN3 = ({ star, square, triangle, circle }) => {
  const equalNum = (...args) => {
    const nums = R.countBy((i) => i)([...args]);

    return R.equals(nums.red, nums.blue);
  };

  // если 0 тоже true
  return equalNum(star, square, triangle, circle);
};

// 4. Синий круг, красная звезда, оранжевый квадрат
export const validateFieldN4 = ({ star, square, circle }) => {
  return R.allPass([isRed(0), isOrange(1), isBlue(2)])([star, square, circle]);
};

// 5. Три фигуры одного любого цвета кроме белого (четыре фигуры одного цвета – это тоже true).
export const validateFieldN5 = ({ star, square, triangle, circle }) => {
  const gte3 = R.flip(R.gte)(3);

  const anyGte3 = R.any(gte3);
  const lt3 = R.flip(R.lt)(3);
  const hasThreeSameColorForms = R.compose(anyGte3, R.values, count);
  const escUndefined = (value) => (value === undefined ? 0 : value);
  const hasNot3White = R.compose(lt3, escUndefined, R.prop("white"), count);

  return R.allPass([hasThreeSameColorForms, hasNot3White])([star, square, triangle, circle]);
};

// 6. Две зеленые фигуры (одна из них треугольник), еще одна любая красная.
export const validateFieldN6 = ({ star, square, triangle, circle }) => {
  const equal2 = R.equals(2);
  const isGreenEqual2 = R.compose(equal2, R.prop("green"), count);

  return R.allPass([isGreen(2), isGreenEqual2])([star, square, triangle, circle]);
};

// 7. Все фигуры оранжевые.
export const validateFieldN7 = ({ star, square, triangle, circle }) => {
  return R.compose(equal4, R.prop("orange"), count)([star, square, triangle, circle]);
};

// 8. Не красная и не белая звезда.
export const validateFieldN8 = ({ star, square, triangle, circle }) => {
  const notRed = R.compose(R.not, R.equals("red"));
  const notWhite = R.compose(R.not, R.equals("white"));

  return R.allPass([notRed, notWhite])(star);
};

// 9. Все фигуры зеленые.
export const validateFieldN9 = ({ star, square, triangle, circle }) => {
  return R.compose(equal4, R.prop("green"), count)([star, square, triangle, circle]);
};

// 10. Треугольник и квадрат одного цвета (не белого)
export const validateFieldN10 = ({ square, triangle }) => {
  const notWhite = (item) => R.compose(R.not, R.equals("white"))(item);
  return R.allPass([R.equals, notWhite])(square, triangle);
};
