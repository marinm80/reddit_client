/**
 * Reddit API Type Definitions
 *
 * Estos tipos representan la estructura de datos que devuelve la API de Reddit.
 * Reddit API Reference: https://data365.co/blog/reddit-json-api
 */

/**
 * Representa un post individual de Reddit
 * En la API de Reddit, los posts tienen el prefijo "t3_" en su ID completo
 */
export interface RedditPost {
    // Identifiers
    id: string;                          // ID único del post (ej: "abc123")
    name: string;                        // ID completo con prefijo (ej: "t3_abc123")

    // Content
    title: string;                       // Título del post
    selftext?: string;                   // Texto del post (solo en self-posts, por eso es opcional)
    url: string;                         // URL del enlace o permalink
    permalink: string;                   // Permalink de Reddit (/r/subreddit/comments/...)

    // Metadata
    author: string;                      // Username del autor
    subreddit: string;                   // Nombre del subreddit sin prefijo (ej: "reactjs")
    subreddit_name_prefixed: string;     // Con prefijo "r/" (ej: "r/reactjs")

    // Statistics
    score: number;                       // Puntos netos (upvotes - downvotes)
    num_comments: number;                // Cantidad de comentarios

    // Timestamps
    created_utc: number;                 // Timestamp Unix en segundos (¡no milisegundos!)

    // Media
    thumbnail: string;                   // URL de thumbnail ("self", "default", o URL real)

    // Flags
    is_self: boolean;                    // true si es self-post (solo texto)
    over_18: boolean;                    // true si es NSFW
}

/**
 * Generic wrapper que usa Reddit para envolver cualquier tipo de dato
 * T puede ser RedditPost, RedditComment, etc.
 *
 * Ejemplo de uso:
 * RedditThing<RedditPost> = { kind: "t3", data: { id: "abc", title: "..." } }
 *
 * CONCEPTO CLAVE - Generics:
 * El <T> es un "placeholder" que se reemplaza con el tipo real al usarlo.
 * Esto nos permite reutilizar la misma interfaz para diferentes tipos de datos.
 */
export interface RedditThing<T> {
    kind: string;                        // Tipo de objeto: "t1"=comment, "t3"=post, "Listing"
    data: T;                             // Los datos reales (el tipo T se define al usarlo)
}

/**
 * Representa una lista de items devuelta por Reddit
 * Se usa para listados de posts, comentarios, etc.
 *
 * IMPORTANTE: Reddit pagina los resultados usando cursores (after/before)
 * en lugar de números de página tradicionales.
 */
export interface RedditListing {
    kind: 'Listing';                     // Siempre es "Listing" para listas
    data: {
        after: string | null;            // Cursor para siguiente página (null = última página)
        before: string | null;           // Cursor para página anterior
        children: Array<RedditThing<RedditPost>>; // Array de posts envueltos en RedditThing
    };
}

/**
 * Parámetros para buscar posts en un subreddit
 * Todos son opcionales excepto 'subreddit'
 *
 * Estos parámetros se pasan a RTK Query y se convierten en query params:
 * /r/{subreddit}/{sort}.json?limit={limit}&after={after}
 */
export interface GetPostsParams {
    subreddit: string;                   // Nombre del subreddit (ej: "popular", "reactjs")
    sort?: 'hot' | 'new' | 'top' | 'rising'; // Tipo de ordenamiento (default: "hot")
    limit?: number;                      // Cantidad de posts a devolver (max: 100, default: 25)
    after?: string;                      // Cursor de paginación (para cargar más posts)
}