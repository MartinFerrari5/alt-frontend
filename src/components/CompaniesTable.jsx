// /src/components/CompaniesTable.jsx
import { useEffect } from "react"
import { useOptionsStore } from "../store/modules/optionsStore"
import CompaniesList from "./CompaniesList"

const CompaniesTable = ({ userId }) => {
    const { companies_table, fetchOptions } = useOptionsStore()

    useEffect(() => {
        fetchOptions("companies_table")
    }, [fetchOptions])

    return (
        <div className="overflow-x-auto rounded-md bg-card p-4 shadow">
            <CompaniesList title="Compañías" data={companies_table || []} />
        </div>
    )
}

export default CompaniesTable
