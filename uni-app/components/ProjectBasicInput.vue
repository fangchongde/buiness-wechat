<template>
    <div class="project-basic-input">
        <!-- 头部导航 -->
        <header class="header">
            <div class="header-content">
                <uv-button class="back-btn" @click="goBack" icon="arrow-left" color="rgba(255, 255, 255, 0.2)"></uv-button>
                <h1 class="page-title">项目基本信息录入</h1>
                <div class="header-spacer"></div>
            </div>
        </header>

		<!-- <uv-form labelPosition="left" :model="formData" :rules="rules" ref="form" labelWidth="300rpx">
			<uv-form-item label="项目编号" prop="projectCode" borderBottom>
				<uv-input v-model="formData.projectCode" border="none">
				</uv-input>
			</uv-form-item>
			<uv-form-item label="项目名称" prop="projectName" borderBottom>
				<uv-input v-model="formData.projectName" border="none">
				</uv-input>
			</uv-form-item>
			<uv-form-item label="项目描述" prop="description" borderBottom>
				<uv-input v-model="formData.description" border="none">
				</uv-input>
			</uv-form-item>
			<uv-form-item label="所属框架协议编号" prop="frameworkCode" borderBottom>
				<uv-input v-model="formData.frameworkCode" border="none">
				</uv-input>
			</uv-form-item>
			<uv-form-item label="所属框架协议名称" prop="frameworkName" borderBottom>
				<uv-input v-model="formData.frameworkName" border="none">
				</uv-input>
			</uv-form-item>
			<uv-form-item label="项目建设单位" prop="constructionUnit" borderBottom>
				<uv-input v-model="formData.constructionUnit" border="none">
				</uv-input>
			</uv-form-item>
			<uv-form-item label="项目合同金额（万元）" prop="contractAmount" borderBottom>
				<uv-input v-model="formData.contractAmount" border="none">
					<template v-slot:suffix>
						<<span class="input-unit">万元</span>
					</template>
				</uv-input>
			</uv-form-item>
			<uv-form-item label="所属分公司暂估造价（万元）" prop="estimatedCost" borderBottom>
				<uv-input v-model="formData.estimatedCost" border="none">
					<template v-slot:suffix>
						<<span class="input-unit">万元</span>
					</template>
				</uv-input>
			</uv-form-item>
			<uv-form-item label="项目状态" prop="projectStatus" borderBottom>
				<uni-data-select
				    v-model="formData.projectStatus"
				    class="role-select"
					:localdata="project_status_dict"
				>
				</uni-data-select>
			</uv-form-item>
			<uv-form-item label="项目合同扫描件" prop="constructionUnit" borderBottom>
				<uv-upload
					:fileList="[]" 
					name="6" 
					multiple 
					:maxCount="1" 
					width="250" 
					accept=".pdf,.jpg,.jpeg,.png"
					@afterRead="handleFileUpload"
					height="150">
					<div class="upload-content">
					    <Upload class="w-8 h-8 text-gray-400" />
					    <p class="upload-text">点击上传合同扫描件</p>
					    <p class="upload-hint">
					        支持 PDF、JPG、PNG 格式，可多选
					    </p>
					</div>
				</uv-upload>
				<div v-if="uploadedFiles.length > 0" class="uploaded-files">
					<div
						v-for="(file, index) in uploadedFiles"
						:key="index"
						class="file-item"
					>
						<FileText class="w-4 h-4 text-blue-500" />
						<span class="file-name">{{ file.name }}</span>
						<button
							type="button"
							@click="removeFile(index)"
							class="remove-file-btn"
						>
							<uv-icon name="trash-fill"></uv-icon>
						</button>
					</div>
				</div>
			</uv-form-item>
			<uv-form-item label="开工时间" prop="startDate" borderBottom>
				<input
				    v-model="formData.startDate"
				    class="form-input"
					disabled="true"
					readOnly="true"
				    required
					@click="showDatetimePicker"
				/>
				<uv-datetime-picker ref="datetimePicker"  mode="date" @confirm="startDateFormatter"></uv-datetime-picker>
			</uv-form-item>
			<div class="form-actions">
			    <button
			        type="button"
			        @click="saveDraft"
			        class="btn-secondary"
			    >
					<image src="../static/icon/saver.png" mode="widthFix" style="width:40rpx"></image>
			        保存草稿
			    </button>
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
		</uv-form> -->
        <!-- 表单内容 -->
        <div class="form-container">
            <form class="project-form">
                <!-- 项目编号 -->
                <div class="form-group">
                    <label class="form-label required">项目编号</label>
                    <input
                        v-model="formData.projectCode"
                        type="text"
                        class="form-input"
                        placeholder="请输入项目编号"
                        required
                    >
                </div>

                <!-- 项目名称 -->
                <div class="form-group">
                    <label class="form-label required">项目名称</label>
                    <input
                        v-model="formData.projectName"
                        type="text"
                        class="form-input"
                        placeholder="请输入项目名称"
                        required
                    />
                </div><!-- 项目描述 -->
                <div class="form-group">
                    <label class="form-label">项目描述</label>
                    <input
                        v-model="formData.description"
                        type="text"
                        class="form-input"
                        placeholder="请输入项目描述"
                        required
                    />
                </div>

                <!-- 所属框架协议编号 -->
                <div class="form-group">
                    <label class="form-label">所属框架协议编号</label>
                    <input
                        v-model="formData.frameworkCode"
                        type="text"
                        class="form-input"
                        placeholder="请输入框架协议编号"
                    />
                </div>

                <!-- 所属框架协议名称 -->
                <div class="form-group">
                    <label class="form-label">所属框架协议名称</label>
                    <input
                        v-model="formData.frameworkName"
                        type="text"
                        class="form-input"
                        placeholder="请输入框架协议名称"
                    />
                </div>

                <!-- 项目建设单位 -->
                <div class="form-group">
                    <label class="form-label required">项目建设单位</label>
                    <input
                        v-model="formData.constructionUnit"
                        type="text"
                        class="form-input"
                        placeholder="请输入建设单位名称"
                        required
                    />
                </div>

                <!-- 项目合同金额 -->
                <div class="form-group">
                    <label class="form-label required"
                        >项目合同金额（万元）</label
                    >
                    <div class="input-with-unit">
                        <uv-input
                            v-model="formData.contractAmount"
							@blur="(e)=>formData.contractAmount = e.replace(/[^\d.]/g,'')"
                            type="digit"
                            step="0.01"
                            class="form-input"
                            placeholder="请输入合同金额"
                            required
                        />
                        <span class="input-unit">万元</span>
                    </div>
                </div>

                <!-- 所属分公司暂估造价 -->
                <div class="form-group">
                    <label class="form-label">所属分公司暂估造价（万元）</label>
                    <div class="input-with-unit">
                        <uv-input
							@blur="(e)=>formData.estimatedCost = e.replace(/[^\d.]/g,'')"
                            type="digit"
                            v-model="formData.estimatedCost"
                            step="0.01"
                            class="form-input"
                            placeholder="请输入暂估造价"
                        />
                        <span class="input-unit">万元</span>
                    </div>
                </div>

                <!-- 项目负责人 -->
                <!-- <div class="form-group">
                    <label class="form-label required">项目负责人</label>
                    <input
                        v-model="formData.projectManager"
                        type="text"
                        class="form-input"
                        placeholder="请输入项目负责人姓名"
                        required
                    />
                </div> -->
				<div class="form-group">
				    <label class="form-label required">项目状态</label>
				    <div class="input-with-unit">
				        <uni-data-select
				            v-model="formData.projectStatus"
				            class="role-select"
				        	:localdata="project_status_dict"
				        >
				        </uni-data-select>
				    </div>
				</div>

                <!-- 项目合同扫描件 -->
                <!-- <div class="form-group">
                    <label class="form-label">项目合同扫描件</label>
                    <div class="file-upload-area" @click="triggerFileUpload">
						<uv-upload 
							:fileList="[]" 
							name="6" 
							multiple 
							:maxCount="1" 
							width="250" 
							accept=".pdf,.jpg,.jpeg,.png"
							@afterRead="handleFileUpload"
							height="150">
							<div class="upload-content">
							    <Upload class="w-8 h-8 text-gray-400" />
							    <p class="upload-text">点击上传合同扫描件</p>
							    <p class="upload-hint">
							        支持 PDF、JPG、PNG 格式，可多选
							    </p>
							</div>
						</uv-upload>
                    </div>
                    <div v-if="uploadedFiles.length > 0" class="uploaded-files">
                        <div
                            v-for="(file, index) in uploadedFiles"
                            :key="index"
                            class="file-item"
                        >
                            <span class="file-name">{{ file.name }}</span>
                            <button
                                type="button"
                                @click="removeFile(index)"
                                class="remove-file-btn"
                            >
								<uv-icon name="trash-fill"></uv-icon>
                            </button>
                        </div>
                    </div>
                </div> -->

                <!-- 开工时间 -->
                <div class="form-group">
                    <label class="form-label required">开工时间</label>
                    <input
                        v-model="formData.startDate"
                        class="form-input"
						disabled="true"
						readOnly="true"
                        required
						@click="$refs.datetimePicker.open()"
                    />
					<uv-datetime-picker ref="datetimePicker" v-model="formData._startDate"  mode="date" @confirm="(e)=>formData.startDate = parseTime(e.value,'{y}-{m}-{d}')"></uv-datetime-picker>
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
						<image src="../static/icon/success.png" mode="widthFix" style="width:40rpx"></image>
                        {{ isSubmitting ? "提交中..." : "提交" }}
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive,defineOptions,getCurrentInstance,onMounted } from "vue";
import { addProject } from '@/api/project.js'
import { useToast } from '@/hooks/useToast.js'
import { getCache, setCache, parseTime, openPage } from '@/utils/index.js'
import { getUserInfo } from "@/api/login";
const { showToast } = useToast()
const { proxy } = getCurrentInstance() as any
// 定义事件
const emit = defineEmits<{
    goBack: [];
}>();
const { project_status } = getCache('dict')
const project_status_dict = ref(project_status)
// 表单数据
const formData = reactive({
    projectCode:"",
    projectName:"",
    frameworkCode:"",
    frameworkName:"",
    constructionUnit:"",
    contractAmount:"",
    estimatedCost:"",
    startDate:parseTime(Date.now(),'{y}-{m}-{d}'),
	_startDate:parseTime(Date.now(),'{y}-{m}-{d}'),
    projectStatus:"1", // 状态
    description:"",
    projectManager:"",
    managerEmployeeId:"",
});
// 文件上传相关
const fileInput = ref<HTMLInputElement>();
const uploadedFiles = ref<File[]>([]);
const isSubmitting = ref(false);

