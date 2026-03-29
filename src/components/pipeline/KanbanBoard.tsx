"use client";

import React, { useState, useMemo, useCallback } from "react";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
  defaultDropAnimationSideEffects,
  DropAnimation,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  MoreHorizontal,
  Edit2,
  Trash2,
  User,
  Briefcase,
  DollarSign,
  GripVertical,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import { useLongPress, useHaptic, useSwipe } from "@/hooks";

// =============================================================================
// TypeScript Interfaces
// =============================================================================
interface Deal {
  id: string;
  companyName: string;
  amount: number;
  stage: string;
  assignedTo: string;
}

interface Stage {
  id: string;
  name: string;
  deals: Deal[];
}

// =============================================================================
// Mock Data
// =============================================================================
const INITIAL_STAGES: Stage[] = [
  {
    id: "inbound",
    name: "Inbound",
    deals: [
      {
        id: "deal-1",
        companyName: "NexGen AI",
        amount: 2500000,
        stage: "inbound",
        assignedTo: "Sarah Chen",
      },
      {
        id: "deal-2",
        companyName: "CloudSync",
        amount: 1800000,
        stage: "inbound",
        assignedTo: "Mike Ross",
      },
    ],
  },
  {
    id: "screening",
    name: "Screening",
    deals: [
      {
        id: "deal-3",
        companyName: "DataFlow",
        amount: 3200000,
        stage: "screening",
        assignedTo: "Sarah Chen",
      },
    ],
  },
  {
    id: "1st-meeting",
    name: "1st Meeting",
    deals: [
      {
        id: "deal-4",
        companyName: "QuantumLeap",
        amount: 5000000,
        stage: "1st-meeting",
        assignedTo: "David Kim",
      },
      {
        id: "deal-5",
        companyName: "CyberShield",
        amount: 2100000,
        stage: "1st-meeting",
        assignedTo: "Mike Ross",
      },
    ],
  },
  {
    id: "deep-dive",
    name: "Deep Dive",
    deals: [
      {
        id: "deal-6",
        companyName: "GreenEnergy",
        amount: 7500000,
        stage: "deep-dive",
        assignedTo: "Sarah Chen",
      },
    ],
  },
  {
    id: "due-diligence",
    name: "Due Diligence",
    deals: [
      {
        id: "deal-7",
        companyName: "MedTech Pro",
        amount: 12000000,
        stage: "due-diligence",
        assignedTo: "David Kim",
      },
    ],
  },
  {
    id: "ic-review",
    name: "IC Review",
    deals: [
      {
        id: "deal-8",
        companyName: "FinFlow",
        amount: 8500000,
        stage: "ic-review",
        assignedTo: "Mike Ross",
      },
      {
        id: "deal-9",
        companyName: "RoboticsX",
        amount: 15000000,
        stage: "ic-review",
        assignedTo: "Sarah Chen",
      },
    ],
  },
  {
    id: "term-sheet",
    name: "Term Sheet",
    deals: [
      {
        id: "deal-10",
        companyName: "BioGenix",
        amount: 20000000,
        stage: "term-sheet",
        assignedTo: "David Kim",
      },
    ],
  },
  {
    id: "closed",
    name: "Closed",
    deals: [],
  },
];

// =============================================================================
// Utility Functions
// =============================================================================
const formatAmount = (amount: number): string => {
  if (amount >= 1000000) {
    return `$${(amount / 1000000).toFixed(1)}M`;
  }
  if (amount >= 1000) {
    return `$${(amount / 1000).toFixed(0)}K`;
  }
  return `$${amount}`;
};

const getInitials = (name: string): string => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

