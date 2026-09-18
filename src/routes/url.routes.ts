import { Router } from 'express';
import { urlController } from '../controllers/url.controller';

const router = Router();


router.post("/api/shorten", (req, res, next) => urlController.shorten(req, res, next));
router.get("/api/stats/:code", (req, res, next) => urlController.stats(req, res, next));
router.get("/:code", (req, res, next) => urlController.redirect(req, res, next));

export { router as urlRoutes };