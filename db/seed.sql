-- Full demo seed data (9 records per table)
-- Assumes empty tables.

-- Users (bcrypt hash for "password")
INSERT INTO "User" ("email", "passwordHash", "role", "createdAt")
VALUES
  ('admin@hospital.com', '$2a$10$7EqJtq98hPqEX7fNZaFWoO5M4j1j39/58DeI8uQ2e1t6nGZB9dYlG', 'ADMIN', NOW()),
  ('doctor1@hospital.com', '$2a$10$7EqJtq98hPqEX7fNZaFWoO5M4j1j39/58DeI8uQ2e1t6nGZB9dYlG', 'DOCTOR', NOW()),
  ('doctor2@hospital.com', '$2a$10$7EqJtq98hPqEX7fNZaFWoO5M4j1j39/58DeI8uQ2e1t6nGZB9dYlG', 'DOCTOR', NOW()),
  ('nurse1@hospital.com', '$2a$10$7EqJtq98hPqEX7fNZaFWoO5M4j1j39/58DeI8uQ2e1t6nGZB9dYlG', 'NURSE', NOW()),
  ('nurse2@hospital.com', '$2a$10$7EqJtq98hPqEX7fNZaFWoO5M4j1j39/58DeI8uQ2e1t6nGZB9dYlG', 'NURSE', NOW()),
  ('nurse3@hospital.com', '$2a$10$7EqJtq98hPqEX7fNZaFWoO5M4j1j39/58DeI8uQ2e1t6nGZB9dYlG', 'NURSE', NOW()),
  ('staff1@hospital.com', '$2a$10$7EqJtq98hPqEX7fNZaFWoO5M4j1j39/58DeI8uQ2e1t6nGZB9dYlG', 'NURSE', NOW()),
  ('staff2@hospital.com', '$2a$10$7EqJtq98hPqEX7fNZaFWoO5M4j1j39/58DeI8uQ2e1t6nGZB9dYlG', 'NURSE', NOW()),
  ('staff3@hospital.com', '$2a$10$7EqJtq98hPqEX7fNZaFWoO5M4j1j39/58DeI8uQ2e1t6nGZB9dYlG', 'NURSE', NOW());

-- Patients
INSERT INTO "Patient" ("mrn", "firstName", "lastName", "dob", "gender", "phone", "address", "createdAt", "updatedAt")
VALUES
  ('MRN-1001', 'Asha', 'Verma', '1992-06-04', 'F', '555-0101', '12 Lakeview Rd', NOW(), NOW()),
  ('MRN-1002', 'Rohan', 'Mehta', '1987-11-19', 'M', '555-0102', '88 Pine Street', NOW(), NOW()),
  ('MRN-1003', 'Meera', 'Khan', '1979-02-08', 'F', '555-0103', '45 Hilltop Ave', NOW(), NOW()),
  ('MRN-1004', 'Arjun', 'Das', '1995-09-21', 'M', '555-0104', '9 Elm Court', NOW(), NOW()),
  ('MRN-1005', 'Nina', 'Patel', '1983-03-30', 'F', '555-0105', '77 River Lane', NOW(), NOW()),
  ('MRN-1006', 'Karan', 'Singh', '1990-12-12', 'M', '555-0106', '101 Maple Blvd', NOW(), NOW()),
  ('MRN-1007', 'Sara', 'Iyer', '1972-05-25', 'F', '555-0107', '6 Cedar Park', NOW(), NOW()),
  ('MRN-1008', 'Dev', 'Rao', '2001-07-17', 'M', '555-0108', '23 Orchard Way', NOW(), NOW()),
  ('MRN-1009', 'Priya', 'Shah', '1989-01-15', 'F', '555-0109', '50 Sunrise Dr', NOW(), NOW());

-- Admissions (one per patient)
INSERT INTO "Admission" ("patientId", "admittedAt", "diagnosis", "attendingPhysician")
VALUES
  ((SELECT id FROM "Patient" WHERE "mrn" = 'MRN-1001'), NOW() - INTERVAL '6 days', 'Pneumonia', 'Dr. Rao'),
  ((SELECT id FROM "Patient" WHERE "mrn" = 'MRN-1002'), NOW() - INTERVAL '4 days', 'Acute bronchitis', 'Dr. Mehta'),
  ((SELECT id FROM "Patient" WHERE "mrn" = 'MRN-1003'), NOW() - INTERVAL '3 days', 'Hypertension crisis', 'Dr. Khan'),
  ((SELECT id FROM "Patient" WHERE "mrn" = 'MRN-1004'), NOW() - INTERVAL '5 days', 'Appendicitis', 'Dr. Das'),
  ((SELECT id FROM "Patient" WHERE "mrn" = 'MRN-1005'), NOW() - INTERVAL '2 days', 'Diabetes management', 'Dr. Patel'),
  ((SELECT id FROM "Patient" WHERE "mrn" = 'MRN-1006'), NOW() - INTERVAL '7 days', 'Asthma exacerbation', 'Dr. Singh'),
  ((SELECT id FROM "Patient" WHERE "mrn" = 'MRN-1007'), NOW() - INTERVAL '1 days', 'UTI', 'Dr. Iyer'),
  ((SELECT id FROM "Patient" WHERE "mrn" = 'MRN-1008'), NOW() - INTERVAL '8 days', 'Minor fracture', 'Dr. Rao'),
  ((SELECT id FROM "Patient" WHERE "mrn" = 'MRN-1009'), NOW() - INTERVAL '9 days', 'Gastritis', 'Dr. Shah');

