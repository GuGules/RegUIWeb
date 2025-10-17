"use client";
import { useCheckSession } from "@/app/lib/ui/checkSession"
import { CustomMenubar } from "@/app/lib/menubar_items";
import 'primereact/resources/themes/lara-light-blue/theme.css'; // or another PrimeReact theme
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

export default function Home() {
  useCheckSession();
  return (
    <div>
      <CustomMenubar />
    </div>
  );
}
