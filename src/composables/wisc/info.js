const tests = [
    {
        code: 'C',
        name: 'Cubos',
        primaryGroup: 'Visoespacial',
        secondaryGroup: ['No verbal', 'Capacidad general']
    },
    {
        code: 'S',
        name: 'Semejanzas',
        primaryGroup: 'Comprensión verbal',
        secondaryGroup: ['Capacidad general']
    },
    {
        code: 'M',
        name: 'Matrices',
        primaryGroup: 'Razonamiento fluido',
        secondaryGroup: ['Capacidad general', 'No verbal']
    },
    {
        code: 'D',
        name: 'Dígitos',
        primaryGroup: 'Memoria de trabajo',
        secondaryGroup: ['Memoria de trabajo auditiva', 'Competencia cognitiva']
    },
    {
        code: 'CL',
        name: 'Claves',
        primaryGroup: 'Velocidad de procesamiento',
        secondaryGroup: ['No verbal', 'Competencia cognitiva']
    },
    {
        code: 'V',
        name: 'Vocabulario',
        primaryGroup: 'Comprensión verbal',
        secondaryGroup: ['Capacidad general']
    },
    {
        code: 'B',
        name: 'Balanzas',
        primaryGroup: 'Razonamiento fluido',
        secondaryGroup: ['Razonamiento cuantitativo', 'No verbal', 'Capacidad general']
    },
    {
        code: 'PV',
        name: 'Puzles visuales',
        primaryGroup: 'Visoespacial',
        secondaryGroup: ['No verbal']
    },
    {
        code: 'SD',
        name: 'Span de dibujos',
        primaryGroup: 'Memoria de trabajo',
        secondaryGroup: ['No verbal', 'Competencia cognitiva']
    },
    {
        code: 'BS',
        name: 'Búsqueda de símbolos',
        primaryGroup: 'Velocidad de procesamiento',
        secondaryGroup: ['Competencia cognitiva']
    },
    {
        code: 'I',
        name: 'Información',
        primaryGroup: 'Comprensión verbal',
    },
    {
        code: 'LN',
        name: 'Letras y números',
        primaryGroup: 'Memoria de trabajo',
        secondaryGroup: ['Memoria de trabajo auditiva']
    },
    {
        code: 'CA',
        name: 'Cancelación',
        primaryGroup: 'Velocidad de procesamiento',
    },
    {
        code: 'CO',
        name: 'Comprensión',
        primaryGroup: 'Comprensión verbal',
    },
    {
        code: 'A',
        name: 'Aritmética',
        primaryGroup: 'Razonamiento fluido',
        secondaryGroup: ['Razonamiento cuantitativo']
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

const secondryIndexes = [
    {
        code: 'IRC',
        name: 'Índice de razonamiento cuantitativo',
        group: 'Razonamiento cuantitativo'
    },
    {
        code: 'IMTA',
        name: 'Índice de memoria de trabajo auditiva',
        group: 'Memoria de trabajo auditiva'
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
    }
]