import React, { useContext, useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { DataContext } from "../../contexts/DataContext";
import { History } from "lucide-react";

export default function StatisticsOverTime() {
  const { data } = useContext(DataContext);

  const chartData = useMemo(() => {

    const logs = data?.energyLogs || [];

    return logs.map((entry) => ({
      time: new Date(entry.timestamp).toLocaleTimeString('sv-SE', {
        hour: '2-digit',
        minute: '2-digit'
      }),
      level: entry.level
    }));
  }, [data]);

  return (
    <div className="statistics-card" style={{ padding: '20px', background: 'var(--card-bg)', borderRadius: '12px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
        <History size={20} />
        <h3 style={{ margin: 0 }}>Energi över tid</h3>
      </div>

      <div style={{ width: '100%', height: 300, minWidth: 0 }}>
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
              <XAxis
                dataKey="time"
                tick={{ fontSize: 10 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                domain={[1, 5]}
                ticks={[1, 2, 3, 4, 5]}
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                contentStyle={{ backgroundColor: '#222', border: 'none', borderRadius: '8px' }}
                itemStyle={{ color: '#fff' }}
              />
              <Line
                type="monotone"
                dataKey="level"
                stroke="var(--accent-primary, #39bef8)"
                strokeWidth={3}
                dot={{ r: 4, fill: 'var(--accent-primary, #39bef8)' }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', opacity: 0.5 }}>
            Ingen data tillgänglig ännu.
          </div>
        )}
      </div>
    </div>
  );
}