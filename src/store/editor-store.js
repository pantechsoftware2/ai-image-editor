import { create } from 'zustand';
import { TEMPLATES } from '@/lib/templates';

/**
 * Editor store using Zustand
 * Manages canvas state, selected variant, templates
 */
export const useEditorStore = create((set) => ({
  // State
  selectedVariant: null,
  canvasState: null,
  template: TEMPLATES[0],
  isDirty: false,

  // Actions
  /**
   * Set selected variant
   * @param {Object} variant
   */
  setSelectedVariant: (variant) =>
    set({
      selectedVariant: variant,
      isDirty: true,
    }),

  /**
   * Set canvas state
   * @param {Object} state
   */
  setCanvasState: (state) =>
    set({
      canvasState: state,
      isDirty: true,
    }),

  /**
   * Set template
   * @param {Object} template
   */
  setTemplate: (template) =>
    set({
      template,
      isDirty: true,
    }),

  /**
   * Reset editor
   */
  resetEditor: () =>
    set({
      selectedVariant: null,
      canvasState: null,
      template: TEMPLATES[0],
      isDirty: false,
    }),

  /**
   * Mark as saved
   */
  markAsSaved: () =>
    set({
      isDirty: false,
    }),
}));
