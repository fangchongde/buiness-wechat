<template>
    <div class="project-info-input">
        <!-- 头部导航 -->
        <header class="header">
            <div class="header-content">
                <uv-button class="back-btn" @click="goBack" icon="arrow-left" color="rgba(255, 255, 255, 0.2)"></uv-button>
                <h1 class="page-title">项目信息录入</h1>
                <div class="header-spacer"></div>
            </div>
        </header>

        <!-- 项目基本信息展示 -->
        <div class="project-info-banner">
            <div class="project-banner-content">
                <div class="project-header">
                    <h2 class="project-name">
                        {{ selectedProject?.name || "未选择项目" }}
                    </h2>
                    <div
                        class="project-status"
                        :class="getStatusClass(selectedProject?.status)"
                    >
                        {{ selectedProject?.status || "未知" }}
                    </div>
                </div>
                <div class="project-details">
                    <div class="detail-item">
                        <span class="detail-label">项目编号:</span>
                        <span class="detail-value">{{
                            selectedProject?.code || "-"
                        }}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">建设单位:</span>
                        <span class="detail-value">{{
                            selectedProject?.constructionUnit || "-"
                        }}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">合同金额:</span>
                        <span class="detail-value"
                            >{{
                                selectedProject?.contractAmount || 0
                            }}万元</span
                        >
                    </div>
                </div>
            </div>
        </div>

        <!-- 表单内容 -->
        <div class="form-container">
            <form class="project-form">
                <!-- 形象进度 (自动计算) -->
                <div class="form-group">
                    <label class="form-label">形象进度</label>
                    <div class="progress-display">
                        <div class="progress-bar-container">
                            <div class="progress-bar">
                                <div
                                    class="progress-fill"
                                    :style="{ width: progressPercentage + '%' }"
                                ></div>
                            </div>
                            <span class="progress-text"
                                >{{ progressPercentage.toFixed(1) }}%</span
                            >
                        </div>
                        <p class="progress-note">
                            <Info class="w-4 h-4" />
                            根据进度产值自动计算，无需手工输入
                        </p>
                    </div>
                </div>

                <!-- 进度产值 -->
                <div class="form-group">
                    <label class="form-label required">进度产值（万元）</label>
                    <div class="input-with-unit">
                        <uv-input
							@blur="(e)=>formData.progressValue = e.replace(/[^\d.]/g,'')"
                            type="digit"
                            v-model="formData.progressValue"
                            step="0.01"
                            class="form-input"
                            placeholder="请输入进度产值"
                            required
                            @input="calculateProgress"
                        />
                        <span class="input-unit">万元</span>
                    </div>
                </div>

                <!-- 造价预估增减 -->
                <div class="form-group">
                    <label class="form-label">造价预估增减（万元）</label>
                    <div class="input-with-unit">
                        <uv-input
                        	@blur="(e)=>formData.costAdjustment = e.replace(/[^\d.]/g,'')"
                            type="digit"
                            v-model="formData.costAdjustment"
                            step="0.01"
                            class="form-input"
                            placeholder="请输入造价增减金额"
                        />
                        <span class="input-unit">万元</span>
                    </div>
                    <p class="field-hint">正数表示增加，负数表示减少</p>
                </div>

                <!-- 结算价 -->
                <div class="form-group">
                    <label class="form-label">结算价（万元）</label>
                    <div class="input-with-unit">
                        <uv-input
                        	@blur="(e)=>formData.settlementPrice = e.replace(/[^\d.]/g,'')"
                            type="digit"
                            v-model="formData.settlementPrice"
                            step="0.01"
                            class="form-input"
                            placeholder="请输入结算价"
                        />
                        <span class="input-unit">万元</span>
                    </div>
                </div>

                <!-- 竣工时间 -->
                <div class="form-group">
                    <label class="form-label">竣工时间</label>
					<input
					    v-model="formData.completionDate"
					    class="form-input"
						disabled="true"
						readOnly="true"
					    required
						@click="$refs.datetimePicker.open()"
					/>
					<uv-datetime-picker ref="datetimePicker" v-model="formData._completionDate"  mode="date" @confirm="(e)=>formData.completionDate = parseTime(e.value,'{y}-{m}-{d}')"></uv-datetime-picker>
                </div>

                <!-- 提交按钮 -->
                <div class="form-actions">
                    <button
						@click="submitForm"
                        type="submit"
                        class="btn-primary"
                        :disabled="isSubmitting"
                    >
						<image src="../static/icon/success.png" mode="widthFix" style="width:40rpx"></image>
                        {{ isSubmitting ? "提交中..." : "提交" }}
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted,getCurrentInstance } from "vue";
import { getProject } from '@/api/project.js'
import { getCache, parseTime, openPage} from '@/utils/index.js'
import { translateDict } from '@/api/dict.js'
import { useToast } from '@/hooks/useToast.js'
import { progressDetail,addProgress,editProgress } from '@/api/progress.js'
const { project_status } = getCache('dict')
const project_status_dict = ref(project_status)
const { showToast } = useToast()
const {proxy } = getCurrentInstance() as any
// 定义 props
const props = defineProps<{
    selectedProject?: any;
}>();

