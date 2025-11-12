// ===================================
// Banner Management JavaScript
// ===================================

// Sample banner data (in a real app, this would come from a backend API)
let bannersData = {
    1: {
        id: 1,
        title: "Banner Tết Nguyên Đán 2025",
        image: "https://images.unsplash.com/photo-1578632292335-df3abbb0d586?w=800",
        link: "/tet-2025",
        position: "home_slider",
        season: "tet",
        startDate: "2025-01-01T00:00",
        endDate: "2025-02-28T23:59",
        active: true,
        order: 1
    },
    2: {
        id: 2,
        title: "Khuyến mãi mùa xuân",
        image: "https://images.unsplash.com/photo-1490367532201-b9bc1dc483f6?w=800",
        link: "/khuyen-mai-xuan",
        position: "home_slider",
        season: "spring",
        startDate: "2025-03-01T00:00",
        endDate: "2025-05-31T23:59",
        active: true,
        order: 2
    },
    // Add more banner data as needed
};

// ===================================
// Drag and Drop Functionality
// ===================================

document.addEventListener('DOMContentLoaded', function() {
    initializeDragAndDrop();
    initializeModals();
});

function initializeDragAndDrop() {
    const sortables = document.querySelectorAll('.sortable');

    sortables.forEach(sortable => {
        const bannerItems = sortable.querySelectorAll('.banner-item');

        bannerItems.forEach(item => {
            item.addEventListener('dragstart', handleDragStart);
            item.addEventListener('dragend', handleDragEnd);
            item.addEventListener('dragover', handleDragOver);
            item.addEventListener('drop', handleDrop);
            item.addEventListener('dragenter', handleDragEnter);
            item.addEventListener('dragleave', handleDragLeave);
        });
    });
}

let draggedElement = null;

function handleDragStart(e) {
    draggedElement = this;
    this.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', this.innerHTML);
}

function handleDragEnd(e) {
    this.classList.remove('dragging');

    // Remove drag-over class from all items
    document.querySelectorAll('.banner-item').forEach(item => {
        item.classList.remove('drag-over');
    });

    // Update order in backend (simulated)
    updateBannerOrder();
}

function handleDragOver(e) {
    if (e.preventDefault) {
        e.preventDefault();
    }
    e.dataTransfer.dropEffect = 'move';
    return false;
}

function handleDragEnter(e) {
    if (this !== draggedElement) {
        this.classList.add('drag-over');
    }
}

function handleDragLeave(e) {
    this.classList.remove('drag-over');
}

function handleDrop(e) {
    if (e.stopPropagation) {
        e.stopPropagation();
    }

    if (draggedElement !== this) {
        const parent = this.parentNode;
        const draggedIndex = Array.from(parent.children).indexOf(draggedElement);
        const targetIndex = Array.from(parent.children).indexOf(this);

        if (draggedIndex < targetIndex) {
            parent.insertBefore(draggedElement, this.nextSibling);
        } else {
            parent.insertBefore(draggedElement, this);
        }
    }

    return false;
}

function updateBannerOrder() {
    const sortables = document.querySelectorAll('.sortable');

    sortables.forEach(sortable => {
        const items = sortable.querySelectorAll('.banner-item');
        const order = [];

        items.forEach((item, index) => {
            const bannerId = item.getAttribute('data-id');
            order.push({
                id: bannerId,
                order: index + 1
            });
        });

        console.log('Updated banner order:', order);
        // In a real app, send this data to backend API
        // fetch('/api/banners/update-order', { method: 'POST', body: JSON.stringify(order) });
    });
}

// ===================================
// Modal Functionality
// ===================================

function initializeModals() {
    // Close modals when clicking outside
    window.onclick = function(event) {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            if (event.target === modal) {
                modal.classList.remove('active');
            }
        });
    };

    // Handle form submission
    const bannerForm = document.getElementById('bannerForm');
    if (bannerForm) {
        bannerForm.addEventListener('submit', handleBannerFormSubmit);
    }
}

