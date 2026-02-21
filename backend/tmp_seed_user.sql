INSERT INTO "User" ("email", "passwordHash", "role")
VALUES ('admin@hospital.local', '$2a$10$CdSCFNx55gCr1DFrlsAi2.oT.185pRJAitfhzFz49Pyv0hsosg9My', 'ADMIN')
ON CONFLICT ("email") DO NOTHING;
