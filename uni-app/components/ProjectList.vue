<template>
    <div class="project-list">
        <!-- 头部导航 -->
        <header class="header">
            <div class="header-content">
                <uv-button class="back-btn" @click="goBack" icon="arrow-left" color="rgba(255, 255, 255, 0.2)"></uv-button>
                <h1 class="page-title">项目信息录入</h1>
                <div class="header-spacer"></div>
            </div>
        </header>

        <!-- 搜索和筛选 -->
        <div class="search-section">
            <div class="search-container">
                <div class="search-box">
					<uv-input
                        v-model="searchQuery"
						placeholder="搜索项目名称或编号"
						prefixIcon="search"
						prefixIconStyle="font-size: 22px;color: #909399"
					></uv-input>
                </div>
				<uv-button icon="search" type="default" @click="showFilters = !showFilters" text="筛选"></uv-button>
            </div>

            <!-- 筛选面板 -->
            <div v-if="showFilters" class="filter-panel">
                <div class="filter-row">
                    <label class="filter-label">项目状态</label>
                    <uni-data-select v-model="statusFilter" class="filter-select" :localdata="localdata"></uni-data-select>
                </div>
                <div class="filter-row">
                    <label class="filter-label">负责人</label>
                    <uni-data-select v-model="managerFilter" class="filter-select" :localdata="localdata1"></uni-data-select>
                </div>
            </div>
        </div>

        <!-- 项目列表 -->
        <div class="project-list-container">
            <div class="list-header">
                <h2 class="list-title">选择项目进行信息录入</h2>
                <p class="list-subtitle">
                    共 {{ filteredProjects.length }} 个项目
                </p>
            </div>

            <div class="projects-grid">
                <div
                    v-for="project in filteredProjects"
                    :key="project.id"
                    class="project-card"
                    @click="selectProject(project)"
                >
                    <div class="project-header">
                        <div class="project-info">
                            <h3 class="project-name">{{ project.name }}</h3>
                            <p class="project-code">{{ project.code }}</p>
                        </div>
                        <div
                            class="project-status"
                            :class="getStatusClass(project.status)"
                        >
                            {{ project.status }}
                        </div>
                    </div>

                    <div class="project-details">
                        <div class="detail-item">
                            <Building class="w-4 h-4 text-gray-400" />
                            <span class="detail-text">{{
                                project.constructionUnit
                            }}</span>
                        </div>
                        <div class="detail-item">
                            <User class="w-4 h-4 text-gray-400" />
                            <span class="detail-text">{{
                                project.manager
                            }}</span>
                        </div>
                        <div class="detail-item">
                            <Calendar class="w-4 h-4 text-gray-400" />
                            <span class="detail-text">{{
                                formatDate(project.startDate)
                            }}</span>
                        </div>
                        <div class="detail-item">
                            <DollarSign class="w-4 h-4 text-gray-400" />
                            <span class="detail-text"
                                >{{ project.contractAmount }}万元</span
                            >
                        </div>
                    </div>

                    <div class="project-progress">
                        <div class="progress-info">
                            <span class="progress-label">项目进度</span>
                            <span class="progress-value"
                                >{{ project.progress }}%</span
                            >
                        </div>
                        <div class="progress-bar">
                            <div
                                class="progress-fill"
                                :style="{ width: project.progress + '%' }"
                            ></div>
                        </div>
                    </div>

                    <div class="project-actions">
                        <ChevronRight class="w-5 h-5 text-gray-400" />
                    </div>
                </div>
            </div>

            <!-- 空状态 -->
            <div v-if="filteredProjects.length === 0" class="empty-state">
                <FileX class="w-16 h-16 text-gray-300" />
                <h3 class="empty-title">暂无项目</h3>
                <p class="empty-desc">没有找到符合条件的项目</p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { getProject } from '@/api/project.js'
import { getProgress } from '@/api/progress.js'
import { getCache, parseTime} from '@/utils/index.js'
import { translateDict } from '@/api/dict.js'
const { project_status } = getCache('dict')
const project_status_dict = ref(project_status)

// 定义事件
const emit = defineEmits<{
    goBack: [];
    selectProject: [project: any];
}>();

