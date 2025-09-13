<template>
    <div class="expense-input">
        <!-- 头部导航 -->
        <header class="header">
            <div class="header-content">
                <button class="back-btn" @click="goBack">
                    <ArrowLeft class="w-5 h-5" />
                </button>
                <h1 class="page-title">非人工支出录入</h1>
                <div class="header-spacer"></div>
            </div>
        </header>

        <!-- 项目选择 -->
        <div class="project-section">
            <div class="project-container">
                <div class="project-selector">
                    <Building class="w-5 h-5 text-blue-600" />
                    <div class="project-info">
                        <label class="project-label">选择项目</label>
                        <select
                            v-model="selectedProjectId"
                            class="project-select"
                            @change="updateSelectedProject"
                            required
                        >
                            <option value="">请选择项目</option>
                            <option
                                v-for="project in availableProjects"
                                :key="project.id"
                                :value="project.id"
                            >
                                {{ project.name }} ({{ project.code }})
                            </option>
                        </select>
                    </div>
                </div>

                <!-- 选中项目信息显示 -->
                <div v-if="selectedProject" class="selected-project-info">
                    <div class="project-details">
                        <div class="detail-item">
                            <span class="detail-label">建设单位:</span>
                            <span class="detail-value">{{
                                selectedProject.constructionUnit
                            }}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">项目负责人:</span>
                            <span class="detail-value">{{
                                selectedProject.manager
                            }}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">合同金额:</span>
                            <span class="detail-value"
                                >{{ selectedProject.contractAmount }}万元</span
                            >
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- 支出录入表单 -->
        <div class="form-container">
            <form @submit.prevent="submitForm" class="expense-form">
                <!-- 支出记录列表 -->
                <div class="form-section">
                    <h2 class="section-title">
                        <CreditCard class="w-5 h-5" />
                        支出记录
                    </h2>

                    <div class="expense-list">
                        <div
                            v-for="(item, index) in expenseList"
                            :key="index"
                            class="expense-item"
                        >
                            <div class="item-header">
                                <span class="item-number">{{ index + 1 }}</span>
                                <button
                                    v-if="expenseList.length > 1"
                                    type="button"
                                    @click="removeExpenseItem(index)"
                                    class="remove-btn"
                                >
                                    <X class="w-4 h-4" />
                                </button>
                            </div>

                            <!-- 支出条目名称 -->
                            <div class="form-group">
                                <label class="form-label required"
                                    >支出条目名称</label
                                >
                                <input
                                    v-model="item.itemName"
                                    type="text"
                                    class="form-input"
                                    placeholder="请输入支出条目名称"
                                    required
                                />
                            </div>

                            <!-- 支出分类 -->
                            <div class="form-group">
                                <label class="form-label required"
                                    >支出分类</label
                                >
                                <select
                                    v-model="item.category"
                                    class="form-select"
                                    required
                                >
                                    <option value="">请选择支出分类</option>
                                    <option value="材料费">材料费</option>
                                    <option value="设备费">设备费</option>
                                    <option value="机械费">机械费</option>
                                    <option value="运输费">运输费</option>
                                    <option value="管理费">管理费</option>
                                    <option value="其他费用">其他费用</option>
                                </select>
                            </div>

                            <!-- 支出金额和收款方 -->
                            <div class="form-group">
                                <label class="form-label required"
                                    >支出金额（元）</label
                                >
                                <div class="input-with-unit">
                                    <input
                                        v-model="item.amount"
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        class="form-input"
                                        placeholder="请输入金额"
                                        required
                                        @input="calculateTotalAmount"
                                    />
                                    <span class="input-unit">元</span>
                                </div>
                            </div>

                            <div class="form-group">
                                <label class="form-label required"
                                    >收款方</label
                                >
                                <input
                                    v-model="item.payee"
                                    type="text"
                                    class="form-input"
                                    placeholder="请输入收款方名称"
                                    required
                                />
                            </div>
                            <!-- 支付人 -->
                            <div class="form-group">
                                <label class="form-label required"
                                    >支付人</label
                                >
                                <input
                                    v-model="item.payer"
                                    type="text"
                                    class="form-input"
                                    placeholder="请输入支付人姓名"
                                    required
                                />
                            </div>

                            <!-- 支付日期 -->
                            <div class="form-group">
                                <label class="form-label required"
                                    >支付日期</label
                                >
                                <input
                                    v-model="item.paymentDate"
                                    type="date"
                                    class="form-input"
                                    required
                                />
                            </div>

                            <!-- 备注 -->
                            <div class="form-group">
                                <label class="form-label">备注</label>
                                <textarea
                                    v-model="item.remark"
                                    class="form-textarea"
                                    placeholder="请输入备注信息（可选）"
                                    rows="2"
                                ></textarea>
                            </div>

                            <!-- 支付凭证上传 -->
                            <div class="form-group">
                                <label class="form-label">支付凭证</label>
                                <div
                                    class="file-upload-area"
                                    @click="triggerFileUpload(index)"
                                >
                                    <input
                                        :ref="(el) => (fileInputs[index] = el)"
                                        type="file"
                                        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                                        multiple
                                        @change="
                                            handleFileUpload($event, index)
                                        "
                                        class="file-input"
                                    />
                                    <div class="upload-content">
                                        <Upload class="w-6 h-6 text-gray-400" />
                                        <p class="upload-text">
                                            点击上传支付凭证
                                        </p>
                                        <p class="upload-hint">
                                            支持 PDF、图片、Word 格式，可多选
                                        </p>
                                    </div>
                                </div>

                                <!-- 已上传文件列表 -->
                                <div
                                    v-if="item.files && item.files.length > 0"
                                    class="uploaded-files"
                                >
                                    <div
                                        v-for="(file, fileIndex) in item.files"
                                        :key="fileIndex"
                                        class="file-item"
                                    >
                                        <FileText
                                            class="w-4 h-4 text-blue-500"
                                        />
                                        <span class="file-name">{{
                                            file.name
                                        }}</span>
                                        <button
                                            type="button"
                                            @click="
                                                removeFile(index, fileIndex)
                                            "
                                            class="remove-file-btn"
                                        >
                                            <X class="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- 添加支出项目按钮 -->
                    <button
                        type="button"
                        @click="addExpenseItem"
                        class="add-expense-btn"
                    >
                        <Plus class="w-4 h-4" />
                        添加支出项目
                    </button>

                    <!-- 总金额显示 -->
                    <div class="total-amount-display">
                        <div class="total-info">
                            <span class="total-label">总支出金额:</span>
                            <span class="total-value"
                                >¥{{ totalAmount.toLocaleString() }}</span
                            >
                        </div>
                    </div>
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
                        :disabled="isSubmitting || !selectedProject"
                    >
                        <CheckCircle class="w-4 h-4" />
                        {{ isSubmitting ? "提交中..." : "提交支出" }}
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from "vue";
import {
    ArrowLeft,
    Building,
    CreditCard,
    Plus,
    X,
    Save,
    CheckCircle,
    Upload,
    FileText,
} from "lucide-vue-next";

