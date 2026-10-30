DELETE FROM "StaffService" AS duplicate
USING "StaffService" AS existing
WHERE duplicate."staffId" = existing."staffId"
  AND duplicate."serviceId" = existing."serviceId"
  AND duplicate."id" > existing."id";

CREATE UNIQUE INDEX "StaffService_staffId_serviceId_key"
ON "StaffService"("staffId", "serviceId");
