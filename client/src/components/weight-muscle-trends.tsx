import { useQuery } from "@tanstack/react-query";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import type { BodyCompositionEntry } from "@shared/schema";

interface WeightMuscleTrendsProps {
  patientId: string;
}

export default function WeightMuscleTrends({ patientId }: WeightMuscleTrendsProps) {
  const { data: bodyComposition = [] } = useQuery<BodyCompositionEntry[]>({
    queryKey: [`/api/patients/${patientId}/body-composition`],
  });

  // Process data for chart
  const chartData = bodyComposition
    .sort((a, b) => new Date(a.entryDate).getTime() - new Date(b.entryDate).getTime())
    .map((entry) => ({
      date: new Date(entry.entryDate).toLocaleDateString(),
      weight: entry.weightPounds, // Use pounds instead of kg
      muscleMass: entry.skeletalMuscle,
      bmi: entry.bmi,
      bodyFat: entry.bodyFatPercentage,
    }));

  // Calculate trends
  const calculateTrend = (data: number[]) => {
    if (data.length < 2) return { trend: "stable", change: 0 };
    const latest = data[data.length - 1];
    const previous = data[data.length - 2];
    const change = latest - previous;
    const trend = change > 0.5 ? "up" : change < -0.5 ? "down" : "stable";
    return { trend, change };
  };

  const weightTrend = calculateTrend(chartData.map(d => d.weight).filter((w): w is number => w !== null && w !== undefined));
  const muscleTrend = calculateTrend(chartData.map(d => d.muscleMass).filter((m): m is number => m !== null && m !== undefined));

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up": return <TrendingUp className="w-4 h-4 text-green-600" />;
      case "down": return <TrendingDown className="w-4 h-4 text-red-600" />;
      default: return <Minus className="w-4 h-4 text-gray-600" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case "up": return "text-green-600";
      case "down": return "text-red-600";
      default: return "text-gray-600";
    }
  };

  if (chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Weight & Muscle Mass Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            No body composition data available for trend analysis
          </div>
        </CardContent>
      </Card>
    );
  }

  const latestData = chartData[chartData.length - 1];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Weight & Muscle Mass Trends</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-sm text-gray-600">Current Weight</div>
            <div className="text-xl font-bold text-blue-700">
              {latestData?.weight?.toFixed(1) || "N/A"} lbs
            </div>
            <div className={`flex items-center justify-center space-x-1 text-sm ${getTrendColor(weightTrend.trend)}`}>
              {getTrendIcon(weightTrend.trend)}
              <span>{Math.abs(weightTrend.change).toFixed(1)} lbs</span>
            </div>
          </div>

          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="text-sm text-gray-600">Muscle Mass</div>
            <div className="text-xl font-bold text-green-700">
              {latestData?.muscleMass?.toFixed(1) || "N/A"}%
            </div>
            <div className={`flex items-center justify-center space-x-1 text-sm ${getTrendColor(muscleTrend.trend)}`}>
              {getTrendIcon(muscleTrend.trend)}
              <span>{Math.abs(muscleTrend.change).toFixed(1)}%</span>
            </div>
          </div>

          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <div className="text-sm text-gray-600">BMI</div>
            <div className="text-xl font-bold text-purple-700">
              {latestData?.bmi?.toFixed(1) || "N/A"}
            </div>
          </div>

          <div className="text-center p-3 bg-orange-50 rounded-lg">
            <div className="text-sm text-gray-600">Body Fat</div>
            <div className="text-xl font-bold text-orange-700">
              {latestData?.bodyFat?.toFixed(1) || "N/A"}%
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis 
                yAxisId="weight"
                orientation="left"
                tick={{ fontSize: 12 }}
                label={{ value: 'Weight (lbs)', angle: -90, position: 'insideLeft' }}
              />
              <YAxis 
                yAxisId="muscle"
                orientation="right"
                tick={{ fontSize: 12 }}
                label={{ value: 'Muscle Mass (%)', angle: 90, position: 'insideRight' }}
              />
              <Tooltip 
                labelFormatter={(label) => `Date: ${label}`}
                formatter={(value, name) => [
                  `${Number(value).toFixed(1)}${name === 'Weight' ? ' lbs' : '%'}`,
                  name
                ]}
              />
              <Legend />
              <Line
                yAxisId="weight"
                type="monotone"
                dataKey="weight"
                stroke="#2563eb"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ fill: "#2563eb", strokeWidth: 2, r: 4 }}
                name="Weight"
                connectNulls={false}
              />
              <Line
                yAxisId="muscle"
                type="monotone"
                dataKey="muscleMass"
                stroke="#16a34a"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ fill: "#16a34a", strokeWidth: 2, r: 4 }}
                name="Muscle Mass"
                connectNulls={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Analysis Summary */}
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-2">Trend Analysis</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Weight Change:</span>
              <span className={`ml-2 ${getTrendColor(weightTrend.trend)}`}>
                {weightTrend.trend === "up" ? "Increasing" : 
                 weightTrend.trend === "down" ? "Decreasing" : "Stable"}
                {weightTrend.change !== 0 && ` (${weightTrend.change > 0 ? "+" : ""}${weightTrend.change.toFixed(1)} kg)`}
              </span>
            </div>
            <div>
              <span className="font-medium">Muscle Mass Change:</span>
              <span className={`ml-2 ${getTrendColor(muscleTrend.trend)}`}>
                {muscleTrend.trend === "up" ? "Increasing" : 
                 muscleTrend.trend === "down" ? "Decreasing" : "Stable"}
                {muscleTrend.change !== 0 && ` (${muscleTrend.change > 0 ? "+" : ""}${muscleTrend.change.toFixed(1)}%)`}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}