# WebLLM Monitoring & Performance Tracking

## Overview

The WebLLM service now includes comprehensive monitoring capabilities to track performance, measure token usage, monitor memory consumption, and identify issues.

---

## Quick Start

### Enable Debug Mode

```bash
# Create a .env file
cp .env.example .env

# Edit .env and set:
VITE_WEBLLM_DEBUG=true

# Run the dev server
npm run dev
```

### View Metrics in Browser Console

```javascript
// After using WebLLM enhancements, run in console:
import webllmService from './services/webllmService';

// Print formatted metrics table
webllmService.printMetrics();

// Get raw metrics object
const metrics = webllmService.getMetrics();
console.log(metrics);

// Download metrics as JSON
webllmService.downloadMetrics();
```

---

## Features

### 1. Performance Metrics Tracking

Automatically tracks:
- **Initialization time**: How long the model takes to load
- **Generation time**: Duration of each text generation
- **Token throughput**: Tokens generated per second
- **Cache performance**: Hit/miss rates for model caching

### 2. Debug Mode with Structured Logging

When `VITE_WEBLLM_DEBUG=true`:
- Detailed console logs for all operations
- Progress updates during model loading
- Memory snapshots before/after operations
- Structured JSON log entries

### 3. Token Usage Tracking

Tracks for each generation:
- Total tokens used
- Prompt tokens
- Completion tokens
- Cumulative token usage across session

### 4. Memory Usage Monitoring

Captures memory snapshots at key points:
- Before/after initialization
- Before/after each generation
- Before/after model unload
- On errors

---

## API Reference

### Status Methods

#### `getStatus()`

Returns current service status.

```javascript
const status = webllmService.getStatus();
// {
//   isLoading: false,
//   isReady: true,
//   progress: 100,
//   status: '',
//   model: 'Phi-3.5-mini-instruct-q4f16_1-MLC',
//   debug: true
// }
```

### Metrics Methods

#### `getMetrics()`

Returns comprehensive performance metrics.

```javascript
const metrics = webllmService.getMetrics();
// {
//   initialization: { duration, modelLoaded, fromCache },
//   generations: { total, byType, totalTokens, avgGenerationTimeMs, avgThroughputTokensPerSec },
//   cache: { hits, misses, hitRate },
//   errors: { total, recent },
//   memory: { snapshots, recent }
// }
```

#### `getAllGenerations()`

Returns detailed data for all generations.

```javascript
const generations = webllmService.getAllGenerations();
// Array of generation objects with:
// - timestamp
// - type (enhance_summary, enhance_experience, etc.)
// - duration
// - tokensUsed
// - throughput
// - temperature
// - promptLength
// - responseLength
```

#### `getMemorySnapshots()`

Returns all captured memory snapshots.

```javascript
const snapshots = webllmService.getMemorySnapshots();
// Array of snapshots with:
// - timestamp
// - label
// - usedJSHeapSize
// - totalJSHeapSize
// - jsHeapSizeLimit
```

### Export Methods

#### `exportMetrics()`

Exports all metrics as JSON string.

```javascript
const json = webllmService.exportMetrics();
// Returns stringified JSON with all metrics
```

#### `downloadMetrics(filename?)`

Downloads metrics as JSON file.

```javascript
// Default filename
webllmService.downloadMetrics();

// Custom filename
webllmService.downloadMetrics('my-metrics-2024-12-11.json');
```

#### `printMetrics()`

Prints formatted metrics table to console.

```javascript
webllmService.printMetrics();
// Outputs formatted tables with:
// - Summary statistics
// - Generations by type
// - Initialization details
// - Recent errors (if any)
```

### Utility Methods

#### `resetMetrics()`

Resets all metrics (useful for testing).

```javascript
webllmService.resetMetrics();
// Clears all tracked data
```

---

## Using the WebLLMMonitor Component

A React component is available to visualize metrics in the UI.

### Integration Example

```jsx
import React, { useState } from 'react';
import { Button } from '@mui/material';
import WebLLMMonitor from './components/WebLLMMonitor';

function MyComponent() {
  const [showMonitor, setShowMonitor] = useState(false);

  return (
    <>
      <Button onClick={() => setShowMonitor(true)}>
        View Performance Metrics
      </Button>

      <WebLLMMonitor
        open={showMonitor}
        onClose={() => setShowMonitor(false)}
      />
    </>
  );
}
```

### Features

The monitoring dashboard displays:

1. **Status Overview**
   - Current model loaded
   - Ready/loading state
   - Debug mode indicator

2. **Initialization Metrics**
   - Load duration
   - Model name
   - Cache vs download

3. **Generation Statistics**
   - Total generations
   - Total tokens used
   - Average generation time
   - Average throughput
   - Breakdown by type

4. **Cache Performance**
   - Cache hits/misses
   - Hit rate percentage

5. **Recent Generations Table**
   - Type, duration, tokens, throughput
   - Last 5 generations

6. **Memory Usage**
   - Recent snapshots
   - Heap size tracking

