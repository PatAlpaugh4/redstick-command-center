import React, { useState, useEffect, useRef } from 'react';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

type AgentStatus = 'ACTIVE' | 'INACTIVE' | 'ERROR' | 'RUNNING';
type LogLevel = 'INFO' | 'WARN' | 'ERROR' | 'SUCCESS';
type AgentType = 'Screener' | 'Monitor' | 'Analyst' | 'Researcher';

interface Agent {
  id: string;
  name: string;
  description: string;
  type: AgentType;
  status: AgentStatus;
  lastRun: string;
  successRate: number;
  totalRuns: number;
  config: AgentConfig;
}

interface AgentConfig {
  autoStart: boolean;
  notifications: boolean;
  threshold: number;
  sectors: string[];
  tags: string[];
  maxTokens: number;
  timeout: number;
}

interface LogEntry {
  id: string;
  timestamp: Date;
  level: LogLevel;
  agentId: string;
  message: string;
}

interface ExecutionRecord {
  id: string;
  agentId: string;
  agentName: string;
  startTime: Date;
  endTime: Date;
  duration: number;
  tokensUsed: number;
  status: 'success' | 'failed' | 'cancelled';
  output: string;
}

// ============================================================================
// MOCK DATA
// ============================================================================

const MOCK_AGENTS: Agent[] = [
  {
    id: 'agent-1',
    name: 'Deal Screener',
    description: 'Screens incoming startup deals based on criteria and market fit',
    type: 'Screener',
    status: 'ACTIVE',
    lastRun: '2 mins ago',
    successRate: 94,
    totalRuns: 1247,
    config: {
      autoStart: true,
      notifications: true,
      threshold: 75,
      sectors: ['Fintech', 'AI/ML', 'SaaS'],
      tags: ['Seed', 'Series A', 'B2B'],
      maxTokens: 4000,
      timeout: 300,
    },
  },
  {
    id: 'agent-2',
    name: 'Market Intel',
    description: 'Monitors market trends, competitor moves, and industry news',
    type: 'Analyst',
    status: 'RUNNING',
    lastRun: 'Running now',
    successRate: 88,
    totalRuns: 892,
    config: {
      autoStart: true,
      notifications: false,
      threshold: 60,
      sectors: ['Fintech', 'Healthcare', 'Climate'],
      tags: ['Market Analysis', 'Competitor Intel'],
      maxTokens: 8000,
      timeout: 600,
    },
  },
  {
    id: 'agent-3',
    name: 'Portfolio Monitor',
    description: 'Tracks portfolio company metrics and sends alerts on anomalies',
    type: 'Monitor',
    status: 'INACTIVE',
    lastRun: '3 hours ago',
    successRate: 96,
    totalRuns: 2156,
    config: {
      autoStart: false,
      notifications: true,
      threshold: 85,
      sectors: ['All Portfolio'],
      tags: ['Metrics', 'Alerts', 'Reporting'],
      maxTokens: 2000,
      timeout: 180,
    },
  },
  {
    id: 'agent-4',
    name: 'Due Diligence Assistant',
    description: 'Automates document analysis and due diligence workflows',
    type: 'Researcher',
    status: 'ERROR',
    lastRun: 'Failed 1 hour ago',
    successRate: 76,
    totalRuns: 423,
    config: {
      autoStart: true,
      notifications: true,
      threshold: 90,
      sectors: ['All Sectors'],
      tags: ['DD', 'Legal', 'Financial'],
      maxTokens: 16000,
      timeout: 1200,
    },
  },
];

