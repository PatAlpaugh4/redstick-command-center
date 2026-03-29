# Component Stories

Storybook-style documentation showcasing component variants, states, and usage patterns.

---

## Button Stories

### Variants

**Primary (Default)**
```tsx
<Button>Primary Button</Button>
<Button isLoading>Loading...</Button>
<Button disabled>Disabled</Button>
```

**Secondary**
```tsx
<Button variant="secondary">Secondary Button</Button>
<Button variant="secondary" isLoading>Loading...</Button>
<Button variant="secondary" disabled>Disabled</Button>
```

**Ghost**
```tsx
<Button variant="ghost">Ghost Button</Button>
<Button variant="ghost" isLoading>Loading...</Button>
<Button variant="ghost" disabled>Disabled</Button>
```

**Danger**
```tsx
<Button variant="danger">Delete</Button>
<Button variant="danger" isLoading>Deleting...</Button>
<Button variant="danger" disabled>Disabled</Button>
```

### Sizes

```tsx
<div className="flex items-center gap-2">
  <Button size="sm">Small</Button>
  <Button size="md">Medium</Button>
  <Button size="lg">Large</Button>
</div>
```

### With Icons

```tsx
<Button leftIcon={<Plus className="w-4 h-4" />}>
  Add New
</Button>

<Button rightIcon={<ArrowRight className="w-4 h-4" />}>
  Continue
</Button>

<Button 
  leftIcon={<Download className="w-4 h-4" />}
  rightIcon={<ChevronDown className="w-4 h-4" />}
>
  Export
</Button>
```

### Icon Only

```tsx
<Button variant="ghost" aria-label="Edit" size="sm">
  <Edit className="w-4 h-4" />
</Button>

<Button variant="ghost" aria-label="Delete" size="sm">
  <Trash2 className="w-4 h-4" />
</Button>

<Button variant="secondary" aria-label="Settings">
  <Settings className="w-5 h-5" />
</Button>
```

### Full Width

```tsx
<Button className="w-full">Full Width Button</Button>
```

---

## Card Stories

### Basic Card

```tsx
<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
  </CardHeader>
  <CardContent>
    <p>This is the card content area.</p>
  </CardContent>
</Card>
```

### With Description

```tsx
<Card>
  <CardHeader>
    <CardTitle>Portfolio Summary</CardTitle>
    <CardDescription>Overview of your investment portfolio</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Total Value: $47.2M</p>
    <p>Active Deals: 12</p>
  </CardContent>
</Card>
```

### Hover Effect

```tsx
<Card hover>
  <CardContent className="p-6">
    <h3 className="text-lg font-semibold">Hover over me</h3>
    <p className="text-muted">This card lifts on hover</p>
  </CardContent>
</Card>
```

### Interactive Card

```tsx
<Card 
  interactive 
  onClick={() => console.log('Clicked!')}
  className="cursor-pointer"
>
  <CardHeader>
    <CardTitle>Clickable Card</CardTitle>
  </CardHeader>
  <CardContent>
    <p>This entire card is clickable</p>
  </CardContent>
</Card>
```

### With Footer

```tsx
<Card>
  <CardHeader>
    <CardTitle>Confirm Action</CardTitle>
  </CardHeader>
  <CardContent>
    <p>Are you sure you want to proceed?</p>
  </CardContent>
  <CardFooter className="flex justify-end gap-2">
    <Button variant="secondary">Cancel</Button>
    <Button>Confirm</Button>
  </CardFooter>
</Card>
```

### Card Variants

**Elevated**
```tsx
<Card className="shadow-lg">
  <CardContent>Elevated with shadow</CardContent>
</Card>
```

**Bordered**
```tsx
<Card className="border-2">
  <CardContent>Thick border</CardContent>
</Card>
```

**Compact**
```tsx
<Card>
  <CardContent className="p-3">Compact padding</CardContent>
</Card>
```

---

## Badge Stories

### Color Variants

```tsx
<div className="flex gap-2">
  <Badge>Default</Badge>
  <Badge variant="primary">Primary</Badge>
  <Badge variant="success">Success</Badge>
  <Badge variant="warning">Warning</Badge>
  <Badge variant="error">Error</Badge>
</div>
```

