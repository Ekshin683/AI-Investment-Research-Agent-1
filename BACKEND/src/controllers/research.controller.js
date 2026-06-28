// src/controllers/research.controller.js
// Handles HTTP requests and responses for research endpoints

import Research from "../models/Research.model.js";
import { runResearchService } from "../services/research.service.js";

// ── POST /api/research ────────────────────────────────────────────────
// Starts a new investment research job
export const startResearch = async (req, res, next) => {
  try {
    const { companyName } = req.body;

    console.log(`\n🚀 Starting research for: ${companyName}`);

    // Create initial record in MongoDB
    const research = await Research.create({
      companyName,
      status:    "running",
      startedAt: new Date(),
    });

    // Send immediate response with the research ID
    // Frontend can use this ID to poll for results
    res.status(202).json({
      success:    true,
      message:    "Research started",
      researchId: research._id,
      status:     "running",
    });

    // Run the agent in background (non-blocking)
    runResearchService(companyName)
      .then(async (result) => {
        // Update MongoDB with full results
        await Research.findByIdAndUpdate(research._id, {
          ...result,
          status:      "completed",
          completedAt: new Date(),
        });
        console.log(`✅ Research completed for: ${companyName}`);
      })
      .catch(async (error) => {
        // Update MongoDB with error status
        await Research.findByIdAndUpdate(research._id, {
          status: "failed",
          errors: [{ message: error.message }],
        });
        console.error(`❌ Research failed for: ${companyName}`, error.message);
      });

  } catch (error) {
    next(error);
  }
};

// ── GET /api/research/:id ─────────────────────────────────────────────
// Polls for research result by ID
export const getResearchById = async (req, res, next) => {
  try {
    const research = await Research.findById(req.params.id);

    if (!research) {
      return res.status(404).json({
        success: false,
        message: "Research not found",
      });
    }

    res.status(200).json({
      success: true,
      data:    research,
    });
  } catch (error) {
    next(error);
  }
};

// ── GET /api/research ─────────────────────────────────────────────────
// Returns all past research results (history)
export const getAllResearch = async (req, res, next) => {
  try {
    const researches = await Research.find()
      .sort({ createdAt: -1 })  // newest first
      .limit(20)
      .select("companyName ticker verdict confidenceScore status createdAt");

    res.status(200).json({
      success: true,
      count:   researches.length,
      data:    researches,
    });
  } catch (error) {
    next(error);
  }
};

// ── DELETE /api/research/:id ──────────────────────────────────────────
// Deletes a research record
export const deleteResearch = async (req, res, next) => {
  try {
    const research = await Research.findByIdAndDelete(req.params.id);

    if (!research) {
      return res.status(404).json({
        success: false,
        message: "Research not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Research deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// ── POST /api/research/chat ───────────────────────────────────────────
// AI Analyst chatbot using Groq
export const chatWithAnalyst = async (req, res, next) => {
  try {
    const { message, researchContext } = req.body;

    if (!message) {
      return res.status(400).json({ success: false, message: "Message is required" });
    }

    const Groq   = (await import("groq-sdk")).default;
    const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

    const systemPrompt = `You are Terminal AI, an expert investment research analyst.
You have access to this research data:
${researchContext || "No research data available."}
Answer concisely as a senior financial analyst. Under 150 words unless detail needed.`;

    const completion = await client.chat.completions.create({
      model:    "llama-3.3-70b-versatile",
      messages: [
        { role: "system",  content: systemPrompt },
        { role: "user",    content: message      },
      ],
      max_tokens: 300,
    });

    const reply = completion.choices[0]?.message?.content || "Could not generate response.";

    res.status(200).json({ success: true, reply });

  } catch (error) {
    console.error("Chat error:", error.message);
    next(error);
  }
};