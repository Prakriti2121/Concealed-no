import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login",
  description: "Login to ConcealedWines admin panel",
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