const INITIAL_LOGS: LogEntry[] = [
  { id: 'log-1', timestamp: new Date(Date.now() - 1000 * 60 * 5), level: 'SUCCESS', agentId: 'agent-1', message: 'Deal Screener completed batch processing - 23 deals analyzed' },
  { id: 'log-2', timestamp: new Date(Date.now() - 1000 * 60 * 4), level: 'INFO', agentId: 'agent-2', message: 'Market Intel started sector analysis for Fintech' },
  { id: 'log-3', timestamp: new Date(Date.now() - 1000 * 60 * 3), level: 'WARN', agentId: 'agent-1', message: 'Deal Screener: Low confidence score on deal #4521' },
  { id: 'log-4', timestamp: new Date(Date.now() - 1000 * 60 * 2), level: 'INFO', agentId: 'agent-3', message: 'Portfolio Monitor paused by user' },
  { id: 'log-5', timestamp: new Date(Date.now() - 1000 * 60), level: 'ERROR', agentId: 'agent-4', message: 'Due Diligence Assistant: API rate limit exceeded' },
];

const MOCK_HISTORY: ExecutionRecord[] = [
  { id: 'run-1', agentId: 'agent-1', agentName: 'Deal Screener', startTime: new Date(Date.now() - 1000 * 60 * 30), endTime: new Date(Date.now() - 1000 * 60 * 28), duration: 120, tokensUsed: 3450, status: 'success', output: 'Analyzed 23 deals, 4 passed initial screening' },
  { id: 'run-2', agentId: 'agent-2', agentName: 'Market Intel', startTime: new Date(Date.now() - 1000 * 60 * 45), endTime: new Date(Date.now() - 1000 * 60 * 40), duration: 300, tokensUsed: 8900, status: 'success', output: 'Generated market report for 5 sectors' },
  { id: 'run-3', agentId: 'agent-4', agentName: 'Due Diligence Assistant', startTime: new Date(Date.now() - 1000 * 60 * 60), endTime: new Date(Date.now() - 1000 * 60 * 58), duration: 120, tokensUsed: 12000, status: 'failed', output: 'Error: Document parsing failed' },
  { id: 'run-4', agentId: 'agent-3', agentName: 'Portfolio Monitor', startTime: new Date(Date.now() - 1000 * 60 * 120), endTime: new Date(Date.now() - 1000 * 60 * 118), duration: 120, tokensUsed: 1800, status: 'success', output: 'Portfolio check complete - no alerts' },
  { id: 'run-5', agentId: 'agent-1', agentName: 'Deal Screener', startTime: new Date(Date.now() - 1000 * 60 * 180), endTime: new Date(Date.now() - 1000 * 60 * 178), duration: 120, tokensUsed: 4200, status: 'success', output: 'Analyzed 31 deals, 7 passed initial screening' },
];

const SECTOR_OPTIONS = ['Fintech', 'AI/ML', 'SaaS', 'Healthcare', 'Climate', 'Consumer', 'Enterprise', 'Deep Tech', 'Biotech'];
const TAG_OPTIONS = ['Seed', 'Series A', 'Series B', 'B2B', 'B2C', 'Market Analysis', 'Competitor Intel', 'Metrics', 'Alerts', 'DD', 'Legal', 'Financial'];

