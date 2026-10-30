DELETE FROM "WorkingHours" AS duplicate
USING "WorkingHours" AS existing
WHERE duplicate."staffId" = existing."staffId"
  AND duplicate."dayOfWeek" = existing."dayOfWeek"
  AND duplicate."id" > existing."id";

CREATE UNIQUE INDEX "WorkingHours_staffId_dayOfWeek_key"
ON "WorkingHours"("staffId", "dayOfWeek");
