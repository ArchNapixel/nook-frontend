# NOOK Frontend Engineering Instructions

## Purpose

This document defines the frontend engineering rules for **NOOK**.

The goal is to keep the Next.js frontend:

- modular
- maintainable
- reusable
- responsive
- type-safe
- easy to scale
- free from duplicated UI and unnecessary code bloat

These instructions should be followed by both human developers and coding agents when creating, modifying, or refactoring frontend code.

---

# 1. Core Principle

**Do not build pages as large monolithic files.**

Pages should mainly compose smaller components and feature modules.

Prefer:

```tsx
export default function ExplorePage() {
  return (
    <ExploreLayout>
      <ExploreHeader />
      <ExploreFilters />
      <ExploreResults />
      <ExploreMap />
    </ExploreLayout>
  );
}
```

Avoid:

```tsx
export default function ExplorePage() {
  // 500+ lines of fetching, filtering, cards,
  // dialogs, map logic, forms, styles, and state.
}
```

A page should describe **what is displayed**, not contain every implementation detail.

---

# 2. Component Reusability

Before creating a new component, check whether an existing component can be:

1. reused directly
2. extended using props
3. composed with another component
4. generalized without making it unnecessarily complex

Do not create nearly identical components such as:

```text
CafeCard
RestaurantCard
MallCard
StudySpotCard
```

if they share the same visual structure.

Prefer:

```tsx
<PlaceCard place={place} />
```

with configurable props or variants when necessary.

Example:

```tsx
type PlaceCardProps = {
  place: Place;
  variant?: "default" | "compact" | "horizontal";
};
```

Do not create a new variant unless there is a real UI difference.

---

# 3. Avoid Premature Abstraction

Reusable code is important, but do not create abstractions simply because two pieces of code look slightly similar.

Use the **Rule of Three**:

- First occurrence: implement normally.
- Second occurrence: observe the similarity.
- Third occurrence: consider extracting a reusable abstraction.

Extract immediately only when the component is clearly universal, such as:

- Button
- Modal
- EmptyState
- LoadingState
- PageHeader
- SearchInput
- PlaceCard
- FilterChip
- RatingDisplay

Do not create generic systems that are harder to understand than the duplicated code they replace.

---

# 4. Feature-Based Architecture

Organize business functionality by **feature**, not only by technical file type.

Recommended structure:

```text
src/
├── app/
│   ├── explore/
│   ├── itinerary/
│   ├── favorites/
│   ├── profile/
│   └── layout.tsx
│
├── components/
│   ├── ui/
│   ├── layout/
│   └── shared/
│
├── features/
│   ├── places/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── api/
│   │   ├── types/
│   │   └── utils/
│   │
│   ├── itinerary/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── api/
│   │   ├── types/
│   │   └── utils/
│   │
│   ├── auth/
│   └── schedules/
│
├── lib/
│   ├── api/
│   ├── constants/
│   ├── utils/
│   └── config/
│
├── hooks/
└── types/
```

### Placement rule

Use these questions:

**Is it used only by one feature?**

Place it inside:

```text
features/<feature>/
```

**Is it reused by multiple unrelated features?**

Place it inside:

```text
components/shared/
```

**Is it a primitive UI component?**

Place it inside:

```text
components/ui/
```

Do not move feature-specific components into global folders simply because they are components.

---

# 5. Keep Components Focused

A component should have one clear responsibility.

Prefer:

```text
PlaceCard
PlaceImage
PlaceAmenities
PlacePriceRange
PlaceDistance
```

when those sections become independently complex.

Avoid components that simultaneously:

- fetch data
- transform data
- manage five unrelated states
- render an entire page
- open dialogs
- perform API mutations
- contain business rules

Separate:

```text
data logic
business logic
presentation
```

when complexity justifies it.

---

# 6. Keep Business Logic Out of UI Components

UI components should not contain complicated recommendation or itinerary logic.

Bad:

```tsx
const score =
  preference * 0.3 +
  distance * 0.2 +
  price * 0.2 +
  rating * 0.15 +
  amenities * 0.15;
```

inside:

```text
PlaceCard.tsx
```

Business logic belongs in:

```text
features/<feature>/utils/
features/<feature>/services/
```

or preferably the backend when it determines application behavior.

Frontend components should receive already prepared data whenever possible.

---

# 7. API Layer

Do not scatter raw `fetch()` or `axios` calls across components.

Use a centralized API client.

Example:

```text
src/lib/api/client.ts
```

