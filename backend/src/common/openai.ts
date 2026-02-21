import fetch from "node-fetch";

type DischargeInput = {
  patientName: string;
  mrn: string;
  diagnosis: string;
  keyFindings: string;
  medications: string;
  followUp: string;
  attendingPhysician: string;
};

function extractOutputText(response: any) {
  const outputs: string[] = [];
  const outputItems = Array.isArray(response?.output) ? response.output : [];
  for (const item of outputItems) {
    if (item?.type === "message" && Array.isArray(item.content)) {
      for (const part of item.content) {
        if (part?.type === "output_text" && typeof part.text === "string") {
          outputs.push(part.text);
        }
      }
    }
  }
  return outputs.join("\n").trim();
}

export async function generateDischargeSummary(input: DischargeInput) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return [
      "Discharge Summary",
      `- Patient: ${input.patientName} (MRN ${input.mrn})`,
      `- Final diagnosis: ${input.diagnosis}`,
      `- Key findings: ${input.keyFindings}`,
      `- Medications: ${input.medications}`,
      `- Follow-up: ${input.followUp}`,
      `- Attending physician: ${input.attendingPhysician}`
    ].join("\n");
  }

  const model = process.env.OPENAI_MODEL || "gpt-4o-mini";
  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model,
      input: [
        {
          role: "system",
          content:
            "You are a clinical documentation assistant. Write a clear discharge summary with these sections: Diagnosis, Key Findings, Medications, Follow-up. Use 4-7 bullet points total. Do not add medical advice."
        },
        {
          role: "user",
          content:
            `Patient: ${input.patientName} (MRN ${input.mrn}). ` +
            `Diagnosis: ${input.diagnosis}. Key findings: ${input.keyFindings}. ` +
            `Medications: ${input.medications}. Follow-up: ${input.followUp}. ` +
            `Attending physician: ${input.attendingPhysician}.`
        }
      ]
    })
  });

  if (!response.ok) {
    return [
      "Discharge Summary",
      `- Patient: ${input.patientName} (MRN ${input.mrn})`,
      `- Final diagnosis: ${input.diagnosis}`,
      `- Key findings: ${input.keyFindings}`,
      `- Medications: ${input.medications}`,
      `- Follow-up: ${input.followUp}`,
      `- Attending physician: ${input.attendingPhysician}`
    ].join("\n");
  }

  const data = await response.json();
  const text = extractOutputText(data);
  if (!text) {
    return [
      "Discharge Summary",
      `- Patient: ${input.patientName} (MRN ${input.mrn})`,
      `- Final diagnosis: ${input.diagnosis}`,
      `- Key findings: ${input.keyFindings}`,
      `- Medications: ${input.medications}`,
      `- Follow-up: ${input.followUp}`,
      `- Attending physician: ${input.attendingPhysician}`
    ].join("\n");
  }
  return text;
}
