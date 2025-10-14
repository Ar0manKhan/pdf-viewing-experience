# Style Guide

This document outlines the visual design standards for this application. The goal is to ensure a consistent, accessible, and user-friendly experience across the entire site. All new and existing UI components should adhere to these guidelines.

## Philosophy

Our design philosophy is centered around:

-   **Consistency**: Elements should look and behave predictably throughout the application.
-   **Clarity**: The interface should be clean, intuitive, and easy to understand.
-   **Accessibility**: The application must be usable by everyone, regardless of their abilities.
-   **Responsiveness**: The layout and components should adapt gracefully to all screen sizes.

## Color Palette

We use a simple and clean black-and-white color scheme, which is defined using CSS variables in `src/index.css`. This approach allows for easy theming (e.g., light and dark modes).

### Core Colors

| Variable                 | Light Mode (OKLCH)       | Dark Mode (OKLCH)          | Description                                  |
| :----------------------- | :----------------------- | :------------------------- | :------------------------------------------- |
| `--background`           | `oklch(1 0 0)` (White)   | `oklch(0.145 0 0)` (Near Black) | Main page background.                        |
| `--foreground`           | `oklch(0.145 0 0)` (Near Black) | `oklch(0.985 0 0)` (Near White) | Main text color.                             |
| `--primary`              | `oklch(0.205 0 0)` (Near Black) | `oklch(0.922 0 0)` (Near White) | Primary interactive elements (e.g., buttons). |
| `--primary-foreground`   | `oklch(0.985 0 0)` (Near White) | `oklch(0.205 0 0)` (Near Black) | Text on primary elements.                    |
| `--secondary`            | `oklch(0.97 0 0)` (Light Gray) | `oklch(0.269 0 0)` (Dark Gray)  | Secondary elements.                          |
| `--secondary-foreground` | `oklch(0.205 0 0)` (Near Black) | `oklch(0.985 0 0)` (Near White) | Text on secondary elements.                  |
| `--border`               | `oklch(0.922 0 0)` (Light Gray) | `oklch(1 0 0 / 10%)` (Transparent White) | Borders for elements like cards and inputs.    |

### Component-Specific Colors

| Variable                     | Description                                    |
| :--------------------------- | :--------------------------------------------- |
| `--card` / `--card-foreground` | Background and text for card components.       |
| `--popover` / `--popover-foreground` | Background and text for popovers.            |
| `--muted` / `--muted-foreground` | Muted elements and text.                       |
| `--accent` / `--accent-foreground` | Accent colors for highlighting.                |
| `--destructive`              | Color for destructive actions (e.g., delete).  |
| `--input`                    | Background for form inputs.                    |
| `--ring`                     | Color for focus rings.                         |

## Typography

A consistent typographic scale is used to create a clear visual hierarchy.

| Element   | Font Size         | Font Weight | Notes               |
| :-------- | :---------------- | :---------- | :------------------ |
| `h1`      | `2.25rem` (36px)  | `700` (Bold)  | Page titles.        |
| `h2`      | `1.875rem` (30px) | `700` (Bold)  | Section titles.     |
| `h3`      | `1.5rem` (24px)   | `700` (Bold)  | Sub-section titles. |
| `h4`      | `1.25rem` (20px)  | `700` (Bold)  | Minor headings.     |
| Body (p)  | `1rem` (16px)     | `400` (Regular) | Default paragraph text. |
| Small     | `0.875rem` (14px) | `400` (Regular) | Helper text, captions. |

*Font Family*: The default system font stack is used for optimal performance and a native feel across all operating systems.

## Spacing

We use a spacing scale based on `rem` units for consistent padding, margins, and gaps between elements. While we don't enforce a strict numerical scale in the CSS, we use Tailwind's spacing utilities, which are based on a `0.25rem` (4px) increment.

**General Rule**: Use spacing to create a clear visual hierarchy and group related elements. Avoid random spacing values.

## Border Radius

Border radius is used to soften corners and create a modern, friendly aesthetic.

| Variable      | Value             | Usage                           |
| :------------ | :---------------- | :------------------------------ |
| `--radius` | `0.625rem` (10px) | Base radius. |
| `--radius-sm`   | `calc(var(--radius) - 4px)` (6px) | Small elements. |
| `--radius-md`   | `calc(var(--radius) - 2px)` (8px) | Default for buttons, inputs. |
| `--radius-lg`   | `var(--radius)` (10px) | Cards, dialogs. |
| `--radius-xl`   | `calc(var(--radius) + 4px)` (14px) | Larger containers. |

These values are derived from the `--radius` variable (`0.625rem`) defined in `src/index.css`.

## Component Styles

### Buttons

-   **Primary**: Solid background (`--primary`) with light text (`--primary-foreground`). Used for the main call-to-action on a page.
-   **Secondary**: Lighter background (`--secondary`) with dark text (`--secondary-foreground`). Used for secondary actions.
-   **Destructive**: Red background (`--destructive`) for actions that delete data.
-   **States**: All buttons must have clear `hover`, `focus`, and `disabled` states. Focus states should use the `--ring` color for a visible outline.

### Cards

-   **Background**: Use `--card` for the background color.
-   **Border**: Use `--border` for the border color.
-   **Padding**: Use consistent internal padding.
-   **Shadow**: A subtle box-shadow can be used to create depth.

### Forms

-   **Inputs**: Should have a background of `--input` and a border of `--border`.
-   **Labels**: Should be clearly associated with their inputs.
-   **Focus**: Inputs must have a visible focus ring (`--ring`).

## Accessibility

-   **Color Contrast**: Ensure that all text has sufficient contrast against its background.
-   **Keyboard Navigation**: All interactive elements must be reachable and operable via the keyboard.
-   **Focus Indicators**: Focus states must be clearly visible.
-   **Semantic HTML**: Use appropriate HTML tags (`<nav>`, `<main>`, `<button>`, etc.) to convey the structure of the page.