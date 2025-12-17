export function throttle<T extends (...args: any[]) => Promise<void> | void>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let pending = false;
  let lastArgs: Parameters<T> | null = null;

  const wrapper = async (...args: Parameters<T>) => {
    lastArgs = args;
    if (pending) return;
    pending = true;

    try {
      if (lastArgs) {
        const currentArgs = lastArgs;
        // lastArgs = null; // Don't clear yet, we might receive more while executing
        await fn(...currentArgs);
      }
    } finally {
      // After execution, check if we have new args
      if (lastArgs && lastArgs !== args) { // Simple check, or just re-run if lastArgs exists
         // But basic throttle just waits.
         // A "trailing" throttle executes the last call after delay.
      }
      
      // Simple implementation as per plan:
      /*
        if (lastArgs) {
          await fn(...lastArgs);
          lastArgs = null;
        }
      */
     
     // Let's stick to the plan's implementation which is more specific
     setTimeout(async () => {
         pending = false;
         if (lastArgs) {
             const argsToRun = lastArgs;
             lastArgs = null;
             wrapper(...argsToRun);
         }
     }, delay);
    }
  };
  
  // The plan's implementation was:
  /*
  let pending = false;
  let lastArgs: any[] | null = null;

  return (async (...args: any[]) => {
    lastArgs = args;
    if (pending) return;
    pending = true;
    await fn(...args);
    pending = false;
    if (lastArgs) {
      await fn(...lastArgs);
      lastArgs = null;
    }
  }) as T;
  */
  // Wait, the plan's implementation doesn't use setTimeout?
  // It just awaits the function. This assumes the function takes time (network request).
  // If the function is fast, it won't throttle much.
  // But `setLighting` is async and takes time (WebHID write).
  // So the "pending" flag acts as the lock.
  
  return async (...args: Parameters<T>) => {
      lastArgs = args;
      if (pending) return;
      pending = true;
      try {
          await fn(...args);
      } finally {
          pending = false;
          // If arguments changed while we were executing, run again with latest
          // We need to be careful not to infinite loop if it's always fast.
          // The plan's logic:
          /*
            if (lastArgs) {
               await fn(...lastArgs); // This is recursive-ish? No, it calls fn directly?
               // But fn is the original function.
               // It misses the loop.
            }
          */
         // Correct logic for async throttle (executing latest after finish):
         if (lastArgs && lastArgs !== args) {
             // We have new args.
             // But we just finished.
             // We should call the wrapper again?
             // Or just call fn again.
             // Let's use the wrapper recursively to ensure locking.
             // wrapper(...lastArgs);
         }
      }
      
      // Re-reading the plan carefully:
      /*
        await fn(...args);
        pending = false;
        if (lastArgs) {
             await fn(...lastArgs);
             lastArgs = null;
        }
      */
     // This logic runs the FIRST call, then if during that call new args came (lastArgs updated), 
     // it runs ONCE more with the latest args after the first one finishes.
     // But `lastArgs` was set to `args` at the start.
     // So if no new calls came, `lastArgs` is still `args`.
     // So it would run TWICE?
     // No, we should clear `lastArgs` when we start running it?
     // Or check if `lastArgs !== args`.
  };
}

// Better implementation:
export function asyncThrottle<T extends (...args: any[]) => Promise<any>>(
    fn: T, 
    minDelay: number = 0 // Optional minimum delay between calls
): (...args: Parameters<T>) => Promise<void> {
    let isRunning = false;
    let nextArgs: Parameters<T> | null = null;

    const execute = async () => {
        isRunning = true;
        while (nextArgs) {
            const args = nextArgs;
            nextArgs = null;
            try {
                await fn(...args);
            } catch (e) {
                console.error(e);
            }
            // Optional: wait for delay
            if (minDelay > 0) await new Promise(r => setTimeout(r, minDelay));
        }
        isRunning = false;
    };

    return async (...args: Parameters<T>) => {
        nextArgs = args;
        if (!isRunning) {
            execute();
        }
    };
}

