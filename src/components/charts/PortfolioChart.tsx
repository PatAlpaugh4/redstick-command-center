'use client';

import React, { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  ReferenceLine,
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { ZoomIn, ZoomOut, RotateCcw, Maximize2 } from 'lucide-react';
import { usePinchZoom, useSwipe } from '@/hooks';

interface PortfolioData {
  month: string;
  deployed: number;
  realized: number;
  unrealized: number;
}

interface PortfolioChartProps {
  data?: PortfolioData[];
  isLoading?: boolean;
  /** 
   * Chart height - can be number (pixels) or 'responsive' for auto-sizing
   * @default 'responsive'
   */
  height?: number | 'responsive';
  enableZoom?: boolean;
}

const mockData: PortfolioData[] = [
  { month: 'Jan', deployed: 2.4, realized: 0, unrealized: 2.4 },
  { month: 'Feb', deployed: 3.8, realized: 0, unrealized: 3.8 },
  { month: 'Mar', deployed: 5.2, realized: 0.8, unrealized: 4.4 },
  { month: 'Apr', deployed: 7.1, realized: 1.2, unrealized: 5.9 },
  { month: 'May', deployed: 8.5, realized: 1.5, unrealized: 7.0 },
  { month: 'Jun', deployed: 12.3, realized: 2.1, unrealized: 10.2 },
  { month: 'Jul', deployed: 15.2, realized: 3.5, unrealized: 11.7 },
  { month: 'Aug', deployed: 18.5, realized: 4.2, unrealized: 14.3 },
  { month: 'Sep', deployed: 22.1, realized: 5.8, unrealized: 16.3 },
  { month: 'Oct', deployed: 25.4, realized: 7.2, unrealized: 18.2 },
  { month: 'Nov', deployed: 28.9, realized: 8.5, unrealized: 20.4 },
  { month: 'Dec', deployed: 32.5, realized: 10.1, unrealized: 22.4 },
];

const formatCurrency = (value: number): string => {
  return `$${value.toFixed(1)}M`;
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-surface border border-border rounded-lg p-3 shadow-lg">
        <p className="text-text-primary font-medium mb-2">{label}</p>
        <div className="space-y-1">
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2">
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-text-secondary text-sm capitalize">
                {entry.dataKey}:
              </span>
              <span className="text-text-primary font-medium text-sm">
                {formatCurrency(entry.value)}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

const Shimmer = () => (
  <div className="absolute inset-0 flex flex-col justify-between p-4">
    <div className="h-4 bg-white/5 rounded animate-pulse w-1/4" />
    <div className="flex-1 mx-8 my-4 relative">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-[shimmer_2s_infinite]" />
      <svg className="w-full h-full">
        <defs>
          <linearGradient id="shimmerGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(255,255,255,0.05)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0.02)" />
          </linearGradient>
        </defs>
        <path
          d="M0,80 Q50,60 100,70 T200,50 T300,40 T400,30 T500,20 T600,15"
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="2"
        />
        <path
          d="M0,80 Q50,60 100,70 T200,50 T300,40 T400,30 T500,20 T600,15 L600,150 L0,150 Z"
          fill="url(#shimmerGradient)"
        />
      </svg>
    </div>
    <div className="flex justify-between">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="h-3 bg-white/5 rounded animate-pulse w-8" />
      ))}
    </div>
  </div>
);

