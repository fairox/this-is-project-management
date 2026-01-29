import { ChartConfig } from "./types"

const THEMES = { light: "", dark: ".dark" } as const

/**
 * Sanitizes a string to be safe for use in CSS selectors and values.
 * Removes any characters that could be used for CSS injection attacks.
 */
const sanitizeForCSS = (value: string): string => {
  // Only allow alphanumeric, hyphens, and underscores for IDs
  return value.replace(/[^a-zA-Z0-9-_]/g, '');
}

/**
 * Validates that a color value is a legitimate CSS color.
 * Accepts hex colors, hsl, rgb, var() CSS variables, and named colors.
 */
const isValidCSSColor = (color: string): boolean => {
  if (!color || typeof color !== 'string') return false;
  
  // Trim and lowercase for comparison
  const trimmedColor = color.trim();
  
  // Check for valid CSS color formats:
  // - Hex colors: #fff, #ffffff, #ffffffff
  // - HSL: hsl(0, 0%, 0%), hsla(...)
  // - RGB: rgb(0, 0, 0), rgba(...)
  // - CSS variables: var(--color-name)
  // - Named colors (basic check for letters only)
  const validPatterns = [
    /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/, // hex
    /^hsl\([^)]+\)$/i, // hsl
    /^hsla\([^)]+\)$/i, // hsla  
    /^rgb\([^)]+\)$/i, // rgb
    /^rgba\([^)]+\)$/i, // rgba
    /^var\(--[a-zA-Z0-9-_]+\)$/, // CSS variables
    /^[a-zA-Z]+$/, // named colors (basic)
  ];
  
  // Check against known attack vectors - block anything with:
  // - Script tags
  // - Closing style tags
  // - Expression()
  // - url() with data: or javascript:
  const dangerousPatterns = [
    /<\/?script/i,
    /<\/?style/i,
    /expression\s*\(/i,
    /url\s*\(\s*["']?\s*(javascript|data):/i,
    /;\s*}/,  // Attempt to break out of CSS block
    /}\s*</,  // Attempt to close style and open HTML
  ];
  
  // Reject dangerous patterns
  for (const pattern of dangerousPatterns) {
    if (pattern.test(trimmedColor)) {
      console.warn('[ChartStyle] Blocked potentially dangerous color value:', trimmedColor);
      return false;
    }
  }
  
  // Accept if matches valid patterns
  return validPatterns.some(pattern => pattern.test(trimmedColor));
}

export function ChartStyle({ id, config }: { id: string; config: ChartConfig }) {
  // Sanitize the ID to prevent selector injection
  const sanitizedId = sanitizeForCSS(id);
  
  if (!sanitizedId) {
    console.warn('[ChartStyle] Invalid chart ID provided');
    return null;
  }
  
  const colorConfig = Object.entries(config).filter(
    ([_, config]) => config.theme || config.color
  )

  if (!colorConfig.length) {
    return null
  }

  // Build CSS with validated values only
  const cssContent = Object.entries(THEMES)
    .map(([theme, prefix]) => {
      const colorVars = colorConfig
        .map(([key, itemConfig]) => {
          // Sanitize the key for use in CSS variable name
          const sanitizedKey = sanitizeForCSS(key);
          if (!sanitizedKey) return null;
          
          const color =
            itemConfig.theme?.[theme as keyof typeof itemConfig.theme] ||
            itemConfig.color
          
          // Only include if color is valid
          if (color && isValidCSSColor(color)) {
            return `  --color-${sanitizedKey}: ${color};`;
          }
          return null;
        })
        .filter(Boolean)
        .join("\n");
      
      if (!colorVars) return null;
      
      return `${prefix} [data-chart=${sanitizedId}] {\n${colorVars}\n}`;
    })
    .filter(Boolean)
    .join("\n");

  if (!cssContent) {
    return null;
  }

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: cssContent,
      }}
    />
  )
}
