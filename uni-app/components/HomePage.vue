<template>
  <div class="home-page">
	<uv-modal ref="modal" title="提示" content='是否退出登录用户登录？' @confirm="exit"></uv-modal>
    <!-- 顶部头部 -->
    <header class="header">
      <div class="header-content">
        <div class="company-info">
          <div class="company-logo">
            <!-- <Building class="w-8 h-8" /> -->
			<image src="../static/icon/activity.png" mode="widthFix" style="width:40rpx"></image>
          </div>
          <div class="company-text">
            <h1 class="company-name">建筑经营管理</h1>
            <p class="company-subtitle">Construction Management</p>
          </div>
        </div>
        <div class="user-info">
          <div class="avatar">
				<uv-icon name="share-square" size="50rpx" @click="$refs.modal.open()"></uv-icon>
          </div>
        </div>
      </div>
    </header>

    <!-- 数据概览卡片 -->
    <section class="overview-section" v-if="userRole === 'leader'">
      <div class="overview-container">
        <h2 class="section-title">经营概览</h2>
        <div class="stats-grid">
          <div class="stat-card primary">
            <div class="stat-icon">
              <TrendingUp class="w-6 h-6" />
            </div>
            <div class="stat-content">
              <p class="stat-label">本月总收入</p>
              <p class="stat-value">¥2,680,000</p>
              <span class="stat-change positive">+12.5%</span>
            </div>
          </div>
          <div class="stat-card secondary">
            <div class="stat-icon">
              <DollarSign class="w-6 h-6" />
            </div>
            <div class="stat-content">
              <p class="stat-label">本月总支出</p>
              <p class="stat-value">¥1,920,000</p>
              <span class="stat-change positive">-8.3%</span>
            </div>
          </div>
          <div class="stat-card accent">
            <div class="stat-icon">
              <Calendar class="w-6 h-6" />
            </div>
            <div class="stat-content">
              <p class="stat-label">在建项目</p>
              <p class="stat-value">15个</p>
              <span class="stat-change neutral">+2个</span>
            </div>
          </div>
          <div class="stat-card success">
            <div class="stat-icon">
              <Users class="w-6 h-6" />
            </div>
            <div class="stat-content">
              <p class="stat-label">在职员工</p>
              <p class="stat-value">248人</p>
              <span class="stat-change positive">+15人</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 功能模块导航 -->
    <section class="modules-section">
      <div class="modules-container">
        <h2 class="section-title">功能模块</h2>
        <!-- 数据录入模块 -->
        <div class="module-group">
          <h3 class="group-title">
            <!-- <Edit3 class="w-5 h-5" /> -->
			<image src="../static/icon/brush.png" mode="widthFix" style="width:40rpx"></image>
            数据录入
          </h3>
          <div class="modules-grid">
            <div class="module-card" @click="navigateTo('/project-basic-input')">
              <div class="module-icon project-basic">
                <!-- <FileText class="w-8 h-8" /> -->
				<image src="../static/icon/document.png" mode="widthFix" style="width:40rpx"></image>
              </div>
              <div class="module-content">
                <h4 class="module-title">项目基本信息录入</h4>
                <p class="module-desc">项目编号、名称、建设单位等基本信息</p>
              </div>
            </div>
            
            <div class="module-card" @click="navigateTo('/project-info-input')">
              <div class="module-icon project-info">
				<image src="../static/icon/editor.png" mode="widthFix" style="width:40rpx"></image>
              </div>
              <div class="module-content">
                <h4 class="module-title">项目信息录入</h4>
                <p class="module-desc">选择项目录入详细信息和进度</p>
              </div>
            </div>
            
            <div class="module-card" @click="navigateTo('/labor-input')">
              <div class="module-icon labor">
				<image src="../static/icon/clock.png" mode="widthFix" style="width:40rpx"></image>
              </div>
              <div class="module-content">
                <h4 class="module-title">人工工时录入</h4>
                <p class="module-desc">记录员工项目工时信息</p>
              </div>
            </div>
            
            <div class="module-card" @click="navigateTo('/expense-input')">
              <div class="module-icon expense">
                <!-- <CreditCard class="w-8 h-8" /> -->
				<image src="../static/icon/barrage.png" mode="widthFix" style="width:40rpx"></image>
              </div>
              <div class="module-content">
                <h4 class="module-title">非人工支出录入</h4>
                <p class="module-desc">记录项目相关支出</p>
              </div>
            </div>
            
            <div class="module-card" @click="navigateTo('/income-input')">
              <div class="module-icon income">
                <!-- <TrendingUp class="w-8 h-8" /> -->
				<image src="../static/icon/transaction_fill.png" mode="widthFix" style="width:40rpx"></image>
              </div>
              <div class="module-content">
                <h4 class="module-title">收入信息录入</h4>
                <p class="module-desc">记录项目收入明细</p>
              </div>
            </div>
            
            <div class="module-card" @click="navigateTo('/shared-expense-input')">
              <div class="module-icon shared">
                <!-- <Share2 class="w-8 h-8" /> -->
				<image src="../static/icon/share.png" mode="widthFix" style="width:40rpx"></image>
              </div>
              <div class="module-content">
                <h4 class="module-title">公摊支出录入</h4>
                <p class="module-desc">记录分公司公摊支出</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 数据分析模块 -->
        <div class="module-group" v-if="userRole === 'leader'">
          <h3 class="group-title">
            <BarChart3 class="w-5 h-5" />
            经营分析
          </h3>
          <div class="modules-grid">
            <div class="module-card" @click="navigateTo('/headquarters-analysis')">
              <div class="module-icon hq">
                <!-- <Building2 class="w-8 h-8" /> -->
				<image src="../static/icon/return.png" mode="widthFix" style="width:40rpx"></image>
              </div>
              <div class="module-content">
                <h4 class="module-title">总公司经营分析</h4>
                <p class="module-desc">整体经营情况分析驾驶舱</p>
              </div>
            </div>
            
            <div class="module-card" @click="navigateTo('/branch-analysis')">
              <div class="module-icon branch">
                <MapPin class="w-8 h-8" />
              </div>
              <div class="module-content">
                <h4 class="module-title">分公司经营分析</h4>
                <p class="module-desc">各分公司项目盈利分析</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 员工项目展示 -->
    <section class="employee-section" v-if="userRole === 'employee' && employeeName">
      <div class="employee-container">
        <EmployeeProjectsDisplay :employee-name="employeeName" @view-project="handleViewProject" />
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted,defineOptions } from "vue";
import EmployeeProjectsDisplay from './EmployeeProjectsDisplay.vue'
import { logout } from "../api/login";
import { removeCache } from "../utils";
defineOptions({
  components: {
    EmployeeProjectsDisplay,
  }
})
// 定义 props
const props = defineProps<{
  userRole: string
  employeeName?: string
}>()