// 返回上一页
const goBack = () => {
    console.log("返回首页");
    emit("goBack");
};

// 触发文件上传
const triggerFileUpload = () => {
    fileInput.value?.click();
};

// 处理文件上传
const handleFileUpload = (file: any) => {
    if (file) {
        uploadedFiles.value.push(...file.file);
    }
};

// 移除文件
const removeFile = (index: number) => {
    uploadedFiles.value.splice(index, 1);
};

// 保存草稿
const saveDraft = () => {
    console.log("保存草稿:", formData);
    showToast("草稿已保存");
};
// 提交表单
const submitForm = async () => {
	if(isSubmitting.value){
		return
	}
	if(!formData.projectCode){
		return showToast("请输入项目编号");
	}
	if(!formData.projectName){
		return showToast("请输入项目名称");
	}
	if(!formData.constructionUnit){
		return showToast("请输入项目建设单位");
	}
	if(!formData.contractAmount){
		return showToast("请输入项目合同金额");
	}
	if(!formData.estimatedCost){
		return showToast("请输入暂估造价");
	}
	if(!formData.projectStatus){
		return showToast("请选择项目状态");
	}
	if(!formData.startDate){
		return showToast("请选择开工时间");
	}
	const userInfo = await getUserInfo()
	formData.managerEmployeeId = userInfo.data.user.userId
	formData.projectManager = userInfo.data.user.userName
	isSubmitting.value = true;
	const result = await addProject(formData).catch(e=>{
		isSubmitting.value = false;
	})
	if(result){
		showToast({
			message:"录入成功",
			complete:()=>{
				isSubmitting.value = false;
				return openPage({url:'/pages/index/index'})
			}
		});			
	}
};
</script>

<style scoped>
.project-basic-input {
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

    .form-container {
        padding: 0.75rem 0.5rem;
    }

    .project-form {
        /* padding: 1rem; */
    }

    .page-title {
        font-size: 1rem;
    }

    .form-actions {
        flex-direction: column;
    }
}

@media (min-width: 375px) {
    .header {
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

    .form-container {
        padding: 1.25rem 1rem;
    }

    .project-form {
        /* padding: 1.75rem; */
    }

    .page-title {
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

    .form-container {
        padding: 1.5rem 1rem;
        max-width: 1200px;
        margin: 0 auto;
    }

    .project-form {
      /*  max-width: 800px;
        margin: 0 auto;
        padding: 2rem; */
    }

    .form-actions {
        max-width: 400px;
        margin-left: auto;
        margin-right: auto;
    }
}

@media (min-width: 1024px) {
    .header {
        padding: 2rem 1rem;
    }

    .form-container {
        padding: 2rem 1rem;
    }

    .project-form {
        /* padding: 2.5rem; */
    }
}
</style>
