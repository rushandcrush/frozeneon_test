<script setup lang="ts">
  import type { Package } from '../types';
  import { ref, reactive, watch } from 'vue'
  import { useDataFetch } from '../stores/DataFetch';
  import Popup from '../components/Popup.vue'

  const dataFetch = useDataFetch();
  let inputValue = ref<HTMLInputElement | null>(null)
  let dialogOverflowVisible = ref<boolean>(false);

  let trigerPagination = (...args: number[]) => {
    dataFetch.changePage(args[0]);
  }

  let trigerPopup = (row: Package) => {
    dialogOverflowVisible.value = true;
    if(row.indexOfElement) {
      dataFetch.showPopupInfo(row.indexOfElement);
    }
  }

  let changedDialogOverflowVisible = (payload: boolean) => {
    dialogOverflowVisible.value = payload
  }

  watch(inputValue, () => {
	    dataFetch.updateFetchData(inputValue.value)
    },
    { immediate: true }
  )
</script>

<template>
  <div class="main">
    <el-container>
      <el-header class="header">
        <div class="header-input">
          <el-input v-model="inputValue" placeholder="Please input" />
          <div :class="dataFetch.requestFlag ? 'active' : ''" class="loader-block">
            <span class="loader"></span>
          </div>
        </div>
      </el-header>
      <el-main>
        <div class="results">
          <div v-if="dataFetch.fetchDataArray && dataFetch.fetchDataArray.length">
            <el-table 
              :data="dataFetch.tableData" 
              class="table-info"
              stripe 
              style="width: 100%"
              @row-click="trigerPopup">
              <el-table-column prop="name" label="name" width="280" />
              <el-table-column prop="description" label="description" height="100" width="580" />
              <el-table-column prop="version" label="version" />
            </el-table>
          </div>
          <div v-else>
            <el-empty :image-size="200" />
          </div>
          <div class="pagination-block">
            <el-pagination
              small
              background
              hide-on-single-page
              layout="prev, pager, next"
              v-model:current-page="dataFetch.currentPage"
              :total="dataFetch.totalPages"
              :page-size="dataFetch.pageSize"
              @change="trigerPagination"
              class="mt-4"
            />
          </div>
        </div>
      </el-main>
      <el-footer>
        <div class="footer-info">
          <a href="https://github.com/rushandcrush" target="_blank">
            Vlad Nikolaiev
          </a>
        </div>
      </el-footer>
      <Popup :dialogOverflowVisible="dialogOverflowVisible" @changed-dialog-overflow="changedDialogOverflowVisible"/>
    </el-container>
  </div>
</template>

<style>
  .header-input {
    overflow: hidden;
    position: relative;
  }
  .main {
    width: 100%;
    margin: 0 auto;
  }
  .el-container {
    min-height: 100vh;
  }
  .table-info {
    cursor: pointer;
  }
  .el-input__wrapper {
    background-color: rgba(60, 60, 60, 0.66);

    & input {
      color: var(--el-text-color-regular);
    }
  }
  .header {
    margin-top: 30px;
  }
  .pagination-block {
    margin: 30px auto 0;

    @media screen and (max-width: 768px) {
      display: flex;
      justify-content: center;
    }
  }
  .el-footer {
    display: flex;
    align-items: center;
    justify-content: flex-end;

    & .footer-info {
      & a {
        text-decoration: none;
        color: var(--el-text-color-regular);
      }
    }
  }

  @media screen and (max-width: 768px) {
    .el-dialog.is-draggable {
      width: 90%;
      top: 5%;
    }
  }
</style>