// 定义事件
const emit = defineEmits<{
  navigate: [page: string]
}>()

const navigateTo = (path: string) => {
  console.log(`导航到: ${path}`)
  // 根据路径确定页面
  if (path === '/project-basic-input') {
    emit('navigate', 'project-basic-input')
  } else if (path === '/project-info-input') {
    emit('navigate', 'project-list')
  } else if (path === '/labor-input') {
    emit('navigate', 'labor-input')
  }
  else if (path === '/expense-input') {
    emit('navigate', 'expense-input')
  }
  else if (path === '/income-input') {
    emit('navigate', 'income-input')
  }
  else if (path === '/shared-expense-input') {
    emit('navigate', 'shared-expense-input')
  }
  else if (path === '/headquarters-analysis') {
    emit('navigate', 'headquarters-analysis')
  }
  else if (path === '/branch-analysis') {
    emit('navigate', 'branch-analysis')
  }
  // 可以继续添加其他页面的导航逻辑
}

const handleViewProject = (project: any) => {
  console.log('查看项目详情:', project)
}
const exit = async ()=>{
	await logout()
	removeCache('userInfo')
	return uni.redirectTo({
		url: '/pages/login/index'
	})	
}
</script>

<style scoped>
/* 头部样式 */
.header {
  background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
  color: white;
  padding: 1rem 0.75rem 1.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.company-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex: 1;
}

.company-logo {
  background: rgba(255, 255, 255, 0.2);
  padding: 0.5rem;
  border-radius: 8px;
  backdrop-filter: blur(10px);
  flex-shrink: 0;
}

.company-logo .w-8 {
  width: 1.5rem;
  height: 1.5rem;
}

.company-name {
  font-size: 1.125rem;
  font-weight: 700;
  margin: 0;
  line-height: 1.2;
}