// 定义事件
const emit = defineEmits<{
    goBack: [];
}>();

// 表单数据
const formData = reactive({
	id:"",
	progressPercentage:0,
    progressValue: "",
    costAdjustment: "",
    settlementPrice: "",
	projectId:props.selectedProject.id,
	completionDate:parseTime(Date.now(),'{y}-{m}-{d}'),
	_completionDate:parseTime(Date.now(),'{y}-{m}-{d}'),
	recordDate:parseTime(Date.now(),'{y}-{m}-{d}'),
	// expectedCompletionDate:"",  //预计竣工时间
	// _expectedCompletionDate:"",
	// actualCompletionDate:"", // 实际竣工时间
	// _actualCompletionDate:"", // 实际竣工时间
});
const initFormData = ()=>{
	const progressInfo =  props.selectedProject && props.selectedProject.progressInfo
	if(progressInfo){
		for(const key in progressInfo){
			formData[key] = progressInfo[key]
		}
		formData.completionDate = parseTime(progressInfo.completionDate,'{y}-{m}-{d}')
		formData._completionDate = formData.completionDate
	}
}
initFormData()
// 文件上传相关
const completionFileInput = ref<HTMLInputElement>();
const materialFileInput = ref<HTMLInputElement>();
const completionFiles = ref<File[]>([]);
const materialFiles = ref<File[]>([]);
const isSubmitting = ref(false);

// 计算形象进度
const progressPercentage = computed(() => {
    const progressValue = parseFloat(formData.progressValue) || 0;
    const contractAmount = props.selectedProject?.contractAmount || 1;
    return Math.min((progressValue / contractAmount) * 100, 100);
});

// 返回上一页
const goBack = () => {
    emit("goBack");
};

