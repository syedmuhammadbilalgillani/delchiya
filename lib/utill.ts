type ClassValue = string | number | boolean | null | undefined | Record<string, any> | ClassValue[];

export function cn(...inputs: ClassValue[]): string {
  const classes: string[] = [];
  
  function processInput(input: ClassValue): void {
    if (!input) return;
    
    if (typeof input === 'string') {
      classes.push(input);
    } else if (typeof input === 'number' || typeof input === 'boolean') {
      classes.push(String(input));
    } else if (Array.isArray(input)) {
      input.forEach(processInput);
    } else if (typeof input === 'object') {
      Object.entries(input).forEach(([key, value]) => {
        if (value) {
          classes.push(key);
        }
      });
    }
  }
  
  inputs.forEach(processInput);
  
  // Custom merge logic for Tailwind classes
  const mergedClasses = mergeTailwindClasses(classes);
  
  return mergedClasses.join(' ');
}

function mergeTailwindClasses(classes: string[]): string[] {
  const classMap = new Map<string, string>();
  
  classes.forEach(className => {
    const trimmed = className.trim();
    if (!trimmed) return;
    
    // Split by spaces to handle multiple classes
    const individualClasses = trimmed.split(/\s+/);
    
    individualClasses.forEach(cls => {
      if (!cls) return;
      
      // Extract the base class (before any variants or modifiers)
      const baseClass = extractBaseClass(cls);
      
      // If we already have this base class, keep the last occurrence
      // This provides basic conflict resolution
      classMap.set(baseClass, cls);
    });
  });
  
  return Array.from(classMap.values());
}

function extractBaseClass(className: string): string {
  // Remove common Tailwind prefixes and modifiers
  // This is a simplified version - you can expand this based on your needs
  const baseClass = className
    .replace(/^(hover:|focus:|active:|disabled:|group-hover:|group-focus:)/, '')
    .replace(/^(sm:|md:|lg:|xl:|2xl:)/, '')
    .replace(/^(dark:)/, '')
    .replace(/^(first:|last:|odd:|even:)/, '')
    .replace(/^(before:|after:)/, '');
  
  return baseClass;
}

// Alternative simpler version if you don't need complex merging
export function simpleCn(...inputs: ClassValue[]): string {
  const classes: string[] = [];
  
  function processInput(input: ClassValue): void {
    if (!input) return;
    
    if (typeof input === 'string') {
      classes.push(input);
    } else if (typeof input === 'number' || typeof input === 'boolean') {
      classes.push(String(input));
    } else if (Array.isArray(input)) {
      input.forEach(processInput);
    } else if (typeof input === 'object') {
      Object.entries(input).forEach(([key, value]) => {
        if (value) {
          classes.push(key);
        }
      });
    }
  }
  
  inputs.forEach(processInput);
  
  return classes.join(' ');
}