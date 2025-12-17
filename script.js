// Data inventori (disimpan di localStorage)
let inventory = JSON.parse(localStorage.getItem('inventory')) || [];
let activities = JSON.parse(localStorage.getItem('activities')) || [];
let nextId = parseInt(localStorage.getItem('nextId')) || 1;
let nextActivityId = parseInt(localStorage.getItem('nextActivityId')) || 1;

// Variabel untuk pagination
let currentPage = 1;
let itemsPerPage = parseInt(localStorage.getItem('itemsPerPage')) || 20;
let currentView = 'table';
let filteredInventory = null; // Untuk menyimpan hasil pencarian

// Elemen DOM
const inventoryTableBody = document.getElementById('inventory-table-body');
const cardsContainer = document.getElementById('cards-container');
const emptyState = document.getElementById('empty-state');
const totalItemsEl = document.getElementById('total-items');
const lowStockEl = document.getElementById('low-stock');
const totalInEl = document.getElementById('total-in');
const totalOutEl = document.getElementById('total-out');
const searchInput = document.getElementById('search-input');
const activityList = document.getElementById('activity-list');
const logEmpty = document.getElementById('log-empty');
const tableCount = document.getElementById('table-count');
const refreshBtn = document.getElementById('refresh-btn');
const viewToggle = document.getElementById('view-toggle');
const paginationEl = document.getElementById('pagination');
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
const mobileAddItemBtn = document.getElementById('mobile-add-item');
const mobileAddStockBtn = document.getElementById('mobile-add-stock');
const mobileRemoveStockBtn = document.getElementById('mobile-remove-stock');
const currentPageEl = document.getElementById('current-page');
const totalPagesEl = document.getElementById('total-pages');
const itemsPerPageSelect = document.getElementById('items-per-page-select');

// Modal dan form elemen
const itemModal = document.getElementById('item-modal');
const stockModal = document.getElementById('stock-modal');
const editActivityModal = document.getElementById('edit-activity-modal');
const itemForm = document.getElementById('item-form');
const stockForm = document.getElementById('stock-form');
const editActivityForm = document.getElementById('edit-activity-form');
const closeModalBtn = document.getElementById('close-modal');
const closeStockModalBtn = document.getElementById('close-stock-modal');
const closeEditActivityModalBtn = document.getElementById('close-edit-activity-modal');
const cancelFormBtn = document.getElementById('cancel-form');
const cancelStockBtn = document.getElementById('cancel-stock');
const cancelEditActivityBtn = document.getElementById('cancel-edit-activity');
const clearActivityBtn = document.getElementById('clear-activity-btn');

// Tombol aksi
const addItemBtn = document.getElementById('add-item-btn');
const addStockBtn = document.getElementById('add-stock-btn');
const removeStockBtn = document.getElementById('remove-stock-btn');
const exportBtn = document.getElementById('export-btn');

// Notifikasi
const notification = document.getElementById('notification');
const notificationIcon = document.getElementById('notification-icon');
const notificationMessage = document.getElementById('notification-message');

// Inisialisasi aplikasi
document.addEventListener('DOMContentLoaded', function() {
    initApp();
    
    // Event listener untuk form barang
    itemForm.addEventListener('submit', handleItemFormSubmit);
    stockForm.addEventListener('submit', handleStockFormSubmit);
    editActivityForm.addEventListener('submit', handleEditActivityFormSubmit);
    
    // Event listener untuk modal
    closeModalBtn.addEventListener('click', () => closeModal(itemModal));
    closeStockModalBtn.addEventListener('click', () => closeModal(stockModal));
    closeEditActivityModalBtn.addEventListener('click', () => closeModal(editActivityModal));
    cancelFormBtn.addEventListener('click', () => closeModal(itemModal));
    cancelStockBtn.addEventListener('click', () => closeModal(stockModal));
    cancelEditActivityBtn.addEventListener('click', () => closeModal(editActivityModal));
    
    // Event listener untuk tombol aksi
    addItemBtn.addEventListener('click', openAddItemModal);
    addStockBtn.addEventListener('click', () => openStockModal('in'));
    removeStockBtn.addEventListener('click', () => openStockModal('out'));
    exportBtn.addEventListener('click', exportData);
    refreshBtn.addEventListener('click', refreshData);
    clearActivityBtn.addEventListener('click', clearAllActivities);
    viewToggle.addEventListener('click', toggleView);
    
    // Event listener untuk items per page
    itemsPerPageSelect.value = itemsPerPage;
    itemsPerPageSelect.addEventListener('change', function() {
        itemsPerPage = parseInt(this.value);
        localStorage.setItem('itemsPerPage', itemsPerPage);
        currentPage = 1;
        renderInventory();
    });
    
    // Event listener untuk mobile
    mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    mobileAddItemBtn.addEventListener('click', () => {
        openAddItemModal();
        closeMobileMenu();
    });
    mobileAddStockBtn.addEventListener('click', () => {
        openStockModal('in');
        closeMobileMenu();
    });
    mobileRemoveStockBtn.addEventListener('click', () => {
        openStockModal('out');
        closeMobileMenu();
    });
    
    // Event listener untuk pencarian
    searchInput.addEventListener('input', handleSearch);
    
    // Event listener untuk klik di luar modal
    window.addEventListener('click', (e) => {
        if (e.target === itemModal) closeModal(itemModal);
        if (e.target === stockModal) closeModal(stockModal);
        if (e.target === editActivityModal) closeModal(editActivityModal);
    });
    
    // Event listener untuk resize window
    window.addEventListener('resize', handleResize);
    
    // Deteksi orientasi perangkat
    window.addEventListener('orientationchange', handleOrientationChange);
});

