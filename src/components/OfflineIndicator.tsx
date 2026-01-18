import { WifiOff, CloudOff, RefreshCw, Cloud } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useOfflineSync } from '@/hooks/use-offline-sync';

const OfflineIndicator = () => {
  const { isOnline, pendingScanCount, isSyncing, syncPendingScans } = useOfflineSync();

  if (isOnline && pendingScanCount === 0) return null;

  return (
    <div className={`fixed top-2 left-1/2 -translate-x-1/2 z-50 px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-2 shadow-lg ${
      isOnline 
        ? 'bg-warning/90 text-warning-foreground' 
        : 'bg-destructive/90 text-destructive-foreground'
    }`}>
      {!isOnline ? (
        <>
          <WifiOff className="w-3 h-3" />
          <span className="font-hindi">ऑफलाइन मोड</span>
        </>
      ) : pendingScanCount > 0 ? (
        <>
          {isSyncing ? (
            <RefreshCw className="w-3 h-3 animate-spin" />
          ) : (
            <CloudOff className="w-3 h-3" />
          )}
          <span className="font-hindi">{pendingScanCount} स्कैन पेंडिंग</span>
          {!isSyncing && (
            <Button
              variant="ghost"
              size="sm"
              className="h-5 px-2 text-xs"
              onClick={syncPendingScans}
            >
              <Cloud className="w-3 h-3" />
            </Button>
          )}
        </>
      ) : null}
    </div>
  );
};

export default OfflineIndicator;
