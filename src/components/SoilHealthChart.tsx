import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Card } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface ScanRecord {
  id: string;
  created_at: string;
  ph_level: number | null;
  moisture_percentage: number | null;
  nitrogen_level: string | null;
}

interface SoilHealthChartProps {
  scans: ScanRecord[];
  title: string;
}

const SoilHealthChart = ({ scans, title }: SoilHealthChartProps) => {
  // Sort scans by date (oldest first for chart)
  const sortedScans = [...scans].sort(
    (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  );

  // Convert nitrogen levels to numeric values
  const nitrogenToNumber = (level: string | null): number | null => {
    if (!level) return null;
    const normalizedLevel = level.toLowerCase();
    if (normalizedLevel === 'high' || normalizedLevel === 'अधिक') return 80;
    if (normalizedLevel === 'medium' || normalizedLevel === 'मध्यम') return 50;
    if (normalizedLevel === 'low' || normalizedLevel === 'कम') return 20;
    return null;
  };

  // Prepare chart data
  const chartData = sortedScans.map((scan) => ({
    date: new Date(scan.created_at).toLocaleDateString('hi-IN', {
      day: 'numeric',
      month: 'short',
    }),
    ph: scan.ph_level,
    moisture: scan.moisture_percentage,
    nitrogen: nitrogenToNumber(scan.nitrogen_level),
  })).filter(d => d.ph !== null || d.moisture !== null || d.nitrogen !== null);

  if (chartData.length < 2) {
    return (
      <Card className="p-4">
        <h3 className="font-semibold font-hindi mb-2 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-primary" />
          {title}
        </h3>
        <p className="text-sm text-muted-foreground font-hindi text-center py-4">
          ट्रेंड देखने के लिए कम से कम 2 जांच करें
        </p>
      </Card>
    );
  }

  // Calculate trends
  const calculateTrend = (field: 'ph' | 'moisture' | 'nitrogen') => {
    const validData = chartData.filter(d => d[field] !== null);
    if (validData.length < 2) return null;
    
    const first = validData[0][field] as number;
    const last = validData[validData.length - 1][field] as number;
    const diff = last - first;
    
    if (Math.abs(diff) < 2) return 'stable';
    return diff > 0 ? 'up' : 'down';
  };

  const phTrend = calculateTrend('ph');
  const moistureTrend = calculateTrend('moisture');
  const nitrogenTrend = calculateTrend('nitrogen');

  const TrendIcon = ({ trend }: { trend: string | null }) => {
    if (trend === 'up') return <TrendingUp className="w-3 h-3 text-success" />;
    if (trend === 'down') return <TrendingDown className="w-3 h-3 text-destructive" />;
    return <Minus className="w-3 h-3 text-muted-foreground" />;
  };

  return (
    <Card className="p-4">
      <h3 className="font-semibold font-hindi mb-4 flex items-center gap-2">
        <TrendingUp className="w-4 h-4 text-primary" />
        {title}
      </h3>
      
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
              tickLine={false}
              axisLine={{ stroke: 'hsl(var(--border))' }}
            />
            <YAxis 
              tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
              tickLine={false}
              axisLine={{ stroke: 'hsl(var(--border))' }}
              domain={[0, 100]}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                fontSize: '12px',
              }}
              labelStyle={{ fontWeight: 'bold' }}
            />
            <Line
              type="monotone"
              dataKey="ph"
              name="pH (×10)"
              stroke="hsl(88 45% 35%)"
              strokeWidth={2}
              dot={{ r: 3, fill: 'hsl(88 45% 35%)' }}
              activeDot={{ r: 5 }}
              connectNulls
            />
            <Line
              type="monotone"
              dataKey="moisture"
              name="नमी %"
              stroke="hsl(200 80% 50%)"
              strokeWidth={2}
              dot={{ r: 3, fill: 'hsl(200 80% 50%)' }}
              activeDot={{ r: 5 }}
              connectNulls
            />
            <Line
              type="monotone"
              dataKey="nitrogen"
              name="नाइट्रोजन"
              stroke="hsl(142 76% 36%)"
              strokeWidth={2}
              dot={{ r: 3, fill: 'hsl(142 76% 36%)' }}
              activeDot={{ r: 5 }}
              connectNulls
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Trend Summary */}
      <div className="flex items-center justify-around mt-4 pt-3 border-t">
        <div className="flex items-center gap-1 text-xs">
          <div className="w-2 h-2 rounded-full bg-primary" />
          <span className="text-muted-foreground">pH</span>
          <TrendIcon trend={phTrend} />
        </div>
        <div className="flex items-center gap-1 text-xs">
          <div className="w-2 h-2 rounded-full bg-info" />
          <span className="text-muted-foreground">नमी</span>
          <TrendIcon trend={moistureTrend} />
        </div>
        <div className="flex items-center gap-1 text-xs">
          <div className="w-2 h-2 rounded-full bg-success" />
          <span className="text-muted-foreground font-hindi">नाइट्रोजन</span>
          <TrendIcon trend={nitrogenTrend} />
        </div>
      </div>
    </Card>
  );
};

export default SoilHealthChart;
