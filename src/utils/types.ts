import { z } from "zod";

// Enums
export const InsuranceType = z.enum([
  "HEALTH", "AUTO", "HOME", "LIFE", "PROPERTY", "LIABILITY", "TRAVEL", "DISABILITY",
  "WORKERS_COMPENSATION", "CYBER", "MARINE", "AGRICULTURAL"
]);

export const ClaimStatus = z.enum([
  "SUBMITTED", "UNDER_REVIEW", "APPROVED", "DENIED", "PARTIALLY_APPROVED", "PENDING_ADDITIONAL_INFO", "ESCALATED"
]);

export const RiskLevel = z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]);
export const ClaimComplexity = z.enum(["SIMPLE", "MODERATE", "COMPLEX", "HIGHLY_COMPLEX"]);

// Schemas
export const InsurancePolicySchema = z.object({
  id: z.string(),
  policyNumber: z.string(),
  insuranceProvider: z.string(),
  policyType: InsuranceType,
  coverageStartDate: z.date(),
  coverageEndDate: z.date(),
  totalCoverageLimit: z.number(),
  annualPremium: z.number(),
  policyDetails: z.any().optional()
});

export const PolicyHolderSchema = z.object({
  id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  dateOfBirth: z.date(),
  contactInfo: z.any().optional()
});

export const RiskProfileSchema = z.object({
  id: z.string(),
  policyHolderId: z.string(),
  riskLevel: RiskLevel,
  riskFactors: z.any().optional(),
  historicalClaims: z.number().default(0),
  totalClaimAmount: z.number().default(0)
});

export const ClaimSchema = z.object({
  id: z.string(),
  policyHolderId: z.string(),
  policyId: z.string(),
  claimType: InsuranceType,
  status: ClaimStatus,
  submissionDate: z.date().default(new Date()),
  incidentDate: z.date(),
  estimatedLoss: z.number(),
  claimDetails: z.string().optional(),
  actualLoss: z.number().optional(),
  complexity: ClaimComplexity
});

export const AutoClaimDetailSchema = z.object({
  id: z.string(),
  claimId: z.string(),
  vehicleType: z.string(),
  damageDescription: z.string(),
  repairEstimate: z.number(),
  accidentLocation: z.string().optional(),
  policeReportNumber: z.string().optional(),
  otherPartyDetails: z.any().optional()
});

export const HomeClaimDetailSchema = z.object({
  id: z.string(),
  claimId: z.string(),
  propertyType: z.string(),
  damageType: z.string(),
  estimatedRepairCost: z.number(),
  causeOfDamage: z.string(),
  additionalDetails: z.any().optional()
});

export const HealthClaimDetailSchema = z.object({
  id: z.string(),
  claimId: z.string(),
  treatmentType: z.string(),
  medicalProvider: z.string(),
  diagnosisCode: z.string().optional(),
  treatmentCost: z.number(),
  coverageDetails: z.any().optional()
});

export const LiabilityClaimDetailSchema = z.object({
  id: z.string(),
  claimId: z.string(),
  incidentType: z.string(),
  thirdPartyDamage: z.number(),
  legalCosts: z.number().optional(),
  liabilityReason: z.string()
});

export const ClaimDocumentSchema = z.object({
  id: z.string(),
  claimId: z.string(),
  documentType: z.string(),
  documentPath: z.string(),
  uploadDate: z.date().default(new Date()),
  documentHash: z.string().optional()
});

export const ClaimAssessmentSchema = z.object({
  id: z.string(),
  claimId: z.string(),
  assessorName: z.string(),
  assessmentDate: z.coerce.date().default(new Date()),
  assessmentNotes: z.string().optional(),
  recommendedAction: ClaimStatus,
  additionalReview: z.boolean().default(false)
});

export const ContactInfoSchema = z.object({
  id: z.string(),
  policyHolderId: z.string().optional(),
  email: z.string().email(),
  phoneNumber: z.string(),
  address: z.string(),
  alternateContact: z.string().optional()
});


export type InsurancePolicy = z.infer<typeof InsurancePolicySchema>;
export type PolicyHolder = z.infer<typeof PolicyHolderSchema>;
export type RiskProfile = z.infer<typeof RiskProfileSchema>;
export type Claim = z.infer<typeof ClaimSchema>;
export type AutoClaimDetail = z.infer<typeof AutoClaimDetailSchema>;
export type HomeClaimDetail = z.infer<typeof HomeClaimDetailSchema>;
export type HealthClaimDetail = z.infer<typeof HealthClaimDetailSchema>;
export type LiabilityClaimDetail = z.infer<typeof LiabilityClaimDetailSchema>;
export type ClaimDocument = z.infer<typeof ClaimDocumentSchema>;
export type ClaimAssessment = z.infer<typeof ClaimAssessmentSchema>;
export type ContactInfo = z.infer<typeof ContactInfoSchema>;


const JsonDataSchema = z.object({
  userId: z.string(),
  message: z.string(),
});

const LLMResponseSchema = z.object({
    result: z.string(),
});

export type JsonDataSchema = z.infer<typeof JsonDataSchema>;

export { JsonDataSchema,  LLMResponseSchema };