// 计算进度（当进度产值变化时触发）
const calculateProgress = () => {
    // 进度会通过 computed 属性自动计算
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

// 竣工资料文件上传
const triggerCompletionFileUpload = () => {
    completionFileInput.value?.click();
};

const handleCompletionFileUpload = (event: Event) => {
    const target = event.target as HTMLInputElement;
    const files = target.files;
    if (files) {
        completionFiles.value.push(...Array.from(files));
    }
};

const removeCompletionFile = (index: number) => {
    completionFiles.value.splice(index, 1);
};

// 材料核销文件上传
const triggerMaterialFileUpload = () => {
    materialFileInput.value?.click();
};

const handleMaterialFileUpload = (event: Event) => {
    const target = event.target as HTMLInputElement;
    const files = target.files;
    if (files) {
        materialFiles.value.push(...Array.from(files));
    }
};

const removeMaterialFile = (index: number) => {
    materialFiles.value.splice(index, 1);
};

// 保存草稿
const saveDraft = () => {
    console.log("保存草稿:", {
        project: props.selectedProject,
        formData,
        completionFiles: completionFiles.value,
        materialFiles: materialFiles.value,
        progressPercentage: progressPercentage.value,
    });
};

// 提交表单
const submitForm = async () => {
	if(isSubmitting.value){
		return
	}
	if(!formData.progressValue){
		return showToast("请输入进度产值");
	}
	formData.progressPercentage = progressPercentage.value
    isSubmitting.value = true;
	const fn = formData.id?editProgress:addProgress
	const result = await fn(formData).catch(e=>{
		isSubmitting.value = false;
	})
	if(result){
		showToast({
			message:formData.id?"修改成功":"录入成功",
			complete:()=>{
				isSubmitting.value = false;
				return openPage({url:'/pages/index/index'})
			}
		});			
	}
};

// 组件挂载时的初始化
onMounted(() => {
    if (!props.selectedProject) {
        console.warn("未选择项目");
    }
});
</script>

<style scoped>
.project-info-input {
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

.header-spacer {
    width: 2.5rem;
    flex-shrink: 0;
}

/* 项目信息横幅 */
.project-info-banner {
    background: white;
    padding: 1rem 0.75rem;
    border-bottom: 1px solid #e5e7eb;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.project-banner-content {
    max-width: 100%;
}

.project-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 0.75rem;
}

.project-name {
    font-size: 1.125rem;
    font-weight: 600;
    color: #1f2937;
    margin: 0;
    flex: 1;
    min-width: 0;
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
    gap: 0.5rem;
}

.detail-item {
    display: flex;
    flex-direction: column;
    gap: 0.125rem;
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

/* 表单容器 */
.form-container {
    padding: 1rem 0.75rem;
    max-width: 100%;
}

.project-form {
    background: white;
    border-radius: 12px;
    /* padding: 1.5rem; */
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    max-width: 100%;
}

/* 表单组样式 */
.form-group {
    margin-bottom: 1.5rem;
}

.form-label {
    display: block;
    font-size: 0.875rem;
    font-weight: 600;
    color: #374151;
    margin-bottom: 0.5rem;
    text-align: start;
}

.form-label.required::after {
    content: " *";
    color: #ef4444;
}

.form-input {
    padding: 0.75rem;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    font-size: 0.875rem;
    transition: border-color 0.2s, box-shadow 0.2s;
}

.form-input:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-input::placeholder {
    color: #9ca3af;
}

/* 带单位的输入框 */
.input-with-unit {
    position: relative;
    display: flex;
    align-items: center;
}

.input-with-unit .form-input {
    padding-right: 3rem;
}

.input-unit {
    position: absolute;
    right: 0.75rem;
    font-size: 0.875rem;
    color: #6b7280;
    pointer-events: none;
}

/* 进度显示 */
.progress-display {
    background: #f9fafb;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    padding: 1rem;
}

.progress-bar-container {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 0.5rem;
}

.progress-bar {
    flex: 1;
    height: 8px;
    background: #e5e7eb;
    border-radius: 4px;
    overflow: hidden;
}

.progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #3b82f6, #1d4ed8);
    border-radius: 4px;
    transition: width 0.3s ease;
}

.progress-text {
    font-size: 0.875rem;
    font-weight: 600;
    color: #1f2937;
    min-width: 3rem;
    text-align: right;
}

.progress-note {
    display: flex;
    align-items: center;
    gap: 0.375rem;
    font-size: 0.75rem;
    color: #6b7280;
    margin: 0;
}

/* 字段提示 */
.field-hint {
    font-size: 0.75rem;
    color: #6b7280;
    margin: 0.375rem 0 0 0;
}

/* 文件上传样式 */
.file-upload-area {
    border: 2px dashed #d1d5db;
    border-radius: 8px;
    padding: 2rem 1rem;
    text-align: center;
    cursor: pointer;
    transition: border-color 0.2s, background-color 0.2s;
}

.file-upload-area:hover {
    border-color: #3b82f6;
    background-color: #f8fafc;
}

.file-input {
    display: none;
}

.upload-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
}