function openBannerModal(mode, bannerId = null) {
    const modal = document.getElementById('bannerModal');
    const modalTitle = document.getElementById('modalTitle');
    const form = document.getElementById('bannerForm');

    if (mode === 'add') {
        modalTitle.innerHTML = '<i class="fa-solid fa-plus"></i> Thêm banner mới';
        form.reset();
        document.getElementById('bannerId').value = '';
        document.getElementById('imagePreview').style.display = 'none';
        document.querySelector('.upload-placeholder').style.display = 'block';
    } else if (mode === 'edit' && bannerId) {
        modalTitle.innerHTML = '<i class="fa-solid fa-pen"></i> Chỉnh sửa banner';

        // Load banner data (in a real app, fetch from API)
        if (bannersData[bannerId]) {
            const banner = bannersData[bannerId];
            document.getElementById('bannerId').value = banner.id;
            document.getElementById('bannerTitle').value = banner.title;
            document.getElementById('bannerLink').value = banner.link;
            document.getElementById('bannerPosition').value = banner.position;
            document.getElementById('bannerSeason').value = banner.season || '';
            document.getElementById('bannerActive').checked = banner.active;

            if (banner.startDate && banner.endDate) {
                document.getElementById('enableSchedule').checked = true;
                toggleScheduleFields();
                document.getElementById('startDate').value = banner.startDate;
                document.getElementById('endDate').value = banner.endDate;
            }

            // Show image preview
            const imagePreview = document.getElementById('imagePreview');
            imagePreview.src = banner.image;
            imagePreview.style.display = 'block';
            document.querySelector('.upload-placeholder').style.display = 'none';
        }
    }

    modal.classList.add('active');
}

function closeBannerModal() {
    const modal = document.getElementById('bannerModal');
    modal.classList.remove('active');
}

function handleBannerFormSubmit(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const bannerId = formData.get('banner_id');

    // In a real app, send data to backend API
    console.log('Saving banner...', Object.fromEntries(formData));

    // Simulate success
    alert(bannerId ? 'Banner đã được cập nhật!' : 'Banner mới đã được thêm!');
    closeBannerModal();

    // Reload page or update UI
    // location.reload();
}

// ===================================
// Toggle Banner Status
// ===================================

function toggleBannerStatus(bannerId) {
    const banner = document.querySelector(`[data-id="${bannerId}"]`);
    const isActive = banner.querySelector('input[type="checkbox"]').checked;

    console.log(`Banner ${bannerId} status changed to: ${isActive ? 'active' : 'inactive'}`);

    // Update status badge
    const statusBadge = banner.querySelector('.schedule-status');
    if (statusBadge) {
        if (isActive) {
            statusBadge.className = 'schedule-status status-active';
            statusBadge.innerHTML = '<i class="fa-solid fa-circle-check"></i> Đang kích hoạt';
            banner.setAttribute('data-status', 'active');
        } else {
            statusBadge.className = 'schedule-status status-inactive';
            statusBadge.innerHTML = '<i class="fa-solid fa-circle-xmark"></i> Vô hiệu hóa';
            banner.setAttribute('data-status', 'inactive');
        }
    }

    // In a real app, send update to backend API
    // fetch(`/api/banners/${bannerId}/toggle`, { method: 'POST' });
}

// ===================================
// Preview Functionality
// ===================================

function previewBanner(bannerId) {
    const modal = document.getElementById('previewModal');
    const banner = document.querySelector(`[data-id="${bannerId}"]`);

    if (banner) {
        const img = banner.querySelector('.banner-preview img');
        const title = banner.querySelector('.banner-header h3');
        const link = banner.querySelector('.meta-item i.fa-link').parentElement;
        const schedule = banner.querySelector('.meta-item i.fa-calendar')?.parentElement;

        document.getElementById('previewImage').src = img.src;
        document.getElementById('previewTitle').textContent = title.textContent;
        document.getElementById('previewLink').textContent = 'Link: ' + link.textContent.trim();

        if (schedule) {
            document.getElementById('previewSchedule').textContent = 'Lịch: ' + schedule.textContent.trim();
        } else {
            document.getElementById('previewSchedule').textContent = '';
        }
    }

    modal.classList.add('active');
}

