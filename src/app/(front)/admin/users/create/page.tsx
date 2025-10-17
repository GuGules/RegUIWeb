"use client";
import { CustomMenubar } from "@/app/lib/menubar_items";
/* Import des composants React & Next */
import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

// Import des composants PrimeReact
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { FloatLabel } from "primereact/floatlabel";
import { Button } from "primereact/button";
import { InputSwitch } from "primereact/inputswitch";
import { Messages } from 'primereact/messages';

// Sécurité

import { useCheckSessionForAdmin } from "@/app/lib/ui/checkSession";

export default function CreateUserPage(){

    // Vérification de la session utilisateur
    useCheckSessionForAdmin();

    const [adminMode, setAdminMode] = useState(false);
    const msgs = useRef<Messages>(null);
    const router = useRouter();

    // Ajoute les refs pour chaque champ
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmedPassword, setConfirmedPassword] = useState('');

    const createUser = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password === confirmedPassword) {
            try {
                const response = await fetch('/api/users/create', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(
                        {
                            email: email,
                            lastName: lastName,
                            firstName: firstName,
                            password: password,
                            confirmedPassword: confirmedPassword,
                            isAdmin: adminMode
                        }
                    ),
                });
                if (!response.ok){
                    console.error('Erreur lors de la création de l’utilisateur');
                } else {
                    msgs.current?.show({ severity: 'success', summary: 'Succès', detail: "Utilisateur créé avec succès" });
                    router.push('/admin/users');
                }
            } catch (error){
                console.error('Allo', error);
            }
        } else {
            msgs.current?.show({ sticky: true, severity: 'error', summary: 'Erreur', detail: "Les mots de passe ne correspondent pas" });
        }
    };

    return (
        <div>
            <CustomMenubar style={{ width: '100vw', borderRadius: 0 }} />
            <div style={{ height: '1rem' }} />
            <div className="mr-3 ml-3">
                <Card title="Créer un Utilisateur">
                    <Messages ref={msgs} /> 
                    <div style={{ height: '1rem' }} />
                    <form onSubmit={createUser}>
                        <div className="grid grid-cols-2 gap-3">
                             <FloatLabel>
                                 <InputText style={{ width: '100%' }} value={firstName} onChange={(e) => setFirstName(e.target.value)} id="firstName"/>
                                 <label htmlFor="firstName">Prenom</label>
                             </FloatLabel>
                             <FloatLabel>
                                 <InputText style={{ width: '100%' }} value={lastName} onChange={(e) => setLastName(e.target.value)} id="lastName"/>
                                 <label htmlFor="lastName">Nom</label>
                             </FloatLabel>
                        </div>
                        <div style={{ height: '1.5rem' }}></div>
                        <FloatLabel>
                            <InputText style={{ width: '100%' }} value={email} onChange={(e) => setEmail(e.target.value)} id="email"/>
                            <label htmlFor="email">Adresse email</label>
                        </FloatLabel>
                        <div style={{ height: '1.5rem' }}></div>
                        <FloatLabel>
                            <InputText style={{ width: '100%' }} type="password" value={password} onChange={(e) => setPassword(e.target.value)} id="password"/>
                            <label htmlFor="password">Mot de passe</label>
                        </FloatLabel>
                        <div style={{ height: '1.5rem' }}></div>
                        <FloatLabel>
                            <InputText style={{ width: '100%' }} type="password" value={confirmedPassword} onChange={(e) => setConfirmedPassword(e.target.value)} id="confirmedPassword"/>
                            <label htmlFor="confirmPassword">Confirmer le mot de passe</label>
                        </FloatLabel>
                        <div style={{ height: '1.5rem' }}></div>
                        <label className="text-xl" htmlFor="switchAdmin">Administrateur</label>&nbsp;
                        <InputSwitch id="switchAdmin" checked={adminMode} onChange={(e) => setAdminMode(e.value)} />
                        <div style={{ height: '1.5rem' }}></div>
                        <Button type="submit" label="Créer un nouvel utilisateur"/>
                    </form>
                </Card>
            </div>
        </div>
    );
}