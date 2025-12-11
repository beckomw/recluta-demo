/**
 * WebLLM Service - Browser-based AI for resume enhancement
 * Uses a small, efficient model that runs entirely in the browser
 *
 * Features:
 * - Performance monitoring and metrics tracking
 * - Debug mode with structured logging
 * - Token usage tracking
 * - Memory usage monitoring
 */

import * as webllm from '@mlc-ai/web-llm';

// Use a small, fast model suitable for text enhancement
// Phi-3.5-mini is ~2GB and runs well on most modern devices
const MODEL_ID = 'Phi-3.5-mini-instruct-q4f16_1-MLC';

// Fallback to even smaller model if needed
const FALLBACK_MODEL_ID = 'Qwen2.5-0.5B-Instruct-q4f16_1-MLC';

class WebLLMService {
  constructor() {
    this.engine = null;
    this.isLoading = false;
    this.isReady = false;
    this.loadProgress = 0;
    this.loadStatus = '';
    this.currentModel = null;
    this.onProgressCallback = null;

    // Debug mode - controlled by environment variable
    this.DEBUG = import.meta.env.VITE_WEBLLM_DEBUG === 'true';

    // Performance metrics
    this.metrics = {
      initialization: {
        startTime: null,
        endTime: null,
        duration: null,
        modelLoaded: null,
        fromCache: false,
      },
      generations: [],
      totalGenerations: 0,
      totalTokens: 0,
      cacheHits: 0,
      cacheMisses: 0,
      errors: [],
    };

    // Memory tracking
    this.memorySnapshots = [];

    this.log('WebLLM Service initialized', { debug: this.DEBUG });
  }

  /**
   * Structured logging method
   */
  log(message, data = {}, level = 'info') {
    if (!this.DEBUG && level !== 'error' && level !== 'warn') {
      return;
    }

    const logEntry = {
      timestamp: new Date().toISOString(),
      level,
      service: 'WebLLM',
      message,
      ...data,
    };

    switch (level) {
      case 'error':
        console.error(`[WebLLM] ${message}`, logEntry);
        this.metrics.errors.push(logEntry);
        break;
      case 'warn':
        console.warn(`[WebLLM] ${message}`, logEntry);
        break;
      case 'info':
        console.log(`[WebLLM] ${message}`, logEntry);
        break;
      case 'debug':
        if (this.DEBUG) {
          console.debug(`[WebLLM] ${message}`, logEntry);
        }
        break;
      default:
        console.log(`[WebLLM] ${message}`, logEntry);
    }
  }

  /**
   * Take a memory snapshot
   */
  captureMemorySnapshot(label) {
    if (performance.memory) {
      const snapshot = {
        timestamp: Date.now(),
        label,
        usedJSHeapSize: performance.memory.usedJSHeapSize,
        totalJSHeapSize: performance.memory.totalJSHeapSize,
        jsHeapSizeLimit: performance.memory.jsHeapSizeLimit,
      };
      this.memorySnapshots.push(snapshot);
      this.log(`Memory snapshot: ${label}`, snapshot, 'debug');
      return snapshot;
    }
    return null;
  }

