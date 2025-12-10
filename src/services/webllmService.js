/**
 * WebLLM Service - Browser-based AI for resume enhancement
 * Uses a small, efficient model that runs entirely in the browser
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
  }

  /**
   * Initialize the WebLLM engine with progress callback
   */
  async initialize(onProgress) {
    if (this.isReady && this.engine) {
      return true;
    }

    if (this.isLoading) {
      return false;
    }

    this.isLoading = true;
    this.onProgressCallback = onProgress;

    try {
      // Check for WebGPU support
      if (!navigator.gpu) {
        throw new Error('WebGPU is not supported in this browser. Please use Chrome 113+ or Edge 113+.');
      }

      const progressCallback = (progress) => {
        this.loadProgress = Math.round(progress.progress * 100);
        this.loadStatus = progress.text || 'Loading model...';

        if (this.onProgressCallback) {
          this.onProgressCallback({
            progress: this.loadProgress,
            status: this.loadStatus,
          });
        }
      };

      // Try primary model first, fallback to smaller model if needed
      try {
        this.engine = await webllm.CreateMLCEngine(MODEL_ID, {
          initProgressCallback: progressCallback,
        });
        this.currentModel = MODEL_ID;
      } catch (primaryError) {
        console.warn('Primary model failed, trying fallback:', primaryError);
        this.engine = await webllm.CreateMLCEngine(FALLBACK_MODEL_ID, {
          initProgressCallback: progressCallback,
        });
        this.currentModel = FALLBACK_MODEL_ID;
      }

      this.isReady = true;
      this.isLoading = false;
      return true;
    } catch (error) {
      this.isLoading = false;
      this.isReady = false;
      console.error('WebLLM initialization error:', error);
      throw error;
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
      throw new Error('WebLLM not initialized. Call initialize() first.');
    }

    const {
      maxTokens = 500,
      temperature = 0.7,
      topP = 0.9,
    } = options;

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

      return response.choices[0].message.content.trim();
    } catch (error) {
      console.error('Generation error:', error);
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

    return this.generate(prompt, { maxTokens: 200, temperature: 0.6 });
  }

  /**
   * Enhance work experience description
   */
  async enhanceExperience(experience) {
    const prompt = `Rewrite this work experience to be more concise and impactful. Use action verbs, quantify achievements where possible, and focus on results. Format as bullet points.

Current experience:
${experience}

Improved experience:`;

    return this.generate(prompt, { maxTokens: 600, temperature: 0.6 });
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

    return this.generate(prompt, { maxTokens: 200, temperature: 0.5 });
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

    return this.generate(prompt, { maxTokens: 150, temperature: 0.7 });
  }

  /**
   * Suggest additional relevant skills based on existing skills
   */
  async suggestSkills(currentSkills, targetRole = '') {
    const roleContext = targetRole ? ` for a ${targetRole} role` : '';
    const prompt = `Based on these existing skills, suggest 3-5 additional complementary technical skills that would strengthen a resume${roleContext}. Only suggest skills that commonly pair with these. Return as comma-separated list.

Current skills: ${currentSkills}

Suggested additional skills:`;

    return this.generate(prompt, { maxTokens: 100, temperature: 0.6 });
  }

  /**
   * Clean up and unload the model
   */
  async unload() {
    if (this.engine) {
      await this.engine.unload();
      this.engine = null;
      this.isReady = false;
      this.currentModel = null;
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
    };
  }
}

// Export singleton instance
export const webllmService = new WebLLMService();
export default webllmService;
