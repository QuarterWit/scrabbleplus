// src/hooks/useSlideDirection.ts
import { useLocation, useNavigationType } from "react-router-dom";
import { useRef } from "react";

export function useSlideDirection() {
  const navType = useNavigationType(); // 'PUSH' | 'POP' | 'REPLACE'
  const lastAction = useRef<'forward' | 'back'>('forward');

  // Heuristic: POP = back, PUSH = forward
  if (navType === 'POP') lastAction.current = 'back';
  if (navType === 'PUSH') lastAction.current = 'forward';

  return lastAction.current;
}
