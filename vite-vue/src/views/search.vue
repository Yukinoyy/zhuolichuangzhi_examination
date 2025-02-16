<template>
    <div class="layout">
        <header>
            <div class="header_content">
                <div class="logo_box">
                    <i class="iconfont iconziyuan1 topEdit_logo"></i>
                    <div class="line"></div>
                    <i class="iconfont iconziyuan iJournal_logo"></i>
                </div>
                <div class="nav">
                    <div class="nav_item">
                        <span class="item_text">期刊查询详情</span>
                    </div>
                    <div class="nav_item">
                        <span class="item_text">AI智能选刊</span>
                    </div>
                    <div class="nav_item">
                        <span class="item_text">期刊解析与推荐</span>
                    </div>
                    <div class="nav_item">
                        <span class="item_text">iThenticate查重</span>
                    </div>
                    <div class="nav_item">
                        <span class="item_text">关于我们</span>
                    </div>
                    <div class="nav_item">
                        <div class="login_btn">登录/注册</div>
                    </div>
                </div>
            </div>
        </header>
        <div class="container">
            <div class="header_container">
                <div class="search-input__wrapper">
                    <el-input v-model="params.keyword" style="width: 100%;" placeholder="请输入内容"
                        class="input-with-select">
                        <template #prepend>
                            <el-select v-model="select" placeholder="Select" style="width: 115px">
                                <el-option v-for="item in Object.keys(keywordTypeMap)" :label="item" :value="item" />
                            </el-select>
                        </template>
                        <template #append>
                            <el-button icon="Search" class="custom-button" @click="handleSearch" />
                        </template>
                    </el-input>
                </div>
                <div class="settings">
                    <div class="factor_box">
                        <span class="factor_text">影响因子</span>
                        <div class="factor_input">
                            <div>
                                <el-input style="width: 60px" v-model="params.ifStart_2019" @blur="factorBlur"></el-input>
                            </div>
                            <span class="divide"></span>
                            <div>
                                <el-input style="width: 60px" v-model="params.ifEnd_2019" @blur="factorBlur"></el-input>
                            </div>
                        </div>
                    </div>
                    <customSelect
                        :default="Object.keys(jcrPartitionMap).find(key => jcrPartitionMap[key] == params.jcr)"
                        label="JCR分区" @select="handleJcrSelect" :options="Object.keys(jcrPartitionMap)" width="70">
                    </customSelect>
                    <customSelect
                        :default="Object.keys(partitionMap).find(key => partitionMap[key] == params.sub)"
                        label="分区" @select="handleParSelect" :options="Object.keys(partitionMap)" width="70"></customSelect>
                    <customSelect
                        :default="Object.keys(proportionMap).find(key => proportionMap[key] == params.totalReviewRatio)"
                        label="综述占比"  @select="handleParTotalReviewRatioSelect" :options="Object.keys(proportionMap)" width="90"></customSelect>
                </div>
            </div>
            <div class="content_container">
                <div class="table_content">
                    <el-table :data="tableData" style="width: 100%" @cell-mouse-enter="row => row.hover = true"
                        @cell-mouse-leave="row => row.hover = false" v-loading="loading" empty-text="暂无数据" @sort-change="handleSortChange"
                        :default-sort="{prop: params.order, order: params.orderType ? params.orderType == 'desc' ? 'descending' : 'ascending' : '' }">
                        <el-table-column prop="journalTitle" label="期刊名称" width="215" align="center">
                            <template #default="{ row }">
                                <span :class="{ cell_hover: row.hover }" class="journalTitle_style"> {{ row.journalTitle
                                    }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="journalDb" label="数据库" width="100" align="center" sortable="custom" />
                        <el-table-column prop="impactFactor_2019" label="影响因子" width="140" align="center" sortable="custom" />
                        <el-table-column prop="quote_factor" label="引文指标" width="100" align="center" sortable="custom" />
                        <el-table-column prop="jcr_Json" label="JCR分区" width="100" align="center"
                            :formatter="handleJcrJson" />
                        <el-table-column prop="subZone" label="国内分区" width="100" align="center"
                            :formatter="row => row.subZone ? row.subZone + '区' : '-'" sortable="custom" />
                        <el-table-column prop="annualPublication" label="年发文量" width="100" align="center"
                            :formatter="row => row.annualPublication ? row.annualPublication : '-'" sortable="custom" />
                        <el-table-column prop="totalReviewRatio" label="综述占比" width="100" align="center"
                            :formatter="row => row.totalReviewRatio ? row.totalReviewRatio + '%' : '-'" sortable="custom" />
                        <el-table-column prop="open_ratio" label="是否开源/开源占比" width="85" align="center"
                            :formatter="row => row.open_ratio ? (row.open_ratio * 100).toFixed(2) + '%' : '-'" sortable="custom" />
                        <el-table-column prop="isDomestic" label="是否国产" width="100" align="center"
                            :formatter="row => row.isDomestic ? '是' : '否'" />
                    </el-table>
                    <div class="pagination_wrapper">
                        <el-pagination @current-change="currentChange" background layout="prev, pager, next, jumper"
                            :total="total" :default-page-size="10" v-model:current-page="params.pageNum" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, onBeforeMount, watch } from 'vue';
