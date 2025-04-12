// /src/components/ui/CompanySelector.jsx
/**
 * Component for selecting a company to view projects
 * @param {Object} props - Component props
 * @param {Array} props.mappedRelatedCompanies - Array de compañías relacionadas
 * @param {String} props.selectedCompanyRelId - ID de la relación de la compañía seleccionada
 * @param {Function} props.setSelectedCompanyRelId - Función para actualizar la compañía seleccionada
 * @returns {ReactElement} Company selector component
 */
const CompanySelector = ({
    mappedRelatedCompanies,
    selectedCompanyRelId,
    setSelectedCompanyRelId,
}) => {
    // Si no hay compañías relacionadas, no se renderiza el componente.
    if (!mappedRelatedCompanies.length) return null

    return (
        <div className="mb-4">
            <label htmlFor="companySelector" className="mb-1 block font-bold">
                Seleccionar Compañía para proyectos:
            </label>
            <select
                id="companySelector"
                value={selectedCompanyRelId}
                onChange={(e) => setSelectedCompanyRelId(e.target.value)}
                className="w-full rounded border p-2"
            >
                {mappedRelatedCompanies.map((company) => (
                    <option key={company.id} value={company.id}>
                        {company.option}
                    </option>
                ))}
            </select>
        </div>
    )
}

export default CompanySelector
