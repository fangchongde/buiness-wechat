<template>
    <div class="labor-input">
        <!-- 头部导航 -->
        <header class="header">
            <div class="header-content">
                <uv-button class="back-btn" @click="goBack" icon="arrow-left" color="rgba(255, 255, 255, 0.2)"></uv-button>
                <h1 class="page-title">人工工时录入</h1>
                <div class="header-spacer"></div>
            </div>
        </header>

        <!-- 日期选择 -->
        <div class="date-section">
            <div class="date-container">
                <div class="date-selector">
                    <div class="date-info">
                        <label class="date-label">工作日期</label>
						    <input
						        v-model="selectedDate"
						        class="form-input"
								disabled="true"
								readOnly="true"
						        required
								@click="$refs.datetimePicker.open()"
						    />
							<uv-datetime-picker ref="datetimePicker" v-model="_selectedDate"  mode="date" @confirm="(e)=>selectedDate = parseTime(e.value,'{y}-{m}-{d}')"></uv-datetime-picker>
                    </div>
                </div>

                <!-- 当日已有记录提醒 -->
                <div
                    v-if="existingRecords.length > 0"
                    class="existing-records-alert"
                >
                    <uv-icon name="error-circle"></uv-icon>
                    <span class="alert-text">
                        当日已有 {{ existingRecords.length }} 条工时记录
                    </span>
                    <button
                        @click="showExistingRecords = !showExistingRecords"
                        class="toggle-btn"
                    >
                        {{ showExistingRecords ? "收起" : "查看" }}
                    </button>
                </div>

                <!-- 已有记录列表 -->
                <div
                    v-if="showExistingRecords && existingRecords.length > 0"
                    class="existing-records-list"
                >
                    <h3 class="records-title">当日已录入工时</h3>
                    <div class="records-grid">
                        <div
                            v-for="record in existingRecords"
                            :key="record.id"
                            class="record-item"
                        >
                            <div class="record-info">
                                <span class="employee-name">{{
                                    record.employeeName
                                }}</span>
                                <span class="employee-id"
                                    >({{ record.employeeId }})</span
                                >
                            </div>
                            <div class="record-details">
                                <span class="project-name">{{
                                    record.projectName
                                }}</span>
                                <span class="work-hours"
                                    >{{ record.workHours }}天</span
                                >
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- 工时录入表单 -->
        <div class="form-container">
            <form class="labor-form">
                <!-- 项目工时信息 -->
                <div class="form-section">
                    <h2 class="section-title">
                        <uv-icon name="clock"></uv-icon>
                        工时信息
                    </h2>

                    <!-- 工时记录列表 -->
                    <div class="work-hours-list">
                        <div
                            v-for="(item, index) in workHoursList"
                            :key="index"
                            class="work-hours-item"
                        >
                            <div class="item-header">
                                <span class="item-number">{{ index + 1 }}</span>
                                <uv-button
									icon="close-circle"
                                    v-if="workHoursList.length > 1"
                                    type="button"
                                    @click="removeWorkHoursItem(index)"
                                    class="remove-btn"
                                >
                                </uv-button>
                            </div>
							<div class="form-row">
								<uv-radio-group v-model="item.workType">
									<uv-radio 
										:customStyle="{margin: '0px 16rpx 20rpx 16rpx'}" 
										v-for="(item, index) in workTypes" 
										:key="index" 
										:label="item.name" 
										:name="item.name">
									</uv-radio>
								</uv-radio-group>
							</div>
                            <div class="form-row">
                                <div class="form-group flex-2">
                                    <label class="form-label required"
                                        >项目名称</label
                                    >
									  <riko-combox 
										:value="item._projectId"
										@input="(e)=>projectIdChange(e,item)" 
										emptyTips="未查询到项目" 
										:candidates="localdata"
										placeholder="请选择项目"
										:inputFlag = "true"
									  >
									  </riko-combox>
                                </div>
								<div class="form-group flex-2">
								    <label class="form-label required"
								        >人员</label
								    >
									  <riko-combox 
										:value="item._employeeId"
										@input="(e)=>employeeIdChange(e,item)" 
										emptyTips="未查询到人员" 
										:candidates="employeeList"
										placeholder="请选择人员"
										:inputFlag = "true"
									  >
									  </riko-combox>
								</div>

                                <div class="form-group">
                                    <label class="form-label required"
                                        >工时（天）</label
                                    >
                                    <!-- <input
                                        v-model="item.workHours"
                                        type="number"
                                        step="0.1"
                                        min="0.1"
                                        max="1.0"
                                        class="form-input"
                                        placeholder="0.1-1.0"
                                        required
                                        @input="validateWorkHours(index)"
                                    /> -->
									<uv-input
										@blur="(e)=>item.workHours = e.replace(/[^\d.]/g,'')"
									    type="digit"
									    v-model="item.workHours"
									    step="0.01"
									    class="form-input"
									    placeholder="0.1-1.0"
									/>
                                </div>
                            </div>
							<!-- 备注信息 -->
							<div class="form-section">
							    <h2 class="section-title">
							        备注信息
							    </h2>
							    <div class="form-group">
							        <textarea
							            v-model="item.remarks"
							            class="form-textarea"
							            placeholder="请描述具体工作内容（可选）"
							            rows="3"
							        ></textarea>
							    </div>
							</div>

                            <!-- 项目信息显示 -->
                            <div
                                v-if="item.projectInfo"
                                class="project-info-display"
                            >
                                <div class="project-detail">
                                    <span class="detail-label">建设单位:</span>
                                    <span class="detail-value">{{
                                        item.projectInfo.constructionUnit
                                    }}</span>
                                </div>
                                <div class="project-detail">
                                    <span class="detail-label"
                                        >项目负责人:</span
                                    >
                                    <span class="detail-value">{{
                                        item.projectInfo.projectManager
                                    }}</span>
                                </div>
                            </div>

                            <!-- 工时验证提示 -->
                            <div
                                v-if="item.validation && item.validation.show"
                                class="validation-message"
                                :class="item.validation.type"
                            >
                                <AlertCircle class="w-4 h-4" />
                                <span>{{ item.validation.message }}</span>
                            </div>
                        </div>
                    </div>

                    <!-- 添加项目按钮 -->
                    <button
                        type="button"
                        @click="addWorkHoursItem"
                        class="add-project-btn"
                    >
                        <Plus class="w-4 h-4" />
                        添加项目工时
                    </button>

                    <!-- 总工时显示 -->
                    <div class="total-hours-display">
                        <div class="total-info">
                            <span class="total-label">当日总工时:</span>
                            <span
                                class="total-value"
                                :class="{ 'over-limit': totalHours > 1.0 }"
                            >
                                {{ totalHours.toFixed(1) }}天
                            </span>
                        </div>
                        <!-- <div v-if="totalHours > 1.0" class="over-limit-warning">
                            <uv-icon name="error-circle"></uv-icon>
                            <span>总工时不能超过1.0天</span>
                        </div> -->
                    </div>
                </div>

                <!-- 提交按钮 -->
                <div class="form-actions">
                    <!-- <button
                        type="button"
                        @click="saveDraft"
                        class="btn-secondary"
                    >
						<image src="../static/icon/saver.png" mode="widthFix" style="width:40rpx"></image>
                        保存草稿
                    </button> -->
                    <button
						@click="submitForm" 
                        type="submit"
                        class="btn-primary"
                        :disabled="isSubmitting"
                    >
                        <!-- <CheckCircle class="w-4 h-4" /> -->
						<image src="../static/icon/success.png" mode="widthFix" style="width:40rpx"></image>
                        {{ isSubmitting ? "提交中..." : "提交工时" }}
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive,defineOptions,getCurrentInstance,onMounted, watch, computed } from "vue";
import { getProject } from '@/api/project.js'
import { getUserListByBranchId,addHours, getHours } from '@/api/hours.js'

