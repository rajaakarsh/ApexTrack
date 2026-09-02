import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ChapterProgressStatus, ChapterResource, SyllabusChapter, SyllabusSubject, SyllabusUnit } from '../types';
import { JEE_SYLLABUS, getDefaultSyllabusForExam } from '../lib/defaultSyllabus';
import { generateId } from '../lib/utils';

interface SyllabusState {
  subjects: SyllabusSubject[];
  activeSubjectId: string;
  searchQuery: string;
  filterStatus: ChapterProgressStatus | 'all';

  // Actions
  loadExamSyllabus: (examName: string) => void;
  setActiveSubjectId: (id: string) => void;
  setSearchQuery: (query: string) => void;
  setFilterStatus: (status: ChapterProgressStatus | 'all') => void;
  
  // Chapter progress
  setChapterStatus: (subjectId: string, unitId: string, chapterId: string, status: ChapterProgressStatus) => void;
  importSyllabusProgress: (progressMap: Record<string, ChapterProgressStatus>) => void;
  updateChapterNotes: (subjectId: string, unitId: string, chapterId: string, notes: string) => void;
  
  // Resources
  addResource: (subjectId: string, unitId: string, chapterId: string, resource: Omit<ChapterResource, 'id'>) => void;
  deleteResource: (subjectId: string, unitId: string, chapterId: string, resourceId: string) => void;
  
  // Custom additions
  addCustomSubject: (name: string, color: string) => void;
  addCustomUnit: (subjectId: string, unitName: string) => void;
  addCustomChapter: (subjectId: string, unitId: string, chapterName: string, subtopics: string[]) => void;
  deleteChapter: (subjectId: string, unitId: string, chapterId: string) => void;
  
  // Calculations
  getOverallProgress: () => number;
  getSubjectProgress: (subjectId: string) => number;
}