// ============================================================================
// STYLES
// ============================================================================

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#0f0f0f',
    color: '#ffffff',
    padding: '24px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  header: {
    marginBottom: '24px',
  },
  title: {
    fontSize: '28px',
    fontWeight: 700,
    color: '#ffffff',
    margin: '0 0 8px 0',
  },
  subtitle: {
    fontSize: '14px',
    color: '#888888',
    margin: 0,
  },
  mainGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '24px',
  },
  leftColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  rightColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  card: {
    backgroundColor: '#1a1a1a',
    borderRadius: '12px',
    padding: '20px',
    border: '1px solid #2a2a2a',
    transition: 'all 0.3s ease',
  },
  cardHover: {
    borderColor: '#e94560',
    boxShadow: '0 4px 20px rgba(233, 69, 96, 0.15)',
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '16px',
  },
  cardTitle: {
    fontSize: '16px',
    fontWeight: 600,
    color: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  // Agent List Styles
  agentList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  agentCard: {
    backgroundColor: '#252525',
    borderRadius: '10px',
    padding: '16px',
    border: '1px solid #333333',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  agentCardSelected: {
    borderColor: '#e94560',
    backgroundColor: '#2a1f23',
  },
  agentHeader: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  agentInfo: {
    flex: 1,
  },
  agentName: {
    fontSize: '15px',
    fontWeight: 600,
    color: '#ffffff',
    marginBottom: '4px',
  },
  agentDescription: {
    fontSize: '12px',
    color: '#888888',
    lineHeight: 1.4,
  },
  agentTypeBadge: {
    fontSize: '10px',
    fontWeight: 600,
    padding: '4px 10px',
    borderRadius: '20px',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
  },
  agentStats: {
    display: 'flex',
    gap: '16px',
    fontSize: '12px',
    color: '#666666',
  },
  agentStat: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  agentStatValue: {
    color: '#ffffff',
    fontWeight: 500,
  },
  agentActions: {
    display: 'flex',
    gap: '8px',
  },
  // Status Indicator Styles
  statusContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '12px',
    fontWeight: 500,
  },
  statusDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
  },
  // Log Panel Styles
  logContainer: {
    backgroundColor: '#0d0d0d',
    borderRadius: '8px',
    padding: '12px',
    height: '320px',
    overflowY: 'auto' as const,
    fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, monospace',
    fontSize: '12px',
    border: '1px solid #2a2a2a',
  },
  logEntry: {
    padding: '6px 0',
    borderBottom: '1px solid #1a1a1a',
    display: 'flex',
    gap: '12px',
    animation: 'slideIn 0.3s ease',
  },
  logTimestamp: {
    color: '#555555',
    flexShrink: 0,
    minWidth: '60px',
  },
  logLevel: {
    flexShrink: 0,
    minWidth: '50px',
    fontWeight: 600,
  },
  logMessage: {
    color: '#cccccc',
    flex: 1,
    wordBreak: 'break-word' as const,
  },
  logAgent: {
    color: '#e94560',
    flexShrink: 0,
    opacity: 0.7,
  },
  // Config Panel Styles
  configGrid: {
    display: 'grid',
    gap: '20px',
  },
  configSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  configLabel: {
    fontSize: '13px',
    fontWeight: 500,
    color: '#aaaaaa',
  },
  toggleRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '8px 0',
  },
  toggleLabel: {
    fontSize: '14px',
    color: '#ffffff',
  },
  sliderContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  slider: {
    width: '100%',
    height: '6px',
    borderRadius: '3px',
    outline: 'none',
    WebkitAppearance: 'none' as const,
    appearance: 'none' as const,
  },
  sliderValue: {
    fontSize: '14px',
    color: '#e94560',
    fontWeight: 600,
  },
  selectGrid: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: '8px',
  },
  selectOption: {
    padding: '6px 12px',
    borderRadius: '6px',
    fontSize: '12px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    border: '1px solid #333333',
    backgroundColor: '#1a1a1a',
    color: '#888888',
  },
  selectOptionActive: {
    backgroundColor: 'rgba(233, 69, 96, 0.2)',
    borderColor: '#e94560',
    color: '#e94560',
  },
  // Button Styles
  buttonPrimary: {
    backgroundColor: '#e94560',
    color: '#ffffff',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  buttonSecondary: {
    backgroundColor: '#2a2a2a',
    color: '#ffffff',
    border: '1px solid #3a3a3a',
    padding: '10px 20px',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  buttonDanger: {
    backgroundColor: '#dc2626',
    color: '#ffffff',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  buttonSmall: {
    padding: '6px 12px',
    fontSize: '11px',
  },
  // History Table Styles
  historyTable: {
    width: '100%',
    borderCollapse: 'collapse' as const,
    fontSize: '13px',
  },
  historyTh: {
    textAlign: 'left' as const,
    padding: '12px 8px',
    color: '#888888',
    fontWeight: 500,
    borderBottom: '1px solid #2a2a2a',
    fontSize: '11px',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
  },
  historyTd: {
    padding: '12px 8px',
    borderBottom: '1px solid #1a1a1a',
    color: '#cccccc',
  },
  historyStatus: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '4px 10px',
    borderRadius: '20px',
    fontSize: '11px',
    fontWeight: 600,
  },
  // Modal Styles
  modalOverlay: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    animation: 'fadeIn 0.2s ease',
  },
  modal: {
    backgroundColor: '#1a1a1a',
    borderRadius: '16px',
    padding: '24px',
    width: '90%',
    maxWidth: '600px',
    maxHeight: '80vh',
    overflowY: 'auto' as const,
    border: '1px solid #2a2a2a',
    animation: 'slideUp 0.3s ease',
  },
  modalHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '20px',
  },
  modalTitle: {
    fontSize: '18px',
    fontWeight: 600,
    margin: 0,
  },
};

