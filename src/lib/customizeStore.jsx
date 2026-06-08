import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/api/client';
import { THEME_PAIR } from '@/lib/storeTheme';

const CustomizeContext = createContext(null);

/**
 * Holds a live "draft" of StoreSettings so admins can edit the real storefront
 * with instant preview, then persist. While `draft` is null we render the saved
 * settings; once editing starts, `effective` reflects unsaved changes.
 */
export function CustomizeProvider({ savedSettings, children }) {
  const qc = useQueryClient();
  const [draft, setDraft] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const base = useMemo(() => savedSettings || {}, [savedSettings]);
  const effective = draft || base;

  const open = useCallback(() => {
    setDraft((d) => d || { ...base });
    setIsOpen(true);
  }, [base]);

  const close = useCallback(() => setIsOpen(false), []);

  const setField = useCallback(
    (key, value) => setDraft((d) => ({ ...(d || base), [key]: value })),
    [base],
  );

  const setFields = useCallback(
    (patch) => setDraft((d) => ({ ...(d || base), ...patch })),
    [base],
  );

  const applyPreset = useCallback(
    (presetKey) => {
      setDraft((d) => {
        const next = { ...(d || base), theme_preset: presetKey };
        // Clear per-field HEX overrides so the chosen preset is fully visible.
        for (const [field] of THEME_PAIR) next[field] = '';
        return next;
      });
    },
    [base],
  );

  const resetDraft = useCallback(() => setDraft({ ...base }), [base]);

  const saveMut = useMutation({
    mutationFn: (data) => {
      const payload = { ...data };
      delete payload.id;
      delete payload.created_date;
      delete payload.updated_date;
      delete payload.created_by;
      if (base?.id) return api.entities.StoreSettings.update(base.id, payload);
      return api.entities.StoreSettings.create(payload);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['storeSettings'] }),
  });

  const save = useCallback(async () => {
    if (!draft) return;
    await saveMut.mutateAsync(draft);
  }, [draft, saveMut]);

  const value = useMemo(
    () => ({
      settings: effective,
      isOpen,
      isEditing: !!draft,
      open,
      close,
      setField,
      setFields,
      applyPreset,
      resetDraft,
      save,
      saving: saveMut.isPending,
    }),
    [effective, isOpen, draft, open, close, setField, setFields, applyPreset, resetDraft, save, saveMut.isPending],
  );

  return <CustomizeContext.Provider value={value}>{children}</CustomizeContext.Provider>;
}

export function useCustomize() {
  return useContext(CustomizeContext) || { settings: {}, isOpen: false, isEditing: false };
}
