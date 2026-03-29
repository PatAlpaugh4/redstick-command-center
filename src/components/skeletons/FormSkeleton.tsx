/**
 * Form Skeleton Component
 * =======================
 * Form loading state with label placeholders, input field skeletons, and button placeholders.
 * Mimics the appearance of forms during data fetching or submission states.
 */

import * as React from 'react'
import { cn } from '@/lib/utils'
import { Skeleton } from '@/components/ui/Skeleton'

export interface FormSkeletonProps {
  /** Number of form fields */
  fields?: number
  /** Layout style for fields */
  layout?: 'single' | 'two-column' | 'mixed'
  /** Whether to show form title */
  showTitle?: boolean
  /** Whether to show description */
  showDescription?: boolean
  /** Whether to show form actions (buttons) */
  showActions?: boolean
  /** Custom className for styling */
  className?: string
  /** Animation style */
  animation?: 'pulse' | 'wave' | 'none'
}

export function FormSkeleton({
  fields = 6,
  layout = 'mixed',
  showTitle = true,
  showDescription = true,
  showActions = true,
  className,
  animation = 'pulse',
}: FormSkeletonProps) {
  return (
    <div
      className={cn(
        // Form container
        'rounded-xl border border-border bg-card p-6 lg:p-8',
        className
      )}
    >
      {/* Form header */}
      {(showTitle || showDescription) && (
        <div className="mb-8 space-y-2">
          {showTitle && (
            <Skeleton
              variant="text"
              width={200}
              height={24}
              animation={animation}
            />
          )}
          {showDescription && (
            <Skeleton
              variant="text"
              width={350}
              height={14}
              animation={animation}
              className="opacity-70"
            />
          )}
        </div>
      )}

      {/* Form fields */}
      <div className="space-y-6">
        {layout === 'single' && (
          <SingleColumnFields fields={fields} animation={animation} />
        )}
        {layout === 'two-column' && (
          <TwoColumnFields fields={fields} animation={animation} />
        )}
        {layout === 'mixed' && (
          <MixedLayoutFields fields={fields} animation={animation} />
        )}
      </div>

      {/* Form actions */}
      {showActions && (
        <div className="flex items-center justify-end gap-3 mt-8 pt-6 border-t border-border">
          <Skeleton
            variant="rectangular"
            width={100}
            height={40}
            animation={animation}
            className="rounded-md"
          />
          <Skeleton
            variant="rectangular"
            width={120}
            height={40}
            animation={animation}
            className="rounded-md"
          />
        </div>
      )}
    </div>
  )
}

/** Single column field layout */
function SingleColumnFields({
  fields,
  animation,
}: {
  fields: number
  animation: 'pulse' | 'wave' | 'none'
}) {
  return (
    <div className="space-y-5">
      {Array.from({ length: fields }).map((_, i) => (
        <FormFieldSkeleton
          key={i}
          animation={animation}
          inputHeight={i % 4 === 3 ? 120 : 40} // Make every 4th field a textarea
        />
      ))}
    </div>
  )
}

/** Two column field layout */
function TwoColumnFields({
  fields,
  animation,
}: {
  fields: number
  animation: 'pulse' | 'wave' | 'none'
}) {
  const rows = Math.ceil(fields / 2)
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {Array.from({ length: rows * 2 }).map((_, i) => (
        <FormFieldSkeleton
          key={i}
          animation={animation}
          inputHeight={40}
        />
      ))}
    </div>
  )
}

/** Mixed layout with some full-width fields */
function MixedLayoutFields({
  fields,
  animation,
}: {
  fields: number
  animation: 'pulse' | 'wave' | 'none'
}) {
  let fieldIndex = 0
  const elements: React.ReactNode[] = []

  while (fieldIndex < fields) {
    // Add a two-column row
    if (fieldIndex < fields - 1 && fieldIndex % 3 !== 2) {
      elements.push(
        <div key={fieldIndex} className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <FormFieldSkeleton animation={animation} inputHeight={40} />
          <FormFieldSkeleton animation={animation} inputHeight={40} />
        </div>
      )
      fieldIndex += 2
    } else {
      // Add a full-width field (could be textarea for variety)
      const isTextarea = fieldIndex % 3 === 2
      elements.push(
        <FormFieldSkeleton
          key={fieldIndex}
          animation={animation}
          inputHeight={isTextarea ? 120 : 40}
          fullWidth
        />
      )
      fieldIndex += 1
    }
  }

  return <div className="space-y-5">{elements}</div>
}

/** Individual form field skeleton */
function FormFieldSkeleton({
  animation,
  inputHeight = 40,
  fullWidth = false,
}: {
  animation: 'pulse' | 'wave' | 'none'
  inputHeight?: number
  fullWidth?: boolean
}) {
  const isTextarea = inputHeight > 50

  return (
    <div className={cn('space-y-2', fullWidth && 'md:col-span-2')}>
      {/* Label */}
      <div className="flex items-center justify-between">
        <Skeleton
          variant="text"
          width={80 + Math.random() * 40}
          height={14}
          animation={animation}
        />
        {/* Optional helper text placeholder */}
        {Math.random() > 0.7 && (
          <Skeleton
            variant="text"
            width={60}
            height={12}
            animation={animation}
            className="opacity-50"
          />
        )}
      </div>

      {/* Input field */}
      <Skeleton
        variant="rectangular"
        width="100%"
        height={inputHeight}
        animation={animation}
        className={cn('rounded-md', isTextarea && 'rounded-lg')}
      />

      {/* Optional hint/validation message */}
      {Math.random() > 0.8 && (
        <Skeleton
          variant="text"
          width={200}
          height={12}
          animation={animation}
          className="opacity-50"
        />
      )}
    </div>
  )
}