7. **Error Log**
   - Recent errors (if any)

8. **Actions**
   - Print to console
   - Download JSON
   - Refresh metrics

---

## Metrics Breakdown

### Initialization Metrics

```javascript
{
  startTime: 1234567890,      // Performance.now() timestamp
  endTime: 1234567950,
  duration: 60000,            // Milliseconds
  durationSeconds: "60.00",   // Formatted
  modelLoaded: "Phi-3.5-mini-instruct-q4f16_1-MLC",
  fromCache: false            // true if loaded from IndexedDB
}
```

**What to look for:**
- First load: 120-300 seconds (2-5 minutes)
- Cached load: 5-30 seconds
- `fromCache: true` indicates good caching

### Generation Metrics

```javascript
{
  timestamp: 1702345678901,
  type: "enhance_summary",
  duration: 8543.2,                  // ms
  durationSeconds: "8.54",
  tokensUsed: 156,
  promptTokens: 78,
  completionTokens: 78,
  throughput: 18.25,                 // tokens/second
  temperature: 0.6,
  maxTokens: 200,
  promptLength: 234,                 // characters
  responseLength: 187                // characters
}
```

**What to look for:**
- Throughput: 15-30 tokens/sec is good
- Duration: Should be consistent per type
- Token usage: Matches expected ranges

**Expected Generation Times:**

| Type | Tokens | Expected Duration |
|------|--------|-------------------|
| enhance_summary | 100-200 | 5-15 sec |
| enhance_experience | 300-600 | 10-20 sec |
| optimize_skills | 100-200 | 5-10 sec |
| generate_summary | 100-150 | 5-15 sec |
| suggest_skills | 50-100 | 3-8 sec |

### Cache Metrics

```javascript
{
  hits: 5,
  misses: 1,
  hitRate: "83.33%"
}
```

**What to look for:**
- First session: 1 miss (initial download)
- Subsequent sessions: High hit rate (>95%)
- Low hit rate: Cache may be clearing (storage issues)

### Memory Metrics

```javascript
{
  timestamp: 1702345678901,
  label: "after_gen_3",
  usedJSHeapSize: 2147483648,     // bytes (~2GB)
  totalJSHeapSize: 2415919104,
  jsHeapSizeLimit: 4294967296
}
```

**What to look for:**
- Used heap after init: 2-3 GB (model loaded)
- Stable usage: No continuous growth
- Growth rate: Should stabilize after model load

**Warning signs:**
- Continuous growth: Memory leak
- Approaching limit: May crash
- Large jumps: Investigate cause

---

## Debug Logging

### Log Levels

When debug mode is enabled, logs include:

1. **debug**: Detailed operational logs (only in debug mode)
2. **info**: General information (always shown)
3. **warn**: Warnings and fallback behavior (always shown)
4. **error**: Errors and failures (always shown)

### Log Format

All logs follow structured format:

```javascript
{
  timestamp: "2024-12-11T10:30:45.123Z",
  level: "info",
  service: "WebLLM",
  message: "Model initialization complete",
  model: "Phi-3.5-mini-instruct-q4f16_1-MLC",
  duration: "45.32s",
  fromCache: true
}
```

### Example Debug Session

```
[WebLLM] WebLLM Service initialized { debug: true, ... }
[WebLLM] Starting model initialization { primaryModel: "...", ... }
[WebLLM] WebGPU support confirmed {}
[WebLLM] Loading model from cache {}
[WebLLM] Load progress { progress: 25, status: "Fetching params..." }
[WebLLM] Load progress { progress: 50, status: "Loading model..." }
[WebLLM] Load progress { progress: 100, status: "Ready" }
[WebLLM] Primary model loaded successfully { model: "..." }
[WebLLM] Model initialization complete { model: "...", duration: "12.45s", fromCache: true }
[WebLLM] Starting generation { type: "enhance_summary", maxTokens: 200, ... }
[WebLLM] Generation complete { type: "enhance_summary", duration: 8.54s, tokens: 156, ... }
```

---

## Performance Optimization Tips

### Based on Metrics

1. **High initialization time (>5 min)**
   - Check network speed
   - Verify cache is working (`fromCache: false` on first load is normal)
   - Ensure sufficient bandwidth for ~2GB download

2. **Low throughput (<10 tokens/sec)**
   - Check GPU usage (DevTools → Performance)
   - Close other GPU-intensive tabs
   - Verify WebGPU is actually being used
   - Check if using fallback model (smaller = faster)

3. **High memory usage**
   - Normal: 2-3 GB with model loaded
   - Warning: >3.5 GB may cause issues
   - Solution: Unload model when not in use
   ```javascript
   await webllmService.unload();
   ```

4. **Cache misses on reload**
   - Check IndexedDB not being cleared
   - Verify storage quota not exceeded
   - Check browser privacy settings

5. **Slow generations**
   - Reduce `maxTokens` if output is too long
   - Check prompt complexity
   - Monitor concurrent generations (should be sequential)

