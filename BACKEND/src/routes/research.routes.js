import express from "express";
import {
  startResearch,
  getResearchById,
  getAllResearch,
  deleteResearch,
} from "../controllers/research.controller.js";
import { chatWithAnalyst } from "../controllers/research.controller.js";
import { validateResearchInput } from "../middleware/validateInput.middleware.js";

const router = express.Router();

router.post(  "/",        validateResearchInput, startResearch);
router.get(   "/",        getAllResearch);
router.get(   "/:id",     getResearchById);
router.delete("/:id",     deleteResearch);
router.post(  "/chat",    chatWithAnalyst);

export default router;