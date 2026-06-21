/* ========================================
   UNIVERSITY SCHOLARSHIP MANAGEMENT SYSTEM
   INTERACTIVE COMPONENTS & UTILITIES
   ======================================== */

// Modal Management
class Modal {
    constructor(selector) {
        this.modal = document.querySelector(selector);
        this.overlay = this.modal?.parentElement;
        this.closeBtn = this.modal?.querySelector('.modal-close');

        if (this.closeBtn) {
            this.closeBtn.addEventListener('click', () => this.close());
        }

        if (this.overlay) {
            this.overlay.addEventListener('click', (e) => {
                if (e.target === this.overlay) {
                    this.close();
                }
            });
        }
    }

    open() {
        if (this.overlay) {
            this.overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    close() {
        if (this.overlay) {
            this.overlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
}

// Tab Management
class Tabs {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.tabs = this.container?.querySelectorAll('.tab');
        this.contents = this.container?.querySelectorAll('.tab-content');

        this.tabs?.forEach((tab, index) => {
            tab.addEventListener('click', () => this.switchTab(index));
        });
    }

    switchTab(index) {
        this.tabs?.forEach((tab, i) => {
            tab.classList.toggle('active', i === index);
        });

        this.contents?.forEach((content, i) => {
            content.classList.toggle('active', i === index);
        });
    }
}

// Search & Filter
class SearchFilter {
    constructor(options = {}) {
        this.searchInput = document.querySelector(options.searchSelector);
        this.filterSelects = document.querySelectorAll(options.filterSelector);
        this.targetItems = document.querySelectorAll(options.targetSelector);

        this.searchInput?.addEventListener('input', () => this.filter());
        this.filterSelects?.forEach(select => {
            select.addEventListener('change', () => this.filter());
        });
    }

    filter() {
        const searchTerm = this.searchInput?.value.toLowerCase() || '';
        const filters = {};

        this.filterSelects?.forEach(select => {
            if (select.value) {
                filters[select.name] = select.value.toLowerCase();
            }
        });

        this.targetItems?.forEach(item => {
            let visible = true;

            // Search filter
            if (searchTerm) {
                const text = item.textContent.toLowerCase();
                visible = text.includes(searchTerm);
            }

            // Attribute filters
            Object.keys(filters).forEach(key => {
                const attr = item.dataset[key];
                if (attr && !attr.toLowerCase().includes(filters[key])) {
                    visible = false;
                }
            });

            item.style.display = visible ? '' : 'none';
        });
    }
}

// File Upload Handler
class FileUploadHandler {
    constructor(options = {}) {
        this.uploadArea = document.querySelector(options.uploadAreaSelector);
        this.fileInput = document.querySelector(options.fileInputSelector);
        this.fileList = document.querySelector(options.fileListSelector);
        this.files = [];

        this.setupEventListeners();
    }

    setupEventListeners() {
        if (this.uploadArea) {
            this.uploadArea.addEventListener('dragover', (e) => this.handleDragOver(e));
            this.uploadArea.addEventListener('dragleave', (e) => this.handleDragLeave(e));
            this.uploadArea.addEventListener('drop', (e) => this.handleDrop(e));
            this.uploadArea.addEventListener('click', () => this.fileInput?.click());
        }

        if (this.fileInput) {
            this.fileInput.addEventListener('change', (e) => this.handleFileSelect(e));
        }
    }

    handleDragOver(e) {
        e.preventDefault();
        e.stopPropagation();
        this.uploadArea?.classList.add('dragover');
    }

    handleDragLeave(e) {
        e.preventDefault();
        e.stopPropagation();
        this.uploadArea?.classList.remove('dragover');
    }

    handleDrop(e) {
        e.preventDefault();
        e.stopPropagation();
        this.uploadArea?.classList.remove('dragover');

        const files = e.dataTransfer?.files || [];
        this.addFiles(Array.from(files));
    }

    handleFileSelect(e) {
        const files = e.target.files || [];
        this.addFiles(Array.from(files));
    }

    addFiles(newFiles) {
        newFiles.forEach(file => {
            if (this.validateFile(file)) {
                this.files.push(file);
            }
        });
        this.updateFileList();
    }

    validateFile(file) {
        const maxSize = 10 * 1024 * 1024; // 10MB
        const allowedTypes = [
            'application/pdf',
            'image/jpeg',
            'image/png',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ];

        if (file.size > maxSize) {
            alert('File too large. Maximum size is 10MB.');
            return false;
        }

        if (!allowedTypes.includes(file.type)) {
            alert('File type not allowed.');
            return false;
        }

        return true;
    }

    updateFileList() {
        if (!this.fileList) return;

        this.fileList.innerHTML = '';

        this.files.forEach((file, index) => {
            const fileItem = document.createElement('div');
            fileItem.className = 'file-item';
            fileItem.innerHTML = `
        <div class="file-info">
          <div class="file-icon">📄</div>
          <div class="file-details">
            <div class="file-name">${file.name}</div>
            <div class="file-size">${this.formatFileSize(file.size)}</div>
          </div>
        </div>
        <button class="btn btn-ghost btn-sm" onclick="this.parentElement.parentElement.remove()">Remove</button>
      `;
            this.fileList.appendChild(fileItem);
        });
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    }

    getFiles() {
        return this.files;
    }
}

// Form Stepper
class FormStepper {
    constructor(options = {}) {
        this.steps = document.querySelectorAll(options.stepSelector);
        this.currentStep = 0;
        this.previousBtn = document.querySelector(options.previousBtnSelector);
        this.nextBtn = document.querySelector(options.nextBtnSelector);

        if (this.previousBtn) {
            this.previousBtn.addEventListener('click', () => this.previousStep());
        }
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.nextStep());
        }

        this.showStep(0);
    }

    showStep(n) {
        if (n < 0 || n >= this.steps.length) return;

        this.steps.forEach(step => step.classList.remove('active'));
        this.steps[n].classList.add('active');

        if (this.previousBtn) {
            this.previousBtn.style.display = n === 0 ? 'none' : '';
        }
        if (this.nextBtn) {
            this.nextBtn.textContent = n === this.steps.length - 1 ? 'Submit' : 'Next';
        }

        this.currentStep = n;
    }

    nextStep() {
        if (this.currentStep < this.steps.length - 1) {
            this.showStep(this.currentStep + 1);
        }
    }

    previousStep() {
        if (this.currentStep > 0) {
            this.showStep(this.currentStep - 1);
        }
    }

    getCurrentStep() {
        return this.currentStep;
    }
}

// Progress Bar
class ProgressBar {
    constructor(selector, maxValue = 100) {
        this.bar = document.querySelector(selector);
        this.maxValue = maxValue;
        this.value = 0;
    }

