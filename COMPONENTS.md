# Component Library

## Overview

Our component library follows atomic design principles with built-in accessibility. All components are designed to be composable, type-safe, and fully accessible.

## Installation

Components are part of the project and can be imported directly:

```tsx
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
```

---

## Components

### Button

Multi-purpose button component with variants and loading states.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'primary' \| 'secondary' \| 'ghost' \| 'danger'` | `'primary'` | Visual style |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Button size |
| `isLoading` | `boolean` | `false` | Show loading state |
| `disabled` | `boolean` | `false` | Disable button |
| `leftIcon` | `ReactNode` | - | Icon before text |
| `rightIcon` | `ReactNode` | - | Icon after text |
| `onClick` | `() => void` | - | Click handler |
| `type` | `'button' \| 'submit' \| 'reset'` | `'button'` | Button type |

**Examples:**

```tsx
// Primary button
<Button>Click me</Button>

// Secondary variant
<Button variant="secondary">Cancel</Button>

// Danger action
<Button variant="danger">Delete</Button>

// Loading state
<Button isLoading>Saving...</Button>

// With icon
<Button leftIcon={<Plus className="w-4 h-4" />}>
  Add Deal
</Button>

// Disabled
<Button disabled>Not available</Button>

// Submit button
<Button type="submit">Create Account</Button>
```

---

### Card

Container component for content grouping.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `hover` | `boolean` | `false` | Enable hover effects |
| `padding` | `'none' \| 'sm' \| 'md' \| 'lg'` | `'md'` | Padding size |
| `className` | `string` | - | Additional classes |

**Subcomponents:**
- `CardHeader` - Header section with title
- `CardContent` - Main content area
- `CardFooter` - Footer section

**Examples:**

```tsx
<Card hover>
  <CardHeader>
    <CardTitle>Portfolio Value</CardTitle>
    <CardDescription>As of today</CardDescription>
  </CardHeader>
  <CardContent>
    $47.2M
  </CardContent>
  <CardFooter>
    <Button variant="ghost">View Details</Button>
  </CardFooter>
</Card>
```

---

### Badge

Status indicator component.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'default' \| 'primary' \| 'success' \| 'warning' \| 'error'` | `'default'` | Color variant |
| `size` | `'sm' \| 'md'` | `'md'` | Badge size |
| `dot` | `boolean` | `false` | Show status dot |

**Examples:**

```tsx
<Badge>Default</Badge>
<Badge variant="primary">Primary</Badge>
<Badge variant="success">Active</Badge>
<Badge variant="warning">Pending</Badge>
<Badge variant="error">Failed</Badge>
<Badge dot variant="success">Live</Badge>
```

---

### DataTable

Advanced table with sorting, filtering, and pagination.

**Props:**

| Prop | Type | Description |
|------|------|-------------|
| `data` | `T[]` | Table data |
| `columns` | `ColumnDef<T>[]` | Column definitions |
| `pageSize` | `number` | Rows per page |
| `onRowClick` | `(row: T) => void` | Row click handler |
| `sortable` | `boolean` | Enable sorting |
| `selectable` | `boolean` | Enable row selection |
| `onSelectionChange` | `(selected: T[]) => void` | Selection change handler |
| `isLoading` | `boolean` | Loading state |
| `emptyMessage` | `string` | Message when no data |

**Examples:**

```tsx
const columns: ColumnDef<Deal>[] = [
  {
    key: 'companyName',
    header: 'Company',
    sortable: true,
    cell: (deal) => (
      <div>
        <div className="font-medium">{deal.companyName}</div>
        <div className="text-sm text-text-secondary">{deal.sector}</div>
      </div>
    ),
  },
  {
    key: 'stage',
    header: 'Stage',
    cell: (deal) => <Badge>{deal.stage}</Badge>,
  },
  {
    key: 'amount',
    header: 'Amount',
    sortable: true,
    align: 'right',
    cell: (deal) => formatAmount(deal.amount),
  },
  {
    key: 'actions',
    header: '',
    cell: (deal) => (
      <DropdownMenu>
        <DropdownMenuTrigger>
          <MoreHorizontal className="w-4 h-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Edit</DropdownMenuItem>
          <DropdownMenuItem>Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];

<DataTable
  data={deals}
  columns={columns}
  pageSize={10}
  sortable
  selectable
  onRowClick={(deal) => router.push(`/deals/${deal.id}`)}
/>
```

