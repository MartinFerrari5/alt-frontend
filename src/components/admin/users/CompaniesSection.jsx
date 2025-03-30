// /src/components/admin/users/CompaniesSection.jsx
import { useEffect, useState } from "react"
import {RelationSection} from "./RelationSection"
import { getOptions } from "../../../hooks/data/options/optionsService"
import {
    getRelatedOptions,
    getNotRelatedCompanies,
    deleteCompanyUserRelation,
    addCompanyUserRelation,
} from "../../../hooks/data/options/relationsService"
import { toast } from "react-toastify"

const CompaniesSection = ({
    userId,
    selectedCompanyRelId,
    setSelectedCompanyRelId,
}) => {
    const [companiesTable, setCompaniesTable] = useState([])
    const [relatedCompanies, setRelatedCompanies] = useState([])
    const [notRelatedCompanies, setNotRelatedCompanies] = useState([])

    // Cargar opciones disponibles de compañías
    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                const companiesData = await getOptions("companies_table")
                setCompaniesTable(companiesData.options || [])
            } catch (error) {
                console.error("Error al obtener compañías:", error)
            }
        }
        fetchCompanies()
    }, [])

    // Cargar compañías relacionadas al usuario
    useEffect(() => {
        if (userId) {
            const fetchRelatedCompanies = async () => {
                try {
                    const companiesData = await getRelatedOptions({
                        user_id: userId,
                        related_table: "company_users_table",
                        individual_table: "companies_table",
                    })
                    setRelatedCompanies(companiesData)
                } catch (error) {
                    console.error(
                        "Error al obtener compañías relacionadas:",
                        error
                    )
                    toast.error("Error al obtener compañías relacionadas")
                }
            }
            fetchRelatedCompanies()
        }
    }, [userId])

    // Asignar el primer relationship_id como seleccionado si aún no hay
    useEffect(() => {
        if (relatedCompanies.length > 0 && !selectedCompanyRelId) {
            setSelectedCompanyRelId(relatedCompanies[0].relationship_id)
        }
    }, [relatedCompanies, selectedCompanyRelId, setSelectedCompanyRelId])

    // Cargar compañías que aún no están relacionadas
    useEffect(() => {
        if (userId) {
            const fetchNotRelated = async () => {
                try {
                    const companiesNotRelated =
                        await getNotRelatedCompanies(userId)
                    setNotRelatedCompanies(companiesNotRelated)
                } catch (error) {
                    console.error(
                        "Error al obtener opciones no relacionadas:",
                        error
                    )
                    toast.error("Error al obtener opciones no relacionadas")
                }
            }
            fetchNotRelated()
        }
    }, [userId])

    const mappedRelatedCompanies = relatedCompanies.map((r) => ({
        id: r.company_id,
        relationship_id: r.relationship_id,
        option: r.option,
    }))

    const availableCompanies = notRelatedCompanies.map((item) => ({
        id: item.company_id,
        option: item.options,
    }))

    const handleAddRelation = async (companyId) => {
        try {
            const relationData = { user_id: userId, company_id: companyId }
            await addCompanyUserRelation(relationData)
            toast.success("Relación con la compañía creada exitosamente")
            const updatedCompanies = await getRelatedOptions({
                user_id: userId,
                related_table: "company_users_table",
                individual_table: "companies_table",
            })
            setRelatedCompanies(updatedCompanies)
            const updatedNotRelated = await getNotRelatedCompanies(userId)
            setNotRelatedCompanies(updatedNotRelated)
        } catch (error) {
            console.error("Error al agregar relación de compañía:", error)
            toast.error("Error al agregar relación de compañía")
        }
    }

    const handleDeleteRelation = async (relation) => {
        try {
            await deleteCompanyUserRelation(relation.relationship_id)
            toast.success("Relación con la compañía eliminada exitosamente")
            const updatedCompanies = await getRelatedOptions({
                user_id: userId,
                related_table: "company_users_table",
                individual_table: "companies_table",
            })
            setRelatedCompanies(updatedCompanies)
            const updatedNotRelated = await getNotRelatedCompanies(userId)
            setNotRelatedCompanies(updatedNotRelated)
            if (relation.relationship_id === selectedCompanyRelId) {
                setSelectedCompanyRelId(
                    updatedCompanies.length > 0
                        ? updatedCompanies[0].relationship_id
                        : ""
                )
            }
        } catch (error) {
            console.error("Error al eliminar relación de compañía:", error)
            toast.error("Error al eliminar relación de compañía")
        }
    }

    return (
        <div className="mb-8">
            <RelationSection
                title="Compañías"
                relatedItems={mappedRelatedCompanies}
                availableItems={availableCompanies}
                displayProp="option"
                onAddRelation={handleAddRelation}
                onDeleteRelation={handleDeleteRelation}
            />
            {mappedRelatedCompanies.length > 0 && (
                <div className="mb-4">
                    <label
                        htmlFor="companySelector"
                        className="mb-1 block font-bold"
                    >
                        Seleccionar Compañía para proyectos:
                    </label>
                    <select
                        id="companySelector"
                        value={selectedCompanyRelId}
                        onChange={(e) =>
                            setSelectedCompanyRelId(e.target.value)
                        }
                        className="w-full rounded border p-2"
                    >
                        {mappedRelatedCompanies.map((company) => (
                            <option
                                key={company.relationship_id}
                                value={company.relationship_id}
                            >
                                {company.option}
                            </option>
                        ))}
                    </select>
                </div>
            )}
        </div>
    )
}

export default CompaniesSection