  /**
   * Initialize the WebLLM engine with progress callback
   */
  async initialize(onProgress) {
    if (this.isReady && this.engine) {
      this.log('Model already initialized', { model: this.currentModel }, 'debug');
      return true;
    }

    if (this.isLoading) {
      this.log('Model already loading', {}, 'debug');
      return false;
    }

    // Start performance tracking
    this.metrics.initialization.startTime = performance.now();
    this.captureMemorySnapshot('before_init');

    this.isLoading = true;
    this.onProgressCallback = onProgress;

    this.log('Starting model initialization', {
      primaryModel: MODEL_ID,
      fallbackModel: FALLBACK_MODEL_ID,
    });

    try {
      // Check for WebGPU support
      if (!navigator.gpu) {
        const error = new Error('WebGPU is not supported in this browser. Please use Chrome 113+ or Edge 113+.');
        this.log('WebGPU not supported', { browser: navigator.userAgent }, 'error');
        throw error;
      }

      this.log('WebGPU support confirmed', {}, 'debug');

      const progressCallback = (progress) => {
        this.loadProgress = Math.round(progress.progress * 100);
        this.loadStatus = progress.text || 'Loading model...';

        this.log('Load progress', {
          progress: this.loadProgress,
          status: this.loadStatus,
        }, 'debug');

        if (this.onProgressCallback) {
          this.onProgressCallback({
            progress: this.loadProgress,
            status: this.loadStatus,
          });
        }
      };

      // Detect if loading from cache
      const cacheDetected = await this.checkModelCache();
      this.metrics.initialization.fromCache = cacheDetected;

      if (cacheDetected) {
        this.metrics.cacheHits++;
        this.log('Loading model from cache', {}, 'info');
      } else {
        this.metrics.cacheMisses++;
        this.log('Downloading model (no cache)', {}, 'info');
      }

      // Try primary model first, fallback to smaller model if needed
      try {
        this.log('Attempting to load primary model', { model: MODEL_ID });
        this.engine = await webllm.CreateMLCEngine(MODEL_ID, {
          initProgressCallback: progressCallback,
        });
        this.currentModel = MODEL_ID;
        this.log('Primary model loaded successfully', { model: MODEL_ID });
      } catch (primaryError) {
        this.log('Primary model failed, trying fallback', {
          error: primaryError.message,
          fallbackModel: FALLBACK_MODEL_ID,
        }, 'warn');

        this.engine = await webllm.CreateMLCEngine(FALLBACK_MODEL_ID, {
          initProgressCallback: progressCallback,
        });
        this.currentModel = FALLBACK_MODEL_ID;
        this.log('Fallback model loaded successfully', { model: FALLBACK_MODEL_ID });
      }

      // Record initialization metrics
      this.metrics.initialization.endTime = performance.now();
      this.metrics.initialization.duration =
        this.metrics.initialization.endTime - this.metrics.initialization.startTime;
      this.metrics.initialization.modelLoaded = this.currentModel;

      this.captureMemorySnapshot('after_init');

      this.isReady = true;
      this.isLoading = false;

      this.log('Model initialization complete', {
        model: this.currentModel,
        duration: `${(this.metrics.initialization.duration / 1000).toFixed(2)}s`,
        fromCache: this.metrics.initialization.fromCache,
      });

      return true;
    } catch (error) {
      this.isLoading = false;
      this.isReady = false;

      this.log('WebLLM initialization error', {
        error: error.message,
        stack: error.stack,
      }, 'error');

      this.captureMemorySnapshot('after_init_error');
      throw error;
    }
  }

  /**
   * Check if model is cached (heuristic based on IndexedDB)
   */
  async checkModelCache() {
    try {
      const databases = await indexedDB.databases();
      const webllmDB = databases.find(db => db.name && db.name.includes('webllm'));
      return !!webllmDB;
    } catch (e) {
      this.log('Could not check cache', { error: e.message }, 'debug');
      return false;
    }
  }

  /**
   * Check if WebGPU is available
   */
  static async checkWebGPUSupport() {
    if (!navigator.gpu) {
      return { supported: false, reason: 'WebGPU not available' };
    }

    try {
      const adapter = await navigator.gpu.requestAdapter();
      if (!adapter) {
        return { supported: false, reason: 'No GPU adapter found' };
      }
      return { supported: true };
    } catch (e) {
      return { supported: false, reason: e.message };
    }
  }

  /**
   * Generate enhanced text based on prompt
   */
  async generate(prompt, options = {}) {
    if (!this.isReady || !this.engine) {
      const error = new Error('WebLLM not initialized. Call initialize() first.');
      this.log('Generate called before initialization', {}, 'error');
      throw error;
    }

    const {
      maxTokens = 500,
      temperature = 0.7,
      topP = 0.9,
      type = 'unknown',
    } = options;

    const startTime = performance.now();
    this.captureMemorySnapshot(`before_gen_${this.metrics.totalGenerations}`);

    this.log('Starting generation', {
      type,
      maxTokens,
      temperature,
      promptLength: prompt.length,
    }, 'debug');

    try {
      const response = await this.engine.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: 'You are a professional resume writer. Provide concise, impactful improvements. Be direct and professional. Output only the improved text without explanations or preamble.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        max_tokens: maxTokens,
        temperature,
        top_p: topP,
      });

      const endTime = performance.now();
      const duration = endTime - startTime;

      // Extract token usage
      const tokensUsed = response.usage?.total_tokens || 0;
      const promptTokens = response.usage?.prompt_tokens || 0;
      const completionTokens = response.usage?.completion_tokens || 0;

      // Calculate throughput (tokens per second)
      const throughput = tokensUsed > 0 ? (tokensUsed / (duration / 1000)).toFixed(2) : 0;