import { useToast } from '@/hooks/useToast.js'
import { getCache, setCache, parseTime, openPage } from '@/utils/index.js'
import { getUserInfo } from "@/api/login";
const { showToast } = useToast()
const { proxy } = getCurrentInstance() as any

// 定义事件
const emit = defineEmits<{
    goBack: [];
}>();
onMounted(()=>{
})
// 表单数据
const selectedDate = ref(parseTime(Date.now(),'{y}-{m}-{d}'));
const _selectedDate = ref(parseTime(Date.now(),'{y}-{m}-{d}'));
const formData = reactive({
    employeeName: "",
    employeeId: "",
    workDescription: "",
});
const workTypes = [
	{name: '工作日'}, 
	{name: '加班'},
]
const projectIdChange = (e:any,item:any)=>{
	if(e){
		item.projectId = e.id
		item.projectInfo = e
	}else{
		item.projectId = ""
		item.projectInfo = null
	}
	getUserList(e && e.branchId,item)
}
const employeeIdChange = (e:any,item:any)=>{
	if(e){
		item.employeeId = e.userId
		item.branchId = e.branchId
		item.branchName = e.branchName
	}else{
		item.employeeId = ""
		item.branchId = ''
		item.branchName = ''
	}
}

const getUserList = async (branchId:string,item:any)=>{
	if(branchId){
		const userList = await getUserListByBranchId(branchId)
		employeeList.value = userList.data.map(x=>{
		return {
			id:x.id,
			name:x.nickName,
			...x
		}
	})
		console.log(userList)
	}else{
		employeeIdChange(null,item)
	}
}

