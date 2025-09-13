<template>
    <div class="headquarters-analysis">
		<uv-modal ref="modal" title="提示" content='是否退出登录用户登录？' @confirm="exit"></uv-modal>
        <!-- 头部导航 -->
        <header class="header">
            <div class="header-content">
                <uv-button class="back-btn" @click="goBack" icon="arrow-left" color="rgba(255, 255, 255, 0.2)"></uv-button>
                <h1 class="page-title">总公司经营分析</h1>
                <div class="header-actions">
                    <button class="refresh-btn" @click="refreshData">
                        <!-- <RefreshCw class="w-4 h-4" /> -->
						<image src="../static/icon/refresh.png" mode="widthFix" style="width:40rpx"></image>
                    </button>
                    <button class="export-btn" @click="$refs.modal.open()">
                        <!-- <Download class="w-4 h-4" /> -->
						<!-- <image src="../static/icon/download.png" mode="widthFix" style="width:40rpx"></image> -->
						
						<uv-icon name="share-square" size="50rpx"></uv-icon>
                    </button>
                </div>
            </div>
        </header>

        <!-- 时间筛选器 -->
        <div class="time-filter-section">
            <div class="time-filter-container">
                <div class="filter-tabs">
                    <button
                        v-for="period in timePeriods"
                        :key="period.value"
                        :class="[
                            'filter-tab',
                            { active: selectedPeriod === period.value },
                        ]"
                        @click="selectPeriod(period.value)"
                    >
                        {{ period.label }}
                    </button>
                </div>
                <div
                    class="custom-date-range"
                    v-if="selectedPeriod === 'custom'"
                >
                    <input
                        v-model="customDateRange.start"
                        type="date"
                        class="date-input"
                    />
                    <span class="date-separator">至</span>
                    <input
                        v-model="customDateRange.end"
                        type="date"
                        class="date-input"
                    />
                </div>
            </div>
        </div>

        <!-- 核心指标卡片 -->
        <!-- <section class="kpi-section">
            <div class="kpi-container">
                <h2 class="section-title">核心经营指标</h2>
                <div class="kpi-grid">
                    <div class="kpi-card revenue" @click="drillDown('revenue')">
                        <div class="kpi-header">
                            <div class="kpi-icon">
                                <TrendingUp class="w-6 h-6" />
                            </div>
                            <div
                                class="kpi-trend"
                                :class="kpiData.revenue.trend"
                            >
                                <TrendingUp
                                    v-if="kpiData.revenue.trend === 'up'"
                                    class="w-4 h-4"
                                />
                                <TrendingDown v-else class="w-4 h-4" />
                                <span>{{ kpiData.revenue.change }}</span>
                            </div>
                        </div>
                        <div class="kpi-content">
                            <h3 class="kpi-title">总收入</h3>
                            <p class="kpi-value">
                                ¥{{ formatNumber(kpiData.revenue.value) }}
                            </p>
                            <p class="kpi-subtitle">
                                较上期 {{ kpiData.revenue.change }}
                            </p>
                        </div>
                    </div>

                    <div class="kpi-card expense" @click="drillDown('expense')">
                        <div class="kpi-header">
                            <div class="kpi-icon">
                                <CreditCard class="w-6 h-6" />
                            </div>
                            <div
                                class="kpi-trend"
                                :class="kpiData.expense.trend"
                            >
                                <TrendingUp
                                    v-if="kpiData.expense.trend === 'up'"
                                    class="w-4 h-4"
                                />
                                <TrendingDown v-else class="w-4 h-4" />
                                <span>{{ kpiData.expense.change }}</span>
                            </div>
                        </div>
                        <div class="kpi-content">
                            <h3 class="kpi-title">总支出</h3>
                            <p class="kpi-value">
                                ¥{{ formatNumber(kpiData.expense.value) }}
                            </p>
                            <p class="kpi-subtitle">
                                较上期 {{ kpiData.expense.change }}
                            </p>
                        </div>
                    </div>

                    <div class="kpi-card profit" @click="drillDown('profit')">
                        <div class="kpi-header">
                            <div class="kpi-icon">
                                <DollarSign class="w-6 h-6" />
                            </div>
                            <div
                                class="kpi-trend"
                                :class="kpiData.profit.trend"
                            >
                                <TrendingUp
                                    v-if="kpiData.profit.trend === 'up'"
                                    class="w-4 h-4"
                                />
                                <TrendingDown v-else class="w-4 h-4" />
                                <span>{{ kpiData.profit.change }}</span>
                            </div>
                        </div>
                        <div class="kpi-content">
                            <h3 class="kpi-title">净利润</h3>
                            <p class="kpi-value">
                                ¥{{ formatNumber(kpiData.profit.value) }}
                            </p>
                            <p class="kpi-subtitle">
                                较上期 {{ kpiData.profit.change }}
                            </p>
                        </div>
                    </div>

                    <div class="kpi-card margin" @click="drillDown('margin')">
                        <div class="kpi-header">
                            <div class="kpi-icon">
                                <Percent class="w-6 h-6" />
                            </div>
                            <div
                                class="kpi-trend"
                                :class="kpiData.margin.trend"
                            >
                                <TrendingUp
                                    v-if="kpiData.margin.trend === 'up'"
                                    class="w-4 h-4"
                                />
                                <TrendingDown v-else class="w-4 h-4" />
                                <span>{{ kpiData.margin.change }}</span>
                            </div>
                        </div>
                        <div class="kpi-content">
                            <h3 class="kpi-title">利润率</h3>
                            <p class="kpi-value">{{ kpiData.margin.value }}%</p>
                            <p class="kpi-subtitle">
                                较上期 {{ kpiData.margin.change }}
                            </p>
                        </div>
                    </div>
                </div>

                <h2 class="section-title" style="margin-top: 2rem">
                    总公司汇总指标
                </h2>
                <div class="headquarters-kpi-grid">
                    <div
                        v-for="kpi in headquartersKpiCards"
                        :key="kpi.id"
                        class="headquarters-kpi-card"
                        :class="kpi.color"
                        @click="drillDown(kpi.id)"
                    >
                        <div class="kpi-header">
                            <div class="kpi-icon">
                            </div>
                            <div class="kpi-trend" :class="kpi.trend">
                                <TrendingUp
                                    v-if="kpi.trend === 'up'"
                                    class="w-4 h-4"
                                />
                                <TrendingDown v-else class="w-4 h-4" />
                                <span>{{ kpi.change }}</span>
                            </div>
                        </div>
                        <div class="kpi-content">
                            <h3 class="kpi-title">{{ kpi.title }}</h3>
                            <p class="kpi-value">
                                <template v-if="kpi.isPercentage"
                                    >{{ kpi.value }}%</template
                                >
                                <template v-else
                                    >¥{{ formatNumber(kpi.value) }}</template
                                >
                            </p>
                            <p class="kpi-subtitle">较上期 {{ kpi.change }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </section> -->

        <!-- 图表分析区域 -->
        <section class="charts-section">
            <div class="charts-container">
                <!-- 收入支出趋势图 -->
                <div class="chart-card">
                    <div class="chart-header">
                        <h3 class="chart-title">
                            <!-- <BarChart3 class="w-5 h-5" /> -->
							<image src="../static/icon/dynamic.png" mode="widthFix" style="width:50rpx"></image>
                            收入支出趋势
                        </h3>
                        <div class="chart-actions">
                            <button
                                class="chart-action-btn"
                                @click="toggleChartType('trend')"
                            >
                                <!-- <BarChart3 class="w-4 h-4" /> -->
								<image src="../static/icon/dynamic.png" mode="widthFix" style="width:50rpx"></image>
                            </button>
                        </div>
                    </div>
                    <div class="chart-content">
                        <div class="trend-chart">
                            <div class="chart-legend">
                                <div class="legend-item">
                                    <div class="legend-color revenue"></div>
                                    <span>收入</span>
                                </div>
                                <div class="legend-item">
                                    <div class="legend-color expense"></div>
                                    <span>支出</span>
                                </div>
                            </div>
                            <div class="chart-bars">
                                <div
                                    v-for="(month, index) in trendData"
                                    :key="index"
                                    class="bar-group"
                                >
                                    <div class="bar-container">
                                        <div
                                            class="bar revenue-bar"
                                            :style="{
                                                height:
                                                    (month.revenue /
                                                        maxTrendValue) *
                                                        100 +
                                                    '%',
                                            }"
                                            @click="
                                                drillDownMonth(
                                                    month.month,
                                                    'revenue'
                                                )
                                            "
                                        ></div>
                                        <div
                                            class="bar expense-bar"
                                            :style="{
                                                height:
                                                    (month.expense /
                                                        maxTrendValue) *
                                                        100 +
                                                    '%',
                                            }"
                                            @click="
                                                drillDownMonth(
                                                    month.month,
                                                    'expense'
                                                )
                                            "
                                        ></div>
                                    </div>
                                    <div class="bar-label">
                                        {{ month.month }}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 项目盈利分析 -->
                <div class="chart-card">
                    <div class="chart-header">
                        <h3 class="chart-title">
                            <!-- <PieChart class="w-5 h-5" /> -->
							<image src="../static/icon/dynamic.png" mode="widthFix" style="width:50rpx"></image>
                            项目盈利分析
                        </h3>
                        <div class="chart-actions">
                            <button
                                class="chart-action-btn"
                                @click="toggleView('profit')"
                            >
                                <!-- <Eye class="w-4 h-4" /> -->
								<image src="../static/icon/dynamic.png" mode="widthFix" style="width:50rpx"></image>
                            </button>
                        </div>
                    </div>
                    <div class="chart-content">
                        <div class="project-profit-list">
                            <div
                                v-for="project in projectProfitData"
                                :key="project.id"
                                class="profit-item"
                                @click="drillDownProject(project)"
                            >
                                <div class="project-info">
                                    <h4 class="project-name">
                                        {{ project.name }}
                                    </h4>
                                    <p class="project-code">
                                        {{ project.code }} -
                                        {{ project.branchName }}
                                    </p>
                                </div>
                                <div class="profit-metrics">
                                    <div class="metric">
                                        <span class="metric-label"
                                            >合同金额</span
                                        >
                                        <span class="metric-value"
                                            >¥{{
                                                formatNumber(
                                                    project.contractAmount
                                                )
                                            }}</span
                                        >
                                    </div>
                                    <div class="metric">
                                        <span class="metric-label">已结算</span>
                                        <span class="metric-value"
                                            >¥{{
                                                formatNumber(
                                                    project.settledAmount
                                                )
                                            }}</span
                                        >
                                    </div>
                                    <div class="metric">
                                        <span class="metric-label">总收入</span>
                                        <span class="metric-value revenue"
                                            >¥{{
                                                formatNumber(project.revenue)
                                            }}</span
                                        >
                                    </div>
                                    <div class="metric">
                                        <span class="metric-label">总支出</span>
                                        <span class="metric-value expense"
                                            >¥{{
                                                formatNumber(project.expense)
                                            }}</span
                                        >
                                    </div>
                                    <div class="metric">
                                        <span class="metric-label">利润</span>
                                        <span
                                            class="metric-value"
                                            :class="
                                                project.profit >= 0
                                                    ? 'profit'
                                                    : 'loss'
                                            "
                                        >
                                            ¥{{ formatNumber(project.profit) }}
                                        </span>
                                    </div>
                                    <div class="metric">
                                        <span class="metric-label">利润率</span>
                                        <span
                                            class="metric-value"
                                            :class="
                                                project.margin >= 0
                                                    ? 'profit'
                                                    : 'loss'
                                            "
                                        >
                                            {{ project.margin }}%
                                        </span>
                                    </div>
                                </div>
                                <div class="profit-bar">
                                    <div
                                        class="profit-fill"
                                        :class="
                                            project.profit >= 0
                                                ? 'positive'
                                                : 'negative'
                                        "
                                        :style="{
                                            width:
                                                Math.abs(project.margin) + '%',
                                        }"
                                    ></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 分公司对比分析 -->
                <div class="chart-card">
                    <div class="chart-header">
                        <h3 class="chart-title">
                            <!-- <Building2 class="w-5 h-5" /> -->
							<image src="../static/icon/interactive.png" mode="widthFix" style="width:50rpx"></image>
                            分公司对比分析
                        </h3>
                        <div class="chart-actions">
                            <button
                                class="chart-action-btn"
                                @click="toggleView('branch')"
                            >
                                <!-- <MoreHorizontal class="w-4 h-4" /> -->
								<image src="../static/icon/more.png" mode="widthFix" style="width:50rpx"></image>
                            </button>
                        </div>
                    </div>
                    <div class="chart-content">
                        <div class="branch-comparison">
                            <div
                                v-for="branch in branchData"
                                :key="branch.id"
                                class="branch-item"
                                @click="drillDownBranch(branch)"
                            >
                                <div class="branch-header">
                                    <h4 class="branch-name">
                                        {{ branch.name }}
                                    </h4>
                                    <div
                                        class="branch-status"
                                        :class="branch.status"
                                    >
                                        {{ branch.statusText }}
                                    </div>
                                </div>
                                <div class="branch-metrics">
                                    <div class="metric-row">
                                        <span class="metric-label"
                                            >项目数量</span
                                        >
                                        <span class="metric-value"
                                            >{{ branch.projectCount }}个</span
                                        >
                                    </div>
                                    <div class="metric-row">
                                        <span class="metric-label"
                                            >合同总额</span
                                        >
                                        <span class="metric-value"
                                            >¥{{
                                                formatNumber(
                                                    branch.totalContract
                                                )
                                            }}</span
                                        >
                                    </div>
                                    <div class="metric-row">
                                        <span class="metric-label">已结算</span>
                                        <span class="metric-value"
                                            >¥{{
                                                formatNumber(
                                                    branch.totalSettled
                                                )
                                            }}</span
                                        >
                                    </div>
                                    <div class="metric-row">
                                        <span class="metric-label">总收入</span>
                                        <span class="metric-value"
                                            >¥{{
                                                formatNumber(branch.revenue)
                                            }}</span
                                        >
                                    </div>
                                    <div class="metric-row">
                                        <span class="metric-label">净利润</span>
                                        <span
                                            class="metric-value"
                                            :class="
                                                branch.profit >= 0
                                                    ? 'profit'
                                                    : 'loss'
                                            "
                                        >
                                            ¥{{ formatNumber(branch.profit) }}
                                        </span>
                                    </div>
                                </div>
                                <div class="branch-progress">
                                    <div class="progress-bar">
                                        <div
                                            class="progress-fill"
                                            :style="{
                                                width: branch.performance + '%',
                                            }"
                                        ></div>
                                    </div>
                                    <span class="progress-text"
                                        >完成率 {{ branch.performance }}%</span
                                    >
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- 下钻分析弹窗 -->
        <div
            v-if="showDrillDown"
            class="drill-down-modal"
            @click="closeDrillDown"
        >
            <div class="drill-down-content" @click.stop>
                <div class="drill-down-header">
                    <h3 class="drill-down-title">{{ drillDownData.title }}</h3>
                    <button class="close-btn" @click="closeDrillDown">
                        <X class="w-5 h-5" />
                    </button>
                </div>
                <div class="drill-down-body">
                    <div
                        v-if="drillDownData.type === 'revenue'"
                        class="revenue-breakdown"
                    >
                        <h4 class="breakdown-title">收入构成分析</h4>
                        <div class="breakdown-list">
                            <div
                                v-for="item in drillDownData.data"
                                :key="item.category"
                                class="breakdown-item"
                            >
                                <div class="breakdown-info">
                                    <span class="breakdown-category">{{
                                        item.category
                                    }}</span>
                                    <span class="breakdown-amount"
                                        >¥{{ formatNumber(item.amount) }}</span
                                    >
                                </div>
                                <div class="breakdown-bar">
                                    <div
                                        class="breakdown-fill"
                                        :style="{
                                            width:
                                                (item.amount /
                                                    drillDownData.total) *
                                                    100 +
                                                '%',
                                        }"
                                    ></div>
                                </div>
                                <span class="breakdown-percentage"
                                    >{{
                                        (
                                            (item.amount /
                                                drillDownData.total) *
                                            100
                                        ).toFixed(1)
                                    }}%</span
                                >
                            </div>
                        </div>
                    </div>

                    <div
                        v-if="drillDownData.type === 'expense'"
                        class="expense-breakdown"
                    >
                        <h4 class="breakdown-title">支出构成分析</h4>
                        <div class="breakdown-list">
                            <div
                                v-for="item in drillDownData.data"
                                :key="item.category"
                                class="breakdown-item"
                            >
                                <div class="breakdown-info">
                                    <span class="breakdown-category">{{
                                        item.category
                                    }}</span>
                                    <span class="breakdown-amount"
                                        >¥{{ formatNumber(item.amount) }}</span
                                    >
                                </div>
                                <div class="breakdown-bar">
                                    <div
                                        class="breakdown-fill expense"
                                        :style="{
                                            width:
                                                (item.amount /
                                                    drillDownData.total) *
                                                    100 +
                                                '%',
                                        }"
                                    ></div>
                                </div>
                                <span class="breakdown-percentage"
                                    >{{
                                        (
                                            (item.amount /
                                                drillDownData.total) *
                                            100
                                        ).toFixed(1)
                                    }}%</span
                                >
                            </div>
                        </div>
                    </div>

                    <div
                        v-if="drillDownData.type === 'project'"
                        class="project-detail"
                    >
                        <h4 class="breakdown-title">
                            {{ drillDownData.projectName }} 详细分析
                        </h4>
                        <div class="project-metrics-grid">
                            <div class="project-metric">
                                <span class="metric-label">合同金额</span>
                                <span class="metric-value"
                                    >¥{{
                                        formatNumber(
                                            drillDownData.data.contractAmount
                                        )
                                    }}</span
                                >
                            </div>
                            <div class="project-metric">
                                <span class="metric-label">已结算金额</span>
                                <span class="metric-value"
                                    >¥{{
                                        formatNumber(
                                            drillDownData.data.settledAmount
                                        )
                                    }}</span
                                >
                            </div>
                            <div class="project-metric">
                                <span class="metric-label">已发生成本</span>
                                <span class="metric-value"
                                    >¥{{
                                        formatNumber(
                                            drillDownData.data.actualCost
                                        )
                                    }}</span
                                >
                            </div>
                            <div class="project-metric">
                                <span class="metric-label">应收款</span>
                                <span class="metric-value"
                                    >¥{{
                                        formatNumber(
                                            drillDownData.data.receivableAmount
                                        )
                                    }}</span
                                >
                            </div>
                            <div class="project-metric">
                                <span class="metric-label">进度产值</span>
                                <span class="metric-value"
                                    >¥{{
                                        formatNumber(
                                            drillDownData.data.progressValue
                                        )
                                    }}</span
                                >
                            </div>
                            <div class="project-metric">
                                <span class="metric-label">管理费</span>
                                <span class="metric-value"
                                    >¥{{
                                        formatNumber(
                                            drillDownData.data.managementFee
                                        )
                                    }}</span
                                >
                            </div>
                            <div class="project-metric">
                                <span class="metric-label">管理费返利</span>
                                <span class="metric-value"
                                    >¥{{
                                        formatNumber(
                                            drillDownData.data.managementRebate
                                        )
                                    }}</span
                                >
                            </div>
                            <div class="project-metric">
                                <span class="metric-label">已缴税金</span>
                                <span class="metric-value"
                                    >¥{{
                                        formatNumber(drillDownData.data.paidTax)
                                    }}</span
                                >
                            </div>
                            <div class="project-metric">
                                <span class="metric-label">所属分公司</span>
                                <span class="metric-value">{{
                                    drillDownData.data.branchName
                                }}</span>
                            </div>
                            <div class="project-metric">
                                <span class="metric-label">项目进度</span>
                                <span class="metric-value"
                                    >{{ drillDownData.data.progress }}%</span
                                >
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from "vue";
import { logout } from "../api/login";
import { removeCache } from "../utils";

