'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { themes } from '@/lib/data'
import { Theme } from '@/lib/types'

export default function ChooseTheme() {
  const router = useRouter()
  const [selected, setSelected] = useState<Theme | null>(null)

  useEffect(() => {
    if (!sessionStorage.getItem('gael-animals') || !sessionStorage.getItem('gael-location')) {
      router.replace('/criar')
    }
  }, [router])

  function handleGenerate() {
    if (!selected) return
    sessionStorage.setItem('gael-theme', JSON.stringify(selected))
    router.push('/criar/gerar')
  }

  return (
    <div className="min-h-screen flex flex-col page-enter" style={{ background: 'var(--cream)' }}>

      {/* Top bar */}
      <div className="flex items-center justify-between px-5 pt-8 pb-5">
        <Link href="/criar/local">
          <button
            className="w-10 h-10 rounded-2xl flex items-center justify-center text-base font-bold border"
            style={{ background: 'var(--card)', borderColor: 'var(--card-border)', color: 'var(--text)' }}
          >
            ←
          </button>
        </Link>
        <StepBar current={3} />
        <div
          className="w-10 h-10 rounded-2xl flex items-center justify-center text-sm font-black"
          style={{ background: 'var(--teal-light)', color: 'var(--teal)' }}
        >
          3/3
        </div>
      </div>

      {/* Title */}
      <div className="px-5 mb-5">
        <h2 className="text-3xl font-black" style={{ color: 'var(--text)' }}>
          Quin tema vols treballar?
        </h2>
        <p className="text-sm font-semibold mt-0.5" style={{ color: 'var(--text-muted)' }}>
          Qual tema você quer trabalhar?
        </p>
      </div>

      {/* Themes list */}
      <div className="flex-1 px-5 pb-32 overflow-y-auto">
        <div className="flex flex-col gap-3">
          {themes.map((theme) => {
            const isSelected = selected?.id === theme.id
            return (
              <button
                key={theme.id}
                onClick={() => setSelected(theme)}
                className="card-press flex items-center gap-4 p-4 rounded-3xl border text-left"
                style={
                  isSelected
                    ? { background: 'var(--teal)', borderColor: 'var(--teal)' }
                    : { background: 'var(--card)', borderColor: 'var(--card-border)' }
                }
              >
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
                  style={{ background: isSelected ? 'rgba(255,255,255,0.2)' : 'var(--peach)' }}
                >
                  {theme.emoji}
                </div>
                <div className="flex-1">
                  <p
                    className="font-black text-base leading-tight"
                    style={{ color: isSelected ? 'white' : 'var(--text)' }}
                  >
                    {theme.nameCa}
                  </p>
                  <p
                    className="text-sm font-semibold"
                    style={{ color: isSelected ? 'rgba(255,255,255,0.8)' : 'var(--text-muted)' }}
                  >
                    {theme.namePt}
                  </p>
                  <p
                    className="text-xs mt-0.5"
                    style={{ color: isSelected ? 'rgba(255,255,255,0.7)' : 'var(--text-muted)' }}
                  >
                    {theme.descCa} · {theme.descPt}
                  </p>
                </div>
                {isSelected && (
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                    style={{ background: 'rgba(255,255,255,0.25)', color: 'white' }}
                  >
                    ✓
                  </div>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Generate button */}
      <div
        className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md px-5 pb-8 pt-4"
        style={{ background: 'linear-gradient(to top, var(--cream) 70%, transparent)' }}
      >
        <button
          onClick={handleGenerate}
          disabled={!selected}
          className="w-full py-4 rounded-2xl font-black text-lg flex items-center justify-center gap-2"
          style={{
            background: selected ? 'var(--teal)' : 'var(--card-border)',
            color: selected ? 'white' : 'var(--text-muted)',
          }}
        >
          ✦ Crear Història · Criar História
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
