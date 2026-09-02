import React, { useState } from 'react';
import {
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Plus,
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { useSyllabusStore } from '../store/useSyllabusStore';
import { useAuth } from '../context/AuthContext';
import { syllabusService } from '../services/syllabusService';
import { ChapterProgressStatus, ResourceType, SyllabusChapter } from '../types';
import { fireCelebrationConfetti } from '../components/ui/Confetti';

export const Syllabus: React.FC = () => {
  const { user, isGuest } = useAuth();
  const {
    subjects,
    activeSubjectId,
    setActiveSubjectId,
    setChapterStatus,
    addResource,
    getSubjectProgress,
    getOverallProgress,
  } = useSyllabusStore();

  const [expandedUnits, setExpandedUnits] = useState<Record<string, boolean>>({});
  const [resourceModalOpen, setResourceModalOpen] = useState(false);
  const [selectedChapter, setSelectedChapter] = useState<{
    unitId: string;
    chapter: SyllabusChapter;
  } | null>(null);

  // New Resource Form
  const [resourceTitle, setResourceTitle] = useState('');
  const [resourceType, setResourceType] = useState<ResourceType>('notes');
  const [resourceUrl, setResourceUrl] = useState('');

  const currentSubject =
    subjects.find((s) => s.id === activeSubjectId) || subjects[0];

  const toggleUnit = (unitId: string) => {
    setExpandedUnits((prev) => ({
      ...prev,
      [unitId]: !prev[unitId],
    }));
  };

  const handleStatusChange = async (unitId: string, chapterId: string, status: ChapterProgressStatus) => {
    setChapterStatus(currentSubject.id, unitId, chapterId, status);
    if (status === 'completed') {
      fireCelebrationConfetti();
    }
    if (user && !isGuest) {
      await syllabusService.saveChapterStatus(user.id, chapterId, status);
    }
  };

  const handleOpenResourceModal = (unitId: string, chapter: SyllabusChapter) => {
    setSelectedChapter({ unitId, chapter });
    setResourceTitle('');
    setResourceType('notes');
    setResourceUrl('');
    setResourceModalOpen(true);
  };

  const handleAddResource = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedChapter || !resourceTitle.trim()) return;

    addResource(currentSubject.id, selectedChapter.unitId, selectedChapter.chapter.id, {
      title: resourceTitle,
      type: resourceType,
      url: resourceUrl || undefined,
    });

    setResourceModalOpen(false);
  };

  const statusMap = {
    not_started: { label: 'Not Started', class: 'bg-zinc-800 text-zinc-500 border-zinc-700/50' },
    learning: { label: 'Learning', class: 'bg-sky-500/10 text-sky-400 border-sky-500/20' },
    revision: { label: 'Revision', class: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
    completed: { label: 'Completed', class: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800/80 pb-5">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-zinc-100">Syllabus Tracker</h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            4-Tier preparation coverage • {getOverallProgress()}% Overall Completion
          </p>
        </div>

        {/* Subject Switcher Pills */}
        <div className="flex items-center gap-1.5 p-1 rounded-lg bg-zinc-900 border border-zinc-800 overflow-x-auto">
          {subjects.map((s) => {
            const isActive = s.id === currentSubject.id;
            const prog = getSubjectProgress(s.id);
            return (
              <button
                key={s.id}
                onClick={() => setActiveSubjectId(s.id)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-zinc-800 text-zinc-100 shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <span>{s.name}</span>
                <span className="text-[10px] font-mono text-zinc-500">{prog}%</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Units & Chapters Accordions */}
      <div className="space-y-4">
        {currentSubject.units.map((unit) => {
          const isExpanded = expandedUnits[unit.id] !== false; // default expanded
          const completedCount = unit.chapters.filter((c) => c.status === 'completed').length;
          const unitPct = Math.round((completedCount / unit.chapters.length) * 100) || 0;

          return (
            <div
              key={unit.id}
              className="rounded-xl bg-[#111111] border border-zinc-800/80 overflow-hidden"
            >
              {/* Unit Header */}
              <div
                onClick={() => toggleUnit(unit.id)}
                className="p-4 flex items-center justify-between cursor-pointer hover:bg-zinc-900/40 transition-colors select-none"
              >
                <div className="flex items-center gap-2.5">
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4 text-zinc-400" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-zinc-400" />
                  )}
                  <h3 className="text-xs font-semibold text-zinc-200">{unit.name}</h3>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[11px] font-mono text-zinc-500">
                    {completedCount} / {unit.chapters.length} ({unitPct}%)
                  </span>
                </div>
              </div>

              {/* Chapters List */}
              {isExpanded && (
                <div className="border-t border-zinc-800/60 divide-y divide-zinc-800/40">
                  {unit.chapters.map((chapter) => (
                    <div
                      key={chapter.id}
                      className="p-4 pl-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-zinc-900/30 transition-colors"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-zinc-200">{chapter.name}</span>
                        </div>

                        {chapter.subtopics && chapter.subtopics.length > 0 && (
                          <div className="flex flex-wrap gap-1 pt-1">
                            {chapter.subtopics.map((st, idx) => (
                              <span
                                key={idx}
                                className="text-[10px] px-1.5 py-0.2 rounded bg-zinc-900 border border-zinc-800 text-zinc-400"
                              >
                                {st}
                              </span>
                            ))}
                          </div>
                        )}

                        {chapter.resources && chapter.resources.length > 0 && (
                          <div className="flex items-center gap-2 pt-1 text-[11px] text-zinc-400">
                            {chapter.resources.map((res) => (
                              <a
                                key={res.id}
                                href={res.url || '#'}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 hover:text-zinc-200 underline decoration-zinc-700"
                              >
                                <ExternalLink className="w-3 h-3" />
                                <span>{res.title}</span>
                              </a>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Status Selector & Resource Action */}
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <select
                          value={chapter.status}
                          onChange={(e) =>
                            handleStatusChange(unit.id, chapter.id, e.target.value as ChapterProgressStatus)
                          }
                          className={`h-7.5 text-[11px] font-medium rounded-lg px-2.5 border focus:outline-none transition-colors ${
                            statusMap[chapter.status].class
                          }`}
                        >
                          <option value="not_started">Not Started</option>
                          <option value="learning">Learning</option>
                          <option value="revision">Revision</option>
                          <option value="completed">Completed ✓</option>
                        </select>

                        <button
                          type="button"
                          onClick={() => handleOpenResourceModal(unit.id, chapter)}
                          className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
                          title="Attach Resource"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Resource Modal */}
      <Modal
        isOpen={resourceModalOpen}
        onClose={() => setResourceModalOpen(false)}
        title="Attach Reference Resource"
        description={selectedChapter?.chapter.name}
      >
        <form onSubmit={handleAddResource} className="space-y-4 pt-1">
          <Input
            label="Resource Title"
            placeholder="e.g. HC Verma Chapter 3 Solutions"
            value={resourceTitle}
            onChange={(e) => setResourceTitle(e.target.value)}
            required
          />

          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1.5">Resource Type</label>
            <select
              value={resourceType}
              onChange={(e) => setResourceType(e.target.value as ResourceType)}
              className="w-full h-9 bg-zinc-900 border border-zinc-800 rounded-lg px-3 text-xs text-zinc-100 focus:outline-none focus:border-zinc-600 transition-colors"
            >
              <option value="notes">Notes PDF</option>
              <option value="book">Reference Book</option>
              <option value="video">Lecture Video</option>
              <option value="website">Web Link</option>
            </select>
          </div>

          <Input
            label="Resource Link URL (Optional)"
            placeholder="https://..."
            type="url"
            value={resourceUrl}
            onChange={(e) => setResourceUrl(e.target.value)}
          />

          <div className="flex justify-end gap-2 pt-2 border-t border-zinc-800">
            <Button variant="ghost" type="button" onClick={() => setResourceModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Save Resource
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
