# WebLLM Testing Guide - Phase 1: Manual Validation

This guide provides a comprehensive checklist for manually testing the WebLLM integration in the resume builder application.

---

## Prerequisites

### Browser Requirements
- **Chrome 113+** or **Edge 113+** (WebGPU required)
- At least **4GB RAM available**
- Stable internet connection for initial model download (~2GB)

### Setup
1. Open DevTools (F12) before starting tests
2. Go to Console tab to monitor logs
3. Keep Network tab open to track downloads
4. Optional: Open Performance tab for memory monitoring

---

## Test Suite 1: Basic Functionality

### 1.1 WebGPU Detection

**Test:** Navigate to the application

**Expected Results:**
- [ ] No console errors about WebGPU
- [ ] Application loads normally
- [ ] Enhance buttons are visible

**To verify WebGPU support manually:**
```javascript
// Run in browser console:
navigator.gpu ? 'WebGPU Supported ✓' : 'WebGPU NOT Supported ✗'
```

**Fallback Test (Optional):**
- [ ] Test in Firefox/Safari (no WebGPU)
- [ ] Should see error message when clicking Enhance
- [ ] Error should mention browser compatibility

---

### 1.2 Model Loading (First Time)

**Test:** Click any "Enhance" button for the first time

**Expected Results:**
- [ ] Modal opens with loading indicator
- [ ] Progress bar appears and updates (0% → 100%)
- [ ] Status text shows meaningful messages:
  - "Loading model..."
  - "Fetching params..."
  - "Initializing..."
- [ ] Network tab shows ~2GB download (check Size column)
- [ ] Console shows no errors during load
- [ ] Model loads within 2-5 minutes (varies by network speed)
- [ ] Ready state achieved, "Generate" button becomes enabled

**Performance Notes:**
- Download size: ~2GB for Phi-3.5-mini-instruct
- First load: 2-5 minutes (network dependent)
- Check Network tab for:
  - Status: 200 OK
  - Cache: from disk cache (after first load)

---

### 1.3 Model Caching (Subsequent Loads)

**Test:** Refresh page, click Enhance button again

**Expected Results:**
- [ ] Model loads much faster (5-30 seconds)
- [ ] Network tab shows "from disk cache" or "from service worker"
- [ ] No new ~2GB download
- [ ] Progress bar still appears but completes quickly
- [ ] Console shows model loaded from cache

**To verify cache:**
```
DevTools → Application → IndexedDB → webllm
```
- [ ] Check for stored model data

---

## Test Suite 2: Enhancement Types

Test all 5 enhancement types with sample data.

### 2.1 Enhance Summary

**Test Steps:**
1. Navigate to a resume with a summary section
2. Click "Enhance" button next to Summary
3. Wait for modal to open and model to load
4. Click "Generate Enhancement"

**Expected Results:**
- [ ] Generation completes in 5-15 seconds
- [ ] Output is 2-3 sentences (not too long)
- [ ] Content is professional and relevant
- [ ] No hallucinations or irrelevant text
- [ ] "Accept" button works
- [ ] "Regenerate" produces different output
- [ ] "Cancel" closes modal without changes

**Sample Input:**
```
"Software engineer with experience in web development."
```

**Expected Output Pattern:**
- Concise (2-3 sentences)
- Action-oriented
- Professional tone
- Quantifiable if possible

---

### 2.2 Enhance Experience

**Test Steps:**
1. Navigate to work experience section
2. Click "Enhance" button next to an experience entry
3. Generate enhancement

**Expected Results:**
- [ ] Generation completes in 10-20 seconds (longer output)
- [ ] Output formatted as bullet points
- [ ] Uses action verbs (Led, Developed, Implemented, etc.)
- [ ] Quantifies achievements where applicable
- [ ] No grammatical errors
- [ ] Professional business language

**Sample Input:**
```
"Worked on building web applications using React. Made the site faster."
```

**Expected Output Pattern:**
- Bullet points
- Action verbs at start
- Specific technologies mentioned
- Results quantified ("improved by X%")

---

### 2.3 Optimize Skills

**Test Steps:**
1. Navigate to skills section
2. Click "Enhance" button
3. Generate optimization

**Expected Results:**
- [ ] Generation completes in 5-10 seconds
- [ ] Skills organized logically (grouped by category)
- [ ] Most relevant skills listed first
- [ ] Returned as comma-separated list
- [ ] No duplicate skills
- [ ] Skills are relevant to input

**Sample Input:**
```
"JavaScript, HTML, CSS, React, Node.js, Git, Python, SQL"
```

**Expected Output Pattern:**
- Organized grouping (e.g., Frontend, Backend, Tools)
- Prioritized ordering
- Clean formatting

---

### 2.4 Generate Summary

**Test Steps:**
1. Click "Generate Summary" (creates new summary from scratch)
2. Provide skills and experience context

**Expected Results:**
- [ ] Generation completes in 5-15 seconds
- [ ] Creates coherent summary from provided data
- [ ] 2-3 sentences
- [ ] Highlights key strengths from input
- [ ] Professional and targeted