// 定义事件
const emit = defineEmits<{
    goBack: [];
}>();

// 状态管理
const selectedProjectId = ref("");
const selectedProject = ref<any>(null);
const isSubmitting = ref(false);
const fileInputs = ref<(HTMLInputElement | null)[]>([]);

// 支出记录列表
const expenseList = ref([
    {
        itemName: "",
        category: "",
        amount: "",
        payee: "",
        payer: "",
        paymentDate: new Date().toISOString().split("T")[0],
        remark: "",
        files: [],
    },
]);

// 可用项目列表（模拟数据）
const availableProjects = ref([
    {
        id: 1,
        code: "PRJ-2024-001",
        name: "城市综合体建设项目",
        constructionUnit: "市政建设集团",
        manager: "张三",
        contractAmount: 5800,
    },
    {
        id: 2,
        code: "PRJ-2024-002",
        name: "住宅小区开发项目",
        constructionUnit: "房地产开发公司",
        manager: "李四",
        contractAmount: 3200,
    },
    {
        id: 3,
        code: "PRJ-2024-003",
        name: "工业园区基础设施",
        constructionUnit: "工业园区管委会",
        manager: "王五",
        contractAmount: 2800,
    },
    {
        id: 4,
        code: "PRJ-2024-004",
        name: "学校教学楼建设",
        constructionUnit: "教育局",
        manager: "张三",
        contractAmount: 1500,
    },
]);

// 计算总金额
const totalAmount = computed(() => {
    return expenseList.value.reduce((total, item) => {
        const amount = parseFloat(item.amount) || 0;
        return total + amount;
    }, 0);
});

// 返回上一页
const goBack = () => {
    emit("goBack");
};

// 更新选中项目
const updateSelectedProject = () => {
    selectedProject.value =
        availableProjects.value.find(
            (p) => p.id === parseInt(selectedProjectId.value)
        ) || null;
};

// 添加支出项目
const addExpenseItem = () => {
    expenseList.value.push({
        itemName: "",
        category: "",
        amount: "",
        payee: "",
        payer: "",
        paymentDate: new Date().toISOString().split("T")[0],
        remark: "",
        files: [],
    });
};

// 移除支出项目
const removeExpenseItem = (index: number) => {
    expenseList.value.splice(index, 1);
};

// 计算总金额
const calculateTotalAmount = () => {
    // 总金额通过 computed 属性自动计算
};

// 触发文件上传
const triggerFileUpload = (index: number) => {
    fileInputs.value[index]?.click();
};

// 处理文件上传
const handleFileUpload = (event: Event, index: number) => {
    const target = event.target as HTMLInputElement;
    const files = target.files;
    if (files) {
        if (!expenseList.value[index].files) {
            expenseList.value[index].files = [];
        }
        expenseList.value[index].files.push(...Array.from(files));
    }
};

// 移除文件
const removeFile = (expenseIndex: number, fileIndex: number) => {
    expenseList.value[expenseIndex].files.splice(fileIndex, 1);
};

