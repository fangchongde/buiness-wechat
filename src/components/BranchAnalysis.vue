<template>
  <div class="branch-analysis">
    <!-- 头部导航 -->
    <header class="header">
      <div class="header-content">
        <button class="back-btn" @click="goBack">
          <ArrowLeft class="w-5 h-5" />
        </button>
        <h1 class="page-title">分公司经营分析</h1>
        <div class="header-actions">
          <button class="refresh-btn" @click="refreshData">
            <RefreshCw class="w-4 h-4" />
          </button>
          <button class="export-btn" @click="exportData">
            <Download class="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>

    <!-- 分公司选择和时间筛选 -->
    <div class="filter-section">
      <div class="filter-container">
        <div class="branch-selector">
          <MapPin class="w-5 h-5 text-blue-600" />
          <div class="selector-content">
            <label class="selector-label">选择分公司</label>
            <select
              v-model="selectedBranchId"
              class="branch-select"
              @change="updateSelectedBranch"
            >
              <option value="">全部分公司</option>
              <option v-for="branch in branches" :key="branch.id" :value="branch.id">
                {{ branch.name }}
              </option>
            </select>
          </div>
        </div>
        
        <div class="time-filter">
          <Calendar class="w-5 h-5 text-blue-600" />
          <div class="filter-tabs">
            <button 
              v-for="period in timePeriods" 
              :key="period.value"
              :class="['filter-tab', { active: selectedPeriod === period.value }]"
              @click="selectPeriod(period.value)"
            >
              {{ period.label }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 分公司概览 -->
    <section class="overview-section" v-if="selectedBranch">
      <div class="overview-container">
        <div class="branch-header">
          <div class="branch-info">
            <h2 class="branch-name">{{ selectedBranch.name }}</h2>
            <p class="branch-manager">负责人：{{ selectedBranch.manager }}</p>
          </div>
          <div class="branch-status" :class="selectedBranch.performanceLevel">
            {{ selectedBranch.performanceText }}
          </div>
        </div>
        
        <div class="kpi-grid">
          <div class="kpi-card primary" @click="drillDown('contract')">
            <div class="kpi-header">
              <FileText class="w-5 h-5" />
              <span class="kpi-trend" :class="selectedBranch.kpis.contract.trend">
                {{ selectedBranch.kpis.contract.change }}
              </span>
            </div>
            <div class="kpi-content">
              <h3 class="kpi-title">总合同金额</h3>
              <p class="kpi-value">¥{{ formatNumber(selectedBranch.kpis.contract.value) }}</p>
            </div>
          </div>

          <div class="kpi-card secondary" @click="drillDown('settled')">
            <div class="kpi-header">
              <CheckCircle class="w-5 h-5" />
              <span class="kpi-trend" :class="selectedBranch.kpis.settled.trend">
                {{ selectedBranch.kpis.settled.change }}
              </span>
            </div>
            <div class="kpi-content">
              <h3 class="kpi-title">已结算金额</h3>
              <p class="kpi-value">¥{{ formatNumber(selectedBranch.kpis.settled.value) }}</p>
            </div>
          </div>

          <div class="kpi-card warning" @click="drillDown('cost')">
            <div class="kpi-header">
              <AlertTriangle class="w-5 h-5" />
              <span class="kpi-trend" :class="selectedBranch.kpis.cost.trend">
                {{ selectedBranch.kpis.cost.change }}
              </span>
            </div>
            <div class="kpi-content">
              <h3 class="kpi-title">已发生成本</h3>
              <p class="kpi-value">¥{{ formatNumber(selectedBranch.kpis.cost.value) }}</p>
            </div>
          </div>

          <div class="kpi-card info" @click="drillDown('receivable')">
            <div class="kpi-header">
              <Clock class="w-5 h-5" />
              <span class="kpi-trend" :class="selectedBranch.kpis.receivable.trend">
                {{ selectedBranch.kpis.receivable.change }}
              </span>
            </div>
            <div class="kpi-content">
              <h3 class="kpi-title">项目应收款总额</h3>
              <p class="kpi-value">¥{{ formatNumber(selectedBranch.kpis.receivable.value) }}</p>
            </div>
          </div>

          <div class="kpi-card success" @click="drillDown('revenue')">
            <div class="kpi-header">
              <TrendingUp class="w-5 h-5" />
              <span class="kpi-trend" :class="selectedBranch.kpis.revenue.trend">
                {{ selectedBranch.kpis.revenue.change }}
              </span>
            </div>
            <div class="kpi-content">
              <h3 class="kpi-title">收入</h3>
              <p class="kpi-value">¥{{ formatNumber(selectedBranch.kpis.revenue.value) }}</p>
            </div>
          </div>

          <div class="kpi-card accent" @click="drillDown('progress')">
            <div class="kpi-header">
              <BarChart3 class="w-5 h-5" />
              <span class="kpi-trend" :class="selectedBranch.kpis.progress.trend">
                {{ selectedBranch.kpis.progress.change }}
              </span>
            </div>
            <div class="kpi-content">
              <h3 class="kpi-title">项目进度</h3>
              <p class="kpi-value">{{ selectedBranch.kpis.progress.value }}%</p>
            </div>
          </div>

          <div class="kpi-card purple" @click="drillDown('progressValue')">
            <div class="kpi-header">
              <Target class="w-5 h-5" />
              <span class="kpi-trend" :class="selectedBranch.kpis.progressValue.trend">
                {{ selectedBranch.kpis.progressValue.change }}
              </span>
            </div>
            <div class="kpi-content">
              <h3 class="kpi-title">进度产值</h3>
              <p class="kpi-value">¥{{ formatNumber(selectedBranch.kpis.progressValue.value) }}</p>
            </div>
          </div>

          <div class="kpi-card orange" @click="drillDown('managementFee')">
            <div class="kpi-header">
              <Settings class="w-5 h-5" />
              <span class="kpi-trend" :class="selectedBranch.kpis.managementFee.trend">
                {{ selectedBranch.kpis.managementFee.change }}
              </span>
            </div>
            <div class="kpi-content">
              <h3 class="kpi-title">管理费</h3>
              <p class="kpi-value">¥{{ formatNumber(selectedBranch.kpis.managementFee.value) }}</p>
            </div>
          </div>

          <div class="kpi-card teal" @click="drillDown('managementRebate')">
            <div class="kpi-header">
              <RefreshCw class="w-5 h-5" />
              <span class="kpi-trend" :class="selectedBranch.kpis.managementRebate.trend">
                {{ selectedBranch.kpis.managementRebate.change }}
              </span>
            </div>
            <div class="kpi-content">
              <h3 class="kpi-title">管理费返利</h3>
              <p class="kpi-value">¥{{ formatNumber(selectedBranch.kpis.managementRebate.value) }}</p>
            </div>
          </div>

          <div class="kpi-card red" @click="drillDown('tax')">
            <div class="kpi-header">
              <Receipt class="w-5 h-5" />
              <span class="kpi-trend" :class="selectedBranch.kpis.tax.trend">
                {{ selectedBranch.kpis.tax.change }}
              </span>
            </div>
            <div class="kpi-content">
              <h3 class="kpi-title">已缴纳税金</h3>
              <p class="kpi-value">¥{{ formatNumber(selectedBranch.kpis.tax.value) }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 项目列表分析 -->
    <section class="projects-section">
      <div class="projects-container">
        <div class="section-header">
          <h2 class="section-title">
            <Folder class="w-5 h-5" />
            项目经营分析
          </h2>
          <div class="section-actions">
            <button class="view-toggle" @click="toggleView">
              <Grid class="w-4 h-4" />
              {{ viewMode === 'grid' ? '列表视图' : '卡片视图' }}
            </button>
          </div>
        </div>

        <div v-if="viewMode === 'grid'" class="projects-grid">
          <div 
            v-for="project in filteredProjects" 
            :key="project.id"
            class="project-card"
            @click="drillDownProject(project)"
          >
            <div class="project-header">
              <div class="project-info">
                <h3 class="project-name">{{ project.name }}</h3>
                <p class="project-code">{{ project.code }}</p>
              </div>
              <div class="project-status" :class="project.statusClass">
                {{ project.status }}
              </div>
            </div>

            <div class="project-metrics">
              <div class="metric-row">
                <span class="metric-label">合同金额</span>
                <span class="metric-value">¥{{ formatNumber(project.contractAmount) }}</span>
              </div>
              <div class="metric-row">
                <span class="metric-label">预计产值</span>
                <span class="metric-value">¥{{ formatNumber(project.expectedOutput) }}</span>
              </div>
              <div class="metric-row">
                <span class="metric-label">已结算</span>
                <span class="metric-value">¥{{ formatNumber(project.settledAmount) }}</span>
              </div>
              <div class="metric-row">
                <span class="metric-label">已发生成本</span>
                <span class="metric-value">¥{{ formatNumber(project.actualCost) }}</span>
              </div>
              <div class="metric-row">
                <span class="metric-label">应收款</span>
                <span class="metric-value">¥{{ formatNumber(project.receivableAmount) }}</span>
              </div>
              <div class="metric-row">
                <span class="metric-label">进度产值</span>
                <span class="metric-value">¥{{ formatNumber(project.progressValue) }}</span>
              </div>
            </div>

            <div class="project-progress">
              <div class="progress-info">
                <span class="progress-label">项目进度</span>
                <span class="progress-value">{{ project.progress }}%</span>
              </div>
              <div class="progress-bar">
                <div 
                  class="progress-fill" 
                  :style="{ width: project.progress + '%' }"
                ></div>
              </div>
            </div>

            <div class="project-profit">
              <div class="profit-info">
                <span class="profit-label">预计利润</span>
                <span class="profit-value" :class="project.profit >= 0 ? 'positive' : 'negative'">
                  ¥{{ formatNumber(project.profit) }}
                </span>
              </div>
              <div class="profit-margin">
                利润率：{{ project.profitMargin }}%
              </div>
            </div>
          </div>
        </div>

        <div v-else class="projects-table">
          <div class="table-header">
            <div class="table-row header-row">
              <div class="table-cell">项目名称</div>
              <div class="table-cell">合同金额</div>
              <div class="table-cell">预计产值</div>
              <div class="table-cell">已结算</div>
              <div class="table-cell">已发生成本</div>
              <div class="table-cell">应收款</div>
              <div class="table-cell">进度</div>
              <div class="table-cell">利润率</div>
              <div class="table-cell">操作</div>
            </div>
          </div>
          <div class="table-body">
            <div 
              v-for="project in filteredProjects" 
              :key="project.id"
              class="table-row"
              @click="drillDownProject(project)"
            >
              <div class="table-cell">
                <div class="project-info">
                  <span class="project-name">{{ project.name }}</span>
                  <span class="project-code">{{ project.code }}</span>
                </div>
              </div>
              <div class="table-cell">¥{{ formatNumber(project.contractAmount) }}</div>
              <div class="table-cell">¥{{ formatNumber(project.expectedOutput) }}</div>
              <div class="table-cell">¥{{ formatNumber(project.settledAmount) }}</div>
              <div class="table-cell">¥{{ formatNumber(project.actualCost) }}</div>
              <div class="table-cell">¥{{ formatNumber(project.receivableAmount) }}</div>
              <div class="table-cell">{{ project.progress }}%</div>
              <div class="table-cell" :class="project.profit >= 0 ? 'positive' : 'negative'">
                {{ project.profitMargin }}%
              </div>
              <div class="table-cell">
                <button class="detail-btn">
                  <Eye class="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 全部分公司对比 -->
    <section class="comparison-section" v-if="!selectedBranch">
      <div class="comparison-container">
        <h2 class="section-title">
          <BarChart3 class="w-5 h-5" />
          分公司对比分析
        </h2>
        
        <div class="comparison-grid">
          <div 
            v-for="branch in branches" 
            :key="branch.id"
            class="comparison-card"
            @click="selectBranch(branch.id)"
          >
            <div class="comparison-header">
              <h3 class="branch-name">{{ branch.name }}</h3>
              <div class="branch-performance" :class="branch.performanceLevel">
                {{ branch.performanceText }}
              </div>
            </div>
            
            <div class="comparison-metrics">
              <div class="metric-item">
                <span class="metric-label">项目数量</span>
                <span class="metric-value">{{ branch.projectCount }}个</span>
              </div>
              <div class="metric-item">
                <span class="metric-label">合同总额</span>
                <span class="metric-value">¥{{ formatNumber(branch.totalContract) }}</span>
              </div>
              <div class="metric-item">
                <span class="metric-label">已结算</span>
                <span class="metric-value">¥{{ formatNumber(branch.totalSettled) }}</span>
              </div>
              <div class="metric-item">
                <span class="metric-label">预计利润</span>
                <span class="metric-value" :class="branch.totalProfit >= 0 ? 'positive' : 'negative'">
                  ¥{{ formatNumber(branch.totalProfit) }}
                </span>
              </div>
            </div>
            
            <div class="comparison-chart">
              <div class="chart-bar">
                <div class="bar-item">
                  <div class="bar-label">收入</div>
                  <div class="bar-container">
                    <div 
                      class="bar-fill revenue" 
                      :style="{ width: (branch.totalSettled / maxBranchValue * 100) + '%' }"
                    ></div>
                  </div>
                </div>
                <div class="bar-item">
                  <div class="bar-label">成本</div>
                  <div class="bar-container">
                    <div 
                      class="bar-fill cost" 
                      :style="{ width: (branch.totalCost / maxBranchValue * 100) + '%' }"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 项目详情弹窗 -->
    <div v-if="showProjectDetail" class="project-detail-modal" @click="closeProjectDetail">
      <div class="project-detail-content" @click.stop>
        <div class="detail-header">
          <h3 class="detail-title">{{ selectedProjectDetail?.name }}</h3>
          <button class="close-btn" @click="closeProjectDetail">
            <X class="w-5 h-5" />
          </button>
        </div>
        
        <div class="detail-body" v-if="selectedProjectDetail">
          <div class="detail-section">
            <h4 class="detail-section-title">基本信息</h4>
            <div class="detail-grid">
              <div class="detail-item">
                <span class="detail-label">项目编号</span>
                <span class="detail-value">{{ selectedProjectDetail.code }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">项目名称</span>
                <span class="detail-value">{{ selectedProjectDetail.name }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">所属框架协议编号</span>
                <span class="detail-value">{{ selectedProjectDetail.frameworkCode || '-' }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">所属框架协议名称</span>
                <span class="detail-value">{{ selectedProjectDetail.frameworkName || '-' }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">项目建设单位</span>
                <span class="detail-value">{{ selectedProjectDetail.constructionUnit }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">所属分公司</span>
                <span class="detail-value">{{ selectedProjectDetail.branchName }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">项目负责人</span>
                <span class="detail-value">{{ selectedProjectDetail.manager }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">开工时间</span>
                <span class="detail-value">{{ selectedProjectDetail.startDate }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">竣工时间</span>
                <span class="detail-value">{{ selectedProjectDetail.completionDate || '-' }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">项目合同扫描件</span>
                <span class="detail-value">
                  <button class="file-link-btn">查看合同文件</button>
                </span>
              </div>
            </div>
          </div>

          <div class="detail-section">
            <h4 class="detail-section-title">财务指标</h4>
            <div class="detail-grid">
              <div class="detail-item">
                <span class="detail-label">项目合同金额</span>
                <span class="detail-value">¥{{ formatNumber(selectedProjectDetail.contractAmount) }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">暂估造价</span>
                <span class="detail-value">¥{{ formatNumber(selectedProjectDetail.estimatedCost) }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">预计产值</span>
                <span class="detail-value">¥{{ formatNumber(selectedProjectDetail.expectedOutput) }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">已结算金额</span>
                <span class="detail-value">¥{{ formatNumber(selectedProjectDetail.settledAmount) }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">已发生成本</span>
                <span class="detail-value">¥{{ formatNumber(selectedProjectDetail.actualCost) }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">项目应收款</span>
                <span class="detail-value">¥{{ formatNumber(selectedProjectDetail.receivableAmount) }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">进度产值</span>
                <span class="detail-value">¥{{ formatNumber(selectedProjectDetail.progressValue) }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">累计造价预估增减</span>
                <span class="detail-value" :class="selectedProjectDetail.cumulativeCostAdjustment >= 0 ? 'positive' : 'negative'">
                  ¥{{ formatNumber(Math.abs(selectedProjectDetail.cumulativeCostAdjustment)) }}
                  {{ selectedProjectDetail.cumulativeCostAdjustment >= 0 ? '(增加)' : '(减少)' }}
                </span>
              </div>
              <div class="detail-item">
                <span class="detail-label">结算价</span>
                <span class="detail-value">¥{{ formatNumber(selectedProjectDetail.settlementPrice) }}</span>
              </div>
            </div>
          </div>

          <div class="detail-section">
            <h4 class="detail-section-title">项目进度</h4>
            <div class="detail-grid">
              <div class="detail-item">
                <span class="detail-label">形象进度</span>
                <span class="detail-value">{{ selectedProjectDetail.imageProgress }}%</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">竣工资料完成情况</span>
                <span class="detail-value">{{ selectedProjectDetail.completionDocuments }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">材料核销情况</span>
                <span class="detail-value">{{ selectedProjectDetail.materialVerification }}</span>
              </div>
            </div>
            <div class="progress-detail">
              <div class="progress-info">
                <span class="progress-label">形象进度</span>
                <span class="progress-value">{{ selectedProjectDetail.imageProgress }}%</span>
              </div>
              <div class="progress-bar large">
                <div 
                  class="progress-fill" 
                  :style="{ width: selectedProjectDetail.imageProgress + '%' }"
                ></div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { 
  ArrowLeft, RefreshCw, Download, MapPin, Calendar, FileText, Target, 
  CheckCircle, AlertTriangle, Clock, Receipt, Folder, Grid, Eye, X,
  BarChart3, TrendingUp, Settings
} from 'lucide-vue-next'

// 定义事件
const emit = defineEmits<{
  goBack: []
}>()

// 定义 props
const props = defineProps<{
  initialBranchId?: string
}>()

// 状态管理
const selectedBranchId = ref('')
const selectedBranch = ref<any>(null)
const selectedPeriod = ref('month')
const viewMode = ref('grid')
const showProjectDetail = ref(false)
const selectedProjectDetail = ref<any>(null)

// 初始化选中的分公司
if (props.initialBranchId) {
  selectedBranchId.value = props.initialBranchId
}

// 时间筛选选项
const timePeriods = [
  { label: '本月', value: 'month' },
  { label: '本季度', value: 'quarter' },
  { label: '本年度', value: 'year' }
]

// 分公司数据
const branches = ref([
  {
    id: 1,
    name: '北京分公司',
    manager: '张经理',
    projectCount: 8,
    totalContract: 45000000,
    totalSettled: 32000000,
    totalCost: 28000000,
    totalProfit: 4000000,
    performanceLevel: 'excellent',
    performanceText: '优秀',
    kpis: {
      contract: { value: 45000000, change: '+15.2%', trend: 'up' },
      settled: { value: 32000000, change: '+18.5%', trend: 'up' },
      cost: { value: 28000000, change: '+8.3%', trend: 'up' },
      receivable: { value: 13000000, change: '-5.2%', trend: 'down' },
      revenue: { value: 35000000, change: '+16.8%', trend: 'up' },
      progress: { value: 72, change: '+8.5%', trend: 'up' },
      progressValue: { value: 30000000, change: '+14.2%', trend: 'up' },
      managementFee: { value: 2250000, change: '+10.5%', trend: 'up' },
      managementRebate: { value: 450000, change: '+12.8%', trend: 'up' },
      tax: { value: 2800000, change: '+12.1%', trend: 'up' }
    }
  },
  {
    id: 2,
    name: '上海分公司',
    manager: '李经理',
    projectCount: 6,
    totalContract: 38000000,
    totalSettled: 28000000,
    totalCost: 25000000,
    totalProfit: 3000000,
    performanceLevel: 'good',
    performanceText: '良好',
    kpis: {
      contract: { value: 38000000, change: '+8.7%', trend: 'up' },
      settled: { value: 28000000, change: '+12.3%', trend: 'up' },
      cost: { value: 25000000, change: '+5.8%', trend: 'up' },
      receivable: { value: 10000000, change: '-3.2%', trend: 'down' },
      revenue: { value: 30000000, change: '+11.5%', trend: 'up' },
      progress: { value: 68, change: '+6.2%', trend: 'up' },
      progressValue: { value: 26000000, change: '+9.8%', trend: 'up' },
      managementFee: { value: 1900000, change: '+7.3%', trend: 'up' },
      managementRebate: { value: 380000, change: '+8.9%', trend: 'up' },
      tax: { value: 2200000, change: '+8.9%', trend: 'up' }
    }
  },
  {
    id: 3,
    name: '广州分公司',
    manager: '王经理',
    projectCount: 4,
    totalContract: 25000000,
    totalSettled: 18000000,
    totalCost: 16000000,
    totalProfit: 2000000,
    performanceLevel: 'average',
    performanceText: '一般',
    kpis: {
      contract: { value: 25000000, change: '+3.2%', trend: 'up' },
      settled: { value: 18000000, change: '+5.5%', trend: 'up' },
      cost: { value: 16000000, change: '+4.2%', trend: 'up' },
      receivable: { value: 7000000, change: '-1.8%', trend: 'down' },
      revenue: { value: 20000000, change: '+4.8%', trend: 'up' },
      progress: { value: 65, change: '+3.5%', trend: 'up' },
      progressValue: { value: 17000000, change: '+5.2%', trend: 'up' },
      managementFee: { value: 1250000, change: '+4.1%', trend: 'up' },
      managementRebate: { value: 250000, change: '+5.8%', trend: 'up' },
      tax: { value: 1500000, change: '+6.3%', trend: 'up' }
    }
  }
])

// 项目数据
const projects = ref([
  {
    id: 1,
    branchId: 1,
    name: '城市综合体建设项目',
    code: 'PRJ-2024-001',
    frameworkCode: 'FW-2024-001',
    frameworkName: '城市基础设施建设框架协议',
    constructionUnit: '市政建设集团',
    branchName: '北京分公司',
    estimatedCost: 14000000,
    manager: '张三',
    startDate: '2024-01-15',
    completionDate: '2024-12-15',
    completionDocuments: '已完成80%',
    materialVerification: '已核销70%',
    contractAmount: 15000000,
    expectedOutput: 13000000,
    settledAmount: 10000000,
    actualCost: 8500000,
    receivableAmount: 5000000,
    progressValue: 9500000,
    imageProgress: 75,
    cumulativeCostAdjustment: 200000,
    settlementPrice: 14800000,
    managementFee: 800000,
    managementRebate: 200000,
    paidTax: 850000,
    progress: 75,
    profit: 1500000,
    profitMargin: 15.8,
    status: '进行中',
    statusClass: 'active'
  },
  {
    id: 2,
    branchId: 1,
    name: '住宅小区开发项目',
    code: 'PRJ-2024-002',
    frameworkCode: 'FW-2024-002',
    frameworkName: '住宅开发建设框架协议',
    constructionUnit: '房地产开发公司',
    branchName: '北京分公司',
    estimatedCost: 11000000,
    manager: '李四',
    startDate: '2024-02-20',
    completionDate: '2024-11-30',
    completionDocuments: '已完成60%',
    materialVerification: '已核销65%',
    contractAmount: 12000000,
    expectedOutput: 11000000,
    settledAmount: 8000000,
    actualCost: 7200000,
    receivableAmount: 4000000,
    progressValue: 7500000,
    imageProgress: 68,
    cumulativeCostAdjustment: -150000,
    settlementPrice: 11700000,
    managementFee: 600000,
    managementRebate: 150000,
    paidTax: 650000,
    progress: 68,
    profit: 800000,
    profitMargin: 10.0,
    status: '进行中',
    statusClass: 'active'
  },
  {
    id: 3,
    branchId: 2,
    name: '工业园区基础设施',
    code: 'PRJ-2024-003',
    frameworkCode: 'FW-2024-003',
    frameworkName: '工业园区建设框架协议',
    constructionUnit: '工业园区管委会',
    branchName: '上海分公司',
    estimatedCost: 15500000,
    manager: '王五',
    startDate: '2024-03-10',
    completionDate: '2025-01-15',
    completionDocuments: '已完成50%',
    materialVerification: '已核销55%',
    contractAmount: 18000000,
    expectedOutput: 16000000,
    settledAmount: 12000000,
    actualCost: 10500000,
    receivableAmount: 6000000,
    progressValue: 11500000,
    imageProgress: 72,
    cumulativeCostAdjustment: 300000,
    settlementPrice: 17500000,
    managementFee: 900000,
    managementRebate: 250000,
    paidTax: 950000,
    progress: 72,
    profit: 1500000,
    profitMargin: 12.5,
    status: '进行中',
    statusClass: 'active'
  },
  {
    id: 4,
    branchId: 3,
    name: '学校教学楼建设',
    code: 'PRJ-2024-004',
    frameworkCode: 'FW-2024-004',
    frameworkName: '教育设施建设框架协议',
    constructionUnit: '教育局',
    branchName: '广州分公司',
    estimatedCost: 7200000,
    manager: '赵六',
    startDate: '2024-04-05',
    completionDate: '2024-10-30',
    completionDocuments: '已完成90%',
    materialVerification: '已核销85%',
    contractAmount: 8000000,
    expectedOutput: 7500000,
    settledAmount: 6000000,
    actualCost: 5500000,
    receivableAmount: 2000000,
    progressValue: 5800000,
    imageProgress: 77,
    cumulativeCostAdjustment: -100000,
    settlementPrice: 7800000,
    managementFee: 400000,
    managementRebate: 100000,
    paidTax: 450000,
    progress: 77,
    profit: 500000,
    profitMargin: 8.3,
    status: '进行中',
    statusClass: 'active'
  }
])

// 计算属性
const filteredProjects = computed(() => {
  if (!selectedBranchId.value) {
    return projects.value
  }
  return projects.value.filter(p => p.branchId === parseInt(selectedBranchId.value))
})

const maxBranchValue = computed(() => {
  const allValues = branches.value.flatMap(b => [b.totalSettled, b.totalCost])
  return Math.max(...allValues)
})

// 方法
const goBack = () => {
  emit('goBack')
}

const updateSelectedBranch = () => {
  if (selectedBranchId.value) {
    selectedBranch.value = branches.value.find(b => b.id === parseInt(selectedBranchId.value))
  } else {
    selectedBranch.value = null
  }
}

const selectBranch = (branchId: number) => {
  selectedBranchId.value = branchId.toString()
  updateSelectedBranch()
}

const selectPeriod = (period: string) => {
  selectedPeriod.value = period
  console.log('切换时间周期:', period)
}

const toggleView = () => {
  viewMode.value = viewMode.value === 'grid' ? 'table' : 'grid'
}

const refreshData = () => {
  console.log('刷新数据')
}

const exportData = () => {
  console.log('导出数据')
}

const formatNumber = (num: number) => {
  return (num / 10000).toFixed(1) + '万'
}

const drillDown = (type: string) => {
  console.log('下钻分析:', type)
}

const drillDownProject = (project: any) => {
  selectedProjectDetail.value = project
  showProjectDetail.value = true
}

const closeProjectDetail = () => {
  showProjectDetail.value = false
  selectedProjectDetail.value = null
}

onMounted(() => {
  console.log('分公司经营分析页面已加载')
  // 如果有初始分公司ID，更新选中的分公司
  if (props.initialBranchId) {
    updateSelectedBranch()
  }
})
</script>

<style scoped>
.branch-analysis {
  min-height: 100vh;
  background: #f9fafb;
}

/* 头部样式 */
.header {
  background: linear-gradient(135deg, #059669 0%, #10b981 100%);
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

.header-actions {
  display: flex;
  gap: 0.5rem;
  flex-shrink: 0;
}

.refresh-btn,
.export-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 6px;
  padding: 0.375rem;
  color: white;
  cursor: pointer;
  transition: background-color 0.2s;
}

.refresh-btn:hover,
.export-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

/* 筛选区域 */
.filter-section {
  background: white;
  padding: 1rem 0.75rem;
  border-bottom: 1px solid #e5e7eb;
}

.filter-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.branch-selector,
.time-filter {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.selector-content {
  flex: 1;
}

.selector-label {
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.25rem;
}

.branch-select {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #3b3b3b;
  border-radius: 6px;
  font-size: 0.875rem;
}

.filter-tabs {
  display: flex;
  gap: 0.5rem;
}

.filter-tab {
  padding: 0.375rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: white;
  color: #6b7280;
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.2s;
}

.filter-tab.active {
  background: #10b981;
  color: white;
  border-color: #10b981;
}

/* 概览区域 */
.overview-section {
  padding: 1rem 0.75rem;
}

.overview-container {
  max-width: 100%;
}

.branch-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding: 1rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.branch-name {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 0.25rem 0;
}

.branch-manager {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
}

.branch-status {
  padding: 0.375rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
}

.branch-status.excellent {
  background: #d1fae5;
  color: #065f46;
}

.branch-status.good {
  background: #dbeafe;
  color: #1e40af;
}

.branch-status.average {
  background: #fef3c7;
  color: #92400e;
}

.kpi-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
}

.kpi-card {
  background: white;
  border-radius: 12px;
  padding: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.2s;
  border-left: 4px solid;
}

.kpi-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.kpi-card.primary { border-left-color: #3b82f6; }
.kpi-card.secondary { border-left-color: #8b5cf6; }
.kpi-card.success { border-left-color: #10b981; }
.kpi-card.warning { border-left-color: #f59e0b; }
.kpi-card.info { border-left-color: #06b6d4; }
.kpi-card.accent { border-left-color: #ef4444; }
.kpi-card.purple { border-left-color: #8b5cf6; }
.kpi-card.orange { border-left-color: #f97316; }
.kpi-card.teal { border-left-color: #14b8a6; }
.kpi-card.red { border-left-color: #dc2626; }

.kpi-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
  color: #6b7280;
}

.kpi-trend {
  font-size: 0.75rem;
  font-weight: 500;
  color: #10b981;
}

.kpi-title {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0 0 0.25rem 0;
}

.kpi-value {
  font-size: 1.125rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
}

/* 项目区域 */
.projects-section {
  padding: 0 0.75rem 1rem;
}

.projects-container {
  max-width: 100%;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.section-actions {
  display: flex;
  gap: 0.5rem;
}

.view-toggle {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem 0.75rem;
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.75rem;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s;
}

.view-toggle:hover {
  background: #f3f4f6;
}

/* 项目网格视图 */
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
}

.project-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.project-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.75rem;
}

.project-name {
  font-size: 0.875rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 0.25rem 0;
}

.project-code {
  font-size: 0.75rem;
  color: #6b7280;
  margin: 0;
}

.project-status {
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
}

.project-status.active {
  background: #dbeafe;
  color: #1d4ed8;
}

.project-metrics {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.375rem;
  margin-bottom: 0.75rem;
}

.metric-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.metric-label {
  font-size: 0.75rem;
  color: #6b7280;
}

.metric-value {
  font-size: 0.75rem;
  font-weight: 600;
  color: #1f2937;
}

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
  height: 6px;
  background: #e5e7eb;
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: #10b981;
  border-radius: 3px;
  transition: width 0.3s ease;
}

.project-profit {
  border-top: 1px solid #f3f4f6;
  padding-top: 0.75rem;
}

.profit-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.25rem;
}

.profit-label {
  font-size: 0.75rem;
  color: #6b7280;
}

.profit-value {
  font-size: 0.875rem;
  font-weight: 600;
}

.profit-value.positive {
  color: #10b981;
}

.profit-value.negative {
  color: #ef4444;
}

.file-link-btn {
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 0.375rem 0.75rem;
  font-size: 0.75rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.file-link-btn:hover {
  background: #2563eb;
}

.profit-margin {
  font-size: 0.75rem;
  color: #6b7280;
  text-align: right;
}

/* 项目表格视图 */
.projects-table {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.table-header {
  background: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
}

.table-row {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1fr 1fr 0.8fr 0.8fr 0.6fr;
  gap: 0.5rem;
  padding: 0.75rem;
  align-items: center;
}

.header-row {
  font-weight: 600;
  color: #374151;
  font-size: 0.75rem;
}

.table-body .table-row {
  border-bottom: 1px solid #f3f4f6;
  cursor: pointer;
  transition: background-color 0.2s;
}

.table-body .table-row:hover {
  background: #f9fafb;
}

.table-cell {
  font-size: 0.75rem;
  color: #1f2937;
}

.table-cell .project-info {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.table-cell .project-name {
  font-weight: 600;
  font-size: 0.75rem;
}

.table-cell .project-code {
  color: #6b7280;
  font-size: 0.6875rem;
}

.table-cell.positive {
  color: #10b981;
  font-weight: 600;
}

.table-cell.negative {
  color: #ef4444;
  font-weight: 600;
}

.detail-btn {
  background: #f3f4f6;
  border: none;
  border-radius: 6px;
  padding: 0.375rem;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s;
}

.detail-btn:hover {
  background: #e5e7eb;
}

/* 分公司对比区域 */
.comparison-section {
  padding: 0 0.75rem 1rem;
}

.comparison-container {
  max-width: 100%;
}

.comparison-grid {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.comparison-card {
  background: white;
  border-radius: 12px;
  padding: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.2s;
}

.comparison-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.comparison-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.comparison-metrics {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.metric-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.comparison-chart {
  margin-top: 0.75rem;
}

.chart-bar {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.bar-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.bar-label {
  font-size: 0.75rem;
  color: #6b7280;
  min-width: 3rem;
}

.bar-container {
  flex: 1;
  height: 6px;
  background: #f3f4f6;
  border-radius: 3px;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.3s ease;
}

.bar-fill.revenue {
  background: #10b981;
}

.bar-fill.cost {
  background: #ef4444;
}

.branch-performance {
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
}

/* 项目详情弹窗 */
.project-detail-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.project-detail-content {
  background: white;
  border-radius: 12px;
  max-width: 600px;
  width: 100%;
  max-height: 80vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #e5e7eb;
}

.detail-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.close-btn:hover {
  background: #f3f4f6;
}

.detail-body {
  padding: 1rem;
  overflow-y: auto;
}

.detail-section {
  margin-bottom: 1.5rem;
}

.detail-section:last-child {
  margin-bottom: 0;
}

.detail-section-title {
  font-size: 1rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 0.75rem 0;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #f3f4f6;
}

.detail-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.detail-label {
  font-size: 0.75rem;
  color: #6b7280;
  font-weight: 500;
}

.detail-value {
  font-size: 0.875rem;
  color: #1f2937;
  font-weight: 600;
}

.progress-detail {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.progress-bar.large {
  height: 12px;
}

/* 响应式设计 */
@media (max-width: 320px) {
  .header {
    padding: 0.75rem 0.5rem;
  }
  
  .filter-section {
    padding: 0.75rem 0.5rem;
  }
  
  .overview-section {
    padding: 0.75rem 0.5rem;
  }
  
  .projects-section {
    padding: 0 0.5rem 0.75rem;
  }
  
  .comparison-section {
    padding: 0 0.5rem 0.75rem;
  }
  
  .kpi-grid {
    grid-template-columns: 1fr;
  }
  
  .project-metrics {
    grid-template-columns: 1fr;
  }
  
  .comparison-metrics {
    grid-template-columns: 1fr;
  }
  
  .detail-grid {
    grid-template-columns: 1fr;
  }
  
  .table-row {
    grid-template-columns: 1fr;
    gap: 0.25rem;
  }
  
  .projects-table {
    display: none;
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
  
  .filter-section {
    padding: 1.5rem 1rem;
  }
  
  .filter-container {
    max-width: 1200px;
    margin: 0 auto;
    flex-direction: row;
    justify-content: space-between;
  }
  
  .overview-section {
    padding: 1.5rem 1rem;
  }
  
  .overview-container {
    max-width: 1200px;
    margin: 0 auto;
  }
  
  .projects-section {
    padding: 0 1rem 1.5rem;
  }
  
  .projects-container {
    max-width: 1200px;
    margin: 0 auto;
  }
  
  .comparison-section {
    padding: 0 1rem 1.5rem;
  }
  
  .comparison-container {
    max-width: 1200px;
    margin: 0 auto;
  }
  
  .kpi-grid {
    grid-template-columns: repeat(5, 1fr);
    gap: 1rem;
  }
  
  .projects-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }
  
  .comparison-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }
  
  .project-metrics {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (min-width: 1024px) {
  .header {
    padding: 2rem 1rem;
  }
  
  .filter-section {
    padding: 2rem 1rem;
  }
  
  .overview-section {
    padding: 2rem 1rem;
  }
  
  .projects-section {
    padding: 0 1rem 2rem;
  }
  
  .comparison-section {
    padding: 0 1rem 2rem;
  }
  
  .projects-grid {
    grid-template-columns: repeat(3, 1fr);
  }
  
  .comparison-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>