### Sizes

```tsx
<div className="flex items-center gap-2">
  <Badge variant="success" size="sm">Small</Badge>
  <Badge variant="success" size="md">Medium</Badge>
</div>
```

### Use Cases

**Status Indicators**
```tsx
<div className="space-y-2">
  <div className="flex items-center gap-2">
    <Badge variant="success">Live</Badge>
    <span>Production environment</span>
  </div>
  <div className="flex items-center gap-2">
    <Badge variant="warning">Maintenance</Badge>
    <span>Scheduled downtime</span>
  </div>
  <div className="flex items-center gap-2">
    <Badge variant="error">Offline</Badge>
    <span>Service unavailable</span>
  </div>
</div>
```

**Category Tags**
```tsx
<div className="flex flex-wrap gap-1">
  <Badge variant="primary">SaaS</Badge>
  <Badge variant="primary">FinTech</Badge>
  <Badge variant="primary">Enterprise</Badge>
  <Badge variant="primary">B2B</Badge>
</div>
```

**Notification Counts**
```tsx
<div className="flex items-center gap-4">
  <div className="relative">
    <Bell className="w-6 h-6" />
    <Badge 
      variant="error" 
      size="sm" 
      className="absolute -top-1 -right-1 px-1.5 py-0 text-xs"
    >
      3
    </Badge>
  </div>
</div>
```

---

## DataTable Stories

### Basic Table

```tsx
<DataTable
  data={[
    { id: 1, name: 'Acme Corp', stage: 'Closed', value: 5000000 },
    { id: 2, name: 'TechStart', stage: 'Due Diligence', value: 2500000 },
    { id: 3, name: 'Innovate Inc', stage: 'Sourcing', value: 1000000 },
  ]}
  columns={[
    { key: 'name', header: 'Company', sortable: true },
    { key: 'stage', header: 'Stage', sortable: true },
    { key: 'value', header: 'Value', sortable: true, align: 'right' },
  ]}
/>
```

### With Row Actions

```tsx
<DataTable
  data={deals}
  columns={[
    { key: 'name', header: 'Company' },
    { key: 'stage', header: 'Stage' },
    {
      key: 'actions',
      header: '',
      align: 'right',
      cell: (row) => (
        <div className="flex gap-1">
          <Button variant="ghost" size="sm" aria-label="View">
            <Eye className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" aria-label="Edit">
            <Edit className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" aria-label="Delete">
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ]}
/>
```

### With Selection

```tsx
<DataTable
  data={deals}
  columns={columns}
  enableSelection
  onSelectionChange={(selected) => console.log(selected)}
/>
```

### Loading State

```tsx
<DataTable
  data={[]}
  columns={columns}
  isLoading
  pageSize={5}
/>
```

### Empty State

```tsx
<DataTable
  data={[]}
  columns={columns}
  emptyMessage="No deals found. Create your first deal to get started."
/>
```

### Custom Cell Rendering

```tsx
<DataTable
  data={deals}
  columns={[
    {
      key: 'company',
      header: 'Company',
      cell: (row) => (
        <div className="flex items-center gap-3">
          <Avatar name={row.company} size="sm" />
          <div>
            <p className="font-medium">{row.company}</p>
            <p className="text-sm text-muted">{row.industry}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      cell: (row) => (
        <Badge variant={row.status === 'active' ? 'success' : 'warning'}>
          {row.status}
        </Badge>
      ),
    },
    {
      key: 'value',
      header: 'Value',
      align: 'right',
      cell: (row) => (
        <span className="font-mono">{formatCurrency(row.value)}</span>
      ),
    },
  ]}
/>
```

---

## Modal Stories

### Confirmation Dialog

```tsx
<Modal
  isOpen={isOpen}
  onClose={close}
  title="Delete Deal"
  description="This action cannot be undone."
  size="sm"
>
  <p className="text-muted">
    Are you sure you want to delete this deal? All associated data will be permanently removed.
  </p>
  <ModalFooter>
    <Button variant="secondary" onClick={close}>Cancel</Button>
    <Button variant="danger" onClick={confirmDelete}>Delete</Button>
  </ModalFooter>
</Modal>
```

