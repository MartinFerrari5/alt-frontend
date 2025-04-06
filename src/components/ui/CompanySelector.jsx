// /src/components/ui/CompanySelector.jsx
const CompanySelector = ({
    mappedRelatedCompanies,
    selectedCompanyRelId,
    setSelectedCompanyRelId,
}) => {
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
