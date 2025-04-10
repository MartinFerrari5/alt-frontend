// /src/util/mappers.js
export const mapCompanies = (companies) => {
    const validCompanies = Array.isArray(companies) ? companies : []
    return validCompanies.map((company) => ({
        id: company.company_id,
        relationship_id: company.relationship_id,
        option: company.option,
    }))
}

export const mapProjects = (projects) => {
    const validProjects = Array.isArray(projects) ? projects : []
    return validProjects.map((project) => ({
        id: project.project_id,
        relationshipId: project.relationship_id,
        option: project.option,
    }))
}
export const mapUsers = (users) => {
    const validUsers = Array.isArray(users) ? users : []
    return validUsers.map((user) => ({
        id: user.user_id,
        relationshipId: user.relationship_id,
        option: user.option,
    }))
}
