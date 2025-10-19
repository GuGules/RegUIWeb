"use client";
// Framework Imports
import { Accordion, AccordionTab } from 'primereact/accordion';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { ContextMenu } from "primereact/contextmenu";
import { confirmPopup, ConfirmPopup } from "primereact/confirmpopup";
import { Dialog } from "primereact/dialog";
import { Editor } from 'primereact/editor';
import { ListBox } from 'primereact/listbox';
import { Toast } from "primereact/toast";
import { TabView, TabPanel } from 'primereact/tabview';
import { SyntheticEvent, useEffect, useRef, useState, MouseEvent } from "react";
// Custom Imports
import { CustomMenubar } from "@/app/lib/menubar_items";
import { MarkupInterpretor } from '@/app/lib/ui/components/markdownInterpretor';

export default function Page(props: unknown) {
    const { params } = props as { params: { registryId: string; repoName: string } };
    const { registryId, repoName } = params;
    const [imageName, setImageName] = useState(repoName);
    const [description, setDescription] = useState("");
    const [tags, setTags] = useState<string[]>([]);
    const [dialogIsVisible, setDialogIsVisible] = useState(false);
    const [selectedTag, setSelectedTag] = useState<string>("");
    const [editedDescription, setEditedDescription] = useState<string>("");
    const cm = useRef(null);
    const toasts = useRef(null);

    const onRightClick = (event: SyntheticEvent) => {
        if (cm.current) {
            (cm.current as ContextMenu).show(event);
        }
    }

    const saveDescription = async () => {
        const response = await fetch(`/api/registries/${registryId}/repositories/${repoName}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ description: editedDescription, creationMode: description == "" ? true : false })
        });

        if (response.ok) {
            setDescription(editedDescription);
            if (toasts.current) {
                (toasts.current as Toast).show({ severity: 'success', summary: 'Succès', detail: 'Description enregistrée avec succès', life: 3000 });
            }
        } else {
            if (toasts.current) {
                (toasts.current as Toast).show({ severity: 'error', summary: 'Erreur', detail: 'Erreur lors de l\'enregistrement de la description', life: 3000 });
            }
        }
    }

    const items = [
        {
            label: "Copier commande pull",
            icon: "pi pi-copy",
            command: () => {
                if (selectedTag == "") {
                    if (toasts.current) {
                        (toasts.current as Toast).show({ severity: 'warn', summary: 'Avertissement', detail: 'Veuillez sélectionner un tag avant de copier la commande', life: 3000 });
                    }
                } else {
                    navigator.clipboard.writeText(`docker pull ${imageName}:${selectedTag}`);
                    if (toasts.current) {
                        (toasts.current as Toast).show({ severity: 'success', summary: 'Succès', detail: 'Commande docker pull copiée dans le presse-papier', life: 3000 });
                    }
                }
            }
        },
        {
            label: 'Supprimer le tag',
            icon: 'pi pi-trash',
            command: () => { console.log(selectedTag); }
        },
    ];
    const accept = () => {
        if (toasts.current){
            (toasts.current as Toast).show({ severity: 'info', summary: 'Confirmed', detail: 'You have accepted', life: 3000 });
        }
    };

    const reject = () => {
        if (toasts.current){
            (toasts.current as Toast).show({ severity: 'warn', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
        }
    };

    const confirmationSuppression = (event: MouseEvent<HTMLElement>) => {
        confirmPopup({
            target: event.currentTarget,
            message: 'Cette action est irréversible. Voulez-vous procéder?',
            icon: 'pi pi-exclamation-triangle',
            rejectIcon: 'pi pi-times',
            acceptIcon: 'pi pi-check',
            defaultFocus: 'reject',
            acceptClassName: 'p-button-danger',
            acceptLabel: "Procéder",
            rejectLabel: "Annuler",
            accept,
            reject
        });
    };

    useEffect(() => {
        const fetchData = async () => {
            const resp = await fetch(`/api/registries/${registryId}/repositories/${repoName}`);
            const data = await resp.json();
            setTags(data.tags)
            setDescription(data.description);
            setImageName(data.name);
        }
        fetchData();
    }, [registryId, repoName]);

    return (
        <div>
            <CustomMenubar />
            <div className="p-4">
                <h1 className="text-2xl text-gray-950 font-bold mb-4">Informations sur l&apos;image : {imageName}</h1>
                <Card>
                    <h1 className="text-3xl text-gray-900 font-bold mb-4">Actions</h1>
                    <Button label="Retour aux repositories" icon="pi pi-arrow-left" className="p-button-text" onClick={() => window.location.href = "/registries/" + registryId} />
                    <Button label="Editer les infos de l'image" icon="pi pi-pencil" className="p-button-text" onClick={() => setDialogIsVisible(true)} />
                    <ConfirmPopup />
                    <Button label="Supprimer l'image" icon="pi pi-trash" severity="danger" className="p-button-text" onClick={confirmationSuppression} />
                </Card>
                <div style={{ height: '1rem' }}></div>
                <Card style={{ width: '100%', height: '100%' }} className="mb-4">
                    <Accordion activeIndex={0}>
                        <AccordionTab header="Description">
                            <MarkupInterpretor markdownText={description} />
                        </AccordionTab>
                        <AccordionTab header="Tags">
                            <ListBox
                                value={selectedTag}
                                options={tags.map(tag => ({ label: tag, value: tag }))}
                                style={{ width: '300px' }}
                                className="mb-4"
                                placeholder="Aucun tag disponible"
                                onChange={(e) => setSelectedTag(e.value)}
                                onContextMenu={(event) => onRightClick(event)}
                            />
                            <ContextMenu ref={cm} model={items} />
                        </AccordionTab>
                    </Accordion>
                </Card>
                <Dialog header="Modifier les informations concernant l'image" visible={dialogIsVisible} style={{width:'60vw'}} onHide={() => { if (!dialogIsVisible) return; setDialogIsVisible(false); }}>
                    <TabView>
                        <TabPanel header="&nbsp;&nbsp;Edition" leftIcon="pi pi-pencil">
                            <Editor value={editedDescription} onTextChange={(e) => setEditedDescription(e.textValue)} style={{ height: '320px' }} />  
                            <div style={{ height: '1rem' }}></div>
                        </TabPanel>
                        <TabPanel header="&nbsp;&nbsp;Prévisualiser" leftIcon="pi pi-eye">
                            <MarkupInterpretor markdownText={editedDescription} />
                        </TabPanel>
                    </TabView>
                    <Button label="Enregistrer les modifications" icon="pi pi-check" className="mt-2" onClick={() => {saveDescription();}} />&nbsp;
                    <Button label="Aide" icon="pi pi-question" onClick={()=> alert("Afficher l'aide")} />
                </Dialog>
            </div>
            <Toast ref={toasts} position="top-right" />
        </div>);
}