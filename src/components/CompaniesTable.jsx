// /src/components/CompaniesTable.jsx
import { useEffect } from "react"
import { useOptionsStore } from "../store/modules/optionsStore"
import CompaniesList from "./CompaniesList"

const CompaniesTable = ({ userId }) => {
    const { companies_table, fetchOptions } = useOptionsStore()
    console.log("CompaniesTable", companies_table)

    useEffect(() => {
        fetchOptions("companies_table")
    }, [fetchOptions])

    return (
        <div className="overflow-x-auto bg-card rounded-md shadow p-4">
            <CompaniesList title="Compañías" data={companies_table || []} />
        </div>
    )
}

export default CompaniesTable
