import React, { useState } from 'react';
import {
  Plus,
  Filter,
  CheckCircle2,
  Calendar,
  Trash2,
  Search,
  List,
  Columns3,
  Download,
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { PriorityBadge, StatusBadge } from '../components/ui/Badge';
import { useTaskStore } from '../store/useTaskStore';
import { useAppStore } from '../store/useAppStore';
import { useAuth } from '../context/AuthContext';
import { taskService } from '../services/taskService';
import { Priority, Task, TaskStatus } from '../types';
import { exportTasksToICS } from '../lib/icsExport';
import { fireCelebrationConfetti } from '../components/ui/Confetti';

export const Planner: React.FC = () => {
  const { profile } = useAppStore();
  const { user, isGuest } = useAuth();
  const { tasks, addTask, updateTask, deleteTask, setTaskStatus } = useTaskStore();

  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list');
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [selectedPriority, setSelectedPriority] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [subject, setSubject] = useState('Physics');
  const [priority, setPriority] = useState<Priority>('medium');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [estimatedDuration, setEstimatedDuration] = useState(45);

  const handleOpenAddModal = () => {
    setEditingTask(null);
    setTitle('');
    setDescription('');
    setSubject('Physics');
    setPriority('medium');
    setDate(new Date().toISOString().split('T')[0]);
    setEstimatedDuration(45);
    setModalOpen(true);
  };

  const handleSaveTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (editingTask) {
      updateTask(editingTask.id, {
        title,
        description,
        subject,
        priority,
        date,
        estimatedDuration: Number(estimatedDuration),
      });

      if (user && !isGuest) {
        await taskService.updateTask(user.id, editingTask.id, {
          title,
          description,
          subject,
          priority,
          date,
          estimatedDuration: Number(estimatedDuration),
        });
      }
    } else {
      const newTask: Task = {
        id: 't-' + Date.now(),
        title,
        description,
        subject,
        priority,
        status: 'todo',
        date,
        estimatedDuration: Number(estimatedDuration),
        createdAt: new Date().toISOString(),
      };

      addTask(newTask);

      if (user && !isGuest) {
        await taskService.createTask(user.id, newTask);
      }
    }

    setModalOpen(false);
  };

  const handleToggleDone = async (taskId: string, currentStatus: TaskStatus) => {
    const nextStatus = currentStatus === 'done' ? 'todo' : 'done';
    setTaskStatus(taskId, nextStatus);

    if (nextStatus === 'done') {
      fireCelebrationConfetti();
    }

    if (user && !isGuest) {
      await taskService.updateTask(user.id, taskId, {
        status: nextStatus,
        completedAt: nextStatus === 'done' ? new Date().toISOString() : undefined,
      });
    }
  };

  const handleDelete = async (taskId: string) => {
    deleteTask(taskId);
    if (user && !isGuest) {
      await taskService.deleteTask(user.id, taskId);
    }
  };

  // Filter tasks
  const filteredTasks = tasks.filter((t) => {
    const matchSubj = selectedSubject === 'All' || t.subject === selectedSubject;
    const matchPri = selectedPriority === 'All' || t.priority === selectedPriority;
    const matchSearch =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.description && t.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchSubj && matchPri && matchSearch;
  });

  const subjects = ['Physics', 'Chemistry', 'Mathematics', 'Biology', 'General'];

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800/80 pb-5">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-zinc-100">Study Planner</h2>
          <p className="text-xs text-zinc-400 mt-0.5">Manage and organize your preparation schedule.</p>
        </div>

        <div className="flex items-center gap-2">
          {/* View toggle */}
          <div className="inline-flex items-center p-0.5 rounded-lg bg-zinc-900 border border-zinc-800">
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-md text-xs transition-colors ${
                viewMode === 'list' ? 'bg-zinc-800 text-zinc-100' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <List className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('kanban')}
              className={`p-1.5 rounded-md text-xs transition-colors ${
                viewMode === 'kanban' ? 'bg-zinc-800 text-zinc-100' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Columns3 className="w-3.5 h-3.5" />
            </button>
          </div>

          <Button
            size="sm"
            variant="outline"
            onClick={() => exportTasksToICS(tasks, profile.targetExam)}
            className="text-xs gap-1.5"
          >
            <Download className="w-3 h-3" /> Export .ics
          </Button>

          <Button size="sm" variant="primary" onClick={handleOpenAddModal} className="text-xs gap-1.5">
            <Plus className="w-3.5 h-3.5" /> Add Task
          </Button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-8.5 rounded-lg bg-zinc-900/50 border border-zinc-800 pl-8.5 pr-3 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-600 transition-colors"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="h-8.5 bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 text-xs text-zinc-300 focus:outline-none focus:border-zinc-600 transition-colors"
          >
            <option value="All">All Subjects</option>
            {subjects.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="h-8.5 bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 text-xs text-zinc-300 focus:outline-none focus:border-zinc-600 transition-colors"
          >
            <option value="All">All Priorities</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      {/* List View */}
      {viewMode === 'list' && (
        <div className="rounded-xl bg-[#111111] border border-zinc-800/80 divide-y divide-zinc-800/60 overflow-hidden">
          {filteredTasks.length === 0 ? (
            <div className="py-12 text-center space-y-2">
              <p className="text-xs text-zinc-500">No tasks found matching your filters.</p>
              <Button size="sm" variant="secondary" onClick={handleOpenAddModal}>
                Create New Task
              </Button>
            </div>
          ) : (
            filteredTasks.map((task) => (
              <div
                key={task.id}
                className="p-3.5 flex items-center justify-between gap-3 hover:bg-zinc-900/40 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <button
                    onClick={() => handleToggleDone(task.id, task.status)}
                    className={`w-4 h-4 rounded border flex items-center justify-center transition-colors flex-shrink-0 ${
                      task.status === 'done'
                        ? 'bg-zinc-200 border-zinc-200 text-zinc-950 font-bold text-[10px]'
                        : 'border-zinc-700 hover:border-zinc-500'
                    }`}
                  >
                    {task.status === 'done' && '✓'}
                  </button>

                  <div className="min-w-0">
                    <p
                      className={`text-xs font-medium truncate ${
                        task.status === 'done' ? 'line-through text-zinc-500' : 'text-zinc-200'
                      }`}
                    >
                      {task.title}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5 text-[11px] text-zinc-500">
                      <span>{task.subject}</span>
                      <span>•</span>
                      <span>{task.estimatedDuration}m</span>
                      <span>•</span>
                      <span>{task.date}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 flex-shrink-0">
                  <PriorityBadge priority={task.priority} />
                  <StatusBadge status={task.status} />
                  <button
                    onClick={() => handleDelete(task.id)}
                    className="p-1 text-zinc-500 hover:text-rose-400 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Kanban View */}
      {viewMode === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {(['todo', 'in_progress', 'done'] as TaskStatus[]).map((status) => {
            const columnTasks = filteredTasks.filter((t) => t.status === status);
            const titles = { todo: 'To Do', in_progress: 'In Progress', done: 'Done' };

            return (
              <div key={status} className="space-y-3">
                <div className="flex items-center justify-between pb-1 border-b border-zinc-800 text-xs font-semibold text-zinc-300">
                  <span>{titles[status]}</span>
                  <span className="text-[11px] font-mono text-zinc-500">{columnTasks.length}</span>
                </div>

                <div className="space-y-2">
                  {columnTasks.map((task) => (
                    <div
                      key={task.id}
                      className="p-3.5 rounded-xl bg-[#111111] border border-zinc-800/80 space-y-2 hover:border-zinc-700 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-xs font-medium text-zinc-200 leading-snug">{task.title}</p>
                        <PriorityBadge priority={task.priority} />
                      </div>

                      <div className="flex items-center justify-between pt-1 border-t border-zinc-800/40 text-[11px] text-zinc-500">
                        <span>{task.subject}</span>
                        <div className="flex items-center gap-1.5">
                          {status !== 'done' && (
                            <button
                              onClick={() => handleToggleDone(task.id, task.status)}
                              className="text-[10px] text-zinc-400 hover:text-zinc-100"
                            >
                              Complete ✓
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(task.id)}
                            className="text-zinc-500 hover:text-rose-400"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Task Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingTask ? 'Edit Task' : 'Add New Task'}
      >
        <form onSubmit={handleSaveTask} className="space-y-4 pt-1">
          <Input
            label="Task Title"
            placeholder="e.g. Solve 30 Rotation Kinematics PYQs"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1.5">Subject</label>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full h-9 bg-zinc-900 border border-zinc-800 rounded-lg px-3 text-xs text-zinc-100 focus:outline-none focus:border-zinc-600 transition-colors"
            >
              {subjects.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1.5">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="w-full h-9 bg-zinc-900 border border-zinc-800 rounded-lg px-3 text-xs text-zinc-100 focus:outline-none focus:border-zinc-600 transition-colors"
              >
                <option value="high">High Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="low">Low Priority</option>
              </select>
            </div>

            <Input
              label="Duration (min)"
              type="number"
              min={5}
              max={360}
              value={estimatedDuration}
              onChange={(e) => setEstimatedDuration(Number(e.target.value))}
            />
          </div>

          <Input
            label="Target Date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />

          <div className="flex justify-end gap-2 pt-2 border-t border-zinc-800">
            <Button variant="ghost" type="button" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              {editingTask ? 'Save Changes' : 'Create Task'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