.company-subtitle {
  font-size: 0.75rem;
  opacity: 0.9;
  margin: 0;
  line-height: 1.2;
}

.user-info .avatar {
  background: rgba(255, 255, 255, 0.2);
  padding: 0.4rem;
  border-radius: 50%;
  backdrop-filter: blur(10px);
  flex-shrink: 0;
}

.user-info .avatar .w-5 {
  width: 1.25rem;
  height: 1.25rem;
}

/* 概览部分 */
.overview-section {
  padding: 1rem 0.75rem;
  background: white;
  margin-top: -0.75rem;
  border-radius: 1.5rem 1.5rem 0 0;
  position: relative;
  z-index: 1;
}

.overview-container {
  width: 100%;
}

.section-title {
  font-size: 1rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.75rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
}

.stat-card {
  background: white;
  border-radius: 12px;
  padding: 0.875rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border-left: 4px solid;
  transition: transform 0.2s, box-shadow 0.2s;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.stat-card.primary { border-left-color: #3b82f6; }
.stat-card.secondary { border-left-color: #8b5cf6; }
.stat-card.accent { border-left-color: #f97316; }
.stat-card.success { border-left-color: #10b981; }

.stat-card .stat-icon {
  color: #6b7280;
  margin-bottom: 0.375rem;
}

.stat-card .stat-icon .w-6 {
  width: 1.25rem;
  height: 1.25rem;
}

.stat-label {
  font-size: 0.75rem;
  color: #6b7280;
  margin: 0;
  line-height: 1.3;
}

.stat-value {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0.125rem 0;
  line-height: 1.2;
}

.stat-change {
  font-size: 0.625rem;
  font-weight: 500;
}

.stat-change.positive { color: #10b981; }
.stat-change.neutral { color: #6b7280; }

/* 功能模块部分 */
.modules-section {
  background: #f9fafb;
  padding: 1rem 0.75rem;
}

.modules-container {
  width: 100%;
}

.module-group {
  margin-bottom: 1.5rem;
}

.group-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.75rem;
}

.group-title .w-5 {
  width: 1.125rem;
  height: 1.125rem;
}

.modules-grid {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.module-card {
  background: white;
  border-radius: 12px;
  padding: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.2s;
}

.module-card:hover {
  transform: translateX(4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.module-card:active {
  transform: translateX(2px);
}

.module-icon {
  padding: 0.625rem;
  border-radius: 10px;
  color: white;
  flex-shrink: 0;
}

.module-icon .w-8 {
  width: 1.5rem;
  height: 1.5rem;
}

.module-icon.labor { background: #3b82f6; }
.module-icon.project-basic { background: #6366f1; }
.module-icon.project-info { background: #8b5cf6; }
.module-icon.expense { background: #ef4444; }
.module-icon.income { background: #10b981; }
.module-icon.shared { background: #f59e0b; }
.module-icon.hq { background: #8b5cf6; }
.module-icon.branch { background: #06b6d4; }

.module-content {
  flex: 1;
  min-width: 0;
}

.module-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 0.125rem 0;
  line-height: 1.3;
}

.module-desc {
  font-size: 0.75rem;
  color: #6b7280;
  margin: 0;
  line-height: 1.3;
}

.module-card .w-5 {
  width: 1.125rem;
  height: 1.125rem;
}

/* 快捷操作 */
.quick-actions {
  background: white;
  padding: 1rem 0.75rem 1.5rem;
}

.quick-actions-container {
  width: 100%;
}

.quick-actions-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.5rem;
}

.quick-action-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.375rem;
  padding: 0.75rem 0.5rem;
  border: none;
  border-radius: 10px;
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.quick-action-btn .w-5 {
  width: 1.125rem;
  height: 1.125rem;
}

.quick-action-btn.primary {
  background: #3b82f6;
  color: white;
}

.quick-action-btn.secondary {
  background: #f3f4f6;
  color: #374151;
}

.quick-action-btn.accent {
  background: #fef3c7;
  color: #d97706;
}

.quick-action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* 员工区域 */
.employee-section {
  background: #f9fafb;
  padding: 0px 0.75rem 1rem 0.75rem;
}

.employee-container {
  width: 100%;
}

@media (min-width: 768px) {
  .employee-container {
    max-width: 1200px;
    margin: 0 auto;
  }
}

/* 响应式设计 */
@media (max-width: 320px) {
  .header {
    padding: 0.75rem 0.5rem 1.25rem;
  }
  
  .overview-section {
    padding: 0.75rem 0.5rem;
  }
  
  .modules-section {
    padding: 0.75rem 0.5rem;
  }
  
  .quick-actions {
    padding: 0.75rem 0.5rem 1.25rem;
  }
  
  .company-name {
    font-size: 1rem;
  }
  
  .stat-value {
    font-size: 1.125rem;
  }
  
  .module-title {
    font-size: 0.8125rem;
  }
  
  .quick-action-btn {
    font-size: 0.6875rem;
    padding: 0.625rem 0.375rem;
  }
}

@media (min-width: 375px) {
  .header {
    padding: 1rem 0.875rem 1.5rem;
  }
  
  .overview-section {
    padding: 1rem 0.875rem;
  }
  
  .modules-section {
    padding: 1rem 0.875rem;
  }
  
  .quick-actions {
    padding: 1rem 0.875rem 1.5rem;
  }
}

@media (min-width: 414px) {
  .header {
    padding: 1.25rem 1rem 1.75rem;
  }
  
  .overview-section {
    padding: 1.25rem 1rem;
  }
  
  .modules-section {
    padding: 1.25rem 1rem;
  }
  
  .quick-actions {
    padding: 1.25rem 1rem 1.75rem;
  }
  
  .company-name {
    font-size: 1.25rem;
  }
  
  .section-title {
    font-size: 1.125rem;
  }
  
  .stat-value {
    font-size: 1.375rem;
  }
  
  .module-title {
    font-size: 0.9375rem;
  }
  
  .quick-action-btn {
    font-size: 0.8125rem;
    padding: 0.875rem 0.625rem;
  }
}

@media (min-width: 768px) {
  .header {
    padding: 1.5rem 1rem 2rem;
  }
  
  .header-content {
    max-width: 1200px;
    margin: 0 auto;
  }
  
  .overview-section {
    padding: 1.5rem 1rem;
    margin-top: -1rem;
  }
  
  .overview-container {
    max-width: 1200px;
    margin: 0 auto;
  }
  
  .modules-section {
    padding: 1.5rem 1rem;
  }
  
  .modules-container {
    max-width: 1200px;
    margin: 0 auto;
  }
  
  .quick-actions {
    padding: 1.5rem 1rem 2rem;
  }
  
  .quick-actions-container {
    max-width: 1200px;
    margin: 0 auto;
  }
  
  .stats-grid {
    grid-template-columns: repeat(4, 1fr);
    gap: 1rem;
  }
  
  .stat-card {
    padding: 1.25rem;
    border-radius: 16px;
  }
  
  .section-title {
    font-size: 1.125rem;
    margin-bottom: 1rem;
  }
  
  .module-group {
    margin-bottom: 2rem;
  }
  
  .group-title {
    font-size: 1rem;
    margin-bottom: 1rem;
  }
  
  .modules-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem;
  }
  
  .module-card {
    padding: 1rem;
    gap: 1rem;
    border-radius: 16px;
  }
  
  .module-title {
    font-size: 1rem;
    margin-bottom: 0.25rem;
  }
  
  .module-desc {
    font-size: 0.875rem;
  }
  
  .quick-actions-grid {
    max-width: 600px;
    margin: 0 auto;
    gap: 0.75rem;
  }
  
  .quick-action-btn {
    padding: 1rem;
    gap: 0.5rem;
    font-size: 0.875rem;
    border-radius: 12px;
  }
}

@media (min-width: 1024px) {
  .header {
    padding: 2rem 1rem;
  }
  
  .overview-section {
    padding: 2rem 1rem;
  }
  
  .modules-section {
    padding: 2rem 1rem;
  }
  
  .quick-actions {
    padding: 2rem 1rem;
  }
  
  .company-logo {
    padding: 0.75rem;
    border-radius: 12px;
  }
  
  .company-logo .w-8 {
    width: 2rem;
    height: 2rem;
  }
  
  .stat-card .stat-icon .w-6 {
    width: 1.5rem;
    height: 1.5rem;
  }
  
  .stat-value {
    font-size: 1.5rem;
  }
  
  .module-icon {
    padding: 0.75rem;
    border-radius: 12px;
  }
  
  .module-icon .w-8 {
    width: 2rem;
    height: 2rem;
  }
}
</style>