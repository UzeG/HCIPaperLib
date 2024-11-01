<template>
  <div class="page bg-gray-100">
    <VGithubIcon url="https://github.com/UzeG/HCIPaperLib" class=" hidden lg:block" />
    <div class=" w-full h-full flex justify-center">
      <div class=" h-full py-2 w-11/12 lg:w-5/6 flex flex-col relative">
        <!-- GitHub logo -->
        <!-- 搜索框 -->
        <div class=" w-full flex items-center relative">
          <div class=" flex-1 relative mr-2 min-w-0">
            <div
              class=" w-full flex items-center border border-gray-300 bg-white transition-all pl-2.5 py-1.5 pr-3.5 rounded-xl focus-within:ring-2 gap-2">
              <!-- 
              常见布局技巧
              min-w-0：限制它不会自动扩展超出父容器。
              min-w-0 应该放在 需要收缩宽度的 flex 子元素（即 flex-item）上，而不是在父 flex 容器上。它的作用是限制子元素的最小宽度为 0，使其可以在父容器的空间范围内自由收缩。
              -->
              <div class=" flex-1 flex items-center focus-within:bg-gray-200 rounded-lg px-2 min-w-0">
                <div ref="iptScrollBox" class=" flex-1 min-w-0 flex items-center overflow-auto">
                  <!-- 关键词Bubble -->
                  <div v-if="keyWords.length > 0" class=" flex gap-1 flex-nowrap pr-2 py-1.5">
                    <div v-for="(kw, i) in keyWords "
                      :class="` group px-2 py-0.5 ${curActiveKeyWordIndex == i ? 'bg-blue-400 text-blue-100' : 'bg-blue-100  border-blue-400 text-blue-400'} border rounded-lg relative`">
                      <span>{{ kw }}</span>
                      <X :size="14" @click="handleClickDeleteKeywordBubble(i)"
                        class=" hidden group-hover:block cursor-pointer absolute z-[100] top-0 right-0 -translate-y-1/3 translate-x-1/3 p-[0.1rem] border border-red-500 bg-red-50 text-red-500 rounded-full" />
                    </div>
                  </div>
                  <!-- 输入框 -->
                  <input ref="userIpt" type="text" placeholder="ADD KEY WORD" v-model="userIptText"
                    @keydown.enter="handleIptEnter" @keydown.backspace="handleIptBackspace"
                    @keydown.left="handleIptLeftArrow" @keydown.right="handleIptRightArrow" @keydown.esc="handleIptEsc"
                    @dblclick="handleDblclickIpt" @blur="curActiveKeyWordIndex = -1" @input="curActiveKeyWordIndex = -1"
                    :class="` ${keyWords.length == 0 && 'py-[0.53rem]'} min-w-32 flex-1 bg-transparent`" />
                </div>
                <!-- 清空X -->
                <X class=" w-4 h-4 text-gray-400 cursor-pointer" @click="clearIpt"
                  v-show="userIptText.length > 0 || keyWords.length > 0" />
              </div>
              <div class=" w-6">
                <Search class=" w-6 h-6 text-gray-400 cursor-pointer" @click="handleIptEnter" />
              </div>
            </div>
          </div>
          <div class=" relative">
            <CircleHelp class=" text-gray-400 cursor-pointer hover:text-blue-500 transition-all"
              @click="showHelp = !showHelp" />
            <div v-if="showHelp"
              class=" absolute -bottom-1 translate-y-full right-0 md:right-1/2 md:translate-x-1/3 px-4 py-2 min-w-40 bg-white rounded-lg border border-gray-400 text-sm shadow-lg text-gray-500 select-none">
              查询规则：
              <br />
              使用 [;,.，；。-] 进行关键词分割
              <br />
              按下回车进行查询
            </div>
          </div>
        </div>
        <!-- 搜索规则 -->
        <!-- <div class=" w-full flex flex-wrap gap-2 mt-2">
          <div v-for="(item, i) in keyWords" :key="i" @click="handleClickKeyWordBubble(i)"
            :class="` px-2 py-0.5 border border-blue-500 ${item.enable ? 'bg-blue-500 text-white' : 'bg-white text-blue-500'} rounded-lg text-sm select-none cursor-pointer`">
            {{ item.str }}
          </div>
        </div> -->
        <!-- 搜索信息 -->
        <div class=" w-full mt-1" v-show="!isLoading">
          <div class=" text-sm text-gray-400 text-center">一共{{ filteredData.length }}条数据</div>
        </div>
        <!-- 内容 -->
        <div class=" w-full mt-2 overflow-auto">
          <div v-if="isLoading" class=" tracking-wide text-lg text-gray-400">
            loading...
          </div>
          <div v-else-if="filteredData.length == 0" class=" tracking-wide text-lg text-gray-400">
            no result
          </div>
          <div v-else class=" grid grid-cols-1 gap-3 overflow-auto">
            <div v-for="(item, i) in filteredData" :key="i"
              class=" px-7 py-5 rounded-2xl border-2 border-gray-200 bg-white shadow-sm grid grid-cols-1">
              <div class=" text-lg lg:text-xl font-bold hover:underline cursor-pointer mb-1" @click="toUrl(item.url)">
                {{ item.eTitle }}
              </div>
              <div class=" text-base lg:text-lg font-semibold mb-4">
                {{ item.title }}
              </div>
              <div class=" grid grid-cols-1 gap-2">
                <div class=" flex items-start text-sm lg:text-base">
                  <div class=" flex items-center gap-0.5 min-w-20">
                    <Sparkle :size="24" color="#f4d11f" />
                    <div class=" text-nowrap">创新:</div>
                  </div>
                  <div class=" font-light pt-0.5">{{ item.innovation }}</div>
                </div>
                <div class=" flex items-start text-sm lg:text-base">
                  <div class=" flex items-center gap-0.5 min-w-20">
                    <Box :size="24" color="#66a5e1" />
                    <div class=" text-nowrap">方法:</div>
                  </div>
                  <div class=" font-light pt-0.5">{{ item.method }}</div>
                </div>
                <div class=" flex items-start text-sm lg:text-base">
                  <div class=" flex items-center gap-0.5 min-w-20">
                    <CheckCheck :size="24" color="#21d42d" />
                    <div class=" text-nowrap">解决:</div>
                  </div>
                  <div class=" font-light pt-0.5">{{ item.solved }}</div>
                </div>
                <div class=" flex items-start">
                  <div class=" flex items-center gap-0.5 min-w-20">
                    <Tag :size="24" color="#d49b21" />
                    <div class=" text-nowrap text-sm lg:text-base">标签:</div>
                  </div>
                  <div class=" flex flex-wrap gap-1.5 pt-0.5">
                    <div v-for="(tag, j) in item.key" :key="j"
                      class="  px-1 py-0.5 bg-blue-500 border border-blue-600 rounded-lg font-light text-white text-xs lg:text-sm">
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
</template>