Then feature-specific API functions:

```text
src/features/places/api/get-places.ts
src/features/itinerary/api/generate-itinerary.ts
```

Example:

```ts
export async function getPlaces(params: GetPlacesParams) {
  return api.get<Place[]>("/places", {
    params,
  });
}
```

Components should call feature hooks or API functions rather than constructing endpoint logic themselves.

Avoid:

```tsx
fetch("http://localhost:3001/api/places?...")
```

directly inside multiple components.

---

# 8. Types

Never duplicate the same domain type across multiple files.

Prefer one source of truth per feature.

Example:

```text
features/places/types/place.ts
```

```ts
export interface Place {
  id: string;
  name: string;
  category: PlaceCategory;
  priceRange: PriceRange;
  location: Location;
}
```

Do not use `any` unless there is an exceptional and documented reason.

Prefer:

```ts
unknown
```

when the type is not yet validated.

Avoid giant shared `types.ts` files containing unrelated application types.

---

# 9. Props

Keep component props intentional.

Avoid passing a large number of unrelated primitive props:

```tsx
<PlaceCard
  id={id}
  name={name}
  city={city}
  image={image}
  category={category}
  latitude={lat}
  longitude={lng}
  priceMin={priceMin}
  priceMax={priceMax}
  ...
/>
```

Prefer:

```tsx
<PlaceCard place={place} />
```

Add separate props only for component behavior:

```tsx
<PlaceCard
  place={place}
  variant="compact"
  onSelect={handleSelect}
/>
```

---

# 10. State Management

Use the smallest state solution that solves the problem.

Preferred order:

1. local component state
2. lifted state within a feature
3. URL/search parameters
4. server state library
5. global state only when genuinely necessary

Do not introduce a global state library for state that belongs to one page or component.

Examples:

Use local state for:

```text
dialog open/closed
dropdown state
temporary input
```

Use URL state for:

```text
search query
category
price range
filters
sort order
```

This makes filtered pages shareable and preserves state across navigation.

---

# 11. Server State

Treat API data differently from local UI state.

Do not manually maintain unnecessary duplicated copies of server data.

When using a server-state solution such as TanStack Query:

- centralize query keys
- invalidate affected queries after mutations
- avoid unnecessary refetching
- use loading and error states consistently

Do not store API responses in global state merely to avoid fetching them correctly.

---

# 12. Next.js Server and Client Components

Default to **Server Components** when interactivity is not required.

Use `"use client"` only when needed for:

- state
- browser APIs
- event handlers
- interactive maps
- interactive forms
- client-side libraries

Do not add `"use client"` at a high-level layout simply because one child needs interactivity.

Move the interactive child into its own Client Component.

This keeps the client bundle smaller.

---

# 13. Dynamic Imports

Heavy browser-only components should be loaded only when necessary.

For example:

```text
Mapbox map
large chart
complex editor
```

Consider dynamic import where it materially reduces the initial bundle.

Do not dynamically import tiny components without a reason.

---

# 14. UI Consistency

Use the shared design system before writing new UI patterns.

For NOOK:

- use shadcn/ui primitives when appropriate
- use shared spacing rules
- use shared typography
- use shared border radius values
- use shared button variants
- use shared form controls

Do not recreate custom buttons, inputs, dialogs, dropdowns, or badges on individual pages if a shared component already exists.

---

# 15. Do Not Hardcode Repeated UI Data

Avoid:

```tsx
<option value="cafe">Cafe</option>
<option value="restaurant">Restaurant</option>
<option value="mall">Mall</option>
```

in several places.

Prefer:

```ts
export const PLACE_CATEGORIES = [
  { value: "cafe", label: "Cafe" },
  { value: "restaurant", label: "Restaurant" },
  { value: "mall", label: "Mall" },
] as const;
```

Store shared constants in an appropriate feature or shared constants file.

---

# 16. Responsive Design Is Required

Every screen must remain usable on:

- phone
- tablet
- laptop
- desktop
- narrow resized desktop windows

Do not simply shrink desktop UI.

Responsive behavior should intentionally adapt.

Examples:

Desktop:

```text
Map | Results
```

Mobile:

```text
Results
[View Map]
```

Desktop navigation:

```text
Explore | Saved | Itineraries | Profile
```

Mobile:

```text
Bottom navigation or compact menu
```

When space becomes limited:

- collapse secondary actions
- move low-priority actions into menus
- avoid horizontal overflow
- preserve the primary action
- truncate long text gracefully
- use tooltips/details when necessary

