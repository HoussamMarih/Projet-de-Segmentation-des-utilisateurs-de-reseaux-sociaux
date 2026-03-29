import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  ScatterChart, 
  Scatter, 
  XAxis, 
  YAxis, 
  ZAxis, 
  Tooltip, 
  ResponsiveContainer,
  Cell,
  Legend
} from 'recharts';
import { 
  Users, 
  TrendingUp, 
  BarChart3, 
  Settings2,
  Database,
  RefreshCw,
  LayoutDashboard
} from 'lucide-react';

const API_BASE = "http://localhost:8000/api";

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#a855f7', '#3b82f6'];

function App() {
  const [method, setMethod] = useState('kmeans');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [nClusters, setNClusters] = useState(4);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE}/clustering/${method}?n_clusters=${nClusters}`);
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [method, nClusters]);

  const clusterGroups = data ? Array.from(new Set(data.clusters.map(item => item.cluster))).sort() : [];

  return (
    <div className="min-h-screen p-6 md:p-10 space-y-8 animate-fade-in">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass p-6 rounded-2xl">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-indigo-500/20 rounded-xl">
            <LayoutDashboard className="w-8 h-8 text-indigo-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              Segmentation Utilisateurs
            </h1>
            <p className="text-gray-400 text-sm">Dashboard de Machine Learning</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 bg-slate-800/50 p-1.5 rounded-xl border border-white/5">
          <button 
            onClick={() => setMethod('kmeans')}
            className={`px-4 py-2 rounded-lg transition-all ${method === 'kmeans' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'text-gray-400 hover:text-white'}`}
          >
            K-Means
          </button>
          <button 
            onClick={() => setMethod('hierarchical')}
            className={`px-4 py-2 rounded-lg transition-all ${method === 'hierarchical' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'text-gray-400 hover:text-white'}`}
          >
            Hiérarchique
          </button>
        </div>
      </header>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Stats Column */}
        <div className="space-y-6">
          <div className="glass p-6 rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold flex items-center gap-2">
                <Settings2 className="w-4 h-4 text-indigo-400" /> Configuration
              </h3>
            </div>
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Nombre de clusters</label>
              <input 
                type="range" 
                min="2" max="6" 
                value={nClusters} 
                onChange={(e) => setNClusters(parseInt(e.target.value))}
                className="w-full h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>2</span>
                <span>{nClusters}</span>
                <span>6</span>
              </div>
            </div>
          </div>

          <div className="glass p-6 rounded-2xl border-l-4 border-emerald-500">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-500/10 rounded-lg">
                <TrendingUp className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400 font-medium lowercase">Silhouette Score</p>
                <h2 className="text-3xl font-bold text-emerald-400">
                  {loading ? '...' : data?.score.toFixed(4)}
                </h2>
              </div>
            </div>
          </div>

          <div className="glass p-6 rounded-2xl border-l-4 border-indigo-500">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-500/10 rounded-lg">
                <Users className="w-5 h-5 text-indigo-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400 font-medium">Total Utilisateurs</p>
                <h2 className="text-3xl font-bold text-indigo-400">
                  {loading ? '...' : data?.clusters.length}
                </h2>
              </div>
            </div>
          </div>
        </div>

        {/* Chart Column */}
        <div className="lg:col-span-2 glass p-6 rounded-2xl min-h-[500px] flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-indigo-400" /> Visualisation des Clusters
            </h3>
            <button 
              onClick={fetchData} 
              className="p-2 hover:bg-white/5 rounded-full transition-colors text-gray-400 hover:text-white"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
          
          <div className="flex-1 w-full flex items-center justify-center">
            {loading ? (
              <div className="text-indigo-400 animate-pulse">Chargement des données...</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                  <XAxis 
                    type="number" 
                    dataKey="age" 
                    name="Âge" 
                    unit=" ans" 
                    stroke="#94a3b8" 
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis 
                    type="number" 
                    dataKey="salary" 
                    name="Salaire" 
                    unit=" $" 
                    stroke="#94a3b8" 
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <ZAxis type="number" range={[60, 60]} />
                  <Tooltip 
                    cursor={{ strokeDasharray: '3 3' }} 
                    contentStyle={{ 
                      backgroundColor: '#1e293b', 
                      borderColor: 'rgba(255,255,255,0.1)',
                      borderRadius: '12px',
                      boxShadow: '0 10px 15px -3px rgba(0,0,0,0.5)'
                    }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Legend />
                  {clusterGroups.map((group, index) => (
                    <Scatter 
                      key={group} 
                      name={`Segment ${group + 1}`} 
                      data={data.clusters.filter(c => c.cluster === group)} 
                      fill={COLORS[index % COLORS.length]}
                    >
                      {data.clusters.filter(c => c.cluster === group).map((entry, idx) => (
                        <Cell key={`cell-${idx}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Scatter>
                  ))}
                </ScatterChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <footer className="flex items-center gap-4 text-gray-500 text-sm glass p-4 rounded-xl justify-center italic">
        <Database className="w-4 h-4" />
        Source des données: Social Network Ads Dataset (Age vs Estimated Salary)
      </footer>
    </div>
  );
}

export default App;
