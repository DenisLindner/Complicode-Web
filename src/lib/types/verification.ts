/** Verification status returned by /bff/verification. */
export interface VerificationStatus {
  emailVerified: boolean;
  phoneVerified: boolean;
  credits: number;
}
