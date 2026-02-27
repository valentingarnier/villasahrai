# Components Reference

All components in `frontend/src/components/`.

## Catalyst UI Components (original)

### Button (`button.tsx`)
Discriminated union props — pick ONE style:
```tsx
<Button color="amber" onClick={fn}>Primary</Button>     // Colored
<Button outline onClick={fn}>Secondary</Button>          // Outline
<Button plain onClick={fn}>Tertiary</Button>              // Plain text
<Button href="/path">Link Button</Button>                 // Renders as Link
```
**Colors**: dark, zinc, white, blue, red, green, orange, amber, yellow, purple, fuchsia, pink, rose, indigo, sky, cyan, teal, emerald, lime
**IMPORTANT**: Cannot combine `color` + `outline` or `color` + `plain`. Use conditional rendering.

### Badge (`badge.tsx`)
```tsx
<Badge color="green">Active</Badge>
<Badge color="amber">Pending</Badge>
```
**Colors**: Same palette as Button. Renders as `<span>`.

### Input (`input.tsx`)
```tsx
import { Input, InputGroup } from "@/components/input";
<InputGroup>
  <MagnifyingGlassIcon data-slot="icon" />
  <Input type="search" placeholder="Rechercher..." value={v} onChange={fn} />
</InputGroup>
```
- `InputGroup` wraps Input + icon. Icon must have `data-slot="icon"`.
- Supports `type="date"` with custom styling.

### Heading (`heading.tsx`)
```tsx
<Heading>Main Title</Heading>          // h1, text-2xl
<Subheading>Section Title</Subheading> // h2/h3, text-base
<Heading level={3}>H3</Heading>        // Custom level
```

### Text (`text.tsx`)
```tsx
<Text>Paragraph text</Text>
<Strong>Bold text</Strong>
<Code>inline code</Code>
<TextLink href="/path">Link</TextLink>
```

### Dialog (`dialog.tsx`)
```tsx
<Dialog open={isOpen} onClose={setIsOpen}>
  <DialogTitle>Title</DialogTitle>
  <DialogDescription>Description</DialogDescription>
  <DialogBody>{/* form fields */}</DialogBody>
  <DialogActions>
    <Button plain onClick={close}>Cancel</Button>
    <Button color="amber" onClick={save}>Save</Button>
  </DialogActions>
</Dialog>
```

### Dropdown (`dropdown.tsx`)
```tsx
<Dropdown>
  <DropdownButton as={SidebarItem}>Trigger</DropdownButton>
  <DropdownMenu anchor="top start">
    <DropdownItem onClick={fn}>Action</DropdownItem>
    <DropdownDivider />
    <DropdownItem href="/path">Link</DropdownItem>
  </DropdownMenu>
</Dropdown>
```

### Sidebar (`sidebar.tsx`)
```tsx
<Sidebar>
  <SidebarHeader><Logo /></SidebarHeader>
  <SidebarBody>
    <SidebarSection>
      <SidebarHeading>Section Title</SidebarHeading>
      <SidebarItem href="/path" current={isActive}>
        <SomeIcon />
        <SidebarLabel>Label</SidebarLabel>
      </SidebarItem>
    </SidebarSection>
  </SidebarBody>
  <SidebarFooter>{/* user dropdown */}</SidebarFooter>
</Sidebar>
```
- `SidebarItem` supports `href` (renders Link) or `onClick` (renders button)
- `current` prop shows animated active indicator

### SidebarLayout (`sidebar-layout.tsx`)
```tsx
<SidebarLayout navbar={<Navbar />} sidebar={<Sidebar>...</Sidebar>}>
  {children}
</SidebarLayout>
```
Responsive: fixed sidebar on desktop (lg+), drawer on mobile.

### Avatar (`avatar.tsx`)
```tsx
<Avatar initials="KB" className="size-8 bg-amber-600 text-white" />
<Avatar src="/photo.jpg" className="size-10" />
```

### Other
- **Divider**: `<Divider />` — horizontal line
- **Link**: `<Link href="/path">` — Next.js Link wrapper for Headless UI
- **Navbar**: `<Navbar><NavbarLabel>Text</NavbarLabel></Navbar>`
- **Logo**: `<Logo size="sm|md|lg" href="/dashboard" />` — VS monogram + "Villa Sahrai"

---

## Custom Components (Villa Sahrai)

### Textarea (`textarea.tsx`)
```tsx
import { Textarea } from "@/components/textarea";
<Textarea rows={6} value={text} onChange={(e) => setText(e.target.value)} />
```
Matches Input styling. Uses `forwardRef`. Supports standard textarea attributes.

### Select (`select.tsx`)
```tsx
import { Select } from "@/components/select";
<Select value={filter} onChange={(e) => setFilter(e.target.value)}>
  <option value="all">Tous</option>
  <option value="email">Email</option>
</Select>
```
Native `<select>` styled to match Input. Custom chevron icon. Uses `forwardRef`.

### StatCard (`stat-card.tsx`)
```tsx
import { StatCard } from "@/components/stat-card";
<StatCard
  title="Avis totaux"
  value={156}
  icon={<StarIcon />}
  trend={{ value: 12, direction: "up" }}
/>
```
Props: `title`, `value` (string|number), `icon?`, `trend?` ({ value, direction }), `subtitle?`.
White card with amber icon circle, large value, optional green/red trend arrow.

### StarRating (`star-rating.tsx`)
```tsx
import { StarRating } from "@/components/star-rating";
<StarRating rating={4.5} size="sm" showValue />
```
Props: `rating` (1-5, supports decimals), `size?` ("sm"|"md"), `showValue?` (boolean).
Amber filled stars, zinc empty stars, half-star support via clip.

### SourceBadge (`source-badge.tsx`)
```tsx
import { SourceBadge } from "@/components/source-badge";
<SourceBadge source="booking" />
```
Props: `source` ("booking"|"google"|"expedia"|"tripadvisor").
Renders **logo-only SVGs** (no text label) at `size-5`:
- Google: multicolor "G" logo
- Booking.com: white "B." on dark blue rounded rect
- TripAdvisor: owl-inspired icon on green circle
- Expedia: "Ex" on yellow rounded rect

Unknown sources fall back to a text badge.

### StatusDot (`status-dot.tsx`)
```tsx
import { StatusDot } from "@/components/status-dot";
<StatusDot status="online" label="En ligne" />
```
Props: `status` ("online"|"offline"|"busy"), `size?` ("sm"|"md"), `label?` (string).
Online=green with pulse animation, offline=zinc, busy=amber.
