let tableVals = null;

function generateIntegerArray(lowerLimit, upperLimit) {
    return Array.from({ length: upperLimit - lowerLimit + 1 }, (v, k) => k + lowerLimit);
}

function getRange(test, value) {
    if (value === '') return -1;

    console.log(test);
    

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

function findScalars(inputTests, table, tests, indexes, multipleIndexes) {
    let points = {};
    let sum = {};
    const errors = {
        empty: false,
        outOfRange: ''
    };

    indexes.forEach(element => {
        sum[element.code] = 0
    });

    tableVals = table;

    Object.keys(inputTests).every(test => {
        const range = getRange(test, inputTests[test], table);
        
        if (!range) errors.outOfRange = test;
        else if (range === -1) errors.empty = true;
        else {
            if (test === 'A') console.log(range);
            
            points[test] = table.data[test][range];
            let index = null

            const item = tests.find(value => test === value.code);
            if(multipleIndexes) {
                item[multipleIndexes].forEach(indexer => {
                    index = indexes.find(value => value.group === indexer);
                    sum[index.code] += points[test];
                })
            }
            else {
                index = indexes.find(value => item.group === value.group);
                if (indexes.length > 1) sum[index.code] += points[test];
            }
            if (multipleIndexes !== 'secondary') sum[indexes[indexes.length - 1].code] += points[test];
        }        
        return true
    });
    return { points, sum, errors }
}

export { findScalars }