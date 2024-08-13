let tableVals = null;

function generateIntegerArray(lowerLimit, upperLimit) {
    return Array.from({ length: upperLimit - lowerLimit + 1 }, (v, k) => k + lowerLimit);
}

function getRange(test, value) {
    if (value === '') return -1;

    for (let i = 0; i < Object.keys(tableVals.data[test]).length; i++) {
        const range = Object.keys(tableVals.data[test])[i];
        let arrayG = [];
        let valueModel = null;
        const inputValue = parseInt(value);

        if (range.includes('-')) {
            const lower = parseInt(range.split('-')[0]);
            const upper = parseInt(range.split('-')[1]);
            arrayG = generateIntegerArray(lower, upper);
            if (arrayG.includes(inputValue)) return range
        } else {
            valueModel = parseInt(range);
            if (valueModel === inputValue) return range
        }
    }
}

function findScalars(inputTests, table, tests, indexes) {
    let points = {};
    let sum = {};
    const errors = {
        empty: false,
        outOfRange: false
    };

    indexes.forEach(element => {
        sum[element.code] = 0
    });

    tableVals = table;

    Object.keys(inputTests).every(test => {
        const range = getRange(test, inputTests[test], table);
        
        if (!range) errors.outOfRange = true;
        else if (range === -1) errors.empty = true;
        else {
            points[test] = table.data[test][range];

            const item = tests.find(value => test === value.code);
            const index = indexes.find(value => item.group === value.group);
            
            if (indexes.length > 1) sum[index.code] += points[test];
            sum[indexes[indexes.length - 1].code] += points[test];
        }        
        return true
    });
    return { points, sum, errors }
}

export { findScalars }