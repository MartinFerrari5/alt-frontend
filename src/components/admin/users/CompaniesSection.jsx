// /src/components/admin/users/CompaniesSection.jsx
import { useEffect, useState } from "react"
import { RelationSection } from "./RelationSection"
import { getOptions } from "../../../hooks/data/options/optionsService"
import { toast } from "react-toastify"
import { Building } from "lucide-react"
import { useRelationsStore } from "../../../store/modules/relationsStore"

const CompaniesSection = ({
    userId,
    selectedCompanyRelId,
    setSelectedCompanyRelId,
}) => {
    // Estado local para la tabla de compañías (opciones generales)
    const [companiesTable, setCompaniesTable] = useState([])

    // Extraemos del store global los estados y métodos relacionados con las relaciones
    const {
        relatedCompanies,
        notRelatedCompanies,
        updateRelations,
        addCompanyUserRelation,
        deleteCompanyUserRelation,
    } = useRelationsStore()

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

    // Actualizar relaciones (compañías) en el store global
    useEffect(() => {
        if (userId) {
            updateRelations(userId)
        }
    }, [userId, updateRelations])

    // Si hay relaciones y no se ha seleccionado ninguna, se asigna la primera por defecto
    useEffect(() => {
        if (relatedCompanies.length > 0 && !selectedCompanyRelId) {
            setSelectedCompanyRelId(relatedCompanies[0].relationship_id)
        }
    }, [relatedCompanies, selectedCompanyRelId, setSelectedCompanyRelId])

    // Mapeo para el diseño de compañías relacionadas
    const mappedRelatedCompanies = relatedCompanies.map((r) => ({
        id: r.company_id,
        relationship_id: r.relationship_id,
        option: r.option,
    }))

    // Mapeo para compañías disponibles (no relacionadas)
    const availableCompanies = notRelatedCompanies.map((item) => ({
        id: item.company_id,
        option: item.options,
    }))

    // Función para agregar relación utilizando el store global
    const handleAddRelation = async (companyId) => {
        try {
            const relationData = { user_id: userId, company_id: companyId }
            await addCompanyUserRelation(relationData, userId)
            toast.success("Relación con la compañía creada exitosamente")
        } catch (error) {
            console.error("Error al agregar relación de compañía:", error)
            toast.error("Error al agregar relación de compañía")
        }
    }

    // Función para eliminar relación utilizando el store global
    const handleDeleteRelation = async (relation) => {
        try {
            await deleteCompanyUserRelation(relation.relationship_id, userId)
            toast.success("Relación con la compañía eliminada exitosamente")
            // Si la relación eliminada era la seleccionada, se actualiza el selectedCompanyRelId
            if (relation.relationship_id === selectedCompanyRelId) {
                setSelectedCompanyRelId(
                    relatedCompanies.length > 0
                        ? relatedCompanies[0].relationship_id
                        : ""
                )
            }
        } catch (error) {
            console.error("Error al eliminar relación de compañía:", error)
            toast.error("Error al eliminar relación de compañía")
        }
    }

    // Renderizado de cada elemento de la compañía
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
            </div>
        </div>
    )

    return (
        <div className="mb-8">
            <RelationSection
                icon={<Building className="h-5 w-5 text-green-600" />}
                title="Compañías"
                relatedItems={mappedRelatedCompanies}
                availableItems={availableCompanies}
                displayProp="option"
                onAddRelation={handleAddRelation}
                onDeleteRelation={handleDeleteRelation}
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