    setValue(value) {
        this.value = Math.min(value, this.maxValue);
        const percentage = (this.value / this.maxValue) * 100;
        const fillBar = this.bar?.querySelector('.progress-fill');
        if (fillBar) {
            fillBar.style.width = percentage + '%';
        }
    }

    increment(amount = 10) {
        this.setValue(this.value + amount);
    }

    reset() {
        this.setValue(0);
    }
}

// Notification
class Notification {
    static show(message, type = 'info', duration = 5000) {
        const container = document.getElementById('notification-container') ||
            this.createContainer();

        const notification = document.createElement('div');
        notification.className = `notification notification-${type} slide-down`;
        notification.innerHTML = `
      <div class="notification-content">
        <div class="notification-message">${message}</div>
      </div>
    `;

        container.appendChild(notification);

        if (duration > 0) {
            setTimeout(() => {
                notification.remove();
            }, duration);
        }

        return notification;
    }

    static createContainer() {
        const container = document.createElement('div');
        container.id = 'notification-container';
        container.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 2000;
      max-width: 400px;
      display: flex;
      flex-direction: column;
      gap: 10px;
    `;
        document.body.appendChild(container);
        return container;
    }

    static success(message, duration = 5000) {
        this.show(message, 'success', duration);
    }

    static error(message, duration = 5000) {
        this.show(message, 'error', duration);
    }

    static warning(message, duration = 5000) {
        this.show(message, 'warning', duration);
    }

    static info(message, duration = 5000) {
        this.show(message, 'info', duration);
    }
}

// Date Formatter
const dateFormatter = {
    format(date, format = 'DD/MM/YYYY') {
        const d = new Date(date);
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();

        return format
            .replace('DD', day)
            .replace('MM', month)
            .replace('YYYY', year);
    },

    relative(date) {
        const d = new Date(date);
        const now = new Date();
        const seconds = Math.floor((now - d) / 1000);

        if (seconds < 60) return 'just now';
        if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
        if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
        if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;

        return this.format(d);
    }
};

// Currency Formatter
const currencyFormatter = {
    format(amount, currency = 'MYR') {
        const formatter = new Intl.NumberFormat('en-MY', {
            style: 'currency',
            currency: currency
        });
        return formatter.format(amount);
    }
};

// Mobile Menu Toggle
function setupMobileMenu() {
    const sidebar = document.querySelector('.sidebar');
    const menuToggle = document.querySelector('[data-toggle="menu"]');

    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            sidebar?.classList.toggle('open');
        });
    }
}

// Initialize on DOM Ready
document.addEventListener('DOMContentLoaded', () => {
    setupMobileMenu();
});
