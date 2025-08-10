"use client";

import { useState } from "react";

// Import des composants "fait maison"
import { useCheckSessionForAdmin } from "@/app/lib/ui/checkSession"
import { items, start, end } from "@/app/lib/menubar_items";

/* Import des composants PrimeReact */
import { Menubar } from "primereact/menubar";
import { TabView,TabPanel } from "primereact/tabview";
import { Dropdown } from 'primereact/dropdown';
import { InputText } from "primereact/inputtext";
import { FloatLabel } from "primereact/floatlabel";
import { InputSwitch } from "primereact/inputswitch";
import { Button } from "primereact/button";

export default function AdminPage(){

    const mailOptions = [
        { name: 'SMTP', value: 'SMTP' },
        { name: 'Resend', value: 'Resend' }
    ];
    const [emailMode, setEmailMode] = useState<string>('');
    const [smtpHost, setSmtpHost] = useState<string>('');
    const [smtpPort, setSmtpPort] = useState<string>('');
    const [smtpUser, setSmtpUser] = useState<string>('');
    const [smtpPassword, setSmtpPassword] = useState<string>('');
    // Pour le switch, on utilise un boolean
    const [smtpSecure, setSmtpSecure] = useState<boolean>(false);

    const SMTPConfig = ()=>{
        return ( 
            <>
                <div style={{height:'1rem'}}></div>
                <FloatLabel>
                    <label htmlFor="smtpHost">Hote SMTP</label>
                    <InputText id="smtpHost" value={smtpHost} style={{width:'100%'}} onChange={(e) => setSmtpHost(e.target.value)} />
                </FloatLabel>
                <div style={{height:'1.3rem'}}></div>
                <FloatLabel>
                    <label htmlFor="smtpPort">Port SMTP</label>
                    <InputText id="smtpPort" value={smtpPort} style={{width:'100%'}} onChange={(e) => setSmtpPort(e.target.value)} />
                </FloatLabel>
                <div style={{height:'1.3rem'}}></div>
                <FloatLabel>
                    <label htmlFor="smtpUser">Utilisateur</label>
                    <InputText id="smtpUser" value={smtpUser} style={{width:'100%'}} onChange={(e) => setSmtpUser(e.target.value)} />
                </FloatLabel>
                <div style={{height:'1.3rem'}}></div>
                <FloatLabel>
                    <label htmlFor="smtpPassword">Mot de passe</label>
                    <InputText id="smtpPassword" value={smtpPassword} style={{width:'100%'}} onChange={(e) => setSmtpPassword(e.target.value)} />
                </FloatLabel>
                <div style={{height:'1.3rem'}}></div>
                <label htmlFor="smtpSecure">Connexion sécurisée : &nbsp;</label>
                <InputSwitch checked={smtpSecure} onChange={(e) => setSmtpSecure(e.value)} />
                <div style={{height:'1.3rem'}}></div>
                <Button label="Tester la connexion" icon="pi pi-check" onClick={() => {}} />&nbsp;
                <Button label="Enregistrer la configuration" icon="pi pi-save" onClick={() => {}} />
            </>
        )
    }

    const ResendConfig = ()=> {
        return (
            <>
            Comes Later
            </>
        )
    }

    useCheckSessionForAdmin();

    return(
        <div>
            <Menubar model={items} start={start} end={end} />
            <div style={{height:'1rem'}}></div>
            <div className="ml-4 mr-4">
            <h1 className="text-2xl text-gray-950">Page de configuration</h1>
                <TabView> 
                    <TabPanel header="&nbsp;Globale" leftIcon="pi pi-cog">
                        <p>Comes later</p>
                    </TabPanel>
                    <TabPanel header="&nbsp;Envoi de mail" leftIcon="pi pi-envelope">
                        <label className="ml-2" htmlFor="emailModeSelector">Mode d&apos;envoi de mail : {emailMode}</label>
                        <Dropdown id="emailModeSelector" value={emailMode} onChange={(e) => setEmailMode(e.value)} options={mailOptions} optionLabel="name" 
                        placeholder="Sélectionner un mode d'envoi de mail" className="w-full md:w-14rem" checkmark={true}  highlightOnSelect={false} />
                        <div style={{height:'1rem'}}></div>
                        {emailMode === 'SMTP' ? <SMTPConfig /> : null}
                        {emailMode === 'Resend' ? <ResendConfig /> : null}
                    </TabPanel>
                </TabView>
                
            </div>
        </div>
    )
}