// ============================================================================
// HELPER COMPONENTS
// ============================================================================

const StatusDot: React.FC<{ status: AgentStatus }> = ({ status }) => {
  const colorMap: Record<AgentStatus, string> = {
    ACTIVE: '#22c55e',
    INACTIVE: '#6b7280',
    ERROR: '#dc2626',
    RUNNING: '#3b82f6',
  };

  const shouldPulse = status === 'ACTIVE' || status === 'RUNNING';

  return (
    <span style={{ position: 'relative', display: 'inline-block' }}>
      <span
        style={{
          ...styles.statusDot,
          backgroundColor: colorMap[status],
        }}
      />
      {shouldPulse && (
        <span
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: colorMap[status],
            animation: 'pulse 2s infinite',
          }}
        />
      )}
    </span>
  );
};

const TypeBadge: React.FC<{ type: AgentType }> = ({ type }) => {
  const colorMap: Record<AgentType, string> = {
    Screener: '#e94560',
    Monitor: '#3b82f6',
    Analyst: '#22c55e',
    Researcher: '#f59e0b',
  };

  return (
    <span
      style={{
        ...styles.agentTypeBadge,
        backgroundColor: `${colorMap[type]}20`,
        color: colorMap[type],
      }}
    >
      {type}
    </span>
  );
};

