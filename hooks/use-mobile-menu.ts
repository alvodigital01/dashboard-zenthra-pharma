"use client";

import { useCallback, useState } from "react";

export function useMobileMenu(initialState = false) {
  const [isOpen, setIsOpen] = useState(initialState);

  return {
    isOpen,
    openMenu: useCallback(() => setIsOpen(true), []),
    closeMenu: useCallback(() => setIsOpen(false), []),
    toggleMenu: useCallback(() => setIsOpen((current) => !current), [])
  };
}
