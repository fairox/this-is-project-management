/**
 * ============================================================================
 * LOCAL STORAGE UTILITIES - DEMO/MOCK DATA ONLY
 * ============================================================================
 * 
 * ⚠️  SECURITY WARNING: This module is ONLY for demonstration and mock data.
 * 
 * DO NOT use these functions for:
 * - Real user data
 * - Sensitive information
 * - Production data that requires persistence
 * - Any data that should be protected by authentication or authorization
 * 
 * For production data, ALWAYS use Supabase with proper:
 * - Row Level Security (RLS) policies
 * - Authentication
 * - Server-side validation
 * 
 * localStorage limitations:
 * - No encryption
 * - Accessible via XSS attacks
 * - No access control
 * - Persists indefinitely
 * - Client-side only (no backup)
 * - No audit trail
 * 
 * ============================================================================
 */

import { Project, Inspection, Document } from '@/types';
import { mockProjects, mockInspections, mockDocuments } from '@/data/mockData';

// Prefix for all demo data keys to clearly identify them
const DEMO_PREFIX = 'demo_';

/**
 * Initialize localStorage with mock data if empty.
 * This data is for UI demonstration purposes only.
 */
const initializeStorage = () => {
  if (!localStorage.getItem(`${DEMO_PREFIX}projects`)) {
    localStorage.setItem(`${DEMO_PREFIX}projects`, JSON.stringify(mockProjects));
  }
  if (!localStorage.getItem(`${DEMO_PREFIX}inspections`)) {
    localStorage.setItem(`${DEMO_PREFIX}inspections`, JSON.stringify(mockInspections));
  }
  if (!localStorage.getItem(`${DEMO_PREFIX}documents`)) {
    localStorage.setItem(`${DEMO_PREFIX}documents`, JSON.stringify(mockDocuments));
  }
};

/**
 * Get items from localStorage.
 * @deprecated For production, use Supabase queries instead.
 */
export const getItems = <T,>(key: string): T[] => {
  const prefixedKey = key.startsWith(DEMO_PREFIX) ? key : `${DEMO_PREFIX}${key}`;
  const items = localStorage.getItem(prefixedKey);
  return items ? JSON.parse(items) : [];
};

/**
 * Set items in localStorage.
 * @deprecated For production, use Supabase mutations instead.
 */
export const setItems = <T,>(key: string, items: T[]) => {
  const prefixedKey = key.startsWith(DEMO_PREFIX) ? key : `${DEMO_PREFIX}${key}`;
  localStorage.setItem(prefixedKey, JSON.stringify(items));
};

/**
 * Add a single item to localStorage.
 * @deprecated For production, use Supabase insert instead.
 */
export const addItem = <T extends { id: string }>(key: string, item: T) => {
  const items = getItems<T>(key);
  items.push(item);
  setItems(key, items);
};

/**
 * Update an item in localStorage.
 * @deprecated For production, use Supabase update instead.
 */
export const updateItem = <T extends { id: string }>(key: string, item: T) => {
  const items = getItems<T>(key);
  const index = items.findIndex((i) => i.id === item.id);
  if (index !== -1) {
    items[index] = item;
    setItems(key, items);
  }
};

/**
 * Delete an item from localStorage.
 * @deprecated For production, use Supabase delete instead.
 */
export const deleteItem = <T extends { id: string }>(key: string, id: string) => {
  const items = getItems<T>(key);
  const filtered = items.filter((item) => item.id !== id);
  setItems(key, filtered);
};

/**
 * Clear all demo data from localStorage.
 * Useful for resetting the demo state.
 */
export const clearDemoData = () => {
  const keysToRemove: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith(DEMO_PREFIX)) {
      keysToRemove.push(key);
    }
  }
  keysToRemove.forEach(key => localStorage.removeItem(key));
};

// Initialize storage with mock data on module load
initializeStorage();
