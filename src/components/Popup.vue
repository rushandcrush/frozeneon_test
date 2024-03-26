<script lang="ts" setup>
  import { ref, watch } from 'vue'
  import { useDataFetch } from '../stores/DataFetch';

  const dataFetch = useDataFetch();

  let showModal = ref<boolean>(false)
  let rating = ref<number | null>(0)

  const props = defineProps<{
    dialogOverflowVisible?: boolean
  }>()

  const emit = defineEmits<{
    (e: 'changed-dialog-overflow', payload: boolean): void,
  }>()
  
  let changedDialogOverflowVisible = (payload: boolean) => {
    emit('changed-dialog-overflow', payload)
  }

  let handleClose = (done: () => void) => {
    changedDialogOverflowVisible(false)
    done();
  }

  watch(() => props.dialogOverflowVisible, () => {
      showModal.value = props.dialogOverflowVisible
      rating.value = Math.round((dataFetch.currentPopupInfo && dataFetch.currentPopupInfo.score.detail.popularity ? dataFetch.currentPopupInfo.score.detail.popularity * 5 : 1)*100)/100 
    },
    { immediate: true }
  )
  

</script>



<template>
  <div class="popup">
    <el-dialog
      v-model="showModal"
      title="Description"
      width="500"
      draggable
      overflow
      :before-close="handleClose"
    >
      <div class="detail-info">
         <div v-if="dataFetch.currentPopupInfo && dataFetch.currentPopupInfo.package.name" class="detail-info__name">
            <span :class="popup.orange">Name:</span> {{ dataFetch.currentPopupInfo.package.name }}
         </div>
         <div v-if="dataFetch.currentPopupInfo.package.version" class="detail-info__name">
            <span :class="popup.orange">Version:</span> {{ dataFetch.currentPopupInfo.package.version }}
         </div>
         <div v-if="dataFetch.currentPopupInfo.package.description" class="detail-info__name">
            <span :class="popup.orange">Description:</span> {{ dataFetch.currentPopupInfo.package.description }}
         </div>
         <div v-if="dataFetch.currentPopupInfo.package.publisher.username" class="detail-info__name">
            <span :class="popup.orange">Publisher Username:</span> {{ dataFetch.currentPopupInfo.package.publisher.username }}
         </div>
         <div v-if="dataFetch.currentPopupInfo.package.publisher.email" class="detail-info__name">
            <span :class="popup.orange">Publisher Email:</span> {{ dataFetch.currentPopupInfo.package.publisher.email }}
         </div>
          <div v-if="dataFetch.currentPopupInfo.score.detail.popularity" class="detail-info__name">
            <el-rate
              v-model="rating"
              disabled
              show-score
              text-color="#ff9900"
              score-template="{value} points"
            />
          </div>
        <pre>
        </pre>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="changedDialogOverflowVisible(false)">
            Done
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style module="popup">
  .orange {
    color: #f7ba2a;
    font-weight: 600;
  }
</style>