// 定义事件
const emit = defineEmits<{
    goBack: [];
}>();

// 时间筛选
const timePeriods = [
    { label: "本月", value: "month" },
    { label: "本季度", value: "quarter" },
    { label: "本年度", value: "year" },
    { label: "自定义", value: "custom" },
];

const selectedPeriod = ref("month");
const customDateRange = reactive({
    start: "",
    end: "",
});

// KPI数据
const kpiData = reactive({
    revenue: {
        value: 85000000, // 总收入 = 各分公司收入 + 管理费收入
        change: "+12.5%",
        trend: "up",
    },
    expense: {
        value: 69000000, // 总支出 = 各分公司成本 + 管理费返利支出
        change: "-8.3%",
        trend: "down",
    },
    profit: {
        value: 16000000, // 净利润 = 总收入 - 总支出
        change: "+28.7%",
        trend: "up",
    },
    margin: {
        value: 18.8, // 利润率 = 净利润 / 总收入 * 100
        change: "+3.2%",
        trend: "up",
    },
});

// 总公司汇总指标
const headquartersKpis = reactive({
    totalContract: {
        value: 108000000, // 所有分公司合同金额总和
        change: "+10.8%",
        trend: "up",
    },
    totalSettled: {
        value: 78000000, // 所有分公司已结算金额总和
        change: "+14.2%",
        trend: "up",
    },
    totalCost: {
        value: 69000000, // 所有分公司已发生成本总和
        change: "+7.5%",
        trend: "up",
    },
    totalReceivable: {
        value: 30000000, // 所有分公司应收款总和
        change: "-3.8%",
        trend: "down",
    },
    totalProgressValue: {
        value: 73500000, // 所有分公司进度产值总和
        change: "+12.8%",
        trend: "up",
    },
    totalManagementFee: {
        value: 5400000, // 管理费收入（总公司收入项）
        change: "+8.9%",
        trend: "up",
    },
    totalManagementRebate: {
        value: 1080000, // 管理费返利支出（总公司支出项）
        change: "+9.5%",
        trend: "up",
    },
    totalTax: {
        value: 6500000, // 所有分公司已缴纳税金总和
        change: "+9.8%",
        trend: "up",
    },
    averageProgress: {
        value: 68.3, // 所有项目平均进度
        change: "+6.2%",
        trend: "up",
    },
});

