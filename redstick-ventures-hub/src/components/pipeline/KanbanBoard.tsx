"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  DndContext,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  defaultDropAnimationSideEffects,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Briefcase, Plus, Trash2, Edit2, GripVertical } from "lucide-react";

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

const initialStages: Stage[] = [
  {
    id: "inbound",
    name: "Inbound",
    deals: [
      { id: "1", companyName: "NexGen AI", amount: 2500000, stage: "inbound", assignedTo: "SC" },
      { id: "2", companyName: "CloudSync Pro", amount: 1800000, stage: "inbound", assignedTo: "MJ" },
    ],
  },
  {
    id: "screening",
    name: "Screening",
    deals: [
      { id: "3", companyName: "DataVault", amount: 3200000, stage: "screening", assignedTo: "ER" },
    ],
  },
  {
    id: "first-meeting",
    name: "1st Meeting",
    deals: [
      { id: "4", companyName: "QuantumLeap", amount: 5000000, stage: "first-meeting", assignedTo: "SC" },
      { id: "5", companyName: "CyberShield", amount: 2100000, stage: "first-meeting", assignedTo: "JP" },
    ],
  },
  {
    id: "deep-dive",
    name: "Deep Dive",
    deals: [
      { id: "6", companyName: "BioGenix", amount: 7500000, stage: "deep-dive", assignedTo: "ER" },
    ],
  },
  {
    id: "due-diligence",
    name: "Due Diligence",
    deals: [
      { id: "7", companyName: "AquaCulture Labs", amount: 4200000, stage: "due-diligence", assignedTo: "SC" },
    ],
  },
  {
    id: "ic-review",
    name: "IC Review",
    deals: [
      { id: "8", companyName: "FarmGrid Analytics", amount: 1800000, stage: "ic-review", assignedTo: "MJ" },
    ],
  },
  {
    id: "term-sheet",
    name: "Term Sheet",
    deals: [
      { id: "9", companyName: "VerticalHarvest", amount: 12000000, stage: "term-sheet", assignedTo: "SC" },
      { id: "10", companyName: "ProteinFuture", amount: 3500000, stage: "term-sheet", assignedTo: "ER" },
    ],
  },
  { id: "closed", name: "Closed", deals: [] },
];

const stageColors: Record<string, string> = {
  inbound: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  screening: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  "first-meeting": "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  "deep-dive": "bg-orange-500/20 text-orange-400 border-orange-500/30",
  "due-diligence": "bg-pink-500/20 text-pink-400 border-pink-500/30",
  "ic-review": "bg-indigo-500/20 text-indigo-400 border-indigo-500/30",
  "term-sheet": "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  closed: "bg-gray-500/20 text-gray-400 border-gray-500/30",
};

function formatAmount(amount: number): string {
  if (amount >= 1000000) {
    return `$${(amount / 1000000).toFixed(1)}M`;
  }
  return `$${(amount / 1000).toFixed(0)}K`;
}

interface SortableDealCardProps {
  deal: Deal;
  onEdit: (deal: Deal) => void;
  onDelete: (dealId: string) => void;
}

function SortableDealCard({ deal, onEdit, onDelete }: SortableDealCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: deal.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2, boxShadow: "0 8px 30px rgba(0,0,0,0.4)" }}
      className="group"
    >
      <Card className="bg-surface border-border hover:border-accent/50 transition-all duration-200 cursor-grab active:cursor-grabbing">
        <CardContent className="p-3">
          <div className="flex items-start gap-2">
            <div {...attributes} {...listeners} className="mt-1 text-text-tertiary hover:text-text-secondary">
              <GripVertical className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <Briefcase className="w-4 h-4 text-accent flex-shrink-0" />
                <span className="font-medium text-text-primary text-sm truncate">
                  {deal.companyName}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-accent font-semibold text-sm">
                  {formatAmount(deal.amount)}
                </span>
                <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center text-xs font-medium text-accent">
                  {deal.assignedTo}
                </div>
              </div>
            </div>
            <div className="opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-1">
              <button
                onClick={() => onEdit(deal)}
                className="p-1 hover:bg-surface-elevated rounded text-text-tertiary hover:text-text-primary"
              >
                <Edit2 className="w-3 h-3" />
              </button>
              <button
                onClick={() => onDelete(deal.id)}
                className="p-1 hover:bg-error/10 rounded text-text-tertiary hover:text-error"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

interface DealColumnProps {
  stage: Stage;
  onEdit: (deal: Deal) => void;
  onDelete: (dealId: string) => void;
  onAdd: (stageId: string) => void;
}

