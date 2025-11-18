/**
 * HERO-SECTION.JS
 * Xử lý carousel danh mục với navigation buttons
 * Màu sắc chủ đạo: #d84315 (đỏ cam)
 */

// ========================================
// 1. KHỞI TẠO - Lấy các elements
// ========================================
const categoriesContainer = document.getElementById('categoriesContainer');
const prevButton = document.getElementById('prevButton');
const nextButton = document.getElementById('nextButton');

// Cấu hình
const scrollAmount = 320; // Pixels mỗi lần scroll

// ========================================
// 2. CATEGORY DATA - Đồng bộ với header menu
// ========================================

/**
 * Dữ liệu danh mục sản phẩm
 * Bao gồm: tên, hình ảnh, danh mục con, màu chủ đạo, mô tả
 */
const categoryData = {
    'may-tre-dan': {
        name: 'Đồ mây tre đan',
        image: 'https://denmaytre.net/wp-content/uploads/2019/12/san-pham-may-tre-dan-xuat-khau-lang-nghe-tang-tien.jpg.webp',
        subcategories: ['Giỏ', 'Đèn tre', 'Túi cói'],
        color: '#8B4513',
        description: 'Sản phẩm thủ công từ mây tre tự nhiên'
    },
    'gom-su': {
        name: 'Gốm sứ',
        image: 'https://cdn.pixabay.com/photo/2023/05/29/18/10/pottery-8026823_1280.jpg',
        subcategories: ['Bình', 'Ấm chén', 'Tượng gốm'],
        color: '#d84315',
        description: 'Gốm sứ Bát Tràng truyền thống'
    },
    'go-my-nghe': {
        name: 'Đồ gỗ mỹ nghệ',
        image: 'https://dntt.mediacdn.vn/197608888129458176/2023/7/14/27-1-1689328749793900374452.jpg',
        subcategories: ['Tượng', 'Hộp', 'Khung ảnh'],
        color: '#6B4423',
        description: 'Nghệ thuật chạm khắc gỗ tinh xảo'
    },
    'det-theu': {
        name: 'Dệt thêu & may mặc thủ công',
        image: 'https://images.pexels.com/photos/236748/pexels-photo-236748.jpeg',
        subcategories: ['Khăn', 'Túi', 'Áo thổ cẩm'],
        color: '#C41E3A',
        description: 'Thổ cẩm và dệt thêu truyền thống'
    },
    'trang-suc': {
        name: 'Trang sức & phụ kiện thủ công',
        image: 'https://nvhphunu.vn/wp-content/uploads/2023/12/2023-07-29_0000478.png',
        subcategories: ['Vòng', 'Dây chuyền', 'Nhẫn'],
        color: '#FFD700',
        description: 'Trang sức thủ công độc đáo'
    },
    'trang-tri': {
        name: 'Đồ trang trí & quà tặng nghệ thuật',
        image: 'https://chus.vn/images/detailed/239/10237_21_F1.jpg',
        subcategories: ['Nến', 'Thiệp 3D', 'Tranh giấy'],
        color: '#FF6B6B',
        description: 'Quà tặng ý nghĩa và nghệ thuật'
    }
};

// ========================================
// 3. NAVIGATION BUTTONS
// ========================================

/**
 * Previous Button - Scroll trái
 */
if (prevButton) {
    prevButton.addEventListener('click', () => {
        categoriesContainer.scrollBy({
            left: -scrollAmount,
            behavior: 'smooth'
        });
    });
}

/**
 * Next Button - Scroll phải
 */
if (nextButton) {
    nextButton.addEventListener('click', () => {
        categoriesContainer.scrollBy({
            left: scrollAmount,
            behavior: 'smooth'
        });
    });
}

// ========================================
// 4. BUTTON STATES (Ẩn/Hiện Nút)
// ========================================

/**
 * Cập nhật trạng thái của navigation buttons
 * Ẩn nút khi đến đầu/cuối danh sách
 */
function updateButtons() {
    if (!categoriesContainer || !prevButton || !nextButton) return;

    const scrollLeft = categoriesContainer.scrollLeft;
    const maxScroll = categoriesContainer.scrollWidth - categoriesContainer.clientWidth;

    // Ẩn nút trái nếu ở đầu
    if (scrollLeft <= 0) {
        prevButton.style.opacity = '0.3';
        prevButton.disabled = true;
        prevButton.style.cursor = 'not-allowed';
    } else {
        prevButton.style.opacity = '1';
        prevButton.disabled = false;
        prevButton.style.cursor = 'pointer';
    }

    // Ẩn nút phải nếu ở cuối
    if (scrollLeft >= maxScroll - 10) {
        nextButton.style.opacity = '0.3';
        nextButton.disabled = true;
        nextButton.style.cursor = 'not-allowed';
    } else {
        nextButton.style.opacity = '1';
        nextButton.disabled = false;
        nextButton.style.cursor = 'pointer';
    }
}

// Gọi khi scroll
if (categoriesContainer) {
    categoriesContainer.addEventListener('scroll', updateButtons);

    // Gọi lần đầu khi tải trang
    updateButtons();
}

// Update lại khi resize window
window.addEventListener('resize', updateButtons);

// ========================================
// 5. CATEGORY HOVER EFFECTS & RIPPLE
// ========================================

/**
 * Tạo ripple effect khi click vào category
 */
function createRipple(event, element) {
    const circle = element.querySelector('.category-circle');
    if (!circle) return;

    const ripple = document.createElement('span');

    const diameter = Math.max(circle.clientWidth, circle.clientHeight);
    const radius = diameter / 2;

    // Tính vị trí click
    const rect = circle.getBoundingClientRect();
    const x = event.clientX - rect.left - radius;
    const y = event.clientY - rect.top - radius;

    ripple.style.width = ripple.style.height = `${diameter}px`;
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    ripple.classList.add('ripple');

    // Thêm ripple vào circle
    circle.style.position = 'relative';
    circle.appendChild(ripple);

    // Xóa ripple sau animation
    setTimeout(() => ripple.remove(), 600);
}

/**
 * Thêm click effects cho tất cả category items
 */
const categoryItems = document.querySelectorAll('.category-item');

categoryItems.forEach(item => {
    // Click effect với scale animation
    item.addEventListener('click', function(e) {
        // Scale animation
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.style.transform = '';
        }, 150);

        // Ripple effect
        createRipple(e, this);
    });

    // Hover effect - nâng cao trải nghiệm
    item.addEventListener('mouseenter', function() {
        const circle = this.querySelector('.category-circle');
        if (circle) {
            circle.style.boxShadow = '0 8px 16px rgba(216, 67, 21, 0.2)';
        }
    });

    item.addEventListener('mouseleave', function() {
        const circle = this.querySelector('.category-circle');
        if (circle) {
            circle.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.1)';
        }
    });
});

// ========================================
// 6. KHỞI ĐỘNG
// ========================================

/**
 * Khởi tạo khi DOM đã load xong
 */
document.addEventListener('DOMContentLoaded', function() {
    // Update button states ngay khi tải trang
    updateButtons();

    console.log('Hero Section carousel initialized ✓');
});