const getAvatarColor = (name: string): string => {
  const colors = ["#e94560", "#0ea5e9", "#10b981", "#f59e0b", "#8b5cf6"];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

// =============================================================================
// Sortable Deal Card Component
// =============================================================================
interface SortableDealCardProps {
  deal: Deal;
  onEdit?: (deal: Deal) => void;
  onDelete?: (dealId: string) => void;
  stageIndex: number;
  totalStages: number;
  onMoveLeft?: (deal: Deal) => void;
  onMoveRight?: (deal: Deal) => void;
}

const SortableDealCard: React.FC<SortableDealCardProps> = ({
  deal,
  onEdit,
  onDelete,
  stageIndex,
  totalStages,
  onMoveLeft,
  onMoveRight,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: deal.id,
    data: {
      type: "Deal",
      deal,
    },
  });

  const haptic = useHaptic();
  const [showSwipeActions, setShowSwipeActions] = useState(false);

  // Swipe handlers for moving between columns
  const { handlers: swipeHandlers, swipeState } = useSwipe({
    onSwipeLeft: () => {
      if (stageIndex < totalStages - 1) {
        haptic.medium();
        onMoveRight?.(deal);
        setShowSwipeActions(false);
      }
    },
    onSwipeRight: () => {
      if (stageIndex > 0) {
        haptic.medium();
        onMoveLeft?.(deal);
        setShowSwipeActions(false);
      }
    },
    threshold: 60,
    axis: 'x',
  });

  // Long press for drag initiation
  const { handlers: longPressHandlers, state: longPressState } = useLongPress({
    onLongPress: () => {
      haptic.heavy();
      // The drag is already handled by dnd-kit, this just adds haptic feedback
    },
    duration: 300,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const avatarColor = getAvatarColor(deal.assignedTo);

  // Merge handlers for touch interactions
  const mergedHandlers = {
    ...attributes,
    ...listeners,
    onTouchStart: (e: React.TouchEvent) => {
      longPressHandlers.onTouchStart(e);
      listeners?.onTouchStart?.(e);
      swipeHandlers.onTouchStart(e);
    },
    onTouchMove: (e: React.TouchEvent) => {
      longPressHandlers.onTouchMove(e);
      swipeHandlers.onTouchMove(e);
    },
    onTouchEnd: (e: React.TouchEvent) => {
      longPressHandlers.onTouchEnd(e);
      listeners?.onTouchEnd?.(e);
      swipeHandlers.onTouchEnd(e);
    },
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      {...mergedHandlers}
      initial={{ opacity: 0, y: 10 }}
      animate={{ 
        opacity: 1, 
        y: 0,
        scale: longPressState.isPressing ? 1.02 : 1,
      }}
      exit={{ opacity: 0, y: -10 }}
      whileHover={{
        y: -4,
        boxShadow: "0 8px 30px rgba(233, 69, 96, 0.15)",
        transition: { duration: 0.2 },
      }}
      className="group relative bg-[#1a1a2e] rounded-xl p-4 border border-white/10 cursor-grab active:cursor-grabbing hover:border-[#e94560]/30 transition-colors touch-manipulation"
    >
      {/* Long press progress indicator */}
      {longPressState.isPressing && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-white/10 rounded-t-xl overflow-hidden">
          <motion.div
            className="h-full bg-[#e94560]"
            initial={{ width: 0 }}
            animate={{ width: `${longPressState.progress}%` }}
          />
        </div>
      )}

      {/* Swipe hint for mobile */}
      <AnimatePresence>
        {showSwipeActions && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-between px-2 pointer-events-none"
          >
            {stageIndex > 0 && (
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                <ArrowLeft className="w-4 h-4 text-white/50" />
              </div>
            )}
            {stageIndex < totalStages - 1 && (
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                <ArrowRight className="w-4 h-4 text-white/50" />
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick Actions */}
      <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={(e) => {
            e.stopPropagation();
            haptic.light();
            onEdit?.(deal);
          }}
          className="p-1.5 rounded-lg bg-white/5 hover:bg-[#e94560]/20 text-white/60 hover:text-[#e94560] transition-colors touch-target"
          aria-label="Edit deal"
        >
          <Edit2 className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            haptic.warning();
            onDelete?.(deal.id);
          }}
          className="p-1.5 rounded-lg bg-white/5 hover:bg-red-500/20 text-white/60 hover:text-red-400 transition-colors touch-target"
          aria-label="Delete deal"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Drag Handle Indicator (visible on touch devices) */}
      <div className="absolute top-2 left-2 md:hidden opacity-50">
        <GripVertical className="w-4 h-4 text-white/30" />
      </div>

      {/* Company Name */}
      <div className="flex items-center gap-2 mb-3 pr-16 pt-4 md:pt-0">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#e94560]/20 to-[#e94560]/5 flex items-center justify-center">
          <Briefcase className="w-4 h-4 text-[#e94560]" />
        </div>
        <h4 className="font-semibold text-white text-sm truncate">
          {deal.companyName}
        </h4>
      </div>

      {/* Amount */}
      <div className="flex items-center gap-2 mb-3 text-white/70">
        <DollarSign className="w-4 h-4 text-[#e94560]" />
        <span className="text-sm font-medium">
          {formatAmount(deal.amount)}
        </span>
      </div>

      {/* Assigned User */}
      <div className="flex items-center gap-2 pt-3 border-t border-white/5">
        <div
          className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium text-white"
          style={{ backgroundColor: avatarColor }}
        >
          {getInitials(deal.assignedTo)}
        </div>
        <span className="text-xs text-white/50 truncate">{deal.assignedTo}</span>
      </div>

      {/* Swipe instruction for mobile */}
      <div className="mt-2 pt-2 border-t border-white/5 md:hidden">
        <p className="text-[10px] text-white/30 text-center">
          Swipe to move • Long press to drag
        </p>
      </div>
    </motion.div>
  );
};

