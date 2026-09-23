import type { Request, Response, NextFunction } from "express";
import { urlService } from "../services/url.service";
import { shortenUrlSchema } from "../types";
import { env } from "../config/env";

export class UrlController {
  async shorten(req: Request, res: Response, next: NextFunction) {
    try {
      const input = shortenUrlSchema.parse(req.body);
      const url = await urlService.shorten(input);

      return res.status(201).json({
        shortCode: url.shortCode,
        shortUrl: `${req.protocol}://${req.get("host")}/${url.shortCode}`,
        originalUrl: url.originalUrl,
      });
    } catch (error) {
      if (error instanceof Error && error.message === "CUSTOM_CODE_TAKEN") {
        return res.status(409).json({ error: "Custom code is already taken" });
      }

      return next(error);
    }
  }

  async redirect(
    req: Request<{ code: string }>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { code } = req.params;
      const originalUrl = await urlService.getOriginalUrl(code);

      return res.redirect(originalUrl);
    } catch (error) {
      if (error instanceof Error && error.message === "URL_NOT_FOUND") {
        return res.status(404).json({ error: "URL not found" });
      }
      if (error instanceof Error && error.message === "URL_EXPIRED") {
        return res.status(410).json({ error: "URL has expired" });
      }
      return next(error);
    }
  }

  async stats(
    req: Request<{ code: string }>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { code } = req.params;
      const url = await urlService.getStats(code);

      return res.status(200).json({
        shortCode: url.shortCode,
        originalUrl: url.originalUrl,
        clicks: url.clicks,
        createdAt: url.createdAt,
        expiresAt: url.expiresAt,
      });
    } catch (error) {
      if (error instanceof Error && error.message === "URL_NOT_FOUND") {
        return res.status(404).json({ error: "URL not found" });
      }
      return next(error);
    }
  }
}

export const urlController = new UrlController();