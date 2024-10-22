
    // src/background/background.ts
  let recording = false;
  let recordedData = {
    console: [] as string[],
    network: [] as string[],
    performance: {},
    memory: {}
  };
  
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'START_RECORDING') {
      recording = true;
      recordedData = {
        console: [],
        network: [],
        performance: {},
        memory: {}
      };
      chrome.debugger.attach({ tabId: sender.tab?.id }, '1.3');
      sendResponse({ status: 'started' });
    }
    
    if (message.type === 'STOP_RECORDING') {
      recording = false;
      chrome.debugger.detach({ tabId: sender.tab?.id });
      sendResponse({ data: recordedData });
    }
  
    if (message.type === 'LOG_DATA' && recording) {
      switch (message.category) {
        case 'console':
          recordedData.console.push(message.data);
          break;
        case 'network':
          recordedData.network.push(message.data);
          break;
        case 'performance':
          recordedData.performance = { ...recordedData.performance, ...message.data };
          break;
        case 'memory':
          recordedData.memory = { ...recordedData.memory, ...message.data };
          break;
      }
    }
  
    return true;
  });