// 趋势数据
const trendData = ref([
    { month: "1月", revenue: 12000000, expense: 10500000 },
    { month: "2月", revenue: 13500000, expense: 11200000 },
    { month: "3月", revenue: 14800000, expense: 12000000 },
    { month: "4月", revenue: 15200000, expense: 12500000 },
    { month: "5月", revenue: 14500000, expense: 11800000 },
    { month: "6月", revenue: 15000000, expense: 12000000 },
]);

// 项目盈利数据（汇总所有分公司项目）
const projectProfitData = ref([
    {
        id: 1,
        name: "城市综合体建设项目",
        code: "PRJ-2024-001",
        branchName: "北京分公司",
        contractAmount: 15000000,
        settledAmount: 10000000,
        actualCost: 8500000,
        receivableAmount: 5000000,
        progressValue: 9500000,
        managementFee: 800000,
        managementRebate: 200000,
        paidTax: 850000,
        revenue: 10800000, // 已结算 + 管理费
        expense: 8700000, // 实际成本 + 管理费返利
        profit: 2100000,
        margin: 19.4,
    },
    {
        id: 2,
        name: "住宅小区开发项目",
        code: "PRJ-2024-002",
        branchName: "北京分公司",
        contractAmount: 12000000,
        settledAmount: 8000000,
        actualCost: 7200000,
        receivableAmount: 4000000,
        progressValue: 7500000,
        managementFee: 600000,
        managementRebate: 150000,
        paidTax: 650000,
        revenue: 8600000,
        expense: 7350000,
        profit: 1250000,
        margin: 14.5,
    },
    {
        id: 3,
        name: "工业园区基础设施建设",
        code: "PRJ-2024-003",
        branchName: "上海分公司",
        contractAmount: 18000000,
        settledAmount: 12000000,
        actualCost: 10500000,
        receivableAmount: 6000000,
        progressValue: 11500000,
        managementFee: 900000,
        managementRebate: 250000,
        paidTax: 950000,
        revenue: 12900000,
        expense: 10750000,
        profit: 2150000,
        margin: 16.7,
    },
    {
        id: 4,
        name: "学校教学楼建设",
        code: "PRJ-2024-004",
        branchName: "广州分公司",
        contractAmount: 8000000,
        settledAmount: 6000000,
        actualCost: 5500000,
        receivableAmount: 2000000,
        progressValue: 5800000,
        managementFee: 400000,
        managementRebate: 100000,
        paidTax: 450000,
        revenue: 6400000,
        expense: 5600000,
        profit: 800000,
        margin: 12.5,
    },
    {
        id: 5,
        name: "商业综合体项目",
        code: "PRJ-2024-005",
        branchName: "北京分公司",
        contractAmount: 20000000,
        settledAmount: 15000000,
        actualCost: 13000000,
        receivableAmount: 5000000,
        progressValue: 14000000,
        managementFee: 1000000,
        managementRebate: 300000,
        paidTax: 1200000,
        revenue: 16000000,
        expense: 13300000,
        profit: 2700000,
        margin: 16.9,
    },
    {
        id: 6,
        name: "医院扩建工程",
        code: "PRJ-2024-006",
        branchName: "上海分公司",
        contractAmount: 16000000,
        settledAmount: 10000000,
        actualCost: 9000000,
        receivableAmount: 6000000,
        progressValue: 9500000,
        managementFee: 800000,
        managementRebate: 200000,
        paidTax: 800000,
        revenue: 10800000,
        expense: 9200000,
        profit: 1600000,
        margin: 14.8,
    },
    {
        id: 7,
        name: "办公楼建设项目",
        code: "PRJ-2024-007",
        branchName: "广州分公司",
        contractAmount: 12000000,
        settledAmount: 8000000,
        actualCost: 7000000,
        receivableAmount: 4000000,
        progressValue: 7500000,
        managementFee: 600000,
        managementRebate: 150000,
        paidTax: 600000,
        revenue: 8600000,
        expense: 7150000,
        profit: 1450000,
        margin: 16.9,
    },
    {
        id: 8,
        name: "道路桥梁工程",
        code: "PRJ-2024-008",
        branchName: "广州分公司",
        contractAmount: 7000000,
        settledAmount: 4000000,
        actualCost: 3500000,
        receivableAmount: 3000000,
        progressValue: 3800000,
        managementFee: 350000,
        managementRebate: 80000,
        paidTax: 350000,
        revenue: 4350000,
        expense: 3580000,
        profit: 770000,
        margin: 17.7,
    },
]);