      // Record generation metrics
      const generationMetric = {
        timestamp: Date.now(),
        type,
        duration,
        durationSeconds: (duration / 1000).toFixed(2),
        tokensUsed,
        promptTokens,
        completionTokens,
        throughput: parseFloat(throughput),
        temperature,
        maxTokens,
        promptLength: prompt.length,
        responseLength: response.choices[0].message.content.length,
      };

      this.metrics.generations.push(generationMetric);
      this.metrics.totalGenerations++;
      this.metrics.totalTokens += tokensUsed;

      this.captureMemorySnapshot(`after_gen_${this.metrics.totalGenerations}`);

      this.log('Generation complete', generationMetric, 'debug');

      // Log summary info even when not in debug mode
      if (!this.DEBUG) {
        this.log(`Generated ${type}`, {
          duration: `${generationMetric.durationSeconds}s`,
          tokens: tokensUsed,
          throughput: `${throughput} tokens/sec`,
        }, 'info');
      }

      return response.choices[0].message.content.trim();
    } catch (error) {
      const endTime = performance.now();
      const duration = endTime - startTime;

      this.log('Generation error', {
        type,
        error: error.message,
        duration,
        promptLength: prompt.length,
      }, 'error');

      this.captureMemorySnapshot(`after_gen_error_${this.metrics.totalGenerations}`);
      throw error;
    }
  }

  /**
   * Enhance a professional summary
   */
  async enhanceSummary(summary, targetRole = '') {
    const roleContext = targetRole ? ` for a ${targetRole} position` : '';
    const prompt = `Improve this professional summary to be more concise and impactful${roleContext}. Keep it to 2-3 sentences maximum. Focus on value and achievements.

Current summary:
${summary}

Improved summary:`;

    return this.generate(prompt, {
      maxTokens: 200,
      temperature: 0.6,
      type: 'enhance_summary',
    });
  }

  /**
   * Enhance work experience description
   */
  async enhanceExperience(experience) {
    const prompt = `Rewrite this work experience to be more concise and impactful. Use action verbs, quantify achievements where possible, and focus on results. Format as bullet points.

Current experience:
${experience}

Improved experience:`;

    return this.generate(prompt, {
      maxTokens: 600,
      temperature: 0.6,
      type: 'enhance_experience',
    });
  }

  /**
   * Optimize skills list for a job description
   */
  async optimizeSkills(skills, jobDescription = '') {
    const jobContext = jobDescription
      ? `\n\nTarget job description:\n${jobDescription.substring(0, 500)}`
      : '';

    const prompt = `Organize and prioritize these skills for maximum impact on a resume. Group related skills together, put most relevant first. Return as a comma-separated list.${jobContext}

Current skills:
${skills}

Optimized skills list:`;

    return this.generate(prompt, {
      maxTokens: 200,
      temperature: 0.5,
      type: 'optimize_skills',
    });
  }

  /**
   * Generate a professional summary from skills and experience
   */
  async generateSummary(skills, experience, targetRole = '') {
    const roleContext = targetRole ? ` for a ${targetRole} position` : '';
    const prompt = `Create a compelling 2-3 sentence professional summary${roleContext} based on these skills and experience. Be specific and highlight key strengths.

Skills: ${skills}

Experience: ${experience.substring(0, 800)}

Professional summary:`;

    return this.generate(prompt, {
      maxTokens: 150,
      temperature: 0.7,
      type: 'generate_summary',
    });
  }

  /**
   * Suggest additional relevant skills based on existing skills
   */
  async suggestSkills(currentSkills, targetRole = '') {
    const roleContext = targetRole ? ` for a ${targetRole} role` : '';
    const prompt = `Based on these existing skills, suggest 3-5 additional complementary technical skills that would strengthen a resume${roleContext}. Only suggest skills that commonly pair with these. Return as comma-separated list.

Current skills: ${currentSkills}

Suggested additional skills:`;

    return this.generate(prompt, {
      maxTokens: 100,
      temperature: 0.6,
      type: 'suggest_skills',
    });
  }

  /**
   * Clean up and unload the model
   */
  async unload() {
    this.log('Unloading model', { model: this.currentModel });
    this.captureMemorySnapshot('before_unload');

    if (this.engine) {
      await this.engine.unload();
      this.engine = null;
      this.isReady = false;
      this.currentModel = null;

      this.captureMemorySnapshot('after_unload');
      this.log('Model unloaded successfully');
    }
  }

  /**
   * Get current status
   */
  getStatus() {
    return {
      isLoading: this.isLoading,
      isReady: this.isReady,
      progress: this.loadProgress,
      status: this.loadStatus,
      model: this.currentModel,
      debug: this.DEBUG,
    };
  }

  /**
   * Get performance metrics
   */
  getMetrics() {
    const avgGenerationTime =
      this.metrics.totalGenerations > 0
        ? this.metrics.generations.reduce((sum, gen) => sum + gen.duration, 0) /
          this.metrics.totalGenerations
        : 0;

    const avgThroughput =
      this.metrics.totalGenerations > 0
        ? this.metrics.generations.reduce((sum, gen) => sum + gen.throughput, 0) /
          this.metrics.totalGenerations
        : 0;

    const generationsByType = this.metrics.generations.reduce((acc, gen) => {
      acc[gen.type] = (acc[gen.type] || 0) + 1;
      return acc;
    }, {});

    return {
      initialization: {
        ...this.metrics.initialization,
        durationSeconds: this.metrics.initialization.duration
          ? (this.metrics.initialization.duration / 1000).toFixed(2)
          : null,
      },
      generations: {
        total: this.metrics.totalGenerations,
        byType: generationsByType,
        totalTokens: this.metrics.totalTokens,
        avgGenerationTimeMs: avgGenerationTime.toFixed(2),
        avgThroughputTokensPerSec: avgThroughput.toFixed(2),
        recentGenerations: this.metrics.generations.slice(-5), // Last 5
      },
      cache: {
        hits: this.metrics.cacheHits,
        misses: this.metrics.cacheMisses,
        hitRate:
          this.metrics.cacheHits + this.metrics.cacheMisses > 0
            ? (
                (this.metrics.cacheHits /
                  (this.metrics.cacheHits + this.metrics.cacheMisses)) *
                100
              ).toFixed(2) + '%'
            : 'N/A',
      },
      errors: {
        total: this.metrics.errors.length,
        recent: this.metrics.errors.slice(-5), // Last 5 errors
      },
      memory: {
        snapshots: this.memorySnapshots.length,
        recent: this.memorySnapshots.slice(-3), // Last 3 snapshots
      },
    };
  }

  /**
   * Get detailed metrics for all generations
   */
  getAllGenerations() {
    return this.metrics.generations;
  }

  /**
   * Get memory snapshots
   */
  getMemorySnapshots() {
    return this.memorySnapshots;
  }

  /**
   * Export metrics as JSON
   */
  exportMetrics() {
    const data = {
      exportedAt: new Date().toISOString(),
      status: this.getStatus(),
      metrics: this.getMetrics(),
      allGenerations: this.getAllGenerations(),
      memorySnapshots: this.getMemorySnapshots(),
    };

    return JSON.stringify(data, null, 2);
  }

  /**
   * Download metrics as JSON file
   */
  downloadMetrics(filename = 'webllm-metrics.json') {
    const data = this.exportMetrics();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);

    this.log('Metrics downloaded', { filename });
  }

  /**
   * Reset metrics (useful for testing)
   */
  resetMetrics() {
    this.log('Resetting metrics');

    this.metrics = {
      initialization: {
        startTime: null,
        endTime: null,
        duration: null,
        modelLoaded: null,
        fromCache: false,
      },
      generations: [],
      totalGenerations: 0,
      totalTokens: 0,
      cacheHits: 0,
      cacheMisses: 0,
      errors: [],
    };

    this.memorySnapshots = [];
    this.log('Metrics reset complete');
  }

  /**
   * Print metrics summary to console
   */
  printMetrics() {
    const metrics = this.getMetrics();
    console.log('=== WebLLM Performance Metrics ===');
    console.table({
      'Total Generations': metrics.generations.total,
      'Total Tokens': metrics.generations.totalTokens,
      'Avg Generation Time': `${metrics.generations.avgGenerationTimeMs}ms`,
      'Avg Throughput': `${metrics.generations.avgThroughputTokensPerSec} tok/sec`,
      'Cache Hit Rate': metrics.cache.hitRate,
      'Total Errors': metrics.errors.total,
    });

    console.log('\nGenerations by Type:');
    console.table(metrics.generations.byType);

    if (metrics.initialization.duration) {
      console.log('\nInitialization:');
      console.table({
        Model: metrics.initialization.modelLoaded,
        Duration: `${metrics.initialization.durationSeconds}s`,
        'From Cache': metrics.initialization.fromCache ? 'Yes' : 'No',
      });
    }

    if (metrics.errors.total > 0) {
      console.log('\nRecent Errors:');
      console.table(metrics.errors.recent);
    }
  }
}

// Export singleton instance
export const webllmService = new WebLLMService();
export default webllmService;
