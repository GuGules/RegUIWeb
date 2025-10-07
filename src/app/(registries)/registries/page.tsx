"use client";
import { useCheckSession } from "@/app/lib/ui/checkSession"
import { CustomMenubar } from "@/app/lib/menubar_items";
import 'primereact/resources/themes/lara-light-blue/theme.css'; // or another PrimeReact theme
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import { Button } from "primereact/button";
import { useRouter } from "next/navigation";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useEffect, useState } from "react";

export default function Registries() {
    useCheckSession();

    const router = useRouter();
    const [registries, setRegistries] = useState<Array<any>>([]);
    // Template pour la colonne Actions
    const actionsBodyTemplate = (rowData: { id: number }) => (
        <div>
            <Button
                icon="pi pi-arrow-up-right"
                className="p-button-rounded p-button-text p-button-info mr-2"
                title="Accéder au registre"
                onClick={() => router.push(`/registries/${rowData.id}`)}
            />
        </div>
    );

    useEffect(()=>{
        const fetchData = async () => {
            const response = await fetch('/api/registries/list');
            const data = await response.json();
            setRegistries(data);
        };
        fetchData();
    }, []);

    return (
        <div>
            <CustomMenubar />
            <div style={{ height: '1rem' }}></div>
            <div className="mr-2 ml-2">
                <h1 className="text-2xl text-gray-950">Registres</h1>
                <div style={{ height: '1rem' }}></div>
                <DataTable rows={10} value={registries} tableStyle={{ minWidth: '50rem' }}>
                    <Column field="nom" header="Nom"></Column>
                    <Column field="url" header="URL"></Column>
                    <Column header="Actions" body={actionsBodyTemplate} />
                </DataTable>
            </div>
        </div>
    );
}