export const PortfolioChart: React.FC<PortfolioChartProps> = ({
  data = mockData,
  isLoading = false,
  height = 'responsive',
  enableZoom = true,
}) => {
  // Use responsive height classes when height is 'responsive'
  const containerHeight = height === 'responsive' ? '100%' : `${height}px`;
  const containerClass = height === 'responsive' ? 'h-48 sm:h-64 lg:h-80' : '';
  const [showZoomHint, setShowZoomHint] = useState(true);
  
  // Pinch zoom functionality
  const {
    state: zoomState,
    handlers: zoomHandlers,
    zoomIn,
    zoomOut,
    reset: resetZoom,
    canZoomIn,
    canZoomOut,
  } = usePinchZoom({
    minScale: 1,
    maxScale: 3,
    initialScale: 1,
    step: 0.2,
  });

  // Swipe to pan when zoomed
  const { handlers: swipeHandlers } = useSwipe({
    onSwipeLeft: () => {
      // Pan left when zoomed in
      if (zoomState.scale > 1) {
        // Custom pan logic can be added here
      }
    },
    onSwipeRight: () => {
      // Pan right when zoomed in
      if (zoomState.scale > 1) {
        // Custom pan logic can be added here
      }
    },
    axis: 'x',
    threshold: 50,
  });

  // Merge handlers for touch interactions
  const mergedHandlers = {
    onTouchStart: (e: React.TouchEvent) => {
      zoomHandlers.onTouchStart(e);
      swipeHandlers.onTouchStart(e);
    },
    onTouchMove: (e: React.TouchEvent) => {
      zoomHandlers.onTouchMove(e);
      swipeHandlers.onTouchMove(e);
    },
    onTouchEnd: (e: React.TouchEvent) => {
      zoomHandlers.onTouchEnd(e);
      swipeHandlers.onTouchEnd(e);
    },
    onWheel: zoomHandlers.onWheel,
  };

  // Hide zoom hint after 3 seconds
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setShowZoomHint(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className={`relative ${containerClass}`} style={{ height: containerHeight }}>
        <Shimmer />
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div
        className={`flex items-center justify-center text-text-tertiary ${containerClass}`}
        style={{ height: containerHeight }}
      >
        <div className="text-center">
          <svg
            className="w-12 h-12 mx-auto mb-2 opacity-50"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
            />
          </svg>
          <p className="text-sm">No portfolio data available</p>
        </div>
      </div>
    );
  }

  // Calculate visible data range based on zoom
  const visibleDataPoints = Math.max(3, Math.floor(data.length / zoomState.scale));
  const startIndex = Math.max(0, data.length - visibleDataPoints);
  const visibleData = data.slice(startIndex);

  return (
    <div className={`relative ${containerClass}`} style={{ height: containerHeight }}>
      {/* Zoom Controls */}
      {enableZoom && (
        <div className="absolute top-2 right-2 z-10 flex items-center gap-1 bg-[#1a1a2e]/80 backdrop-blur-sm rounded-lg p-1 border border-white/10">
          <button
            onClick={zoomOut}
            disabled={!canZoomOut}
            className="p-1.5 rounded hover:bg-white/10 text-white/70 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors touch-target"
            aria-label="Zoom out"
            title="Zoom out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          
          <div className="px-2 py-1 min-w-[50px] text-center">
            <span className="text-xs font-medium text-white/80">
              {Math.round(zoomState.scale * 100)}%
            </span>
          </div>
          
          <button
            onClick={zoomIn}
            disabled={!canZoomIn}
            className="p-1.5 rounded hover:bg-white/10 text-white/70 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors touch-target"
            aria-label="Zoom in"
            title="Zoom in"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          
          <div className="w-px h-4 bg-white/10 mx-1" />
          
          <button
            onClick={resetZoom}
            className="p-1.5 rounded hover:bg-white/10 text-white/70 hover:text-white transition-colors touch-target"
            aria-label="Reset zoom"
            title="Reset zoom"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Zoom Hint */}
      <AnimatePresence>
        {enableZoom && showZoomHint && zoomState.scale === 1 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-2 left-2 z-10 flex items-center gap-2 px-3 py-1.5 bg-[#e94560]/90 backdrop-blur-sm rounded-lg text-white text-xs"
          >
            <Maximize2 className="w-3 h-3" />
            <span>Pinch or scroll to zoom</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pinching Indicator */}
      {zoomState.isPinching && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none"
        >
          <div className="bg-[#1a1a2e]/90 backdrop-blur-sm rounded-full px-4 py-2 border border-white/10">
            <span className="text-white font-medium">
              {Math.round(zoomState.scale * 100)}%
            </span>
          </div>
        </motion.div>
      )}

      {/* Chart Container with Zoom Handlers */}
      <div
        {...mergedHandlers}
        className={`${enableZoom ? 'touch-pinch-zoom' : ''}`}
        style={{
          transform: `scale(${zoomState.scale === 1 ? 1 : 1})`,
          transformOrigin: 'center center',
        }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={visibleData}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="deployedGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#e94560" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#e94560" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="realizedGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="unrealizedGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.05)"
              vertical={false}
            />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#6a6a7a', fontSize: zoomState.scale > 1.5 ? 10 : 12 }}
              dy={10}
              interval={zoomState.scale > 1.5 ? 0 : 'preserveStartEnd'}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#6a6a7a', fontSize: 12 }}
              tickFormatter={(value) => `$${value}M`}
              dx={-10}
              domain={[0, 'auto']}
            />
            <Tooltip content={<CustomTooltip />} />
            
            {/* Reference line for current zoom level */}
            {zoomState.scale > 1 && (
              <ReferenceLine 
                y={0} 
                stroke="rgba(233,69,96,0.3)" 
                strokeDasharray="5 5" 
              />
            )}
            
            <Area
              type="monotone"
              dataKey="deployed"
              stroke="none"
              fill="url(#deployedGradient)"
            />
            <Area
              type="monotone"
              dataKey="realized"
              stroke="none"
              fill="url(#realizedGradient)"
            />
            <Area
              type="monotone"
              dataKey="unrealized"
              stroke="none"
              fill="url(#unrealizedGradient)"
            />
            <Line
              type="monotone"
              dataKey="deployed"
              stroke="#e94560"
              strokeWidth={2}
              dot={{ fill: '#e94560', strokeWidth: 0, r: zoomState.scale > 1.5 ? 5 : 3 }}
              activeDot={{ r: 5, stroke: '#e94560', strokeWidth: 2, fill: '#1a1a2e' }}
            />
            <Line
              type="monotone"
              dataKey="realized"
              stroke="#10b981"
              strokeWidth={2}
              dot={{ fill: '#10b981', strokeWidth: 0, r: zoomState.scale > 1.5 ? 5 : 3 }}
              activeDot={{ r: 5, stroke: '#10b981', strokeWidth: 2, fill: '#1a1a2e' }}
            />
            <Line
              type="monotone"
              dataKey="unrealized"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ fill: '#3b82f6', strokeWidth: 0, r: zoomState.scale > 1.5 ? 5 : 3 }}
              activeDot={{ r: 5, stroke: '#3b82f6', strokeWidth: 2, fill: '#1a1a2e' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Zoom Level Indicator (Mobile) */}
      {enableZoom && zoomState.scale !== 1 && (
        <div className="mt-2 flex items-center justify-between text-xs text-white/50 md:hidden">
          <span>Showing {visibleData.length} of {data.length} months</span>
          <span>Zoom: {Math.round(zoomState.scale * 100)}%</span>
        </div>
      )}
    </div>
  );
};

export default PortfolioChart;
