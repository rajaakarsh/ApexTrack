import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { taskService } from '../services/taskService';
import { targetService } from '../services/targetService';
import { focusService } from '../services/focusService';
import { mockTestService } from '../services/mockTestService';
import { errorLogService } from '../services/errorLogService';
import { syllabusService } from '../services/syllabusService';
import { questionService } from '../services/questionService';
import { settingsService } from '../services/settingsService';
import { useTaskStore } from '../store/useTaskStore';
import { useTargetStore } from '../store/useTargetStore';
import { useTimerStore } from '../store/useTimerStore';
import { useMockStore } from '../store/useMockStore';
import { useErrorStore } from '../store/useErrorStore';
import { useSyllabusStore } from '../store/useSyllabusStore';
import { useQuestionStore } from '../store/useQuestionStore';
import { useSettingsStore } from '../store/useSettingsStore';

export function useSupabaseSync() {
  const { user, isGuest } = useAuth();

  useEffect(() => {
    if (!user || isGuest) return;

    const uid = user.id;
    let isMounted = true;

    const syncUserData = async () => {
      try {
        // Parallel fetch of all user data from PostgreSQL
        const [
          tasks,
          targets,
          sessions,
          mocks,
          errors,
          syllabusMap,
          questionLogs,
          settings,
        ] = await Promise.all([
          taskService.fetchTasks(uid),
          targetService.fetchTargets(uid),
          focusService.fetchFocusSessions(uid),
          mockTestService.fetchMockTests(uid),
          errorLogService.fetchErrorLogs(uid),
          syllabusService.fetchSyllabusProgress(uid),
          questionService.fetchDailyQuestions(uid),
          settingsService.fetchSettings(uid),
        ]);

        if (!isMounted) return;

        // Populate stores with user's real data (or empty array if brand new user)
        useTaskStore.setState({ tasks: tasks || [] });
        useTargetStore.setState({ targets: targets || [] });
        useTimerStore.setState({ sessions: sessions || [] });
        useMockStore.setState({ mockTests: mocks || [] });
        useErrorStore.setState({ errorLogs: errors || [] });

        if (syllabusMap && Object.keys(syllabusMap).length > 0) {
          useSyllabusStore.getState().importSyllabusProgress(syllabusMap);
        }

        if (questionLogs && Object.keys(questionLogs).length > 0) {
          useQuestionStore.getState().importQuestionLogs(questionLogs);
        }

        if (settings) {
          useSettingsStore.setState({ settings });
        }
      } catch (err) {
        console.warn('Error synchronizing data with Supabase:', err);
      }
    };

    syncUserData();

    return () => {
      isMounted = false;
    };
  }, [user, isGuest]);
}