// 工时记录列表
const workHoursList = ref([
    {
		_projectId:{},
		_employeeId:{},
		workDate:"",
		employeeId:"",
        projectId: "",
        workHours: "",
		remarks:"",
		branchId:"",
		branchName:"",
		workType:"工作日",
        projectInfo: null,
        validation: null,
		submited:false,
    },
]);

// 状态管理
const isSubmitting = ref(false);
const showExistingRecords = ref(false);
const employeeValidation = ref({
    show: false,
    type: "success",
    message: "",
});

// 已有记录（模拟数据）
const existingRecords = ref([]);
const localdata = ref([])
const employeeList = ref([])
const availableProjects = ref([])
const renderProjectList = async ()=>{
	const list = await getProject()
	availableProjects.value = list.rows
	localdata.value = list.rows.map(x=>{
		return {
			id:x.id,
			name:x.projectName + " " + x.projectCode,
			...x
		}
	})
}

renderProjectList()

// 计算总工时
const totalHours = computed(() => {
    return workHoursList.value.reduce((total, item) => {
        const hours = parseFloat(item.workHours) || 0;
        return total + hours;
    }, 0);
});

// 返回上一页
const goBack = () => {
    emit("goBack");
};

// 检查已有记录
const checkExistingRecords = () => {
    console.log("检查日期:", selectedDate.value);
	getHours({workDate:selectedDate.value}).then(res=>{
		existingRecords.value = res.rows.map(x=>{
			return {
				id: x.id,
				employeeName: x.employeeName,
				employeeId: x.employeeId,
				projectName: x.projectName,
				workHours: x.workHours,
				date: x.workDate
			}
		})
	})
};

// 检查员工信息
const checkEmployeeInfo = () => {
    if (formData.employeeName && formData.employeeId) {
        // 模拟员工信息验证
        const isValid = formData.employeeId.startsWith("EMP");

        employeeValidation.value = {
            show: true,
            type: isValid ? "success" : "error",
            message: isValid
                ? "员工信息验证通过"
                : "工号格式不正确，应以EMP开头",
        };

        setTimeout(() => {
            employeeValidation.value.show = false;
        }, 3000);
    }
};

// 添加工时项目
const addWorkHoursItem = () => {
    workHoursList.value.push({
		_projectId:{},
		_employeeId:{},
		workDate:"",
		employeeId:"",
        projectId: "",
        workHours: "",
		remarks:"",
		branchId:"",
		branchName:"",
		workType:"工作日",
        projectInfo: null,
        validation: null,
		submited:false,
    });
};

// 移除工时项目
const removeWorkHoursItem = (index: number) => {
    workHoursList.value.splice(index, 1);
};

// 更新项目信息
const updateProjectInfo = (index: number) => {
    const item = workHoursList.value[index];
    const project = availableProjects.value.find(
        (p) => p.id === parseInt(item.projectId)
    );
    item.projectInfo = project || null;
};

// 验证工时
const validateWorkHours = (index: number) => {
    const item = workHoursList.value[index];
    const hours = parseFloat(item.workHours);

    if (hours && (hours < 0.1 || hours > 1.0)) {
        item.validation = {
            show: true,
            type: "error",
            message: "工时必须在0.1-1.0天之间",
        };
    } else {
        item.validation = null;
    }
};

// 保存草稿
const saveDraft = () => {
    console.log("保存草稿:", {
        date: selectedDate.value,
        employee: formData,
        workHours: workHoursList.value,
        totalHours: totalHours.value,
    });
    alert("草稿已保存");
};

