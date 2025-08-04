"use client";
import { use, useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useCheckSessionForAdmin } from "@/app/lib/ui/checkSession";

// Import des composants PrimeReact
import { Menubar } from 'primereact/menubar';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { FloatLabel } from 'primereact/floatlabel';
import { InputSwitch } from "primereact/inputswitch";
import { Button } from 'primereact/button';
import { Messages } from 'primereact/messages';
import { Dialog } from 'primereact/dialog';
import { ConfirmPopup, confirmPopup } from 'primereact/confirmpopup';

// Import des données du menu
import { items, start, end } from '@/app/lib/menubar_items';

export default function EditUserPage({ params }: { params: Promise<{ userId: string }> }) {

    const router = useRouter();
    const [visible, setVisible] = useState(false);
    const msgs = useRef<Messages>(null);

    // Récupération de l'ID de l'utilisateur à partir des paramètres
    const { userId } = use(params);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [adminMode, setAdminMode] = useState(false);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');


    // Vérification de l'utilisateur connecté
    // Si l'utilisateur n'est pas connecté, il sera redirigé vers la page de connexion
    useCheckSessionForAdmin();

    useEffect(() => {
        // Récupération des données de l'utilisateur
        const fetchUserData = async () => {
            const response = await fetch(`/api/users/getUser`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId }),
            });
            const data = await response.json();
            if (response.ok) {
                setFirstName(data.prenom ?? '');
                setLastName(data.nom ?? '');
                setEmail(data.email ?? '');
                setAdminMode(data.isAdmin === 1);
            }
        };
        fetchUserData();
    }, [userId]);

    const askConfirmation = (event: React.MouseEvent<HTMLButtonElement>) => {
        confirmPopup({
            target: event.currentTarget,
            message: 'Voulez-vous vraiment supprimer cet utilisateur ?',
            icon: 'pi pi-exclamation-triangle',
            defaultFocus: 'reject',
            acceptClassName: 'p-button-danger',
            accept: deleteUser
        });
    };

    const changePassword = async (e:React.FormEvent) => {
        e.preventDefault();
        setVisible(false);
        if (password !== confirmPassword){
            msgs.current?.show({ sticky:true, severity: 'error', summary: 'Erreur', detail: "Les mots de passe ne correspondent pas" });
        } else {
            const response = await fetch('/api/users/edit/changePassword', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: userId,
                    password: password,
                    confirmPassword: confirmPassword
                }),
            });
            if (!response.ok) {
                console.error('Erreur lors du changement de mot de passe');
                msgs.current?.show({ sticky:true, severity: 'error', summary: 'Erreur', detail: "Erreur lors du changement de mot de passe" });
            } else {
                msgs.current?.show({ sticky:true, severity: 'success', summary: 'Succès', detail: "Mot de passe changé avec succès" });
            }
        }
        setPassword('');
        setConfirmPassword('');
    }

    const deleteUser = async ()=> {
        const response = await fetch('/api/users/delete', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ deletedUserId: userId }),
        })
        if (response.ok){
            msgs.current?.show({ severity: 'success', summary: 'Succès', detail: "Utilisateur supprimé avec succès" });
            router.push('/admin/users');
        } else {
            msgs.current?.show({ severity: 'error', summary: 'Erreur', detail: "Erreur lors de la suppression de l'utilisateur" });
        }
    }

    const editUser = async (e: React.FormEvent) => {
        e.preventDefault();

        const response = await fetch('/api/users/edit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(
                {
                    userId: userId,
                    email: email,
                    lastName: lastName,
                    firstName: firstName,
                    isAdmin: adminMode
                }
            ),
        });
        if (!response.ok) {
            console.error('Erreur lors de la modification de l’utilisateur');
            msgs.current?.show({ sticky:true, severity: 'error', summary: 'Erreur', detail: "Erreur lors de la mise à jour de l'utilisateur" });
        } else {
            msgs.current?.show({ sticky:true, severity: 'success', summary: 'Succès', detail: "Utilisateur modifié avec succès" });
            router.push('/admin/users');
        }
    }

    return (
        <div>
            <Menubar model={items} start={start} end={end} />   
            <div style={{ height: '1rem' }}></div>
            <div className="mr-2 ml-2">
                <Card title="Actions Rapides" >
                    <Messages ref={msgs} />
                    <Button label="Page précédente" icon="pi pi-arrow-left" onClick={() => router.back()} />&nbsp;
                    <Button label="Changer le mot de passe" icon="pi pi-key" onClick={() => setVisible(true)} />&nbsp;
                    <ConfirmPopup />
                    <Button onClick={askConfirmation} label="Supprimer l'utilisateur" icon="pi pi-trash" severity="danger" />
                    <Dialog header="Changer le mot de passe" visible={visible} style={{ width: '50vw' }} onHide={() => {if (!visible) return; setVisible(false); }}>
                        <form onSubmit={changePassword}>
                            <InputText placeholder="Nouveau mot de passe" value={password} onChange={(e) => setPassword(e.target.value)} type="password" className="w-full mb-3" />
                            <div style={{ height: '1rem' }}></div>
                            <InputText placeholder="Confirmer le mot de passe" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} type="password" className="w-full mb-3" />
                            <div style={{ height: '1rem' }}></div>
                            <Button label="Enregistrer" icon="pi pi-check" className="mt-2" />
                        </form>
                    </Dialog>
                </Card>
                <div style={{ height: '1rem' }}></div>

                <Card title={`Modifier l'utilisateur`}>
                    <form onSubmit={editUser}>
                        <div className="grid grid-cols-2 gap-3">
                            <FloatLabel>
                                <InputText style={{ width: '100%' }} value={firstName} onChange={(e) => setFirstName(e.target.value)} id="firstName" />
                                <label htmlFor="firstName">Prenom</label>
                            </FloatLabel>
                            <FloatLabel>
                                <InputText style={{ width: '100%' }} value={lastName} onChange={(e) => setLastName(e.target.value)} id="lastName" />
                                <label htmlFor="lastName">Nom</label>
                            </FloatLabel>
                        </div>
                        <div style={{ height: '1.5rem' }}></div>
                        <FloatLabel>
                            <InputText disabled style={{ width: '100%' }} value={email} onChange={(e) => setEmail(e.target.value)} id="email" />
                            <label htmlFor="email">Adresse email</label>
                        </FloatLabel>
                        <div style={{ height: '1.5rem' }}></div>
                        <div style={{ height: '1.5rem' }}></div>
                        <label className="text-xl" htmlFor="switchAdmin">Administrateur</label>&nbsp;
                        <InputSwitch id="switchAdmin" checked={adminMode} onChange={(e) => setAdminMode(e.value)} />
                        <div style={{ height: '1.5rem' }}></div>
                        <Button type="submit" label="Enregistrer les modifications" />
                    </form>
                </Card>
            </div>
        </div>
    )
}