---

## Troubleshooting

### No metrics showing

```javascript
// Check if service is initialized
const status = webllmService.getStatus();
console.log(status);

// Force refresh metrics
const metrics = webllmService.getMetrics();
console.log(metrics);
```

### Debug mode not working

```bash
# Verify environment variable
echo $VITE_WEBLLM_DEBUG

# Restart dev server after changing .env
npm run dev
```

### Memory snapshots not captured

```javascript
// Check if performance.memory is available
console.log(performance.memory);

// Chrome only feature - won't work in other browsers
// Need to enable precise memory info in Chrome
```

To enable in Chrome:
1. Run Chrome with: `--enable-precise-memory-info`
2. Or accept less precise data

### Metrics not persisting

Metrics are **session-based** (not persisted to storage).
- Refreshing page resets metrics
- Download JSON before closing if you need to keep data

---

## Console Commands Reference

```javascript
// Import service (if not already available)
import webllmService from './services/webllmService';

// === Status & Metrics ===
webllmService.getStatus()              // Current status
webllmService.getMetrics()             // Summary metrics
webllmService.getAllGenerations()      // All generation details
webllmService.getMemorySnapshots()     // Memory tracking

// === Display ===
webllmService.printMetrics()           // Formatted console output

// === Export ===
webllmService.exportMetrics()          // JSON string
webllmService.downloadMetrics()        // Download JSON file
webllmService.downloadMetrics('my-metrics.json')  // Custom filename

// === Utilities ===
webllmService.resetMetrics()           // Clear all metrics
await webllmService.unload()           // Unload model & free memory
```

---

## Integration with CI/CD

### Automated Performance Testing

```javascript
// Example test script
import webllmService from './services/webllmService';

async function testPerformance() {
  // Reset to clean state
  webllmService.resetMetrics();

  // Initialize
  await webllmService.initialize();

  // Run test generations
  await webllmService.enhanceSummary('Test summary');
  await webllmService.enhanceExperience('Test experience');

  // Check metrics
  const metrics = webllmService.getMetrics();

  // Assert performance thresholds
  const avgTime = parseFloat(metrics.generations.avgGenerationTimeMs);
  if (avgTime > 20000) {
    console.error('Performance degradation detected');
    process.exit(1);
  }

  // Export for analysis
  const data = webllmService.exportMetrics();
  fs.writeFileSync('performance-report.json', data);
}
```

---

## Best Practices

1. **Enable debug mode during development**
   ```bash
   VITE_WEBLLM_DEBUG=true npm run dev
   ```

2. **Download metrics after testing sessions**
   ```javascript
   webllmService.downloadMetrics('session-2024-12-11.json');
   ```

3. **Monitor memory in long sessions**
   - Check memory snapshots periodically
   - Unload model if not used for extended period

4. **Track performance regressions**
   - Export metrics after each release
   - Compare throughput and generation times
   - Set up alerts for degradation

5. **Use monitoring dashboard for demos**
   - Shows real-time performance
   - Builds confidence in browser-based AI
   - Helps identify issues quickly

---

## Metrics Schema

### Full Export Format

```json
{
  "exportedAt": "2024-12-11T10:30:45.123Z",
  "status": {
    "isLoading": false,
    "isReady": true,
    "progress": 100,
    "status": "",
    "model": "Phi-3.5-mini-instruct-q4f16_1-MLC",
    "debug": true
  },
  "metrics": {
    "initialization": {
      "startTime": 123456.789,
      "endTime": 123567.890,
      "duration": 111101.1,
      "durationSeconds": "111.10",
      "modelLoaded": "Phi-3.5-mini-instruct-q4f16_1-MLC",
      "fromCache": false
    },
    "generations": {
      "total": 5,
      "byType": {
        "enhance_summary": 2,
        "enhance_experience": 1,
        "optimize_skills": 1,
        "suggest_skills": 1
      },
      "totalTokens": 856,
      "avgGenerationTimeMs": "9234.56",
      "avgThroughputTokensPerSec": "18.45",
      "recentGenerations": [...]
    },
    "cache": {
      "hits": 1,
      "misses": 1,
      "hitRate": "50.00%"
    },
    "errors": {
      "total": 0,
      "recent": []
    },
    "memory": {
      "snapshots": 12,
      "recent": [...]
    }
  },
  "allGenerations": [...],
  "memorySnapshots": [...]
}
```

---

## Support

For issues or questions:
1. Check browser console for errors
2. Enable debug mode for detailed logs
3. Export metrics and share in bug reports
4. Include browser version and OS

---

## Future Enhancements

Planned improvements:
- [ ] Real-time performance chart visualization
- [ ] Automatic performance regression detection
- [ ] Metrics persistence to localStorage
- [ ] Comparison tool for before/after metrics
- [ ] Export to CSV for analysis
- [ ] Integration with analytics platforms
- [ ] Alerts for performance thresholds
- [ ] A/B testing framework for model parameters