import customSelect from '@/components/select.vue';
import { getData } from '@/utils/api';
import { ElMessage } from 'element-plus';

const select = ref('期刊名称');

const keywordTypeMap = {
    'ISSN': 'issn',
    '期刊名称': 'title',
    '简称': 'abbr',
    '学科分类': 'category',
}

const jcrPartitionMap = {
    '不限': '',
    'Q1': 8,
    'Q2': 4,
    'Q3': 2,
    'Q4': 1,
}

const partitionMap = {
    '不限': '',
    '1区': 1,
    '2区': 2,
    '3区': 3,
    '4区': 4,
}

const proportionMap = {
    '不限': 'all',
    '0~5%': 1,
    '5%~10%': 2,
    '10%~20%': 3,
    '20%~30%': 4,
    '30%~50%': 5,
    '50%以上': 6
}

const tableData = ref([]);

const total = ref(0);

const loading = ref(false);

const factorBlur = () => {
    if(params.ifStart_2019) {
        if((/^\d+(\.\d{1,3})?$/).test(params.ifStart_2019)) {
            if(params.ifEnd_2019) {
                if((/^\d+(\.\d{1,3})?$/).test(params.ifEnd_2019)) {
                    loadData();
                } else {
                    ElMessage.warning('请输入正确的影响因子（精确三位小数）')
                }
            } else {
                ElMessage.warning('请输入影响因子结束值')
            }
        } else {
            ElMessage.warning('请输入正确的影响因子（精确三位小数）')
        }
    } else {
        ElMessage.warning('请输入影响因子开始值')
    }
}

const params = reactive({
    pageNum: 1,
    pageSize: 10,
    total: 0,
    keywordType: keywordTypeMap[select.value],
    keyword: '',
    ifStart_2019: '',
    ifEnd_2019: '',
    ifStart: '',
    ifEnd: '',
    jcr: '',
    sub: '',
    selfCitingRate: 'all',
    compatriotRate: 'all',
    isDomestic: '',
    totalReviewRatio: 'all',
    categoryId: '',
    recommend: 0,
    selfStart: '',
    selfEnd: '',
    numberStart: '',
    numberEnd: '',
    trrl: '',
    trrr: '',
    order: '',
    orderType: ''
})

const currentChange = async (page) => {
    loadData(page);
}