/** Compact form skeleton for smaller forms */
export function CompactFormSkeleton({
  className,
  ...props
}: Omit<FormSkeletonProps, 'className'>) {
  return (
    <FormSkeleton
      fields={4}
      layout="single"
      showDescription={false}
      className={cn('p-5', className)}
      {...props}
    />
  )
}

/** Settings form skeleton with sections */
export function SettingsFormSkeleton({
  className,
  animation = 'pulse',
}: {
  className?: string
  animation?: 'pulse' | 'wave' | 'none'
}) {
  return (
    <div className={cn('space-y-8', className)}>
      {/* Section 1 */}
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="mb-6">
          <Skeleton
            variant="text"
            width={150}
            height={20}
            animation={animation}
            className="mb-2"
          />
          <Skeleton
            variant="text"
            width={300}
            height={14}
            animation={animation}
          />
        </div>
        <div className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FormFieldSkeleton animation={animation} inputHeight={40} />
            <FormFieldSkeleton animation={animation} inputHeight={40} />
          </div>
          <FormFieldSkeleton animation={animation} inputHeight={40} />
        </div>
      </div>

      {/* Section 2 */}
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="mb-6">
          <Skeleton
            variant="text"
            width={180}
            height={20}
            animation={animation}
            className="mb-2"
          />
          <Skeleton
            variant="text"
            width={280}
            height={14}
            animation={animation}
          />
        </div>
        <div className="space-y-5">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between py-3">
              <div className="space-y-1">
                <Skeleton
                  variant="text"
                  width={150}
                  height={16}
                  animation={animation}
                />
                <Skeleton
                  variant="text"
                  width={200}
                  height={12}
                  animation={animation}
                />
              </div>
              <Skeleton
                variant="rectangular"
                width={44}
                height={24}
                animation={animation}
                className="rounded-full"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Section 3 */}
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton
              variant="text"
              width={120}
              height={20}
              animation={animation}
              className="mb-2"
            />
            <Skeleton
              variant="text"
              width={250}
              height={14}
              animation={animation}
            />
          </div>
          <Skeleton
            variant="rectangular"
            width={140}
            height={40}
            animation={animation}
            className="rounded-md"
          />
        </div>
      </div>
    </div>
  )
}

/** Login form skeleton */
export function LoginFormSkeleton({
  className,
  animation = 'pulse',
}: {
  className?: string
  animation?: 'pulse' | 'wave' | 'none'
}) {
  return (
    <div
      className={cn(
        'w-full max-w-md mx-auto rounded-xl border border-border bg-card p-8',
        className
      )}
    >
      {/* Logo */}
      <div className="flex justify-center mb-8">
        <Skeleton
          variant="rectangular"
          width={64}
          height={64}
          animation={animation}
          className="rounded-xl"
        />
      </div>

      {/* Title */}
      <div className="text-center mb-8 space-y-2">
        <Skeleton
          variant="text"
          width={180}
          height={24}
          animation={animation}
          className="mx-auto"
        />
        <Skeleton
          variant="text"
          width={250}
          height={14}
          animation={animation}
          className="mx-auto opacity-70"
        />
      </div>

      {/* Fields */}
      <div className="space-y-5">
        <FormFieldSkeleton animation={animation} inputHeight={48} />
        <FormFieldSkeleton animation={animation} inputHeight={48} />
      </div>

      {/* Forgot password link */}
      <div className="flex justify-end mt-2">
        <Skeleton
          variant="text"
          width={120}
          height={14}
          animation={animation}
        />
      </div>

      {/* Submit button */}
      <div className="mt-6">
        <Skeleton
          variant="rectangular"
          width="100%"
          height={48}
          animation={animation}
          className="rounded-lg"
        />
      </div>

      {/* Divider */}
      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center">
          <Skeleton
            variant="rectangular"
            width="100%"
            height={1}
            animation={animation}
          />
        </div>
        <div className="relative flex justify-center">
          <Skeleton
            variant="rectangular"
            width={40}
            height={16}
            animation={animation}
            className="bg-card"
          />
        </div>
      </div>

      {/* Social buttons */}
      <div className="space-y-3">
        <Skeleton
          variant="rectangular"
          width="100%"
          height={44}
          animation={animation}
          className="rounded-lg"
        />
        <Skeleton
          variant="rectangular"
          width="100%"
          height={44}
          animation={animation}
          className="rounded-lg"
        />
      </div>

      {/* Sign up link */}
      <div className="flex justify-center gap-2 mt-6">
        <Skeleton
          variant="text"
          width={120}
          height={14}
          animation={animation}
        />
        <Skeleton
          variant="text"
          width={60}
          height={14}
          animation={animation}
        />
      </div>
    </div>
  )
}

export default FormSkeleton
