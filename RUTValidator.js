function checkFormat(RUT) {
  if (typeof RUT !== "string")
    throw new Error("RUT debe ser una cadena de caracteres");
  if (!/^[0-9]+-[0-9kK]{1}$/.test(RUT))
    throw new Error("Formato de RUT incorrecto");
  return true;
}

function split(RUT) {
  if (typeof RUT !== "string")
    throw new Error("RUT debe ser una cadena de caracteres");
  const splittedRUT = RUT.toLowerCase().split("-");
  if (splittedRUT.length === 2) return splittedRUT;
  throw new Error("RUT no pudo ser separado de forma correcta");
}

function getCorrectValidatorDigit(numbers) {
  if (!/^[0-9]+$/.test(numbers)) throw new Error("Deben ser números");
  let parsedNumber = parseInt(numbers);
  let M = 0,
    S = 1;
  for (; parsedNumber; parsedNumber = Math.floor(parsedNumber / 10))
    S = (S + (parsedNumber % 10) * (9 - (M++ % 6))) % 11;
  return S ? S - 1 : "k";
}

function validate(RUT) {
  try {
    checkFormat(RUT);
    const [numbers, validatorDigit] = split(RUT);
    return getCorrectValidatorDigit(numbers) == validatorDigit
      ? { isValid: true, message: "RUT válido" }
      : { isValid: false, message: "RUT inválido" };
  } catch (error) {
    return { isValid: false, message: error.message };
  }
}

function RUTValidator(executionContext) {
  const eventSource = executionContext.getEventSource();
  const rutValidation = validate(eventSource.getValue());
  eventSource.controls.forEach((control) => {
    rutValidation.isValid
      ? control.clearNotification()
      : control.setNotification(rutValidation.message);
  });
}

//Jest set NODE_ENV to 'test' if it's not already set to something else. https://jestjs.io/docs/environment-variables
if (process.env.NODE_ENV !== "test") RUTValidator();

module.exports = {
  checkFormat,
  split,
  getCorrectValidatorDigit,
  validate,
};