---

# 17. Long and Unexpected Data

Assume production data can be longer than mock data.

Components must handle:

```text
very long place names
large prices
missing images
missing descriptions
long addresses
zero results
hundreds of results
unexpected API errors
slow API responses
```

Use:

- truncation
- wrapping
- max-width
- responsive layouts
- skeletons
- empty states
- error states

Do not design only around perfect placeholder data.

---

# 18. Accessibility

All interactive elements must be keyboard accessible.

Use semantic elements:

```html
button
nav
main
section
label
input
```

instead of clickable `div` elements.

Images need appropriate alt text.

Form inputs need associated labels.

Icon-only buttons need accessible names.

Do not remove focus outlines without providing an accessible replacement.

---

# 19. Loading, Empty, and Error States

Every data-driven feature should account for:

```text
loading
success
empty
error
```

Do not render a blank page while waiting.

Prefer shared components such as:

```text
LoadingState
EmptyState
ErrorState
```

when those patterns are reused.

---

# 20. File Size Guideline

There is no strict line-count rule, but large files should trigger review.

When a component approaches roughly **250–300 lines**, ask:

- Is it doing more than one job?
- Can sections become subcomponents?
- Can business logic move into a hook or utility?
- Are unrelated concerns mixed together?

Do not split files purely to satisfy a number.

Split based on responsibility.

---

# 21. Hooks

Create custom hooks when they package reusable stateful behavior.

Good examples:

```text
usePlaceFilters
useGeolocation
useDebounce
useSavedPlaces
```

Avoid hooks that simply rename a one-line library call without adding meaningful behavior.

A hook should reduce duplication or hide meaningful complexity.

---

# 22. Utilities

Utility functions should:

- be pure when possible
- do one thing
- have predictable names
- be easily testable

Example:

```ts
formatPriceRange()
formatTravelTime()
calculateDistanceLabel()
```

Do not create a `utils.ts` dumping ground.

Prefer focused files when utility groups grow.

---

# 23. Avoid Barrel File Abuse

Do not create `index.ts` exports everywhere.

Barrel files are acceptable when they materially improve public module APIs, but excessive barrel exports can make dependency relationships harder to understand.

Prefer direct imports for internal feature code.

---

# 24. Dependency Discipline

Before installing a new package, ask:

1. Can the platform already do this?
2. Does an existing dependency already solve it?
3. Is the package actively maintained?
4. Is the package worth the added bundle/dependency cost?

Do not install a package for trivial logic.

Examples:

Do not add a library solely to:

```text
capitalize a string
format a simple duration
merge two arrays
```

Use packages where they provide meaningful value.

---

# 25. Performance

Optimize based on actual architecture, not premature micro-optimizations.

Prioritize:

- smaller client bundles
- server rendering where appropriate
- image optimization
- avoiding unnecessary rerenders
- pagination or virtualization for large lists
- efficient API requests
- route-level code splitting
- lazy loading heavy components
- avoiding duplicate requests

Do not add `useMemo` and `useCallback` everywhere automatically.

Use them only when there is a measurable or structurally meaningful reason.

---

# 26. Images

Use Next.js image optimization when practical.

Do not load full-resolution images where thumbnails are sufficient.

Provide:

- appropriate sizes
- fallback behavior
- predictable aspect ratios

Place cards should not jump around while images load.

---

# 27. Forms

Use reusable form patterns.

Validation rules should not be duplicated between many components.

Display useful validation messages near the relevant field.

Do not rely solely on disabled submit buttons to explain invalid input.

---

# 28. Naming

Use names that describe intent.

Prefer:

```text
PlaceCard
ItineraryTimeline
PlaceFilterBar
generateItinerary
formatTravelTime
```

Avoid:

```text
Card2
NewComponent
DataHandler
Stuff
Utils2
```

Boolean variables should read naturally:

```ts
isLoading
isOpen
hasWifi
canReturnOnTime
```

---

# 29. Comments

Do not comment obvious code.

Bad:

```ts
// Set loading to true
setLoading(true);
```

Comment:

- non-obvious decisions
- unusual browser behavior
- important constraints
- technical tradeoffs
- workarounds

Explain **why**, not what the code literally does.

---

# 30. No Dead Code

When refactoring:

- remove unused imports
- remove obsolete components
- remove abandoned helpers
- remove commented-out old implementations
- remove unused styles
- remove unused dependencies

Do not leave:

```tsx
// old version
// const ...
```

