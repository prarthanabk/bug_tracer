let isRecording = false;

// Console logging
const originalConsole = {
  log: console.log,
  error: console.error,
  warn: console.warn
};

function interceptConsole() {
  console.log = function(...args) {
    if (isRecording) {
      chrome.runtime.sendMessage({
        type: 'LOG_DATA',
        category: 'console',
        data: ['log', ...args].join(' ')
      });
    }
    originalConsole.log.apply(console, args);
  };

  console.error = function(...args) {
    if (isRecording) {
      chrome.runtime.sendMessage({
        type: 'LOG_DATA',
        category: 'console',
        data: ['error', ...args].join(' ')
      });
    }
    originalConsole.error.apply(console, args);
  };

  console.warn = function(...args) {
    if (isRecording) {
      chrome.runtime.sendMessage({
        type: 'LOG_DATA',
        category: 'console',
        data: ['warn', ...args].join(' ')
      });
    }
    originalConsole.warn.apply(console, args);
  };
}

// Network monitoring
function interceptNetwork() {
  const originalFetch = window.fetch;
  window.fetch = async function(...args) {
    if (isRecording) {
      const startTime = performance.now();
      try {
        const response = await originalFetch.apply(this, args);
        const endTime = performance.now();
        chrome.runtime.sendMessage({
          type: 'LOG_DATA',
          category: 'network',
          data: `${args[0]} - ${response.status} ${response.statusText} (${Math.round(endTime - startTime)}ms)`
        });
        return response;
      } catch (error: unknown) {
        if (error instanceof Error) {
          chrome.runtime.sendMessage({
            type: 'LOG_DATA',
            category: 'network',
            data: `${args[0]} - Failed: ${error.message}`
          });
        } else {
          chrome.runtime.sendMessage({
            type: 'LOG_DATA',
            category: 'network',
            data: `${args[0]} - Failed: ${String(error)}`
          });
        }
        throw error;
      }
    }
    return originalFetch.apply(this, args);
  };
}

// Performance monitoring
function monitorPerformance() {
  if (!isRecording) return;

  const observer = new PerformanceObserver((list) => {
    const entries = list.getEntries();
    const metrics = {
      fcp: entries.find(e => e.name === 'first-contentful-paint')?.startTime,
      lcp: entries.find(e => e.name === 'largest-contentful-paint')?.startTime,
    //   cls: entries.find(e => e.entryType === 'layout-shift')?.value // Corrected type guard
    };

    chrome.runtime.sendMessage({
      type: 'LOG_DATA',
      category: 'performance',
      data: metrics
    });
  });

  observer.observe({ entryTypes: ['paint', 'layout-shift'] });
}

// Memory monitoring
function monitorMemory() {
  if (!isRecording) return;

  setInterval(async () => {
    const memory = (performance as Performance & { memory: { 
      usedJSHeapSize: number; 
      totalJSHeapSize: number; 
      jsHeapSizeLimit: number; 
    }}).memory;

    if (memory) {
      const memoryData = {
        jsHeapSize: memory.usedJSHeapSize,
        totalJSHeapSize: memory.totalJSHeapSize,
        jsHeapSizeLimit: memory.jsHeapSizeLimit
      };

      chrome.runtime.sendMessage({
        type: 'LOG_DATA',
        category: 'memory',
        data: memoryData
      });
    }
  }, 1000);
}

// Message handling
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'START_RECORDING') {
    isRecording = true;
    interceptConsole();
    interceptNetwork();
    monitorPerformance();
    monitorMemory();
    sendResponse({ status: 'started' });
  }

  if (message.type === 'STOP_RECORDING') {
    isRecording = false;
    // Restore original console methods
    console.log = originalConsole.log;
    console.error = originalConsole.error;
    console.warn = originalConsole.warn;
    sendResponse({ status: 'stopped' });
  }

  return true;
});
