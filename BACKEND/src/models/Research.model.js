// src/models/Research.model.js
// Mongoose schema for saving research results to MongoDB

import mongoose from "mongoose";

const ResearchSchema = new mongoose.Schema(
  {
    // Input
    companyName: {
      type:     String,
      required: true,
      trim:     true,
    },

    // Company info from Node 1
    ticker: {
      type:    String,
      default: "UNKNOWN",
    },
    companyProfile: {
      type:    mongoose.Schema.Types.Mixed,
      default: null,
    },

    // Scores from each node
    financialScore: { type: Number, default: 0 },
    newsScore:      { type: Number, default: 0 },
    sentimentScore: { type: Number, default: 0 },
    riskScore:      { type: Number, default: 0 },

    // Financial data from Node 2
    financialData: {
      type:    mongoose.Schema.Types.Mixed,
      default: null,
    },

    // News from Node 3
    recentNews: {
      type:    [mongoose.Schema.Types.Mixed],
      default: [],
    },

    // Sentiment from Node 4
    sentimentResult: {
      type:    mongoose.Schema.Types.Mixed,
      default: null,
    },

    // Risk from Node 5
    riskFactors: {
      type:    [mongoose.Schema.Types.Mixed],
      default: [],
    },
    moatAnalysis: {
      type:    String,
      default: "",
    },

    // Final verdict from Node 6
    verdict: {
      type: String,
      enum: ["INVEST", "PASS", "HOLD", ""],
      default: "",
    },
    confidenceScore: { type: Number, default: 0 },
    reasoning:       { type: String, default: "" },
    summary:         { type: String, default: "" },

    // Agent steps log
    steps:  { type: [mongoose.Schema.Types.Mixed], default: [] },
    errors: { type: [mongoose.Schema.Types.Mixed], default: [] },

    // Timestamps
    startedAt:   { type: Date, default: null },
    completedAt: { type: Date, default: null },

    // Status
    status: {
      type:    String,
      enum:    ["pending", "running", "completed", "failed"],
      default: "pending",
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt automatically
  }
);

const Research = mongoose.model("Research", ResearchSchema);
export default Research;