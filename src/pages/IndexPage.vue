<template>
  <div class="page bg-gray-100">
    <VGithubIcon url="https://github.com/UzeG/HCIPaperLib" />
    <div class=" w-full h-full flex justify-center">
      <div class=" w-fit">
        <div class=" h-full py-2 px-2 w-[40rem] flex flex-col relative">
          <!-- GitHub logo -->
          <!-- 搜索框 -->
          <div class=" flex items-center">
            <div class="relative flex-1 mr-2">
              <input type="text" placeholder="Search..." v-model="userIpt" @keydown.enter="handleIptEnter"
                class="w-full pl-10 pr-8 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none border-gray-300" />
              <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              <X class="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 cursor-pointer"
                @click="clearIpt" v-show="userIpt.length > 0" />
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
          <!-- 搜索规则 -->
          <div class=" w-full flex flex-wrap gap-2 mt-2">
            <div v-for="(item, i) in keyWords" :key="i" @click="handleClickKeyWordBubble(i)"
              :class="` px-2 py-0.5 border border-blue-500 ${item.enable ? 'bg-blue-500 text-white' : 'bg-white text-blue-500'} rounded-lg text-sm select-none cursor-pointer`">
              {{ item.str }}
            </div>
          </div>
          <!-- 搜索信息 -->
          <div class=" w-full mt-1" v-show="!isLoading">
            <div class=" text-sm text-gray-400 text-center">一共{{ filteredData.length }}条数据</div>
          </div>
          <!-- 内容 -->
          <div class=" max-w-[40rem] mt-2 overflow-auto">
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
                <div class=" grid grid-cols-1 gap-2">
                  <div class=" flex items-start">
                    <div class=" flex items-center gap-0.5 min-w-28">
                      <Sparkle :size="24" color="#f4d11f" />
                      <div class=" font-semibold text-nowrap">创新点：</div>
                    </div>
                    <div>{{ item.innovation }}</div>
                  </div>
                  <div class=" flex items-start">
                    <div class=" flex items-center gap-0.5 min-w-28">
                      <Box :size="24" color="#66a5e1" />
                      <div class=" font-semibold text-nowrap">方法：</div>
                    </div>
                    <div>{{ item.method }}</div>
                  </div>
                  <div class=" flex items-start">
                    <div class=" flex items-center gap-0.5 min-w-28">
                      <CheckCheck :size="24" color="#21d42d" />
                      <div class=" font-semibold text-nowrap">解决问题：</div>
                    </div>
                    <div>{{ item.solved }}</div>
                  </div>
                  <div class=" flex items-start">
                    <div class=" flex items-center gap-0.5 min-w-28">
                      <Tag :size="24" color="#d49b21" />
                      <div class=" font-semibold text-nowrap">标签：</div>
                    </div>
                    <div class=" flex flex-wrap gap-1.5 pt-0.5">
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

const keyWords = ref<{ str: string, enable: boolean }[]>([]);

const getKeyWords = () => {
  return userIpt.value
    .split(/[;,.，；。-]/)
    .map(item => item.trim())
    .filter(item => item.length > 0)
    .map(item => ({ str: item, enable: true }));
};

const handleIptEnter = () => {
  keyWords.value = getKeyWords();
  userIpt.value = keyWords.value.map(item => item.str).join(';');
  executeSearch(keyWords.value);
}

const handleClickKeyWordBubble = (index: number) => {
  keyWords.value[index].enable = !keyWords.value[index].enable;
  executeSearch(keyWords.value);
}

const executeSearch = (kws: { str: string, enable: boolean }[]) => {
  if (kws.length == 0) {
    filteredData.value = data.value;
    return;
  }

  isLoading.value = true;

  setTimeout(() => {
    isLoading.value = false;
  }, 2000);

  const res: CHILBWItem[] = [];
  CHILBWJoinedStr.value.forEach((str, i) => {
    kws.some(kw => kw.enable && str.includes(kw.str)) && res.push(data.value[i]);
  });

  filteredData.value = res;
}

const clearIpt = () => {
  userIpt.value = '';
}

const toUrl = (url: string) => {
  window.open(url, "_blank");
}
</script>