### Form Modal

```tsx
<Modal
  isOpen={isOpen}
  onClose={close}
  title="Add New Deal"
  size="lg"
>
  <form className="space-y-4">
    <Input label="Company Name" isRequired />
    <Select label="Stage" options={stageOptions} />
    <Input label="Investment Amount" type="number" />
    <Textarea label="Notes" />
  </form>
  <ModalFooter>
    <Button variant="secondary" onClick={close}>Cancel</Button>
    <Button type="submit">Save Deal</Button>
  </ModalFooter>
</Modal>
```

### Success Modal

```tsx
<Modal
  isOpen={isOpen}
  onClose={close}
  title="Success!"
  size="sm"
>
  <div className="text-center py-4">
    <div className="w-12 h-12 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-4">
      <CheckCircle className="w-6 h-6 text-success" />
    </div>
    <p>Your deal has been successfully created.</p>
  </div>
  <ModalFooter>
    <Button onClick={close} className="w-full">Done</Button>
  </ModalFooter>
</Modal>
```

### Size Variants

```tsx
// Small
<Modal isOpen={true} onClose={() => {}} title="Small Modal" size="sm">
  <p>Compact modal for simple confirmations</p>
</Modal>

// Medium (default)
<Modal isOpen={true} onClose={() => {}} title="Medium Modal" size="md">
  <p>Standard modal for most use cases</p>
</Modal>

// Large
<Modal isOpen={true} onClose={() => {}} title="Large Modal" size="lg">
  <p>Large modal for complex forms or content</p>
</Modal>

// Extra Large
<Modal isOpen={true} onClose={() => {}} title="Extra Large Modal" size="xl">
  <p>Extra large modal for full-page experiences</p>
</Modal>
```

---

## Toast Stories

### Toast Types

```tsx
const toast = useToast();

// Success
<Button onClick={() => toast.success('Changes saved successfully')}>
  Show Success
</Button>

// Error
<Button onClick={() => toast.error('Failed to save changes')}>
  Show Error
</Button>

// Warning
<Button onClick={() => toast.warning('Please review your input')}>
  Show Warning
</Button>

// Info
<Button onClick={() => toast.info('New updates available')}>
  Show Info
</Button>
```

### Toast with Action

```tsx
<Button
  onClick={() =>
    toast.success('Deal created', {
      action: {
        label: 'View',
        onClick: () => router.push('/deals/123'),
      },
    })
  }
>
  Create with Action
</Button>
```

### Promise Toast

```tsx
<Button
  onClick={() =>
    toast.promise(saveDeal(), {
      loading: 'Saving deal...',
      success: 'Deal saved successfully!',
      error: 'Failed to save deal',
    })
  }
>
  Save Deal
</Button>
```

### Toast Positioning

```tsx
// Configure in provider
<ToastProvider position="top-right">
  <App />
</ToastProvider>

// Positions: top-left, top-center, top-right, bottom-left, bottom-center, bottom-right
```

---

## Input Stories

### Basic Input

```tsx
<Input label="Email" type="email" placeholder="you@example.com" />
```

### With Error

```tsx
<Input
  label="Password"
  type="password"
  error="Password must be at least 8 characters"
  isRequired
/>
```

### With Helper Text

```tsx
<Input
  label="Username"
  helperText="This will be visible to other users"
  placeholder="johndoe"
/>
```

### With Icons

```tsx
<Input
  label="Search"
  leftIcon={<Search className="w-4 h-4" />}
  placeholder="Search deals..."
/>

<Input
  label="Password"
  type={showPassword ? 'text' : 'password'}
  rightIcon={
    <button onClick={togglePassword}>
      {showPassword ? <EyeOff /> : <Eye />}
    </button>
  }
/>
```

### Sizes

```tsx
<Input size="sm" label="Small" placeholder="Small input" />
<Input size="md" label="Medium" placeholder="Medium input" />
<Input size="lg" label="Large" placeholder="Large input" />
```