// 分公司数据
const branchData = ref([
    {
        id: 1,
        name: "北京分公司",
        projectCount: 3,
        totalContract: 47000000,
        totalSettled: 33000000,
        totalCost: 28700000,
        totalReceivable: 14000000,
        totalProgressValue: 31000000,
        totalManagementFee: 2400000,
        totalManagementRebate: 650000,
        totalTax: 2700000,
        revenue: 35400000, // 已结算 + 管理费
        expense: 29350000, // 实际成本 + 管理费返利
        profit: 6050000,
        performance: 78,
        status: "excellent",
        statusText: "优秀",
    },
    {
        id: 2,
        name: "上海分公司",
        projectCount: 2,
        totalContract: 34000000,
        totalSettled: 22000000,
        totalCost: 19500000,
        totalReceivable: 12000000,
        totalProgressValue: 21000000,
        totalManagementFee: 1700000,
        totalManagementRebate: 450000,
        totalTax: 1750000,
        revenue: 23700000,
        expense: 19950000,
        profit: 3750000,
        performance: 72,
        status: "good",
        statusText: "良好",
    },
    {
        id: 3,
        name: "广州分公司",
        projectCount: 3,
        totalContract: 27000000,
        totalSettled: 18000000,
        totalCost: 15500000,
        totalReceivable: 9000000,
        totalProgressValue: 17100000,
        totalManagementFee: 1350000,
        totalManagementRebate: 330000,
        totalTax: 1400000,
        revenue: 19350000,
        expense: 15830000,
        profit: 3520000,
        performance: 68,
        status: "average",
        statusText: "一般",
    },
]);