function DealColumn({ stage, onEdit, onDelete, onAdd }: DealColumnProps) {
  const { setNodeRef } = useSortable({
    id: stage.id,
    data: { type: "Stage", stage },
  });

  return (
    <div ref={setNodeRef} className="flex-shrink-0 w-72">
      <div className="bg-surface/50 rounded-xl p-3 border border-border">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={stageColors[stage.id]}>
              {stage.deals.length}
            </Badge>
            <span className="font-semibold text-text-primary text-sm">{stage.name}</span>
          </div>
          <button
            onClick={() => onAdd(stage.id)}
            className="p-1 hover:bg-surface-elevated rounded text-text-tertiary hover:text-accent transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
        <SortableContext items={stage.deals.map((d) => d.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-2 min-h-[100px]">
            {stage.deals.map((deal) => (
              <SortableDealCard key={deal.id} deal={deal} onEdit={onEdit} onDelete={onDelete} />
            ))}
          </div>
        </SortableContext>
      </div>
    </div>
  );
}

export default function KanbanBoard() {
  const [stages, setStages] = useState<Stage[]>(initialStages);
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const activeStage = stages.find((s) => s.deals.some((d) => d.id === activeId));
    const overStage = stages.find((s) => s.id === overId || s.deals.some((d) => d.id === overId));

    if (!activeStage || !overStage || activeStage === overStage) return;

    setStages((prev) => {
      const activeDeal = activeStage.deals.find((d) => d.id === activeId);
      if (!activeDeal) return prev;

      return prev.map((stage) => {
        if (stage.id === activeStage.id) {
          return { ...stage, deals: stage.deals.filter((d) => d.id !== activeId) };
        }
        if (stage.id === overStage.id) {
          return { ...stage, deals: [...stage.deals, { ...activeDeal, stage: overStage.id }] };
        }
        return stage;
      });
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const activeStage = stages.find((s) => s.deals.some((d) => d.id === activeId));
    const overStage = stages.find((s) => s.id === overId || s.deals.some((d) => d.id === overId));

    if (!activeStage || !overStage) return;

    if (activeStage === overStage) {
      const oldIndex = activeStage.deals.findIndex((d) => d.id === activeId);
      const newIndex = activeStage.deals.findIndex((d) => d.id === overId);

      setStages((prev) =>
        prev.map((stage) =>
          stage.id === activeStage.id
            ? { ...stage, deals: arrayMove(stage.deals, oldIndex, newIndex) }
            : stage
        )
      );
    }
  };

  const handleEdit = (deal: Deal) => {
    const newName = prompt("Edit company name:", deal.companyName);
    if (newName) {
      setStages((prev) =>
        prev.map((stage) => ({
          ...stage,
          deals: stage.deals.map((d) => (d.id === deal.id ? { ...d, companyName: newName } : d)),
        }))
      );
    }
  };

  const handleDelete = (dealId: string) => {
    if (confirm("Are you sure you want to delete this deal?")) {
      setStages((prev) =>
        prev.map((stage) => ({
          ...stage,
          deals: stage.deals.filter((d) => d.id !== dealId),
        }))
      );
    }
  };

  const handleAdd = (stageId: string) => {
    const name = prompt("Enter company name:");
    if (name) {
      const newDeal: Deal = {
        id: Math.random().toString(36).substr(2, 9),
        companyName: name,
        amount: Math.floor(Math.random() * 5000000) + 1000000,
        stage: stageId,
        assignedTo: "SC",
      };
      setStages((prev) =>
        prev.map((stage) =>
          stage.id === stageId ? { ...stage, deals: [...stage.deals, newDeal] } : stage
        )
      );
    }
  };

  const activeDeal = activeId
    ? stages.flatMap((s) => s.deals).find((d) => d.id === activeId)
    : null;

  const totalValue = stages.flatMap((s) => s.deals).reduce((sum, d) => sum + d.amount, 0);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-bold text-text-primary">Deal Pipeline</h2>
          <div className="flex items-center gap-2 text-sm text-text-secondary">
            <span className="px-2 py-1 bg-surface rounded-md">
              {stages.flatMap((s) => s.deals).length} Active Deals
            </span>
            <span className="px-2 py-1 bg-surface rounded-md text-accent">
              {formatAmount(totalValue)} Total Value
            </span>
          </div>
        </div>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-4 overflow-x-auto pb-4">
          {stages.map((stage) => (
            <DealColumn
              key={stage.id}
              stage={stage}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onAdd={handleAdd}
            />
          ))}
        </div>

        <DragOverlay dropAnimation={{ sideEffects: defaultDropAnimationSideEffects({ styles: { active: { opacity: "0.5" } } }) }}>
          {activeDeal ? (
            <Card className="bg-surface border-accent shadow-lg rotate-3 scale-105">
              <CardContent className="p-3">
                <div className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-accent" />
                  <span className="font-medium text-text-primary text-sm">{activeDeal.companyName}</span>
                </div>
                <span className="text-accent font-semibold text-sm">{formatAmount(activeDeal.amount)}</span>
              </CardContent>
            </Card>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
