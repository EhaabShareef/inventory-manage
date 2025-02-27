import { z } from "zod"

export const clientSchema = z.object({
  companyName: z.string().nullable(),
  resortName: z.string().min(1, "Resort name is required"),
  gstTinNo: z.string().nullable(),
  itContact: z.string().nullable(),
  designation: z.string().nullable(),
  resortContact: z.string().nullable(),
  mobileNo: z.string().nullable(),
  email: z.string().email("Invalid email address").nullable(),
  atoll: z.string().nullable(),
  maleOfficeAddress: z.string().nullable(),
})

export type ClientFormData = z.infer<typeof clientSchema>