// Mock TSX templates so Jest doesn't try to compile them
jest.mock("@/emails/forgot-password", () => ({
  __esModule: true,
  default: () => "<div>Mock Email</div>",
}));
