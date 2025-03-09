import type { SourceID } from "@shared/types"
import { useUpdateQuery } from "./query"

export function useRefetch() {
  const toaster = useToast()
  const updateQuery = useUpdateQuery()
  /**
   * force refresh
   */
  const refresh = useCallback((...sources: SourceID[]) => {
    // 不再检查登录状态，直接刷新数据
    refetchSources.clear()
    sources.forEach(id => refetchSources.add(id))
    updateQuery(...sources)
  }, [updateQuery])

  return {
    refresh,
    refetchSources,
  }
}