// =============================================================================
// Drag Overlay Card Component
// =============================================================================
interface DragOverlayCardProps {
  deal: Deal;
}

const DragOverlayCard: React.FC<DragOverlayCardProps> = ({ deal }) => {
  const avatarColor = getAvatarColor(deal.assignedTo);

  return (
    <motion.div
      initial={{ scale: 1, rotate: 0 }}
      animate={{ scale: 1.05, rotate: 2 }}
      className="bg-[#1a1a2e] rounded-xl p-4 border border-[#e94560]/50 shadow-2xl cursor-grabbing touch-none"
      style={{
        boxShadow: "0 20px 50px rgba(233, 69, 96, 0.3)",
      }}
    >
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#e94560]/20 to-[#e94560]/5 flex items-center justify-center">
          <Briefcase className="w-4 h-4 text-[#e94560]" />
        </div>
        <h4 className="font-semibold text-white text-sm">
          {deal.companyName}
        </h4>
      </div>

      <div className="flex items-center gap-2 mb-3 text-white/70">
        <DollarSign className="w-4 h-4 text-[#e94560]" />
        <span className="text-sm font-medium">
          {formatAmount(deal.amount)}
        </span>
      </div>

      <div className="flex items-center gap-2 pt-3 border-t border-white/5">
        <div
          className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium text-white"
          style={{ backgroundColor: avatarColor }}
        >
          {getInitials(deal.assignedTo)}
        </div>
        <span className="text-xs text-white/50">{deal.assignedTo}</span>
      </div>
    </motion.div>
  );
};

// =============================================================================
// Stage Column Component
// =============================================================================
interface StageColumnProps {
  stage: Stage;
  onAddDeal?: (stageId: string) => void;
  onEditDeal?: (deal: Deal) => void;
  onDeleteDeal?: (dealId: string) => void;
  stageIndex: number;
  totalStages: number;
  onMoveDealLeft?: (deal: Deal) => void;
  onMoveDealRight?: (deal: Deal) => void;
}

