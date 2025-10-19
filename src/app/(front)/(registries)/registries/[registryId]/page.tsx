"use client";
import { CustomMenubar } from "@/app/lib/menubar_items";
import { useEffect,  useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";     


export default function Page(props: unknown) {
    const { params } = props as { params: { registryId: string }};
    const { registryId } = params;
    const [registryRepos,setRegistryRepos] = useState([]);

    const actionsBodyTemplate = (rowData: { id: number, name: string }) => (
        <div>
            <Button
                icon="pi pi-search"
                className="p-button-rounded p-button-text p-button-info mr-2"
                title="Visualiser le repository"
                onClick={() => window.location.href="/registries/" + registryId + "/" + rowData.name}
            />
        </div>
    );

    useEffect(() => {
        const fetchData = async () => {
            const resp = await fetch(`/api/registries/${registryId}/repositories`);
            const data = await resp.json();
            setRegistryRepos(data.repositories);
        }
        fetchData();
    }, [registryId]);

    return (
    <div>
        <CustomMenubar />
        <div className="p-4">
            <h1 className="text-2xl text-gray-950 font-bold mb-4">Liste des repositories sur le registre</h1>
            <DataTable value={registryRepos} rows={10} paginator className="p-datatable-sm">
                <Column field="name" header="Nom du repository"></Column>
                <Column header="Actions" body={actionsBodyTemplate}></Column>
            </DataTable>
        </div>
    </div>);
}