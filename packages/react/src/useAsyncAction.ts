import { useCallback, useEffect, useRef, useState } from 'react';
import type { AsyncVisualState } from './StatusIcon';

export interface AsyncActionController {
  state: AsyncVisualState;
  run: () => void;
  cancel: () => void;
  reset: () => void;
}

export function useAsyncAction(action: (signal: AbortSignal) => Promise<void>): AsyncActionController {
  const [state, setState] = useState<AsyncVisualState>('idle');
  const controllerRef = useRef<AbortController | null>(null);
  const requestRef = useRef(0);
  const mountedRef = useRef(false);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      requestRef.current += 1;
      controllerRef.current?.abort();
      controllerRef.current = null;
    };
  }, []);

  const cancel = useCallback(() => {
    if (!controllerRef.current) return;
    requestRef.current += 1;
    controllerRef.current.abort();
    controllerRef.current = null;
    if (mountedRef.current) setState('idle');
  }, []);

  const reset = useCallback(() => {
    cancel();
    if (mountedRef.current) setState('idle');
  }, [cancel]);

  const run = useCallback(() => {
    if (controllerRef.current) return;

    const controller = new AbortController();
    const request = requestRef.current + 1;
    requestRef.current = request;
    controllerRef.current = controller;
    setState('pending');

    const settle = (nextState: Extract<AsyncVisualState, 'success' | 'error'>) => {
      if (!mountedRef.current || requestRef.current !== request || controller.signal.aborted) return;
      controllerRef.current = null;
      setState(nextState);
    };

    try {
      void action(controller.signal).then(
        () => settle('success'),
        () => settle('error'),
      );
    } catch {
      settle('error');
    }
  }, [action]);

  return { state, run, cancel, reset };
}
