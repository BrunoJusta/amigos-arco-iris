import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import './admin.css';

export const metadata = { title: 'Backoffice · Arco-Íris', robots: { index: false, follow: false } };

export default function LayoutAdmin({ children }) {
  return <div className={GeistSans.variable + ' ' + GeistMono.variable}>{children}</div>;
}
