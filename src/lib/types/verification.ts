/** Verification status returned by /bff/verificacao. */
export interface VerificationStatus {
  emailVerified: boolean;
  phoneVerified: boolean;
  credits: number;
}
