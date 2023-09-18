export const MSIGNIN = `
mutation SignInMutation($input: signInInput!) {
  signIn(input: $input) {
    currentUser {
      slug
      jwtToken(aud: "Statistics_API") {
        token
        expiredAt
      }
    }
    otpSessionChallenge
    errors {
      message
    }
  }
}
`;