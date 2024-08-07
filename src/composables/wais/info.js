const tests = [
    {
        code: 'C',
        name: 'Cubos',
        main: true,
        group: 'Escala razonamiento perceptivo',
    },
    {
        code: 'S',
        name: 'Semejanzas',
        main: true,
        group: 'Escala comprensión verbal',
    },
    {
        code: 'D',
        name: 'Dígitos',
        main: true,
        group: 'Escala memoria de trabajo',
    },
    {
        code: 'M',
        name: 'Matrices',
        main: true,
        group: 'Escala razonamiento perceptivo',
    },
    {
        code: 'V',
        name: 'Vocabulario',
        main: true,
        group: 'Escala comprensión verbal',
    },
    {
        code: 'A',
        name: 'Aritmética',
        main: true,
        group: 'Escala memoria de trabajo',
    },
    {
        code: 'BS',
        name: 'Búsqueda de símbolos',
        main: true,
        group: 'Escala velocidad de procesamiento',
    },
    {
        code: 'PV',
        name: 'Puzles visuales',
        main: true,
        group: 'Escala razonamiento perceptivo',
    },
    {
        code: 'I',
        name: 'Información',
        main: true,
        group: 'Escala comprensión verbal',
    },
    {
        code: 'CN',
        name: 'Clave de números',
        main: true,
        group: 'Escala velocidad de procesamiento',
    },
    {
        code: 'LN',
        name: 'Letras y números',
        restriction: true,
        // No apto para mayores de 70 años
        main: false,
        group: 'Escala memoria de trabajo',
    },
    {
        code: 'B',
        name: 'Balanzas',
        restriction: true,
        // No apto para mayores de 70 años
        main: false,
        group: 'Escala razonamiento perceptivo',
    },
    {
        code: 'CO',
        name: 'Comprensión',
        main: false,
        group: 'Escala comprensión verbal',
    },
    {
        code: 'CA',
        name: 'Cancelación',
        restriction: true,
        // No apto para mayores de 70 años
        main: false,
        group: 'Escala velocidad de procesamiento',
    },
    {
        code: 'FI',
        name: 'Figuras incompletas',
        main: false,
        group: 'Escala razonamiento perceptivo',
    }
]

const indexes = [
    {
        code: 'ICV',
        name: 'Índice de comprensión verbal',
        group: 'Escala comprensión verbal',
        nums: 3
    },
    {
        code: 'IRP',
        name: 'Índice de razonamiento perceptivo',
        group: 'Escala razonamiento perceptivo',
        nums: 3
    },
    {
        code: 'IMT',
        name: 'Índice de memoria de trabajo',
        group: 'Escala memoria de trabajo',
        nums: 2
    },
    {
        code: 'IVP',
        name: 'Índice de velocidad de procesamiento',
        group: 'Escala velocidad de procesamiento',
        nums: 2
    },
    {
        code: 'CIT',
        name: 'Coeficiente intelectual total',
        group: null
    }
]

export { tests, indexes };