// 新增总公司汇总KPI卡片数据
const headquartersKpiCards = computed(() => [
    {
        id: "totalContract",
        title: "总合同金额",
        value: headquartersKpis.totalContract.value,
        change: headquartersKpis.totalContract.change,
        trend: headquartersKpis.totalContract.trend,
        icon: "FileText",
        color: "blue",
    },
    {
        id: "totalSettled",
        title: "已结算金额",
        value: headquartersKpis.totalSettled.value,
        change: headquartersKpis.totalSettled.change,
        trend: headquartersKpis.totalSettled.trend,
        icon: "CheckCircle",
        color: "green",
    },
    {
        id: "totalCost",
        title: "已发生成本",
        value: headquartersKpis.totalCost.value,
        change: headquartersKpis.totalCost.change,
        trend: headquartersKpis.totalCost.trend,
        icon: "AlertTriangle",
        color: "orange",
    },
    {
        id: "totalReceivable",
        title: "项目应收款总额",
        value: headquartersKpis.totalReceivable.value,
        change: headquartersKpis.totalReceivable.change,
        trend: headquartersKpis.totalReceivable.trend,
        icon: "Clock",
        color: "purple",
    },
    {
        id: "totalProgressValue",
        title: "进度产值",
        value: headquartersKpis.totalProgressValue.value,
        change: headquartersKpis.totalProgressValue.change,
        trend: headquartersKpis.totalProgressValue.trend,
        icon: "Target",
        color: "indigo",
    },
    {
        id: "totalManagementFee",
        title: "管理费收入",
        value: headquartersKpis.totalManagementFee.value,
        change: headquartersKpis.totalManagementFee.change,
        trend: headquartersKpis.totalManagementFee.trend,
        icon: "TrendingUp",
        color: "emerald",
    },
    {
        id: "totalManagementRebate",
        title: "管理费返利支出",
        value: headquartersKpis.totalManagementRebate.value,
        change: headquartersKpis.totalManagementRebate.change,
        trend: headquartersKpis.totalManagementRebate.trend,
        icon: "ArrowDownCircle",
        color: "red",
    },
    {
        id: "totalTax",
        title: "已缴纳税金",
        value: headquartersKpis.totalTax.value,
        change: headquartersKpis.totalTax.change,
        trend: headquartersKpis.totalTax.trend,
        icon: "Receipt",
        color: "gray",
    },
    {
        id: "averageProgress",
        title: "平均项目进度",
        value: headquartersKpis.averageProgress.value,
        change: headquartersKpis.averageProgress.change,
        trend: headquartersKpis.averageProgress.trend,
        icon: "BarChart3",
        color: "cyan",
        isPercentage: true,
    },
]);

