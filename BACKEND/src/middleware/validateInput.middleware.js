// src/middleware/validateInput.middleware.js
// Validates and sanitizes incoming request data

import { body, validationResult } from "express-validator";

// ── Validation rules for research request ────────────────────────────
export const validateResearchInput = [
  body("companyName")
    .trim()
    .notEmpty()
    .withMessage("Company name is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("Company name must be between 2 and 100 characters")
    .escape(),

  // Middleware to check validation results
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors:  errors.array(),
      });
    }
    next();
  },
];