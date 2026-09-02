import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[ErrorBoundary caught error]:', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0A0A0A] text-zinc-100 flex flex-col items-center justify-center p-6 text-center select-none">
          <div className="max-w-md w-full p-8 rounded-2xl bg-[#111111] border border-zinc-800 space-y-5">
            <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 flex items-center justify-center mx-auto">
              <AlertCircle className="w-5 h-5 text-rose-400" />
            </div>

            <div className="space-y-1.5">
              <h2 className="text-base font-semibold text-zinc-100">Something went wrong</h2>
              <p className="text-xs text-zinc-400 leading-relaxed">
                The application encountered an unexpected runtime error.
              </p>
            </div>

            {this.state.error && (
              <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800/80 text-left overflow-x-auto max-h-32">
                <p className="text-[11px] font-mono text-zinc-400 break-words">
                  {this.state.error.message || String(this.state.error)}
                </p>
              </div>
            )}

            <button
              onClick={this.handleReload}
              className="w-full h-9 rounded-lg bg-zinc-100 hover:bg-white text-zinc-950 text-xs font-semibold transition-colors flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reload Application</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