// 保存草稿
const saveDraft = () => {
    console.log("保存草稿:", {
        project: selectedProject.value,
        expenses: expenseList.value,
        totalAmount: totalAmount.value,
    });
    alert("草稿已保存");
};

// 提交表单
const submitForm = async () => {
    if (!selectedProject.value) {
        alert("请先选择项目");
        return;
    }

    isSubmitting.value = true;
    try {
        console.log("提交支出记录:", {
            project: selectedProject.value,
            expenses: expenseList.value,
            totalAmount: totalAmount.value,
        });

        // 这里可以调用API提交数据
        await new Promise((resolve) => setTimeout(resolve, 1000)); // 模拟API调用

        alert("支出记录提交成功！");
        // 提交成功后可以清空表单或跳转
    } catch (error) {
        console.error("提交失败:", error);
        alert("提交失败，请重试");
    } finally {
        isSubmitting.value = false;
    }
};
</script>

<style scoped>
.expense-input {
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

/* 项目选择区域 */
.project-section {
    background: white;
    padding: 1rem 0.75rem;
    border-bottom: 1px solid #e5e7eb;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.project-container {
    max-width: 100%;
}

.project-selector {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 1rem;
}

.project-info {
    flex: 1;
}

.project-label {
    display: block;
    font-size: 0.875rem;
    font-weight: 600;
    color: #374151;
    margin-bottom: 0.25rem;
}

.project-select {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #3b3b3b;
    border-radius: 8px;
    font-size: 0.875rem;
    background: #3b3b3b;
}

.project-select:focus {
    outline: none;
    border-color: #3b82f6;
    background: #3b3b3b;
}

/* 选中项目信息 */
.selected-project-info {
    background: #f0f9ff;
    border: 1px solid #0ea5e9;
    border-radius: 8px;
    padding: 1rem;
}

.project-details {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.5rem;
}

.detail-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.detail-label {
    font-size: 0.75rem;
    color: #0c4a6e;
    font-weight: 500;
}

.detail-value {
    font-size: 0.75rem;
    font-weight: 600;
    color: #0ea5e9;
}

/* 表单容器 */
.form-container {
    padding: 1rem 0.75rem;
    max-width: 100%;
}

.expense-form {
    background: white;
    border-radius: 12px;
    padding: 1.5rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    max-width: 100%;
}

/* 表单区域 */
.form-section {
    margin-bottom: 2rem;
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

/* 支出记录列表 */
.expense-list {
    margin-bottom: 1rem;
}

.expense-item {
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
    background: #ef4444;
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

/* 表单组样式 */
.form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    margin-bottom: 1rem;
}

.form-group {
    display: flex;
    flex-direction: column;
    margin-bottom: 1rem;
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
    min-height: 60px;
    font-family: inherit;
}

.form-textarea:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* 带单位的输入框 */
.input-with-unit {
    position: relative;
    display: flex;
    align-items: center;
}

.input-with-unit .form-input {
    padding-right: 2.5rem;
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
    padding: 1.5rem 1rem;
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
    background: white;
    border-radius: 6px;
    margin-bottom: 0.5rem;
    border: 1px solid #e5e7eb;
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

/* 添加支出按钮 */
.add-expense-btn {
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

.add-expense-btn:hover {
    background: #e5e7eb;
    border-color: #9ca3af;
    color: #374151;
}

/* 总金额显示 */
.total-amount-display {
    background: #fef3c7;
    border: 1px solid #f59e0b;
    border-radius: 8px;
    padding: 1rem;
    margin-top: 1rem;
}

.total-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.total-label {
    font-size: 0.875rem;
    font-weight: 600;
    color: #92400e;
}

.total-value {
    font-size: 1.125rem;
    font-weight: 700;
    color: #d97706;
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
    background: #ef4444;
    color: white;
}

.btn-primary:hover:not(:disabled) {
    background: #dc2626;
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

    .project-section {
        padding: 0.75rem 0.5rem;
    }

    .form-container {
        padding: 0.75rem 0.5rem;
    }

    .expense-form {
        padding: 1rem;
    }

    .form-row {
        grid-template-columns: 1fr;
        gap: 0.75rem;
    }

    .project-details {
        grid-template-columns: 1fr;
    }

    .form-actions {
        flex-direction: column;
    }
}

@media (min-width: 375px) {
    .header {
        padding: 1rem 0.875rem;
    }

    .project-section {
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

    .project-section {
        padding: 1.5rem 1rem;
    }

    .project-container {
        max-width: 1200px;
        margin: 0 auto;
    }

    .form-container {
        padding: 1.5rem 1rem;
        max-width: 1200px;
        margin: 0 auto;
    }

    .expense-form {
        max-width: 800px;
        margin: 0 auto;
        padding: 2rem;
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

    .project-section {
        padding: 2rem 1rem;
    }

    .form-container {
        padding: 2rem 1rem;
    }

    .expense-form {
        padding: 2.5rem;
    }
}
</style>
