// /src/utils/mappers.js
export const mapCompanies = (companies) =>
    companies.map((company) => ({
        id: company.company_id,
        relationship_id: company.relationship_id,
        option: company.option,
    }))

export const mapProjects = (projects) =>
    projects.map((project) => ({
        id: project.project_id,
        relationshipId: project.relationship_id,
        option: project.option,
    }))
