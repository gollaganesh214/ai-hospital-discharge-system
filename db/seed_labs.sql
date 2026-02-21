-- Add 5 lab reports only
INSERT INTO "LabReport" ("patientId", "testName", "result", "unit", "normalRange", "status", "collectedAt", "reportedAt", "createdAt")
VALUES
  ((SELECT id FROM "Patient" WHERE "mrn" = 'MRN-1006'), 'HbA1c', '6.8', '%', '4.0-5.6', 'ABNORMAL', NOW() - INTERVAL '3 days', NOW() - INTERVAL '2 days', NOW()),
  ((SELECT id FROM "Patient" WHERE "mrn" = 'MRN-1007'), 'Creatinine', '0.9', 'mg/dL', '0.6-1.3', 'COMPLETED', NOW() - INTERVAL '2 days', NOW() - INTERVAL '1 days', NOW()),
  ((SELECT id FROM "Patient" WHERE "mrn" = 'MRN-1008'), 'Chest X-Ray', 'Clear', '', '', 'COMPLETED', NOW() - INTERVAL '4 days', NOW() - INTERVAL '3 days', NOW()),
  ((SELECT id FROM "Patient" WHERE "mrn" = 'MRN-1009'), 'TSH', '2.1', 'mIU/L', '0.4-4.0', 'COMPLETED', NOW() - INTERVAL '5 days', NOW() - INTERVAL '4 days', NOW()),
  ((SELECT id FROM "Patient" WHERE "mrn" = 'MRN-1005'), 'CRP', '12', 'mg/L', '0-10', 'ABNORMAL', NOW() - INTERVAL '1 days', NOW() - INTERVAL '1 days', NOW());
