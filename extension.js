executeAsync(function() {
    findAndReplaceDOMText(document.body, {
        find: new RegExp(/\d+/, 'g'),
        replace: replacer,
    });
});

function executeAsync(callback) {
    setTimeout(callback, 0);
}

function replacer(node, match) {
    let matchedString = match[0];
    let arabicNumber = parseInt(matchedString);
    return getRomanNumber(arabicNumber);
}

let romanNumberMemory = [];
function getRomanNumber(arabicNumber) {
    let alreadyConvertedNumber = romanNumberMemory.find(function (record) {
        return record.arabicNumber === arabicNumber;
    });
    if (alreadyConvertedNumber === undefined) {
        let romanNumber = convertArabicNumeralToRoman(arabicNumber);
        romanNumberMemory.push({
            arabicNumber: arabicNumber, romanNumber: romanNumber
        });
        return romanNumber;
    } else {
        return alreadyConvertedNumber.romanNumber;
    }
}

function convertArabicNumeralToRoman(arabicNumber) {
    let romanNumber = '';
    let romanNumerals = getRomanNumeralsWithOccurrencesWithoutSubtraction(arabicNumber);
    let arabicNumberCheck = arabicNumber;
    for (let i = 0; i < romanNumerals.length; i++) {
        let romanNumeral = romanNumerals[i];
        if (romanNumeral.occurrence === 0) {
            continue;
        }
        if (romanNumeral.occurrence === 4) {
            let higherRomanNumeral = getHigherRomanNumeralForSubtraction(i, romanNumerals, arabicNumberCheck);
            romanNumber += romanNumeral.symbol + higherRomanNumeral.symbol;
            arabicNumberCheck -= (higherRomanNumeral.value - romanNumeral.value);
        } else {
            for (let j = 1; j <= romanNumeral.occurrence; j++) {
                romanNumber += romanNumeral.symbol;
                arabicNumberCheck -= romanNumeral.value;
            }
        }
        if (arabicNumberCheck === 0) {
            break;
        }
    }
    return romanNumber;
}
function getRomanNumeralsWithOccurrencesWithoutSubtraction(arabicNumber) {
    let romanNumerals = [
        {symbol: "M", value: 1000},
        {symbol: "D", value: 500},
        {symbol: "C", value: 100},
        {symbol: "L", value: 50},
        {symbol: "X", value: 10},
        {symbol: "V", value: 5},
        {symbol: "I", value: 1}
    ];
    let romanNumeralsWithOccurrences = romanNumerals.map(function (romanNumeral) {
        let division = Math.floor(arabicNumber / romanNumeral.value);
        romanNumeral.occurrence = division;
        arabicNumber -= division * romanNumeral.value
        return romanNumeral;
    });
    if (arabicNumber !== 0) {
        console.log('ERROR, aranbicNumberCheck is not 0!');
    }
    return romanNumeralsWithOccurrences;
}

function getHigherRomanNumeralForSubtraction(offset, romanNumerals, arabicNumberCheck) {
    let higherRomanNumeral;
    do {
        higherRomanNumeral = romanNumerals[--offset];
    } while (higherRomanNumeral.value < arabicNumberCheck);
    return higherRomanNumeral;
}