---

### Modal

Dialog component with focus trap and keyboard navigation.

**Props:**

| Prop | Type | Description |
|------|------|-------------|
| `isOpen` | `boolean` | Show/hide modal |
| `onClose` | `() => void` | Close handler |
| `title` | `string` | Modal title |
| `description` | `string` | Modal description |
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl' \| 'full'` | Modal size |
| `footer` | `ReactNode` | Footer content |
| `closeOnOverlayClick` | `boolean` | Close when clicking overlay |
| `closeOnEscape` | `boolean` | Close on Escape key |

**Examples:**

```tsx
const [isOpen, setIsOpen] = useState(false);

<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Confirm Delete"
  description="This action cannot be undone."
  size="md"
  footer={
    <div className="flex justify-end gap-2">
      <Button variant="secondary" onClick={() => setIsOpen(false)}>
        Cancel
      </Button>
      <Button variant="danger" onClick={handleDelete}>
        Delete
      </Button>
    </div>
  }
>
  <p>Are you sure you want to delete this deal?</p>
</Modal>
```

---

### Input

Form input component with built-in validation support.

**Props:**

| Prop | Type | Description |
|------|------|-------------|
| `label` | `string` | Input label |
| `error` | `string` | Error message |
| `helperText` | `string` | Helper text |
| `leftIcon` | `ReactNode` | Icon at start |
| `rightIcon` | `ReactNode` | Icon at end |
| `isDisabled` | `boolean` | Disable input |
| `isRequired` | `boolean` | Mark as required |
| `size` | `'sm' \| 'md' \| 'lg'` | Input size |

**Examples:**

```tsx
<Input
  label="Company Name"
  placeholder="Enter company name"
  value={companyName}
  onChange={(e) => setCompanyName(e.target.value)}
  error={errors.companyName}
  isRequired
/>

<Input
  label="Search"
  leftIcon={<Search className="w-4 h-4" />}
  placeholder="Search deals..."
/>

<Input
  label="Amount"
  type="number"
  rightIcon={<span className="text-text-secondary">USD</span>}
/>
```

---

### Select

Dropdown select component.

**Props:**

| Prop | Type | Description |
|------|------|-------------|
| `label` | `string` | Select label |
| `options` | `SelectOption[]` | Options array |
| `placeholder` | `string` | Placeholder text |
| `isClearable` | `boolean` | Allow clearing selection |
| `isSearchable` | `boolean` | Enable search |
| `isMulti` | `boolean` | Multiple selection |
| `error` | `string` | Error message |

**Examples:**

```tsx
const stages = [
  { value: 'INBOUND', label: 'Inbound' },
  { value: 'SCREENING', label: 'Screening' },
  { value: 'FIRST_MEETING', label: 'First Meeting' },
];

<Select
  label="Deal Stage"
  options={stages}
  value={stage}
  onChange={(value) => setStage(value)}
  placeholder="Select stage"
/>

<Select
  label="Sectors"
  options={sectors}
  isMulti
  value={selectedSectors}
  onChange={(values) => setSelectedSectors(values)}
/>
```

---

### Tabs

Tab navigation component.

**Props:**

| Prop | Type | Description |
|------|------|-------------|
| `tabs` | `Tab[]` | Tab definitions |
| `defaultTab` | `string` | Default active tab |
| `onChange` | `(tab: string) => void` | Tab change handler |
| `variant` | `'default' \| 'pills'` | Tab style |

**Examples:**

```tsx
<Tabs
  tabs={[
    { id: 'overview', label: 'Overview', content: <OverviewTab /> },
    { id: 'deals', label: 'Deals', content: <DealsTab /> },
    { id: 'team', label: 'Team', content: <TeamTab /> },
  ]}
  defaultTab="overview"
/>

<Tabs
  variant="pills"
  tabs={[...]}
/>
```

---

### DropdownMenu

Dropdown menu with keyboard navigation.

**Props:**

| Prop | Type | Description |
|------|------|-------------|
| `trigger` | `ReactNode` | Menu trigger element |
| `children` | `ReactNode` | Menu items |
| `align` | `'start' \| 'center' \| 'end'` | Menu alignment |

**Subcomponents:**
- `DropdownMenuTrigger` - Trigger wrapper
- `DropdownMenuContent` - Menu container
- `DropdownMenuItem` - Menu item
- `DropdownMenuSeparator` - Visual separator
- `DropdownMenuLabel` - Section label