### States

```tsx
<Input label="Default" placeholder="Default state" />
<Input label="Disabled" placeholder="Disabled" isDisabled />
<Input label="Read Only" value="Cannot edit" isReadOnly />
<Input label="Required" placeholder="Required field" isRequired />
```

---

## Select Stories

### Single Select

```tsx
<Select
  label="Stage"
  options={[
    { value: 'sourcing', label: 'Sourcing' },
    { value: 'screening', label: 'Screening' },
    { value: 'due-diligence', label: 'Due Diligence' },
    { value: 'closed', label: 'Closed' },
  ]}
/>
```

### Multi-Select

```tsx
<Select
  label="Tags"
  isMulti
  options={[
    { value: 'saas', label: 'SaaS' },
    { value: 'fintech', label: 'FinTech' },
    { value: 'b2b', label: 'B2B' },
    { value: 'enterprise', label: 'Enterprise' },
  ]}
/>
```

### Grouped Options

```tsx
<Select
  label="Industry"
  options={[
    {
      label: 'Technology',
      options: [
        { value: 'saas', label: 'SaaS' },
        { value: 'ai', label: 'AI/ML' },
        { value: 'fintech', label: 'FinTech' },
      ],
    },
    {
      label: 'Healthcare',
      options: [
        { value: 'biotech', label: 'BioTech' },
        { value: 'medtech', label: 'MedTech' },
        { value: 'digital-health', label: 'Digital Health' },
      ],
    },
  ]}
/>
```

### With Search

```tsx
<Select
  label="Assignee"
  isSearchable
  options={users}
  placeholder="Search users..."
/>
```

---

## Tabs Stories

### Horizontal Tabs (Default)

```tsx
<Tabs
  tabs={[
    { id: 'overview', label: 'Overview', content: <OverviewContent /> },
    { id: 'metrics', label: 'Metrics', content: <MetricsContent /> },
    { id: 'team', label: 'Team', content: <TeamContent /> },
  ]}
/>
```

### Vertical Tabs

```tsx
<Tabs
  orientation="vertical"
  tabs={[
    { id: 'general', label: 'General', content: <GeneralSettings /> },
    { id: 'security', label: 'Security', content: <SecuritySettings /> },
    { id: 'notifications', label: 'Notifications', content: <NotificationSettings /> },
  ]}
/>
```

### With Icons

```tsx
<Tabs
  tabs={[
    { 
      id: 'overview', 
      label: 'Overview', 
      icon: <LayoutDashboard className="w-4 h-4" />,
      content: <Overview /> 
    },
    { 
      id: 'analytics', 
      label: 'Analytics', 
      icon: <BarChart3 className="w-4 h-4" />,
      content: <Analytics /> 
    },
    { 
      id: 'settings', 
      label: 'Settings', 
      icon: <Settings className="w-4 h-4" />,
      content: <Settings /> 
    },
  ]}
/>
```

### Variant: Pills

```tsx
<Tabs
  variant="pills"
  tabs={[
    { id: 'active', label: 'Active', content: <ActiveDeals /> },
    { id: 'archived', label: 'Archived', content: <ArchivedDeals /> },
  ]}
/>
```

### With Badges

```tsx
<Tabs
  tabs={[
    { id: 'all', label: 'All', badge: 24, content: <AllDeals /> },
    { id: 'pending', label: 'Pending', badge: 3, content: <PendingDeals /> },
    { id: 'approved', label: 'Approved', badge: 21, content: <ApprovedDeals /> },
  ]}
/>
```

---

## Dropdown Menu Stories

### Basic Menu

```tsx
<DropdownMenu
  trigger={<Button rightIcon={<ChevronDown />}>Actions</Button>}
  items={[
    { type: 'item', label: 'Edit', onClick: () => {} },
    { type: 'item', label: 'Duplicate', onClick: () => {} },
    { type: 'separator' },
    { type: 'item', label: 'Delete', onClick: () => {} },
  ]}
/>
```

### With Icons

