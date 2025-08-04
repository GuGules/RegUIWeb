"use client";
import { useCheckSession } from "@/app/lib/ui/checkSession"
import { items, start, end } from "@/app/lib/menubar_items";
import 'primereact/resources/themes/lara-light-blue/theme.css'; // or another PrimeReact theme
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
/* PrimeReact Components imports */
import { Menubar } from "primereact/menubar";

export default function Home() {
  useCheckSession();
  return (
    <div>
      <Menubar model={items} start={start} end={end} style={{ width: '100vw', borderRadius: 0 }} />
      
    </div>
  );
}
