import Link from 'next/link'

const pages = [
  { href: '/pokemon-csr', title: '🎮 Pokémon CSR', desc: 'Ejercicio 1.1 · Client-Side Rendering', color: 'from-blue-500 to-purple-600' },
  { href: '/pokemon-ssr', title: '⚡ Pokémon SSR', desc: 'Ejercicio 1.1 · Server-Side Rendering', color: 'from-green-500 to-teal-600' },
  { href: '/weather', title: '☁️ Dashboard del Clima', desc: 'Ejercicio 2.1 · Dashboard híbrido SSR + CSR', color: 'from-sky-400 to-indigo-600' },
  { href: '/movies', title: '🎬 Galería de Películas', desc: 'Tarea · OMDb con SSR + CSR', color: 'from-amber-400 to-rose-600' },
]

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 p-8 flex items-center">
      <div className="max-w-4xl mx-auto w-full">
        <h1 className="text-4xl font-extrabold text-white text-center">Laboratorio 09 · Introducción a Next.js</h1>
        <p className="text-slate-400 text-center mt-2">Modelos de renderizado CSR y SSR</p>
        <div className="grid sm:grid-cols-2 gap-5 mt-10">
          {pages.map((p) => (
            <Link
              key={p.href}
              href={p.href}
              className={`rounded-2xl p-6 bg-gradient-to-br ${p.color} shadow-xl hover:scale-[1.03] transition`}
            >
              <h2 className="text-2xl font-bold text-white">{p.title}</h2>
              <p className="text-white/80 mt-1">{p.desc}</p>
              <p className="text-white/60 text-sm mt-3">{p.href}</p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}
