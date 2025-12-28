import { useState, useRef } from "react";
import { Mic, MicOff, Loader2, Send, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";

interface VoiceQuestionProps {
  soilData: any;
}

const VoiceQuestion = ({ soilData }: VoiceQuestionProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [isPlayingAnswer, setIsPlayingAnswer] = useState(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
        stream.getTracks().forEach(track => track.stop());
        await transcribeAudio(audioBlob);
      };

      mediaRecorder.start();
      setIsRecording(true);
      setQuestion("");
      setAnswer("");
    } catch (error) {
      console.error('Microphone error:', error);
      toast.error("माइक्रोफोन नहीं मिला");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const transcribeAudio = async (audioBlob: Blob) => {
    setIsProcessing(true);
    try {
      const formData = new FormData();
      formData.append("audio", audioBlob, "recording.webm");

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/elevenlabs-stt`,
        {
          method: "POST",
          headers: {
            apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Transcription failed");
      }

      const data = await response.json();
      const transcribedText = data.text || "";
      
      if (transcribedText) {
        setQuestion(transcribedText);
        await askQuestion(transcribedText);
      } else {
        toast.error("आवाज़ समझ नहीं आई, फिर से बोलें");
      }
    } catch (error) {
      console.error('Transcription error:', error);
      toast.error("आवाज़ नहीं समझी");
    } finally {
      setIsProcessing(false);
    }
  };

  const askQuestion = async (text: string) => {
    setIsProcessing(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/soil-chat`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ question: text, soilData }),
        }
      );

      const data = await response.json();
      
      if (data.error) {
        toast.error(data.error);
        return;
      }

      setAnswer(data.answer || "जवाब नहीं मिला");
    } catch (error) {
      console.error('Chat error:', error);
      toast.error("जवाब नहीं मिला");
    } finally {
      setIsProcessing(false);
    }
  };

  const playAnswer = async () => {
    if (!answer || isPlayingAnswer) return;

    setIsPlayingAnswer(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/elevenlabs-tts`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ text: answer }),
        }
      );

      if (!response.ok) throw new Error("TTS failed");

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);

      if (audioRef.current) {
        audioRef.current.pause();
      }

      const audio = new Audio(audioUrl);
      audioRef.current = audio;
      
      audio.onended = () => {
        setIsPlayingAnswer(false);
        URL.revokeObjectURL(audioUrl);
      };
      
      audio.onerror = () => {
        setIsPlayingAnswer(false);
        toast.error("आवाज़ नहीं चला सकते");
      };

      await audio.play();
    } catch (error) {
      console.error('TTS error:', error);
      setIsPlayingAnswer(false);
      toast.error("आवाज़ नहीं चला सकते");
    }
  };

  return (
    <div className="bg-card rounded-xl p-4 shadow-soft border border-border">
      <h3 className="font-hindi font-semibold text-foreground mb-3 flex items-center gap-2">
        🎤 सवाल पूछें
      </h3>
      
      <p className="text-sm text-muted-foreground font-hindi mb-4">
        बटन दबाकर अपना सवाल बोलें
      </p>

      {/* Recording button */}
      <div className="flex justify-center mb-4">
        <Button
          variant={isRecording ? "destructive" : "default"}
          size="lg"
          onClick={isRecording ? stopRecording : startRecording}
          disabled={isProcessing}
          className="rounded-full w-16 h-16"
        >
          {isProcessing ? (
            <Loader2 className="w-6 h-6 animate-spin" />
          ) : isRecording ? (
            <MicOff className="w-6 h-6" />
          ) : (
            <Mic className="w-6 h-6" />
          )}
        </Button>
      </div>

      {isRecording && (
        <p className="text-center text-sm text-primary font-hindi animate-pulse mb-4">
          बोलिए... रुकने के लिए बटन दबाएं
        </p>
      )}

      {/* Question display */}
      {question && (
        <div className="bg-muted/50 rounded-lg p-3 mb-3">
          <p className="text-sm text-muted-foreground font-hindi mb-1">आपका सवाल:</p>
          <p className="font-hindi text-foreground">{question}</p>
        </div>
      )}

      {/* Answer display */}
      {answer && (
        <div className="bg-primary/10 rounded-lg p-3 border border-primary/20">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <p className="text-sm text-primary font-hindi mb-1">जवाब:</p>
              <p className="font-hindi text-foreground">{answer}</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={playAnswer}
              disabled={isPlayingAnswer}
              className="flex-shrink-0"
            >
              {isPlayingAnswer ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Volume2 className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VoiceQuestion;
