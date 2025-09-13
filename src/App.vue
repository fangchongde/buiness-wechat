<template>
    <div id="app" class="min-h-screen bg-gray-50">
        <!-- 角色切换器 -->
        <div class="role-switcher">
            <div class="role-switcher-content">
                <label class="role-label">模拟用户角色:</label>
                <select
                    v-model="userRole"
                    @change="handleRoleChange"
                    class="role-select"
                >
                    <option value="employee">普通员工 (张三)</option>
                    <option value="leader_hq">总公司领导</option>
                    <option value="leader_branch">
                        分公司领导 (北京分公司)
                    </option>
                </select>
                <div class="current-user">
                    当前用户: {{ getCurrentUserDisplay() }}
                </div>
            </div>
        </div>

        <HomePage
            v-if="currentPage === 'home'"
            @navigate="handleNavigation"
            :user-role="userRole"
            :employee-name="userAssociatedName"
        />
        <ProjectList
            v-if="currentPage === 'project-list'"
            @go-back="goBack"
            @select-project="handleProjectSelection"
        />
        <ProjectBasicInput
            v-if="currentPage === 'project-basic-input'"
            @go-back="goBack"
        />
        <ProjectInfoInput
            v-if="currentPage === 'project-info-input'"
            @go-back="goBackToProjectList"
            :selected-project="selectedProject"
        />
        <LaborInput v-if="currentPage === 'labor-input'" @go-back="goBack" />
        <ExpenseInput
            v-if="currentPage === 'expense-input'"
            @go-back="goBack"
        />
        <IncomeInput v-if="currentPage === 'income-input'" @go-back="goBack" />
        <SharedExpenseInput
            v-if="currentPage === 'shared-expense-input'"
            @go-back="goBack"
        />
        <HeadquartersAnalysis
            v-if="currentPage === 'headquarters-analysis'"
            @go-back="goBackToRoleHome"
        />
        <BranchAnalysis
            v-if="currentPage === 'branch-analysis'"
            @go-back="goBackToRoleHome"
            :initial-branch-id="userBranchId"
        />
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import HomePage from "./components/HomePage.vue";
import ProjectList from "./components/ProjectList.vue";
import ProjectBasicInput from "./components/ProjectBasicInput.vue";
import ProjectInfoInput from "./components/ProjectInfoInput.vue";
import LaborInput from "./components/LaborInput.vue";
import ExpenseInput from "./components/ExpenseInput.vue";
import IncomeInput from "./components/IncomeInput.vue";
import SharedExpenseInput from "./components/SharedExpenseInput.vue";
import HeadquartersAnalysis from "./components/HeadquartersAnalysis.vue";
import BranchAnalysis from "./components/BranchAnalysis.vue";

const currentPage = ref("home");
const selectedProject = ref<any>(null);

// 用户角色和信息 - 在实际应用中这些信息会从认证系统获取
const userRole = ref("employee"); // 'employee' | 'leader_hq' | 'leader_branch'
const userAssociatedName = ref("张三"); // 员工姓名
const userBranchId = ref("1"); // 分公司ID（仅对分公司领导有效）

// 根据用户角色设置默认页面
onMounted(() => {
    if (userRole.value === "leader_hq") {
        currentPage.value = "headquarters-analysis";
    } else if (userRole.value === "leader_branch") {
        currentPage.value = "branch-analysis";
    }
    // 普通员工保持在 home 页面
});

// 获取当前用户显示信息
const getCurrentUserDisplay = () => {
    switch (userRole.value) {
        case "employee":
            return `员工 - ${userAssociatedName.value}`;
        case "leader_hq":
            return "总公司领导";
        case "leader_branch":
            return "分公司领导 - 北京分公司";
        default:
            return "未知用户";
    }
};

// 处理角色切换
const handleRoleChange = () => {
    // 根据新角色更新关联信息
    switch (userRole.value) {
        case "employee":
            userAssociatedName.value = "张三";
            userBranchId.value = "1";
            currentPage.value = "home";
            break;
        case "leader_hq":
            userAssociatedName.value = "总公司领导";
            userBranchId.value = "";
            currentPage.value = "headquarters-analysis";
            break;
        case "leader_branch":
            userAssociatedName.value = "分公司领导";
            userBranchId.value = "1";
            currentPage.value = "branch-analysis";
            break;
    }
};

const handleNavigation = (page: string) => {
    currentPage.value = page;
};

const goBack = () => {
    goBackToRoleHome();
};

const goBackToRoleHome = () => {
    if (userRole.value === "leader_hq") {
        currentPage.value = "headquarters-analysis";
    } else if (userRole.value === "leader_branch") {
        currentPage.value = "branch-analysis";
    } else {
        currentPage.value = "home";
    }
};

const goBackToProjectList = () => {
    currentPage.value = "project-list";
};

