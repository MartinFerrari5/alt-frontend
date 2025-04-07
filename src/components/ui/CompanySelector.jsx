// /src/components/ui/CompanySelector.jsx
/**
 * Component for selecting a company to view projects
 * @param {Object} props - Component props
 * @param {Array} props.mappedRelatedCompanies - Array of related companies
 * @param {String} props.selectedCompanyRelId - selected company relationship id
 * @param {Function} props.setSelectedCompanyRelId - function to update the selected company relationship id
 * @returns {ReactElement} Company selector component
 */
const CompanySelector = ({
    mappedRelatedCompanies,
    selectedCompanyRelId,
    setSelectedCompanyRelId,
}) => {
    // If there are no related companies, do not render the component
    if (!mappedRelatedCompanies.length) return null

    return (
        <div className="mb-4">
            {/* Label for the select component */}
            <label htmlFor="companySelector" className="mb-1 block font-bold">
                Seleccionar Compañía para proyectos:
            </label>
            {/* Select component to select a company */}
            <select
                id="companySelector"
                value={selectedCompanyRelId}
                onChange={(e) => setSelectedCompanyRelId(e.target.value)}
                className="w-full rounded border p-2"
            >
                {/* Generate options for each related company */}
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
    )
}

export default CompanySelector
