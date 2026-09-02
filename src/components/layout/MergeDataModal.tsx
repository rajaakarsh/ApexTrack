import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { useAppStore } from '../../store/useAppStore';
import { Cloud, Database, ArrowRight, CheckCircle2, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const MergeDataModal: React.FC = () => {
  const navigate = useNavigate();
  const { mergeModalOpen, setMergeModalOpen, loginWithAccount, setSyncStatus } = useAppStore();
  const [selectedOption, setSelectedOption] = useState<'merge' | 'cloud' | 'local'>('merge');
  const [isProcessing, setIsProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleResolve = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setSuccess(true);
      setSyncStatus('synced');
      loginWithAccount({
        displayName: 'Aspirant',
        targetExam: 'JEE Advanced',
      });
      setTimeout(() => {
        setSuccess(false);
        setMergeModalOpen(false);
      }, 1500);
    }, 1200);
  };

  return (
    <Modal
      isOpen={mergeModalOpen}
      onClose={() => setMergeModalOpen(false)}
      title="Cloud Account Sync & Data Merge"
      description="Connect your local study data with your Cloud Firestore Account."
      maxWidth="lg"
    >
      <div className="space-y-4 pt-2">
        {success ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30 animate-bounce">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-slate-100">Data Synchronized Successfully!</h4>
            <p className="text-xs text-slate-400">
              Your preparation progress is now securely backed up to the cloud.
            </p>
          </div>
        ) : (
          <>
            <p className="text-xs text-slate-300">
              You are currently using ApexTrack in offline/guest mode. Choose how you would like to handle existing study progress:
            </p>

            <div className="space-y-2.5">
              {/* Option 1: Merge */}
              <div
                onClick={() => setSelectedOption('merge')}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  selectedOption === 'merge'
                    ? 'bg-brand-500/10 border-brand-500 text-slate-100'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-brand-500/20 text-brand-400 flex items-center justify-center">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-slate-100">Merge Local & Cloud Data (Recommended)</h4>
                      <p className="text-xs text-slate-400">Combines all tasks, timer logs, and syllabus progress without data loss.</p>
                    </div>
                  </div>
                  <input
                    type="radio"
                    name="merge_option"
                    checked={selectedOption === 'merge'}
                    onChange={() => setSelectedOption('merge')}
                    className="text-brand-500"
                  />
                </div>
              </div>

              {/* Option 2: Overwrite Cloud with Local */}
              <div
                onClick={() => setSelectedOption('local')}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  selectedOption === 'local'
                    ? 'bg-brand-500/10 border-brand-500 text-slate-100'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center">
                      <Database className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-slate-100">Overwrite Cloud with Local Data</h4>
                      <p className="text-xs text-slate-400">Upload your current device's local state and replace remote data.</p>
                    </div>
                  </div>
                  <input
                    type="radio"
                    name="merge_option"
                    checked={selectedOption === 'local'}
                    onChange={() => setSelectedOption('local')}
                    className="text-brand-500"
                  />
                </div>
              </div>

              {/* Option 3: Use Cloud Only */}
              <div
                onClick={() => setSelectedOption('cloud')}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  selectedOption === 'cloud'
                    ? 'bg-brand-500/10 border-brand-500 text-slate-100'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center">
                      <Cloud className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-slate-100">Use Cloud Data Only</h4>
                      <p className="text-xs text-slate-400">Discard local modifications and pull clean data from your account.</p>
                    </div>
                  </div>
                  <input
                    type="radio"
                    name="merge_option"
                    checked={selectedOption === 'cloud'}
                    onChange={() => setSelectedOption('cloud')}
                    className="text-brand-500"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-800">
              <Button variant="ghost" onClick={() => setMergeModalOpen(false)}>
                Stay in Local Mode
              </Button>
              <Button variant="glow" loading={isProcessing} onClick={handleResolve}>
                Sync & Connect Account
              </Button>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
};
