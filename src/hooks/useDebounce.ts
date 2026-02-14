import { useState, useEffect } from "react";

/**
 * Hook personalizado para aplicar debouncing a un valor.
 *
 * @template T - Tipo del valor a hacer debounce (puede ser string, number, object, etc.)
 * @param value - El valor que cambia frecuentemente (ej: input del usuario)
 * @param delay - Tiempo de espera en milisegundos antes de actualizar (default: 500ms)
 * @returns El valor debounced que solo se actualiza después del delay
 *
 * @example
 * ```tsx
 * const [searchTerm, setSearchTerm] = useState('');
 * const debouncedSearch = useDebounce(searchTerm, 500);
 *
 * // debouncedSearch solo se actualiza 500ms después de que el usuario deja de escribir
 * useSearchPostsQuery(debouncedSearch, { skip: debouncedSearch.length < 3 });
 * ```
 *
 * **Concepto clave: "Fiscal de Tránsito"**
 * - Imagina que cada tecla presionada es un auto pasando
 * - El fiscal (este hook) espera a que no pasen más autos por X tiempo
 * - Solo cuando pasa el tiempo sin tráfico, permite continuar
 * - Si pasa otro auto antes del tiempo, reinicia el cronómetro
 *
 * **Por qué es importante:**
 * - Evita hacer llamadas a la API por cada tecla presionada
 * - Mejora performance al reducir re-renders innecesarios
 * - Respeta los rate limits de las APIs (Reddit: ~10 req/min)
 * - Mejor UX: resultados no cambian constantemente mientras escribes
 */
export function useDebounce<T>(value: T, delay: number = 500): T {
    // Estado local que guardará el valor debounced
    // Este valor solo cambia después del delay, no en cada cambio de 'value'
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        // Crear un timer que actualizará debouncedValue después del delay
        // Esto es como el "fiscal" esperando a que no haya más tráfico
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        // Cleanup function: Se ejecuta cuando:
        // 1. El componente se desmonta, O
        // 2. 'value' o 'delay' cambian (antes de ejecutar el nuevo effect)
        //
        // Si 'value' cambia antes de que termine el delay, cancelamos el timer
        // anterior y creamos uno nuevo. Esto reinicia el cronómetro.
        // Es como cuando pasa otro auto y el fiscal reinicia su cuenta.
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]); // Re-ejecutar cuando value o delay cambien

    return debouncedValue;
}