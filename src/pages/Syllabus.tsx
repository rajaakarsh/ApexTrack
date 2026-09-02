import React, { useState } from 'react';
import {
  BookOpen,
  Plus,
  Search,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Link as LinkIcon,
  ExternalLink,
  Book,
  FileText,
  Video,
  Globe,
  Trash2,
  Sparkles,
  Layers,
} from 'lucide-react';
import { Card, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input, Textarea } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { ProgressRing } from '../components/ui/ProgressRing';
import { useSyllabusStore } from '../store/useSyllabusStore';
import { ChapterProgressStatus, ChapterResource, ResourceType, SyllabusChapter, SyllabusUnit } from '../types';
import { fireCelebrationConfetti } from '../components/ui/Confetti';

export const Syllabus: React.FC = () => {
  const {
    subjects,
    activeSubjectId,
    setActiveSubjectId,
    searchQuery,
    setSearchQuery,
    setChapterStatus,
    addResource,
    deleteResource,
    addCustomSubject,
    addCustomUnit,
    addCustomChapter,
    deleteChapter,
    getOverallProgress,
    getSubjectProgress,
  } = useSyllabusStore();

  const [expandedUnits, setExpandedUnits] = useState<Record<string, boolean>>({});
  const [resourceModalOpen, setResourceModalOpen] = useState(false);
  const [selectedChapterForResource, setSelectedChapterForResource] = useState<{
    subjectId: string;
    unitId: string;
    chapterId: string;
    chapterName: string;
  } | null>(null);

  // New Resource Form
  const [resTitle, setResTitle] = useState('');
  const [resType, setResType] = useState<ResourceType>('book');
  const [resUrl, setResUrl] = useState('');

  // Custom addition modals
  const [addChapterModalOpen, setAddChapterModalOpen] = useState(false);
  const [selectedUnitForChapter, setSelectedUnitForChapter] = useState<string>('');
  const [newChapterName, setNewChapterName] = useState('');
  const [newSubtopics, setNewSubtopics] = useState('');

  const activeSubject = subjects.find((s) => s.id === activeSubjectId) || subjects[0];
  const overallProgress = getOverallProgress();

  const toggleUnit = (unitId: string) => {
    setExpandedUnits((prev) => ({
      ...prev,
      [unitId]: prev[unitId] === undefined ? false : !prev[unitId],
    }));
  };

  const handleStatusChange = (
    subjectId: string,
    unitId: string,
    chapterId: string,
    newStatus: ChapterProgressStatus
  ) => {
    setChapterStatus(subjectId, unitId, chapterId, newStatus);
    if (newStatus === 'completed') {
      fireCelebrationConfetti();
    }
  };

  const handleOpenResourceModal = (subjectId: string, unitId: string, ch: SyllabusChapter) => {
    setSelectedChapterForResource({
      subjectId,
      unitId,
      chapterId: ch.id,
      chapterName: ch.name,
    });
    setResTitle('');
    setResType('book');
    setResUrl('');
    setResourceModalOpen(true);
  };

  const handleSaveResource = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resTitle.trim() || !selectedChapterForResource) return;

    addResource(
      selectedChapterForResource.subjectId,
      selectedChapterForResource.unitId,
      selectedChapterForResource.chapterId,
      {
        title: resTitle.trim(),
        type: resType,
        url: resUrl.trim() || undefined,
      }
    );

    setResourceModalOpen(false);
  };

  const handleSaveCustomChapter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChapterName.trim() || !activeSubject || !selectedUnitForChapter) return;

    const subtopicsList = newSubtopics
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    addCustomChapter(activeSubject.id, selectedUnitForChapter, newChapterName.trim(), subtopicsList);
    setNewChapterName('');
    setNewSubtopics('');
    setAddChapterModalOpen(false);
  };

  const statusConfig: Record<
    ChapterProgressStatus,
    { label: string; color: string; bg: string; border: string }
  > = {
    not_started: { label: 'Not Started', color: 'text-slate-400', bg: 'bg-slate-800', border: 'border-slate-700' },
    learning: { label: 'Learning In-Progress', color: 'text-amber-400', bg: 'bg-amber-500/15', border: 'border-amber-500/30' },
    revision: { label: 'Revision Phase', color: 'text-sky-400', bg: 'bg-sky-500/15', border: 'border-sky-500/30' },
    completed: { label: 'Mastered & Completed', color: 'text-emerald-400', bg: 'bg-emerald-500/15', border: 'border-emerald-500/30' },
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-100 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-brand-400" />
            Hierarchical Syllabus Tracker
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Subject → Unit → Chapter → Subtopic progress states with linked learning materials.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs">
            <span className="text-slate-400">Total Exam Readiness:</span>
            <span className="font-mono font-bold text-brand-400">{overallProgress}%</span>
          </div>
        </div>
      </div>

      {/* Subject Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-3">
        {subjects.map((subj) => {
          const isActive = subj.id === activeSubject?.id;
          const prog = getSubjectProgress(subj.id);
          return (
            <button
              key={subj.id}
              onClick={() => setActiveSubjectId(subj.id)}
              className={`flex items-center gap-2.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                isActive
                  ? 'bg-brand-500 text-slate-950 shadow-glow-sm'
                  : 'bg-slate-900 border border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
            >
              <span>{subj.name}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  isActive ? 'bg-slate-950/20 text-slate-950' : 'bg-slate-800 text-slate-400'
                }`}
              >
                {prog}%
              </span>
            </button>
          );
        })}
      </div>

      {/* Active Subject Units & Chapters Accordion */}
      {activeSubject && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-slate-100 uppercase tracking-wider flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: activeSubject.color || '#10b981' }} />
              {activeSubject.name} Units & Chapters
            </h3>
            <span className="text-xs text-slate-400 font-mono">
              {activeSubject.units.reduce((a, u) => a + u.chapters.length, 0)} Total Chapters
            </span>
          </div>

          <div className="space-y-3">
            {activeSubject.units.map((unit) => {
              const isExpanded = expandedUnits[unit.id] !== false; // expanded by default
              const unitCompleted = unit.chapters.filter((c) => c.status === 'completed').length;
              const unitPct =
                unit.chapters.length > 0
                  ? Math.round((unitCompleted / unit.chapters.length) * 100)
                  : 0;

              return (
                <div
                  key={unit.id}
                  className="rounded-2xl bg-slate-900/80 border border-slate-800 overflow-hidden shadow-glass"
                >
                  {/* Unit Accordion Header */}
                  <div
                    onClick={() => toggleUnit(unit.id)}
                    className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-800/40 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      {isExpanded ? (
                        <ChevronDown className="w-4 h-4 text-slate-400" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-slate-400" />
                      )}
                      <div>
                        <h4 className="text-sm font-bold text-slate-100">{unit.name}</h4>
                        <span className="text-[11px] text-slate-400">
                          {unitCompleted} of {unit.chapters.length} chapters completed ({unitPct}%)
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-24 bg-slate-800 rounded-full h-2 hidden sm:block">
                        <div
                          className="bg-brand-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${unitPct}%` }}
                        />
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedUnitForChapter(unit.id);
                          setAddChapterModalOpen(true);
                        }}
                        className="p-1 rounded text-slate-400 hover:text-slate-100"
                        title="Add chapter to unit"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Chapters List */}
                  {isExpanded && (
                    <div className="p-4 pt-0 space-y-3 divide-y divide-slate-800/60">
                      {unit.chapters.map((chapter) => {
                        const status = statusConfig[chapter.status];
                        return (
                          <div
                            key={chapter.id}
                            className="pt-3 first:pt-0 flex flex-col md:flex-row md:items-center justify-between gap-3"
                          >
                            <div className="space-y-1.5 flex-1">
                              <div className="flex items-center gap-2">
                                <h5 className="text-xs font-bold text-slate-100">{chapter.name}</h5>
                                <span
                                  className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold ${status.bg} ${status.color} border ${status.border}`}
                                >
                                  {status.label}
                                </span>
                              </div>

                              {/* Subtopics Pills */}
                              {chapter.subtopics && chapter.subtopics.length > 0 && (
                                <div className="flex flex-wrap items-center gap-1.5">
                                  {chapter.subtopics.map((sub, idx) => (
                                    <span
                                      key={idx}
                                      className="text-[10px] px-2 py-0.5 rounded-md bg-slate-950 border border-slate-800 text-slate-400"
                                    >
                                      {sub}
                                    </span>
                                  ))}
                                </div>
                              )}

                              {/* Linked Resources */}
                              {chapter.resources && chapter.resources.length > 0 && (
                                <div className="flex flex-wrap items-center gap-2 pt-1">
                                  {chapter.resources.map((res) => (
                                    <div
                                      key={res.id}
                                      className="inline-flex items-center gap-1.5 text-[10px] px-2 py-0.5 rounded-md bg-brand-500/10 border border-brand-500/30 text-brand-300"
                                    >
                                      {res.type === 'book' ? (
                                        <Book className="w-3 h-3" />
                                      ) : res.type === 'video' ? (
                                        <Video className="w-3 h-3" />
                                      ) : (
                                        <FileText className="w-3 h-3" />
                                      )}
                                      <span>{res.title}</span>
                                      {res.url && (
                                        <a
                                          href={res.url}
                                          target="_blank"
                                          rel="noreferrer"
                                          className="text-brand-400 hover:text-brand-200"
                                        >
                                          <ExternalLink className="w-2.5 h-2.5" />
                                        </a>
                                      )}
                                      <button
                                        onClick={() =>
                                          deleteResource(activeSubject.id, unit.id, chapter.id, res.id)
                                        }
                                        className="text-slate-500 hover:text-rose-400 ml-1"
                                      >
                                        ×
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>

                            {/* Status Changer & Resource Buttons */}
                            <div className="flex items-center gap-2 flex-shrink-0">
                              <select
                                value={chapter.status}
                                onChange={(e) =>
                                  handleStatusChange(
                                    activeSubject.id,
                                    unit.id,
                                    chapter.id,
                                    e.target.value as ChapterProgressStatus
                                  )
                                }
                                className="bg-slate-900 border border-slate-700/80 rounded-xl px-2.5 py-1.5 text-xs text-slate-100 font-semibold focus:outline-none focus:border-brand-500"
                              >
                                <option value="not_started">Not Started</option>
                                <option value="learning">Learning</option>
                                <option value="revision">Revision</option>
                                <option value="completed">Completed ✓</option>
                              </select>

                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleOpenResourceModal(activeSubject.id, unit.id, chapter)}
                                className="text-[11px] h-8 px-2.5 gap-1"
                              >
                                <Plus className="w-3 h-3" /> Resource
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Modal: Add Resource */}
      <Modal
        isOpen={resourceModalOpen}
        onClose={() => setResourceModalOpen(false)}
        title={`Add Study Material / Resource`}
        description={`Linking resource to: ${selectedChapterForResource?.chapterName}`}
      >
        <form onSubmit={handleSaveResource} className="space-y-4 pt-1">
          <Input
            label="Resource Title"
            placeholder="e.g. HC Verma Vol 1 Chapter 10 or Galaxy Revision Lecture"
            value={resTitle}
            onChange={(e) => setResTitle(e.target.value)}
            required
            autoFocus
          />

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Resource Type</label>
            <select
              value={resType}
              onChange={(e) => setResType(e.target.value as ResourceType)}
              className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-brand-500"
            >
              <option value="book">Reference Textbook / Module</option>
              <option value="notes">Class Notes / Formula Sheet</option>
              <option value="video">Video Lecture / Masterclass</option>
              <option value="website">Web Link / Question Bank</option>
              <option value="other">Other Material</option>
            </select>
          </div>

          <Input
            label="URL / Online Link (Optional)"
            placeholder="https://..."
            value={resUrl}
            onChange={(e) => setResUrl(e.target.value)}
          />

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-800">
            <Button type="button" variant="ghost" onClick={() => setResourceModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="glow">
              Link Resource
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal: Add Custom Chapter */}
      <Modal
        isOpen={addChapterModalOpen}
        onClose={() => setAddChapterModalOpen(false)}
        title="Add Custom Chapter to Unit"
      >
        <form onSubmit={handleSaveCustomChapter} className="space-y-4 pt-1">
          <Input
            label="Chapter Name"
            placeholder="e.g. Fluid Mechanics & Surface Tension"
            value={newChapterName}
            onChange={(e) => setNewChapterName(e.target.value)}
            required
            autoFocus
          />

          <Textarea
            label="Subtopics (One per line)"
            placeholder="Pascal Law\nArchimedes Principle\nBernoulli Theorem"
            value={newSubtopics}
            onChange={(e) => setNewSubtopics(e.target.value)}
            rows={3}
          />

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-800">
            <Button type="button" variant="ghost" onClick={() => setAddChapterModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="glow">
              Create Chapter
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