onBeforeMount(() => {
    // 页面刷新时从url中取出参数，此处可优化
    const { hash } = window.location;
    const paramsArr = new URLSearchParams(hash.split('?')[1]);
    paramsArr.forEach((value, key) => {
        if (key == 'keywordType' && value) {
            select.value = Object.keys(keywordTypeMap).find(key => keywordTypeMap[key] == value);
        } else if (key == 'pageNum' && value) {
            params.pageNum = Number(value);
        } else if (key == 'keyword' && value) {
            params.keyword = value;
        } else if (key == 'jcr' && value) {
            params.jcr = value;
        } else if (key == 'sub' && value) {
            params.sub = value;
        } else if (key == 'totalReviewRatio' && value) {
            params.totalReviewRatio = value;
        } else if (key == 'ifStart_2019' && value) {
            params.ifStart_2019 = value;
        } else if (key == 'ifEnd_2019' && value) {
            params.ifEnd_2019 = value;
        } else if (key == 'order' && value) {
            params.order = value;
        } else if (key == 'orderType') {
            params.orderType = value;
        }
    });
    if(!params.keyword) {
        params.categoryId = '1e78b26454e2878930f44c6a571be497';
    }
    loadData(params.pageNum);
})

// 加载数据
const loadData = async (pageNum = 1) => {
    params.pageNum = Number(pageNum);
    params.keywordType = keywordTypeMap[select.value];
    loading.value = true;
    try {
        const res = await getData(params);
        const queryString = new URLSearchParams(params).toString();
        const { origin } = window.location;
        window.location.replace(origin + '#/search?' + queryString);
        tableData.value = res.data.data_original.data;
        total.value = res.data.data_original.total;
    } catch (error) {
        console.log(error)
    }
    loading.value = false;
}

// 处理解析json字符串时可能发生的错误
const handleJcrJson = (row) => {
    try {
        const jsonObj = JSON.parse(row.jcr_Json);
        if(jsonObj[0] && jsonObj[0].sub) return jsonObj[0].sub;
    } catch (error) {
    }
    return '-';
}

// 搜索框逻辑
const handleSearch = () => {
    if (params.keyword.trim()) {
        params.categoryId = '';
        loadData();
    } else {
        ElMessage.warning('请输入关键词搜索');
    }
}

// jcr选择
const handleJcrSelect = (command) => {
    params.jcr = jcrPartitionMap[command];
    loadData();
}

// 地区选择
const handleParSelect = (command) => {
    params.sub = partitionMap[command];
    loadData();
}

// 综述占比选择
const handleParTotalReviewRatioSelect = (command) => {
    params.totalReviewRatio = proportionMap[command];
    loadData();
}

// 处理排序
const handleSortChange = (column) => {
    params.order = column.prop;
    if(column.order == 'ascending') {
        params.orderType = 'asc';
    } else if (column.order == 'descending') {
        params.orderType = 'desc';
    } else {
        params.orderType = '';
    }
    loadData();
}
</script>

<style>
.layout {
    display: flex;
    flex-direction: column;
    min-width: 1280px;
    min-height: 100%;
    background-color: #f6f6f8;
}

header {
    background-color: #fff;
}

.header_content {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-pack: justify;
    -ms-flex-pack: justify;
    justify-content: space-between;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    height: 51px;
    width: 1280px;
    padding: 0 50px;
    margin: 0 auto;
}

.header_content .nav {
    display: flex;
}

.header_content .nav_item {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    height: 30px;
    padding: 0 20px;
    cursor: pointer;
}

.header_content .nav_item .login_btn {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    padding: 0 5px;
    height: 32px;
    background: #0FA4B3;
    font-size: 14px;
    color: white;
    -webkit-transition: all 0.3s ease;
    transition: all 0.3s ease;
    font-family: "PingFang SC";
    font-size: 14px;
}

.header_content .nav_item .login_btn:hover {
    background-color: rgb(63, 182, 194);
}

.header_content .nav_item .item_text {
    color: #606266;
    font-weight: 500;
    font-family: "PingFang SC";
    transition: all .3s ease;
    font-size: 14px;
}

.header_content .nav_item .item_text:hover {
    color: #0fa4b3;
}

.header_content .nav .nav_item+.nav_item {
    border-left: 1px solid rgba(0, 0, 0, .2);
}

.logo_box {
    display: flex;
}