const submitForm = async () => {
	if(isSubmitting.value){
		return
	}
	if(!selectedDate.value){
		return showToast("请填写工作日期");
	}
	// if (totalHours.value > 1.0) {
	//     showToast("总工时不能超过1.0天，请调整后再提交");
	//     return;
	// }
	const notPass = workHoursList.value.findIndex(x=>!x.employeeId || !x.projectId || !x.workHours)
	if(notPass != -1){
		return showToast(`请将第${notPass+1}条工时记录内容填写完整`);
	}
	workHoursList.value.forEach(x=>{
		x.workDate = selectedDate.value
		x.workHours = parseFloat(x.workHours) as any
	})
	isSubmitting.value = true;
	for(let i=0;i<workHoursList.value.length;i++){
		const w = workHoursList.value[i]
		// 跳过已提交的工时，防止重复录入
		if(w.submited){
			continue;
		}
		const isSucc = await addHours(w).catch(e=>{
			return false
		})
		if(!isSucc){
			isSubmitting.value = true;
			return;
		}else{
			workHoursList.value[i].submited = true
		}
	}
	showToast({
		message:"录入成功",
		complete:()=>{
			isSubmitting.value = false;
			return openPage({url:'/pages/index/index'})
		}
	});			
};
// 监听日期变化
watch(selectedDate, () => {
    checkExistingRecords();
},{
	immediate:true
});
</script>
<style scoped>
.labor-input {
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

/* 日期选择区域 */
.date-section {
    background: white;
    padding: 1rem 0.75rem;
    border-bottom: 1px solid #e5e7eb;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.date-container {
    max-width: 100%;
}

.date-selector {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 1rem;
}

.date-info {
    flex: 1;
}

.date-label {
    display: block;
    font-size: 0.875rem;
    font-weight: 600;
    color: #374151;
    margin-bottom: 0.25rem;
}

.date-input {
    /* width: 100%; */
    padding: 0.75rem;
    border: 1px solid #3b3b3b;
    border-radius: 8px;
    font-size: 0.875rem;
    background: #3b3b3b;
}

.date-input:focus {
    outline: none;
    border-color: #3b82f6;
    background: #3b3b3b;
}

/* 已有记录提醒 */
.existing-records-alert {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem;
    background: #fef3c7;
    border: 1px solid #f59e0b;
    border-radius: 8px;
    margin-bottom: 1rem;
}

.alert-text {
    flex: 1;
    font-size: 0.875rem;
    color: #92400e;
    font-weight: 500;
}

.toggle-btn {
    background: none;
    border: none;
    color: #d97706;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    text-decoration: underline;
}

.existing-records-list {
    background: #f9fafb;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    padding: 1rem;
}

.records-title {
    font-size: 0.875rem;
    font-weight: 600;
    color: #374151;
    margin-bottom: 0.75rem;
}

.records-grid {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.record-item {
    background: white;
    border-radius: 6px;
    padding: 0.75rem;
    border: 1px solid #e5e7eb;
}

.record-info {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.25rem;
}

.employee-name {
    font-size: 0.875rem;
    font-weight: 600;
    color: #1f2937;
}

.employee-id {
    font-size: 0.75rem;
    color: #6b7280;
}

.record-details {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.project-name {
    font-size: 0.75rem;
    color: #6b7280;
    flex: 1;
}

.work-hours {
    font-size: 0.75rem;
    font-weight: 600;
    color: #3b82f6;
}

/* 表单容器 */
.form-container {
    padding: 1rem 0.75rem;
    max-width: 100%;
}

.labor-form {
    background: white;
    border-radius: 12px;
    /* padding: 1.5rem; */
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    max-width: 100%;
}

/* 表单区域 */
.form-section {
    margin-bottom: 2rem;
    padding-bottom: 1.5rem;
    border-bottom: 1px solid #f3f4f6;
}

.form-section:last-of-type {
    border-bottom: none;
    margin-bottom: 0;
    padding-bottom: 0;
}

.section-title {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 1rem;
    font-weight: 600;
    color: #1f2937;
    margin-bottom: 1rem;
}

/* 表单组样式 */
.form-row {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    margin-bottom: 1rem;
}

.form-group {
    width: 100%;
    display: flex;
    flex-direction: column;
}

.form-group.flex-2 {
    grid-column: span 2;
}

.form-label {
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

.form-input,
.form-select {
    padding: 0.75rem;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    font-size: 0.875rem;
    transition: border-color 0.2s, box-shadow 0.2s;
}

.form-input:focus,
.form-select:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-textarea {
    padding: 0.75rem;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    font-size: 0.875rem;
    resize: vertical;
    min-height: 80px;
	width: 100%;
	box-sizing: border-box;
    font-family: inherit;
}

.form-textarea:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* 验证消息 */
.validation-message {
    display: flex;
    align-items: center;
    gap: 0.375rem;
    padding: 0.5rem;
    border-radius: 6px;
    font-size: 0.75rem;
    font-weight: 500;
    margin-top: 0.5rem;
}

.validation-message.success {
    background: #d1fae5;
    color: #065f46;
}

.validation-message.error {
    background: #fee2e2;
    color: #dc2626;
}

/* 工时记录列表 */
.work-hours-list {
    margin-bottom: 1rem;
}

.work-hours-item {
    background: #f9fafb;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    padding: 1rem;
    margin-bottom: 1rem;
}

.item-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
}

.item-number {
    background: #3b82f6;
    color: white;
    width: 1.5rem;
    height: 1.5rem;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.75rem;
    font-weight: 600;
}

.remove-btn {
    background: #fee2e2;
    border: none;
    border-radius: 6px;
    padding: 0.375rem;
    color: #dc2626;
    cursor: pointer;
    transition: background-color 0.2s;
}

.remove-btn:hover {
    background: #fecaca;
}

/* 项目信息显示 */
.project-info-display {
    background: white;
    border-radius: 6px;
    padding: 0.75rem;
    margin-top: 0.75rem;
    border: 1px solid #e5e7eb;
}

.project-detail {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.25rem;
}

.project-detail:last-child {
    margin-bottom: 0;
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

/* 添加项目按钮 */
.add-project-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    width: 100%;
    padding: 0.75rem;
    background: #f3f4f6;
    border: 2px dashed #d1d5db;
    border-radius: 8px;
    color: #6b7280;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
}

.add-project-btn:hover {
    background: #e5e7eb;
    border-color: #9ca3af;
    color: #374151;
}

/* 总工时显示 */
.total-hours-display {
    background: #f0f9ff;
    border: 1px solid #0ea5e9;
    border-radius: 8px;
    padding: 1rem;
    margin-top: 1rem;
}

.total-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
}

.total-label {
    font-size: 0.875rem;
    font-weight: 600;
    color: #0c4a6e;
}

.total-value {
    font-size: 1.125rem;
    font-weight: 700;
    color: #0ea5e9;
}

.total-value.over-limit {
    color: #dc2626;
}

.over-limit-warning {
    display: flex;
    align-items: center;
    gap: 0.375rem;
    font-size: 0.75rem;
    color: #dc2626;
    font-weight: 500;
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

    .date-section {
        padding: 0.75rem 0.5rem;
    }

    .form-container {
        padding: 0.75rem 0.5rem;
    }

    .labor-form {
        /* padding: 1rem; */
    }

    .form-row {
        grid-template-columns: 1fr;
        gap: 0.75rem;
    }

    .form-group.flex-2 {
        grid-column: span 1;
    }

    .form-actions {
        flex-direction: column;
    }
}

@media (min-width: 375px) {
    .header {
        padding: 1rem 0.875rem;
    }

    .date-section {
        padding: 1rem 0.875rem;
    }

    .form-container {
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

    .date-section {
        padding: 1.5rem 1rem;
    }

    .date-container {
        max-width: 1200px;
        margin: 0 auto;
    }

    .form-container {
        padding: 1.5rem 1rem;
        max-width: 1200px;
        margin: 0 auto;
    }

    .labor-form {
        /* max-width: 800px;
        margin: 0 auto;
        padding: 2rem; */
    }

    .form-actions {
        max-width: 400px;
        margin-left: auto;
        margin-right: auto;
    }

    .records-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 0.75rem;
    }
}

@media (min-width: 1024px) {
    .header {
        padding: 2rem 1rem;
    }

    .date-section {
        padding: 2rem 1rem;
    }

    .form-container {
        padding: 2rem 1rem;
    }

    .labor-form {
        /* padding: 2.5rem; */
    }
}
</style>
