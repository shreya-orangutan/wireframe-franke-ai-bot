import { z } from "zod"

// Document Purpose Enum
export const DocumentPurpose = {
  TRAINING: "training",
  REFERENCE: "reference",
  COMPLIANCE: "compliance",
  GUIDELINES: "guidelines",
  TECHNICAL: "technical",
} as const

export type DocumentPurposeType = (typeof DocumentPurpose)[keyof typeof DocumentPurpose]

// Product Schema
export const productSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Product name is required"),
  description: z.string().min(1, "Description is required"),
  country: z.string().min(1, "Country is required"),
  region: z.string().min(1, "Region is required"),
  createdAt: z.string(),
})

export type Product = z.infer<typeof productSchema>

// Document Schema
export const documentSchema = z.object({
  id: z.string(),
  productId: z.string(),
  name: z.string(),
  purpose: z.enum([
    DocumentPurpose.TRAINING,
    DocumentPurpose.REFERENCE,
    DocumentPurpose.COMPLIANCE,
    DocumentPurpose.GUIDELINES,
    DocumentPurpose.TECHNICAL,
  ]),
  fileType: z.enum(["pdf", "docx"]),
  uploadedAt: z.string(),
})

export type Document = z.infer<typeof documentSchema>

// File Upload Schema
export const fileUploadSchema = z.object({
  file: z.instanceof(File).refine((file) => {
    return ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"].includes(
      file.type,
    )
  }, "Only PDF and DOCX files are allowed"),
})

// Upload Form Schema
export const uploadFormSchema = z.object({
  productName: z.string().min(1, "Product name is required"),
  description: z.string().min(1, "Description is required"),
  country: z.string().min(1, "Country is required"),
  region: z.string().min(1, "Region is required"),
  purpose: z.enum([
    DocumentPurpose.TRAINING,
    DocumentPurpose.REFERENCE,
    DocumentPurpose.COMPLIANCE,
    DocumentPurpose.GUIDELINES,
    DocumentPurpose.TECHNICAL,
  ]),
  files: z
    .array(fileUploadSchema)
    .min(1, "At least one document is required")
    .max(10, "Maximum 10 documents per purpose"),
})

export type UploadFormData = z.infer<typeof uploadFormSchema>

// Session Schema
export const sessionSchema = z.object({
  id: z.string(),
  productId: z.string(),
  productName: z.string(),
  videoWatched: z.boolean(),
  guidelinesAccepted: z.boolean(),
  messages: z.array(
    z.object({
      id: z.string(),
      role: z.enum(["user", "assistant"]),
      content: z.string(),
      timestamp: z.string(),
    }),
  ),
  status: z.enum(["in-progress", "completed", "incomplete"]),
  startedAt: z.string(),
  lastAccessedAt: z.string(), // Added lastAccessedAt field
  completedAt: z.string().optional(),
})

export type Session = z.infer<typeof sessionSchema>

// UI Preferences Schema
export const uiPreferencesSchema = z.object({
  uiLanguage: z.enum(["en", "es", "fr", "de", "zh"]),
  chatbotLanguage: z.enum(["en", "es", "fr", "de", "zh"]),
  theme: z.enum(["light", "dark"]),
  notifications: z.boolean(),
  chatVerbosity: z.enum(["short", "detailed"]),
  enableCitations: z.boolean(),
})

export type UIPreferences = z.infer<typeof uiPreferencesSchema>

// User Profile Schema
export const userProfileSchema = z.object({
  fullName: z.string(),
  email: z.string().email(),
  role: z.string(),
  dateJoined: z.string(),
  assignedCountry: z.string(),
  assignedRegion: z.string(),
  lastLogin: z.string(),
})

export type UserProfile = z.infer<typeof userProfileSchema>

// User Schema for sub-admin management
export const userSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["Trainer", "Trainee", "Sub-Admin"]),
  contactNumber: z.string(),
  country: z.string(),
  region: z.string(),
  isLocked: z.boolean().default(false),
  lastLogin: z.string().optional(),
  preferredTheme: z.enum(["light", "dark"]).default("light"),
  preferredLanguage: z.enum(["English", "Hindi", "Kannada", "Bengali"]),
  preferredRegion: z.string(),
  createdBy: z.string(),
  isActive: z.boolean().default(true),
  userType: z.string(),
  reportingManager: z.string().optional(),
  joiningDate: z.string(),
  isUserVerified: z.boolean().default(false),
  department: z.string(),
  employeeCode: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export type User = z.infer<typeof userSchema>