const Toggle: React.FC<{
  checked: boolean;
  onChange: (checked: boolean) => void;
}> = ({ checked, onChange }) => (
  <button
    onClick={() => onChange(!checked)}
    style={{
      width: '44px',
      height: '24px',
      borderRadius: '12px',
      border: 'none',
      backgroundColor: checked ? '#e94560' : '#3a3a3a',
      position: 'relative',
      cursor: 'pointer',
      transition: 'background-color 0.2s ease',
    }}
  >
    <span
      style={{
        position: 'absolute',
        top: '2px',
        left: checked ? '22px' : '2px',
        width: '20px',
        height: '20px',
        borderRadius: '50%',
        backgroundColor: '#ffffff',
        transition: 'left 0.2s ease',
        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
      }}
    />
  </button>
);

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const AgentControlPanel: React.FC = () => {
  const [agents, setAgents] = useState<Agent[]>(MOCK_AGENTS);
  const [selectedAgent, setSelectedAgent] = useState<Agent>(MOCK_AGENTS[0]);
  const [logs, setLogs] = useState<LogEntry[]>(INITIAL_LOGS);
  const [config, setConfig] = useState<AgentConfig>(MOCK_AGENTS[0].config);
  const [history, setHistory] = useState<ExecutionRecord[]>(MOCK_HISTORY);
  const [selectedRun, setSelectedRun] = useState<ExecutionRecord | null>(null);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const logRef = useRef<HTMLDivElement>(null);

  // Auto-scroll logs to bottom
  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [logs]);

  // Simulate streaming logs
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        const newLog: LogEntry = {
          id: `log-${Date.now()}`,
          timestamp: new Date(),
          level: ['INFO', 'WARN', 'SUCCESS'][Math.floor(Math.random() * 3)] as LogLevel,
          agentId: selectedAgent.id,
          message: `Agent activity detected - processing queue item #${Math.floor(Math.random() * 1000)}`,
        };
        setLogs((prev) => [...prev.slice(-50), newLog]);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [selectedAgent.id]);

  // Update config when agent changes
  useEffect(() => {
    setConfig(selectedAgent.config);
  }, [selectedAgent]);

  const handleStartStop = (agentId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setAgents((prev) =>
      prev.map((agent) =>
        agent.id === agentId
          ? {
              ...agent,
              status:
                agent.status === 'ACTIVE' || agent.status === 'RUNNING'
                  ? 'INACTIVE'
                  : 'ACTIVE',
              lastRun:
                agent.status === 'ACTIVE' || agent.status === 'RUNNING'
                  ? 'Just now'
                  : agent.lastRun,
            }
          : agent
      )
    );
  };

  const handleSaveConfig = () => {
    setAgents((prev) =>
      prev.map((agent) =>
        agent.id === selectedAgent.id ? { ...agent, config } : agent
      )
    );
    // Add log entry
    const newLog: LogEntry = {
      id: `log-${Date.now()}`,
      timestamp: new Date(),
      level: 'SUCCESS',
      agentId: selectedAgent.id,
      message: 'Configuration saved successfully',
    };
    setLogs((prev) => [...prev, newLog]);
  };

  const handleClearLogs = () => {
    setLogs([]);
  };

  const toggleSector = (sector: string) => {
    setConfig((prev) => ({
      ...prev,
      sectors: prev.sectors.includes(sector)
        ? prev.sectors.filter((s) => s !== sector)
        : [...prev.sectors, sector],
    }));
  };

  const toggleTag = (tag: string) => {
    setConfig((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter((t) => t !== tag)
        : [...prev.tags, tag],
    }));
  };

  const getLogLevelColor = (level: LogLevel) => {
    const colors: Record<LogLevel, string> = {
      INFO: '#3b82f6',
      WARN: '#f59e0b',
      ERROR: '#dc2626',
      SUCCESS: '#22c55e',
    };
    return colors[level];
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
  };

  const formatDuration = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
  };

  return (
    <div style={styles.container}>
      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(2.5); opacity: 0; }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-10px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: #1a1a1a; border-radius: 3px; }
        ::-webkit-scrollbar-thumb { background: #3a3a3a; border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: #4a4a4a; }
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #e94560;
          cursor: pointer;
        }
        input[type="range"]::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #e94560;
          cursor: pointer;
          border: none;
        }
      `}</style>

      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>Agent Control Panel</h1>
        <p style={styles.subtitle}>Manage AI agents, monitor logs, and configure settings</p>
      </div>

      {/* Main Grid */}
      <div style={styles.mainGrid}>
        {/* Left Column */}
        <div style={styles.leftColumn}>
          {/* Agent List */}
          <div
            style={{
              ...styles.card,
              ...(hoveredCard === 'agent-list' ? styles.cardHover : {}),
            }}
            onMouseEnter={() => setHoveredCard('agent-list')}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div style={styles.cardHeader}>
              <div style={styles.cardTitle}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="7" height="7" rx="1" />
                  <rect x="14" y="3" width="7" height="7" rx="1" />
                  <rect x="3" y="14" width="7" height="7" rx="1" />
                  <rect x="14" y="14" width="7" height="7" rx="1" />
                </svg>
                Agents ({agents.length})
              </div>
            </div>
            <div style={styles.agentList}>
              {agents.map((agent) => (
                <div
                  key={agent.id}
                  style={{
                    ...styles.agentCard,
                    ...(selectedAgent.id === agent.id ? styles.agentCardSelected : {}),
                  }}
                  onClick={() => setSelectedAgent(agent)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.borderColor = '#3a3a3a';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.borderColor =
                      selectedAgent.id === agent.id ? '#e94560' : '#333333';
                  }}
                >
                  <div style={styles.agentHeader}>
                    <div style={styles.agentInfo}>
                      <div style={styles.agentName}>{agent.name}</div>
                      <div style={styles.agentDescription}>{agent.description}</div>
                    </div>
                    <TypeBadge type={agent.type} />
                  </div>
                  <div style={styles.agentStats}>
                    <div style={styles.agentStat}>
                      <StatusDot status={agent.status} />
                      <span style={{ color: '#ffffff' }}>{agent.status}</span>
                    </div>
                    <div style={styles.agentStat}>
                      <span>Last run:</span>
                      <span style={styles.agentStatValue}>{agent.lastRun}</span>
                    </div>
                    <div style={styles.agentStat}>
                      <span>Success:</span>
                      <span style={styles.agentStatValue}>{agent.successRate}%</span>
                    </div>
                    <div style={styles.agentStat}>
                      <span>Total:</span>
                      <span style={styles.agentStatValue}>{agent.totalRuns.toLocaleString()}</span>
                    </div>
                  </div>
                  <div style={styles.agentActions}>
                    <button
                      style={{
                        ...styles.buttonPrimary,
                        ...styles.buttonSmall,
                        opacity:
                          agent.status === 'ACTIVE' || agent.status === 'RUNNING' ? 0.5 : 1,
                      }}
                      onClick={(e) => handleStartStop(agent.id, e)}
                      disabled={agent.status === 'RUNNING'}
                    >
                      {agent.status === 'ACTIVE' || agent.status === 'RUNNING'
                        ? 'Stop'
                        : 'Start'}
                    </button>
                    <button
                      style={{ ...styles.buttonSecondary, ...styles.buttonSmall }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedAgent(agent);
                      }}
                    >
                      Configure
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Logs Panel */}
          <div
            style={{
              ...styles.card,
              ...(hoveredCard === 'logs' ? styles.cardHover : {}),
            }}
            onMouseEnter={() => setHoveredCard('logs')}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div style={styles.cardHeader}>
              <div style={styles.cardTitle}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <polyline points="10 9 9 9 8 9" />
                </svg>
                Agent Logs
              </div>
              <button
                style={{ ...styles.buttonSecondary, ...styles.buttonSmall }}
                onClick={handleClearLogs}
              >
                Clear
              </button>
            </div>
            <div ref={logRef} style={styles.logContainer}>
              {logs.length === 0 ? (
                <div style={{ color: '#555555', textAlign: 'center', paddingTop: '40px' }}>
                  No logs available
                </div>
              ) : (
                logs.map((log) => (
                  <div key={log.id} style={styles.logEntry}>
                    <span style={styles.logTimestamp}>{formatTime(log.timestamp)}</span>
                    <span
                      style={{
                        ...styles.logLevel,
                        color: getLogLevelColor(log.level),
                      }}
                    >
                      {log.level}
                    </span>
                    <span style={styles.logAgent}>
                      {agents.find((a) => a.id === log.agentId)?.name || log.agentId}
                    </span>
                    <span style={styles.logMessage}>{log.message}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div style={styles.rightColumn}>
          {/* Configuration Panel */}
          <div
            style={{
              ...styles.card,
              ...(hoveredCard === 'config' ? styles.cardHover : {}),
            }}
            onMouseEnter={() => setHoveredCard('config')}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div style={styles.cardHeader}>
              <div style={styles.cardTitle}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="3" />
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                </svg>
                Configuration - {selectedAgent.name}
              </div>
            </div>
            <div style={styles.configGrid}>
              {/* Toggle Switches */}
              <div style={styles.configSection}>
                <div style={styles.configLabel}>General Settings</div>
                <div style={styles.toggleRow}>
                  <span style={styles.toggleLabel}>Auto-start on system boot</span>
                  <Toggle
                    checked={config.autoStart}
                    onChange={(checked) => setConfig({ ...config, autoStart: checked })}
                  />
                </div>
                <div style={styles.toggleRow}>
                  <span style={styles.toggleLabel}>Enable notifications</span>
                  <Toggle
                    checked={config.notifications}
                    onChange={(checked) => setConfig({ ...config, notifications: checked })}
                  />
                </div>
              </div>

              {/* Threshold Slider */}
              <div style={styles.configSection}>
                <div style={styles.configLabel}>Confidence Threshold</div>
                <div style={styles.sliderContainer}>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={config.threshold}
                    onChange={(e) =>
                      setConfig({ ...config, threshold: parseInt(e.target.value) })
                    }
                    style={{
                      ...styles.slider,
                      background: `linear-gradient(to right, #e94560 0%, #e94560 ${config.threshold}%, #2a2a2a ${config.threshold}%, #2a2a2a 100%)`,
                    }}
                  />
                  <span style={styles.sliderValue}>{config.threshold}%</span>
                </div>
              </div>

              {/* Max Tokens Slider */}
              <div style={styles.configSection}>
                <div style={styles.configLabel}>Max Tokens</div>
                <div style={styles.sliderContainer}>
                  <input
                    type="range"
                    min="1000"
                    max="32000"
                    step="1000"
                    value={config.maxTokens}
                    onChange={(e) =>
                      setConfig({ ...config, maxTokens: parseInt(e.target.value) })
                    }
                    style={{
                      ...styles.slider,
                      background: `linear-gradient(to right, #e94560 0%, #e94560 ${
                        ((config.maxTokens - 1000) / 31000) * 100
                      }%, #2a2a2a ${((config.maxTokens - 1000) / 31000) * 100}%, #2a2a2a 100%)`,
                    }}
                  />
                  <span style={styles.sliderValue}>{config.maxTokens.toLocaleString()}</span>
                </div>
              </div>

              {/* Multi-select Sectors */}
              <div style={styles.configSection}>
                <div style={styles.configLabel}>Target Sectors</div>
                <div style={styles.selectGrid}>
                  {SECTOR_OPTIONS.map((sector) => (
                    <button
                      key={sector}
                      style={{
                        ...styles.selectOption,
                        ...(config.sectors.includes(sector) ? styles.selectOptionActive : {}),
                      }}
                      onClick={() => toggleSector(sector)}
                    >
                      {sector}
                    </button>
                  ))}
                </div>
              </div>

              {/* Multi-select Tags */}
              <div style={styles.configSection}>
                <div style={styles.configLabel}>Tags</div>
                <div style={styles.selectGrid}>
                  {TAG_OPTIONS.map((tag) => (
                    <button
                      key={tag}
                      style={{
                        ...styles.selectOption,
                        ...(config.tags.includes(tag) ? styles.selectOptionActive : {}),
                      }}
                      onClick={() => toggleTag(tag)}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Save Button */}
              <button
                style={{
                  ...styles.buttonPrimary,
                  width: '100%',
                  marginTop: '8px',
                }}
                onClick={handleSaveConfig}
              >
                Save Configuration
              </button>
            </div>
          </div>

          {/* Execution History */}
          <div
            style={{
              ...styles.card,
              ...(hoveredCard === 'history' ? styles.cardHover : {}),
            }}
            onMouseEnter={() => setHoveredCard('history')}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div style={styles.cardHeader}>
              <div style={styles.cardTitle}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                Execution History
              </div>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={styles.historyTable}>
                <thead>
                  <tr>
                    <th style={styles.historyTh}>Agent</th>
                    <th style={styles.historyTh}>Duration</th>
                    <th style={styles.historyTh}>Tokens</th>
                    <th style={styles.historyTh}>Status</th>
                    <th style={styles.historyTh}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((run) => (
                    <tr key={run.id}>
                      <td style={styles.historyTd}>{run.agentName}</td>
                      <td style={styles.historyTd}>{formatDuration(run.duration)}</td>
                      <td style={styles.historyTd}>{run.tokensUsed.toLocaleString()}</td>
                      <td style={styles.historyTd}>
                        <span
                          style={{
                            ...styles.historyStatus,
                            backgroundColor:
                              run.status === 'success'
                                ? 'rgba(34, 197, 94, 0.2)'
                                : run.status === 'failed'
                                ? 'rgba(220, 38, 38, 0.2)'
                                : 'rgba(107, 114, 128, 0.2)',
                            color:
                              run.status === 'success'
                                ? '#22c55e'
                                : run.status === 'failed'
                                ? '#dc2626'
                                : '#6b7280',
                          }}
                        >
                          <span
                            style={{
                              width: '6px',
                              height: '6px',
                              borderRadius: '50%',
                              backgroundColor: 'currentColor',
                            }}
                          />
                          {run.status.charAt(0).toUpperCase() + run.status.slice(1)}
                        </span>
                      </td>
                      <td style={styles.historyTd}>
                        <button
                          style={{
                            ...styles.buttonSecondary,
                            ...styles.buttonSmall,
                            padding: '4px 10px',
                          }}
                          onClick={() => setSelectedRun(run)}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Run Details Modal */}
      {selectedRun && (
        <div style={styles.modalOverlay} onClick={() => setSelectedRun(null)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>Run Details</h3>
              <button
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#888888',
                  cursor: 'pointer',
                  fontSize: '20px',
                  padding: '4px',
                }}
                onClick={() => setSelectedRun(null)}
              >
                ×
              </button>
            </div>
            <div style={{ marginBottom: '16px' }}>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '16px',
                  marginBottom: '20px',
                }}
              >
                <div>
                  <div style={{ ...styles.configLabel, marginBottom: '4px' }}>
                    Agent
                  </div>
                  <div style={{ color: '#ffffff', fontSize: '14px' }}>
                    {selectedRun.agentName}
                  </div>
                </div>
                <div>
                  <div style={{ ...styles.configLabel, marginBottom: '4px' }}>
                    Status
                  </div>
                  <span
                    style={{
                      ...styles.historyStatus,
                      backgroundColor:
                        selectedRun.status === 'success'
                          ? 'rgba(34, 197, 94, 0.2)'
                          : selectedRun.status === 'failed'
                          ? 'rgba(220, 38, 38, 0.2)'
                          : 'rgba(107, 114, 128, 0.2)',
                      color:
                        selectedRun.status === 'success'
                          ? '#22c55e'
                          : selectedRun.status === 'failed'
                          ? '#dc2626'
                          : '#6b7280',
                    }}
                  >
                    <span
                      style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        backgroundColor: 'currentColor',
                      }}
                    />
                    {selectedRun.status.charAt(0).toUpperCase() +
                      selectedRun.status.slice(1)}
                  </span>
                </div>
                <div>
                  <div style={{ ...styles.configLabel, marginBottom: '4px' }}>
                    Duration
                  </div>
                  <div style={{ color: '#ffffff', fontSize: '14px' }}>
                    {formatDuration(selectedRun.duration)}
                  </div>
                </div>
                <div>
                  <div style={{ ...styles.configLabel, marginBottom: '4px' }}>
                    Tokens Used
                  </div>
                  <div style={{ color: '#ffffff', fontSize: '14px' }}>
                    {selectedRun.tokensUsed.toLocaleString()}
                  </div>
                </div>
                <div>
                  <div style={{ ...styles.configLabel, marginBottom: '4px' }}>
                    Start Time
                  </div>
                  <div style={{ color: '#ffffff', fontSize: '14px' }}>
                    {selectedRun.startTime.toLocaleString()}
                  </div>
                </div>
                <div>
                  <div style={{ ...styles.configLabel, marginBottom: '4px' }}>
                    End Time
                  </div>
                  <div style={{ color: '#ffffff', fontSize: '14px' }}>
                    {selectedRun.endTime.toLocaleString()}
                  </div>
                </div>
              </div>
              <div style={styles.configLabel}>Output</div>
              <div
                style={{
                  backgroundColor: '#0d0d0d',
                  borderRadius: '8px',
                  padding: '16px',
                  fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, monospace',
                  fontSize: '13px',
                  color: '#cccccc',
                  border: '1px solid #2a2a2a',
                  whiteSpace: 'pre-wrap',
                  lineHeight: 1.6,
                }}
              >
                {selectedRun.output}
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                style={styles.buttonSecondary}
                onClick={() => setSelectedRun(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgentControlPanel;