Git already preserves history.

---

# 31. Do Not Duplicate Backend Logic

The frontend should not independently reproduce critical backend rules.

Examples that should primarily belong to the backend:

```text
itinerary feasibility
recommendation scoring
budget eligibility
route optimization
permission decisions
authoritative place filtering
```

The frontend may perform lightweight validation for UX, but the backend remains authoritative.

---

# 32. NOOK-Specific Reusable Components

Before creating new components for NOOK, consider whether the need belongs to one of these reusable concepts:

```text
PlaceCard
PlaceList
PlaceImage
PlaceBadge
AmenityList
PriceRange
TravelTime
DistanceLabel
RatingDisplay

FilterBar
FilterChip
CategoryFilter
BudgetFilter

ItineraryCard
ItineraryTimeline
ItineraryStop
ItinerarySummary

SearchInput
EmptyState
ErrorState
LoadingState
PageHeader

Map
MapMarker
MapControls
```

Do not create duplicates of these components inside individual routes unless the design genuinely requires different behavior.

---

# 33. API Boundary

The frontend must not access Neon directly.

Architecture:

```text
Next.js frontend
      ↓
NestJS API
      ↓
Prisma
      ↓
Neon PostgreSQL
```

The frontend should only communicate with the backend API.

This keeps:

- credentials secure
- business logic centralized
- database access controlled
- frontend/backend responsibilities clear

---

# 34. Environment Variables

Never hardcode:

```text
backend URLs
API keys
Mapbox tokens
environment-specific values
```

Use environment variables.

Only expose browser-safe variables with the appropriate public prefix.

Never expose server secrets to client components.

---

# 35. Refactoring Rule for Coding Agents

When asked to modify an existing feature:

1. inspect the surrounding architecture first
2. identify existing reusable components
3. reuse existing patterns
4. avoid introducing parallel implementations
5. keep the requested scope focused
6. remove code made obsolete by the change
7. preserve existing behavior unless explicitly asked to change it
8. do not perform unrelated rewrites

A change should make the codebase **simpler or equally simple**, not leave behind another layer of duplication.

---

# 36. Before Creating a New Component

Ask:

```text
Does this already exist?

Can an existing component accept a prop?

Is this feature-specific or globally reusable?

Will this component have one clear responsibility?

Am I creating this because it is actually reusable,
or merely because I want another file?
```

Proceed only after answering those questions.

---

# 37. Before Creating a New Dependency

Ask:

```text
Do we already have a dependency that does this?

Can this be implemented cleanly in a few lines?

Will this increase the client bundle?

Is the dependency actively maintained?

Does it provide enough value to justify itself?
```

---

# 38. Before Finishing Any Frontend Task

Verify:

- [ ] No obvious duplicated component was introduced
- [ ] No unnecessary dependency was added
- [ ] No `any` types were introduced without justification
- [ ] No API URL or secret was hardcoded
- [ ] Mobile layout still works
- [ ] Narrow desktop layout still works
- [ ] Long content does not break the layout
- [ ] Loading state exists where needed
- [ ] Empty state exists where needed
- [ ] Error state exists where needed
- [ ] Existing shared UI components were reused
- [ ] Feature-specific code remains inside the feature
- [ ] Business logic is not buried in presentation components
- [ ] Dead code and unused imports are removed
- [ ] TypeScript passes
- [ ] Linting passes
- [ ] Existing behavior has not accidentally changed

---

# 39. Coding Agent Behavior

When generating code for this project:

**Do not immediately code.**

First:

1. inspect relevant files
2. identify existing conventions
3. identify reusable components
4. determine the smallest appropriate change
5. then implement

If the requested implementation would duplicate an existing component, refactor toward reuse instead.

If a reusable component needs a small enhancement to support the requested feature, prefer extending it with a clean API rather than cloning it.

Do not overengineer speculative future requirements.

Build for the current requirement while keeping clear extension points.

---

# 40. Definition of Good Frontend Architecture for NOOK

A successful frontend should make it easy to answer:

**Where does this code belong?**

and difficult to accidentally create:

```text
duplicated UI
duplicated API calls
duplicated types
duplicated business rules
massive page components
unnecessary dependencies
global state for local problems
hardcoded production data
```

The preferred architecture is:

```text
small focused components
        +
feature modules
        +
shared primitives
        +
centralized API access
        +
clear type ownership
        +
backend-owned business logic
```

Keep the system simple enough that a new developer can understand where a feature belongs without reading the entire application.