export const useSyllabusStore = create<SyllabusState>()(
  persist(
    (set, get) => ({
      subjects: JEE_SYLLABUS,
      activeSubjectId: JEE_SYLLABUS[0].id,
      searchQuery: '',
      filterStatus: 'all',

      loadExamSyllabus: (examName) => {
        const defaultData = getDefaultSyllabusForExam(examName);
        set({
          subjects: defaultData,
          activeSubjectId: defaultData[0]?.id || '',
        });
      },

      setActiveSubjectId: (activeSubjectId) => set({ activeSubjectId }),
      setSearchQuery: (searchQuery) => set({ searchQuery }),
      setFilterStatus: (filterStatus) => set({ filterStatus }),

      setChapterStatus: (subjectId, unitId, chapterId, status) => {
        set((state) => ({
          subjects: state.subjects.map((subj) => {
            if (subj.id !== subjectId) return subj;
            return {
              ...subj,
              units: subj.units.map((unit) => {
                if (unit.id !== unitId) return unit;
                return {
                  ...unit,
                  chapters: unit.chapters.map((ch) => {
                    if (ch.id !== chapterId) return ch;
                    return {
                      ...ch,
                      status,
                      lastRevisedAt: status === 'revision' || status === 'completed' ? new Date().toISOString() : ch.lastRevisedAt,
                    };
                  }),
                };
              }),
            };
          }),
        }));
      },

      importSyllabusProgress: (progressMap) => {
        set((state) => ({
          subjects: state.subjects.map((subj) => ({
            ...subj,
            units: subj.units.map((unit) => ({
              ...unit,
              chapters: unit.chapters.map((ch) => {
                if (progressMap[ch.id]) {
                  return { ...ch, status: progressMap[ch.id] };
                }
                return ch;
              }),
            })),
          })),
        }));
      },

      updateChapterNotes: (subjectId, unitId, chapterId, notes) => {
        set((state) => ({
          subjects: state.subjects.map((subj) => {
            if (subj.id !== subjectId) return subj;
            return {
              ...subj,
              units: subj.units.map((unit) => {
                if (unit.id !== unitId) return unit;
                return {
                  ...unit,
                  chapters: unit.chapters.map((ch) => {
                    if (ch.id !== chapterId) return ch;
                    return { ...ch, notes };
                  }),
                };
              }),
            };
          }),
        }));
      },

      addResource: (subjectId, unitId, chapterId, resource) => {
        const newResource: ChapterResource = {
          ...resource,
          id: generateId(),
        };
        set((state) => ({
          subjects: state.subjects.map((subj) => {
            if (subj.id !== subjectId) return subj;
            return {
              ...subj,
              units: subj.units.map((unit) => {
                if (unit.id !== unitId) return unit;
                return {
                  ...unit,
                  chapters: unit.chapters.map((ch) => {
                    if (ch.id !== chapterId) return ch;
                    return {
                      ...ch,
                      resources: [...(ch.resources || []), newResource],
                    };
                  }),
                };
              }),
            };
          }),
        }));
      },

      deleteResource: (subjectId, unitId, chapterId, resourceId) => {
        set((state) => ({
          subjects: state.subjects.map((subj) => {
            if (subj.id !== subjectId) return subj;
            return {
              ...subj,
              units: subj.units.map((unit) => {
                if (unit.id !== unitId) return unit;
                return {
                  ...unit,
                  chapters: unit.chapters.map((ch) => {
                    if (ch.id !== chapterId) return ch;
                    return {
                      ...ch,
                      resources: (ch.resources || []).filter((r) => r.id !== resourceId),
                    };
                  }),
                };
              }),
            };
          }),
        }));
      },

      addCustomSubject: (name, color) => {
        const newSubject: SyllabusSubject = {
          id: generateId(),
          name,
          color,
          units: [],
        };
        set((state) => ({
          subjects: [...state.subjects, newSubject],
          activeSubjectId: newSubject.id,
        }));
      },

      addCustomUnit: (subjectId, unitName) => {
        const newUnit: SyllabusUnit = {
          id: generateId(),
          name: unitName,
          chapters: [],
        };
        set((state) => ({
          subjects: state.subjects.map((subj) =>
            subj.id === subjectId
              ? { ...subj, units: [...subj.units, newUnit] }
              : subj
          ),
        }));
      },

      addCustomChapter: (subjectId, unitId, chapterName, subtopics) => {
        const newChapter: SyllabusChapter = {
          id: generateId(),
          name: chapterName,
          status: 'not_started',
          subtopics,
          resources: [],
        };
        set((state) => ({
          subjects: state.subjects.map((subj) => {
            if (subj.id !== subjectId) return subj;
            return {
              ...subj,
              units: subj.units.map((unit) => {
                if (unit.id !== unitId) return unit;
                return {
                  ...unit,
                  chapters: [...unit.chapters, newChapter],
                };
              }),
            };
          }),
        }));
      },

      deleteChapter: (subjectId, unitId, chapterId) => {
        set((state) => ({
          subjects: state.subjects.map((subj) => {
            if (subj.id !== subjectId) return subj;
            return {
              ...subj,
              units: subj.units.map((unit) => {
                if (unit.id !== unitId) return unit;
                return {
                  ...unit,
                  chapters: unit.chapters.filter((ch) => ch.id !== chapterId),
                };
              }),
            };
          }),
        }));
      },

      getOverallProgress: () => {
        const { subjects } = get();
        let total = 0;
        let completed = 0;
        subjects.forEach((s) => {
          s.units.forEach((u) => {
            u.chapters.forEach((c) => {
              total++;
              if (c.status === 'completed') completed += 1;
              else if (c.status === 'revision') completed += 0.75;
              else if (c.status === 'learning') completed += 0.4;
            });
          });
        });
        return total > 0 ? Math.round((completed / total) * 100) : 0;
      },

      getSubjectProgress: (subjectId: string) => {
        const subject = get().subjects.find((s) => s.id === subjectId);
        if (!subject) return 0;
        let total = 0;
        let completed = 0;
        subject.units.forEach((u) => {
          u.chapters.forEach((c) => {
            total++;
            if (c.status === 'completed') completed += 1;
            else if (c.status === 'revision') completed += 0.75;
            else if (c.status === 'learning') completed += 0.4;
          });
        });
        return total > 0 ? Math.round((completed / total) * 100) : 0;
      },
    }),
    {
      name: 'apextrack-syllabus-store',
    }
  )
);