**Examples:**

```tsx
<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="ghost">
      Actions <ChevronDown className="w-4 h-4 ml-2" />
    </Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent align="end">
    <DropdownMenuLabel>Deal Actions</DropdownMenuLabel>
    <DropdownMenuItem onClick={() => editDeal()}>
      <Edit className="w-4 h-4 mr-2" />
      Edit
    </DropdownMenuItem>
    <DropdownMenuItem onClick={() => duplicateDeal()}>
      <Copy className="w-4 h-4 mr-2" />
      Duplicate
    </DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem 
      onClick={() => deleteDeal()}
      className="text-error"
    >
      <Trash className="w-4 h-4 mr-2" />
      Delete
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

---

### Tooltip

Informational tooltip on hover.

**Props:**

| Prop | Type | Description |
|------|------|-------------|
| `content` | `string \| ReactNode` | Tooltip content |
| `children` | `ReactNode` | Trigger element |
| `placement` | `'top' \| 'bottom' \| 'left' \| 'right'` | Tooltip position |
| `delay` | `number` | Show delay in ms |

**Examples:**

```tsx
<Tooltip content="Create a new deal">
  <Button>
    <Plus className="w-4 h-4" />
  </Button>
</Tooltip>

<Tooltip 
  content={
    <div>
      <p className="font-semibold">Internal Rate of Return</p>
      <p>Annualized rate of return</p>
    </div>
  }
  placement="right"
>
  <span className="underline decoration-dotted">IRR</span>
</Tooltip>
```

---

### Avatar

User avatar with fallback.

**Props:**

| Prop | Type | Description |
|------|------|-------------|
| `src` | `string` | Image URL |
| `alt` | `string` | Alt text |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | Avatar size |
| `fallback` | `string` | Fallback initials |

**Examples:**

```tsx
<Avatar src={user.image} alt={user.name} fallback={user.name[0]} />

<Avatar size="lg" fallback="JD" />

<div className="flex -space-x-2">
  {team.map(member => (
    <Avatar 
      key={member.id} 
      src={member.image}
      fallback={member.name[0]}
      size="sm"
    />
  ))}
</div>
```

---

### Skeleton

Loading placeholder.

**Props:**

| Prop | Type | Description |
|------|------|-------------|
| `width` | `string \| number` | Skeleton width |
| `height` | `string \| number` | Skeleton height |
| `circle` | `boolean` | Circular shape |
| `count` | `number` | Number of lines |

**Examples:**

```tsx
<Skeleton width={200} height={24} />

<Skeleton circle width={40} height={40} />

<div className="space-y-2">
  <Skeleton count={3} />
</div>

// Card skeleton
<div className="space-y-4">
  <Skeleton width="60%" height={24} />
  <Skeleton count={2} />
</div>
```

---

### Progress

Progress indicator.

**Props:**

| Prop | Type | Description |
|------|------|-------------|
| `value` | `number` | Current value |
| `max` | `number` | Maximum value |
| `size` | `'sm' \| 'md' \| 'lg'` | Progress size |
| `variant` | `'default' \| 'success' \| 'warning' \| 'error'` | Color variant |
| `label` | `string` | Accessible label |

**Examples:**

```tsx
<Progress value={60} max={100} label="Upload progress" />

<Progress value={45} max={100} variant="warning" size="lg" />

<div className="space-y-2">
  <div className="flex justify-between text-sm">
    <span>Storage</span>
    <span>75%</span>
  </div>
  <Progress value={75} max={100} />
</div>
```

---

### Switch

Toggle switch component.

**Props:**

| Prop | Type | Description |
|------|------|-------------|
| `checked` | `boolean` | Switch state |
| `onCheckedChange` | `(checked: boolean) => void` | Change handler |
| `disabled` | `boolean` | Disable switch |
| `label` | `string` | Switch label |
| `description` | `string` | Helper text |

**Examples:**

```tsx
<Switch
  checked={notifications}
  onCheckedChange={setNotifications}
  label="Enable notifications"
  description="Receive updates about deal activity"
/>

