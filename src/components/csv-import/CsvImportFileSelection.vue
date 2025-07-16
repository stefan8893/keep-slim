<script setup lang="ts">
import { UploadFilled } from '@element-plus/icons-vue';
import type { UploadInstance, UploadProps, UploadRawFile, UploadUserFile } from 'element-plus';
import { genFileId } from 'element-plus';
import { ref, watch } from 'vue';

const selectedFile = defineModel<File | null>('selectedFile');

const files = ref<UploadUserFile[]>([]);
const uploadInstance = ref<UploadInstance>();

const onExceedLimit: UploadProps['onExceed'] = (files) => {
  uploadInstance.value!.clearFiles();
  const file = files[0] as UploadRawFile;
  file.uid = genFileId();
  uploadInstance.value!.handleStart(file);
};

const onFileChange: UploadProps['onChange'] = (file) => {
  selectedFile.value = file.raw;
};

watch(files, () => {
  if (files.value.length === 0) selectedFile.value = null;
});

watch(selectedFile, () => {
  if (!selectedFile.value) files.value = [];
});
</script>

<template>
  <el-upload
    ref="uploadInstance"
    v-model:file-list="files"
    action="http://localhost:5173"
    drag
    :limit="1"
    :auto-upload="false"
    :on-exceed="onExceedLimit"
    :on-change="onFileChange"
  >
    <div class="flex min-h-60 w-full flex-col flex-nowrap items-center justify-center">
      <el-icon class="el-icon--upload" size="60"><UploadFilled /></el-icon>
      <div class="el-upload__text">Drop file here or <em>click to upload</em></div>
    </div>
  </el-upload>
</template>

<style scoped></style>
