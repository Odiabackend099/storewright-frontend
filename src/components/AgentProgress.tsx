import { useState, useEffect } from 'react';

export type AgentStep = {
  name: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  duration?: number;
  message?: string;
};

export type AgentProgressProps = {
  agentName: string;
  agentIcon: string;
  steps: AgentStep[];
  totalSteps: number;
  currentStep: number;
  startTime: Date | null;
  isActive: boolean;
};

export default function AgentProgress({
  agentName,
  agentIcon,
  steps,
  totalSteps,
  currentStep,
  startTime,
  isActive
}: AgentProgressProps) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!isActive || !startTime) return;
    
    const interval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTime.getTime()) / 1000));
    }, 1000);
    
    return () => clearInterval(interval);
  }, [isActive, startTime]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercent = totalSteps > 0 ? (currentStep / totalSteps) * 100 : 0;

  if (!isActive) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-slate-900 via-slate-900/95 to-transparent p-6 z-50">
      <div className="max-w-4xl mx-auto">
        {/* Agent Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-forest-400 to-forest-600 flex items-center justify-center text-2xl animate-pulse">
              {agentIcon}
            </div>
            <div>
              <h3 className="font-bold text-white text-lg">{agentName}</h3>
              <p className="text-slate-400 text-sm">
                Step {currentStep} of {totalSteps} • {formatTime(elapsed)}
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-forest-400 font-bold text-2xl">{Math.round(progressPercent)}%</div>
            <div className="text-slate-500 text-xs">Complete</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-2 bg-slate-700 rounded-full overflow-hidden mb-4">
          <div 
            className="h-full bg-gradient-to-r from-forest-400 to-forest-600 transition-all duration-500 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Steps */}
        <div className="grid grid-cols-5 gap-2">
          {steps.map((step, i) => (
            <div 
              key={i} 
              className={`p-2 rounded-lg text-center text-xs transition-all duration-300 ${
                step.status === 'completed' 
                  ? 'bg-forest-600/20 border border-forest-500 text-forest-400' 
                  : step.status === 'running'
                  ? 'bg-blue-600/20 border border-blue-500 text-blue-400 animate-pulse'
                  : step.status === 'failed'
                  ? 'bg-red-600/20 border border-red-500 text-red-400'
                  : 'bg-slate-800 border border-slate-700 text-slate-500'
              }`}
            >
              <div className="font-medium truncate">{step.name}</div>
              {step.status === 'running' && step.message && (
                <div className="text-[10px] mt-1 text-blue-300 truncate">{step.message}</div>
              )}
            </div>
          ))}
        </div>

        {/* Current Action */}
        {steps.find(s => s.status === 'running') && (
          <div className="mt-4 p-3 bg-slate-800/50 rounded-lg border border-slate-700">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-ping" />
              <span className="text-blue-400 text-sm">
                {steps.find(s => s.status === 'running')?.message || 'Processing...'}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}