```tsx
<DropdownMenu
  trigger={<Button variant="secondary">Options</Button>}
  items={[
    { type: 'item', label: 'Edit', icon: <Edit className="w-4 h-4" />, onClick: () => {} },
    { type: 'item', label: 'Share', icon: <Share className="w-4 h-4" />, onClick: () => {} },
    { type: 'item', label: 'Copy link', icon: <Link className="w-4 h-4" />, onClick: () => {} },
    { type: 'separator' },
    { type: 'item', label: 'Delete', icon: <Trash2 className="w-4 h-4" />, onClick: () => {} },
  ]}
/>
```

### With Submenu

```tsx
<DropdownMenu
  trigger={<Button>Move to</Button>}
  items={[
    {
      type: 'submenu',
      label: 'Portfolio',
      icon: <Folder className="w-4 h-4" />,
      items: [
        { type: 'item', label: 'Portfolio A', onClick: () => {} },
        { type: 'item', label: 'Portfolio B', onClick: () => {} },
        { type: 'item', label: 'Portfolio C', onClick: () => {} },
      ],
    },
    {
      type: 'submenu',
      label: 'Stage',
      icon: <GitBranch className="w-4 h-4" />,
      items: [
        { type: 'item', label: 'Sourcing', onClick: () => {} },
        { type: 'item', label: 'Due Diligence', onClick: () => {} },
        { type: 'item', label: 'Closed', onClick: () => {} },
      ],
    },
  ]}
/>
```

### With Checkboxes

```tsx
<DropdownMenu
  trigger={<Button>View Options</Button>}
  items={[
    { type: 'checkbox', label: 'Show Grid', checked: showGrid, onCheckedChange: setShowGrid },
    { type: 'checkbox', label: 'Show Sidebar', checked: showSidebar, onCheckedChange: setShowSidebar },
    { type: 'separator' },
    { type: 'group', label: 'Density', items: [
      { type: 'radio', label: 'Compact', value: 'compact', groupValue: density, onSelect: setDensity },
      { type: 'radio', label: 'Comfortable', value: 'comfortable', groupValue: density, onSelect: setDensity },
    ]},
  ]}
/>
```

---

## Tooltip Stories

### Basic Tooltip

```tsx
<Tooltip content="This is a tooltip">
  <Button>Hover me</Button>
</Tooltip>
```

### Positions

```tsx
<div className="flex gap-4">
  <Tooltip content="Top tooltip" side="top">
    <Button>Top</Button>
  </Tooltip>
  <Tooltip content="Right tooltip" side="right">
    <Button>Right</Button>
  </Tooltip>
  <Tooltip content="Bottom tooltip" side="bottom">
    <Button>Bottom</Button>
  </Tooltip>
  <Tooltip content="Left tooltip" side="left">
    <Button>Left</Button>
  </Tooltip>
</div>
```

### With Delay

```tsx
<Tooltip content="Appears after 500ms" delay={500}>
  <Button>Delayed</Button>
</Tooltip>
```

### Icon Tooltip

```tsx
<Tooltip content="Delete this item">
  <Button variant="ghost" aria-label="Delete">
    <Trash2 className="w-4 h-4" />
  </Button>
</Tooltip>
```

### Keyboard Shortcut

```tsx
<Tooltip content="Command Palette (⌘K)">
  <Button variant="secondary">
    <Command className="w-4 h-4" />
  </Button>
</Tooltip>
```

---

## Avatar Stories

### Sizes

```tsx
<div className="flex items-center gap-2">
  <Avatar size="xs" name="John Doe" />
  <Avatar size="sm" name="John Doe" />
  <Avatar size="md" name="John Doe" />
  <Avatar size="lg" name="John Doe" />
  <Avatar size="xl" name="John Doe" />
</div>
```

### With Image

```tsx
<Avatar src="/avatars/john.jpg" alt="John Doe" name="John Doe" />
```

### With Status

```tsx
<div className="flex gap-4">
  <Avatar name="John" status="online" />
  <Avatar name="Jane" status="away" />
  <Avatar name="Bob" status="busy" />
  <Avatar name="Alice" status="offline" />
</div>
```