function previewBannerFromModal() {
    const imagePreview = document.getElementById('imagePreview');
    const title = document.getElementById('bannerTitle').value;
    const link = document.getElementById('bannerLink').value;
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;

    if (!imagePreview.src || imagePreview.style.display === 'none') {
        alert('Vui lòng tải lên hình ảnh trước khi xem trước!');
        return;
    }

    const modal = document.getElementById('previewModal');
    document.getElementById('previewImage').src = imagePreview.src;
    document.getElementById('previewTitle').textContent = title || 'Chưa có tiêu đề';
    document.getElementById('previewLink').textContent = 'Link: ' + (link || 'Chưa có link');

    if (startDate && endDate) {
        document.getElementById('previewSchedule').textContent =
            `Lịch: ${formatDate(startDate)} - ${formatDate(endDate)}`;
    } else {
        document.getElementById('previewSchedule').textContent = '';
    }

    modal.classList.add('active');
}

function closePreviewModal() {
    const modal = document.getElementById('previewModal');
    modal.classList.remove('active');
}

// ===================================
// Image Upload Preview
// ===================================

function previewImage(input) {
    const file = input.files[0];
    if (file) {
        const reader = new FileReader();

        reader.onload = function(e) {
            const imagePreview = document.getElementById('imagePreview');
            const uploadPlaceholder = document.querySelector('.upload-placeholder');

            imagePreview.src = e.target.result;
            imagePreview.style.display = 'block';
            uploadPlaceholder.style.display = 'none';
        };

        reader.readAsDataURL(file);
    }
}

// ===================================
// Schedule Fields Toggle
// ===================================

function toggleScheduleFields() {
    const checkbox = document.getElementById('enableSchedule');
    const scheduleFields = document.getElementById('scheduleFields');

    if (checkbox.checked) {
        scheduleFields.style.display = 'block';
    } else {
        scheduleFields.style.display = 'none';
        document.getElementById('startDate').value = '';
        document.getElementById('endDate').value = '';
    }
}

// ===================================
// Filter Functionality
// ===================================

function filterBanners() {
    const positionFilter = document.getElementById('filter-position').value;
    const statusFilter = document.getElementById('filter-status').value;
    const seasonFilter = document.getElementById('filter-season').value;

    const sections = document.querySelectorAll('.banner-section');

    sections.forEach(section => {
        const sectionPosition = section.querySelector('.sortable').getAttribute('data-position');

        // Filter by position
        if (positionFilter && positionFilter !== sectionPosition) {
            section.style.display = 'none';
            return;
        } else {
            section.style.display = 'block';
        }

        // Filter banners within section
        const banners = section.querySelectorAll('.banner-item');
        let visibleCount = 0;

        banners.forEach(banner => {
            let show = true;

            // Status filter
            if (statusFilter) {
                const bannerStatus = banner.getAttribute('data-status');
                if (statusFilter !== bannerStatus) {
                    show = false;
                }
            }

            // Season filter
            if (seasonFilter && show) {
                const seasonBadge = banner.querySelector('.season-badge');
                if (!seasonBadge || !seasonBadge.classList.contains(`season-${seasonFilter}`)) {
                    show = false;
                }
            }

            banner.style.display = show ? 'block' : 'none';
            if (show) visibleCount++;
        });

        // Update badge count
        const badge = section.querySelector('.section-header .badge');
        if (badge) {
            badge.textContent = `${visibleCount} banner`;
        }
    });

    // Update total count
    updateTotalBannersCount();
}

function updateTotalBannersCount() {
    const visibleBanners = document.querySelectorAll('.banner-item[style="display: block;"], .banner-item:not([style*="display"])');
    const totalElement = document.getElementById('total-banners');
    if (totalElement) {
        totalElement.textContent = `${visibleBanners.length} banner`;
    }
}

// ===================================
// Delete Banner
// ===================================

