import React from "react"
import { FolderX } from "lucide-react"
import { Button } from "@/components/ui/button"

interface EmptyStateProps {
  title: string
  description?: string
  icon?: React.ElementType
  actionLabel?: string
  onAction?: () => void
}

export function EmptyState({
  title,
  description,
  icon: Icon = FolderX,
  actionLabel,
  onAction
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center border-2 border-dashed border-border/60 rounded-3xl bg-card/40 backdrop-blur-sm animate-fade-in">
      <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 text-primary shadow-inner">
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-xl font-bold tracking-tight text-foreground">{title}</h3>
      {description && (
        <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">
          {description}
        </p>
      )}
      {actionLabel && onAction && (
        <Button onClick={onAction} className="mt-8" variant="default">
          {actionLabel}
        </Button>
      )}
    </div>
  )
}