// 下钻分析
const showDrillDown = ref(false);
const drillDownData = reactive({
    title: "",
    type: "",
    data: [],
    total: 0,
    projectName: "",
});

// 计算属性
const maxTrendValue = computed(() => {
    const allValues = trendData.value.flatMap((item) => [
        item.revenue,
        item.expense,
    ]);
    return Math.max(...allValues);
});

// 方法
const goBack = () => {
    emit("goBack");
};

const selectPeriod = (period: string) => {
    selectedPeriod.value = period;
    // 这里可以调用API重新获取数据
    console.log("切换时间周期:", period);
};

const refreshData = () => {
    console.log("刷新数据");
    // 这里可以调用API刷新数据
};

const exportData = () => {
    console.log("导出数据");
    // 这里可以实现数据导出功能
};

const formatNumber = (num: number) => {
    return (num / 10000).toFixed(1) + "万";
};

const drillDown = (type: string) => {
    console.log("下钻分析:", type);

    if (type === "revenue") {
        drillDownData.title = "收入构成分析";
        drillDownData.type = "revenue";
        drillDownData.data = [
            { category: "项目结算收入", amount: 78000000 },
            { category: "管理费收入", amount: 5400000 },
            { category: "其他收入", amount: 1600000 },
        ];
        drillDownData.total = 85000000;
    } else if (type === "expense") {
        drillDownData.title = "支出构成分析";
        drillDownData.type = "expense";
        drillDownData.data = [
            { category: "项目成本", amount: 69000000 },
            { category: "管理费返利", amount: 1080000 },
            { category: "其他支出", amount: 920000 },
        ];
        drillDownData.total = 69000000;
    }

    showDrillDown.value = true;
};

const drillDownMonth = (month: string, type: string) => {
    console.log("月度下钻:", month, type);
    // 实现月度数据下钻
};

const drillDownProject = (project: any) => {
    console.log("项目下钻:", project);
    drillDownData.title = "项目详细分析";
    drillDownData.type = "project";
    drillDownData.projectName = project.name;
    drillDownData.data = {
        contractAmount: project.contractAmount,
        settledAmount: project.settledAmount,
        actualCost: project.actualCost,
        receivableAmount: project.receivableAmount,
        progressValue: project.progressValue,
        managementFee: project.managementFee,
        managementRebate: project.managementRebate,
        paidTax: project.paidTax,
        branchName: project.branchName,
        progress: Math.round(
            (project.progressValue / project.contractAmount) * 100
        ),
    };
    showDrillDown.value = true;
};

