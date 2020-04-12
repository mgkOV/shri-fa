/**
 * @file Домашка по FP ч. 2
 *
 * Подсказки:
 * Метод get у инстанса Api – каррированый
 * GET / https://animals.tech/{id}
 *
 * GET / https://api.tech/numbers/base
 * params:
 * – number [Int] – число
 * – from [Int] – из какой системы счисления
 * – to [Int] – в какую систему счисления
 *
 * Иногда промисы от API будут приходить в состояние rejected, (прямо как и API в реальной жизни)
 * Ответ будет приходить в поле {result}
 */
import Api from "../tools/api";
import * as R from "ramda";

const api = new Api();

const isLessThan10 = R.flip(R.lt)(10);
const isGreaterThan2 = R.flip(R.gt)(2);
const getLength = R.length;
const isLengthLessThen10 = R.compose(isLessThan10, getLength);
const isLengthGreaterThen2 = R.compose(isGreaterThan2, getLength);
const isPositive = R.flip(R.gt)(0);
const isDecimal = R.test(/^(\d*\.)?\d+$/);

const processSequence = async ({ value, writeLog, handleSuccess, handleError }) => {
  const writeLogTap = R.tap(writeLog);
  const handleValidationError = () => handleError("ValidationError");

  const validate = (value) => {
    const rules = R.allPass([isLengthLessThen10, isLengthGreaterThen2, isPositive, isDecimal]);
    return R.compose(rules, writeLogTap)(value);
  };

  const toInt = (number) => {
    return R.compose(writeLogTap, Math.round, Number)(number);
  };

  const convertNumberSystem = async (number) => {
    const { result } = await api.get("https://api.tech/numbers/base")({
      from: 10,
      to: 2,
      number
    });

    return writeLogTap(result);
  };

  const getLengthAsync = async (value) => {
    return R.compose(writeLogTap, getLength)(await value);
  };

  const square = async (number) => {
    const pow = R.compose(R.flip, R.curry)(Math.pow);

    return R.compose(writeLogTap, pow(2))(await number);
  };

  const modulo = async (number) => {
    return R.compose(writeLogTap, R.modulo(R.__, 3))(await number);
  };

  const getAnimal = async (id) => {
    const { result } = await api.get(`https://animals.tech/${await id}`)("name");
    return result;
  };

  const handleSuccessAsync = async (value) => {
    try {
      handleSuccess(await value);
    } catch (error) {
      handleError(error);
    }
  };

  const process = R.compose(
    handleSuccessAsync,
    getAnimal,
    modulo,
    square,
    getLengthAsync,
    convertNumberSystem,
    toInt
  );

  R.ifElse(validate, process, handleValidationError)(value);
};

export default processSequence;
