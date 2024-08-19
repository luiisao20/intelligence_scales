// Define los reemplazos para los tests WPPSI y WISC según las reglas

// {code} String del índice a evaluar
// {completed} Array de tests completados
// {uncompleted} Array de test no completados
// {points} Object de los puntos escalares

function selectReplacementsWPPSI(code, completed, uncompleted, points) {
    switch (code) {
        case 'INV':
            if (uncompleted.includes('C')) {
                if (completed.includes('RO')) return points['RO'];
                return false
            } else if (uncompleted.includes('R')) {
                if (completed.includes('L')) return points['L'];
                return false;
            } else if (uncompleted.includes('BA')) {
                if (completed.includes('CA')) return points['CA'];
                else if (completed.includes('CF')) return points['CF'];
                return false
            } else if (uncompleted.includes('M') || uncompleted.includes('CON')) return false
            return 0;
        case 'ICG':
            if (uncompleted.includes('I') || uncompleted.includes('S')) {
                if (completed.includes('V')) return points['V'];
                else if (completed.includes('CO')) return points['CO'];
                return false;
            } else if (uncompleted.includes('C')) {
                if (completed.includes('RO')) return points['RO'];
                return false
            } else if (uncompleted.includes('M')) {
                if (completed.includes('CON')) return points['CON'];
                return false
            }
            return 0;
        case 'ICC':
            if (uncompleted.includes('BA') || uncompleted.includes('CA')) {
                if (completed.includes('CF')) return points['CF'];
                return false
            } else if (uncompleted.includes('R') || uncompleted.includes('L')) return false
            return 0;
        case 'CIT': 
            if (uncompleted.includes('I') || uncompleted.includes('S')) {
                if (completed.includes('V')) return points['V'];
                else if (completed.includes('CO')) return points['CO'];
                return false;
            } else if (uncompleted.includes('C')) {
                if (completed.includes('RO')) return points['RO'];
                return false
            } else if (uncompleted.includes('M')) {
                if (completed.includes('CON')) return points['CON'];
                return false
            } else if (uncompleted.includes('R')) {
                if (completed.includes('L')) return points['L'];
                return false
            } else if (uncompleted.includes('BA')) {
                if (completed.includes('CA')) return points['CA'];
                else if (completed.includes('CF')) return points['CF'];
                return false;
            }
            return 0;
        case 'CIT1': 
            if (uncompleted.includes('D')) {
                if (completed.includes('N')) return points['N'];
                return false;
            } else if (uncompleted.includes('R')) {
                if (completed.includes('L')) return points['L'];
                return false;
            } else if (uncompleted.includes('C') || uncompleted.includes('I') || uncompleted.includes('RO')) return false;
            return 0;
        case 'ICG1': 
            if (uncompleted.includes('D')) {
                if (completed.includes('N')) return points['N'];
                return false
            } else if (uncompleted.includes('C') || uncompleted.includes('I') || uncompleted.includes('RO')) return false;
            return 0;
    }
}

function selectReplacementsWISC(code, completed, uncompleted, points) {
    switch (code) {
        case 'CIT':
            if (uncompleted.includes('S') || uncompleted.includes('V')) {
                if (completed.includes('I')) return points['I'];
                else if (completed.includes('CO')) return points['CO'];
                return false
            } else if (uncompleted.includes('C')) {
                if (completed.includes('PV')) return points['PV'];
                return false;
            } else if (uncompleted.includes('M') || uncompleted.includes('B')) {
                if (completed.includes('A')) return points['A'];
                return false;
            } else if (uncompleted.includes('D')) {
                if (completed.includes('SD')) return points['SP'];
                else if (completed.includes('LN')) return points['LN'];
                return false;
            } else if (uncompleted.includes('CL')) {
                if (completed.includes('BS')) return points['BS'];
                else if (completed.includes('CA')) return points['CA'];
                return false;
            }
            return 0
    }
}

export { selectReplacementsWPPSI, selectReplacementsWISC }