const drillDownBranch = (branch: any) => {
    console.log("分公司下钻:", branch);
    // 实现分公司数据下钻
};

const closeDrillDown = () => {
    showDrillDown.value = false;
};

const toggleChartType = (type: string) => {
    console.log("切换图表类型:", type);
};

const toggleView = (view: string) => {
    console.log("切换视图:", view);
};

onMounted(() => {
    // 初始化数据
    console.log("总公司经营分析页面已加载");
});
const exit = async ()=>{
	await logout()
	removeCache('userInfo')
	return uni.redirectTo({
		url: '/pages/login/index'
	})	
}
</script>

<style scoped>
.headquarters-analysis {
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
    z-index: 2;
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

/* 时间筛选器 */
.time-filter-section {
    background: white;
    padding: 1rem 0.75rem;
    border-bottom: 1px solid #e5e7eb;
}

.time-filter-container {
    max-width: 100%;
}

.filter-tabs {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 0.75rem;
}

.filter-tab {
    padding: 0.5rem 1rem;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    background: white;
    color: #6b7280;
    font-size: 0.875rem;
    cursor: pointer;
    transition: all 0.2s;
}

.filter-tab.active {
    background: #3b82f6;
    color: white;
    border-color: #3b82f6;
}

.filter-tab:hover:not(.active) {
    background: #f3f4f6;
}

.custom-date-range {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.date-input {
    padding: 0.5rem;
    border: 1px solid #3b3b3b;
    border-radius: 6px;
    font-size: 0.875rem;
}

.date-separator {
    font-size: 0.875rem;
    color: #6b7280;
}

/* KPI指标卡片 */
.kpi-section {
    padding: 1rem 0.75rem;
}

.kpi-container {
    max-width: 100%;
}

.kpi-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem;
}

.headquarters-kpi-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem;
}

.headquarters-kpi-card {
    background: white;
    border-radius: 12px;
    padding: 1rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    transition: all 0.2s;
    border-left: 4px solid;
}

.headquarters-kpi-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.headquarters-kpi-card.blue {
    border-left-color: #3b82f6;
}
.headquarters-kpi-card.green {
    border-left-color: #10b981;
}
.headquarters-kpi-card.orange {
    border-left-color: #f97316;
}
.headquarters-kpi-card.purple {
    border-left-color: #8b5cf6;
}
.headquarters-kpi-card.indigo {
    border-left-color: #6366f1;
}
.headquarters-kpi-card.emerald {
    border-left-color: #059669;
}
.headquarters-kpi-card.red {
    border-left-color: #ef4444;
}
.headquarters-kpi-card.gray {
    border-left-color: #6b7280;
}
.headquarters-kpi-card.cyan {
    border-left-color: #06b6d4;
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

.kpi-card.revenue {
    border-left-color: #10b981;
}
.kpi-card.expense {
    border-left-color: #ef4444;
}
.kpi-card.profit {
    border-left-color: #3b82f6;
}
.kpi-card.margin {
    border-left-color: #f59e0b;
}

.kpi-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.75rem;
}

.kpi-icon {
    color: #6b7280;
}

.kpi-trend {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    font-size: 0.75rem;
    font-weight: 500;
}

.kpi-trend.up {
    color: #10b981;
}

.kpi-trend.down {
    color: #ef4444;
}

.kpi-title {
    font-size: 0.875rem;
    color: #6b7280;
    margin: 0 0 0.25rem 0;
}

.kpi-value {
    font-size: 1.25rem;
    font-weight: 700;
    color: #1f2937;
    margin: 0 0 0.25rem 0;
}

.kpi-subtitle {
    font-size: 0.75rem;
    color: #6b7280;
    margin: 0;
}

/* 图表区域 */
.charts-section {
    padding: 0 0.75rem 1rem;
}

.charts-container {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.chart-card {
    background: white;
    border-radius: 12px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    overflow: hidden;
}

.chart-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    border-bottom: 1px solid #f3f4f6;
}

.chart-title {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 1rem;
    font-weight: 600;
    color: #1f2937;
    margin: 0;
}

.chart-actions {
    display: flex;
    gap: 0.5rem;
}

.chart-action-btn {
    background: #f3f4f6;
    border: none;
    border-radius: 6px;
    padding: 0.375rem;
    color: #6b7280;
    cursor: pointer;
    transition: all 0.2s;
}

.chart-action-btn:hover {
    background: #e5e7eb;
    color: #374151;
}

.chart-content {
    padding: 1rem;
}

/* 趋势图 */
.trend-chart {
    height: 200px;
}

.chart-legend {
    display: flex;
    gap: 1rem;
    margin-bottom: 1rem;
}

.legend-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.875rem;
    color: #6b7280;
}

.legend-color {
    width: 12px;
    height: 12px;
    border-radius: 2px;
}

.legend-color.revenue {
    background: #10b981;
}

.legend-color.expense {
    background: #ef4444;
}

.chart-bars {
    display: flex;
    align-items: end;
    gap: 0.5rem;
    height: 150px;
}

.bar-group {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
}

.bar-container {
    display: flex;
    align-items: flex-end;
    gap: 2px;
    height: 120px;
    width: 100%;
    justify-content: center;
}

.bar {
    width: 12px;
    border-radius: 2px 2px 0 0;
    cursor: pointer;
    transition: opacity 0.2s;
}

