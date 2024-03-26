import type { DataState, Package } from '../types';
import { defineStore } from 'pinia'
import axios from 'redaxios';
import debounce from 'lodash.debounce'

export const useDataFetch = defineStore('DataFetch', {
  state: ():DataState => ({
    fetchDataArray: [],
    currentPage: 1,
    pageSize: 10,
    currentData: [],
    tableData: [],
    requestFlag: false,
    currentPopupInfo: null,
  }),
  actions: {
    updateFetchData(payload: HTMLInputElement | null) {
      this.requestFlag = true;
      debounce(() => {
        axios
          .get(`${import.meta.env.VITE_GLOBAL_FETCH_URL}-/v1/search?text=${payload}&size=250`)
          .then(res => {
            this.currentPage = 1;
            if(this.fetchDataArray && this.fetchDataArray.length) {
              this.fetchDataArray.splice(0);
            }
            const { data } = res;
            this.fetchDataArray = [...data.objects];
          })
          .then(() => {
            this.changePage(1)
          })
          .finally(() => {
            this.requestFlag = false;
          })
      }, 300)()
    },
    changePage(payload: number) {
      this.currentPage = payload;
      this.tableData.length = 0;
      this.displayData();
      this.filteredData();
    },
    displayData() {
      if(this.fetchDataArray && this.fetchDataArray.length) {
        this.currentData = this.fetchDataArray.slice(this.pageSize * this.currentPage - this.pageSize, this.pageSize * this.currentPage);
        return this.currentData
      }
    },
    filteredData() {
      this.currentData.map((el: any, index) => {
        let packageValue: Package = {
          indexOfElement: index,
          name: el.package.name,
          description: el.package.description,
          version: el.package.version
        }
        this.tableData.push(packageValue)
      })
    },
    showPopupInfo(payload: number) {
      if(payload) {
        this.currentPopupInfo = this.currentData[payload]
      }
    }
  },
  getters: {
    totalPages(): number | undefined {
      if (this.fetchDataArray && this.fetchDataArray.length) {
        return this.fetchDataArray.length
      }
    },
  }
})
