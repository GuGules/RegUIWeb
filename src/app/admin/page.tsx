"use client";

import { useState, useEffect, useRef } from "react";

// Import des composants "fait maison"
import { useCheckSessionForAdmin } from "@/app/lib/ui/checkSession"
import { CustomMenubar } from "@/app/lib/menubar_items";

/* Import des composants PrimeReact */
import { TabView,TabPanel } from "primereact/tabview";
import { Dropdown } from 'primereact/dropdown';
import { InputText } from "primereact/inputtext";
import { FloatLabel } from "primereact/floatlabel";
import { InputSwitch } from "primereact/inputswitch";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Checkbox } from 'primereact/checkbox';
import { Toast } from "primereact/toast";
import { useRouter } from "next/navigation";

export default function AdminPage(){

    const mailOptions = [
        { name: 'SMTP', value: 'SMTP' },
        { name: 'Resend', value: 'Resend' }
    ];

    const router = useRouter();
    const [newRegistryName, setNewRegistryName] = useState<string>('');
    const [newRegistryURL, setNewRegistryURL] = useState<string>('');
    const [newRegistryDescription, setNewRegistryDescription] = useState<string>('');
    const [newRegistryIsPublic, setNewRegistryIsPublic] = useState<boolean>(false);
    const [registries, setRegistries] = useState<Array<any>>([]);
    const [emailMode, setEmailMode] = useState<string>('');
    const [addRegModalVisible, setAddRegModalVisible] = useState<boolean>(false);
    const [smtpHost, setSmtpHost] = useState<string>('');
    const [smtpPort, setSmtpPort] = useState<string>('');
    const [smtpUser, setSmtpUser] = useState<string>('');
    const [smtpPassword, setSmtpPassword] = useState<string>('');
    const errorAlert = useRef(null);
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

    const handleCreateRegistry = async () => {
        try {
            const response = await fetch('/api/admin/registries/add', {
                method: 'POST',
                body:
                    JSON.stringify({
                        name: newRegistryName,
                        url: newRegistryURL,
                        description: newRegistryDescription,
                        isPublic: newRegistryIsPublic
                    }),
            });
            if (response.ok) {
                // Reset form fields
                setNewRegistryName('');
                setNewRegistryURL('');
                setNewRegistryDescription('');
                setNewRegistryIsPublic(false);
                setRegistries((await response.json()).registries);
                errorAlert.current.show({ severity: 'success', summary: 'Succès', detail: 'Le registre a été créé avec succès.' });
            } else {
                errorAlert.current.show({ severity: 'error', summary: 'Erreur', detail: 'Une erreur est survenue lors de la création du registre.' });
            }
        } catch (error) {
            console.error('Error creating registry:', error);
            errorAlert.current.show({ severity: 'error', summary: 'Erreur', detail: 'Une erreur est survenue lors de la création du registre.' });
        } finally {
            setAddRegModalVisible(false);
        }
    }

    const handleDeleteRegistry = async (registryId: number) => {
        if (!confirm("Êtes-vous sûr de vouloir supprimer ce registre ? Cette action est irréversible.")) {
            return;
        }
        try {
            const response = await fetch(`/api/admin/registries/${registryId}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                setRegistries(registries.filter(registry => registry.id !== registryId));
                errorAlert.current.show({ severity: 'success', summary: 'Succès', detail: 'Le registre a été supprimé avec succès.' });
            }
            else {
                errorAlert.current.show({ severity: 'error', summary: 'Erreur', detail: 'Une erreur est survenue lors de la suppression du registre.' });
            }
        } catch (error) {
            console.error('Error deleting registry:', error);
            errorAlert.current.show({ severity: 'error', summary: 'Erreur', detail: 'Une erreur est survenue lors de la suppression du registre.' });
        }
    }
    // Template pour la colonne Actions
    const actionsBodyTemplate = (rowData: { id: number }) => (
        <div>
            <Button
                icon="pi pi-trash"
                className="p-button-rounded p-button-text p-button-info mr-2"
                style={{ color: 'red' }}
                title="Supprimer le registre"
                onClick={() => handleDeleteRegistry(rowData.id)}
            />
        </div>
    );


    const ResendConfig = ()=> {
        return (
            <>
            Comes Later
            </>
        )
    }

    useCheckSessionForAdmin();

    useEffect(()=>{
        const fetchData = async () => {
            const response = await fetch('/api/registries/list');
            const data = await response.json();
            setRegistries(data);
        };
        fetchData();
    }, []);

    return(
        <div>
            <CustomMenubar />
            <div style={{height:'1rem'}}></div>
            <div className="ml-4 mr-4">
            <h1 className="text-2xl text-gray-950">Page de configuration</h1>
                <Toast ref={errorAlert} position="bottom-right" />
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
                    <TabPanel header="&nbsp;Registres Connectés" leftIcon="pi pi-link">
                        <Button onClick={() => setAddRegModalVisible(true)}>Ajouter un registre</Button>
                        <div style={{height:'1rem'}}></div>
                        <Dialog header="Enregistrer un nouveau registre" visible={addRegModalVisible} style={{ width: '50vw' }} onHide={() => {if (!addRegModalVisible) return; setAddRegModalVisible(false); }}>
                            <div className="p-fluid">
                                <InputText value={newRegistryName} placeholder="Nom" onChange={(e) => setNewRegistryName(e.target.value)} />
                                <div style={{height:'1rem'}}></div>
                                <InputText value={newRegistryURL} placeholder="URL" onChange={(e) => setNewRegistryURL(e.target.value)} />
                                <div style={{height:'1rem'}}></div>
                                <InputText value={newRegistryDescription} placeholder="Description" onChange={(e) => setNewRegistryDescription(e.target.value)} />
                                <div style={{height:'1rem'}}></div>
                                <Checkbox inputId="newRegistryIsPublic" checked={newRegistryIsPublic} onChange={ (e) => setNewRegistryIsPublic(e.checked ?? false)}/>
                                <label htmlFor="newRegistryIsPublic" className="ml-2">Registre Publique</label>
                                <div style={{height:'1rem'}}></div>
                                <Button label="Enregistrer" icon="pi pi-save" onClick={handleCreateRegistry} />
                            </div>
                        </Dialog>
                        <DataTable value={registries} tableStyle={{ minWidth: '50rem' }}>
                            <Column field="nom" header="Nom"></Column>
                            <Column field="url" header="URL"></Column>
                            <Column field="description" header="Description"></Column>
                            <Column field="is_public" header="Est Publique"></Column>
                            <Column header="Actions" body={actionsBodyTemplate} />
                        </DataTable>
                    </TabPanel>
                </TabView>
                
            </div>
        </div>
    )
}