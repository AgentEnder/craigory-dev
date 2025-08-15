# Presentation Format and Writing Style Guide

This guide documents the format and writing style conventions used for presentations in this repository. It's based on the analysis of existing presentations in `libs/presentations/src/presentation-data/`.

## Directory Structure

Each presentation should be contained in its own directory following this naming convention:
```
libs/presentations/src/presentation-data/[conference-slug]-[year]-[topic-slug]/
```

Examples:
- `devup-2023-benchmarking/`
- `nx-conf-2024-crystal-dotnet/`
- `that-conf-wi-2024-spaghetti/`

### Asset Storage

All presentation assets (images, videos, etc.) should be stored in:
```
libs/presentations/assets/[conference-slug]-[year]/
```

In your slides, reference assets using the `/assets/` prefix:
```html
<img src="/assets/kcdc-2025/diagram.svg"></img>
```

This path will correctly resolve to `libs/presentations/assets/` at runtime.

## Required Files

### 1. index.ts (TypeScript Configuration)

Every presentation must have an `index.ts` file that exports a `Presentation` object with the following properties:

```typescript
import { Presentation } from '../../lib/presentations';

const presentation: Presentation = {
  title: string,           // Full presentation title
  description: string,     // Detailed description (can be multi-paragraph)
  presentedAt: string,     // Conference name
  presentedOn: Date,       // Date object using JS month (0-indexed)
  slug: string,            // URL-friendly identifier
  
  // Optional properties:
  mdUrl?: string,          // Reference to markdown file (typically 'slides')
  scssUrl?: string,        // Reference to styles file (typically 'slides')
  recordingUrl?: string,   // URL to recording if available
  extraLinks?: Array<{     // Additional related links
    url: string,
    title: string
  }>
};

export default presentation;
```

### 2. slides.md (Markdown Slides)

The markdown file uses remark.js format with the following structure:

#### Base Template
```markdown
layout: true
name: base

background-size: contain

<div style="position: absolute; left: 20px; right: auto;" class="remark-slide-number">
    <span style="display: block">[Conference Name]</span>
    
    [Date]
</div>

---

template: base
```

#### Slide Separation
- Use `---` to separate slides
- Use `--` for incremental reveals within a slide
- Use `???` to add speaker notes (these won't be visible in presentation mode)

### 3. slides.scss (Optional Styling)

Basic slide styling typically includes:
```scss
.remark-slide-content {
  background: [gradient or solid color];
  color: [text color];
  
  a {
    color: [link color];
  }
}
```

## Writing Style Conventions

### Title Slides

- **Primary title**: Use `#` with a clear, engaging title
- **Subtitle**: Use `###` for speaker name and additional context
- **Include slide URL**: Always provide the public URL for accessing slides

Example:
```markdown
# Benchmarking like a Scientist:

### Communicating Code's Performance.

### Craigory Coppola

<p>Slides: https://craigory.dev/presentations/view/devup-2023-benchmarking</p>
```

### Introduction Slides

Standard introduction format:
1. Speaker name
2. Previous/current role description
3. Current focus/expertise
4. Company/project affiliation with logos

### Content Organization

1. **Agenda/Overview**: List main topics early in the presentation
2. **Progressive disclosure**: Use `--` to reveal points incrementally
3. **Case studies**: Number them clearly (Case Study #1, #2, etc.)
4. **Practical examples**: Include real code snippets
5. **Summary/Wrap-up**: Provide key takeaways

### Code Examples

- Use triple backticks with language specification
- Keep examples concise and relevant
- Show progression through iterations when demonstrating concepts

```javascript
// Example showing progression
function add(a, b) {
  return a + b;
}
```

### Visual Elements

- **Images**: Center using flexbox when appropriate
```html
<div style="display: flex; justify-content: center;">
<img src="/assets/path/image.png"></img>
</div>
```

- **Logos**: Display in flex containers for multiple logos
```html
<div style="display: flex">
    <img style="max-width: 30%" src="/logo1.svg" alt="Logo 1"></img>
    <img style="max-width: 30%" src="/logo2.svg" alt="Logo 2"></img>
</div>
```

### Speaker Notes

Use `???` to add context for the presenter:
```markdown
???

- Key point to remember
- Additional context not on slide
- Timing notes
```

### Contact Slide

Standard format for the final slide:
```markdown
<div style="display: grid; grid-template-columns: 1fr 1fr">
<div><h2>Questions?</h2></div>
<div>
  <h2>Contact + Links</h2>
  <ul>
    <li>Twitter (x?): @[handle]</li>
    <li>https://www.linkedin.com/in/[profile]/</li>
    <li>https://github.com/[username]</li>
    <li>https://[personal-site]</li>
  </ul>
</div>
</div>
```

## Writing Style Characteristics

### Tone
- **Conversational**: Uses "we", "you", and direct address
- **Educational**: Explains concepts progressively
- **Practical**: Focuses on real-world applications
- **Humble**: Acknowledges limitations and alternatives

### Structure Patterns
1. **Problem → Solution**: Start with the challenge, then present the approach
2. **Simple → Complex**: Begin with basic examples, build to realistic scenarios
3. **Theory → Practice**: Introduce concepts, then show implementation
4. **Storytelling**: Use narrative progression (e.g., "The developer is asked...")

### Language Choices
- **Clear metaphors**: Use relatable comparisons (spaghetti code, s'mores)
- **Rhetorical questions**: Engage audience ("Why Benchmarking?")
- **Lists and bullets**: Break down complex topics
- **Caveats and disclaimers**: Acknowledge edge cases and limitations

### Technical Content
- **Balance depth and accessibility**: Provide enough detail without overwhelming
- **Use concrete examples**: Show actual code, tools, and metrics
- **Include actionable takeaways**: "Always", "Sometimes", "Never" recommendations
- **Reference real tools**: Name specific libraries, frameworks, and products

### Visual Philosophy
- **Minimal text per slide**: Focus on key points
- **Code over description**: Show implementations when possible
- **Progressive reveals**: Build complexity gradually
- **Memorable imagery**: Use relevant, sometimes humorous images

## Best Practices

1. **Keep slides focused**: One main concept per slide
2. **Use consistent formatting**: Follow the template structure
3. **Include practical value**: Ensure attendees can apply learnings
4. **Provide context**: Include date, conference, and speaker information
5. **Make slides self-contained**: Should be understandable without narration
6. **Include references**: Link to tools, documentation, and resources
7. **Test code examples**: Ensure all code snippets are valid
8. **Consider accessibility**: Use sufficient contrast and readable fonts