const StageColumn: React.FC<StageColumnProps> = ({
  stage,
  onAddDeal,
  onEditDeal,
  onDeleteDeal,
  stageIndex,
  totalStages,
  onMoveDealLeft,
  onMoveDealRight,
}) => {
  const { setNodeRef } = useSortable({
    id: stage.id,
    data: {
      type: "Stage",
      stage,
    },
  });

  const dealIds = useMemo(() => stage.deals.map((d) => d.id), [stage.deals]);
  const haptic = useHaptic();

  const getStageColor = (stageId: string): string => {
    const colors: Record<string, string> = {
      inbound: "#6366f1",
      screening: "#8b5cf6",
      "1st-meeting": "#ec4899",
      "deep-dive": "#f59e0b",
      "due-diligence": "#10b981",
      "ic-review": "#0ea5e9",
      "term-sheet": "#e94560",
      closed: "#22c55e",
    };
    return colors[stageId] || "#e94560";
  };

  const stageColor = getStageColor(stage.id);

  return (
    <motion.div
      ref={setNodeRef}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="flex-shrink-0 w-[280px] flex flex-col"
    >
      {/* Column Header */}
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: stageColor }}
          />
          <h3 className="font-semibold text-white text-sm">{stage.name}</h3>
          <span className="px-2 py-0.5 rounded-full bg-white/10 text-white/60 text-xs font-medium">
            {stage.deals.length}
          </span>
        </div>
        <button
          onClick={() => {
            haptic.light();
            onAddDeal?.(stage.id);
          }}
          className="p-1.5 rounded-lg hover:bg-white/10 text-white/50 hover:text-[#e94560] transition-colors touch-target"
          aria-label={`Add deal to ${stage.name}`}
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Deals Container */}
      <div className="flex-1 bg-[#0f0f1a]/50 rounded-xl border border-white/5 p-3 min-h-[400px] touch-pan-y">
        <SortableContext
          items={dealIds}
          strategy={verticalListSortingStrategy}
        >
          <AnimatePresence mode="popLayout">
            <div className="flex flex-col gap-3">
              {stage.deals.map((deal) => (
                <SortableDealCard
                  key={deal.id}
                  deal={deal}
                  onEdit={onEditDeal}
                  onDelete={onDeleteDeal}
                  stageIndex={stageIndex}
                  totalStages={totalStages}
                  onMoveLeft={onMoveDealLeft}
                  onMoveRight={onMoveDealRight}
                />
              ))}
            </div>
          </AnimatePresence>
        </SortableContext>

        {/* Empty State */}
        {stage.deals.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center h-32 text-white/30"
          >
            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-2">
              <Briefcase className="w-5 h-5" />
            </div>
            <span className="text-xs">No deals</span>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

// =============================================================================
// Main Kanban Board Component
// =============================================================================
const KanbanBoard: React.FC = () => {
  const [stages, setStages] = useState<Stage[]>(INITIAL_STAGES);
  const [activeDeal, setActiveDeal] = useState<Deal | null>(null);
  const haptic = useHaptic();

  // Sensors for drag detection - includes TouchSensor for mobile
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Find which stage contains a deal
  const findStageContainingDeal = (dealId: string): Stage | undefined => {
    return stages.find((stage) => stage.deals.some((d) => d.id === dealId));
  };

  // Get stage index
  const getStageIndex = (stageId: string): number => {
    return stages.findIndex((s) => s.id === stageId);
  };

  // Handle drag start
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const dealId = active.id as string;
    
    for (const stage of stages) {
      const deal = stage.deals.find((d) => d.id === dealId);
      if (deal) {
        setActiveDeal(deal);
        haptic.medium();
        break;
      }
    }
  };

  // Handle drag over (for visual feedback during drag)
  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // Find the stages
    const activeStage = findStageContainingDeal(activeId);
    const overStage = stages.find((s) => s.id === overId);

    if (!activeStage || !overStage || activeStage.id === overStage.id) return;
  };

  // Handle drag end
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveDeal(null);

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    if (activeId === overId) return;

    const activeStage = findStageContainingDeal(activeId);
    const overStage =
      stages.find((s) => s.id === overId) || findStageContainingDeal(overId);

    if (!activeStage || !overStage) return;

    haptic.success();

    setStages((prevStages) => {
      const newStages = [...prevStages];

      // Find the deal
      const dealIndex = activeStage.deals.findIndex((d) => d.id === activeId);
      if (dealIndex === -1) return prevStages;

      const [movedDeal] = activeStage.deals.splice(dealIndex, 1);
      movedDeal.stage = overStage.id;

      // If dropping on a stage column
      if (overStage.id === overId) {
        overStage.deals.push(movedDeal);
      } else {
        // If dropping on another deal, insert at that position
        const overDealIndex = overStage.deals.findIndex((d) => d.id === overId);
        if (overDealIndex !== -1) {
          overStage.deals.splice(overDealIndex, 0, movedDeal);
        } else {
          overStage.deals.push(movedDeal);
        }
      }

      return newStages;
    });
  };

  // Move deal to previous stage (swipe right)
  const handleMoveDealLeft = useCallback((deal: Deal) => {
    const currentStageIndex = getStageIndex(deal.stage);
    if (currentStageIndex <= 0) return;

    const newStageId = stages[currentStageIndex - 1].id;
    
    setStages((prevStages) => {
      const newStages = [...prevStages];
      const currentStage = newStages[currentStageIndex];
      const dealIndex = currentStage.deals.findIndex((d) => d.id === deal.id);
      
      if (dealIndex !== -1) {
        const [movedDeal] = currentStage.deals.splice(dealIndex, 1);
        movedDeal.stage = newStageId;
        newStages[currentStageIndex - 1].deals.push(movedDeal);
      }
      
      return newStages;
    });
  }, [stages]);

  // Move deal to next stage (swipe left)
  const handleMoveDealRight = useCallback((deal: Deal) => {
    const currentStageIndex = getStageIndex(deal.stage);
    if (currentStageIndex >= stages.length - 1) return;

    const newStageId = stages[currentStageIndex + 1].id;
    
    setStages((prevStages) => {
      const newStages = [...prevStages];
      const currentStage = newStages[currentStageIndex];
      const dealIndex = currentStage.deals.findIndex((d) => d.id === deal.id);
      
      if (dealIndex !== -1) {
        const [movedDeal] = currentStage.deals.splice(dealIndex, 1);
        movedDeal.stage = newStageId;
        newStages[currentStageIndex + 1].deals.push(movedDeal);
      }
      
      return newStages;
    });
  }, [stages]);

  // Drop animation configuration
  const dropAnimation: DropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: {
        active: {
          opacity: "0.5",
        },
      },
    }),
  };

  // Add new deal handler
  const handleAddDeal = (stageId: string) => {
    haptic.light();
    const newDeal: Deal = {
      id: `deal-${Date.now()}`,
      companyName: "New Company",
      amount: 1000000,
      stage: stageId,
      assignedTo: "Unassigned",
    };

    setStages((prev) =>
      prev.map((stage) =>
        stage.id === stageId
          ? { ...stage, deals: [...stage.deals, newDeal] }
          : stage
      )
    );
  };

  // Edit deal handler
  const handleEditDeal = (deal: Deal) => {
    haptic.light();
    const newName = prompt("Enter company name:", deal.companyName);
    if (newName === null) return;

    const newAmount = prompt("Enter amount:", deal.amount.toString());
    if (newAmount === null) return;

    setStages((prev) =>
      prev.map((stage) => ({
        ...stage,
        deals: stage.deals.map((d) =>
          d.id === deal.id
            ? {
                ...d,
                companyName: newName || d.companyName,
                amount: parseInt(newAmount) || d.amount,
              }
            : d
        ),
      }))
    );
  };

  // Delete deal handler
  const handleDeleteDeal = (dealId: string) => {
    haptic.warning();
    if (!confirm("Are you sure you want to delete this deal?")) return;

    setStages((prev) =>
      prev.map((stage) => ({
        ...stage,
        deals: stage.deals.filter((d) => d.id !== dealId),
      }))
    );
  };

  return (
    <div className="w-full h-full bg-[#0f0f1a] p-6">
      {/* Board Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">Deal Pipeline</h2>
          <p className="text-white/50 text-sm mt-1">
            Manage your investment opportunities across stages
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-4 py-2 bg-[#1a1a2e] rounded-lg border border-white/10">
            <span className="text-white/50 text-sm">Total Pipeline:</span>
            <span className="text-[#e94560] font-semibold">
              {formatAmount(
                stages.reduce(
                  (sum, stage) =>
                    sum + stage.deals.reduce((s, d) => s + d.amount, 0),
                  0
                )
              )}
            </span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-[#1a1a2e] rounded-lg border border-white/10">
            <span className="text-white/50 text-sm">Active Deals:</span>
            <span className="text-white font-semibold">
              {stages.reduce((sum, stage) => sum + stage.deals.length, 0)}
            </span>
          </div>
        </div>
      </div>

      {/* Touch Instructions for Mobile */}
      <div className="md:hidden mb-4 p-3 bg-[#1a1a2e] rounded-lg border border-white/10">
        <p className="text-xs text-white/60 text-center">
          💡 <strong>Tip:</strong> Swipe cards left/right to move stages • Long press to drag
        </p>
      </div>

      {/* Kanban Board */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="overflow-x-auto pb-4 scroll-smooth-touch">
          <div className="flex gap-4 min-w-max">
            <SortableContext
              items={stages.map((s) => s.id)}
              strategy={horizontalListSortingStrategy}
            >
              {stages.map((stage, index) => (
                <StageColumn
                  key={stage.id}
                  stage={stage}
                  onAddDeal={handleAddDeal}
                  onEditDeal={handleEditDeal}
                  onDeleteDeal={handleDeleteDeal}
                  stageIndex={index}
                  totalStages={stages.length}
                  onMoveDealLeft={handleMoveDealLeft}
                  onMoveDealRight={handleMoveDealRight}
                />
              ))}
            </SortableContext>
          </div>
        </div>

        {/* Drag Overlay */}
        <DragOverlay dropAnimation={dropAnimation}>
          {activeDeal ? <DragOverlayCard deal={activeDeal} /> : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
};

export default KanbanBoard;
