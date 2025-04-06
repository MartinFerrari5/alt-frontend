// /src/hooks/useUpdateRelationsOnCompanyChange.js
import { useEffect } from "react"
import { useRelationsStore } from "../store/modules/relationsStore"

export const useUpdateRelationsOnCompanyChange = (userId, companyId) => {
    const { updateRelations } = useRelationsStore()

    useEffect(() => {
        if (userId && companyId) {
            updateRelations(userId, companyId)
        }
    }, [userId, companyId, updateRelations])
}
