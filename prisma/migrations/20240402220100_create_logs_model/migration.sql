-- CreateTable
CREATE TABLE "scraper_logs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "scraper_status" TEXT NOT NULL,
    "uc" TEXT NOT NULL,
    "mes_ref" TEXT NOT NULL,
    "distribuidora" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
