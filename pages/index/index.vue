<template>
    <div id="app" class="min-h-screen bg-gray-50">
		<uv-toast ref="toastRef"></uv-toast>
		<template v-if="showPage">
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
		</template>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted,defineOptions,getCurrentInstance,nextTick } from "vue";
import HomePage from "../../components/HomePage.vue";
import ProjectList from "../../components/ProjectList.vue";
import ProjectBasicInput from "../../components/ProjectBasicInput.vue";
import ProjectInfoInput from "../../components/ProjectInfoInput.vue";
import LaborInput from "../../components/LaborInput.vue";
import ExpenseInput from "../../components/ExpenseInput.vue";
import IncomeInput from "../../components/IncomeInput.vue";
import SharedExpenseInput from "../../components/SharedExpenseInput.vue";
import HeadquartersAnalysis from "../../components/HeadquartersAnalysis.vue";
import BranchAnalysis from "../../components/BranchAnalysis.vue";
import { useToast } from '@/hooks/useToast.js'
import { getCache, setCache } from '@/utils/index.js'
import { batchGetDict } from "../../api/dict";
import { getUserInfo} from '@/api/login.js'
const { registerHandler } = useToast()
const toastRef = ref(null)
const showPage = ref(false)
let userInfo = ref(null)
onMounted(async () => {
	userInfo.value = await getUserInfo()
	if(!userInfo.value){
		return uni.redirectTo({
			url: '/pages/login/index'
		})		
	}
	registerHandler(toastRef.value)
	await initDict()
	initUser()
	showPage.value = true
})
const initDict = async ()=>{
	const DICTS = ['project_status','income_category','expenditure_category','expenses_category']
	let dictResult = await batchGetDict(DICTS) as any
	dictResult = dictResult.reduce((f,s)=>{
		const { dictType } = s.rows[0]
		f[dictType] = s.rows.map(x=>{
			return {
				text:x.dictLabel,
				value:x.dictValue
			}
		})
		return f
	},{})
	dictResult.validTime = 1000 * 60 * 60 * 24 * 5 //字典设置5天的缓存
	setCache('dict',dictResult)
}

defineOptions({
  components: {
    HomePage,
	ProjectList,
	ProjectBasicInput,
	ProjectInfoInput,
	LaborInput,
	ExpenseInput,
	IncomeInput,
	SharedExpenseInput,
	HeadquartersAnalysis,
	BranchAnalysis
  }
})
const currentPage = ref("");
const selectedProject = ref<any>(null);
const userRole = ref(""); // 'employee' | 'leader_hq' | 'leader_branch'
const userAssociatedName = ref(""); // 员工姓名
const userBranchId = ref(""); // 分公司ID（仅对分公司领导有效）
const initUser = ()=>{
	const { roles,user } = userInfo.value.data
	userAssociatedName.value = user.nickName
	userBranchId.value = user.branchId
	if(roles.includes('hqadmin')){
		userRole.value = "leader_hq";
		currentPage.value = "headquarters-analysis";
	}else if(roles.includes('branchadmin')){
		userRole.value = "leader_branch";
		currentPage.value = "branch-analysis";
	}else{
		userRole.value = "employee";
		currentPage.value = "home";
	}
}
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
	color: white;
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
	color: white;
    border: 1px solid rgba(255, 255, 255, 0.1);
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
}
</style>
