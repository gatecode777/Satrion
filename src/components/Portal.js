"use client";

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

/**
 * Renders children into document.body using a React Portal.
 * This escapes any parent CSS stacking context (caused by backdrop-filter,
 * transform, opacity, etc.) so fixed/absolute overlays always sit on top.
 */
export default function Portal({ children }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted) return null;
  return createPortal(children, document.body);
}
