const tests = [
    {
        code: 'C',
        name: 'Cubos',
        primaryEarly: 'Visoespacial',
        secondaryEarly: 'No verbal'
    },
    {
        code: 'I',
        name: 'Información',
        primaryEarly: 'Comprensión verbal',
        secondaryEarly: 'Capacidad general'
    },
    {
        code: 'M',
        name: 'Matrices',
        primaryLast: 'Razonamiento fluido',
        secondaryLast: 'No verbal'
    },
    {
        code: 'BA',
        name: 'Búsqueda de animales',
        primaryLast: 'Velocidad de procesamiento',
        secondaryLast: 'Competencia cognitiva'
    },
    {
        code: 'R',
        name: 'Reconocimiento',
        primaryEarly: 'Memoria de trabajo',
        secondaryEarly: 'No verbal'
    },
    {
        code: 'S',
        name: 'Semejanzas',
        primaryLast: 'Comprensión verbal',
        secondaryLast: 'Capacidad general'
    },
    {
        code: 'CON',
        name: 'Conceptos',
        primaryLast: 'Razonamiento fluido',
        secondaryLast: 'Capacidad general'
    },
    {
        code: 'CA',
        name: 'Cancelación',
        primaryLast: 'Velocidad de procesamiento',
        secondaryLast: 'Competencia cognitiva'
    },
    {
        code: 'L',
        name: 'Localización',
        primaryEarly: 'Memoria de trabajo',
        secondaryEarly: 'No verbal',
        secondaryLast: 'Competencia cognitiva'
    },
    {
        code: 'RO',
        name: 'Rompecabezas',
        primaryEarly: 'Visoespacial',
        secondaryEarly: 'Capacidad general'
    },
    {
        code: 'V',
        name: 'Vocabulario',
        primaryLast: 'Comprensión verbal',
        secondaryLast: 'Capacidad general'
    },
    {
        code: 'CF',
        name: 'Clave de figuras',
        primaryLast: 'Velocidad de procesamiento',
        secondaryLast: 'Competencia cognitiva'
    },
    {
        code: 'CO',
        name: 'Comprensión',
        primaryLast: 'Comprensión verbal',
        secondaryLast: 'Capacidad general'
    },
    {
        code: 'D',
        name: 'Dibujos',
        primaryEarly: 'Comprensión verbal',
        secondaryEarly: 'Capacidad general',
        secondaryLast: 'Adquisición de vocabulario'
    },
    {
        code: 'N',
        name: 'Nombres',
        primaryEarly: 'Comprensión verbal',
        secondaryEarly: 'Adquisición de vocabulario'
    },
]

const primaryIndexes = [
    {
        code: 'ICV',
        name: 'Índice de comprensión verbal',
        group: 'Comprensión verbal'
    },
    {
        code: 'IVE',
        name: 'Índice visoespacial',
        group: 'Visoespacial'
    },
    {
        code: 'IRF',
        name: 'Índice de razonamiento fluido',
        group: 'Razonamiento fluido',
        restriction: true
    },
    {
        code: 'IMT',
        name: 'Índice de memoria de trabajo',
        group: 'Memoria de trabajo'
    },
    {
        code: 'IVP',
        name: 'Índice de velocidad de procesamiento',
        group: 'Velocidad de procesamiento',
        restriction: true
    },
    {
        code: 'CIT',
        name: 'Coeficiente intelectual total',
        group: null
    }
]

const secondaryIndexes = [
    {
        code: 'IAV',
        name: 'Índice de adquisición de vocabulario',
        group: 'Adquisición de vocabulario'
    },
    {
        code: 'INV',
        name: 'Índice no verbal',
        group: 'No verbal'
    },
    {
        code: 'ICG',
        name: 'Índice de capacidad general',
        group: 'Capacidad general'
    },
    {
        code: 'ICC',
        name: 'Índice de competencia cognitiva',
        group: 'Competencia cognitiva',
        restriction: true,
    },
]

export{ tests, primaryIndexes, secondaryIndexes };