### Group

```tsx
<AvatarGroup max={3}>
  <Avatar src="/user1.jpg" name="User 1" />
  <Avatar src="/user2.jpg" name="User 2" />
  <Avatar src="/user3.jpg" name="User 3" />
  <Avatar src="/user4.jpg" name="User 4" />
  <Avatar src="/user5.jpg" name="User 5" />
</AvatarGroup>
// Shows 3 avatars + "+2"
```

---

## Skeleton Stories

### Text Lines

```tsx
<div className="space-y-2">
  <Skeleton width="75%" height={20} />
  <Skeleton width="100%" height={20} />
  <Skeleton width="50%" height={20} />
</div>
```

### Card Skeleton

```tsx
<Card>
  <CardHeader>
    <Skeleton width={150} height={24} />
    <Skeleton width={100} height={16} />
  </CardHeader>
  <CardContent className="space-y-2">
    <Skeleton height={16} />
    <Skeleton height={16} />
    <Skeleton width="75%" height={16} />
  </CardContent>
</Card>
```

### Table Skeleton

```tsx
<div className="space-y-3">
  <div className="flex gap-4">
    <Skeleton width={200} height={40} />
    <Skeleton width={150} height={40} />
    <Skeleton width={150} height={40} />
  </div>
  {Array.from({ length: 5 }).map((_, i) => (
    <div key={i} className="flex gap-4">
      <Skeleton width={200} height={50} />
      <Skeleton width={150} height={50} />
      <Skeleton width={150} height={50} />
    </div>
  ))}
</div>
```

### Circle Skeleton

```tsx
<div className="flex items-center gap-3">
  <Skeleton circle width={40} height={40} />
  <div className="space-y-1">
    <Skeleton width={120} height={16} />
    <Skeleton width={80} height={12} />
  </div>
</div>
```

---

## Progress Stories

### Linear Progress

```tsx
<Progress value={0} />
<Progress value={25} />
<Progress value={50} />
<Progress value={75} />
<Progress value={100} />
```

### With Label

```tsx
<Progress value={75} showLabel />
```

### Colors

```tsx
<div className="space-y-2">
  <Progress value={30} color="error" />
  <Progress value={60} color="warning" />
  <Progress value={90} color="success" />
  <Progress value={45} color="primary" />
</div>
```

### Sizes

```tsx
<Progress value={60} size="sm" />
<Progress value={60} size="md" />
<Progress value={60} size="lg" />
```

### Indeterminate

```tsx
<Progress isIndeterminate />
```

### Circular Progress

```tsx
<div className="flex gap-4">
  <CircularProgress value={0} size={60} />
  <CircularProgress value={25} size={60} />
  <CircularProgress value={50} size={60} />
  <CircularProgress value={75} size={60} />
  <CircularProgress value={100} size={60} />
</div>
```

---

## Switch Stories

### Basic Switch

```tsx
<Switch checked={enabled} onCheckedChange={setEnabled} />
```

### With Label

```tsx
<Switch
  checked={notifications}
  onCheckedChange={setNotifications}
  label="Enable notifications"
/>
```

### With Description

```tsx
<Switch
  checked={emails}
  onCheckedChange={setEmails}
  label="Email notifications"
  description="Receive email alerts for important updates"
/>
```

### Sizes

```tsx
<div className="flex items-center gap-4">
  <Switch size="sm" checked={true} />
  <Switch size="md" checked={true} />
  <Switch size="lg" checked={true} />
</div>
```

### Disabled

```tsx
<Switch checked={true} disabled label="Always on (disabled)" />
<Switch checked={false} disabled label="Always off (disabled)" />
```

---

## Accordion Stories

### Basic Accordion

```tsx
<Accordion
  items={[
    {
      id: '1',
      title: 'What is your return policy?',
      content: <p>We accept returns within 30 days of purchase.</p>,
    },
    {
      id: '2',
      title: 'How do I track my order?',
      content: <p>You can track your order in the account dashboard.</p>,
    },
    {
      id: '3',
      title: 'Can I change my shipping address?',
      content: <p>Yes, you can modify your address before shipping.</p>,
    },
  ]}
/>
```

