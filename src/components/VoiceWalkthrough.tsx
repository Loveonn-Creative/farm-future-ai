import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, X, Volume2, Loader2, RotateCcw, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useVoiceWalkthrough } from '@/hooks/use-voice-walkthrough';
import { cn } from '@/lib/utils';

interface VoiceWalkthroughProps {
  onComplete?: () => void;
}

const VoiceWalkthrough = ({ onComplete }: VoiceWalkthroughProps) => {
  const {
    isActive,
    isFirstTime,
    currentStep,
    currentStepIndex,
    totalSteps,
    isPlaying,
    isLoading,
    startWalkthrough,
    nextStep,
    previousStep,
    skipWalkthrough,
    replayCurrentStep,
  } = useVoiceWalkthrough();

  const [showPrompt, setShowPrompt] = useState(false);

  // Show prompt for first-time users after a short delay
  useEffect(() => {
    if (isFirstTime && !isActive) {
      const timer = setTimeout(() => {
        setShowPrompt(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isFirstTime, isActive]);

  const handleStart = () => {
    setShowPrompt(false);
    startWalkthrough();
  };

  const handleSkip = () => {
    setShowPrompt(false);
    skipWalkthrough();
    onComplete?.();
  };

  const handleComplete = () => {
    skipWalkthrough();
    onComplete?.();
  };

  // First-time prompt
  if (showPrompt && !isActive) {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
        <div className="bg-card rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-slide-up">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
              <Volume2 className="w-8 h-8 text-primary animate-pulse" />
            </div>
            <h2 className="text-xl font-bold font-hindi mb-2">
              पहली बार आए हैं?
            </h2>
            <p className="text-muted-foreground font-hindi text-sm mb-6">
              आवाज़ में सुनें कैसे इस्तेमाल करें। सिर्फ 1 मिनट लगेगा।
            </p>
            <div className="space-y-3">
              <Button onClick={handleStart} className="w-full font-hindi" size="lg">
                <Volume2 className="w-4 h-4 mr-2" />
                हाँ, गाइड चलाओ
              </Button>
              <Button onClick={handleSkip} variant="ghost" className="w-full font-hindi text-muted-foreground">
                बाद में, पहले जांच करूं
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Active walkthrough
  if (!isActive || !currentStep) return null;

  const isLastStep = currentStepIndex === totalSteps - 1;
  const isFirstStep = currentStepIndex === 0;

  return (
    <div className="fixed inset-0 z-50">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Spotlight effect for targeted elements */}
      {currentStep.targetSelector && (
        <TargetSpotlight selector={currentStep.targetSelector} />
      )}

      {/* Content card */}
      <div 
        className={cn(
          "absolute left-4 right-4 max-w-md mx-auto",
          currentStep.position === 'top' ? 'top-20' : 
          currentStep.position === 'bottom' ? 'bottom-32' : 
          'top-1/2 -translate-y-1/2'
        )}
      >
        <div className="bg-card rounded-2xl p-5 shadow-2xl animate-slide-up">
          {/* Progress */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex gap-1">
              {Array.from({ length: totalSteps }).map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    "w-2 h-2 rounded-full transition-colors",
                    i === currentStepIndex ? 'bg-primary' : 
                    i < currentStepIndex ? 'bg-primary/50' : 'bg-muted'
                  )}
                />
              ))}
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={handleComplete}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Content */}
          <div className="mb-4">
            <h3 className="text-lg font-bold font-hindi mb-2 flex items-center gap-2">
              {isPlaying && (
                <div className="flex gap-0.5">
                  <span className="w-1 h-4 bg-primary rounded animate-pulse" style={{ animationDelay: '0ms' }} />
                  <span className="w-1 h-3 bg-primary rounded animate-pulse" style={{ animationDelay: '150ms' }} />
                  <span className="w-1 h-5 bg-primary rounded animate-pulse" style={{ animationDelay: '300ms' }} />
                </div>
              )}
              {currentStep.title}
            </h3>
            <p className="text-muted-foreground font-hindi text-sm">
              {currentStep.description}
            </p>
          </div>

          {/* Voice controls */}
          <div className="flex items-center gap-2 mb-4">
            <Button
              variant="outline"
              size="sm"
              onClick={replayCurrentStep}
              disabled={isLoading}
              className="font-hindi"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <RotateCcw className="w-4 h-4" />
              )}
              <span className="ml-1">फिर सुनें</span>
            </Button>
            {isPlaying && (
              <span className="text-xs text-primary font-hindi animate-pulse">
                🔊 बोल रहा है...
              </span>
            )}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={previousStep}
              disabled={isFirstStep}
              className="font-hindi"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              पीछे
            </Button>

            <span className="text-xs text-muted-foreground">
              {currentStepIndex + 1} / {totalSteps}
            </span>

            <Button
              onClick={isLastStep ? handleComplete : nextStep}
              className="font-hindi"
            >
              {isLastStep ? 'शुरू करें' : 'आगे'}
              {!isLastStep && <ChevronRight className="w-4 h-4 ml-1" />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Spotlight component to highlight target elements
const TargetSpotlight = ({ selector }: { selector: string }) => {
  const [rect, setRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    const element = document.querySelector(selector);
    if (element) {
      const updateRect = () => {
        setRect(element.getBoundingClientRect());
      };
      updateRect();
      
      // Update on resize
      window.addEventListener('resize', updateRect);
      return () => window.removeEventListener('resize', updateRect);
    }
  }, [selector]);

  if (!rect) return null;

  return (
    <div
      className="absolute rounded-full ring-4 ring-primary ring-offset-4 ring-offset-transparent animate-pulse pointer-events-none"
      style={{
        left: rect.left - 8,
        top: rect.top - 8,
        width: rect.width + 16,
        height: rect.height + 16,
        boxShadow: '0 0 0 9999px rgba(0,0,0,0.5)',
      }}
    />
  );
};

// Help button to restart walkthrough
export const WalkthroughHelpButton = () => {
  const { startWalkthrough, resetWalkthrough } = useVoiceWalkthrough();
  
  const handleClick = () => {
    resetWalkthrough();
    startWalkthrough();
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleClick}
      className="text-muted-foreground hover:text-primary"
      title="गाइड फिर से देखें"
    >
      <HelpCircle className="w-5 h-5" />
    </Button>
  );
};

export default VoiceWalkthrough;
