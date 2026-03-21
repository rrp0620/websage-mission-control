# Splitt App - Complete SVG Icon System

## Overview
A comprehensive, modern icon system for the Splitt app built with `react-native-svg`. All icons are stroke-based, scalable, and accept `color` and `size` props.

## File Location
`/sessions/optimistic-practical-faraday/mnt/SplitPay/splitt-app/src/icons/`

## Created Files (37 total)

### Main Export
- **index.js** - Central export file containing:
  - Icon map for dynamic rendering
  - Named exports for all 36 icons
  - Icon component for prop-based rendering

### Tab Bar Icons (5)
1. **HomeIcon.js** - House/home outline
2. **CardIcon.js** - Credit card with chip
3. **RulesIcon.js** - Sliders/controls
4. **ActivityIcon.js** - List with dots
5. **MenuIcon.js** - Hamburger menu

### Feature Icons (15)
6. **WalletIcon.js** - Wallet outline
7. **RewardIcon.js** - Star shape
8. **RobotIcon.js** - Robot face with antenna
9. **ChartIcon.js** - Bar chart (3 bars)
10. **CreditCardIcon.js** - Simple card outline
11. **SplitIcon.js** - Fork/branching symbol
12. **SubscriptionIcon.js** - Circular refresh arrow
13. **GroupIcon.js** - Two people outlines
14. **BellIcon.js** - Notification bell
15. **ChevronRightIcon.js** - Right chevron (>)
16. **CheckIcon.js** - Checkmark
17. **SearchIcon.js** - Magnifying glass
18. **PlusIcon.js** - Plus sign
19. **CloseIcon.js** - X mark
20. **SettingsIcon.js** - Gear with 8 spokes

### Status Icons (16)
21. **FreezeIcon.js** - 6-pointed snowflake
22. **UnfreezeIcon.js** - Sun with rays
23. **ExpandIcon.js** - Chevron down
24. **CollapseIcon.js** - Chevron up
25. **SignOutIcon.js** - Arrow out of bracket
26. **EyeIcon.js** - Open eye
27. **EyeOffIcon.js** - Eye with slash (closed)
28. **FilterIcon.js** - Funnel outline
29. **EditIcon.js** - Pencil outline
30. **RetryIcon.js** - Refresh/retry arrow
31. **TrashIcon.js** - Trash can outline
32. **InfoIcon.js** - Circle with "i"
33. **WarningIcon.js** - Triangle with "!"
34. **LockIcon.js** - Closed padlock
35. **UnlockIcon.js** - Open padlock
36. **AppleIcon.js** - Apple logo simplified

## Design Specifications

- **ViewBox**: 24x24 (standard)
- **Stroke Width**: 1.5px (consistent)
- **Stroke Linecap**: round
- **Stroke Linejoin**: round
- **Fill**: none (stroke only, except Apple icon)
- **SVG Library**: react-native-svg
- **Style**: Minimal, modern, clean

## Component Props

All icons accept these props:
```javascript
{
  size: number,      // Default: 24
  color: string      // Default: '#ffffff' (hex color)
}
```

## Usage Methods

### Method 1: Direct Icon Import
```javascript
import { HomeIcon, CardIcon, WalletIcon } from './icons';

<HomeIcon size={24} color="#000000" />
<CardIcon size={32} color="#1e40af" />
<WalletIcon size={28} color="#10b981" />
```

### Method 2: Icon Component (Dynamic)
```javascript
import { Icon } from './icons';

<Icon name="home" size={24} color="#000000" />
<Icon name="card" size={32} color="#1e40af" />
<Icon name="wallet" size={28} color="#10b981" />
```

### Method 3: Icon Map
```javascript
import icons from './icons';

const iconName = 'home';
const IconComponent = icons[iconName];
<IconComponent size={24} color="#000000" />
```

## Icon Name Map

The icons are registered with these keys in the icon map:
```javascript
{
  // Tab bar
  home, card, rules, activity, menu,
  
  // Feature
  wallet, reward, robot, chart, creditCard, split,
  subscription, group, bell, chevronRight, check, search,
  plus, close, settings,
  
  // Status
  freeze, unfreeze, expand, collapse, signOut, eye, eyeOff,
  filter, edit, retry, trash, info, warning, lock, unlock, apple
}
```

## React Component Structure

Each icon follows this pattern:
```javascript
import React from 'react';
import Svg, { Path } from 'react-native-svg';

export default function IconName({ size = 24, color = '#ffffff' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="..." // SVG path data
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
```

## Features

✅ All 36 icons pre-built and ready to use
✅ Consistent design language
✅ Scalable via `size` prop
✅ Customizable colors via `color` prop
✅ Both named and dynamic imports
✅ Fully documented with examples
✅ Minimal, modern design
✅ Optimized stroke rendering
✅ No external icon libraries needed

## Additional Files

- **ICONS_README.md** - Detailed icon system documentation
- **USAGE_EXAMPLES.js** - 7 practical implementation examples

## Integration Checklist

- [x] All 36 icon components created
- [x] Index file with map and exports
- [x] Icon component for dynamic rendering
- [x] Consistent styling across all icons
- [x] Props for size and color customization
- [x] React component structure
- [x] Comprehensive documentation
- [x] Usage examples provided

## Next Steps

1. Import icons in your screens/components
2. Use in tab bars, buttons, lists, or any UI element
3. Customize colors for your theme
4. Adjust sizes as needed for different contexts

## Customization Tips

**For Theme Support:**
```javascript
import { Icon } from './icons';

const colors = {
  primary: '#1e40af',
  success: '#10b981',
  error: '#ef4444',
  disabled: '#d1d5db'
};

<Icon name="home" size={24} color={colors.primary} />
```

**For Responsive Sizing:**
```javascript
const isMobile = width < 768;
const iconSize = isMobile ? 20 : 24;

<Icon name="menu" size={iconSize} color="#000000" />
```

**For Interactive States:**
```javascript
const [active, setActive] = useState('home');

<Icon
  name="home"
  size={24}
  color={active === 'home' ? colors.primary : colors.disabled}
/>
```
