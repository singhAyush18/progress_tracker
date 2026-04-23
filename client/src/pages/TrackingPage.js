import React, { useEffect, useState } from 'react';
import { getStudyStats, getTrackingInsights } from '../api';
import StreakGraph from '../components/StreakGraph.jsx';
import './css/tracking.css';

const TrackingPage = () => {
  const [insights, setInsights] = useState(null);
  const [stats, setStats] = useState(null);
  const [activeTab, setActiveTab] = useState('insights');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTrackingData = async () => {
      setLoading(true);
      setError('');
      try {
        const [insightsRes, statsRes] = await Promise.all([
          getTrackingInsights(),
          getStudyStats()
        ]);
        setInsights(insightsRes.data?.insights || null);
        setStats(statsRes.data || null);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load tracking data');
      } finally {
        setLoading(false);
      }
    };

    fetchTrackingData();
  }, []);

  const getConsistencyColor = (level) => {
    switch (level) {
      case 'Easy': return '#10b981';
      case 'Medium': return '#f59e0b';
      case 'Hard': return '#ef4444';
      default: return '#6b7280';
    }
  };

  if (loading) {
    return (
      <div className="tracking-page" style={{ textAlign: 'center', padding: '4rem 1rem' }}>
        <h2>Loading AI tracking insights...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="tracking-page" style={{ textAlign: 'center', padding: '4rem 1rem' }}>
        <h2>Tracking data could not be loaded</h2>
        <p style={{ color: 'red' }}>{error}</p>
      </div>
    );
  }

  const summary = insights?.performanceOverview || {};
  const strengths = insights?.strengthsWeaknesses || { strengths: [], weaknesses: [], analysis: '' };
  const productivity = insights?.productivityInsights || {};
  const efficiency = insights?.learningEfficiency || {};
  const feedback = insights?.aiFeedback || { recommendations: [], strategies: '' };
  const benchmark = insights?.competitiveBenchmarking || {};

  return (
    <div className="tracking-page">
      <div className="tracking-header">
        <h1>AI Study Insights</h1>
        <p>Personalized analysis of your study patterns and recommendations</p>
      </div>

      {/* ✅ Tab Navigation */}
      <div className="tab-navigation">
        <button
          className={`tab-button ${activeTab === 'insights' ? 'active' : ''}`}
          onClick={() => setActiveTab('insights')}
        >
          AI Insights
        </button>
        <button
          className={`tab-button ${activeTab === 'stats' ? 'active' : ''}`}
          onClick={() => setActiveTab('stats')}
        >
          Study Statistics
        </button>
        <button
          className={`tab-button ${activeTab === 'streakgraph' ? 'active' : ''}`}
          onClick={() => setActiveTab('streakgraph')}
        >
          Streak Graph
        </button>
      </div>

      {activeTab === 'insights' && (
        <div className="insights-container">
          <div className="insight-card">
            <h3>📊 Performance Overview</h3>
            <div className="performance-grid">
              <div className="performance-item">
                <strong>Total Study Hours:</strong> {summary.totalStudyHours || 'N/A'}
              </div>
              <div className="performance-item">
                <strong>Weekly Report:</strong> {summary.weeklyReport || 'No weekly data available.'}
              </div>
              <div className="performance-item">
                <strong>Monthly Report:</strong> {summary.monthlyReport || 'No monthly data available.'}
              </div>
              <div className="performance-item">
                <strong>6-Month Report:</strong> {summary.sixMonthlyReport || 'No 6-month data available.'}
              </div>
              <div className="performance-item">
                <strong>Yearly Report:</strong> {summary.yearlyReport || 'No yearly data available.'}
              </div>
              <div className="performance-item">
                <strong>Summary:</strong> {summary.summary || 'No summary available.'}
              </div>
            </div>
          </div>

          <div className="insight-card">
            <h3>🎯 Strengths & Weaknesses</h3>
            <div className="strengths-weaknesses">
              <div className="strengths">
                <h4>Strengths</h4>
                <ul>
                  {strengths.strengths.length > 0 ? strengths.strengths.map((item, index) => <li key={index}>{item}</li>) : <li>No strengths identified</li>}
                </ul>
              </div>
              <div className="weaknesses">
                <h4>Weaknesses</h4>
                <ul>
                  {strengths.weaknesses.length > 0 ? strengths.weaknesses.map((item, index) => <li key={index}>{item}</li>) : <li>No weaknesses identified</li>}
                </ul>
              </div>
            </div>
            <p><strong>Analysis:</strong> {strengths.analysis || 'No analysis available.'}</p>
          </div>

          <div className="insight-card">
            <h3>⚡ Productivity Insights</h3>
            <div className="productivity-content">
              <div className="insight-item">
                <strong>Data-driven insights:</strong> {productivity.dataDrivenInsights || 'No insights available.'}
              </div>
              <div className="insight-item">
                <strong>Study patterns:</strong> {productivity.studyPatterns || 'No patterns available.'}
              </div>
              <div className="insight-item">
                <strong>Recommendations:</strong> {productivity.recommendations || 'No recommendations available.'}
              </div>
            </div>
          </div>

          <div className="insight-card">
            <h3>🧠 Learning Efficiency</h3>
            <div className="efficiency-content">
              <div className="efficiency-item">
                <strong>Retention:</strong> {efficiency.retention || 'N/A'}</div>
              <div className="efficiency-item">
                <strong>Efficiency score:</strong> {efficiency.efficiencyScore || 'N/A'}</div>
              <div className="efficiency-item">
                <strong>Improvement areas:</strong> {efficiency.improvementAreas || 'N/A'}</div>
            </div>
          </div>

          <div className="insight-card">
            <h3>🤖 AI Feedback</h3>
            <div className="feedback-content">
              <div className="recommendations">
                <h4>Recommendations</h4>
                <ul>
                  {feedback.recommendations.length > 0 ? feedback.recommendations.map((item, index) => <li key={index}>{item}</li>) : <li>No recommendations available.</li>}
                </ul>
              </div>
              <div className="strategies">
                <h4>Strategies</h4>
                <p>{feedback.strategies || 'No strategy suggestions available.'}</p>
              </div>
            </div>
          </div>

          <div className="insight-card">
            <h3>🏆 Competitive Benchmarking</h3>
            <div className="benchmarking-content">
              <div className="benchmark-item">
                <strong>Current rank:</strong> {benchmark.currentRank || 'N/A'}</div>
              <div className="benchmark-item">
                <strong>Improvement areas:</strong>
                <ul>
                  {benchmark.improvementAreas?.length > 0 ? benchmark.improvementAreas.map((item, index) => <li key={index}>{item}</li>) : <li>No benchmark hints available.</li>}
                </ul>
              </div>
              <div className="benchmark-item">
                <strong>Path to top 1%:</strong> {benchmark.top1PercentPath || 'No path available.'}</div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'stats' && (
        <div className="stats-container">
          <div className="stats-header">
            <h3>📈 Study Statistics</h3>
            <p>Live metrics from your backend data</p>
          </div>
          <div className="stats-grid">
            <div className="stat-card">
              <h4>Total Tasks</h4>
              <p className="stat-value">{stats?.totalTasks ?? '0'}</p>
            </div>
            <div className="stat-card">
              <h4>Total Study Hours</h4>
              <p className="stat-value">{stats?.totalStudyHours ?? '0'}</p>
            </div>
            <div className="stat-card">
              <h4>Study Streak</h4>
              <p className="stat-value">{stats?.studyStreak ?? '0'} days</p>
            </div>
            <div className="stat-card">
              <h4>Average Task Duration</h4>
              <p className="stat-value">{stats?.averageTaskDuration ?? '0'} hrs</p>
            </div>
          </div>
          <div className="data-status">
            <p><strong>Current Month:</strong> {stats?.monthlyProgress?.month || 'N/A'}</p>
            <p><strong>Tasks this month:</strong> {stats?.monthlyProgress?.totalTasks ?? '0'}</p>
            <p><strong>Hours this month:</strong> {stats?.monthlyProgress?.totalHours ?? '0'}</p>
          </div>
        </div>
      )}

      {activeTab === 'streakgraph' && <StreakGraph />}
    </div>
  );
};

export default TrackingPage;
