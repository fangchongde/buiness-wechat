<template>
  <div class="employee-projects">
    <div class="projects-header">
      <h2 class="section-title">
        <User class="w-5 h-5" />
        我的项目
      </h2>
      <p class="section-subtitle">{{ employeeName }} 参与的项目</p>
    </div>

    <div class="projects-list">
      <div 
        v-for="project in employeeProjects" 
        :key="project.id"
        class="project-card"
        @click="viewProjectDetail(project)"
      >
        <div class="project-header">
          <div class="project-info">
            <h3 class="project-name">{{ project.name }}</h3>
            <p class="project-code">{{ project.code }}</p>
          </div>
          <div class="project-status" :class="getStatusClass(project.status)">
            {{ project.status }}
          </div>
        </div>

        <div class="project-details">
          <div class="detail-row">
            <span class="detail-label">建设单位:</span>
            <span class="detail-value">{{ project.constructionUnit }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">项目负责人:</span>
            <span class="detail-value">{{ project.manager }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">合同金额:</span>
            <span class="detail-value">{{ formatAmount(project.contractAmount) }}万元</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">开工时间:</span>
            <span class="detail-value">{{ formatDate(project.startDate) }}</span>
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

        <div class="project-actions">
          <ChevronRight class="w-5 h-5 text-gray-400" />
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-if="employeeProjects.length === 0" class="empty-state">
      <FileX class="w-16 h-16 text-gray-300" />
      <h3 class="empty-title">暂无相关项目</h3>
      <p class="empty-desc">您当前没有参与任何项目</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { User, ChevronRight, FileX } from 'lucide-vue-next'

// 定义 props
const props = defineProps<{
  employeeName: string
}>()

// 定义事件
const emit = defineEmits<{
  viewProject: [project: any]
}>()

// 模拟项目数据
const allProjects = ref([
  {
    id: 1,
    code: 'PRJ-2024-001',
    name: '城市综合体建设项目',
    constructionUnit: '市政建设集团',
    manager: '张三',
    startDate: '2024-01-15',
    contractAmount: 5800,
    status: '进行中',
    progress: 75,
    participants: ['张三', '李四', '王五']
  },
  {
    id: 2,
    code: 'PRJ-2024-002',
    name: '住宅小区开发项目',
    constructionUnit: '房地产开发公司',
    manager: '李四',
    startDate: '2024-02-20',
    contractAmount: 3200,
    status: '进行中',
    progress: 45,
    participants: ['李四', '张三', '赵六']
  },
  {
    id: 3,
    code: 'PRJ-2024-003',
    name: '工业园区基础设施',
    constructionUnit: '工业园区管委会',
    manager: '王五',
    startDate: '2024-03-10',
    contractAmount: 2800,
    status: '已完工',
    progress: 100,
    participants: ['王五', '赵六']
  },
  {
    id: 4,
    code: 'PRJ-2024-004',
    name: '学校教学楼建设',
    constructionUnit: '教育局',
    manager: '张三',
    startDate: '2024-04-05',
    contractAmount: 1500,
    status: '进行中',
    progress: 30,
    participants: ['张三', '钱七']
  }
])

// 筛选员工相关的项目
const employeeProjects = computed(() => {
  return allProjects.value.filter(project => 
    project.participants.includes(props.employeeName) || 
    project.manager === props.employeeName
  )
})

// 获取状态样式类
const getStatusClass = (status: string) => {
  switch (status) {
    case '进行中':
      return 'status-active'
    case '已完工':
      return 'status-completed'
    case '暂停':
      return 'status-paused'
    default:
      return 'status-default'
  }
}

// 格式化金额
const formatAmount = (amount: number) => {
  return amount.toLocaleString()
}

// 格式化日期
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN')
}

// 查看项目详情
const viewProjectDetail = (project: any) => {
  console.log('查看项目详情:', project)
  emit('viewProject', project)
}
</script>

<style scoped>
.employee-projects {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-top: 1rem;
}

.projects-header {
  margin-bottom: 1rem;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 0.25rem 0;
}

.section-subtitle {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
}

.projects-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.project-card {
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 1rem;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
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
  font-size: 0.875rem;
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
  margin-left: 0.5rem;
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

.project-details {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.375rem;
  margin-bottom: 0.75rem;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.detail-label {
  font-size: 0.75rem;
  color: #6b7280;
}

.detail-value {
  font-size: 0.75rem;
  font-weight: 600;
  color: #1f2937;
}

.project-progress {
  margin-bottom: 0.5rem;
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

.project-actions {
  position: absolute;
  top: 50%;
  right: 1rem;
  transform: translateY(-50%);
}

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
  .employee-projects {
    padding: 1rem;
  }
  
  .project-details {
    grid-template-columns: 1fr;
    gap: 0.25rem;
  }
  
  .project-actions {
    display: none;
  }
}

@media (min-width: 768px) {
  .projects-list {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }
  
  .project-details {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }
}

@media (min-width: 1024px) {
  .projects-list {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>