"use client";
import { items, start, end } from "@/app/lib/menubar_items";

/* Import des composants PrimeReact */
import { Menubar } from "primereact/menubar";

export default function AdminPage(){
        
    return(
        <div>
            <Menubar model={items} start={start} end={end} />
        </div>
    )
}