**Sample Context:**
```
Skills: "React, Node.js, MongoDB"
Experience: "3 years building full-stack applications"
```

---

### 2.5 Suggest Skills

**Test Steps:**
1. Navigate to skills section
2. Click "Suggest Skills"
3. Provide current skills

**Expected Results:**
- [ ] Generation completes in 3-8 seconds (short output)
- [ ] Suggests 3-5 complementary skills
- [ ] Skills are relevant and realistic
- [ ] Skills commonly pair with input skills
- [ ] Comma-separated format
- [ ] No duplicate suggestions

**Sample Input:**
```
"React, TypeScript, Redux"
```

**Expected Suggestions:**
- Related frontend tools (Next.js, Jest, etc.)
- Complementary technologies (GraphQL, REST APIs)
- Modern development tools (Webpack, Vite)

---

## Test Suite 3: Error Handling

### 3.1 No WebGPU Support

**Test:** Open in unsupported browser (Firefox, Safari)

**Expected Results:**
- [ ] Clear error message displayed
- [ ] Mentions browser compatibility (Chrome 113+, Edge 113+)
- [ ] Graceful degradation (app still usable without AI)

---

### 3.2 Network Interruption

**Test:** Simulate network failure during model download
1. Click Enhance to start model download
2. Open DevTools → Network
3. Set throttling to "Offline" mid-download

**Expected Results:**
- [ ] Error message displayed
- [ ] No app crash
- [ ] Can retry after network restored
- [ ] Console shows meaningful error

---

### 3.3 Model Initialization Failure

**Test:** Check fallback behavior

**To test manually:**
- Primary model: Phi-3.5-mini-instruct-q4f16_1-MLC
- Fallback model: Qwen2.5-0.5B-Instruct-q4f16_1-MLC

**Expected Results:**
- [ ] Console warning about fallback (if primary fails)
- [ ] Fallback model loads successfully
- [ ] Functionality works with fallback model
- [ ] User experience remains smooth

---

### 3.4 Generation Timeout

**Test:** Very long input text (>10,000 characters)

**Expected Results:**
- [ ] Either completes or fails gracefully
- [ ] Error message if timeout occurs
- [ ] No browser freeze/crash
- [ ] Can retry with shorter input

---

## Test Suite 4: Performance Validation

### 4.1 Memory Usage

**Test:** Monitor memory during model usage

**Steps:**
1. Open DevTools → Performance
2. Click "Record"
3. Load model and generate 3-5 enhancements
4. Stop recording

**Expected Results:**
- [ ] Memory usage stabilizes (no continuous growth)
- [ ] No memory leaks detected
- [ ] Heap size reasonable (<3GB total)
- [ ] JS heap doesn't continuously increase

**Check in Performance Monitor:**
```
DevTools → Performance Monitor (Ctrl+Shift+P → "Show Performance Monitor")
```
- [ ] Watch JS heap size during generation
- [ ] Should be stable between generations

---

### 4.2 Generation Speed

**Benchmark each enhancement type:**

| Enhancement Type | Expected Time | Actual Time | Status |
|------------------|---------------|-------------|---------|
| Enhance Summary  | 5-15 sec      | ________    | [ ]     |
| Enhance Experience | 10-20 sec   | ________    | [ ]     |
| Optimize Skills  | 5-10 sec      | ________    | [ ]     |
| Generate Summary | 5-15 sec      | ________    | [ ]     |
| Suggest Skills   | 3-8 sec       | ________    | [ ]     |

**Notes:**
- Times vary by device GPU
- First generation after load may be slower
- Subsequent generations should be consistent

---

### 4.3 Model Load Performance

**Metrics to record:**

| Metric | Expected | Actual | Status |
|--------|----------|--------|---------|
| First load (cold) | 2-5 min | _______ | [ ] |
| Cached load (warm) | 5-30 sec | _______ | [ ] |
| Model size | ~2GB | _______ | [ ] |
| Memory footprint | <3GB | _______ | [ ] |

---

### 4.4 Concurrent Requests

**Test:** Multiple enhancements in quick succession

**Steps:**
1. Load model
2. Generate enhancement
3. Immediately click "Regenerate" 3-4 times quickly

**Expected Results:**
- [ ] Queue handles requests properly
- [ ] No race conditions
- [ ] Each generation completes
- [ ] UI remains responsive
- [ ] No crashes or errors

---

## Test Suite 5: User Experience

### 5.1 Progress Feedback

**Expected Results:**
- [ ] Progress bar visible during model load
- [ ] Percentage updates smoothly (not jumping)
- [ ] Status text is meaningful
- [ ] User knows what's happening at all times
- [ ] No "frozen" states without feedback

---

### 5.2 Quality of Output

**Subjective evaluation:**

For each enhancement type, rate 1-5:
- [ ] Relevance: Output matches input context (___/5)
- [ ] Quality: Professional and polished (___/5)
- [ ] Accuracy: No hallucinations or errors (___/5)
- [ ] Usefulness: Actual improvement over original (___/5)