.logo_box i:first-child {
    width: 115px;
    height: 26px;
    line-height: 26px;
    font-size: 26px;
    color: #0083ca;
    cursor: pointer;
    margin-top: 4px;
}

.logo_box i:last-child {
    width: 82px;
    height: 26px;
    line-height: 26px;
    font-size: 26px;
    color: #0FA4B3;
    cursor: pointer;
    margin-bottom: 4px;
    cursor: pointer;
}

.logo_box .line {
    width: 1px;
    height: 30px;
    background: rgba(0, 0, 0, 0.2);
    margin: 0 16px;
}

.container {
    flex: 1;
}

.header_container {
    height: 138px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    border-top: 1px solid #dcdfe6;
    -webkit-box-shadow: 0 5px 7px rgba(0, 0, 0, .1);
    box-shadow: 0 5px 7px rgba(0, 0, 0, .1);
    background-color: #fff;
    padding: 20px 50px 14px;
}

.search-input__wrapper .el-input-group__prepend {
    background-color: var(--el-fill-color-blank);
}

.search-input__wrapper .el-input__wrapper {
    box-shadow: unset;
    height: 46px;
    border-left: 1px solid #dcdfe6;
}

.search-input__wrapper .el-input__wrapper:hover {
    box-shadow: unset;
}

.search-input__wrapper .el-input-group__prepend {
    box-shadow: unset;
}

.search-input__wrapper .el-input__wrapper.is-focus {
    box-shadow: unset !important;
}

.search-input__wrapper {
    width: 800px;
    margin: 0 auto;
    height: 48px;
    border: 1px solid #0fa4b3;
}

.search-input__wrapper .el-select {
    box-shadow: unset !important;
}

.search-input__wrapper .el-select__wrapper {
    box-shadow: unset !important;
}

.search-input__wrapper .el-input-group__append {
    background-color: #0fa4b3;
    border-radius: unset;
}

.search-input__wrapper .custom-button {
    width: 60px;
}

.search-input__wrapper .custom-button i {
    color: white;
}

.settings {
    margin: 0 auto;
    display: flex;
    width: 1280px;
    justify-content: space-around;
}

.settings .factor_box {
    display: flex;
    align-items: center;
}

.settings .factor_box .factor_text {
    margin-right: 10px;
}

.settings .factor_box .factor_input {
    display: flex;
    align-items: center;
}

.settings .factor_box .factor_input .divide {
    width: 10px;
    height: 1px;
    background: #dcdfe6;
    margin: 0 5px;
}

.el-input__wrapper {
    border-radius: unset;
}

.el-popper__arrow::before {
    width: 0;
    height: 0;
}

.el-dropdown-menu__item {
    width: 140px;
}

.el-dropdown-menu__item:hover {
    background-color: #f5f7fa !important;
}

.el-dropdown-menu__item:focus {
    background-color: #f5f7fa !important;
    color: #606266 !important;
}

.el-dropdown-menu__item.is_selected {
    color: #0fa4b3 !important;
    font-weight: 700;
    background-color: #f5f7fa !important;
}

.settings .jcr_partition {
    display: flex;
    align-items: center;
}

.settings .jcr_partition .el-dropdown {
    width: 70px;
    display: flex;
    justify-content: end;
    cursor: pointer;
}

.el-popper.is-pure.is-light.el-dropdown__popper {
    margin-top: 12px;
}

.content_container {
    padding: 18px 0;
}

.table_content {
    width: 1180px;
    background-color: #fff;
    padding: 0 20px;
    margin: 0 auto;
}

.el-table .el-table__cell {
    padding: 12px 0;
}

.el-table thead th .cell {
    color: #909399;
    font-weight: 500;
    padding: 0 10px;
}

.el-table thead th {
    height: 104.8px;
}

.journalTitle_style {
    color: #303133;
    cursor: pointer;
}

.cell_hover {
    text-decoration: underline;
    color: #0fa4b3;
}

.table_content .pagination_wrapper {
    height: 60px;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>