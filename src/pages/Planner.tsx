import React, { useState } from 'react';
import {
  Plus,
  Search,
  Filter,
  Calendar as CalendarIcon,
  CheckSquare,
  Clock,
  Trash2,
  Edit2,
  Calendar,
  LayoutGrid,
  List as ListIcon,
  Download,
  Flame,
  ArrowRight,
} from 'lucide-react';
import { Card, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input, Textarea } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { PriorityBadge, StatusBadge } from '../components/ui/Badge';
import { useTaskStore } from '../store/useTaskStore';
import { useSyllabusStore } from '../store/useSyllabusStore';
import { useAppStore } from '../store/useAppStore';
import { Priority, Task, TaskStatus } from '../types';
import { exportTasksToICS } from '../lib/icsExport';
import { fireCelebrationConfetti } from '../components/ui/Confetti';

export const Planner: React.FC = () => {
  const { profile } = useAppStore();
  const {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    setTaskStatus,
    searchQuery,
    setSearchQuery,
    selectedSubject,
    setSelectedSubject,
    selectedPriority,
    setSelectedPriority,
  } = useTaskStore();

  const { subjects } = useSyllabusStore();

  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [subject, setSubject] = useState(subjects[0]?.name || 'Physics');
  const [priority, setPriority] = useState<Priority>('medium');
  const [status, setStatus] = useState<TaskStatus>('todo');
  const [duration, setDuration] = useState(45);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  // Open Add Modal
  const handleOpenAdd = () => {
    setEditingTask(null);
    setTitle('');
    setDescription('');
    setSubject(subjects[0]?.name || 'Physics');
    setPriority('medium');
    setStatus('todo');
    setDuration(45);
    setDate(new Date().toISOString().split('T')[0]);
    setModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (task: Task) => {
    setEditingTask(task);
    setTitle(task.title);
    setDescription(task.description || '');
    setSubject(task.subject);
    setPriority(task.priority);
    setStatus(task.status);
    setDuration(task.estimatedDuration || 30);
    setDate(task.date);
    setModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (editingTask) {
      updateTask(editingTask.id, {
        title: title.trim(),
        description: description.trim() || undefined,
        subject,
        priority,
        status,
        date,
        estimatedDuration: Number(duration),
      });
    } else {
      addTask({
        title: title.trim(),
        description: description.trim() || undefined,
        subject,
        priority,
        status,
        date,
        estimatedDuration: Number(duration),
      });
    }

    setModalOpen(false);
  };

  const handleToggleComplete = (task: Task) => {
    const nextStatus: TaskStatus = task.status === 'done' ? 'todo' : 'done';
    setTaskStatus(task.id, nextStatus);
    if (nextStatus === 'done') {
      fireCelebrationConfetti();
    }
  };

  // Filtered Tasks
  const filteredTasks = tasks.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = selectedSubject === 'all' || t.subject === selectedSubject;
    const matchesPriority = selectedPriority === 'all' || t.priority === selectedPriority;
    return matchesSearch && matchesSubject && matchesPriority;
  });

  const todoTasks = filteredTasks.filter((t) => t.status === 'todo');
  const inProgressTasks = filteredTasks.filter((t) => t.status === 'in_progress');
  const doneTasks = filteredTasks.filter((t) => t.status === 'done');

  return (
    <div className="space-y-6">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-100 flex items-center gap-2">
            <CheckSquare className="w-6 h-6 text-brand-400" />
            Study Planner & Tasks
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Organize daily preparation milestones, prioritize high-weightage topics, and maintain momentum.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Export to ICS */}
          <Button
            size="sm"
            variant="outline"
            onClick={() => exportTasksToICS(tasks, profile.targetExam)}
            className="text-xs"
            title="Export tasks to Calendar (.ics)"
          >
            <Download className="w-3.5 h-3.5 mr-1.5" />
            Export Calendar
          </Button>

          {/* View Toggle */}
          <div className="flex items-center bg-slate-900 border border-slate-800 p-1 rounded-xl">
            <button
              onClick={() => setViewMode('kanban')}
              className={`p-1.5 rounded-lg text-xs transition-colors ${
                viewMode === 'kanban' ? 'bg-slate-800 text-brand-400 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Kanban Board View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg text-xs transition-colors ${
                viewMode === 'list' ? 'bg-slate-800 text-brand-400 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Table List View"
            >
              <ListIcon className="w-4 h-4" />
            </button>
          </div>

          <Button size="sm" variant="glow" onClick={handleOpenAdd} className="text-xs gap-1.5">
            <Plus className="w-4 h-4" /> Add Task
          </Button>
        </div>
      </div>

      {/* Filter Controls Bar */}
      <Card className="p-4 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          {/* Search */}
          <div className="sm:col-span-2">
            <Input
              placeholder="Search tasks or chapters..."
              leftIcon={<Search className="w-4 h-4" />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Subject Filter */}
          <div>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-brand-500"
            >
              <option value="all">All Subjects</option>
              {subjects.map((s) => (
                <option key={s.id} value={s.name}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          {/* Priority Filter */}
          <div>
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value as Priority | 'all')}
              className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-brand-500"
            >
              <option value="all">All Priorities</option>
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>
          </div>
        </div>
      </Card>

      {/* View 1: KANBAN BOARD */}
      {viewMode === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Column 1: TO DO */}
          <div className="space-y-3">
            <div className="flex items-center justify-between px-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-500" />
                To Do ({todoTasks.length})
              </span>
              <button onClick={handleOpenAdd} className="p-1 rounded text-slate-400 hover:text-slate-100">
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 min-h-[300px] p-2 rounded-2xl bg-slate-900/40 border border-slate-800/80">
              {todoTasks.length === 0 ? (
                <div className="py-12 text-center text-xs text-slate-500">No tasks to do</div>
              ) : (
                todoTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onStatusChange={(newStatus) => setTaskStatus(task.id, newStatus)}
                    onEdit={() => handleOpenEdit(task)}
                    onDelete={() => deleteTask(task.id)}
                    onToggleComplete={() => handleToggleComplete(task)}
                  />
                ))
              )}
            </div>
          </div>

          {/* Column 2: IN PROGRESS */}
          <div className="space-y-3">
            <div className="flex items-center justify-between px-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
                In Progress ({inProgressTasks.length})
              </span>
            </div>

            <div className="space-y-3 min-h-[300px] p-2 rounded-2xl bg-slate-900/40 border border-slate-800/80">
              {inProgressTasks.length === 0 ? (
                <div className="py-12 text-center text-xs text-slate-500">No tasks in progress</div>
              ) : (
                inProgressTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onStatusChange={(newStatus) => setTaskStatus(task.id, newStatus)}
                    onEdit={() => handleOpenEdit(task)}
                    onDelete={() => deleteTask(task.id)}
                    onToggleComplete={() => handleToggleComplete(task)}
                  />
                ))
              )}
            </div>
          </div>

          {/* Column 3: DONE */}
          <div className="space-y-3">
            <div className="flex items-center justify-between px-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                Completed ({doneTasks.length})
              </span>
            </div>

            <div className="space-y-3 min-h-[300px] p-2 rounded-2xl bg-slate-900/40 border border-slate-800/80">
              {doneTasks.length === 0 ? (
                <div className="py-12 text-center text-xs text-slate-500">No completed tasks yet</div>
              ) : (
                doneTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onStatusChange={(newStatus) => setTaskStatus(task.id, newStatus)}
                    onEdit={() => handleOpenEdit(task)}
                    onDelete={() => deleteTask(task.id)}
                    onToggleComplete={() => handleToggleComplete(task)}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* View 2: LIST / TABLE VIEW */}
      {viewMode === 'list' && (
        <Card className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-200">
            <thead className="bg-slate-900/80 text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Title & Description</th>
                <th className="py-3 px-4">Subject</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">Duration</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredTasks.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    No matching tasks found.
                  </td>
                </tr>
              ) : (
                filteredTasks.map((task) => (
                  <tr key={task.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleToggleComplete(task)}
                        className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                          task.status === 'done'
                            ? 'bg-brand-500 border-brand-500 text-slate-950 font-black'
                            : 'border-slate-600 hover:border-brand-500'
                        }`}
                      >
                        {task.status === 'done' && '✓'}
                      </button>
                    </td>
                    <td className="py-3 px-4">
                      <p className={`font-semibold ${task.status === 'done' ? 'line-through text-slate-500' : 'text-slate-100'}`}>
                        {task.title}
                      </p>
                      {task.description && (
                        <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{task.description}</p>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-brand-400 font-medium">{task.subject}</span>
                    </td>
                    <td className="py-3 px-4">
                      <PriorityBadge priority={task.priority} />
                    </td>
                    <td className="py-3 px-4 font-mono">{task.estimatedDuration}m</td>
                    <td className="py-3 px-4 font-mono text-slate-400">{task.date}</td>
                    <td className="py-3 px-4 text-right space-x-1">
                      <button
                        onClick={() => handleOpenEdit(task)}
                        className="p-1 rounded text-slate-400 hover:text-slate-100"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="p-1 rounded text-slate-400 hover:text-rose-400"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </Card>
      )}

      {/* Task Create / Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingTask ? 'Edit Study Task' : 'Create New Study Task'}
      >
        <form onSubmit={handleSave} className="space-y-4 pt-1">
          <Input
            label="Task Title"
            placeholder="e.g. Solve 25 Mechanics PYQ Problems"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            autoFocus
          />

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Subject</label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-brand-500"
              >
                {subjects.map((s) => (
                  <option key={s.id} value={s.name}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-brand-500"
              >
                <option value="high">High Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="low">Low Priority</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
                className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-brand-500"
              >
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>

            <Input
              label="Duration (mins)"
              type="number"
              min={5}
              max={480}
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
            />

            <Input
              label="Date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <Textarea
            label="Notes / Instructions (Optional)"
            placeholder="Focus on advanced questions 15 to 30..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
          />

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-800">
            <Button type="button" variant="ghost" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="glow">
              {editingTask ? 'Update Task' : 'Save Task'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

// Task Card Component for Kanban Board
const TaskCard: React.FC<{
  task: Task;
  onStatusChange: (status: TaskStatus) => void;
  onEdit: () => void;
  onDelete: () => void;
  onToggleComplete: () => void;
}> = ({ task, onStatusChange, onEdit, onDelete, onToggleComplete }) => {
  return (
    <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-all space-y-3 group shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-2.5 min-w-0">
          <button
            onClick={onToggleComplete}
            className={`w-4 h-4 rounded mt-0.5 border flex items-center justify-center transition-colors flex-shrink-0 ${
              task.status === 'done'
                ? 'bg-brand-500 border-brand-500 text-slate-950 font-black text-[10px]'
                : 'border-slate-600 hover:border-brand-500'
            }`}
          >
            {task.status === 'done' && '✓'}
          </button>
          <h4
            className={`text-xs font-semibold leading-snug ${
              task.status === 'done' ? 'line-through text-slate-500' : 'text-slate-100'
            }`}
          >
            {task.title}
          </h4>
        </div>

        <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity">
          <button onClick={onEdit} className="p-1 text-slate-400 hover:text-slate-100">
            <Edit2 className="w-3 h-3" />
          </button>
          <button onClick={onDelete} className="p-1 text-slate-400 hover:text-rose-400">
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>

      {task.description && (
        <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">{task.description}</p>
      )}

      <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[11px]">
        <span className="text-brand-400 font-medium">{task.subject}</span>
        <div className="flex items-center gap-1.5 text-slate-400 font-mono">
          <Clock className="w-3 h-3" />
          <span>{task.estimatedDuration}m</span>
        </div>
      </div>

      {/* Quick Move Status Buttons */}
      <div className="flex items-center justify-between gap-1 pt-1">
        <PriorityBadge priority={task.priority} />
        <div className="flex items-center gap-1 text-[10px]">
          {task.status !== 'todo' && (
            <button
              onClick={() => onStatusChange('todo')}
              className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 hover:text-slate-200"
            >
              ← Todo
            </button>
          )}
          {task.status !== 'in_progress' && (
            <button
              onClick={() => onStatusChange('in_progress')}
              className="px-1.5 py-0.5 rounded bg-slate-800 text-amber-300 hover:bg-amber-500/20"
            >
              Progress
            </button>
          )}
          {task.status !== 'done' && (
            <button
              onClick={() => onStatusChange('done')}
              className="px-1.5 py-0.5 rounded bg-slate-800 text-emerald-300 hover:bg-emerald-500/20"
            >
              Done ✓
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
