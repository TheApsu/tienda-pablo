import { storeConfig } from '@/config/store.config'

export function Hero() {
  return (
    <section className="mb-8 overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 to-brand-800 px-6 py-12 text-white sm:px-10">
      <p className="text-sm font-medium uppercase tracking-widest text-brand-100">Bienvenido</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">{storeConfig.name}</h1>
      <p className="mt-3 max-w-xl text-brand-100">{storeConfig.slogan}</p>
    </section>
  )
}