<Switch checked={isActive} onCheckedChange={toggleActive} />
```

---

### Accordion

Collapsible content sections.

**Props:**

| Prop | Type | Description |
|------|------|-------------|
| `items` | `AccordionItem[]` | Accordion items |
| `defaultOpen` | `string[]` | Default open items |
| `allowMultiple` | `boolean` | Allow multiple open |

**Examples:**

```tsx
<Accordion
  items={[
    {
      id: 'details',
      title: 'Deal Details',
      content: <DealDetails />,
    },
    {
      id: 'history',
      title: 'Activity History',
      content: <ActivityHistory />,
    },
  ]}
/>
```

---

### Breadcrumb

Navigation breadcrumb.

**Props:**

| Prop | Type | Description |
|------|------|-------------|
| `items` | `BreadcrumbItem[]` | Breadcrumb items |
| `separator` | `ReactNode` | Custom separator |

**Examples:**

```tsx
<Breadcrumb
  items={[
    { label: 'Home', href: '/' },
    { label: 'Deals', href: '/deals' },
    { label: 'TechStart Inc' },
  ]}
/>
```

---

## Animation Components

### FadeIn

Fade in animation wrapper.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `delay` | `number` | `0` | Animation delay in seconds |
| `duration` | `number` | `0.5` | Animation duration |
| `direction` | `'up' \| 'down' \| 'left' \| 'right' \| 'none'` | `'up'` | Animation direction |

**Examples:**

```tsx
<FadeIn>
  <Card>Content</Card>
</FadeIn>

<FadeIn delay={0.2} direction="left">
  <HeroSection />
</FadeIn>
```

---

### MotionWrapper

Respects reduced motion preferences automatically.

**Props:**

| Prop | Type | Description |
|------|------|-------------|
| `variants` | `Variants` | Framer Motion variants |
| `children` | `ReactNode` | Child elements |

**Examples:**

```tsx
const fadeVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

<MotionWrapper variants={fadeVariants}>
  <Content />
</MotionWrapper>
```

---

### StaggerContainer

Container that staggers children animations.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `staggerDelay` | `number` | `0.1` | Delay between children |
| `children` | `ReactNode` | - | Child elements |

**Examples:**

```tsx
<StaggerContainer staggerDelay={0.08}>
  {deals.map(deal => (
    <DealCard key={deal.id} deal={deal} />
  ))}
</StaggerContainer>
```

---

## Theming

All components use the design system tokens defined in `tailwind.config.ts`:

### Colors

- `primary` - Brand accent color
- `background` - Page background
- `surface` - Card/elevated surfaces
- `text-primary` - Primary text
- `text-secondary` - Secondary text

### Spacing

Based on 4px grid:
- `space-1` = 4px
- `space-2` = 8px
- `space-4` = 16px
- `space-6` = 24px
- `space-8` = 32px

### Typography

Font family: Inter

```css
.text-xs    /* 12px */
.text-sm    /* 14px */
.text-base  /* 16px */
.text-lg    /* 18px */
.text-xl    /* 20px */
.text-2xl   /* 24px */
.text-3xl   /* 30px */
.text-4xl   /* 36px */
```

---

## Accessibility

All components include:

- **Keyboard navigation**: Full keyboard operability
- **ARIA labels**: Proper labeling for screen readers
- **Focus management**: Visible focus indicators
- **Color contrast**: WCAG 2.1 AA compliant (4.5:1)
- **Reduced motion**: Respects `prefers-reduced-motion`

See `docs/components/accessibility.md` for detailed accessibility documentation.

---

## Component Status

| Component | Status | Storybook | Tests |
|-----------|--------|-----------|-------|
| Button | ✅ Stable | ✅ | ✅ |
| Card | ✅ Stable | ✅ | ✅ |
| Badge | ✅ Stable | ✅ | ✅ |
| DataTable | ✅ Stable | ✅ | ✅ |
| Modal | ✅ Stable | ✅ | ✅ |
| Input | ✅ Stable | ✅ | ✅ |
| Select | ✅ Stable | ✅ | ✅ |
| Tabs | ✅ Stable | ✅ | ✅ |
| DropdownMenu | ✅ Stable | ✅ | ✅ |
| Tooltip | ✅ Stable | ✅ | ✅ |
| Avatar | ✅ Stable | ✅ | ✅ |
| Skeleton | ✅ Stable | ✅ | ✅ |
| Progress | ✅ Stable | ✅ | ✅ |
| Switch | ✅ Stable | ✅ | ✅ |
| Accordion | ✅ Stable | ✅ | ✅ |
| Breadcrumb | ✅ Stable | ✅ | ✅ |