<script setup lang="ts">
import CHILBWData from '@/assets/chi-lbw-2024-a-2.json';
import { Search, CircleHelp, Box, CheckCheck, Sparkle, Tag, X } from 'lucide-vue-next';
// @ts-ignore
import { VGithubIcon } from 'v-github-icon';
import { ref } from 'vue';

const userIpt = ref<HTMLInputElement | null>(null);
const iptScrollBox = ref<HTMLDivElement | null>(null);
const userIptText = ref('');

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

// function isChineseOrEnglish(char: string) {
//   const chineseRegex = /[\u4e00-\u9fa5]/;
//   const englishRegex = /[a-zA-Z]/;

//   return chineseRegex.test(char) || englishRegex.test(char);
// }

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

const keyWords = ref<string[]>([]);
const curActiveKeyWordIndex = ref(-1);

const getKeyWords = (str: string) => {
  return str
    .split(/[;,.，；。-]/)
    .map(item => item.trim())
    .filter(item => item.length > 0)
};

const handleIptEnter = () => {
  const iptKW = getKeyWords(userIptText.value);
  for (const kw of iptKW) {
    if (!keyWords.value.includes(kw)) {
      keyWords.value.push(kw);
    }
  }
  userIptText.value = '';
  executeSearch(keyWords.value);
}

const handleIptBackspace = () => {
  if (userIptText.value != '')
    return;
  // userIpt.value?.blur();
  if (curActiveKeyWordIndex.value == -1) {
    curActiveKeyWordIndex.value = keyWords.value.length - 1;
  } else {
    keyWords.value.splice(curActiveKeyWordIndex.value, 1);
    curActiveKeyWordIndex.value = -1;
    executeSearch(keyWords.value);
  }
}

const handleIptLeftArrow = () => {
  if (curActiveKeyWordIndex.value == -1)
    return;
  // if (userIptText.value != '')
  //   return
  const t = curActiveKeyWordIndex.value;
  curActiveKeyWordIndex.value = t <= 0 ? keyWords.value.length - 1 : t - 1;
  // curActiveKeyWordIndex.value = Math.max(0, curActiveKeyWordIndex.value - 1);
}

const handleIptRightArrow = () => {
  if (curActiveKeyWordIndex.value == -1)
    return;
  const t = curActiveKeyWordIndex.value;
  // curActiveKeyWordIndex.value = t >= keyWords.value.length - 1 ? -1 : t + 1;
  curActiveKeyWordIndex.value = t >= keyWords.value.length - 1 ? 0 : t + 1;
  // curActiveKeyWordIndex.value = Math.min(keyWords.value.length - 1, curActiveKeyWordIndex.value + 1);
}

const handleIptEsc = () => {
  if (curActiveKeyWordIndex.value == -1)
    return;
  curActiveKeyWordIndex.value = -1;
}

const handleClickDeleteKeywordBubble = (index: number) => {
  keyWords.value.splice(index, 1);
  executeSearch(keyWords.value);
}

const handleDblclickIpt = () => {
  userIptText.value = keyWords.value.join(';');
  keyWords.value.splice(0);
}

const executeSearch = (kws: string[]) => {
  if (kws.length == 0) {
    filteredData.value = data.value;
    return;
  }

  isLoading.value = true;

  setTimeout(() => {
    isLoading.value = false;
  }, 2000);

  const res: CHILBWItem[] = [];

  CHILBWJoinedStr.value.forEach((item, index) => {
    let flag = true;
    for (const kw of kws) {
      if (!item.includes(kw)) {
        flag = false;
        break;
      }
    }
    flag && res.push(data.value[index])
  });

  // CHILBWJoinedStr.value.forEach((str, i) => {
  //   kws.some(kw => str.includes(kw)) && res.push(data.value[i]);
  // });

  filteredData.value = res;
}

const clearIpt = () => {
  userIptText.value = '';
  keyWords.value.splice(0);
  executeSearch(keyWords.value);
}

const toUrl = (url: string) => {
  window.open(url, "_blank");
}
</script>
