import { useState, useCallback, useRef } from 'react';
import { toast } from 'sonner';

const WALKTHROUGH_KEY = 'datakhet_walkthrough_completed';

export interface WalkthroughStep {
  id: string;
  title: string;
  description: string;
  voiceText: string;
  targetSelector?: string;
  position?: 'top' | 'bottom' | 'center';
}

export const walkthroughSteps: WalkthroughStep[] = [
  {
    id: 'welcome',
    title: 'स्वागत है!',
    description: 'DataKhet में आपका स्वागत है। यह ऐप आपकी खेती को बेहतर बनाने में मदद करेगा।',
    voiceText: 'नमस्ते किसान भाई! DataKhet में आपका स्वागत है। यह ऐप आपकी खेती को बेहतर बनाने में मदद करेगा। आइए देखें कैसे।',
    position: 'center',
  },
  {
    id: 'soil-scan',
    title: 'मिट्टी जांचो',
    description: 'मिट्टी की फोटो लें और तुरंत जानें - pH, नमी, नाइट्रोजन सब कुछ।',
    voiceText: 'पहला बटन है मिट्टी जांचो। इससे आप अपनी मिट्टी की फोटो लेकर तुरंत जान सकते हैं कि मिट्टी में pH कितना है, नमी कितनी है, और नाइट्रोजन कितना है।',
    targetSelector: '[data-walkthrough="soil-scan"]',
    position: 'bottom',
  },
  {
    id: 'crop-scan',
    title: 'फसल जांचो',
    description: 'फसल की फोटो से बीमारी पहचानें और इलाज जानें।',
    voiceText: 'दूसरा बटन है फसल जांचो। इससे आप अपनी फसल की फोटो लेकर बीमारी पहचान सकते हैं और सही इलाज जान सकते हैं।',
    targetSelector: '[data-walkthrough="crop-scan"]',
    position: 'bottom',
  },
  {
    id: 'kitchen-garden',
    title: 'घर का बगीचा',
    description: 'गमले या छत के पौधों की देखभाल के लिए।',
    voiceText: 'तीसरा बटन है घर का बगीचा। अगर आपके घर में गमले या छत पर पौधे हैं तो इसका इस्तेमाल करें।',
    targetSelector: '[data-walkthrough="kitchen-garden"]',
    position: 'bottom',
  },
  {
    id: 'land-mapping',
    title: 'खेत नापें',
    description: 'GPS से अपने खेत का सही नाप करें - बीघा, एकड़ सब पता चलेगा।',
    voiceText: 'नीचे खेत नापें बटन है। इससे आप GPS की मदद से अपने खेत का सही नाप कर सकते हैं। बीघा, एकड़, हेक्टेयर सब पता चल जाएगा।',
    targetSelector: '[data-walkthrough="land-mapping"]',
    position: 'top',
  },
  {
    id: 'complete',
    title: 'बधाई हो!',
    description: 'अब आप DataKhet इस्तेमाल करने के लिए तैयार हैं। शुरू करें!',
    voiceText: 'बधाई हो! अब आप DataKhet इस्तेमाल करने के लिए तैयार हैं। मिट्टी जांचो बटन दबाकर शुरू करें। अगर कोई सवाल हो तो रिपोर्ट में माइक बटन दबाकर पूछ सकते हैं।',
    position: 'center',
  },
];

export const useVoiceWalkthrough = () => {
  const [isActive, setIsActive] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentStep = walkthroughSteps[currentStepIndex];
  const isFirstTime = !localStorage.getItem(WALKTHROUGH_KEY);

  const playVoice = useCallback(async (text: string) => {
    setIsLoading(true);
    try {
      // Stop any currently playing audio
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/elevenlabs-tts`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ text }),
        }
      );

      if (!response.ok) {
        throw new Error('TTS request failed');
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audioRef.current = audio;

      setIsPlaying(true);
      
      audio.onended = () => {
        setIsPlaying(false);
        URL.revokeObjectURL(audioUrl);
      };

      audio.onerror = () => {
        setIsPlaying(false);
        URL.revokeObjectURL(audioUrl);
      };

      await audio.play();
    } catch (error) {
      console.error('Voice playback failed:', error);
      setIsPlaying(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const startWalkthrough = useCallback(() => {
    setIsActive(true);
    setCurrentStepIndex(0);
    // Play first step voice
    playVoice(walkthroughSteps[0].voiceText);
  }, [playVoice]);

  const nextStep = useCallback(() => {
    if (currentStepIndex < walkthroughSteps.length - 1) {
      const nextIndex = currentStepIndex + 1;
      setCurrentStepIndex(nextIndex);
      playVoice(walkthroughSteps[nextIndex].voiceText);
    } else {
      completeWalkthrough();
    }
  }, [currentStepIndex, playVoice]);

  const previousStep = useCallback(() => {
    if (currentStepIndex > 0) {
      const prevIndex = currentStepIndex - 1;
      setCurrentStepIndex(prevIndex);
      playVoice(walkthroughSteps[prevIndex].voiceText);
    }
  }, [currentStepIndex, playVoice]);

  const completeWalkthrough = useCallback(() => {
    localStorage.setItem(WALKTHROUGH_KEY, 'true');
    setIsActive(false);
    setCurrentStepIndex(0);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    toast.success('गाइड पूरी हुई! 🌱', {
      description: 'अब खेती शुरू करें',
    });
  }, []);

  const skipWalkthrough = useCallback(() => {
    localStorage.setItem(WALKTHROUGH_KEY, 'true');
    setIsActive(false);
    setCurrentStepIndex(0);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
  }, []);

  const replayCurrentStep = useCallback(() => {
    if (currentStep) {
      playVoice(currentStep.voiceText);
    }
  }, [currentStep, playVoice]);

  const resetWalkthrough = useCallback(() => {
    localStorage.removeItem(WALKTHROUGH_KEY);
  }, []);

  return {
    isActive,
    isFirstTime,
    currentStep,
    currentStepIndex,
    totalSteps: walkthroughSteps.length,
    isPlaying,
    isLoading,
    startWalkthrough,
    nextStep,
    previousStep,
    skipWalkthrough,
    completeWalkthrough,
    replayCurrentStep,
    resetWalkthrough,
  };
};
