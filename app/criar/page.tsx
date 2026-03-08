'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { animalCategories } from '@/lib/data'
import { Animal } from '@/lib/types'

export default function ChooseAnimals() {
  const router = useRouter()
  const [selected, setSelected] = useState<Animal[]>([])
  const [activeCategory, setActiveCategory] = useState(animalCategories[0].id)

  const currentCategory = animalCategories.find((c) => c.id === activeCategory)!

  function toggleAnimal(animal: Animal) {
    setSelected((prev) => {
      if (prev.find((a) => a.id === animal.id)) return prev.filter((a) => a.id !== animal.id)
      if (prev.length >= 3) return prev
      return [...prev, animal]
    })
  }

  function handleNext() {
    if (selected.length === 0) return
    sessionStorage.setItem('gael-animals', JSON.stringify(selected))
    router.push('/criar/local')
  }

  return (
    <div className="min-h-screen flex flex-col page-enter" style={{ background: 'var(--cream)' }}>

      {/* Top bar */}
      <div className="flex items-center justify-between px-5 pt-8 pb-5">
        <Link href="/">
          <button
            className="w-10 h-10 rounded-2xl flex items-center justify-center text-base font-bold border"
            style={{ background: 'var(--card)', borderColor: 'var(--card-border)', color: 'var(--text)' }}
          >
            ←
          </button>
        </Link>
        <StepBar current={1} />
        <div
          className="w-10 h-10 rounded-2xl flex items-center justify-center text-sm font-black"
          style={{ background: 'var(--teal-light)', color: 'var(--teal)' }}
        >
          1/3
        </div>
      </div>

      {/* Title */}
      <div className="px-5 mb-4">
        <h2 className="text-3xl font-black" style={{ color: 'var(--text)' }}>
          Tria els personatges
        </h2>
        <p className="text-sm font-semibold mt-0.5" style={{ color: 'var(--text-muted)' }}>
          Escolha os personagens
        </p>
      </div>

      {/* Selected chips */}
      {selected.length > 0 && (
        <div className="flex gap-2 px-5 mb-3 flex-wrap">
          {selected.map((a) => (
            <button
              key={a.id}
              onClick={() => toggleAnimal(a)}
              className="flex items-center gap-1.5 text-sm font-bold px-3 py-1.5 rounded-full"
              style={{ background: 'var(--teal-light)', color: 'var(--teal)', border: '1.5px solid var(--teal)' }}
            >
              {a.emoji} {a.nameCa} <span className="ml-0.5 opacity-70">×</span>
            </button>
          ))}
        </div>
      )}

      {/* Category tabs */}
      <div className="flex gap-2 px-5 mb-4 overflow-x-auto no-scrollbar">
        {animalCategories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2.5 rounded-2xl text-sm font-bold transition-colors"
            style={
              activeCategory === cat.id
                ? { background: 'var(--blue-tab)', color: 'white' }
                : { background: 'var(--card)', color: 'var(--text)', border: '1.5px solid var(--card-border)' }
            }
          >
            {cat.emoji} {cat.nameCa}
          </button>
        ))}
      </div>

      {/* Animals grid */}
      <div className="flex-1 px-5 pb-32 overflow-y-auto">
        <div className="grid grid-cols-2 gap-3">
          {currentCategory.animals.map((animal) => {
            const isSelected = selected.some((a) => a.id === animal.id)
            const isDisabled = !isSelected && selected.length >= 3
            return (
              <button
                key={animal.id}
                onClick={() => toggleAnimal(animal)}
                disabled={isDisabled}
                className="card-press relative text-left p-4 rounded-3xl border"
                style={
                  isSelected
                    ? { background: 'var(--teal)', borderColor: 'var(--teal)' }
                    : isDisabled
                    ? { background: 'var(--card)', borderColor: 'var(--card-border)', opacity: 0.4 }
                    : { background: 'var(--card)', borderColor: 'var(--card-border)' }
                }
              >
                {isSelected && (
                  <div
                    className="absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{ background: 'rgba(255,255,255,0.3)', color: 'white' }}
                  >
                    ✓
                  </div>
                )}
                <div className="text-4xl mb-3">{animal.emoji}</div>
                <p
                  className="text-base font-black leading-tight"
                  style={{ color: isSelected ? 'white' : 'var(--text)' }}
                >
                  {animal.nameCa}
                </p>
                <p
                  className="text-sm font-medium mt-0.5"
                  style={{ color: isSelected ? 'rgba(255,255,255,0.8)' : 'var(--text-muted)' }}
                >
                  {animal.namePt}
                </p>
              </button>
            )
          })}
        </div>
      </div>

      {/* Next button */}
      <div
        className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md px-5 pb-8 pt-4"
        style={{ background: 'linear-gradient(to top, var(--cream) 70%, transparent)' }}
      >
        <button
          onClick={handleNext}
          disabled={selected.length === 0}
          className="w-full py-4 rounded-2xl font-black text-lg text-white transition-opacity flex items-center justify-center gap-2"
          style={{
            background: selected.length > 0 ? 'var(--teal)' : 'var(--card-border)',
            color: selected.length > 0 ? 'white' : 'var(--text-muted)',
          }}
        >
          Següent · Próximo →
        </button>
      </div>
    </div>
  )
}

function StepBar({ current }: { current: number }) {
  return (
    <div className="flex items-center gap-1.5 flex-1 mx-3">
      {[1, 2, 3].map((s) => (
        <div
          key={s}
          className="h-2 flex-1 rounded-full"
          style={{ background: s <= current ? 'var(--teal)' : 'var(--card-border)' }}
        />
      ))}
    </div>
  )
}