const handleProjectSelection = (project: any) => {
    console.log("选择的项目:", project);
    selectedProject.value = project;
    // 跳转到项目信息录入页面
    currentPage.value = "project-info-input";
};
</script>

<style>
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto",
        sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}

#app {
    background-color: #f9fafb;
}

/* 角色切换器样式 */
.role-switcher {
    background: linear-gradient(135deg, #dc2626 0%, #ef4444 100%);
    color: white;
    padding: 0.5rem 0.75rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    z-index: 1000;
    font-size: 0.875rem;
}

.role-switcher-content {
    display: flex;
    align-items: center;
    gap: 1rem;
    max-width: 1200px;
    margin: 0 auto;
    flex-wrap: wrap;
}

.role-label {
    font-weight: 500;
    white-space: nowrap;
    font-size: 0.8125rem;
}

.role-select {
    padding: 0.25rem 0.5rem;
    border: none;
    border-radius: 4px;
    font-size: 0.875rem;
    background: white;
    color: #374151;
    min-width: 180px;
    transition: all 0.2s ease;
}

.role-select:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.5);
}

.current-user {
    font-weight: 600;
    background: rgba(255, 255, 255, 0.2);
    padding: 0.25rem 0.75rem;
    border-radius: 12px;
    white-space: nowrap;
    font-size: 0.8125rem;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.1);
}

/* 为主要内容添加顶部边距，避免被角色切换器遮挡 */
#app > * {
    /* margin-top: 3rem; */
}

/* 响应式设计 */
@media (max-width: 480px) {
    .role-switcher {
        padding: 0.375rem 0.5rem;
    }

    .role-switcher-content {
        flex-direction: column;
        gap: 0.375rem;
        align-items: stretch;
    }

    .role-label {
        font-size: 0.75rem;
        text-align: center;
        margin-bottom: 0.125rem;
    }

    .role-select {
        min-width: 100%;
        padding: 0.375rem 0.5rem;
        font-size: 0.8125rem;
        border-radius: 6px;
    }

    .current-user {
        text-align: center;
        font-size: 0.75rem;
        padding: 0.375rem 0.5rem;
        border-radius: 8px;
    }

    #app > * {
        /* margin-top: 4.5rem; */
    }
}

@media (max-width: 640px) {
    .role-switcher {
        padding: 0.5rem;
    }

    .role-switcher-content {
        flex-direction: column;
        gap: 0.5rem;
        align-items: flex-start;
    }

    .role-select {
        min-width: 100%;
    }

    .current-user {
        align-self: stretch;
        text-align: center;
    }

    #app > * {
        /* margin-top: 4rem; */
    }
}

@media (min-width: 481px) and (max-width: 640px) {
    .role-switcher {
        padding: 0.5rem 0.75rem;
    }

    .role-switcher-content {
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: space-between;
        align-items: center;
        gap: 0.75rem;
    }

    .role-label {
        font-size: 0.8125rem;
    }

    .role-select {
        flex: 1;
        min-width: 160px;
        max-width: 200px;
    }

    .current-user {
        flex: 1;
        text-align: center;
        min-width: 120px;
    }

    #app > * {
        /* margin-top: 3.5rem; */
    }
}

@media (min-width: 641px) and (max-width: 767px) {
    .role-switcher-content {
        justify-content: space-between;
        align-items: center;
    }

    .role-select {
        min-width: 200px;
    }

    .current-user {
        margin-left: auto;
    }
}
@media (min-width: 768px) {
    .role-switcher-content {
        justify-content: space-between;
        align-items: center;
        flex-wrap: nowrap;
    }

    .role-label {
        font-size: 0.875rem;
    }

    .role-select {
        min-width: 200px;
    }

    .current-user {
        margin-left: auto;
        font-size: 0.875rem;
    }
}

/* 触摸设备优化 */
@media (hover: none) and (pointer: coarse) {
    .role-select {
        padding: 0.5rem 0.75rem;
        font-size: 16px; /* 防止iOS缩放 */
        min-height: 44px; /* iOS推荐的最小触摸目标 */
    }

    .role-select:focus {
        box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.3);
    }
}

/* 横屏模式优化 */
@media (max-width: 896px) and (orientation: landscape) {
    .role-switcher {
        padding: 0.25rem 0.5rem;
    }

    .role-switcher-content {
        flex-direction: row;
        gap: 0.5rem;
        align-items: center;
    }

    .role-label {
        font-size: 0.75rem;
    }

    .role-select {
        min-width: 140px;
        padding: 0.25rem 0.5rem;
        font-size: 0.8125rem;
    }

    .current-user {
        font-size: 0.75rem;
        padding: 0.25rem 0.5rem;
    }

    #app > * {
        /* margin-top: 2.5rem; */
    }
}
</style>
