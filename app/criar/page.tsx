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
      const exists = prev.find((a) => a.id === animal.id)
      if (exists) return prev.filter((a) => a.id !== animal.id)
      if (prev.length >= 3) return prev // max 3
      return [...prev, animal]
    })
  }

  function handleNext() {
    if (selected.length === 0) return
    sessionStorage.setItem('gael-animals', JSON.stringify(selected))
    router.push('/criar/local')
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#FFF8E7' }}>
      {/* Header */}
      <div className="px-5 pt-8 pb-4" style={{ background: 'linear-gradient(160deg, #A29BFE 0%, #FFF8E7 60%)' }}>
        <div className="flex items-center gap-3 mb-4">
          <Link href="/" className="w-9 h-9 bg-white/70 rounded-full flex items-center justify-center shadow text-lg">
            ←
          </Link>
          <StepIndicator current={1} />
        </div>
        <h2 className="font-display text-3xl font-bold text-gray-800">
          Escolha os Animais
        </h2>
        <p className="font-display text-xl text-purple-400 font-semibold">
          Tria els Animals
        </p>
        <p className="text-gray-500 text-sm mt-1">
          Escolha até 3 · Tria fins a 3
        </p>

        {/* Selected animals preview */}
        {selected.length > 0 && (
          <div className="flex gap-2 mt-3 flex-wrap">
            {selected.map((a) => (
              <button
                key={a.id}
                onClick={() => toggleAnimal(a)}
                className="flex items-center gap-1 bg-white rounded-full px-3 py-1.5 shadow-sm
                           border-2 border-purple-300 text-sm font-semibold text-gray-700
                           active:scale-95 transition-transform"
              >
                <span>{a.emoji}</span>
                <span>{a.namePt}</span>
                <span className="text-purple-400 ml-1">×</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Category tabs */}
      <div className="flex gap-2 px-4 py-3 overflow-x-auto no-scrollbar">
        {animalCategories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-2xl text-sm
                        font-semibold transition-all active:scale-95 border-2 ${
              activeCategory === cat.id
                ? 'bg-[#A29BFE] text-white border-[#A29BFE] shadow-md'
                : 'bg-white text-gray-600 border-gray-200'
            }`}
          >
            <span>{cat.emoji}</span>
            <span className="hidden sm:inline">{cat.namePt}</span>
          </button>
        ))}
      </div>

      {/* Category name */}
      <div className="px-5 mb-2">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{currentCategory.emoji}</span>
          <div>
            <p className="font-display text-xl font-bold text-gray-800">{currentCategory.namePt}</p>
            <p className="font-display text-sm text-purple-400">{currentCategory.nameCa}</p>
          </div>
        </div>
      </div>

      {/* Animals grid */}
      <div className="flex-1 px-4 pb-32 overflow-y-auto">
        <div className="grid grid-cols-3 gap-3">
          {currentCategory.animals.map((animal) => {
            const isSelected = selected.some((a) => a.id === animal.id)
            const isDisabled = !isSelected && selected.length >= 3
            return (
              <button
                key={animal.id}
                onClick={() => toggleAnimal(animal)}
                disabled={isDisabled}
                className={`animal-card relative flex flex-col items-center justify-center
                            p-3 rounded-2xl border-2 shadow-sm transition-all
                            ${isSelected
                              ? 'bg-purple-100 border-[#A29BFE] scale-95'
                              : isDisabled
                              ? 'bg-gray-100 border-gray-200 opacity-40'
                              : 'bg-white border-gray-200 active:scale-95'
                            }`}
              >
                {isSelected && (
                  <div className="absolute top-1.5 right-1.5 w-5 h-5 bg-[#A29BFE] rounded-full
                                  flex items-center justify-center text-white text-xs font-bold">
                    ✓
                  </div>
                )}
                <span className="text-4xl mb-1">{animal.emoji}</span>
                <p className="text-xs font-bold text-gray-700 text-center leading-tight">{animal.namePt}</p>
                <p className="text-xs text-purple-400 text-center leading-tight">{animal.nameCa}</p>
              </button>
            )
          })}
        </div>
      </div>

      {/* Next button */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md px-5 pb-8 pt-4
                      bg-gradient-to-t from-[#FFF8E7] via-[#FFF8E7]">
        <button
          onClick={handleNext}
          disabled={selected.length === 0}
          className={`w-full py-4 rounded-2xl font-display text-xl font-bold shadow-lg
                      transition-all active:scale-95 ${
            selected.length > 0
              ? 'bg-[#A29BFE] text-white'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          {selected.length === 0
            ? 'Escolha pelo menos 1 · Tria almenys 1'
            : `Próximo · Següent →`}
        </button>
      </div>
    </div>
  )
}

function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center gap-1.5">
      {[1, 2, 3].map((step) => (
        <div
          key={step}
          className={`rounded-full transition-all ${
            step === current
              ? 'w-8 h-3 bg-[#A29BFE]'
              : step < current
              ? 'w-3 h-3 bg-[#A29BFE]'
              : 'w-3 h-3 bg-gray-300'
          }`}
        />
      ))}
    </div>
  )
}
