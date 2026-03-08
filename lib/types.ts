export interface Animal {
  id: string
  emoji: string
  namePt: string
  nameCa: string
}

export interface AnimalCategory {
  id: string
  emoji: string
  namePt: string
  nameCa: string
  animals: Animal[]
}

export interface Location {
  id: string
  emoji: string
  namePt: string
  nameCa: string
}

export interface Theme {
  id: string
  emoji: string
  namePt: string
  nameCa: string
  descPt: string
  descCa: string
}

export interface StorySection {
  pt: string
  ca: string
}

export interface StoryData {
  titlePt: string
  titleCa: string
  illustrationUrls: string[]
  sections: StorySection[]
}

export interface SavedStory {
  id: string
  createdAt: string
  animals: Animal[]
  location: Location
  theme: Theme
  story: StoryData
  favorite: boolean
  audioUrl?: string
}

export interface StoryConfig {
  animals: Animal[]
  location: Location
  theme: Theme
}
