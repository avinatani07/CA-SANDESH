# Design Document: CA Firm Website

## Overview

This design document outlines the technical architecture and implementation approach for a professional Chartered Accountants firm website. The website will be built as a modern, responsive single-page application (SPA) using React with Vite, Tailwind CSS, and Framer Motion for animations. The design emphasizes clean, professional aesthetics appropriate for financial services, with a focus on usability, accessibility, and performance.

The website will feature a single-page layout with smooth scrolling navigation between sections: Hero, About, Services, and Contact. The design will be fully responsive, adapting seamlessly to mobile, tablet, and desktop viewports.

## Architecture

### Technology Stack

- **React 18**: Modern component-based UI library with hooks
- **Vite**: Fast build tool and development server
- **Tailwind CSS**: Utility-first CSS framework for rapid styling
- **Framer Motion**: Production-ready animation library for React
- **React Hook Form**: Performant form validation library
- **React Scroll**: Smooth scrolling navigation library
- **Lucide React**: Modern icon library with beautiful SVG icons
- **TypeScript**: Type safety and better developer experience (optional but recommended)

### File Structure

```
ca-firm-website/
├── public/
│   └── assets/          # Static assets (images, fonts)
├── src/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── Hero.jsx
│   │   ├── About.jsx
│   │   ├── Services.jsx
│   │   ├── ServiceCard.jsx
│   │   ├── Contact.jsx
│   │   ├── ContactForm.jsx
│   │   └── Footer.jsx
│   ├── hooks/
│   │   └── useScrollSpy.js
│   ├── data/
│   │   └── services.js
│   ├── utils/
│   │   └── validation.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

### Design System (Tailwind Configuration)

**Color Palette (Tailwind Custom Colors):**
```javascript
colors: {
  primary: {
    50: '#e6f0ff',
    100: '#b3d1ff',
    500: '#1a365d',  // Main primary
    600: '#152a4a',
    700: '#0f1f37',
  },
  accent: {
    400: '#f6ad55',
    500: '#d69e2e',  // Main accent (gold)
    600: '#b7791f',
  },
  neutral: {
    50: '#f7fafc',
    100: '#edf2f7',
    700: '#2d3748',
    900: '#1a202c',
  }
}
```

**Typography (Tailwind + Google Fonts):**
- Headings: 'Poppins', sans-serif (Professional, modern)
- Body: 'Inter', sans-serif (Highly readable)
- Tailwind's responsive font scale

**Spacing:**
- Tailwind's default spacing scale (4px base unit)
- Custom spacing: 18, 22, 88 for specific design needs

## Components and Interfaces

### 1. Navbar Component

**Props:**
```javascript
// No props needed - self-contained
```

**Structure:**
- Fixed position at top of viewport
- Logo/firm name on left
- Navigation links on right (desktop)
- Mobile hamburger menu with slide-in drawer
- Smooth scroll to sections using react-scroll

**State:**
- `isOpen`: boolean for mobile menu state
- `activeSection`: string for current active section

**Behavior:**
- Smooth scroll to sections on link click
- Active section highlighting using scroll spy
- Background blur and shadow on scroll
- Mobile menu animation with Framer Motion
- Responsive: hamburger menu below lg breakpoint

**Implementation:**
```jsx
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  // Scroll listener for navbar background
  // Mobile menu toggle
  // Active section detection
  
  return (
    <nav className="fixed w-full z-50 transition-all">
      {/* Desktop nav */}
      {/* Mobile menu */}
    </nav>
  );
};
```

### 2. Hero Component

**Props:**
```javascript
// No props needed - static content
```

**Structure:**
- Full viewport height (min-h-screen)
- Centered content with firm name and tagline
- Animated CTA button
- Gradient background with subtle animation
- Scroll indicator at bottom

**Animations (Framer Motion):**
- Fade in and slide up on mount
- Staggered animation for heading, tagline, and button
- Hover effect on CTA button

**Implementation:**
```jsx
const Hero = () => {
  return (
    <section id="home" className="min-h-screen flex items-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Content */}
      </motion.div>
    </section>
  );
};
```

### 3. About Component

**Props:**
```javascript
// No props needed - static content
```

**Structure:**
- Two-column layout (lg:grid-cols-2)
- Text content on left
- Professional image or illustration on right
- Responsive: stacks on mobile

**Animations:**
- Fade in when scrolled into view
- Slide in from sides (text from left, image from right)

**Implementation:**
```jsx
const About = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  
  return (
    <section id="about" ref={ref} className="py-20">
      {/* Content with conditional animation */}
    </section>
  );
};
```

### 4. Services Component

**Props:**
```javascript
// No props needed - uses imported services data
```

**Structure:**
- Grid layout: grid-cols-1 md:grid-cols-2 lg:grid-cols-3
- Maps over services array to render ServiceCard components
- Section heading and description

**Data:**
```javascript
const services = [
  {
    id: 1,
    icon: 'Calculator',
    title: 'Tax Planning & Advisory',
    description: 'Strategic tax planning...'
  },
  // ... more services
];
```

**Implementation:**
```jsx
const Services = () => {
  return (
    <section id="services" className="py-20 bg-neutral-50">
      <div className="container mx-auto">
        <h2>Our Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <ServiceCard key={service.id} {...service} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};
```

### 5. ServiceCard Component

**Props:**
```javascript
{
  icon: string,        // Lucide icon name
  title: string,
  description: string,
  index: number        // For staggered animation
}
```

**Structure:**
- Card with padding, rounded corners, shadow
- Icon at top (from Lucide React)
- Title (h3)
- Description (p)
- Hover effect: lift and shadow increase

**Animations:**
- Fade in and slide up when scrolled into view
- Staggered delay based on index
- Hover: scale and shadow transition

**Implementation:**
```jsx
const ServiceCard = ({ icon, title, description, index }) => {
  const Icon = icons[icon]; // Dynamic icon import
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="bg-white p-6 rounded-lg shadow-md"
    >
      <Icon className="w-12 h-12 text-primary-500 mb-4" />
      <h3>{title}</h3>
      <p>{description}</p>
    </motion.div>
  );
};
```

### 6. Contact Component

**Props:**
```javascript
// No props needed - contains ContactForm
```

**Structure:**
- Two-column layout (lg:grid-cols-2)
- Left: Contact information (email, phone, address, hours)
- Right: ContactForm component
- Responsive: stacks on mobile

**Contact Info Display:**
- Icons from Lucide React
- Formatted contact details
- Map or location illustration (optional)

### 7. ContactForm Component

**Props:**
```javascript
// No props needed - self-contained
```

**Form Fields:**
- Name (text, required)
- Email (email, required)
- Message (textarea, required)

**Validation (React Hook Form):**
- Required field validation
- Email format validation
- Real-time error display
- Success/error message after submission

**State:**
- Form managed by React Hook Form
- `isSubmitting`: boolean
- `submitStatus`: 'idle' | 'success' | 'error'

**Implementation:**
```jsx
const ContactForm = () => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [submitStatus, setSubmitStatus] = useState('idle');
  
  const onSubmit = async (data) => {
    // Handle form submission
    // Show success message
    // Reset form
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Form fields with validation */}
    </form>
  );
};
```

### 8. Footer Component

**Props:**
```javascript
// No props needed - static content
```

**Structure:**
- Three-column layout (md:grid-cols-3)
- Column 1: Firm info and copyright
- Column 2: Quick links to sections
- Column 3: Social/professional links
- Responsive: stacks on mobile

**Links:**
- Use react-scroll for section navigation
- External links for social media (LinkedIn, etc.)

## Data Models

### Service Data Model

```javascript
{
  id: number,
  icon: string,        // Lucide icon name
  title: string,
  description: string
}
```

### Form Data Model

```javascript
{
  name: string,
  email: string,
  message: string
}
```

### Navigation Item Model

```javascript
{
  id: string,
  label: string,
  to: string,          // Section ID for react-scroll
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*


### Property 1: Navigation scroll behavior

*For any* navigation link, when clicked, the viewport should scroll to the corresponding section and that section should become visible.

**Validates: Requirements 1.2**

### Property 2: Active section highlighting

*For any* section currently in the viewport, the corresponding navigation item should have an active state indicator.

**Validates: Requirements 1.5**

### Property 3: Responsive layout consistency

*For any* section of the website and any viewport width, the content should remain readable, properly formatted, and not overflow its container.

**Validates: Requirements 2.5, 3.4, 6.4**

### Property 4: Service card structure

*For any* service card rendered, it should contain a service name, description, and icon, with consistent styling applied across all cards.

**Validates: Requirements 4.2, 4.3**

### Property 5: Responsive grid adaptation

*For any* viewport width, the services grid should display the appropriate number of columns (1 for mobile, 2 for tablet, 3 for desktop).

**Validates: Requirements 4.4, 4.5**

### Property 6: Form validation with valid data

*For any* form submission with valid data (non-empty name, valid email format, non-empty message), the form should display a success message.

**Validates: Requirements 5.3**

### Property 7: Form validation with invalid data

*For any* form submission with invalid data (empty required fields or invalid email format), the form should display appropriate validation errors and prevent submission.

**Validates: Requirements 5.4**

### Property 8: Email format validation

*For any* string input to the email field, the validator should correctly identify whether it matches valid email format (contains @ symbol, has domain, etc.).

**Validates: Requirements 5.5**

### Property 9: Required field validation

*For any* required form field, if the value is empty or only whitespace, the validation should fail and display an error.

**Validates: Requirements 5.6**

### Property 10: Touch target accessibility

*For any* interactive element (buttons, links, form inputs), the touch target size should be at least 44x44 pixels to ensure usability on touch devices.

**Validates: Requirements 6.5**

### Property 11: Footer positioning

*For any* page content height, the footer should remain at the bottom of the viewport or below all content, whichever is lower.

**Validates: Requirements 7.4**

### Property 12: Consistent spacing

*For any* two elements of the same type (e.g., section headings, card margins), they should use consistent spacing values from the design system.

**Validates: Requirements 8.3**

### Property 13: Color contrast accessibility

*For any* text and background color combination used in the website, the contrast ratio should meet WCAG AA standards (minimum 4.5:1 for normal text, 3:1 for large text).

**Validates: Requirements 8.5**

### Property 14: Image optimization

*For any* image used in the website, it should be optimized for web (appropriate format, compressed, responsive sizes) to ensure fast loading.

**Validates: Requirements 9.2**

### Property 15: Graceful feature degradation

*For any* modern CSS or JavaScript feature used, there should be a fallback or the site should remain functional when the feature is unsupported.

**Validates: Requirements 10.3**

## Error Handling

### Form Validation Errors

**Client-Side Validation:**
- Empty required fields: Display "This field is required" message
- Invalid email format: Display "Please enter a valid email address"
- Form submission errors: Display general error message and maintain form data

**Error Display Strategy:**
- Inline errors below each field
- Red border on invalid fields
- Error messages in red text
- Clear all errors when user starts correcting input

### Navigation Errors

**Scroll Target Not Found:**
- If a navigation target section doesn't exist, scroll to top
- Log warning to console for debugging

### Responsive Layout Errors

**Viewport Detection:**
- Use feature detection for viewport units
- Fallback to fixed pixel values if viewport units unsupported

### Browser Compatibility

**Feature Detection:**
- Check for CSS Grid support, fallback to Flexbox
- Check for smooth scroll support, fallback to instant scroll
- Use progressive enhancement approach

## Testing Strategy

### Unit Testing

Unit tests will focus on specific examples, edge cases, and integration points:

**JavaScript Functions:**
- Email validation with specific valid/invalid examples
- Form validation with edge cases (whitespace-only input, special characters)
- Scroll position calculation
- Mobile menu toggle state

**Example Test Cases:**
- Valid email: "user@example.com" → passes validation
- Invalid email: "userexample.com" → fails validation
- Empty required field: "" → fails validation
- Whitespace-only field: "   " → fails validation
- Navigation to existing section → scrolls correctly
- Navigation to non-existent section → handles gracefully

### Property-Based Testing

Property tests will verify universal properties across all inputs using fast-check for JavaScript:

**Configuration:**
- Minimum 100 iterations per property test
- Each test tagged with feature name and property number
- Test runner: Vitest
- Component testing: React Testing Library
- Property testing library: fast-check

**Property Test Implementation:**

1. **Navigation Scroll (Property 1)**
   - Generate: Random section IDs from available sections
   - Test: Clicking navigation scrolls to correct position
   - Tag: **Feature: ca-firm-website, Property 1: Navigation scroll behavior**

2. **Responsive Layout (Property 3)**
   - Generate: Random viewport widths (320px to 2560px)
   - Test: Content remains readable and properly formatted
   - Tag: **Feature: ca-firm-website, Property 3: Responsive layout consistency**

3. **Service Card Structure (Property 4)**
   - Generate: Random service data objects
   - Test: Rendered card contains all required elements
   - Tag: **Feature: ca-firm-website, Property 4: Service card structure**

4. **Grid Adaptation (Property 5)**
   - Generate: Random viewport widths
   - Test: Grid displays correct column count for breakpoint
   - Tag: **Feature: ca-firm-website, Property 5: Responsive grid adaptation**

5. **Form Valid Data (Property 6)**
   - Generate: Random valid form data (non-empty strings, valid emails)
   - Test: Form submission shows success message
   - Tag: **Feature: ca-firm-website, Property 6: Form validation with valid data**

6. **Form Invalid Data (Property 7)**
   - Generate: Random invalid form data (empty fields, invalid emails)
   - Test: Form shows validation errors
   - Tag: **Feature: ca-firm-website, Property 7: Form validation with invalid data**

7. **Email Validation (Property 8)**
   - Generate: Random strings (valid and invalid email formats)
   - Test: Validator correctly identifies valid/invalid emails
   - Tag: **Feature: ca-firm-website, Property 8: Email format validation**

8. **Required Field Validation (Property 9)**
   - Generate: Random strings including empty and whitespace-only
   - Test: Validator correctly identifies empty/invalid inputs
   - Tag: **Feature: ca-firm-website, Property 9: Required field validation**

9. **Touch Targets (Property 10)**
   - Generate: Random interactive elements
   - Test: All have minimum 44x44px touch target
   - Tag: **Feature: ca-firm-website, Property 10: Touch target accessibility**

10. **Footer Positioning (Property 11)**
    - Generate: Random content heights
    - Test: Footer remains at bottom
    - Tag: **Feature: ca-firm-website, Property 11: Footer positioning**

11. **Consistent Spacing (Property 12)**
    - Generate: Random pairs of similar elements
    - Test: Spacing values match design system
    - Tag: **Feature: ca-firm-website, Property 12: Consistent spacing**

12. **Color Contrast (Property 13)**
    - Generate: All text/background combinations used
    - Test: Contrast ratios meet WCAG AA standards
    - Tag: **Feature: ca-firm-website, Property 13: Color contrast accessibility**

13. **Image Optimization (Property 14)**
    - Generate: All images in the project
    - Test: Images meet optimization criteria
    - Tag: **Feature: ca-firm-website, Property 14: Image optimization**

14. **Feature Degradation (Property 15)**
    - Generate: Different browser capability profiles
    - Test: Site remains functional with missing features
    - Tag: **Feature: ca-firm-website, Property 15: Graceful feature degradation**

### Integration Testing

- Test complete user flows: Landing → Services → Contact → Form submission
- Test navigation between all sections
- Test responsive behavior across breakpoints
- Test form submission end-to-end

### Browser Testing

- Manual testing in Chrome, Firefox, Safari, and Edge
- Verify visual consistency across browsers
- Test responsive behavior in browser dev tools
- Verify touch interactions on actual mobile devices

### Accessibility Testing

- Keyboard navigation testing
- Screen reader testing (basic verification)
- Color contrast verification with automated tools
- Touch target size verification

## Implementation Notes

### Performance Considerations

- Use React.lazy() for code splitting
- Optimize images with modern formats (WebP)
- Use Vite's built-in optimizations
- Lazy load images below the fold
- Minimize bundle size with tree-shaking
- Use Tailwind's purge for minimal CSS

### Accessibility Considerations

- Semantic HTML5 elements (nav, section, article, footer)
- ARIA labels where needed
- Keyboard navigation support (focus management)
- Focus indicators for interactive elements
- Alt text for all images
- Proper heading hierarchy (h1 → h2 → h3)
- Color contrast meeting WCAG AA standards

### Animation Considerations

- Respect prefers-reduced-motion
- Use GPU-accelerated transforms
- Smooth 60fps animations with Framer Motion
- Subtle, professional animations (no excessive motion)

### SEO Considerations

- React Helmet for meta tags
- Semantic HTML structure
- Meta tags (title, description)
- Open Graph tags for social sharing
- Proper heading hierarchy
- Descriptive link text

### Browser Support

- Modern browsers (last 2 versions)
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Development Workflow

1. Initialize Vite + React project
2. Install and configure Tailwind CSS
3. Install dependencies (Framer Motion, React Hook Form, etc.)
4. Set up project structure
5. Create reusable components
6. Implement sections (Hero, About, Services, Contact)
7. Add navigation and scroll behavior
8. Implement form validation
9. Add animations
10. Test responsiveness
11. Optimize performance
12. Validate accessibility
