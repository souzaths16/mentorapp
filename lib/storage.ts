import { SavedStory } from './types'

const STORAGE_KEY = 'conte-gael-stories'

export function getSavedStories(): SavedStory[] {
  if (typeof window === 'undefined') return []
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

export function saveStory(story: SavedStory): void {
  if (typeof window === 'undefined') return
  const stories = getSavedStories()
  const existing = stories.findIndex((s) => s.id === story.id)
  if (existing >= 0) {
    stories[existing] = story
  } else {
    stories.unshift(story)
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stories))
}

export function getStoryById(id: string): SavedStory | null {
  const stories = getSavedStories()
  return stories.find((s) => s.id === id) || null
}

export function toggleFavorite(id: string): void {
  const stories = getSavedStories()
  const story = stories.find((s) => s.id === id)
  if (story) {
    story.favorite = !story.favorite
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stories))
  }
}

export function deleteStory(id: string): void {
  const stories = getSavedStories().filter((s) => s.id !== id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stories))
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}