### Allow Multiple

```tsx
<Accordion allowMultiple items={items} />
```

### Bordered Variant

```tsx
<Accordion variant="bordered" items={items} />
```

### Separated Variant

```tsx
<Accordion variant="separated" items={items} />
```

---

## Breadcrumb Stories

### Basic Breadcrumb

```tsx
<Breadcrumb
  items={[
    { label: 'Home', href: '/' },
    { label: 'Portfolio', href: '/portfolio' },
    { label: 'Deals', href: '/portfolio/deals' },
    { label: 'Acme Corp' },
  ]}
/>
```

### Custom Separator

```tsx
<Breadcrumb
  items={items}
  separator={<ChevronRight className="w-4 h-4" />}
/>
```

### With Overflow

```tsx
<Breadcrumb
  items={longItems}
  maxItems={4}
/>
// Shows: Home / ... / Parent / Current
```

---

## Playground Examples

### Deal Card

```tsx
<Card hover>
  <CardHeader className="flex flex-row items-start justify-between">
    <div className="flex items-center gap-3">
      <Avatar name="Acme Corp" size="md" />
      <div>
        <CardTitle>Acme Corp</CardTitle>
        <CardDescription>Series B • SaaS</CardDescription>
      </div>
    </div>
    <Badge variant="success">Active</Badge>
  </CardHeader>
  <CardContent>
    <div className="grid grid-cols-2 gap-4">
      <div>
        <p className="text-sm text-muted">Investment</p>
        <p className="text-xl font-semibold">$5M</p>
      </div>
      <div>
        <p className="text-sm text-muted">Ownership</p>
        <p className="text-xl font-semibold">12%</p>
      </div>
    </div>
  </CardContent>
  <CardFooter className="justify-end">
    <Button variant="secondary" size="sm">View Details</Button>
  </CardFooter>
</Card>
```

### Settings Panel

```tsx
<Card className="w-full max-w-md">
  <CardHeader>
    <CardTitle>Notifications</CardTitle>
    <CardDescription>Manage your notification preferences</CardDescription>
  </CardHeader>
  <CardContent className="space-y-6">
    <Switch
      checked={emailNotifications}
      onCheckedChange={setEmailNotifications}
      label="Email notifications"
      description="Receive emails about deal updates"
    />
    <Switch
      checked={pushNotifications}
      onCheckedChange={setPushNotifications}
      label="Push notifications"
      description="Receive push notifications on your device"
    />
    <Switch
      checked={weeklyDigest}
      onCheckedChange={setWeeklyDigest}
      label="Weekly digest"
      description="Get a summary of portfolio activity"
    />
  </CardContent>
  <CardFooter>
    <Button className="w-full">Save Changes</Button>
  </CardFooter>
</Card>
```

### Search Interface

```tsx
<div className="space-y-4">
  <div className="flex gap-2">
    <Input
      className="flex-1"
      placeholder="Search deals..."
      leftIcon={<Search className="w-4 h-4" />}
    />
    <Select
      options={stageOptions}
      placeholder="Filter by stage"
      className="w-48"
    />
    <Button leftIcon={<Filter className="w-4 h-4" />}>Filter</Button>
  </div>
  <DataTable
    data={deals}
    columns={columns}
    enableSelection
  />
</div>
```

### Form Layout

```tsx
<div className="max-w-2xl mx-auto space-y-6">
  <div className="grid grid-cols-2 gap-4">
    <Input label="First Name" isRequired />
    <Input label="Last Name" isRequired />
  </div>
  <Input label="Email" type="email" isRequired />
  <Select
    label="Company Stage"
    options={stageOptions}
    isRequired
  />
  <div className="grid grid-cols-2 gap-4">
    <Input label="Investment Amount" type="number" prefix="$" />
    <Input label="Target Ownership" suffix="%" />
  </div>
  <div className="flex justify-end gap-2 pt-4">
    <Button variant="secondary">Save as Draft</Button>
    <Button>Submit</Button>
  </div>
</div>
```
