export type DataState = {
  fetchDataArray?: string[],
  currentPage: number,
  pageSize: number,
  currentData: string[],
  tableData: Package[],
  requestFlag: boolean,
  currentPopupInfo?: any | null
}

export type Package = {
  indexOfElement?: number,
  name?: string,
  description?: string,
  version?: number
}