.bar:hover {
    opacity: 0.8;
}

.revenue-bar {
    background: #10b981;
}

.expense-bar {
    background: #ef4444;
}

.bar-label {
    font-size: 0.75rem;
    color: #6b7280;
}

/* 项目盈利列表 */
.project-profit-list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

.profit-item {
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    padding: 0.75rem;
    cursor: pointer;
    transition: all 0.2s;
}

.profit-item:hover {
    border-color: #3b82f6;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.project-info {
    margin-bottom: 0.5rem;
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

.profit-metrics {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 0.5rem;
    margin-bottom: 0.5rem;
}

.metric {
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

.metric-value.revenue {
    color: #10b981;
}

.metric-value.expense {
    color: #ef4444;
}

.metric-value.profit {
    color: #3b82f6;
}

.metric-value.loss {
    color: #ef4444;
}

.profit-bar {
    height: 4px;
    background: #f3f4f6;
    border-radius: 2px;
    overflow: hidden;
}

.profit-fill {
    height: 100%;
    border-radius: 2px;
    transition: width 0.3s ease;
}

.profit-fill.positive {
    background: #10b981;
}

.profit-fill.negative {
    background: #ef4444;
}

/* 分公司对比 */
.branch-comparison {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

.branch-item {
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    padding: 0.75rem;
    cursor: pointer;
    transition: all 0.2s;
}

.branch-item:hover {
    border-color: #3b82f6;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.branch-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
}

.branch-name {
    font-size: 0.875rem;
    font-weight: 600;
    color: #1f2937;
    margin: 0;
}

.branch-status {
    padding: 0.25rem 0.5rem;
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

.branch-metrics {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    margin-bottom: 0.5rem;
}

.metric-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.branch-progress {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.progress-bar {
    flex: 1;
    height: 6px;
    background: #f3f4f6;
    border-radius: 3px;
    overflow: hidden;
}

.progress-fill {
    height: 100%;
    background: #3b82f6;
    border-radius: 3px;
    transition: width 0.3s ease;
}

.progress-text {
    font-size: 0.75rem;
    color: #6b7280;
    white-space: nowrap;
}

/* 下钻分析弹窗 */
.drill-down-modal {
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

.drill-down-content {
    background: white;
    border-radius: 12px;
    max-width: 500px;
    width: 100%;
    max-height: 80vh;
    overflow: hidden;
    display: flex;
    flex-direction: column;
}

.drill-down-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    border-bottom: 1px solid #e5e7eb;
}

.drill-down-title {
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

.drill-down-body {
    padding: 1rem;
    overflow-y: auto;
}

.breakdown-title {
    font-size: 1rem;
    font-weight: 600;
    color: #1f2937;
    margin: 0 0 1rem 0;
}

.breakdown-list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

.breakdown-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
}

.breakdown-info {
    display: flex;
    flex-direction: column;
    min-width: 0;
    flex: 1;
}

.breakdown-category {
    font-size: 0.875rem;
    font-weight: 500;
    color: #1f2937;
}

.breakdown-amount {
    font-size: 0.75rem;
    color: #6b7280;
}

.breakdown-bar {
    flex: 1;
    height: 8px;
    background: #f3f4f6;
    border-radius: 4px;
    overflow: hidden;
}

.breakdown-fill {
    height: 100%;
    background: #10b981;
    border-radius: 4px;
    transition: width 0.3s ease;
}

.breakdown-fill.expense {
    background: #ef4444;
}

.breakdown-percentage {
    font-size: 0.75rem;
    color: #6b7280;
    min-width: 3rem;
    text-align: right;
}

.project-metrics-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
}

.project-metric {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
}

/* 响应式设计 */
@media (max-width: 320px) {
    .header {
        padding: 0.75rem 0.5rem;
    }

    .time-filter-section {
        padding: 0.75rem 0.5rem;
    }

    .kpi-section {
        padding: 0.75rem 0.5rem;
    }

    .charts-section {
        padding: 0 0.5rem 0.75rem;
    }

    .kpi-grid {
        grid-template-columns: 1fr;
    }

    .profit-metrics {
        grid-template-columns: 1fr;
    }

    .project-metrics-grid {
        grid-template-columns: 1fr;
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

    .time-filter-section {
        padding: 1.5rem 1rem;
    }

    .time-filter-container {
        max-width: 1200px;
        margin: 0 auto;
    }

    .kpi-section {
        padding: 1.5rem 1rem;
    }

    .kpi-container {
        max-width: 1200px;
        margin: 0 auto;
    }

    .charts-section {
        padding: 0 1rem 1.5rem;
    }

    .charts-container {
        max-width: 1200px;
        margin: 0 auto;
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 1.5rem;
    }

    .chart-card:first-child {
        grid-column: span 2;
    }

    .kpi-grid {
        grid-template-columns: repeat(4, 1fr);
        gap: 1rem;
    }

    .headquarters-kpi-grid {
        grid-template-columns: repeat(3, 1fr);
        gap: 1rem;
    }

    .profit-metrics {
        grid-template-columns: repeat(4, 1fr);
    }

    .drill-down-content {
        max-width: 600px;
    }
}

@media (min-width: 1024px) {
    .header {
        padding: 2rem 1rem;
    }

    .time-filter-section {
        padding: 2rem 1rem;
    }

    .kpi-section {
        padding: 2rem 1rem;
    }

    .charts-section {
        padding: 0 1rem 2rem;
    }

    .kpi-card {
        padding: 1.5rem;
    }

    .chart-content {
        padding: 1.5rem;
    }

    .headquarters-kpi-grid {
        grid-template-columns: repeat(4, 1fr);
    }
}
</style>