.upload-text {
    font-size: 0.875rem;
    font-weight: 500;
    color: #374151;
    margin: 0;
}

.upload-hint {
    font-size: 0.75rem;
    color: #6b7280;
    margin: 0;
}

/* 已上传文件列表 */
.uploaded-files {
    margin-top: 1rem;
    space-y: 0.5rem;
}

.file-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem;
    background: #f3f4f6;
    border-radius: 6px;
    margin-bottom: 0.5rem;
}

.file-name {
    flex: 1;
    font-size: 0.875rem;
    color: #374151;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.remove-file-btn {
    background: none;
    border: none;
    color: #ef4444;
    cursor: pointer;
    padding: 0.25rem;
    border-radius: 4px;
    transition: background-color 0.2s;
}

.remove-file-btn:hover {
    background: #fee2e2;
}

/* 表单操作按钮 */
.form-actions {
    display: flex;
    gap: 1rem;
    margin-top: 2rem;
    padding-top: 1.5rem;
    border-top: 1px solid #e5e7eb;
}

.btn-secondary,
.btn-primary {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.75rem 1rem;
    border-radius: 8px;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    border: none;
}

.btn-secondary {
    background: #f3f4f6;
    color: #374151;
}

.btn-secondary:hover {
    background: #e5e7eb;
}

.btn-primary {
    background: #3b82f6;
    color: white;
}

.btn-primary:hover:not(:disabled) {
    background: #2563eb;
}

.btn-primary:disabled {
    background: #9ca3af;
    cursor: not-allowed;
}

/* 响应式设计 */
@media (max-width: 320px) {
    .header {
        padding: 0.75rem 0.5rem;
    }

    .project-info-banner {
        padding: 0.75rem 0.5rem;
    }

    .form-container {
        padding: 0.75rem 0.5rem;
    }

    .project-form {
        padding: 1rem;
    }

    .page-title {
        font-size: 1rem;
    }

    .form-actions {
        flex-direction: column;
    }

    .project-details {
        grid-template-columns: 1fr;
    }
}

@media (min-width: 375px) {
    .header {
        padding: 1rem 0.875rem;
    }

    .project-info-banner {
        padding: 1rem 0.875rem;
    }

    .form-container {
        padding: 1rem 0.875rem;
    }
}

@media (min-width: 414px) {
    .header {
        padding: 1.25rem 1rem;
    }

    .project-info-banner {
        padding: 1.25rem 1rem;
    }

    .form-container {
        padding: 1.25rem 1rem;
    }

    .project-form {
        /* padding: 1.75rem; */
    }

    .page-title {
        font-size: 1.25rem;
    }

    .project-name {
        font-size: 1.25rem;
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

    .project-info-banner {
        padding: 1.5rem 1rem;
    }

    .project-banner-content {
        max-width: 1200px;
        margin: 0 auto;
    }

    .form-container {
        padding: 1.5rem 1rem;
        max-width: 1200px;
        margin: 0 auto;
    }

    .project-form {
        /* max-width: 800px;
        margin: 0 auto; */
        /* padding: 2rem; */
    }

    .form-actions {
        max-width: 400px;
        margin-left: auto;
        margin-right: auto;
    }

    .project-details {
        grid-template-columns: repeat(3, 1fr);
    }
}

@media (min-width: 1024px) {
    .header {
        padding: 2rem 1rem;
    }

    .project-info-banner {
        padding: 2rem 1rem;
    }

    .form-container {
        padding: 2rem 1rem;
    }

    .project-form {
        padding: 2.5rem;
    }
}
</style>
