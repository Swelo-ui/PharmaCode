import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Portal Console · PharmaCode',
  robots: {
    index: false,
    follow: false,
    noarchive: true,
    nosnippet: true,
  },
};

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
