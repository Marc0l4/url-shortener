import { prisma } from '../prisma/client';
import { generateCode } from '../utils/generateCode';;
import type { ShortenUrlInput } from '../types';

const MAX_GENERATION_ATTEMPTS = 5;

export class UrlService {
    async shorten(input: ShortenUrlInput) {
        const { originalUrl, customCode } = input;

        if (customCode) {
            const existing  = await prisma.url.findUnique({
                where: { shortCode: customCode },
          });

        if (existing) {
            throw new Error("CUSTOM_CODE_TAKEN");
        }

        return prisma.url.create({
            data: { originalUrl, shortCode: customCode },
        })
        }

        return this.createWithGeneratedCode(originalUrl);
    }

    private async createWithGeneratedCode(originalUrl: string) {
        for (let attempt = 0; attempt < MAX_GENERATION_ATTEMPTS; attempt++) {
            const shortCode = generateCode();

            try {
                return await prisma.url.create({
                    data: { originalUrl, shortCode },
                });
            } catch (error) {
                if (this.isUniqueConstraintViolation(error)) {
                    continue;
                }
                throw error;
            }
        }

        throw new Error("FAILED_TO_GENERATE_UNIQUE_CODE");
    }

    private isUniqueConstraintViolation(error: any): boolean {
        return (
            typeof error === "object" &&
            error !== null &&
            "code" in error &&
            (error as { code: string }).code === "P2002"
        );
    }

    async getOriginalUrl(shortCode: string) {
        const url = await prisma.url.findUnique({
            where: { shortCode },
        })

        if (!url) {
            throw new Error("URL_NOT_FOUND");
        }

        if (url.expiresAt && url.expiresAt < new Date()) {
            throw new Error("URL_EXPIRED");
        }
        
        await prisma.url.update({
            where: { shortCode },
            data: { clicks: { increment: 1 } },
        });

        return url.originalUrl;
    }

    async getStats(shortCode: string) {
        const url = await prisma.url.findUnique({
            where: { shortCode },
        });

        if (!url) {
            throw new Error("URL_NOT_FOUND");
        }

        return url;
    }
}

export const urlService = new UrlService();