// 搜索和筛选状态
const searchQuery = ref("");
const statusFilter = ref("");
const managerFilter = ref("");
const showFilters = ref(false);
const localdata = computed(()=>{
	return [
		{value:"",text:"全部状态"},
		...project_status_dict.value
	]
})
const localdata1 = computed(()=>{
	return [
		{value:"",text:"全部负责人"},
	]
})
const projects = ref([])
const renderProjectList = async ()=>{
	const list = await getProject()
	const progressList = await getProgress()
	projects.value = list.rows.map(x=>{
		return {
			id: x.id,
			code: x.projectCode,
			name: x.projectName,
			constructionUnit: x.constructionUnit,
			manager: x.projectManager,
			startDate: x.startDate,
			contractAmount: x.contractAmount,
			status: x.projectStatus,
			progress: 0,
			progressInfo:progressList.rows.find(z=>z.projectId === x.id)
		}
	})
}
renderProjectList()
// 筛选后的项目列表
const filteredProjects = computed(() => {
    return projects.value.filter((project) => {
        const matchesSearch =
            !searchQuery.value ||
            project.name
                .toLowerCase()
                .includes(searchQuery.value.toLowerCase()) ||
            project.code
                .toLowerCase()
                .includes(searchQuery.value.toLowerCase());

        const matchesStatus =
            !statusFilter.value || project.status === statusFilter.value;
        const matchesManager =
            !managerFilter.value || project.manager === managerFilter.value;

        return matchesSearch && matchesStatus && matchesManager;
    });
});

// 返回上一页
const goBack = () => {
    emit("goBack");
};

// 选择项目
const selectProject = (project: any) => {
    console.log("选择项目:", project);
    emit("selectProject", project);
};

// 获取状态样式类
const getStatusClass = (status: string) => {
    switch (status) {
        case "1":
            return "status-active";
        case "2":
            return "status-completed";
        case "3":
            return "status-paused";
        default:
            return "status-default";
    }
};

// 格式化日期
const formatDate = (dateString: string) => {
  return parseTime(dateString,'{y}-{m}-{d}')
}

</script>

<style scoped>
.project-list {
    min-height: 100vh;
    background: #f9fafb;
}

/* 头部样式 */
.header {
    background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
    color: white;
    padding: 1rem 0.75rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    position: sticky;
    top: 0;
    z-index: 10;
}

.header-content {
    display: flex;
    align-items: center;
    gap: 1rem;
    max-width: 100%;
}

.back-btn {
    background: rgba(255, 255, 255, 0.2);
    border: none;
    border-radius: 8px;
    padding: 0.5rem;
    color: white;
    cursor: pointer;
    transition: background-color 0.2s;
    flex-shrink: 0;
}

.back-btn:hover {
    background: rgba(255, 255, 255, 0.3);
}

.page-title {
    font-size: 1.125rem;
    font-weight: 600;
    margin: 0;
    flex: 1;
    text-align: center;
}

.header-spacer {
    width: 2.5rem;
    flex-shrink: 0;
}

/* 搜索和筛选区域 */
.search-section {
    background: white;
    padding: 1rem 0.75rem;
    border-bottom: 1px solid #e5e7eb;
}

.search-container {
    display: flex;
    gap: 0.75rem;
    align-items: center;
}

.search-box {
    flex: 1;
    position: relative;
    display: flex;
    align-items: center;
}

.search-box .w-4 {
    position: absolute;
    left: 0.75rem;
    z-index: 1;
}

.search-input {
    width: 100%;
    padding: 0.75rem 0.75rem 0.75rem 2.5rem;
    border: 1px solid #3b3b3b;
    border-radius: 8px;
    font-size: 0.875rem;
    background: #3b3b3b;
}

.search-input:focus {
    outline: none;
    border-color: #3b82f6;
    background: 3b3b3b;
}

.filter-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1rem;
    background: #f3f4f6;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    font-size: 0.875rem;
    color: #374151;
    cursor: pointer;
    transition: all 0.2s;
}

.filter-btn:hover {
    background: #e5e7eb;
}

.filter-panel {
    margin-top: 1rem;
    padding: 1rem;
    background: #f9fafb;
    border-radius: 8px;
    border: 1px solid #e5e7eb;
}

.filter-row {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 0.75rem;
}

.filter-row:last-child {
    margin-bottom: 0;
}

