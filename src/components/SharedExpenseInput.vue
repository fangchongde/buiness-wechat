<template>
    <div class="shared-expense-input">
        <!-- 头部导航 -->
        <header class="header">
            <div class="header-content">
                <button class="back-btn" @click="goBack">
                    <ArrowLeft class="w-5 h-5" />
                </button>
                <h1 class="page-title">公摊支出录入</h1>
                <div class="header-spacer"></div>
            </div>
        </header>

        <!-- 分公司选择 -->
        <div class="branch-section">
            <div class="branch-container">
                <div class="branch-selector">
                    <MapPin class="w-5 h-5 text-purple-600" />
                    <div class="branch-info">
                        <label class="branch-label">选择分公司</label>
                        <select
                            v-model="selectedBranchId"
                            class="branch-select"
                            @change="updateSelectedBranch"
                            required
                        >
                            <option value="">请选择分公司</option>
                            <option
                                v-for="branch in availableBranches"
                                :key="branch.id"
                                :value="branch.id"
                            >
                                {{ branch.name }} ({{ branch.code }})
                            </option>
                        </select>
                    </div>
                </div>

                <!-- 选中分公司信息显示 -->
                <div v-if="selectedBranch" class="selected-branch-info">
                    <div class="branch-details">
                        <div class="detail-item">
                            <span class="detail-label">分公司负责人:</span>
                            <span class="detail-value">{{
                                selectedBranch.manager
                            }}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">联系电话:</span>
                            <span class="detail-value">{{
                                selectedBranch.phone
                            }}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">地址:</span>
                            <span class="detail-value">{{
                                selectedBranch.address
                            }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- 公摊支出录入表单 -->
        <div class="form-container">
            <form @submit.prevent="submitForm" class="shared-expense-form">
                <!-- 支出记录列表 -->
                <div class="form-section">
                    <h2 class="section-title">
                        <Share2 class="w-5 h-5" />
                        公摊支出记录
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

                            <!-- 支出名称 -->
                            <div class="form-group">
                                <label class="form-label required"
                                    >支出名称</label
                                >
                                <input
                                    v-model="item.expenseName"
                                    type="text"
                                    class="form-input"
                                    placeholder="请输入支出名称"
                                    required
                                />
                            </div>

                            <!-- 支出类型 -->
                            <div class="form-group">
                                <label class="form-label required"
                                    >支出类型</label
                                >
                                <select
                                    v-model="item.expenseType"
                                    class="form-select"
                                    required
                                >
                                    <option value="">请选择支出类型</option>
                                    <option value="办公费用">办公费用</option>
                                    <option value="租赁费用">租赁费用</option>
                                    <option value="水电费">水电费</option>
                                    <option value="通讯费">通讯费</option>
                                    <option value="差旅费">差旅费</option>
                                    <option value="培训费">培训费</option>
                                    <option value="招待费">招待费</option>
                                    <option value="维修费">维修费</option>
                                    <option value="保险费">保险费</option>
                                    <option value="税费">税费</option>
                                    <option value="其他费用">其他费用</option>
                                </select>
                            </div>

                            <!-- 支出金额和支出方 -->
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
                                    >支出方</label
                                >
                                <input
                                    v-model="item.payer"
                                    type="text"
                                    class="form-input"
                                    placeholder="请输入支出方名称"
                                    required
                                />
                            </div>

                            <!-- 收款方和支付人 -->
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

                            <div class="form-group">
                                <label class="form-label required"
                                    >支付人</label
                                >
                                <input
                                    v-model="item.paymentPerson"
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
                                            class="w-4 h-4 text-purple-500"
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
                        添加公摊支出项目
                    </button>

                    <!-- 总金额显示 -->
                    <div class="total-amount-display">
                        <div class="total-info">
                            <span class="total-label">总公摊支出金额:</span>
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
                        :disabled="isSubmitting || !selectedBranch"
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
    MapPin,
    Share2,
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
const selectedBranchId = ref("");
const selectedBranch = ref<any>(null);
const isSubmitting = ref(false);
const fileInputs = ref<(HTMLInputElement | null)[]>([]);

// 支出记录列表
const expenseList = ref([
    {
        expenseName: "",
        expenseType: "",
        amount: "",
        payer: "",
        payee: "",
        paymentPerson: "",
        paymentDate: new Date().toISOString().split("T")[0],
        remark: "",
        files: [],
    },
]);

// 可用分公司列表（模拟数据）
const availableBranches = ref([
    {
        id: 1,
        code: "BR-001",
        name: "北京分公司",
        manager: "张经理",
        phone: "010-12345678",
        address: "北京市朝阳区建国路88号",
    },
    {
        id: 2,
        code: "BR-002",
        name: "上海分公司",
        manager: "李经理",
        phone: "021-87654321",
        address: "上海市浦东新区陆家嘴金融区",
    },
    {
        id: 3,
        code: "BR-003",
        name: "广州分公司",
        manager: "王经理",
        phone: "020-11223344",
        address: "广州市天河区珠江新城",
    },
    {
        id: 4,
        code: "BR-004",
        name: "深圳分公司",
        manager: "刘经理",
        phone: "0755-99887766",
        address: "深圳市南山区科技园",
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

// 更新选中分公司
const updateSelectedBranch = () => {
    selectedBranch.value =
        availableBranches.value.find(
            (b) => b.id === parseInt(selectedBranchId.value)
        ) || null;
};

// 添加支出项目
const addExpenseItem = () => {
    expenseList.value.push({
        expenseName: "",
        expenseType: "",
        amount: "",
        payer: "",
        payee: "",
        paymentPerson: "",
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
        branch: selectedBranch.value,
        expenses: expenseList.value,
        totalAmount: totalAmount.value,
    });
    alert("草稿已保存");
};

// 提交表单
const submitForm = async () => {
    if (!selectedBranch.value) {
        alert("请先选择分公司");
        return;
    }

    isSubmitting.value = true;
    try {
        console.log("提交公摊支出记录:", {
            branch: selectedBranch.value,
            expenses: expenseList.value,
            totalAmount: totalAmount.value,
        });

        // 这里可以调用API提交数据
        await new Promise((resolve) => setTimeout(resolve, 1000)); // 模拟API调用

        alert("公摊支出记录提交成功！");
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
.shared-expense-input {
    min-height: 100vh;
    background: #f9fafb;
}

/* 头部样式 */
.header {
    background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%);
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

/* 分公司选择区域 */
.branch-section {
    background: white;
    padding: 1rem 0.75rem;
    border-bottom: 1px solid #e5e7eb;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.branch-container {
    max-width: 100%;
}

.branch-selector {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 1rem;
}

.branch-info {
    flex: 1;
}

.branch-label {
    display: block;
    font-size: 0.875rem;
    font-weight: 600;
    color: #374151;
    margin-bottom: 0.25rem;
}

.branch-select {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #3b3b3b;
    border-radius: 8px;
    font-size: 0.875rem;
    background: #3b3b3b;
}

.branch-select:focus {
    outline: none;
    border-color: #a855f7;
    background: #3b3b3b;
}

/* 选中分公司信息 */
.selected-branch-info {
    background: #faf5ff;
    border: 1px solid #a855f7;
    border-radius: 8px;
    padding: 1rem;
}

.branch-details {
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
    color: #581c87;
    font-weight: 500;
}

.detail-value {
    font-size: 0.75rem;
    font-weight: 600;
    color: #a855f7;
}

/* 表单容器 */
.form-container {
    padding: 1rem 0.75rem;
    max-width: 100%;
}

.shared-expense-form {
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
    background: #a855f7;
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
    border-color: #a855f7;
    box-shadow: 0 0 0 3px rgba(168, 85, 247, 0.1);
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
    border-color: #a855f7;
    box-shadow: 0 0 0 3px rgba(168, 85, 247, 0.1);
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
    border-color: #a855f7;
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
    background: #faf5ff;
    border: 1px solid #a855f7;
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
    color: #581c87;
}

.total-value {
    font-size: 1.125rem;
    font-weight: 700;
    color: #a855f7;
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
    background: #a855f7;
    color: white;
}

.btn-primary:hover:not(:disabled) {
    background: #9333ea;
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

    .branch-section {
        padding: 0.75rem 0.5rem;
    }

    .form-container {
        padding: 0.75rem 0.5rem;
    }

    .shared-expense-form {
        padding: 1rem;
    }

    .form-row {
        grid-template-columns: 1fr;
        gap: 0.75rem;
    }

    .branch-details {
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

    .branch-section {
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

    .branch-section {
        padding: 1.5rem 1rem;
    }

    .branch-container {
        max-width: 1200px;
        margin: 0 auto;
    }

    .form-container {
        padding: 1.5rem 1rem;
        max-width: 1200px;
        margin: 0 auto;
    }

    .shared-expense-form {
        max-width: 800px;
        margin: 0 auto;
        padding: 2rem;
    }

    .form-actions {
        max-width: 400px;
        margin-left: auto;
        margin-right: auto;
    }

    .branch-details {
        grid-template-columns: repeat(3, 1fr);
    }
}

@media (min-width: 1024px) {
    .header {
        padding: 2rem 1rem;
    }

    .branch-section {
        padding: 2rem 1rem;
    }

    .form-container {
        padding: 2rem 1rem;
    }

    .shared-expense-form {
        padding: 2.5rem;
    }
}
</style>
