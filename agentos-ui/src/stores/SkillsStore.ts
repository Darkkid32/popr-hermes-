import { create } from 'zustand'
import type { Skill } from '../lib/skills-data'

interface SkillsState {
  selectedSkill: Skill | null
  view: 'grid' | 'list'
  filter: { category: string; status: string; search: string }
  activeTab: string
  setSelectedSkill: (skill: Skill | null) => void
  setView: (view: 'grid' | 'list') => void
  setFilter: (filter: Partial<SkillsState['filter']>) => void
  setActiveTab: (tab: string) => void
  toggleSkill: (id: string) => void
}

export const useSkillsStore = create<SkillsState>((set) => ({
  selectedSkill: null,
  view: 'grid',
  filter: { category: 'all', status: 'all', search: '' },
  activeTab: 'overview',
  setSelectedSkill: (skill) => set({ selectedSkill: skill }),
  setView: (view) => set({ view }),
  setFilter: (filter) => set((s) => ({ filter: { ...s.filter, ...filter } })),
  setActiveTab: (tab) => set({ activeTab: tab }),
  toggleSkill: (id) => set((s) => ({
    selectedSkill: s.selectedSkill?.id === id
      ? { ...s.selectedSkill, status: s.selectedSkill.status === 'enabled' ? 'disabled' : 'enabled' }
      : s.selectedSkill
  })),
}))