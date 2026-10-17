# Laboratorio 09 – Introducción a Next.js (CSR y SSR)

Desarrollo de Aplicaciones Web Avanzado · Tecsup

Proyecto Next.js 16 (App Router, TypeScript, Tailwind CSS, Turbopack) que compara los modelos de renderizado **CSR** (Client-Side Rendering) y **SSR** (Server-Side Rendering).

## Páginas

| Ruta | Ejercicio | Renderizado |
|------|-----------|-------------|
| `/pokemon-csr` | 1.1 PokeApp | CSR: `'use client'` + `useState` + `useEffect` |
| `/pokemon-ssr` | 1.1 PokeApp | SSR: componente `async` del servidor |
| `/weather` | 2.1 Dashboard del clima | Híbrido: Lima por SSR, ciudades del mundo por CSR |
| `/movies` | Tarea: Galería de películas y series | Híbrido: populares por SSR, búsqueda y detalle por CSR |

## Galería de películas y series (OMDb)

- **Página principal – populares (SSR):** `app/movies/page.tsx` obtiene en el servidor 12 títulos populares con `Promise.all` y `async/await`. El HTML llega con los datos ya renderizados, lo que es mejor para SEO y para la primera carga, y la API key del servidor no se expone.
- **Búsqueda (CSR):** `app/movies/MovieExplorer.tsx` (`'use client'`) busca con `useState` y `useEffect`, espera 500 ms después de la última tecla (debounce), filtra por tipo y año, y pagina con "Cargar más". Se usa CSR porque depende de lo que escribe el usuario y debe responder sin recargar la página.
- **Detalle (CSR, ventana modal):** `app/movies/MovieModal.tsx` pide `?i={imdbID}&plot=full` cuando se selecciona una tarjeta y muestra la información completa (reparto, director, premios, ratings y taquilla). Se cierra con Escape, con ✕ o haciendo clic fuera.

## Ejecutar

```bash
npm install
cp .env.example .env.local   # coloca tu API key de https://www.omdbapi.com/apikey.aspx
npm run dev
```

Abrir http://localhost:3000

## Nota sobre Next.js 16

Next.js 16 activa *Cache Components* y no permite valores que cambian en cada petición, como `Math.random()` o un fetch sin caché, durante el prerender. En las páginas SSR se usa:

```ts
export const instant = false   // SSR clásico: el servidor espera los datos
await connection()              // renderizar en cada petición
```

Con `npm run build` se ve la diferencia: `/pokemon-csr` queda estática (○) y las páginas SSR quedan dinámicas (ƒ).