function deleteBanner(bannerId) {
    if (confirm('Bạn có chắc chắn muốn xóa banner này?')) {
        const banner = document.querySelector(`[data-id="${bannerId}"]`);
        if (banner) {
            banner.remove();
            console.log(`Banner ${bannerId} deleted`);

            // Update counts
            updateTotalBannersCount();
            updateSectionCounts();

            // In a real app, send delete request to backend
            // fetch(`/api/banners/${bannerId}`, { method: 'DELETE' });

            alert('Banner đã được xóa!');
        }
    }
}

// ===================================
// Duplicate Banner
// ===================================

function duplicateBanner(bannerId) {
    if (confirm('Bạn có muốn nhân bản banner này?')) {
        const banner = document.querySelector(`[data-id="${bannerId}"]`);
        if (banner) {
            const clone = banner.cloneNode(true);

            // Generate new ID
            const newId = Date.now();
            clone.setAttribute('data-id', newId);

            // Update title
            const title = clone.querySelector('.banner-header h3');
            title.textContent += ' (Bản sao)';

            // Update action buttons
            clone.querySelectorAll('.btn-action').forEach(btn => {
                const onclick = btn.getAttribute('onclick');
                if (onclick) {
                    btn.setAttribute('onclick', onclick.replace(bannerId, newId));
                }
            });

            // Re-add event listeners
            clone.addEventListener('dragstart', handleDragStart);
            clone.addEventListener('dragend', handleDragEnd);
            clone.addEventListener('dragover', handleDragOver);
            clone.addEventListener('drop', handleDrop);
            clone.addEventListener('dragenter', handleDragEnter);
            clone.addEventListener('dragleave', handleDragLeave);

            // Insert after original
            banner.parentNode.insertBefore(clone, banner.nextSibling);

            console.log(`Banner ${bannerId} duplicated as ${newId}`);

            // Update counts
            updateTotalBannersCount();
            updateSectionCounts();

            alert('Banner đã được nhân bản!');
        }
    }
}

// ===================================
// Update Section Counts
// ===================================

function updateSectionCounts() {
    const sections = document.querySelectorAll('.banner-section');

    sections.forEach(section => {
        const banners = section.querySelectorAll('.banner-item');
        const badge = section.querySelector('.section-header .badge');
        if (badge) {
            badge.textContent = `${banners.length} banner`;
        }
    });
}

// ===================================
// Utility Functions
// ===================================

function formatDate(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

// ===================================
// Keyboard Shortcuts
// ===================================

document.addEventListener('keydown', function(e) {
    // ESC to close modals
    if (e.key === 'Escape') {
        const activeModals = document.querySelectorAll('.modal.active');
        activeModals.forEach(modal => {
            modal.classList.remove('active');
        });
    }

    // Ctrl/Cmd + N to add new banner
    if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        openBannerModal('add');
    }
});

// ===================================
// Auto-save draft (optional feature)
// ===================================

let autoSaveTimer;

function enableAutoSave() {
    const form = document.getElementById('bannerForm');
    if (!form) return;

    const inputs = form.querySelectorAll('input, select, textarea');

    inputs.forEach(input => {
        input.addEventListener('input', function() {
            clearTimeout(autoSaveTimer);
            autoSaveTimer = setTimeout(() => {
                saveDraft();
            }, 2000); // Auto-save after 2 seconds of inactivity
        });
    });
}

function saveDraft() {
    const formData = new FormData(document.getElementById('bannerForm'));
    const draftData = Object.fromEntries(formData);

    // Save to localStorage
    localStorage.setItem('bannerDraft', JSON.stringify(draftData));
    console.log('Draft saved:', draftData);
}

function loadDraft() {
    const draft = localStorage.getItem('bannerDraft');
    if (draft) {
        const draftData = JSON.parse(draft);

        // Load draft data into form
        for (const [key, value] of Object.entries(draftData)) {
            const input = document.querySelector(`[name="${key}"]`);
            if (input) {
                if (input.type === 'checkbox') {
                    input.checked = value === 'on';
                } else {
                    input.value = value;
                }
            }
        }
    }
}

// Initialize auto-save on modal open
const originalOpenBannerModal = openBannerModal;
openBannerModal = function(...args) {
    originalOpenBannerModal.apply(this, args);
    enableAutoSave();
};
