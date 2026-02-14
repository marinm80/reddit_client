/**
 * Utility Functions para formatear datos de Reddit
 *
 * Estas funciones son "puras" - siempre devuelven el mismo resultado
 * con el mismo input, sin efectos secundarios.
 */

/**
 * Formatea un número de puntos/score a formato compacto
 *
 * Convierte números grandes en formato legible:
 * - Números menores a 1,000 → se muestran tal cual
 * - Números entre 1,000 y 999,999 → se muestran con "k" (miles)
 * - Números de 1,000,000 o más → se muestran con "M" (millones)
 *
 * @param score - Número de puntos (upvotes - downvotes)
 * @returns String formateado con sufijo k/M
 *
 * @example
 * formatScore(42)       // → "42"
 * formatScore(1234)     // → "1.2k"
 * formatScore(1567890)  // → "1.6M"
 */
export function formatScore(score: number): string {
    // Números menores a mil: mostrar tal cual
    if (score < 1000){
        return score.toString();
    }
    // Números entre 1k y 1M: dividir entre mil y agregar "k"
    else if (score >= 1000 && score < 1000000) {
        return (score / 1000).toFixed(1) + 'k';  // .toFixed(1) redondea a 1 decimal
    }
    // Números de 1M o más: dividir entre millón y agregar "M"
    else {
        return (score / 1000000).toFixed(1) + 'M';
    }
}

/**
 * Formatea un timestamp Unix a tiempo relativo ("hace X tiempo")
 *
 * IMPORTANTE: Reddit devuelve timestamps en SEGUNDOS, no milisegundos.
 * Date.now() devuelve milisegundos, por eso dividimos entre 1000.
 *
 * La función calcula cuánto tiempo ha pasado y devuelve un string legible.
 * Maneja singular/plural correctamente (1 hour vs 2 hours).
 *
 * @param unixTimestamp - Timestamp Unix en SEGUNDOS (created_utc de Reddit)
 * @returns String con tiempo relativo (ej: "2 hours ago", "just now")
 *
 * @example
 * const ahora = Date.now() / 1000;
 * formatTimestamp(ahora - 120)     // → "2 minutes ago"
 * formatTimestamp(ahora - 7200)    // → "2 hours ago"
 * formatTimestamp(ahora - 86400)   // → "1 day ago"
 */
export function formatTimestamp(unixTimestamp: number): string {
    // 1. Obtener timestamp actual en segundos (Date.now() da milisegundos)
    const now = Math.floor(Date.now() / 1000);

    // 2. Calcular cuántos segundos han pasado desde el post
    const secondsAgo = now - unixTimestamp;

    // 3. Definir constantes de tiempo en segundos
    const MINUTE = 60;                      // 60 segundos
    const HOUR = 60 * 60;                   // 3,600 segundos
    const DAY = 60 * 60 * 24;              // 86,400 segundos
    const WEEK = 60 * 60 * 24 * 7;         // 604,800 segundos
    const MONTH = 60 * 60 * 24 * 30;       // 2,592,000 segundos
    const YEAR = 60 * 60 * 24 * 365;       // 31,536,000 segundos

    // 4. Verificar rangos de tiempo (de mayor a menor)
    // IMPORTANTE: El orden es crucial - empezamos por el tiempo más largo

    // Años (≥ 365 días)
    if (secondsAgo >= YEAR) {
        const years = Math.floor(secondsAgo / YEAR);
        const label = years === 1 ? 'year' : 'years';  // Singular/plural
        return `${years} ${label} ago`;
    }

    // Meses (≥ 30 días)
    else if (secondsAgo >= MONTH) {
        const months = Math.floor(secondsAgo / MONTH);
        const label = months === 1 ? 'month' : 'months';
        return `${months} ${label} ago`;
    }

    // Semanas (≥ 7 días)
    else if (secondsAgo >= WEEK) {
        const weeks = Math.floor(secondsAgo / WEEK);
        const label = weeks === 1 ? 'week' : 'weeks';
        return `${weeks} ${label} ago`;
    }

    // Días (≥ 24 horas)
    else if (secondsAgo >= DAY) {
        const days = Math.floor(secondsAgo / DAY);
        const label = days === 1 ? 'day' : 'days';
        return `${days} ${label} ago`;
    }

    // Horas (≥ 60 minutos)
    else if (secondsAgo >= HOUR) {
        const hours = Math.floor(secondsAgo / HOUR);
        const label = hours === 1 ? 'hour' : 'hours';
        return `${hours} ${label} ago`;
    }

    // Minutos (≥ 60 segundos)
    else if (secondsAgo >= MINUTE) {
        const minutes = Math.floor(secondsAgo / MINUTE);
        const label = minutes === 1 ? 'minute' : 'minutes';
        return `${minutes} ${label} ago`;
    }

    // Menos de 1 minuto
    else {
        return 'just now';
    }
}

/**
 * CONCEPTOS CLAVE que se usan en este archivo:
 *
 * 1. FUNCIONES PURAS:
 *    - Mismo input = mismo output (deterministas)
 *    - Sin efectos secundarios (no modifican variables externas)
 *    - Fáciles de testear
 *
 * 2. TIMESTAMP UNIX:
 *    - Número de segundos desde 1 Enero 1970 UTC
 *    - Reddit usa segundos, JavaScript usa milisegundos
 *    - Por eso dividimos Date.now() entre 1000
 *
 * 3. MATH.FLOOR():
 *    - Redondea hacia abajo al entero más cercano
 *    - Ej: Math.floor(2.9) → 2
 *    - Usamos esto para obtener valores enteros (no queremos "2.5 hours ago")
 *
 * 4. TEMPLATE STRINGS:
 *    - Sintaxis: `texto ${variable} más texto`
 *    - Más legible que concatenación con +
 *    - Permite interpolación de variables
 *
 * 5. OPERADOR TERNARIO:
 *    - Sintaxis: condición ? valorSiTrue : valorSiFalse
 *    - Usado para singular/plural: value === 1 ? 'hour' : 'hours'
 */