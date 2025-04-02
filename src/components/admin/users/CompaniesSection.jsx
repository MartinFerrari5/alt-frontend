import { useEffect, useState } from "react"
import { RelationSection } from "./RelationSection"
import { getOptions } from "../../../hooks/data/options/optionsService"
import {
    getRelatedOptions,
    getNotRelatedCompanies,
    deleteCompanyUserRelation,
    addCompanyUserRelation,
} from "../../../hooks/data/options/relationsService"
import { toast } from "react-toastify"
import { Building } from "lucide-react"

const CompaniesSection = ({
    userId,
    selectedCompanyRelId,
    setSelectedCompanyRelId,
}) => {
    // Almacena todas las compañías (tabla de opciones)
    const [companiesTable, setCompaniesTable] = useState([])
    // Compañías ya relacionadas al usuario
    const [relatedCompanies, setRelatedCompanies] = useState([])
    // Compañías que aún no están relacionadas
    const [notRelatedCompanies, setNotRelatedCompanies] = useState([])

    // Cargar opciones generales de compañías
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

    // Cargar compañías que no están relacionadas con el usuario
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

    // Mapea las compañías relacionadas a un formato que use el diseño
    const mappedRelatedCompanies = relatedCompanies.map((r) => ({
        id: r.company_id,
        relationship_id: r.relationship_id,
        option: r.option,
    }))

    // Mapea las compañías disponibles (no relacionadas)
    const availableCompanies = notRelatedCompanies.map((item) => ({
        id: item.company_id,
        option: item.options,
    }))

    // Función para agregar una relación. En este caso se recibe el id de la compañía.
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

    // Renderiza cada elemento relacionado con diseño similar al propuesto
    const renderItemContent = (company) => (
        <div
            className={`flex w-full cursor-pointer items-center gap-2 ${
                selectedCompanyRelId === company.relationship_id
                    ? "bg-green bg-opacity-5"
                    : ""
            }`}
            onClick={() => setSelectedCompanyRelId(company.relationship_id)}
        >
            <div className="bg-blue-bg text-main-color rounded-md p-1.5">
                <Building className="h-4 w-4" />
            </div>
            <div>
                <p className="text-main-color font-medium">{company.option}</p>
                {company.role && (
                    <p className="text-xs text-gray-500">
                        Role: {company.role}
                    </p>
                )}
            </div>
        </div>
    )

    return (
        <div className="mb-8">
            <RelationSection
                title="Compañías"
                // Se pasan las compañías relacionadas y disponibles
                relatedItems={mappedRelatedCompanies}
                availableItems={availableCompanies}
                displayProp="option"
                onAddRelation={handleAddRelation}
                onDeleteRelation={handleDeleteRelation}
                // Opciones de texto para botones y mensajes
                addLabel="Agregar Compañía"
                emptyText="El usuario no está asociado a ninguna compañía"
                renderItemContent={renderItemContent}
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
