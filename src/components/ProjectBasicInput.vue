<template>
    <div class="project-basic-input">
        <!-- 头部导航 -->
        <header class="header">
            <div class="header-content">
                <button class="back-btn" @click="goBack">
                    <ArrowLeft class="w-5 h-5" />
                </button>
                <h1 class="page-title">项目基本信息录入</h1>
                <div class="header-spacer"></div>
            </div>
        </header>

        <!-- 表单内容 -->
        <div class="form-container">
            <form @submit.prevent="submitForm" class="project-form">
                <!-- 项目编号 -->
                <div class="form-group">
                    <label class="form-label required">项目编号</label>
                    <input
                        v-model="formData.projectCode"
                        type="text"
                        class="form-input"
                        placeholder="请输入项目编号"
                        required
                    />
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
                        <input
                            v-model="formData.contractAmount"
                            type="number"
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
                        <input
                            v-model="formData.estimatedCost"
                            type="number"
                            step="0.01"
                            class="form-input"
                            placeholder="请输入暂估造价"
                        />
                        <span class="input-unit">万元</span>
                    </div>
                </div>

                <!-- 项目负责人 -->
                <div class="form-group">
                    <label class="form-label required">项目负责人</label>
                    <input
                        v-model="formData.projectManager"
                        type="text"
                        class="form-input"
                        placeholder="请输入项目负责人姓名"
                        required
                    />
                </div>

                <!-- 项目合同扫描件 -->
                <div class="form-group">
                    <label class="form-label">项目合同扫描件</label>
                    <div class="file-upload-area" @click="triggerFileUpload">
                        <input
                            ref="fileInput"
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            multiple
                            @change="handleFileUpload"
                            class="file-input"
                        />
                        <div class="upload-content">
                            <Upload class="w-8 h-8 text-gray-400" />
                            <p class="upload-text">点击上传合同扫描件</p>
                            <p class="upload-hint">
                                支持 PDF、JPG、PNG 格式，可多选
                            </p>
                        </div>
                    </div>

                    <!-- 已上传文件列表 -->
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
                                <X class="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>

                <!-- 开工时间 -->
                <div class="form-group">
                    <label class="form-label required">开工时间</label>
                    <input
                        v-model="formData.startDate"
                        type="date"
                        class="form-input"
                        required
                    />
                </div>

                <!-- 提交按钮 -->
                <div class="form-actions">
                    <button
                        type="button"
                        @click="saveDraft"
                        class="btn-secondary"
                    >
                        <Save class="w-4 h-4" />
                        保存草稿
                    </button>
                    <button
                        type="submit"
                        class="btn-primary"
                        :disabled="isSubmitting"
                    >
                        <CheckCircle class="w-4 h-4" />
                        {{ isSubmitting ? "提交中..." : "提交" }}
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import {
    ArrowLeft,
    Upload,
    FileText,
    X,
    Save,
    CheckCircle,
} from "lucide-vue-next";

// 定义事件
const emit = defineEmits<{
    goBack: [];
}>();

// 表单数据
const formData = reactive({
    projectCode: "",
    projectName: "",
    frameworkCode: "",
    frameworkName: "",
    constructionUnit: "",
    contractAmount: "",
    estimatedCost: "",
    projectManager: "",
    startDate: "",
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
const handleFileUpload = (event: Event) => {
    const target = event.target as HTMLInputElement;
    const files = target.files;
    if (files) {
        uploadedFiles.value.push(...Array.from(files));
    }
};

// 移除文件
const removeFile = (index: number) => {
    uploadedFiles.value.splice(index, 1);
};

// 保存草稿
const saveDraft = () => {
    console.log("保存草稿:", formData);
    // 这里可以调用API保存草稿
    alert("草稿已保存");
};

// 提交表单
const submitForm = async () => {
    isSubmitting.value = true;
    try {
        console.log("提交表单:", formData);
        console.log("上传文件:", uploadedFiles.value);

        // 这里可以调用API提交数据
        await new Promise((resolve) => setTimeout(resolve, 1000)); // 模拟API调用

        alert("项目基本信息提交成功！");
        // 提交成功后可以跳转到其他页面
    } catch (error) {
        console.error("提交失败:", error);
        alert("提交失败，请重试");
    } finally {
        isSubmitting.value = false;
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
    padding: 1.5rem;
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
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    font-size: 0.875rem;
    transition: border-color 0.2s, box-shadow 0.2s;
    box-sizing: border-box;
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
        padding: 1rem;
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
        padding: 1.75rem;
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
        max-width: 800px;
        margin: 0 auto;
        padding: 2rem;
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
        padding: 2.5rem;
    }
}
</style>
