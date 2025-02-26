export interface Client {
    id: number;
    companyName: string | null;
    resortName: string;
    gstTinNo: string | null;
    itContact: string | null;
    designation: string | null;
    resortContact: string | null;
    mobileNo: string | null;
    email: string | null;
    atoll: string | null;
    maleOfficeAddress: string | null;
    createdAt: Date;
    updatedAt: Date;
  }
  
  export interface ClientFormData {
    companyName?: string;
    resortName: string;
    gstTinNo?: string;
    itContact?: string;
    designation?: string;
    resortContact?: string;
    mobileNo?: string;
    email?: string;
    atoll?: string;
    maleOfficeAddress?: string;
  }