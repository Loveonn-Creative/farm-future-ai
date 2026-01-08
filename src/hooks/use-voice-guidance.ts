import { useCallback, useRef, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

type Language = 'hi' | 'en' | 'bn' | 'ta' | 'te' | 'mr' | 'gu' | 'pa';

interface VoiceCommands {
  start: string;
  turnRight: string;
  turnLeft: string;
  markCorner: string;
  cornerMarked: string;
  keepWalking: string;
  stop: string;
  complete: string;
  error: string;
  calibrating: string;
  gpsWeak: string;
}

const voiceCommandsByLanguage: Record<Language, VoiceCommands> = {
  hi: {
    start: 'चलना शुरू करें। खेत की सीमा पर चलें।',
    turnRight: 'दाएं मुड़ें',
    turnLeft: 'बाएं मुड़ें',
    markCorner: 'कोना चिह्नित करने के लिए बटन दबाएं',
    cornerMarked: 'कोना चिह्नित हो गया। आगे चलें।',
    keepWalking: 'चलते रहें। सीमा पर बने रहें।',
    stop: 'रुकें। नक्शा पूरा हो गया।',
    complete: 'बहुत अच्छा! आपके खेत का नक्शा तैयार है।',
    error: 'GPS में समस्या है। खुले में जाएं।',
    calibrating: 'GPS जांच हो रही है। कृपया रुकें।',
    gpsWeak: 'GPS सिग्नल कमज़ोर है। धीरे चलें।'
  },
  en: {
    start: 'Start walking. Walk along the boundary of your land.',
    turnRight: 'Turn right',
    turnLeft: 'Turn left',
    markCorner: 'Press the button to mark a corner',
    cornerMarked: 'Corner marked. Keep walking.',
    keepWalking: 'Keep walking. Stay on the boundary.',
    stop: 'Stop. Mapping complete.',
    complete: 'Great! Your land map is ready.',
    error: 'GPS issue. Move to an open area.',
    calibrating: 'Calibrating GPS. Please wait.',
    gpsWeak: 'GPS signal weak. Walk slowly.'
  },
  bn: {
    start: 'হাঁটা শুরু করুন। জমির সীমানা বরাবর হাঁটুন।',
    turnRight: 'ডানে ঘুরুন',
    turnLeft: 'বামে ঘুরুন',
    markCorner: 'কোণা চিহ্নিত করতে বোতাম টিপুন',
    cornerMarked: 'কোণা চিহ্নিত হয়েছে। এগিয়ে যান।',
    keepWalking: 'হাঁটতে থাকুন। সীমানায় থাকুন।',
    stop: 'থামুন। মানচিত্র সম্পূর্ণ।',
    complete: 'দারুণ! আপনার জমির মানচিত্র তৈরি।',
    error: 'GPS সমস্যা। খোলা জায়গায় যান।',
    calibrating: 'GPS ক্যালিব্রেট হচ্ছে। অপেক্ষা করুন।',
    gpsWeak: 'GPS দুর্বল। ধীরে হাঁটুন।'
  },
  ta: {
    start: 'நடக்க தொடங்குங்கள். நிலத்தின் எல்லையில் நடங்கள்.',
    turnRight: 'வலது புறம் திரும்புங்கள்',
    turnLeft: 'இடது புறம் திரும்புங்கள்',
    markCorner: 'மூலையைக் குறிக்க பட்டனை அழுத்துங்கள்',
    cornerMarked: 'மூலை குறிக்கப்பட்டது. தொடர்ந்து நடங்கள்.',
    keepWalking: 'நடந்து கொண்டே இருங்கள்.',
    stop: 'நிறுத்துங்கள். வரைபடம் முடிந்தது.',
    complete: 'அருமை! உங்கள் நில வரைபடம் தயார்.',
    error: 'GPS பிரச்சனை. திறந்த இடத்திற்கு செல்லுங்கள்.',
    calibrating: 'GPS சோதிக்கப்படுகிறது. காத்திருங்கள்.',
    gpsWeak: 'GPS சிக்னல் பலவீனம். மெதுவாக நடங்கள்.'
  },
  te: {
    start: 'నడవడం ప్రారంభించండి. భూమి సరిహద్దులో నడవండి.',
    turnRight: 'కుడివైపు తిరగండి',
    turnLeft: 'ఎడమవైపు తిరగండి',
    markCorner: 'మూల గుర్తించడానికి బటన్ నొక్కండి',
    cornerMarked: 'మూల గుర్తించబడింది. కొనసాగించండి.',
    keepWalking: 'నడుస్తూ ఉండండి.',
    stop: 'ఆపండి. మ్యాపింగ్ పూర్తయింది.',
    complete: 'బాగుంది! మీ భూమి మ్యాప్ సిద్ధంగా ఉంది.',
    error: 'GPS సమస్య. ఓపెన్ ఏరియాకు వెళ్ళండి.',
    calibrating: 'GPS క్యాలిబ్రేట్ అవుతోంది. వేచి ఉండండి.',
    gpsWeak: 'GPS సిగ్నల్ బలహీనంగా ఉంది. నెమ్మదిగా నడవండి.'
  },
  mr: {
    start: 'चालणे सुरू करा. जमिनीच्या सीमेवर चाला.',
    turnRight: 'उजवीकडे वळा',
    turnLeft: 'डावीकडे वळा',
    markCorner: 'कोपरा चिन्हांकित करण्यासाठी बटण दाबा',
    cornerMarked: 'कोपरा चिन्हांकित. पुढे चाला.',
    keepWalking: 'चालत राहा.',
    stop: 'थांबा. नकाशा पूर्ण झाला.',
    complete: 'छान! तुमचा जमिनीचा नकाशा तयार आहे.',
    error: 'GPS समस्या. मोकळ्या जागी जा.',
    calibrating: 'GPS तपासत आहे. थांबा.',
    gpsWeak: 'GPS सिग्नल कमकुवत. हळू चाला.'
  },
  gu: {
    start: 'ચાલવાનું શરૂ કરો. જમીનની સીમા પર ચાલો.',
    turnRight: 'જમણે વળો',
    turnLeft: 'ડાબે વળો',
    markCorner: 'ખૂણો માર્ક કરવા બટન દબાવો',
    cornerMarked: 'ખૂણો માર્ક થયો. આગળ ચાલો.',
    keepWalking: 'ચાલતા રહો.',
    stop: 'રોકો. નકશો પૂર્ણ.',
    complete: 'સરસ! તમારો જમીન નકશો તૈયાર છે.',
    error: 'GPS સમસ્યા. ખુલ્લી જગ્યાએ જાઓ.',
    calibrating: 'GPS તપાસ ચાલુ છે. રાહ જુઓ.',
    gpsWeak: 'GPS સિગ્નલ નબળું છે. ધીમે ચાલો.'
  },
  pa: {
    start: 'ਤੁਰਨਾ ਸ਼ੁਰੂ ਕਰੋ। ਜ਼ਮੀਨ ਦੀ ਹੱਦ ਤੇ ਚੱਲੋ।',
    turnRight: 'ਸੱਜੇ ਮੁੜੋ',
    turnLeft: 'ਖੱਬੇ ਮੁੜੋ',
    markCorner: 'ਕੋਨਾ ਮਾਰਕ ਕਰਨ ਲਈ ਬਟਨ ਦਬਾਓ',
    cornerMarked: 'ਕੋਨਾ ਮਾਰਕ ਹੋਇਆ। ਅੱਗੇ ਚੱਲੋ।',
    keepWalking: 'ਚੱਲਦੇ ਰਹੋ।',
    stop: 'ਰੁਕੋ। ਨਕਸ਼ਾ ਪੂਰਾ।',
    complete: 'ਬਹੁਤ ਵਧੀਆ! ਤੁਹਾਡਾ ਜ਼ਮੀਨ ਨਕਸ਼ਾ ਤਿਆਰ ਹੈ।',
    error: 'GPS ਸਮੱਸਿਆ। ਖੁੱਲੀ ਜਗ੍ਹਾ ਜਾਓ।',
    calibrating: 'GPS ਜਾਂਚ ਹੋ ਰਹੀ ਹੈ। ਉਡੀਕ ਕਰੋ।',
    gpsWeak: 'GPS ਸਿਗਨਲ ਕਮਜ਼ੋਰ। ਹੌਲੀ ਚੱਲੋ।'
  }
};

// Map for ElevenLabs voice IDs by language
const voiceIdByLanguage: Record<Language, string> = {
  hi: 'pFZP5JQG7iQjIQuC4Bku', // Lily - good for Hindi
  en: 'JBFqnCBsd6RMkjVDRZzb', // George - clear English
  bn: 'pFZP5JQG7iQjIQuC4Bku',
  ta: 'pFZP5JQG7iQjIQuC4Bku',
  te: 'pFZP5JQG7iQjIQuC4Bku',
  mr: 'pFZP5JQG7iQjIQuC4Bku',
  gu: 'pFZP5JQG7iQjIQuC4Bku',
  pa: 'pFZP5JQG7iQjIQuC4Bku'
};

export function useVoiceGuidance() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isEnabled, setIsEnabled] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const queueRef = useRef<string[]>([]);
  const isProcessingRef = useRef(false);

  // Detect language from browser
  const detectLanguage = useCallback((): Language => {
    const saved = localStorage.getItem('datakhet_language') as Language;
    if (saved && ['hi', 'en', 'bn', 'ta', 'te', 'mr', 'gu', 'pa'].includes(saved)) {
      return saved;
    }
    
    const browserLang = navigator.language.split('-')[0];
    if (['hi', 'bn', 'ta', 'te', 'mr', 'gu', 'pa'].includes(browserLang)) {
      return browserLang as Language;
    }
    
    return 'hi'; // Default to Hindi for Indian users
  }, []);

  const [language, setLanguage] = useState<Language>(() => detectLanguage());

  // Get commands for current language
  const getCommands = useCallback((): VoiceCommands => {
    return voiceCommandsByLanguage[language] || voiceCommandsByLanguage.hi;
  }, [language]);

  // Speak text using ElevenLabs TTS
  const speak = useCallback(async (text: string) => {
    if (!isEnabled) return;

    queueRef.current.push(text);
    
    if (isProcessingRef.current) return;
    
    isProcessingRef.current = true;
    
    while (queueRef.current.length > 0) {
      const currentText = queueRef.current.shift();
      if (!currentText) continue;

      try {
        setIsSpeaking(true);

        const response = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/elevenlabs-tts`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'apikey': import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
              'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`
            },
            body: JSON.stringify({
              text: currentText,
              voiceId: voiceIdByLanguage[language]
            })
          }
        );

        if (!response.ok) {
          throw new Error('TTS request failed');
        }

        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        
        // Stop any currently playing audio
        if (audioRef.current) {
          audioRef.current.pause();
          URL.revokeObjectURL(audioRef.current.src);
        }

        audioRef.current = new Audio(audioUrl);
        
        await new Promise<void>((resolve) => {
          if (!audioRef.current) {
            resolve();
            return;
          }
          
          audioRef.current.onended = () => {
            URL.revokeObjectURL(audioUrl);
            resolve();
          };
          
          audioRef.current.onerror = () => {
            URL.revokeObjectURL(audioUrl);
            resolve();
          };
          
          audioRef.current.play().catch(() => {
            resolve();
          });
        });

      } catch (error) {
        console.error('Voice guidance error:', error);
        // Fallback to Web Speech API if available
        if ('speechSynthesis' in window) {
          const utterance = new SpeechSynthesisUtterance(currentText);
          utterance.lang = language === 'en' ? 'en-IN' : `${language}-IN`;
          window.speechSynthesis.speak(utterance);
        }
      } finally {
        setIsSpeaking(false);
      }
    }
    
    isProcessingRef.current = false;
  }, [isEnabled, language]);

  // Voice command functions
  const speakStart = useCallback(() => speak(getCommands().start), [speak, getCommands]);
  const speakTurnRight = useCallback(() => speak(getCommands().turnRight), [speak, getCommands]);
  const speakTurnLeft = useCallback(() => speak(getCommands().turnLeft), [speak, getCommands]);
  const speakMarkCorner = useCallback(() => speak(getCommands().markCorner), [speak, getCommands]);
  const speakCornerMarked = useCallback((cornerNum: number) => {
    const cmd = getCommands();
    speak(`${cmd.cornerMarked.replace('कोना', `कोना ${cornerNum}`).replace('Corner', `Corner ${cornerNum}`)}`);
  }, [speak, getCommands]);
  const speakKeepWalking = useCallback(() => speak(getCommands().keepWalking), [speak, getCommands]);
  const speakStop = useCallback(() => speak(getCommands().stop), [speak, getCommands]);
  const speakComplete = useCallback((area: string) => {
    const cmd = getCommands();
    speak(`${cmd.complete} ${language === 'en' ? `Area: ${area}` : `क्षेत्रफल: ${area}`}`);
  }, [speak, getCommands, language]);
  const speakError = useCallback(() => speak(getCommands().error), [speak, getCommands]);
  const speakCalibrating = useCallback(() => speak(getCommands().calibrating), [speak, getCommands]);
  const speakGpsWeak = useCallback(() => speak(getCommands().gpsWeak), [speak, getCommands]);

  // Stop all audio
  const stopSpeaking = useCallback(() => {
    queueRef.current = [];
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  }, []);

  return {
    isSpeaking,
    isEnabled,
    setIsEnabled,
    language,
    setLanguage,
    speak,
    speakStart,
    speakTurnRight,
    speakTurnLeft,
    speakMarkCorner,
    speakCornerMarked,
    speakKeepWalking,
    speakStop,
    speakComplete,
    speakError,
    speakCalibrating,
    speakGpsWeak,
    stopSpeaking
  };
}
