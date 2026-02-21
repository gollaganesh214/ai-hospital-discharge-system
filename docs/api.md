# API

Base URL: `http://localhost:4000/api`

## GET /health

Returns `{ status: "ok" }`

## POST /auth/bootstrap

Creates the first admin user if no users exist.

Payload:
```
{
  "email": "admin@hospital.local",
  "password": "admin123"
}
```

## POST /auth/login

Payload:
```
{
  "email": "admin@hospital.local",
  "password": "admin123"
}
```

## POST /auth/register

Payload:
```
{
  "email": "nurse@hospital.local",
  "password": "secret123"
}
```

## POST /auth/forgot

Payload:
```
{
  "email": "user@hospital.local"
}
```

## GET /reports/summary

Admin/Doctor only. Returns counts for dashboard.

## GET /users

Admin only. List users.

## PATCH /users/:id/role

Admin only. Update a user's role.

## GET /patients

Returns list of patients.

Query:
```
?page=1&limit=20
```

## POST /patients

Create a patient.

Payload:
```
{
  "mrn": "MRN-1001",
  "firstName": "Asha",
  "lastName": "Verma",
  "dob": "1992-06-04",
  "gender": "F"
}
```

## GET /admissions

Query:
```
?page=1&limit=20
```

## GET /labs

Query:
```
?page=1&limit=20
```

## POST /labs

Payload:
```
{
  "patientId": 1,
  "testName": "CBC",
  "result": "Normal",
  "unit": "",
  "normalRange": "",
  "status": "COMPLETED"
}
```

## PATCH /labs/:id

Update a lab report.

## DELETE /labs/:id

Delete a lab report.

## GET /discharges

Query:
```
?page=1&limit=20
```

## POST /discharges

Create a discharge summary for an admission.

Payload:
```
{
  "admissionId": 1,
  "finalDiagnosis": "Pneumonia",
  "keyFindings": "Improved vitals, stable",
  "medications": "Amoxicillin 500mg",
  "followUp": "Review in 2 weeks"
}
```
