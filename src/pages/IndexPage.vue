<template>
  <div class=" py-2 h-full flex flex-col items-center bg-gray-100">
    <!-- GitHub logo -->
    <VGithubIcon url="https://github.com/UzeG/HCIPaperLib" />
    <!-- 搜索框 -->
    <div class=" w-96">
      <div class=" w-full flex items-center">
        <div class="relative flex-1 mr-2">
          <input type="text" placeholder="Search..." v-model="userIpt" @keydown.enter="executeSearch"
            class="w-full pl-10 pr-8 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none border-gray-300" />
          <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          <X class="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 cursor-pointer"
            @click="userIpt = ''" />
        </div>
        <div class=" relative">
          <CircleHelp class=" text-gray-400 cursor-pointer hover:text-blue-500 transition-all"
            @click="showHelp = !showHelp" />
          <div v-if="showHelp"
            class=" absolute -right-1 translate-x-full top-0 px-4 py-2 min-w-40 bg-white rounded-lg border border-gray-400 text-sm shadow-lg text-gray-500 select-none">
            查询规则：
            <br />
            使用 [;,.，；。-] 进行关键词分割
            <br />
            按下回车进行查询
          </div>
        </div>
      </div>
    </div>
    <!-- 内容 -->
    <div class=" max-w-[60rem] px-4 mt-4 overflow-auto">
      <div v-if="isLoading" class=" tracking-wide text-lg text-gray-400">
        loading...
      </div>
      <div v-else-if="filteredData.length == 0" class=" tracking-wide text-lg text-gray-400">
        no result
      </div>
      <div v-else class=" grid grid-cols-1 gap-3 overflow-auto">
        <div v-for="(item, i) in filteredData" :key="i"
          class=" px-7 py-5 rounded-2xl border-2 border-gray-200 bg-white shadow-sm grid grid-cols-1 gap-2">
          <div class=" text-2xl font-bold hover:underline cursor-pointer" @click="toUrl(item.url)">
            {{ item.eTitle }}
          </div>
          <div class=" text-xl font-semibold">
            {{ item.title }}
          </div>
          <div class=" flex gap-1 items-center">
            <Sparkle :size="16" />
            <div class=" flex items-center">
              <div class=" font-semibold">创新点：</div>
              <div>{{ item.innovation }}</div>
            </div>
          </div>
          <div class=" flex gap-1 items-center">
            <Box :size="16" />
            <div class=" flex items-center">
              <div class=" font-semibold">方法：</div>
              <div>{{ item.method }}</div>
            </div>
          </div>
          <div class=" flex gap-1 items-center">
            <CheckCheck :size="16" />
            <div class=" flex items-center">
              <div class=" font-semibold">解决问题：</div>
              <div>{{ item.solved }}</div>
            </div>
          </div>
          <div class=" flex gap-1 items-center">
            <Tag :size="16" />
            <div class=" flex items-center">
              <div class=" font-semibold">标签：</div>
              <div class=" flex flex-wrap gap-1.5">
                <div v-for="(tag, j) in item.key" :key="j"
                  class="  px-1 py-0.5 bg-blue-400 border border-blue-600 rounded-lg text-white text-xs">
                  {{ tag }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import CHILBWData from '@/assets/chi-lbw-2024-a-2.json';
import { Search, CircleHelp, Box, CheckCheck, Sparkle, Tag, X } from 'lucide-vue-next';
// @ts-ignore
import { VGithubIcon } from 'v-github-icon';
import { ref, computed } from 'vue';

const userIpt = ref('');

const CHILBWJoinedStr = ref<string[]>([]);
CHILBWData.forEach(item => {
  CHILBWJoinedStr.value.push(
    ''
      .concat(
        item.eTitle, item.title, item.innovation, item.method, item.solved, item.key.join('')
      )
      .toLowerCase()
  )
});

function isChineseOrEnglish(char: string) {
  const chineseRegex = /[\u4e00-\u9fa5]/;
  const englishRegex = /[a-zA-Z]/;

  return chineseRegex.test(char) || englishRegex.test(char);
}

interface CHILBWItem {
  eTitle: string;
  title: string;
  key: string[];
  method: string;
  solved: string;
  innovation: string;
  url: string;
}

const data = ref<CHILBWItem[]>(CHILBWData);
const filteredData = ref<CHILBWItem[]>(CHILBWData);

const isLoading = ref(false);
const showHelp = ref(false);

const keyWords = computed(() => {
  return userIpt.value
    .split(/[;,.，；。-]/)
    .map(item => item.trim())
    .filter(item => isChineseOrEnglish(item));
})

const executeSearch = () => {
  if (keyWords.value.length == 0) {
    filteredData.value = data.value;
    return;
  }

  isLoading.value = true;

  setTimeout(() => {
    isLoading.value = false;
  }, 1000);

  const res: CHILBWItem[] = [];
  CHILBWJoinedStr.value.forEach((str, i) => {
    keyWords.value.some(kw => str.includes(kw)) && res.push(data.value[i]);
  });

  filteredData.value = res;
}

const toUrl = (url: string) => {
  window.open(url, "_blank");
}
</script>