.filter-label {
    font-size: 0.875rem;
    font-weight: 500;
    color: #374151;
    min-width: 4rem;
}

.filter-select {
    flex: 1;
    padding: 0.5rem;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    font-size: 0.875rem;
    background: white;
}

/* 项目列表容器 */
.project-list-container {
    padding: 1rem 0.75rem;
}

.list-header {
    margin-bottom: 1rem;
}

.list-title {
    font-size: 1rem;
    font-weight: 600;
    color: #1f2937;
    margin: 0 0 0.25rem 0;
}

.list-subtitle {
    font-size: 0.875rem;
    color: #6b7280;
    margin: 0;
}

/* 项目卡片网格 */
.projects-grid {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

.project-card {
    background: white;
    border-radius: 12px;
    padding: 1rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    transition: all 0.2s;
    border: 1px solid transparent;
}

.project-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    border-color: #3b82f6;
}

.project-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 0.75rem;
}

.project-info {
    flex: 1;
    min-width: 0;
}

.project-name {
    font-size: 0.9375rem;
    font-weight: 600;
    color: #1f2937;
    margin: 0 0 0.25rem 0;
    line-height: 1.3;
}

.project-code {
    font-size: 0.75rem;
    color: #6b7280;
    margin: 0;
    font-family: monospace;
}

.project-status {
    padding: 0.25rem 0.5rem;
    border-radius: 12px;
    font-size: 0.75rem;
    font-weight: 500;
    flex-shrink: 0;
}

.status-active {
    background: #dbeafe;
    color: #1d4ed8;
}

.status-completed {
    background: #d1fae5;
    color: #065f46;
}

.status-paused {
    background: #fef3c7;
    color: #92400e;
}

.status-default {
    background: #f3f4f6;
    color: #374151;
}

/* 项目详情 */
.project-details {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.5rem;
    margin-bottom: 0.75rem;
}

.detail-item {
    display: flex;
    align-items: center;
    gap: 0.375rem;
}

.detail-text {
    font-size: 0.75rem;
    color: #6b7280;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

/* 进度条 */
.project-progress {
    margin-bottom: 0.75rem;
}

.progress-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.375rem;
}

.progress-label {
    font-size: 0.75rem;
    color: #6b7280;
}

.progress-value {
    font-size: 0.75rem;
    font-weight: 600;
    color: #1f2937;
}

.progress-bar {
    height: 4px;
    background: #e5e7eb;
    border-radius: 2px;
    overflow: hidden;
}

.progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #3b82f6, #1d4ed8);
    border-radius: 2px;
    transition: width 0.3s ease;
}

/* 项目操作 */
.project-actions {
    display: flex;
    justify-content: flex-end;
    align-items: center;
}

/* 空状态 */
.empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 3rem 1rem;
    text-align: center;
}

.empty-title {
    font-size: 1.125rem;
    font-weight: 600;
    color: #374151;
    margin: 1rem 0 0.5rem 0;
}

.empty-desc {
    font-size: 0.875rem;
    color: #6b7280;
    margin: 0;
}

/* 响应式设计 */
@media (max-width: 320px) {
    .search-section {
        padding: 0.75rem 0.5rem;
    }

    .project-list-container {
        padding: 0.75rem 0.5rem;
    }

    .project-details {
        grid-template-columns: 1fr;
        gap: 0.375rem;
    }
}

@media (min-width: 375px) {
    .search-section {
        padding: 1rem 0.875rem;
    }

    .project-list-container {
        padding: 1rem 0.875rem;
    }
}

@media (min-width: 768px) {
    .header {
        padding: 1.5rem 1rem;
    }

    .header-content {
        max-width: 1200px;
        margin: 0 auto;
    }

    .search-section {
        padding: 1.5rem 1rem;
    }

    .search-container {
        max-width: 1200px;
        margin: 0 auto;
    }

    .project-list-container {
        padding: 1.5rem 1rem;
        max-width: 1200px;
        margin: 0 auto;
    }

    .projects-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 1rem;
    }

    .project-card {
        padding: 1.25rem;
    }

    .project-name {
        font-size: 1rem;
    }

    .detail-text {
        font-size: 0.875rem;
    }
}

@media (min-width: 1024px) {
    .projects-grid {
        grid-template-columns: repeat(3, 1fr);
    }
}
</style>
