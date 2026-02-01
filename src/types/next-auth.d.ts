import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "GARDEN";
      name?: string | null;
      email?: string | null;
    };
  }
}