---

### 5.3 Accept/Regenerate Flow

**Test Steps:**
1. Generate enhancement
2. Click "Regenerate" multiple times
3. Accept one result

**Expected Results:**
- [ ] Regenerate produces varied outputs
- [ ] Accept updates the resume field
- [ ] Modal closes after accept
- [ ] Changes persist in resume
- [ ] Undo/redo works if applicable

---

## Test Suite 6: Browser Compatibility

### 6.1 Supported Browsers

| Browser | Version | WebGPU | Status | Notes |
|---------|---------|--------|--------|-------|
| Chrome  | 113+    | Yes    | [ ]    | Primary |
| Edge    | 113+    | Yes    | [ ]    | Primary |
| Chrome (Mobile) | 113+ | Varies | [ ] | Test if possible |

### 6.2 Unsupported Browsers

| Browser | Expected Behavior | Status |
|---------|-------------------|--------|
| Firefox | Error message shown | [ ] |
| Safari  | Error message shown | [ ] |
| Chrome <113 | Error message shown | [ ] |

---

## Test Suite 7: Cache Management

### 7.1 IndexedDB Inspection

**Steps:**
1. Load model successfully
2. Open DevTools → Application → Storage → IndexedDB
3. Find 'webllm' database

**Expected Results:**
- [ ] Database exists
- [ ] Model data stored
- [ ] Reasonable size (~2GB)
- [ ] Can clear and reload

---

### 7.2 Cache Persistence

**Test:** Close browser, reopen

**Expected Results:**
- [ ] Cache persists across sessions
- [ ] Model loads from cache on next use
- [ ] No re-download required

---

### 7.3 Cache Clearing

**Test:** Clear browser cache

**Steps:**
1. Clear site data (DevTools → Application → Clear storage)
2. Refresh page
3. Click Enhance

**Expected Results:**
- [ ] Model downloads again (~2GB)
- [ ] No errors from missing cache
- [ ] Cache rebuilds successfully

---

## Debugging Checklist

When issues occur, collect this information:

### Browser Environment
```javascript
// Run in console:
console.log({
  browser: navigator.userAgent,
  webGPU: !!navigator.gpu,
  gpu: navigator.gpu ? 'Available' : 'Not Available'
});
```

### WebLLM Service Status
```javascript
// Run in console (after import):
import webllmService from './services/webllmService';
console.log(webllmService.getStatus());
```

### Console Logs
- [ ] Any errors in console?
- [ ] Any warnings about WebGPU?
- [ ] Network failures?

### Network Tab
- [ ] Model download status?
- [ ] Response codes (200, 404, etc.)?
- [ ] Cache headers present?

### Performance
- [ ] Memory usage abnormal?
- [ ] GPU usage issues?
- [ ] Browser freezing?

---

## Success Criteria

All tests should pass with these outcomes:

### Functionality
- ✅ All 5 enhancement types work correctly
- ✅ Model loads and caches properly
- ✅ Error handling is graceful
- ✅ No browser crashes

### Performance
- ✅ Model loads in expected timeframe
- ✅ Generations complete in <30 seconds
- ✅ Memory usage is stable
- ✅ Cached loads are fast (<30 sec)

### User Experience
- ✅ Clear feedback at all times
- ✅ Professional quality output
- ✅ Intuitive UI flow
- ✅ Helpful error messages

---

## Reporting Issues

When reporting bugs, include:

1. **Browser:** Name and version
2. **Test:** Which test failed
3. **Steps:** How to reproduce
4. **Expected:** What should happen
5. **Actual:** What actually happened
6. **Console:** Any error messages
7. **Network:** Download/cache status
8. **Screenshot:** If UI issue

---

## Next Steps After Phase 1

Once manual testing is complete:
1. Review Phase 2 monitoring metrics
2. Identify performance bottlenecks
3. Document common issues
4. Plan Phase 3 automated tests

---

## Quick Reference Commands

**Check WebGPU:**
```javascript
navigator.gpu ? '✓ Supported' : '✗ Not Supported'
```

**Check Service Status:**
```javascript
webllmService.getStatus()
```

**Monitor Memory:**
```
DevTools → Performance Monitor → JS heap size
```

**Check Cache:**
```
DevTools → Application → IndexedDB → webllm
```

**Network Throttling:**
```
DevTools → Network → Throttling → Fast 3G / Offline
```

---

## Test Results Template

```
Test Date: __________
Tester: __________
Browser: __________
Environment: Production / Development

=== RESULTS ===

Suite 1 - Basic Functionality: PASS / FAIL
Suite 2 - Enhancement Types: PASS / FAIL
Suite 3 - Error Handling: PASS / FAIL
Suite 4 - Performance: PASS / FAIL
Suite 5 - User Experience: PASS / FAIL
Suite 6 - Browser Compatibility: PASS / FAIL
Suite 7 - Cache Management: PASS / FAIL

=== NOTES ===
[Any observations, issues, or recommendations]

=== BLOCKERS ===
[Any critical issues preventing functionality]
```