// Fungsi inisialisasi aplikasi
function initApp() {
    // Cek jika data kosong, tambahkan data contoh
    if (inventory.length === 0) {
        loadSampleData();
    }
    
    // Set tampilan awal berdasarkan ukuran layar
    detectViewMode();
    
    renderInventory();
    updateStats();
    renderActivityLog();
}

// Fungsi untuk mendeteksi mode tampilan berdasarkan ukuran layar
function detectViewMode() {
    const isMobile = window.innerWidth <= 768;
    currentView = isMobile ? 'cards' : 'table';
    updateViewToggle();
}

// Fungsi untuk toggle tampilan antara tabel dan kartu
function toggleView() {
    currentView = currentView === 'table' ? 'cards' : 'table';
    updateViewToggle();
    renderInventory();
}

// Fungsi untuk memperbarui ikon toggle view
function updateViewToggle() {
    const icon = viewToggle.querySelector('i');
    if (currentView === 'table') {
        icon.className = 'fas fa-th-large';
        viewToggle.title = 'Tampilan Kartu';
        document.getElementById('table-container').style.display = 'block';
        document.getElementById('cards-container').style.display = 'none';
    } else {
        icon.className = 'fas fa-table';
        viewToggle.title = 'Tampilan Tabel';
        document.getElementById('table-container').style.display = 'none';
        document.getElementById('cards-container').style.display = 'grid';
    }
}

// Fungsi untuk merender inventori (tabel atau kartu)
function renderInventory(items = null) {
    const itemsToRender = items || inventory;
    filteredInventory = itemsToRender; // Simpan untuk pagination
    const totalItems = itemsToRender.length;
    
    if (totalItems === 0) {
        inventoryTableBody.innerHTML = '';
        cardsContainer.innerHTML = '';
        emptyState.style.display = 'block';
        tableCount.textContent = '0';
        paginationEl.innerHTML = '';
        currentPageEl.textContent = '1';
        totalPagesEl.textContent = '1';
        return;
    }
    
    emptyState.style.display = 'none';
    
    // Hitung pagination
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    
    // Pastikan currentPage valid
    if (currentPage > totalPages) {
        currentPage = totalPages || 1;
    }
    
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
    const pageItems = itemsToRender.slice(startIndex, endIndex);
    
    // Update pagination info
    currentPageEl.textContent = currentPage;
    totalPagesEl.textContent = totalPages;
    
    // Render berdasarkan mode tampilan
    if (currentView === 'table') {
        renderTableView(pageItems);
    } else {
        renderCardsView(pageItems);
    }
    
    // Update info tabel
    tableCount.textContent = `${startIndex + 1}-${endIndex} dari ${totalItems}`;
    
    // Render pagination controls
    renderPagination(totalPages);
}