-- Discharge summaries (one per admission)
INSERT INTO "DischargeSummary" ("admissionId", "summaryText", "medications", "followUp", "aiSuggested", "createdAt")
VALUES
  ((SELECT id FROM "Admission" WHERE "diagnosis" = 'Pneumonia'),
   'Discharge Summary\n- Diagnosis: Pneumonia\n- Key findings: Improved oxygenation, stable vitals\n- Medications: Amoxicillin 500mg\n- Follow-up: Review in 2 weeks\n- Education: Hydration, rest',
   'Amoxicillin 500mg', 'Review in 2 weeks', true, NOW() - INTERVAL '1 day'),
  ((SELECT id FROM "Admission" WHERE "diagnosis" = 'Acute bronchitis'),
   'Discharge Summary\n- Diagnosis: Acute bronchitis\n- Key findings: No fever, cough improved\n- Medications: Azithromycin, cough syrup\n- Follow-up: Clinic visit in 1 week',
   'Azithromycin; cough syrup', 'Clinic visit in 1 week', true, NOW() - INTERVAL '1 day'),
  ((SELECT id FROM "Admission" WHERE "diagnosis" = 'Hypertension crisis'),
   'Discharge Summary\n- Diagnosis: Hypertension crisis\n- Key findings: BP controlled\n- Medications: Amlodipine\n- Follow-up: BP check in 3 days',
   'Amlodipine', 'BP check in 3 days', true, NOW() - INTERVAL '1 day'),
  ((SELECT id FROM "Admission" WHERE "diagnosis" = 'Appendicitis'),
   'Discharge Summary\n- Diagnosis: Appendicitis (post-op)\n- Key findings: Wound clean, pain controlled\n- Medications: Analgesics\n- Follow-up: Surgical review in 1 week',
   'Analgesics', 'Surgical review in 1 week', true, NOW() - INTERVAL '1 day'),
  ((SELECT id FROM "Admission" WHERE "diagnosis" = 'Diabetes management'),
   'Discharge Summary\n- Diagnosis: Diabetes management\n- Key findings: Glucose stable\n- Medications: Metformin\n- Follow-up: Endocrinology in 2 weeks',
   'Metformin', 'Endocrinology in 2 weeks', true, NOW() - INTERVAL '1 day'),
  ((SELECT id FROM "Admission" WHERE "diagnosis" = 'Asthma exacerbation'),
   'Discharge Summary\n- Diagnosis: Asthma exacerbation\n- Key findings: Improved peak flow\n- Medications: Inhaled bronchodilator\n- Follow-up: Pulmonary clinic in 2 weeks',
   'Inhaled bronchodilator', 'Pulmonary clinic in 2 weeks', true, NOW() - INTERVAL '1 day'),
  ((SELECT id FROM "Admission" WHERE "diagnosis" = 'UTI'),
   'Discharge Summary\n- Diagnosis: UTI\n- Key findings: Symptoms resolved\n- Medications: Nitrofurantoin\n- Follow-up: Primary care in 1 week',
   'Nitrofurantoin', 'Primary care in 1 week', true, NOW() - INTERVAL '1 day'),
  ((SELECT id FROM "Admission" WHERE "diagnosis" = 'Minor fracture'),
   'Discharge Summary\n- Diagnosis: Minor fracture\n- Key findings: Cast applied\n- Medications: Pain control\n- Follow-up: Ortho in 10 days',
   'Pain control', 'Ortho in 10 days', true, NOW() - INTERVAL '1 day'),
  ((SELECT id FROM "Admission" WHERE "diagnosis" = 'Gastritis'),
   'Discharge Summary\n- Diagnosis: Gastritis\n- Key findings: Symptoms improved\n- Medications: PPI\n- Follow-up: GI clinic in 2 weeks',
   'PPI', 'GI clinic in 2 weeks', true, NOW() - INTERVAL '1 day');

-- Lab reports (5 records)
INSERT INTO "LabReport" ("patientId", "testName", "result", "unit", "normalRange", "status", "collectedAt", "reportedAt", "createdAt")
VALUES
  ((SELECT id FROM "Patient" WHERE "mrn" = 'MRN-1001'), 'CBC', 'Normal', '', '4.5-11.0', 'COMPLETED', NOW() - INTERVAL '2 days', NOW() - INTERVAL '1 days', NOW()),
  ((SELECT id FROM "Patient" WHERE "mrn" = 'MRN-1002'), 'Blood Glucose', '145', 'mg/dL', '70-140', 'ABNORMAL', NOW() - INTERVAL '3 days', NOW() - INTERVAL '2 days', NOW()),
  ((SELECT id FROM "Patient" WHERE "mrn" = 'MRN-1003'), 'Lipid Panel', 'Borderline', '', '', 'COMPLETED', NOW() - INTERVAL '5 days', NOW() - INTERVAL '4 days', NOW()),
  ((SELECT id FROM "Patient" WHERE "mrn" = 'MRN-1004'), 'X-Ray', 'No fracture', '', '', 'COMPLETED', NOW() - INTERVAL '1 days', NOW() - INTERVAL '1 days', NOW()),
  ((SELECT id FROM "Patient" WHERE "mrn" = 'MRN-1005'), 'Urinalysis', 'Positive', '', '', 'ABNORMAL', NOW() - INTERVAL '2 days', NOW() - INTERVAL '1 days', NOW());
