import { useEffect, useState } from "react"
import { useOptionsStore } from "../store/modules/optionsStore"
import CompaniesList from "./CompaniesList"

const CompaniesTable = ({ userId }) => {
    const {
        companies_table,

        fetchOptions,
    } = useOptionsStore()

    useEffect(() => {
        fetchOptions("companies_table")
    }, [fetchOptions])
    console.log("companies_table", companies_table)

    return (
        <div className="overflow-x-auto">
            <CompaniesList title="Compañías" data={companies_table || []} />
        </div>
    )
}

export default CompaniesTable