// Fungsi untuk merender tampilan tabel
function renderTableView(items) {
    inventoryTableBody.innerHTML = items.map(item => {
        const statusClass = item.stock <= item.minimumStock ? 'low' : 'adequate';
        const statusText = item.stock <= item.minimumStock ? 'Stok Rendah' : 'Stok Cukup';
        
        return `
            <tr>
                <td><strong>${item.id.toString().padStart(3, '0')}</strong></td>
                <td>
                    <div class="item-name">${item.name}</div>
                    ${item.description ? `<small class="item-desc">${item.description}</small>` : ''}
                </td>
                <td>${item.category}</td>
                <td><strong>${item.stock}</strong></td>
                <td>${item.minimumStock}</td>
                <td>${formatCurrency(item.price)}</td>
                <td><span class="status ${statusClass}">${statusText}</span></td>
                <td>
                    <div class="actions">
                        <div class="action-icon edit" title="Edit Barang" onclick="editItem(${item.id})">
                            <i class="fas fa-edit"></i>
                        </div>
                        <div class="action-icon in" title="Barang Masuk" onclick="openStockModalForItem('in', ${item.id})">
                            <i class="fas fa-arrow-down"></i>
                        </div>
                        <div class="action-icon out" title="Barang Keluar" onclick="openStockModalForItem('out', ${item.id})">
                            <i class="fas fa-arrow-up"></i>
                        </div>
                        <div class="action-icon delete" title="Hapus Barang" onclick="deleteItem(${item.id})">
                            <i class="fas fa-trash"></i>
                        </div>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

// Fungsi untuk merender tampilan kartu
function renderCardsView(items) {
    cardsContainer.innerHTML = items.map(item => {
        const statusClass = item.stock <= item.minimumStock ? 'low' : 'adequate';
        const statusText = item.stock <= item.minimumStock ? 'Stok Rendah' : 'Stok Cukup';
        
        return `
            <div class="item-card">
                <div class="card-header">
                    <div class="card-id">#${item.id.toString().padStart(3, '0')}</div>
                    <div class="card-category">${item.category}</div>
                </div>
                <div class="card-body">
                    <div class="card-name">${item.name}</div>
                    ${item.description ? `<div class="card-desc">${item.description}</div>` : ''}
                    <div class="card-details">
                        <div class="detail-item">
                            <span class="detail-label">Stok</span>
                            <span class="detail-value">${item.stock}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Min. Stok</span>
                            <span class="detail-value">${item.minimumStock}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Harga</span>
                            <span class="detail-value">${formatCurrency(item.price)}</span>
                        </div>
                    </div>
                </div>
                <div class="card-footer">
                    <span class="card-status ${statusClass}">${statusText}</span>
                    <div class="card-actions">
                        <div class="card-action-icon edit" title="Edit Barang" onclick="editItem(${item.id})">
                            <i class="fas fa-edit"></i>
                        </div>
                        <div class="card-action-icon in" title="Barang Masuk" onclick="openStockModalForItem('in', ${item.id})">
                            <i class="fas fa-arrow-down"></i>
                        </div>
                        <div class="card-action-icon out" title="Barang Keluar" onclick="openStockModalForItem('out', ${item.id})">
                            <i class="fas fa-arrow-up"></i>
                        </div>
                        <div class="card-action-icon delete" title="Hapus Barang" onclick="deleteItem(${item.id})">
                            <i class="fas fa-trash"></i>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// Fungsi untuk merender pagination controls
function renderPagination(totalPages) {
    if (totalPages <= 1) {
        paginationEl.innerHTML = '';
        return;
    }
    
    let paginationHTML = '';
    
    // Tombol pertama
    if (currentPage > 1) {
        paginationHTML += `
            <button class="page-btn first" onclick="goToPage(1)" title="Halaman pertama">
                <i class="fas fa-angle-double-left"></i>
            </button>
        `;
    }
    
    // Tombol sebelumnya
    paginationHTML += `
        <button class="page-btn prev" ${currentPage === 1 ? 'disabled' : ''} onclick="goToPage(${currentPage - 1})" title="Halaman sebelumnya">
            <i class="fas fa-chevron-left"></i>
        </button>
    `;
    
    // Halaman - tampilkan maksimal 5 halaman
    const maxVisiblePages = window.innerWidth <= 480 ? 3 : 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    // Sesuaikan jika tidak cukup halaman
    if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    // Tombol halaman pertama jika diperlukan
    if (startPage > 1) {
        paginationHTML += `
            <button class="page-btn" onclick="goToPage(1)">1</button>
            ${startPage > 2 ? '<span class="pagination-dots">...</span>' : ''}
        `;
    }
    
    // Halaman yang terlihat
    for (let i = startPage; i <= endPage; i++) {
        paginationHTML += `
            <button class="page-btn ${i === currentPage ? 'active' : ''}" onclick="goToPage(${i})">
                ${i}
            </button>
        `;
    }
    
    // Tombol halaman terakhir jika diperlukan
    if (endPage < totalPages) {
        paginationHTML += `
            ${endPage < totalPages - 1 ? '<span class="pagination-dots">...</span>' : ''}
            <button class="page-btn" onclick="goToPage(${totalPages})">${totalPages}</button>
        `;
    }
    
    // Tombol berikutnya
    paginationHTML += `
        <button class="page-btn next" ${currentPage === totalPages ? 'disabled' : ''} onclick="goToPage(${currentPage + 1})" title="Halaman berikutnya">
            <i class="fas fa-chevron-right"></i>
        </button>
    `;
    
    // Tombol terakhir
    if (currentPage < totalPages) {
        paginationHTML += `
            <button class="page-btn last" onclick="goToPage(${totalPages})" title="Halaman terakhir">
                <i class="fas fa-angle-double-right"></i>
            </button>
        `;
    }
    
    paginationEl.innerHTML = paginationHTML;
}

// Fungsi untuk pergi ke halaman tertentu
function goToPage(page) {
    currentPage = page;
    renderInventory();
    
    // Scroll ke atas tabel/kartu
    const inventoryCard = document.querySelector('.inventory-card');
    if (inventoryCard) {
        inventoryCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// Fungsi untuk changePage (kompatibilitas dengan kode sebelumnya)
function changePage(page) {
    goToPage(page);
}

// Fungsi untuk membuka modal tambah barang
function openAddItemModal() {
    document.getElementById('modal-title').textContent = 'Tambah Barang Baru';
    document.getElementById('item-id').value = '';
    document.getElementById('item-name').value = '';
    document.getElementById('item-category').value = '';
    document.getElementById('item-stock').value = '';
    document.getElementById('item-price').value = '';
    document.getElementById('item-minimum').value = '5';
    document.getElementById('item-description').value = '';
    
    openModal(itemModal);
}

// Fungsi untuk membuka modal edit barang
function editItem(id) {
    const item = inventory.find(item => item.id === id);
    if (!item) return;
    
    document.getElementById('modal-title').textContent = 'Edit Barang';
    document.getElementById('item-id').value = item.id;
    document.getElementById('item-name').value = item.name;
    document.getElementById('item-category').value = item.category;
    document.getElementById('item-stock').value = item.stock;
    document.getElementById('item-price').value = item.price;
    document.getElementById('item-minimum').value = item.minimumStock;
    document.getElementById('item-description').value = item.description || '';
    
    openModal(itemModal);
}

// Fungsi untuk menangani submit form barang
function handleItemFormSubmit(e) {
    e.preventDefault();
    
    const id = document.getElementById('item-id').value;
    const name = document.getElementById('item-name').value;
    const category = document.getElementById('item-category').value;
    const stock = parseInt(document.getElementById('item-stock').value);
    const price = parseInt(document.getElementById('item-price').value);
    const minimumStock = parseInt(document.getElementById('item-minimum').value);
    const description = document.getElementById('item-description').value;
    
    if (id) {
        // Edit barang yang ada
        const index = inventory.findIndex(item => item.id === parseInt(id));
        if (index !== -1) {
            const oldStock = inventory[index].stock;
            inventory[index] = {
                ...inventory[index],
                name,
                category,
                stock,
                price,
                minimumStock,
                description,
                updatedAt: new Date().toISOString()
            };
            
            // Log aktivitas
            addActivity('edit', name, stock - oldStock, `Barang diperbarui - stok: ${oldStock} → ${stock}`);
            showNotification('Barang berhasil diperbarui', 'success');
        }
    } else {
        // Tambah barang baru
        const newItem = {
            id: nextId++,
            name,
            category,
            stock,
            price,
            minimumStock,
            description,
            createdAt: new Date().toISOString()
        };
        
        inventory.push(newItem);
        
        // Log aktivitas
        addActivity('add', name, stock, 'Barang baru ditambahkan');
        showNotification('Barang berhasil ditambahkan', 'success');
    }
    
    // Simpan data dan update UI
    saveData();
    currentPage = 1; // Reset ke halaman 1
    renderInventory();
    updateStats();
    renderActivityLog();
    closeModal(itemModal);
}

// Fungsi untuk membuka modal stok (masuk/keluar)
function openStockModal(type, activityId = null) {
    document.getElementById('stock-type').value = type;
    document.getElementById('stock-item-id').value = '';
    document.getElementById('stock-activity-id').value = activityId || '';
    
    const title = type === 'in' ? 'Catat Barang Masuk' : 'Catat Barang Keluar';
    document.getElementById('stock-modal-title').textContent = title;
    
    // Isi dropdown dengan barang yang ada
    const itemSelect = document.getElementById('stock-item-select');
    itemSelect.innerHTML = '<option value="">Pilih barang...</option>';
    
    inventory.forEach(item => {
        const option = document.createElement('option');
        option.value = item.id;
        option.textContent = `${item.name} (Stok: ${item.stock})`;
        itemSelect.appendChild(option);
    });
    
    // Reset form
    document.getElementById('current-stock-display').textContent = '-';
    document.getElementById('stock-quantity').value = '';
    document.getElementById('stock-notes').value = '';
    
    // Jika ada activityId, berarti ini edit aktivitas
    if (activityId) {
        const activity = activities.find(a => a.id === parseInt(activityId));
        if (activity) {
            // Cari item berdasarkan nama (karena di aktivitas hanya menyimpan nama)
            const item = inventory.find(i => i.name === activity.itemName);
            if (item) {
                document.getElementById('stock-item-select').value = item.id;
                document.getElementById('current-stock-display').textContent = item.stock;
                document.getElementById('stock-quantity').value = activity.quantity;
                document.getElementById('stock-notes').value = activity.notes || '';
            }
        }
    }
    
    // Event listener untuk perubahan pilihan barang
    itemSelect.addEventListener('change', function() {
        const itemId = parseInt(this.value);
        if (itemId) {
            const item = inventory.find(item => item.id === itemId);
            if (item) {
                document.getElementById('current-stock-display').textContent = item.stock;
                document.getElementById('stock-item-id').value = item.id;
            }
        } else {
            document.getElementById('current-stock-display').textContent = '-';
            document.getElementById('stock-item-id').value = '';
        }
    });
    
    openModal(stockModal);
}

// Fungsi untuk membuka modal stok untuk barang tertentu
function openStockModalForItem(type, itemId) {
    const item = inventory.find(item => item.id === itemId);
    if (!item) return;
    
    document.getElementById('stock-type').value = type;
    document.getElementById('stock-item-id').value = item.id;
    
    const title = type === 'in' ? 'Catat Barang Masuk' : 'Catat Barang Keluar';
    document.getElementById('stock-modal-title').textContent = title;
    
    // Isi dropdown dengan barang yang ada
    const itemSelect = document.getElementById('stock-item-select');
    itemSelect.innerHTML = '<option value="">Pilih barang...</option>';
    
    inventory.forEach(item => {
        const option = document.createElement('option');
        option.value = item.id;
        option.textContent = `${item.name} (Stok: ${item.stock})`;
        itemSelect.appendChild(option);
    });
    
    // Set pilihan ke barang yang dipilih
    itemSelect.value = item.id;
    document.getElementById('current-stock-display').textContent = item.stock;
    document.getElementById('stock-quantity').value = '';
    document.getElementById('stock-notes').value = '';
    
    openModal(stockModal);
}

// Fungsi untuk menangani submit form stok
function handleStockFormSubmit(e) {
    e.preventDefault();
    
    const type = document.getElementById('stock-type').value;
    const itemId = parseInt(document.getElementById('stock-item-id').value);
    const quantity = parseInt(document.getElementById('stock-quantity').value);
    const notes = document.getElementById('stock-notes').value;
    const activityId = document.getElementById('stock-activity-id').value;
    
    if (!itemId) {
        showNotification('Pilih barang terlebih dahulu', 'error');
        return;
    }
    
    if (!quantity || quantity <= 0) {
        showNotification('Masukkan jumlah yang valid', 'error');
        return;
    }
    
    const itemIndex = inventory.findIndex(item => item.id === itemId);
    if (itemIndex === -1) {
        showNotification('Barang tidak ditemukan', 'error');
        return;
    }
    
    const item = inventory[itemIndex];
    const oldStock = item.stock;
    
    if (activityId) {
        // Edit aktivitas yang sudah ada
        const activityIndex = activities.findIndex(a => a.id === parseInt(activityId));
        if (activityIndex !== -1) {
            const oldActivity = activities[activityIndex];
            const oldQuantity = oldActivity.quantity;
            
            // Kembalikan stok ke keadaan sebelum aktivitas lama
            if (oldActivity.type === 'in') {
                inventory[itemIndex].stock -= oldQuantity;
            } else if (oldActivity.type === 'out') {
                inventory[itemIndex].stock += oldQuantity;
            }
            
            // Perbarui aktivitas
            activities[activityIndex] = {
                ...oldActivity,
                type,
                itemName: item.name,
                quantity,
                notes,
                timestamp: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
        }
    }
    
    // Update stok berdasarkan jenis transaksi
    if (type === 'in') {
        // Barang masuk
        inventory[itemIndex].stock += quantity;
        if (!activityId) {
            addActivity('in', item.name, quantity, notes);
        }
        showNotification(`${quantity} ${item.name} berhasil dicatat masuk`, 'success');
    } else {
        // Barang keluar
        if (item.stock < quantity) {
            showNotification('Stok tidak mencukupi', 'error');
            return;
        }
        
        inventory[itemIndex].stock -= quantity;
        if (!activityId) {
            addActivity('out', item.name, quantity, notes);
        }
        showNotification(`${quantity} ${item.name} berhasil dicatat keluar`, 'success');
    }
    
    // Simpan data dan update UI
    saveData();
    currentPage = 1; // Reset ke halaman 1
    renderInventory();
    updateStats();
    renderActivityLog();
    closeModal(stockModal);
}

// Fungsi untuk membuka modal edit aktivitas
function openEditActivityModal(activityId) {
    const activity = activities.find(a => a.id === activityId);
    if (!activity) return;
    
    document.getElementById('edit-activity-id').value = activity.id;
    document.getElementById('edit-activity-type-display').textContent = 
        activity.type === 'in' ? 'Barang Masuk' : 
        activity.type === 'out' ? 'Barang Keluar' : 
        activity.type === 'add' ? 'Tambah Barang' : 
        activity.type === 'edit' ? 'Edit Barang' : 'Aktivitas';
    
    document.getElementById('edit-activity-item-display').textContent = activity.itemName;
    document.getElementById('edit-activity-quantity').value = activity.quantity;
    document.getElementById('edit-activity-notes').value = activity.notes || '';
    
    openModal(editActivityModal);
}

// Fungsi untuk menangani submit form edit aktivitas
function handleEditActivityFormSubmit(e) {
    e.preventDefault();
    
    const activityId = parseInt(document.getElementById('edit-activity-id').value);
    const quantity = parseInt(document.getElementById('edit-activity-quantity').value);
    const notes = document.getElementById('edit-activity-notes').value;
    
    const activityIndex = activities.findIndex(a => a.id === activityId);
    if (activityIndex === -1) return;
    
    const activity = activities[activityIndex];
    
    // Cari item berdasarkan nama
    const itemIndex = inventory.findIndex(item => item.name === activity.itemName);
    if (itemIndex === -1) {
        showNotification('Barang tidak ditemukan di inventori', 'error');
        closeModal(editActivityModal);
        return;
    }
    
    const item = inventory[itemIndex];
    
    // Kembalikan stok ke keadaan sebelum aktivitas lama
    if (activity.type === 'in') {
        inventory[itemIndex].stock -= activity.quantity;
    } else if (activity.type === 'out') {
        inventory[itemIndex].stock += activity.quantity;
    }
    
    // Update stok dengan kuantitas baru
    if (activity.type === 'in' || activity.type === 'add') {
        inventory[itemIndex].stock += quantity;
    } else if (activity.type === 'out') {
        if (inventory[itemIndex].stock < quantity) {
            showNotification('Stok tidak mencukupi untuk perubahan ini', 'error');
            return;
        }
        inventory[itemIndex].stock -= quantity;
    }
    
    // Update aktivitas
    activities[activityIndex] = {
        ...activity,
        quantity,
        notes,
        timestamp: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    
    // Simpan data dan update UI
    saveData();
    currentPage = 1; // Reset ke halaman 1
    renderInventory();
    updateStats();
    renderActivityLog();
    showNotification('Aktivitas berhasil diperbarui', 'success');
    closeModal(editActivityModal);
}

// Fungsi untuk menghapus barang
function deleteItem(id) {
    if (!confirm('Apakah Anda yakin ingin menghapus barang ini?')) return;
    
    const itemIndex = inventory.findIndex(item => item.id === id);
    if (itemIndex === -1) return;
    
    const item = inventory[itemIndex];
    
    // Hapus dari array
    inventory.splice(itemIndex, 1);
    
    // Log aktivitas
    addActivity('delete', item.name, 0, 'Barang dihapus dari inventori');
    
    // Simpan data dan update UI
    saveData();
    currentPage = 1; // Reset ke halaman 1
    renderInventory();
    updateStats();
    renderActivityLog();
    showNotification('Barang berhasil dihapus', 'success');
}

// Fungsi untuk menghapus aktivitas
function deleteActivity(activityId) {
    if (!confirm('Apakah Anda yakin ingin menghapus aktivitas ini?')) return;
    
    const activityIndex = activities.findIndex(a => a.id === activityId);
    if (activityIndex === -1) return;
    
    const activity = activities[activityIndex];
    
    // Jika aktivitas terkait dengan stok (in/out), kembalikan stok
    if (activity.type === 'in' || activity.type === 'out') {
        const itemIndex = inventory.findIndex(item => item.name === activity.itemName);
        if (itemIndex !== -1) {
            if (activity.type === 'in') {
                inventory[itemIndex].stock -= activity.quantity;
            } else if (activity.type === 'out') {
                inventory[itemIndex].stock += activity.quantity;
            }
        }
    }
    
    // Hapus aktivitas
    activities.splice(activityIndex, 1);
    
    // Simpan data dan update UI
    saveData();
    renderInventory();
    updateStats();
    renderActivityLog();
    showNotification('Aktivitas berhasil dihapus', 'success');
}

// Fungsi untuk menghapus semua aktivitas
function clearAllActivities() {
    if (activities.length === 0) {
        showNotification('Tidak ada aktivitas untuk dihapus', 'info');
        return;
    }
    
    if (!confirm('Apakah Anda yakin ingin menghapus semua aktivitas? Tindakan ini tidak dapat dibatalkan.')) return;
    
    activities = [];
    saveData();
    renderActivityLog();
    showNotification('Semua aktivitas berhasil dihapus', 'success');
}

// Fungsi untuk update statistik
function updateStats() {
    const totalItems = inventory.length;
    const lowStock = inventory.filter(item => item.stock <= item.minimumStock).length;
    
    // Hitung total barang masuk/keluar dari log aktivitas
    const totalIn = activities
        .filter(activity => activity.type === 'in')
        .reduce((sum, activity) => sum + activity.quantity, 0);
    
    const totalOut = activities
        .filter(activity => activity.type === 'out')
        .reduce((sum, activity) => sum + activity.quantity, 0);
    
    totalItemsEl.textContent = totalItems;
    lowStockEl.textContent = lowStock;
    totalInEl.textContent = totalIn;
    totalOutEl.textContent = totalOut;
}

// Fungsi untuk merender log aktivitas
function renderActivityLog() {
    if (activities.length === 0) {
        activityList.innerHTML = '';
        logEmpty.style.display = 'flex';
        return;
    }
    
    logEmpty.style.display = 'none';
    
    // Ambil 10 aktivitas terbaru (diurutkan dari terbaru)
    const recentActivities = [...activities].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 10);
    
    activityList.innerHTML = recentActivities.map(activity => {
        let icon, text, activityClass, actionText;
        
        switch(activity.type) {
            case 'add':
                icon = 'fas fa-plus-circle';
                text = `Barang baru ditambahkan`;
                activityClass = 'add';
                actionText = `<strong>${activity.itemName}</strong> (${activity.quantity} unit)`;
                break;
            case 'edit':
                icon = 'fas fa-edit';
                text = `Barang diperbarui`;
                activityClass = 'edit';
                actionText = `<strong>${activity.itemName}</strong>`;
                break;
            case 'in':
                icon = 'fas fa-arrow-down';
                text = `Barang masuk`;
                activityClass = 'in';
                actionText = `<strong>${activity.itemName}</strong> (${activity.quantity} unit)`;
                break;
            case 'out':
                icon = 'fas fa-arrow-up';
                text = `Barang keluar`;
                activityClass = 'out';
                actionText = `<strong>${activity.itemName}</strong> (${activity.quantity} unit)`;
                break;
            case 'delete':
                icon = 'fas fa-trash';
                text = `Barang dihapus`;
                activityClass = 'delete';
                actionText = `<strong>${activity.itemName}</strong>`;
                break;
            default:
                icon = 'fas fa-info-circle';
                text = 'Aktivitas';
                activityClass = '';
                actionText = activity.itemName;
        }
        
        const date = new Date(activity.timestamp);
        const timeString = date.toLocaleTimeString('id-ID', {
            hour: '2-digit',
            minute: '2-digit'
        });
        const dateString = date.toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
        
        return `
            <li class="activity-item ${activityClass}">
                <div class="activity-icon">
                    <i class="${icon}"></i>
                </div>
                <div class="activity-content">
                    <div class="activity-text">
                        ${text}: ${actionText}
                        ${activity.notes ? `<br><small><i>Catatan:</i> ${activity.notes}</small>` : ''}
                    </div>
                    <div class="activity-details">
                        <div class="activity-time">
                            <i class="far fa-clock"></i> ${timeString} - ${dateString}
                        </div>
                        <div class="activity-actions">
                            ${activity.type === 'in' || activity.type === 'out' ? 
                                `<button class="activity-edit-btn" onclick="openEditActivityModal(${activity.id})" title="Edit">
                                    <i class="fas fa-edit"></i>
                                </button>` : ''
                            }
                            <button class="activity-delete-btn" onclick="deleteActivity(${activity.id})" title="Hapus">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </li>
        `;
    }).join('');
}

// Fungsi untuk menambahkan aktivitas ke log
function addActivity(type, itemName, quantity, notes = '') {
    const activity = {
        id: nextActivityId++,
        type,
        itemName,
        quantity: Math.abs(quantity),
        notes,
        timestamp: new Date().toISOString()
    };
    
    activities.push(activity);
    
    // Simpan ke localStorage
    localStorage.setItem('activities', JSON.stringify(activities));
    localStorage.setItem('nextActivityId', nextActivityId.toString());
}

// Fungsi untuk menangani pencarian
function handleSearch() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    
    if (!searchTerm) {
        filteredInventory = null;
        currentPage = 1;
        renderInventory();
        return;
    }
    
    const filteredItems = inventory.filter(item => 
        item.name.toLowerCase().includes(searchTerm) ||
        item.category.toLowerCase().includes(searchTerm) ||
        (item.description && item.description.toLowerCase().includes(searchTerm)) ||
        item.id.toString().includes(searchTerm)
    );
    
    currentPage = 1;
    renderInventory(filteredItems);
}

// Fungsi untuk refresh data
function refreshData() {
    currentPage = 1;
    renderInventory();
    updateStats();
    renderActivityLog();
    showNotification('Data diperbarui', 'info');
}

// Fungsi untuk mengekspor data
function exportData() {
    // Tentukan data yang akan diekspor
    const dataToExport = filteredInventory || inventory;
    
    if (dataToExport.length === 0) {
        showNotification('Tidak ada data untuk diekspor', 'info');
        return;
    }
    
    // Buat data CSV
    let csvContent = "ID,Nama Barang,Kategori,Stok,Stok Minimum,Harga,Deskripsi\n";
    
    dataToExport.forEach(item => {
        const row = [
            item.id,
            `"${item.name}"`,
            `"${item.category}"`,
            item.stock,
            item.minimumStock,
            item.price,
            `"${item.description || ''}"`
        ];
        csvContent += row.join(",") + "\n";
    });
    
    // Buat blob dan unduh
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `inventory_${new Date().toISOString().slice(0,10)}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showNotification(`Data berhasil diekspor (${dataToExport.length} item)`, 'success');
}

// Fungsi untuk toggle menu mobile
function toggleMobileMenu() {
    mobileMenu.classList.toggle('active');
}

// Fungsi untuk menutup menu mobile
function closeMobileMenu() {
    mobileMenu.classList.remove('active');
}

// Fungsi untuk menangani resize window
function handleResize() {
    detectViewMode();
    renderInventory();
}

// Fungsi untuk menangani perubahan orientasi
function handleOrientationChange() {
    // Beri waktu untuk orientasi berubah
    setTimeout(() => {
        detectViewMode();
        renderInventory();
    }, 100);
}

// Fungsi untuk membuka modal
function openModal(modal) {
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    closeMobileMenu();
}

// Fungsi untuk menutup modal
function closeModal(modal) {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Fungsi untuk menampilkan notifikasi
function showNotification(message, type = 'success') {
    // Set ikon dan warna berdasarkan tipe
    if (type === 'success') {
        notificationIcon.className = 'fas fa-check-circle';
        notification.style.background = '#10b981';
    } else if (type === 'error') {
        notificationIcon.className = 'fas fa-exclamation-circle';
        notification.style.background = '#ef4444';
    } else if (type === 'info') {
        notificationIcon.className = 'fas fa-info-circle';
        notification.style.background = '#3b82f6';
    }
    
    notificationMessage.textContent = message;
    notification.classList.add('show');
    
    // Sembunyikan notifikasi setelah 3 detik
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Fungsi untuk format mata uang
function formatCurrency(amount) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(amount);
}

// Fungsi untuk menyimpan data ke localStorage
function saveData() {
    localStorage.setItem('inventory', JSON.stringify(inventory));
    localStorage.setItem('activities', JSON.stringify(activities));
    localStorage.setItem('nextId', nextId.toString());
    localStorage.setItem('nextActivityId', nextActivityId.toString());
}

// Fungsi untuk memuat data contoh dengan 25 item
function loadSampleData() {
    inventory = [
        {
            id: nextId++,
            name: "Laptop Dell XPS 13",
            category: "Elektronik",
            stock: 8,
            price: 15000000,
            minimumStock: 3,
            description: "Laptop bisnis dengan layar 13 inci, RAM 16GB, SSD 512GB",
            createdAt: new Date().toISOString()
        },
        {
            id: nextId++,
            name: "Mouse Wireless Logitech MX Master 3",
            category: "Elektronik",
            stock: 25,
            price: 850000,
            minimumStock: 10,
            description: "Mouse nirkabel ergonomis dengan sensor Darkfield",
            createdAt: new Date().toISOString()
        },
        {
            id: nextId++,
            name: "Kertas A4 80gsm SIDU",
            category: "Peralatan Kantor",
            stock: 12,
            price: 60000,
            minimumStock: 5,
            description: "Rim kertas A4 80gsm isi 500 lembar, kualitas premium",
            createdAt: new Date().toISOString()
        },
        {
            id: nextId++,
            name: "Printer Epson L3210",
            category: "Elektronik",
            stock: 2,
            price: 2500000,
            minimumStock: 2,
            description: "Printer all-in-one dengan sistem tangki tinta isi ulang",
            createdAt: new Date().toISOString()
        },
        {
            id: nextId++,
            name: "Bolpoin Pilot G-2 0.7mm",
            category: "Alat Tulis",
            stock: 48,
            price: 15000,
            minimumStock: 20,
            description: "Bolpoin gel isi hitam, tinta tahan air dan tidak luntur",
            createdAt: new Date().toISOString()
        },
        {
            id: nextId++,
            name: "Monitor LG 24MK600",
            category: "Elektronik",
            stock: 6,
            price: 2200000,
            minimumStock: 3,
            description: "Monitor LED 24 inci Full HD dengan AMD FreeSync",
            createdAt: new Date().toISOString()
        },
        {
            id: nextId++,
            name: "Keyboard Mechanical RGB",
            category: "Elektronik",
            stock: 15,
            price: 750000,
            minimumStock: 8,
            description: "Keyboard mekanikal dengan switch blue dan lampu RGB",
            createdAt: new Date().toISOString()
        },
        {
            id: nextId++,
            name: "Stapler Standard HD-50",
            category: "Peralatan Kantor",
            stock: 30,
            price: 35000,
            minimumStock: 15,
            description: "Stapler kantor kapasitas 50 lembar, full metal body",
            createdAt: new Date().toISOString()
        },
        {
            id: nextId++,
            name: "Binder Clip No. 107",
            category: "Peralatan Kantor",
            stock: 200,
            price: 2500,
            minimumStock: 100,
            description: "Binder clip ukuran besar, isi 10 pcs per kemasan",
            createdAt: new Date().toISOString()
        },
        {
            id: nextId++,
            name: "Proyektor Epson EB-X41",
            category: "Elektronik",
            stock: 3,
            price: 6500000,
            minimumStock: 2,
            description: "Proyektor XGA 3600 lumens untuk presentasi",
            createdAt: new Date().toISOString()
        },
        {
            id: nextId++,
            name: "Scanner Fujitsu ScanSnap iX1500",
            category: "Elektronik",
            stock: 4,
            price: 12500000,
            minimumStock: 2,
            description: "Scanner dokumen otomatis dua sisi",
            createdAt: new Date().toISOString()
        },
        {
            id: nextId++,
            name: "Map Folder Plastik",
            category: "Peralatan Kantor",
            stock: 80,
            price: 8000,
            minimumStock: 40,
            description: "Map folder plastik ukuran A4, isi 10 pcs",
            createdAt: new Date().toISOString()
        },
        {
            id: nextId++,
            name: "Toner Printer HP 85A",
            category: "Peralatan Kantor",
            stock: 18,
            price: 450000,
            minimumStock: 10,
            description: "Toner asli untuk printer HP LaserJet series",
            createdAt: new Date().toISOString()
        },
        {
            id: nextId++,
            name: "Webcam Logitech C920",
            category: "Elektronik",
            stock: 12,
            price: 850000,
            minimumStock: 6,
            description: "Webcam HD 1080p dengan mikrofon stereo",
            createdAt: new Date().toISOString()
        },
        {
            id: nextId++,
            name: "Baterai AA Alkaline",
            category: "Elektronik",
            stock: 150,
            price: 12000,
            minimumStock: 75,
            description: "Baterai alkaline ukuran AA, isi 4 pcs per kemasan",
            createdAt: new Date().toISOString()
        },
        {
            id: nextId++,
            name: "Stabilo Boss Highlighter",
            category: "Alat Tulis",
            stock: 60,
            price: 10000,
            minimumStock: 30,
            description: "Highlighter warna kuning, pack isi 3 pcs",
            createdAt: new Date().toISOString()
        },
        {
            id: nextId++,
            name: "Calculator Casio MS-20UC",
            category: "Elektronik",
            stock: 22,
            price: 95000,
            minimumStock: 12,
            description: "Kalkulator kantor dengan display 12 digit",
            createdAt: new Date().toISOString()
        },
        {
            id: nextId++,
            name: "External Harddisk Seagate 2TB",
            category: "Elektronik",
            stock: 7,
            price: 1350000,
            minimumStock: 4,
            description: "Harddisk eksternal USB 3.0, portable",
            createdAt: new Date().toISOString()
        },
        {
            id: nextId++,
            name: "Flashdisk Sandisk 64GB",
            category: "Elektronik",
            stock: 45,
            price: 120000,
            minimumStock: 25,
            description: "Flashdisk USB 3.0, transfer speed hingga 150MB/s",
            createdAt: new Date().toISOString()
        },
        {
            id: nextId++,
            name: "Notebook A5 Hardcover",
            category: "Alat Tulis",
            stock: 35,
            price: 35000,
            minimumStock: 18,
            description: "Notebook hardcover 100 halaman, kertas dotted",
            createdAt: new Date().toISOString()
        },
        {
            id: nextId++,
            name: "Whiteboard Magnetic 120x90cm",
            category: "Peralatan Kantor",
            stock: 5,
            price: 450000,
            minimumStock: 3,
            description: "Whiteboard dengan frame aluminium, termasuk spidol dan penghapus",
            createdAt: new Date().toISOString()
        },
        {
            id: nextId++,
            name: "Paper Clip No. 3",
            category: "Peralatan Kantor",
            stock: 500,
            price: 15000,
            minimumStock: 250,
            description: "Paper clip ukuran standar, isi 100 pcs per kotak",
            createdAt: new Date().toISOString()
        },
        {
            id: nextId++,
            name: "Kabel HDMI 2.0 2m",
            category: "Elektronik",
            stock: 28,
            price: 75000,
            minimumStock: 15,
            description: "Kabel HDMI high speed dengan connector gold plated",
            createdAt: new Date().toISOString()
        },
        {
            id: nextId++,
            name: "Sticky Notes 3M",
            category: "Peralatan Kantor",
            stock: 40,
            price: 25000,
            minimumStock: 20,
            description: "Sticky notes warna-warni, pack isi 5 pads",
            createdAt: new Date().toISOString()
        },
        {
            id: nextId++,
            name: "Router TP-Link Archer C6",
            category: "Elektronik",
            stock: 9,
            price: 650000,
            minimumStock: 5,
            description: "Router dual band AC1200, 4 port LAN",
            createdAt: new Date().toISOString()
        }
    ];
    
    // Tambahkan aktivitas contoh
    const now = new Date();
    
    activities = [
        {
            id: nextActivityId++,
            type: 'add',
            itemName: 'Laptop Dell XPS 13',
            quantity: 10,
            notes: 'Pembelian awal dari supplier resmi',
            timestamp: new Date(now.getTime() - 86400000 * 5).toISOString()
        },
        {
            id: nextActivityId++,
            type: 'out',
            itemName: 'Laptop Dell XPS 13',
            quantity: 2,
            notes: 'Penjualan ke pelanggan PT. Maju Jaya',
            timestamp: new Date(now.getTime() - 86400000 * 4).toISOString()
        },
        {
            id: nextActivityId++,
            type: 'in',
            itemName: 'Mouse Wireless Logitech MX Master 3',
            quantity: 25,
            notes: 'Restok dari supplier elektronik utama',
            timestamp: new Date(now.getTime() - 86400000 * 3).toISOString()
        },
        {
            id: nextActivityId++,
            type: 'out',
            itemName: 'Kertas A4 80gsm SIDU',
            quantity: 3,
            notes: 'Digunakan untuk keperluan administrasi departemen',
            timestamp: new Date(now.getTime() - 86400000 * 2).toISOString()
        },
        {
            id: nextActivityId++,
            type: 'in',
            itemName: 'Bolpoin Pilot G-2 0.7mm',
            quantity: 50,
            notes: 'Pembelian massal untuk stok alat tulis',
            timestamp: new Date(now.getTime() - 86400000).toISOString()
        },
        {
            id: nextActivityId++,
            type: 'out',
            itemName: 'Printer Epson L3210',
            quantity: 1,
            notes: 'Penjualan ke sekolah SMA Negeri 5',
            timestamp: new Date(now.getTime() - 43200000).toISOString()
        },
        {
            id: nextActivityId++,
            type: 'edit',
            itemName: 'Monitor LG 24MK600',
            quantity: 0,
            notes: 'Perubahan harga akibat fluktuasi pasar',
            timestamp: new Date(now.getTime() - 21600000).toISOString()
        }
    ];
    
    saveData();
}