const RUT = require("./RUTValidator");

describe("RUT validation tests", () => {
  describe("Format tests", () => {
    test("passing a non-string value should throw an Error", () => {
      expect(() => RUT.checkFormat(123)).toThrow(
        "RUT debe ser una cadena de caracteres"
      );
    });
    test("passing a value without correct format should throw an Error", () => {
      expect(() => RUT.checkFormat("18850004")).toThrow(
        "Formato de RUT incorrecto"
      );
      expect(() => RUT.checkFormat("188500BC4")).toThrow(
        "Formato de RUT incorrecto"
      );
      expect(() => RUT.checkFormat("18-850-004")).toThrow(
        "Formato de RUT incorrecto"
      );
      expect(() => RUT.checkFormat("188500-04")).toThrow(
        "Formato de RUT incorrecto"
      );
      expect(() => RUT.checkFormat("")).toThrow("Formato de RUT incorrecto");
    });
    test("passing a value with '-' should return true", () => {
      expect(RUT.checkFormat("11111111-1")).toBe(true);
    });
  });
  describe("Split tests", () => {
    test("passing a non-string value should throw an Error", () => {
      expect(() => RUT.split(123)).toThrow(
        "RUT debe ser una cadena de caracteres"
      );
    });
    test("passing a value without '-' should throw an Error", () => {
      expect(() => RUT.split("12345678")).toThrow(
        "RUT no pudo ser separado de forma correcta"
      );
    });
    test("passing a value with more than 2 '-' should throw an Error", () => {
      expect(() => RUT.split("12-3456-78")).toThrow(
        "RUT no pudo ser separado de forma correcta"
      );
    });
    test("passing a value with '-' should return an array of values", () => {
      const numbers = "11111111",
        validatorDigit = "1";
      const array = RUT.split(numbers + "-" + validatorDigit);
      expect(array.length).toBe(2);
      expect(array).toContain(numbers, validatorDigit);
    });
  });
  describe("Validator digit tests", () => {
    test("passing a string of non-numbers should throw an Error", () => {
      expect(() => RUT.getCorrectValidatorDigit("AS1234BA")).toThrow(
        "Deben ser números"
      );
    });
    test("passing a string of numbers should return the correct validator digit only", () => {
      const possibleValues = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, "k"];
      const testRUT = "18850004",
        correctTestValidatorDigit = 8;
      for (const value of possibleValues) {
        if (value === correctTestValidatorDigit)
          expect(RUT.getCorrectValidatorDigit(testRUT)).toBe(value);
        else expect(RUT.getCorrectValidatorDigit(testRUT)).not.toBe(value);
      }
    });
  });
  describe("Validation tests", () => {
    const validRUTs = [
      "19279675-k",
      "23374093-4",
      "22263402-4",
      "20923309-6",
      "8469031-7",
      "14429049-6",
      "23527331-4",
      "11172509-8",
      "9453749-5",
      "12008069-5",
    ];
    const invalidRUTs = [
      "19279675-2",
      "23374093-2",
      "22263402-2",
      "20923309-2",
      "8469031-2",
      "14429049-2",
      "23527331-2",
      "11172509-2",
      "9453749-2",
      "12008069-2",
    ];
    test("passing an RUT without correct format should return false", () => {
      expect(RUT.validate("18850004-M").isValid).toBe(false);
      expect(RUT.validate("I88S00Z4-8").isValid).toBe(false);
      expect(RUT.validate("188-50004-M").isValid).toBe(false);
      expect(RUT.validate("18850004K").isValid).toBe(false);
      expect(RUT.validate("").isValid).toBe(false);
    });
    test("passing an invalid RUT should return false", () => {
      for (const invalid of invalidRUTs) {
        expect(RUT.validate(invalid).isValid).toBe(false);
      }
    });
    test("passing a valid RUT should return true", () => {
      for (const valid of validRUTs) {
        expect(RUT.validate(valid).isValid).toBe(true);
      }
    });
  });
});
