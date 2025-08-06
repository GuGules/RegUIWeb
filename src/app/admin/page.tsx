"use client";

import { useState } from "react";

// Import des composants "fait maison"
import { useCheckSessionForAdmin } from "@/app/lib/ui/checkSession"
import { items, start, end } from "@/app/lib/menubar_items";

/* Import des composants PrimeReact */
import { Menubar } from "primereact/menubar";
import { TabView,TabPanel } from "primereact/tabview";
import { Dropdown } from 'primereact/dropdown';

export default function AdminPage(){

    const SMTPConfig = ()=>{
        return ( 
            <>
                <div></div>
            </>
        )
    }

    const mailOptions = [
        { name: 'SMTP', value: 'SMTP' },
        { name: 'Resend', value: 'Resend' }
    ];
    const [emailMode, setEmailMode] = useState<string>('');
    useCheckSessionForAdmin();

    return(
        <div>
            <Menubar model={items} start={start} end={end} />
            <div style={{height:'1rem'}}></div>
            <div className="ml-4 mr-4">
            <h1 className="text-2xl text-gray-950">Page de configuration</h1>
                <TabView> 
                    <TabPanel header="&nbsp;Globale" leftIcon="pi pi-cog">
                        
                    </TabPanel>
                    <TabPanel header="&nbsp;Envoi de mail" leftIcon="pi pi-envelope">
                        <label className="ml-2" htmlFor="emailModeSelector">Mode d'envoi de mail : {emailMode}</label>
                        <Dropdown id="emailModeSelector" value={emailMode} onChange={(e) => setEmailMode(e.value)} options={mailOptions} optionLabel="name" 
                        placeholder="Sélectionner un mode d'envoi de mail" className="w-full md:w-14rem" checkmark={true}  highlightOnSelect={false} />
                        <div style={{height:'1rem'}}></div>
                        {emailMode === 'SMTP' ? <SMTPConfig /> : null}
                        {emailMode === 'Resend' ? <div>Resend selected</div> : null}
                    </TabPanel>
                </TabView>
                
            </div>
        </div>
    )
}