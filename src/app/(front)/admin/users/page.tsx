"use client";
import { useCheckSessionForAdmin } from '@/app/lib/ui/checkSession'
/* Imports des composants PrimeReact */
import { Card } from 'primereact/card';
import { CustomMenubar } from '@/app/lib/menubar_items';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Checkbox } from 'primereact/checkbox';
import { Button } from 'primereact/button';
import { Messages } from 'primereact/messages';
import { useRef } from 'react';
/* Imports des hooks React */
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import 'primeicons/primeicons.css';

type User = {
    id: number;
    prenom: string;
    nom: string;
    email: string;
    isAdmin: number;
};

export default function UserAdminPage() {
    // Vérification de la session utilisateur
    // Si la session n'est pas valide, l'utilisateur est redirigé vers la page de connexion
    useCheckSessionForAdmin();
    const router = useRouter();

    const msgs = useRef<Messages>(null);

    const goToCreateUserForm = () => {
        window.location.href = '/admin/users/create';
    }

    const isAdminBodyTemplate = (rowData: { isAdmin: number }) => (
        <Checkbox checked={rowData.isAdmin === 1} disabled />
    );

    // Fonction pour supprimer un utilisateur
    const deleteUser = async (userId: number) => {
        if (confirm("Voulez-vous vraiment supprimer cet utilisateur ?")) {
            try {
                const response = await fetch(`/api/users/delete`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ deletedUserId: userId }),
                });
                if (response.ok) {
                    setUsers(users.filter((u) => (u as User).id !== userId));
                } else {
                    const errorData = await response.json();
                    msgs.current?.show({ severity: 'error', summary: 'Erreur', detail: errorData.error || 'Erreur lors de la suppression de l\'utilisateur' });
                }
            } catch (error) {
                console.error('Erreur suppression:', error);
            }
        }
    };

    // Template pour la colonne Actions
    const actionsBodyTemplate = (rowData: { id: number }) => (
        <div>
            <Button
                icon="pi pi-pencil"
                className="p-button-rounded p-button-text p-button-info mr-2"
                title="Éditer"
                onClick={() => router.push(`/admin/users/edit/${rowData.id}`)}
            />
            <Button
                icon="pi pi-trash"
                className="p-button-rounded p-button-text p-button-danger"
                title="Supprimer"
                onClick={() => deleteUser(rowData.id)}
            />
        </div>
    );

    // Fetch users by api
    const [users, setUsers] = useState<User[]>([]);
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch('/api/users/list');
                if (!response.ok) {
                    throw new Error('Failed to fetch users');
                }
                const data = await response.json();
                setUsers(data as User[]);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };
        fetchUsers();
    }, []);

    return (
        <div>
            <CustomMenubar/>
            <div style={{ height: '1rem' }} />
            <div className="ml-3 mr-3">
                <h1 className="text-2xl text-gray-950">Gestion des Utilisateurs</h1>
                <div style={{ height: '1rem' }} />
                <Card title="Actions">
                    <Messages ref={msgs} />
                    <Button label="Créer un utilisateur" icon="pi pi-user-plus" onClick={() => goToCreateUserForm()} className="p-button-success mr-2" />
                </Card>
                <div style={{ height: '1rem' }} />
                <Card title="Liste des Utilisateurs">
                    <DataTable rows={10} value={users} tableStyle={{ minWidth: '50rem' }}>
                        <Column field="id" header="Id"></Column>
                        <Column field="prenom" header="Prénom"></Column>
                        <Column field="nom" header="Nom"></Column>
                        <Column field="email" header="Email"></Column>
                        <Column
                            field="isAdmin"
                            header="Administrateur"
                            dataType="boolean"
                            style={{ minWidth: '6rem' }}
                            body={isAdminBodyTemplate}
                        />
                        <Column header="Actions" body={actionsBodyTemplate} />
                    </DataTable>
                </Card>
            </div>
        </div>
    );
}